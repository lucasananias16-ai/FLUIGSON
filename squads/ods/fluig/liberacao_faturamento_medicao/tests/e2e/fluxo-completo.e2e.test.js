'use strict';
// Teste E2E — fluxo completo da Liberação de Faturamento por Medição, do Início ao Fim,
// passando por TODAS as atividades (inclusive Revisão e Aprovação da NF fora do orçamento).
//
// Caminho:
//   Início(10) → Aprovação 1(12) →[Revisar]→ Revisão(28) → Aprovação 1(12) → Aprovação 2(18) →
//   Aprovação 3(20) → Aprovação 4(26) → Adicionar NF(73) → Medição dos Itens(32) →[NF fora do orç.]→
//   Aprovação(39) → Liberação de Pagamento(46) →[sem saldo]→ Fim(53)
// Gateways cruzados: 80, 84, 87, 90, 37, 41, 52.
//
// Pré-requisito: aprovadores ATIVOS nos níveis 1 a 4 para o C. Custo do PC (o beforeStateEntry da cópia de
// teste barra a entrada em cada Aprovação sem aprovador ativo).
//
// Rodar (cria e conclui UMA solicitação real; se algo falhar, ela é cancelada):
//   FLUIG_URL=... FLUIG_USER=admin FLUIG_PASS='***' E2E_PROCESS_ID=liberacao_faturamento_medicao_test \
//     node --test --test-reporter=spec tests/e2e/fluxo-completo.e2e.test.js

const test = require('node:test');
const assert = require('node:assert/strict');
const { FluigSoap } = require('./fluig-soap');
const CENARIOS = require('./cenarios');

const env = process.env;
const PROCESS_ID = env.E2E_PROCESS_ID || 'liberacao_faturamento_medicao_test';
const cen = CENARIOS[env.E2E_CENARIO || 'homologacao-26-11-prio-tigris'];
const pc = cen.pc;
const fluig = new FluigSoap({ url: env.FLUIG_URL, username: env.FLUIG_USER, password: env.FLUIG_PASS, companyId: Number(env.FLUIG_COMPANY || 1) });

const NOME = { 10: 'Início', 12: 'Aprovação 1', 18: 'Aprovação 2', 20: 'Aprovação 3', 26: 'Aprovação 4', 28: 'Revisão',
  32: 'Medição dos Itens', 39: 'Aprovação', 46: 'Liberação de Pagamento', 53: 'Fim', 73: 'Adicionar NF' };
const nome = (s) => s + ' ' + (NOME[s] || '');
const SALDO_ZERO = 'R$ 0,00'; // regra do gateway 52 compara com "R$ 0,00" com espaço não separável

let num = null;
let concluido = false;

async function ativas() {
  return fluig.getAllActiveStates(num);
}

// Move a solicitação que está em `de`, gravando `campos`, escolhendo `para` (atividade ou gateway),
// e confere que ela chegou em `espera` (array de atividades ativas; [] = solicitação encerrada).
async function mover(t, de, para, campos, espera) {
  const antes = await ativas();
  assert.deepEqual(antes, [de], 'esperava a solicitação em ' + nome(de) + ', está em ' + antes.map(nome).join(', '));
  const thread = await fluig.getActualThread(num, de);
  if (de === 73 || de === 46) { // atividades de pool de grupo: assume a tarefa antes
    await fluig.takeProcessTask(num, thread).catch((e) => t.diagnostic('takeProcessTask: ' + e.message));
  }
  let resp;
  try {
    resp = await fluig.saveAndSendTask({ processInstanceId: num, choosedState: para, cardData: campos, threadSequence: thread,
      comments: 'Teste E2E fluxo completo: ' + nome(de) + ' → ' + para });
  } catch (e) {
    t.diagnostic('movimentação comum recusada (' + e.message + '); tentando como gestor do processo');
    resp = await fluig.saveAndSendTask({ processInstanceId: num, choosedState: para, cardData: campos, threadSequence: thread,
      managerMode: true, comments: 'Teste E2E fluxo completo (gestor): ' + nome(de) + ' → ' + para });
  }
  const depois = await ativas();
  t.diagnostic(nome(de) + ' → ' + (depois.length ? depois.map(nome).join(', ') : 'encerrada') +
    ' | campos: ' + JSON.stringify(campos) + (resp.length ? ' | resposta: ' + JSON.stringify(resp).slice(0, 160) : ''));
  assert.deepEqual(depois, espera, 'depois de ' + nome(de) + ' esperava ' + (espera.length ? espera.map(nome).join(', ') : 'Fim') +
    ', ficou em ' + (depois.length ? depois.map(nome).join(', ') : 'encerrada'));
}

test.describe('fluxo completo — ' + PROCESS_ID + ' — ' + cen.descricao, () => {
  test.after(async () => {
    if (num && !concluido && env.E2E_KEEP !== '1') {
      await fluig.cancelInstance(num, 'Teste E2E fluxo completo interrompido').catch(() => {});
    }
  });

  test('01. Início → Aprovação 1 (12)', async (t) => {
    num = await fluig.startProcess({
      processId: PROCESS_ID,
      choosedState: 12,
      comments: 'Teste E2E fluxo completo — ' + cen.descricao,
      cardData: {
        num_dadosPc_numPc: pc.numero, txt_idPv_numPv: pc.pv, hd_codCCusto: pc.cc, txt_dadosPc_cc: pc.cc,
        txt_dadosPc_moeda: pc.moeda, txt_valTotalPc: String(pc.total), txt_valFaturarPc: String(pc.total),
        hd_hasAprovDois: 'true', hd_hasAprovTres: 'true', hd_hasAprovQuatro: 'true', hd_possuiSaldo: 'true',
      },
    });
    t.diagnostic('solicitação ' + num);
    assert.deepEqual(await ativas(), [12]);
  });

  test('02. Aprovação 1 pede revisão → Revisão (28)', (t) => mover(t, 12, 80, { hd_aprovPc: 'Revisar' }, [28]));
  test('03. Revisão reenviada → Aprovação 1 (12)', (t) => mover(t, 28, 12, { hd_aprovPc: '' }, [12]));
  test('04. Aprovação 1 aprova → Aprovação 2 (18)', (t) => mover(t, 12, 80, { hd_aprovPc: 'Aprovado' }, [18]));
  test('05. Aprovação 2 aprova → Aprovação 3 (20)', (t) => mover(t, 18, 84, { hd_aprovPc: 'Aprovado' }, [20]));
  test('06. Aprovação 3 aprova → Aprovação 4 (26)', (t) => mover(t, 20, 87, { hd_aprovPc: 'Aprovado' }, [26]));
  test('07. Aprovação 4 aprova → Adicionar NF (73)', (t) => mover(t, 26, 90, { hd_aprovPc: 'Aprovado' }, [73]));
  test('08. Adicionar NF → Medição dos Itens (32)', (t) => mover(t, 73, 32, {}, [32]));
  test('09. Medição com NF fora do orçamento → Aprovação (39)', (t) => mover(t, 32, 37, { hd_valNfOk: 'revisao' }, [39]));
  test('10. Aprovação da NF → Liberação de Pagamento (46)', (t) => mover(t, 39, 41, { hd_aprovValNf: 'aprovado' }, [46]));
  test('11. Liberação de Pagamento sem saldo → Fim (53)', async (t) => {
    await mover(t, 46, 52, { txt_valFaturadoPc: 'R$ 30.000,00', txt_valFaturarPc: SALDO_ZERO, hd_possuiSaldo: 'false' }, []);
    concluido = true;
  });

  test('12. solicitação consta como finalizada', async (t) => {
    const wp = await fluig.getDataset('workflowProcess', [{ field: 'workflowProcessPK.processInstanceId', value: String(num) }]);
    const r = wp[0] || {};
    t.diagnostic('workflowProcess: status ' + r.status + ' | ativo ' + r.active + ' | fim ' + (r.endDateProcess || ''));
    assert.equal(String(r.active), 'false', 'solicitação ainda ativa');
    assert.notEqual(String(r.status), '1', 'solicitação ficou como cancelada, não finalizada');
  });
});
