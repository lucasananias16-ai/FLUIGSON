'use strict';
// Teste E2E — fluxo completo da Liberação de Faturamento por Medição, do Início ao Fim, passando por TODAS
// as atividades, com o formulário preenchido como o widget preenche e as regras obrigatórias.
//
// Caminho:
//   Início(10) → Aprovação 1(12) →[Revisar]→ Revisão(28) → Aprovação 1(12) → Aprovação 2(18) → Aprovação 3(20) →
//   Aprovação 4(26) → Adicionar NF(73) → Medição dos Itens(32) →[NF fora do orçamento]→ Aprovação da NF(39) →
//   Liberação de Pagamento(46) →[sem saldo]→ Fim(53)
// Gateways cruzados: 80, 84, 87, 90, 37, 41, 52.
//
// Regras conferidas (o servidor tem que barrar): revisão sem comentário, Revisão sem comentário, Adicionar NF sem
// anexo DA ETAPA (uma NF anexada antes, na Aprovação 4, não pode valer), Medição sem item medido. No Fim, o histórico (tb_obsHistorico) tem que ter uma linha por etapa.
//
// Pré-requisitos: versão 7 da cópia de teste (regra do anexo da etapa 73); antes, versão 3 (beforeTaskSave com regras/histórico; Medição e Aprovação da NF com
// responsável) e aprovadores ATIVOS nos níveis 1 a 4 para o C. Custo do PC.
//
//   FLUIG_URL=... FLUIG_USER=admin FLUIG_PASS='***' E2E_PROCESS_ID=liberacao_faturamento_medicao_test \
//     node --test --test-reporter=spec tests/e2e/fluxo-completo.e2e.test.js

const test = require('node:test');
const assert = require('node:assert/strict');
const { FluigSoap } = require('./fluig-soap');
const CENARIOS = require('./cenarios');

const env = process.env;
const PROCESS_ID = env.E2E_PROCESS_ID || 'liberacao_faturamento_medicao_test';
const SUFIXO = env.E2E_DATASET_SUFIXO === undefined ? '_test' : env.E2E_DATASET_SUFIXO;
const cen = CENARIOS[env.E2E_CENARIO || 'homologacao-26-11-prio-tigris'];
const pc = cen.pc;
const fluig = new FluigSoap({ url: env.FLUIG_URL, username: env.FLUIG_USER, password: env.FLUIG_PASS, companyId: Number(env.FLUIG_COMPANY || 1) });

const NOME = { 0: 'Início', 10: 'Início', 12: 'Aprovação 1', 18: 'Aprovação 2', 20: 'Aprovação 3', 26: 'Aprovação 4',
  28: 'Revisão', 32: 'Medição dos Itens', 39: 'Aprovação da NF', 46: 'Liberação de Pagamento', 53: 'Fim', 73: 'Adicionar NF' };
const nome = (s) => s + ' ' + (NOME[s] || '');
const brl = (n) => 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const NF_PDF = Buffer.from('%PDF-1.4\n% NF de teste E2E\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n').toString('base64');

let num = null;
let concluido = false;
let cardInicial = {};

const ativas = () => fluig.getAllActiveStates(num);

// Envia a solicitação que está em `de` com os `campos` alterados (sobre o formulário ATUAL do servidor, para não
// apagar o histórico), para `para`, e confere que ela chegou em `espera` ([] = encerrada).
async function enviar(t, de, para, campos, espera, extra = {}) {
  assert.deepEqual(await ativas(), [de], 'esperava a solicitação em ' + nome(de));
  const atual = await fluig.getInstanceCardData(num);
  const card = Object.assign({}, atual, campos);
  const thread = await fluig.getActualThread(num, de);
  if (de === 73 || de === 46 || de === 39) await fluig.takeProcessTask(num, thread).catch(() => {});
  await fluig.saveAndSendTask(Object.assign({ processInstanceId: num, choosedState: para, cardData: card, threadSequence: thread,
    comments: 'Teste E2E: ' + nome(de) }, extra));
  const depois = await ativas();
  t.diagnostic(nome(de) + ' → ' + (depois.length ? depois.map(nome).join(', ') : 'Fim') + ' | ' + JSON.stringify(campos).slice(0, 140));
  assert.deepEqual(depois, espera, 'depois de ' + nome(de) + ' esperava ' + (espera.length ? espera.map(nome).join(', ') : 'Fim'));
}

// Tenta enviar algo inválido: o servidor tem que recusar e a solicitação tem que continuar em `de`.
async function deveBarrar(t, de, para, campos, trechoMsg) {
  const atual = await fluig.getInstanceCardData(num);
  const thread = await fluig.getActualThread(num, de);
  if (de === 73 || de === 46 || de === 39) await fluig.takeProcessTask(num, thread).catch(() => {});
  let msg = null;
  try {
    await fluig.saveAndSendTask({ processInstanceId: num, choosedState: para, cardData: Object.assign({}, atual, campos), threadSequence: thread,
      comments: 'Teste E2E (envio inválido de propósito)' });
  } catch (e) { msg = e.message; }
  t.diagnostic('barrado: ' + (msg || '(não barrou)').slice(0, 200));
  assert.ok(msg && msg.includes(trechoMsg), 'o Fluig deveria recusar com "' + trechoMsg + '"');
  assert.deepEqual(await ativas(), [de], 'a solicitação não podia ter saído de ' + nome(de));
}

test.describe('fluxo completo — ' + PROCESS_ID + ' — ' + cen.descricao, () => {
  test.after(async () => {
    if (num && !concluido && env.E2E_KEEP !== '1') await fluig.cancelInstance(num, 'Teste E2E fluxo completo interrompido').catch(() => {});
  });

  test('00. monta o formulário como o widget (PV, PC, itens e solicitante)', async (t) => {
    const pvs = await fluig.getDataset('dts_getPedidoVenda_JYNX' + SUFIXO);
    const pv = pvs.find((r) => String(r.C5_NUM).trim() === pc.pv) || {};
    const pcs = await fluig.getDataset('dts_getPedidoCompra_JYNX' + SUFIXO);
    const p = pcs.find((r) => String(r.C7_NUM).trim() === pc.numero) || {};
    const itens = await fluig.getDataset('dts_getPedidosCompra_JYNX', [{ field: 'C7_NUM', value: pc.numero }]);
    const eu = (await fluig.getDataset('colleague', [{ field: 'colleaguePK.colleagueId', value: env.FLUIG_USER }]))[0] || {};
    const hoje = new Date().toLocaleDateString('pt-BR');
    const emis = String(pv.C5_EMISSAO || '');
    cardInicial = {
      txt_infoSol_solic: eu.colleagueName || env.FLUIG_USER, txt_infoSol_email: eu.mail || '', txt_infoSol_matric: env.FLUIG_USER,
      txt_infoSol_status: 'Ativo', txt_infoSol_area: 'Teste E2E', txt_dtSolic: hoje,
      txt_idPv_numPv: pc.pv, txt_idPv_cliente: pv.A1_NOME || '', txt_idPv_cnpj: pv.CNPJ_CLIENTE || '', txt_idPv_vend: pv.NOME_VEND2 || '',
      dt_idPv_emiss: emis.length === 8 ? emis.slice(6) + '/' + emis.slice(4, 6) + '/' + emis.slice(0, 4) : emis,
      txt_idPv_proj: (pv.C_CUSTO || '') + ' - ' + (pv.NOME_CUSTO || ''), txt_idPv_valTot: brl(pv.VLR_TOTAL || 0),
      num_dadosPc_numPc: pc.numero, txt_dadosPc_forn: p.C7_FORNECE || '', txt_dadosPc_cc: pc.cc, hd_codCCusto: pc.cc,
      txt_dadosPc_moeda: pc.moeda, txt_valTotalPc: String(pc.total), txt_valFaturadoPc: brl(0), txt_valFaturarPc: brl(pc.total),
      hd_possuiSaldo: 'true',
      // o main.js marcaria os níveis 2–4 com C. Custo/valor fixos; o beforeTaskSave tem que recalcular no servidor
      hd_hasAprovDois: 'false', hd_hasAprovTres: 'false', hd_hasAprovQuatro: 'false',
    };
    itens.forEach((it, i) => {
      const n = i + 1;
      Object.assign(cardInicial, {
        ['txt_pedido_codItem___' + n]: it.C7_PRODUTO, ['txt_pedido_desc___' + n]: it.B1_DESC, ['txt_pedido_status___' + n]: 'Pendente',
        ['num_pedido_qtd___' + n]: it.C7_QUANT, ['txt_pedido_unid___' + n]: it.C7_UM, ['num_pedido_vlUnit___' + n]: it.C7_PRECO,
        ['num_pedido_vlTot___' + n]: it.C7_TOTAL, ['hd_itemMedido___' + n]: 'false', ['hd_itemFaturado___' + n]: 'false',
      });
    });
    t.diagnostic('PV ' + pc.pv + ' (' + (pv.A1_NOME || '?') + ') | PC ' + pc.numero + ' | itens: ' + itens.length + ' | solicitante: ' + cardInicial.txt_infoSol_solic);
    assert.ok(pv.C5_NUM && p.C7_NUM && itens.length > 0, 'PV, PC e itens precisam vir dos datasets');
  });

  test('01. Início → Aprovação 1 (abertura registrada no histórico)', async (t) => {
    num = await fluig.startProcess({ processId: PROCESS_ID, choosedState: 12, cardData: cardInicial,
      comments: 'Teste E2E fluxo completo — ' + cen.descricao });
    t.diagnostic('solicitação ' + num);
    assert.deepEqual(await ativas(), [12]);
  });

  test('02. Aprovação 1 — revisão SEM comentário é barrada', (t) => deveBarrar(t, 12, 80, { hd_aprovPc: 'Revisar', txt_obsGeral: '' }, 'comentário'));
  test('03. Aprovação 1 pede revisão com comentário → Revisão', (t) =>
    enviar(t, 12, 80, { hd_aprovPc: 'Revisar', txt_obsGeral: 'Conferir o valor do PC com o contrato.' }, [28]));
  test('04. Revisão SEM comentário é barrada', (t) => deveBarrar(t, 28, 12, { hd_aprovPc: '', txt_obsGeral: '' }, 'Revisão'));
  test('05. Revisão com comentário → Aprovação 1', (t) =>
    enviar(t, 28, 12, { hd_aprovPc: '', txt_obsGeral: 'Valor conferido: confere com o contrato.' }, [12]));
  test('06. Aprovação 1 aprova → Aprovação 2 (níveis recalculados no servidor)', (t) =>
    enviar(t, 12, 80, { hd_aprovPc: 'Aprovado', txt_obsGeral: 'De acordo.' }, [18]));
  test('07. Aprovação 2 aprova → Aprovação 3', (t) => enviar(t, 18, 84, { hd_aprovPc: 'Aprovado', txt_obsGeral: '' }, [20]));
  test('08. Aprovação 3 aprova → Aprovação 4', (t) => enviar(t, 20, 87, { hd_aprovPc: 'Aprovado', txt_obsGeral: '' }, [26]));
  // A Aprovação 4 já deixa um PDF anexado: simula a NF incluída fora da etapa Adicionar NF.
  test('09. Aprovação 4 aprova (com um PDF anexado antes da hora) → Adicionar NF', (t) =>
    enviar(t, 26, 90, { hd_aprovPc: 'Aprovado', txt_obsGeral: '' }, [73],
      { anexos: [{ fileName: 'NF-antecipada-e2e.pdf', contentBase64: NF_PDF, description: 'NF antecipada E2E' }] }));
  test('10. Adicionar NF SEM anexo nesta etapa é barrado (o anexo da Aprovação 4 não vale)', (t) =>
    deveBarrar(t, 73, 32, {}, 'anexo da Nota Fiscal incluído por você nesta etapa'));
  test('11. Adicionar NF com a NF anexada → Medição dos Itens', (t) =>
    enviar(t, 73, 32, { txt_obsGeral: 'NF 12345 anexada.' }, [32], { anexos: [{ fileName: 'NF-teste-e2e.pdf', contentBase64: NF_PDF, description: 'NF teste E2E' }] }));
  test('12. Medição SEM item medido é barrada', (t) => deveBarrar(t, 32, 37, { hd_valNfOk: 'aprovado' }, 'item medido'));
  test('13. Medição com item medido e NF fora do orçamento → Aprovação da NF', (t) =>
    enviar(t, 32, 37, { hd_valNfOk: 'revisao', hd_itemMedido___1: 'true', txt_pedido_status___1: 'Medido',
      txt_pedido_obs___1: 'Medição conferida em campo.', txt_obsGeral: 'Valor da NF acima do orçado; enviar para aprovação.' }, [39]));
  test('14. Aprovação da NF aprova → Liberação de Pagamento', (t) =>
    enviar(t, 39, 41, { hd_aprovValNf: 'aprovado', txt_obsGeral: 'Diferença justificada pelo reajuste.' }, [46]));
  test('15. Liberação de Pagamento sem saldo → Fim', async (t) => {
    await enviar(t, 46, 52, { hd_itemFaturado___1: 'true', txt_pedido_status___1: 'Liberado P/ Pagar', txt_pedido_obsFatu___1: 'Pagamento liberado.',
      txt_valFaturadoPc: brl(pc.total), txt_valFaturarPc: brl(0), hd_possuiSaldo: 'false', txt_obsGeral: 'Pagamento liberado.' }, []);
    concluido = true;
  });

  test('16. solicitação finalizada, com formulário preenchido e histórico completo', async (t) => {
    const wp = (await fluig.getDataset('workflowProcess', [{ field: 'workflowProcessPK.processInstanceId', value: String(num) }]))[0] || {};
    assert.equal(String(wp.active), 'false', 'solicitação ainda ativa');
    assert.equal(String(wp.status), '2', 'solicitação não ficou como finalizada');
    const card = await fluig.getInstanceCardData(num);
    const hist = Object.keys(card).filter((k) => /^txt_obs_etapa___\d+$/.test(k))
      .map((k) => k.split('___')[1]).sort((a, b) => a - b)
      .map((n) => card['txt_obs_etapa___' + n] + ' | ' + card['txt_obs_dtHr___' + n] + ' | ' + card['txt_obs_comment___' + n]);
    hist.forEach((h) => t.diagnostic('histórico: ' + h));
    for (const c of ['txt_infoSol_solic', 'txt_idPv_cliente', 'num_dadosPc_numPc', 'txt_pedido_codItem___1']) {
      assert.ok(String(card[c] || '').trim() !== '', 'campo vazio no formulário final: ' + c);
    }
    const etapas = ['Abertura', 'Aprovação 1', 'Revisão', 'Aprovação 2', 'Aprovação 3', 'Aprovação 4', 'Adicionar NF', 'Medição dos Itens',
      'Aprovação da NF', 'Liberação de Pagamento'];
    for (const e of etapas) assert.ok(hist.some((h) => h.startsWith(e + ' |')), 'histórico sem a etapa ' + e);
    assert.ok(hist.some((h) => h.includes('Revisão solicitada: Conferir o valor')), 'histórico sem o comentário da revisão');
    const linhaNf = hist.find((h) => h.startsWith('Adicionar NF |')) || '';
    assert.ok(linhaNf.includes('NF teste E2E') && !linhaNf.includes('NF antecipada'), 'histórico da Adicionar NF devia citar só a NF da etapa: ' + linhaNf);
  });
});
