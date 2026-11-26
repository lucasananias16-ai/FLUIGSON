'use strict';
// Teste fim a fim — Liberação de Faturamento Por Medição (ODS, Fluig DEV).
//
// Percorre o caminho que o usuário faz na homologação:
//   1. o PC sincronizado do Protheus aparece no Fluig (dts_getPedidoCompra_JYNX);
//   2. os itens do PC são lidos do Protheus (dts_getPedidosCompra_JYNX);
//   3. o widget procura aprovadores para C. Custo + moeda + valor (dts_consultUsuariosPosicoes)
//      — é aqui que a homologação de 26/11 falhou;
//   4. existe aprovador para o nível 1 (a Aprovação 1, atividade 12, é obrigatória);
//   5. (opcional, E2E_START=1) inicia a solicitação, confere a tarefa na Aprovação 1 e cancela.
//
// Rodar:  node --test tests/e2e/   (variáveis no README)

const test = require('node:test');
const assert = require('node:assert/strict');
const { FluigSoap } = require('./fluig-soap');
const CENARIOS = require('./cenarios');

const env = process.env;

// E2E_PROCESS_ID=liberacao_faturamento_medicao_test usa a cópia de teste (início restrito ao admin).
const PROCESS_ID = env.E2E_PROCESS_ID || 'liberacao_faturamento_medicao';
const APROV_PC_UM = 12;

const fluig = new FluigSoap({
  url: env.FLUIG_URL,
  username: env.FLUIG_USER,
  password: env.FLUIG_PASS,
  companyId: Number(env.FLUIG_COMPANY || 1),
});

// E2E_DATASET_SUFIXO=_test usa as cópias de teste dts_getPedidoCompra_JYNX_test / dts_getPedidoVenda_JYNX_test.
const SUFIXO = env.E2E_DATASET_SUFIXO || '';
const DS_PC = 'dts_getPedidoCompra_JYNX' + SUFIXO;
const DS_PV = 'dts_getPedidoVenda_JYNX' + SUFIXO;

const escolhidos = env.E2E_CENARIO
  ? env.E2E_CENARIO.split(',').map((s) => s.trim())
  : Object.keys(CENARIOS);

function moedaLabel(m) {
  return m === '2' ? 'USD' : 'BRL';
}

// Explica por que a busca de aprovadores voltou vazia, cruzando as duas tabelas que o
// dts_consultUsuariosPosicoes junta: Usuário x Posição (dsUserPosicao) e Alçada por
// Posição (dsConfigAlcadPosic), ligadas por código da posição + subcategoria.
async function diagnosticoAlcada(cc, moeda, total) {
  const usuarios = (await fluig.getDataset('dsUserPosicao')).filter((u) =>
    String(u.txt_codCCusto || '').includes(cc)
  );
  const alcadas = await fluig.getDataset('dsConfigAlcadPosic');
  const campo = moeda === '2' ? 'txt_limitProcUsd' : 'txt_limitProcBrl';
  const num = (s) => Number(String(s || '0').replace(/\./g, '').replace(',', '.')) || 0;
  const norm = (s) => String(s || '').trim().toLowerCase();

  if (usuarios.length === 0) return ['nenhum cadastro em "Atribuição de Usuários e Posições" com C. Custo contendo "' + cc + '"'];

  return usuarios.map((u) => {
    const quem = u.usrPos_colaborador + ' (CC ' + u.txt_codCCusto + ', posição ' + u.txt_codPosicao + ' ' + u.usrPos_posicao + ', subcat. "' + u.usrPos_subCat + '")';
    const mesmaPos = alcadas.filter((a) => a.txt_codPosicao === u.txt_codPosicao);
    if (mesmaPos.length === 0) return quem + ': posição ' + u.txt_codPosicao + ' não tem alçada cadastrada';
    const mesmaSub = mesmaPos.filter((a) => norm(a.txt_subCategoria) === norm(u.usrPos_subCat));
    if (mesmaSub.length === 0) {
      return quem + ': alçada da posição existe só para subcat. ' + mesmaPos.map((a) => '"' + a.txt_subCategoria + '"').join(', ');
    }
    const ok = mesmaSub.filter((a) => /ilimitado|unlimited/i.test(a[campo]) || num(a[campo]) >= total);
    if (ok.length === 0) return quem + ': limite ' + moedaLabel(moeda) + ' ' + mesmaSub.map((a) => a[campo]).join('/') + ' < ' + total;
    return quem + ': atende (nível ' + ok.map((a) => a.txt_sequenceLvl).join('/') + ')';
  });
}

for (const nome of escolhidos) {
  const cen = CENARIOS[nome];
  if (!cen) throw new Error('Cenário desconhecido: ' + nome);
  const { pc } = cen;

  test.describe(nome + ' — ' + cen.descricao, () => {
    let pcRow;

    test('0a. PV sincronizado do Protheus aparece no Fluig', async (t) => {
      const pvs = await fluig.getDataset(DS_PV);
      const pv = pvs.find((r) => String(r.C5_NUM).trim() === pc.pv);
      assert.ok(pv, 'PV ' + pc.pv + ' não está na carga sincronizada do Fluig (rotina agendada parada ou PV fora do filtro incremental por C5_EMISSAO)');
      if (String(pv.C_CUSTO).trim() !== pc.cc) {
        t.diagnostic('atenção: C. Custo do PV (' + pv.C_CUSTO + ' - ' + pv.NOME_CUSTO + ') difere do C. Custo do PC (' + pc.cc + '); a busca de aprovadores usa o do PC');
      }
    });

    test('0b. todo PV sincronizado tem o seu PC na carga sincronizada', async () => {
      const pvs = await fluig.getDataset(DS_PV);
      const pcs = await fluig.getDataset(DS_PC);
      const comPc = new Set(pcs.map((r) => String(r.C7_XNUMPV).trim()));
      // O dts_getPedidoVenda_JYNX só traz PV que tem PC no Protheus (EXISTS em SC7),
      // então PV sem PC aqui significa que a carga de PCs está incompleta.
      const orfaos = pvs.map((r) => String(r.C5_NUM).trim()).filter((n) => !comPc.has(n));
      assert.deepEqual(
        orfaos,
        [],
        'PVs sem PC na carga do Fluig: ' + orfaos.join(', ') + ' — a carga de PCs tem só ' + pcs.length +
          ' linhas (a versão publicada do dts_getPedidoCompra_JYNX guarda apenas as 5 primeiras)'
      );
    });

    test('1. PC sincronizado do Protheus aparece no Fluig com os dados do retorno', async (t) => {
      const rows = await fluig.getDataset(DS_PC, [{ field: 'C7_NUM', value: pc.numero }]);
      pcRow = rows.find((r) => String(r.C7_NUM).trim() === pc.numero);
      assert.ok(pcRow, 'PC ' + pc.numero + ' não veio na carga do Protheus (rotina agendada rodou depois da criação?)');
      assert.equal(String(pcRow.C7_XNUMPV).trim(), pc.pv, 'PC não está amarrado ao PV esperado');
      assert.equal(String(pcRow.C7_CC).trim(), pc.cc, 'C. Custo do PC');
      assert.equal(String(pcRow.C7_MOEDA).trim(), pc.moeda, 'moeda do PC');
      assert.equal(Number(pcRow.C7_TOTAL), pc.total, 'valor total do PC');
      if (pc.moeda !== '1' && Number(pcRow.C7_TXMOEDA) === 0) {
        t.diagnostic('atenção: PC em ' + moedaLabel(pc.moeda) + ' com C7_TXMOEDA = 0 (sem taxa de câmbio gravada no Protheus)');
      }
    });

    test('2. itens do PC são lidos do Protheus', async (t) => {
      const itens = await fluig.getDataset('dts_getPedidosCompra_JYNX', [{ field: 'C7_NUM', value: pc.numero }]);
      const erro = itens.find((i) => String(i.C7_ITEM || '').startsWith('Erro:'));
      assert.ok(!erro, 'integração com o Protheus falhou: ' + (erro && erro.C7_ITEM));
      assert.ok(itens.length > 0, 'PC ' + pc.numero + ' sem itens');
    });

    test('3. existem aprovadores para C. Custo ' + pc.cc + ' com limite para ' + moedaLabel(pc.moeda) + ' ' + pc.total, async (t) => {
      const aprovadores = await fluig.getDataset('dts_consultUsuariosPosicoes', [
        { field: 'COD_CCUSTO', value: pc.cc },
        { field: 'VALOR_LIMITE', value: String(pc.total) },
        { field: 'MOEDA', value: pc.moeda },
        { field: 'TIPO_LIMITE', value: 'PROC' },
      ]);
      if (aprovadores.length === 0) {
        const motivos = await diagnosticoAlcada(pc.cc, pc.moeda, pc.total);
        motivos.forEach((m) => t.diagnostic(m));
        assert.fail(
          'Não foram encontrados aprovadores parametrizados para o C. Custo ' + pc.cc +
            ' com limite suficiente para o valor de ' + moedaLabel(pc.moeda) + ' ' + pc.total +
            '\n  ' + motivos.join('\n  ')
        );
      }
      aprovadores.forEach((a) =>
        t.diagnostic('aprovador: ' + a.usrPos_colaborador + ' — nível ' + a.txt_sequenceLvl + ' — ativo: ' + a.usrPos_status)
      );
    });

    test('4. existe aprovador para o nível 1 (Aprovação 1 é obrigatória)', async (t) => {
      const nivel1 = await fluig.getDataset('dts_consultUsuariosPosicoes', [
        { field: 'COD_CCUSTO', value: pc.cc },
        { field: 'NIVEL', value: '1' },
        { field: 'VALOR_LIMITE', value: String(pc.total) },
        { field: 'MOEDA', value: pc.moeda },
        { field: 'TIPO_LIMITE', value: 'PROC' },
      ]);
      assert.ok(
        nivel1.length > 0,
        'nenhum aprovador de nível 1 para C. Custo ' + pc.cc + ' / ' + moedaLabel(pc.moeda) + ' ' + pc.total +
          ' — a solicitação pararia na Aprovação 1 (atividade ' + APROV_PC_UM + ')'
      );
    });

    test('5. inicia a solicitação e ela chega à Aprovação 1 com responsável', { skip: env.E2E_START !== '1' && 'defina E2E_START=1 para criar (e cancelar) uma solicitação real' }, async (t) => {
      const num = await fluig.startProcess({
        processId: PROCESS_ID,
        choosedState: APROV_PC_UM,
        comments: 'Teste E2E — cenário ' + nome + ' — processo ' + PROCESS_ID,
        cardData: {
          num_dadosPc_numPc: pc.numero,
          txt_idPv_numPv: pc.pv,
          hd_codCCusto: pc.cc,
          txt_dadosPc_cc: pc.cc,
          txt_dadosPc_moeda: pc.moeda,
          txt_valTotalPc: String(pc.total),
        },
      });
      t.diagnostic('solicitação criada: ' + num);
      try {
        const tarefas = await fluig.getDataset('processTask', [
          { field: 'processTaskPK.processInstanceId', value: String(num) },
          { field: 'active', value: 'true' },
        ]);
        const responsaveis = tarefas.map((x) => x['processTaskPK.colleagueId']).filter(Boolean);
        t.diagnostic('responsáveis na tarefa ativa: ' + (responsaveis.join(', ') || '(nenhum)'));
        assert.ok(responsaveis.length > 0, 'solicitação ' + num + ' ficou sem responsável na Aprovação 1');
        assert.ok(
          responsaveis.some((r) => !/^System:/i.test(r)),
          'Aprovação 1 atribuída só a usuário de sistema (' + responsaveis.join(', ') + '), não aos aprovadores da alçada'
        );
        // Quem recebeu a Aprovação 1 precisa ser aprovador de nível 1 da alçada (C. Custo + moeda + valor).
        const nivel1 = await fluig.getDataset('dts_consultUsuariosPosicoes', [
          { field: 'COD_CCUSTO', value: pc.cc },
          { field: 'NIVEL', value: '1' },
          { field: 'VALOR_LIMITE', value: String(pc.total) },
          { field: 'MOEDA', value: pc.moeda },
          { field: 'TIPO_LIMITE', value: 'PROC' },
        ]);
        const esperados = new Set();
        for (const a of nivel1) {
          const email = String(a.usrPos_email || a.EMAIL || '').trim();
          if (!email) continue;
          const col = await fluig.getDataset('colleague', [{ field: 'mail', value: email }]);
          col.forEach((c) => esperados.add(c['colleaguePK.colleagueId']));
        }
        const foraDaAlcada = responsaveis.filter((r) => !esperados.has(r));
        assert.deepEqual(
          foraDaAlcada,
          [],
          'Aprovação 1 atribuída a quem não é aprovador de nível 1 da alçada: ' + foraDaAlcada.join(', ') +
            ' (aprovadores esperados: ' + ([...esperados].join(', ') || 'nenhum parametrizado') + ')'
        );
      } finally {
        if (env.E2E_KEEP !== '1') await fluig.cancelInstance(num).catch((e) => t.diagnostic('falha ao cancelar ' + num + ': ' + e.message));
      }
    });
  });
}
