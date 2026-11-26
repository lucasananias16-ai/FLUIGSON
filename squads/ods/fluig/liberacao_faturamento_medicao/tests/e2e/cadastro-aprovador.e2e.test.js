'use strict';
// Teste E2E (só leitura) — cadastro de aprovador em "Atribuição de Usuários e Posições".
//
// Reproduz a tentativa da homologação de 26/11/2026 (print + áudio 6): cadastrar
// Ludmila Oliveira na posição ANL. CONTABIL JR, C. Custo FLU1G202 - REAL. A tela recusa com
// "Faltou preencher os seguintes campos: Mat. Colaborador, Departamento, Cód. Departamento".
//
// Também calcula, sem gravar nada, se esse cadastro (se fosse salvo) faria a Ludmila
// aprovar o PC I82810 (USD 30.000, C. Custo FLU1G).
//
// Rodar:  node --test tests/e2e/cadastro-aprovador.e2e.test.js   (mesmas variáveis do README)

const test = require('node:test');
const assert = require('node:assert/strict');
const { FluigSoap } = require('./fluig-soap');

const env = process.env;
const fluig = new FluigSoap({
  url: env.FLUIG_URL,
  username: env.FLUIG_USER,
  password: env.FLUIG_PASS,
  companyId: Number(env.FLUIG_COMPANY || 1),
});

// Parâmetros exatamente como no print da homologação.
const CADASTRO = {
  colaborador: 'Ludmila Oliveira',
  email: 'l.oliveira@odsenergysolutions.com',
  posicao: 'ANL. CONTABIL JR',
  ccusto: 'FLU1G202',
  ccustoDesc: 'REAL',
  ativo: 'Não',
};
// Pedido que a ODS queria aprovar.
const PC = { numero: 'I82810', cc: 'FLU1G', moeda: '2', total: 30000 };

// Colunas que a tela de atribuição precisa receber da busca do colaborador.
const COLUNAS_EXIGIDAS = {
  'Mat. Colaborador': ['MATRICULA'],
  'Cód. Departamento': ['DEPARTAMENTO_COD'],
  Departamento: ['DEPARTAMENTO_DESC'],
};

const num = (s) => Number(String(s || '0').replace(/\./g, '').replace(',', '.')) || 0;
const norm = (s) => String(s || '').trim().toLowerCase();

test.describe('cadastro de aprovador — Ludmila / ANL. CONTABIL JR / FLU1G202 (homologação 26/11)', () => {
  let colab;

  test('A. a colaboradora é encontrada na busca do Protheus (dts_getColabProtheus_JYNX)', async (t) => {
    const rows = await fluig.getDataset('dts_getColabProtheus_JYNX');
    colab = rows.find((r) => norm(r.EMAIL) === norm(CADASTRO.email)) ||
            rows.find((r) => norm(r.NOME) === norm(CADASTRO.colaborador));
    assert.ok(colab, CADASTRO.colaborador + ' não veio na busca de colaboradores do Protheus');
    t.diagnostic('colunas devolvidas: ' + Object.keys(colab).join(', '));
    t.diagnostic('registro: ' + JSON.stringify(colab));
  });

  test('B. a busca devolve os campos que a tela exige (matrícula, cód. departamento, departamento)', async () => {
    assert.ok(colab, 'depende da etapa A');
    const faltando = Object.entries(COLUNAS_EXIGIDAS)
      .filter(([, cols]) => !cols.some((c) => colab[c] !== undefined && String(colab[c]).trim() !== ''))
      .map(([rotulo, cols]) => rotulo + ' (coluna ' + cols.join('/') + ')');
    assert.deepEqual(
      faltando,
      [],
      'Faltou preencher os seguintes campos: ' + faltando.join(', ') +
        ' — a versão publicada do dts_getColabProtheus_JYNX lê SYS_USR (usuários) e não devolve essas colunas;' +
        ' a versão anterior lia SRA (funcionários) com MATRICULA/DEPARTAMENTO_COD/DEPARTAMENTO_DESC'
    );
  });

  test('C. se o cadastro fosse salvo, a Ludmila aprovaria o PC ' + PC.numero + ' na Aprovação 1?', async (t) => {
    const alcadas = await fluig.getDataset('dsConfigAlcadPosic');
    const daPosicao = alcadas.filter((a) => norm(a.txt_posicao) === norm(CADASTRO.posicao));
    assert.ok(daPosicao.length > 0, 'a posição ' + CADASTRO.posicao + ' não tem alçada cadastrada');

    const campo = PC.moeda === '2' ? 'txt_limitProcUsd' : 'txt_limitProcBrl';
    const problemas = [];
    for (const a of daPosicao) {
      t.diagnostic('alçada: código ' + a.txt_codPosicao + ' | nível ' + a.txt_sequenceLvl + ' | subcat. "' +
        a.txt_subCategoria + '" | limite ' + campo + ' ' + a[campo]);
      if (a.txt_sequenceLvl !== '1') problemas.push('a posição é de nível ' + a.txt_sequenceLvl + ', não de nível 1');
      if (num(a[campo]) < PC.total) problemas.push('limite ' + a[campo] + ' < ' + PC.total);
      if (/^\s|\s$/.test(a.txt_subCategoria || '')) problemas.push('subcategoria da alçada com espaço: "' + a.txt_subCategoria + '"');
      if (!/^\d{3}$/.test(a.txt_codPosicao || '')) problemas.push('código da posição fora do padrão de 3 dígitos: ' + a.txt_codPosicao);
    }
    if (CADASTRO.ativo !== 'Sim') problemas.push('cadastro com Ativo = "' + CADASTRO.ativo + '" (o processo de teste exige ativo)');
    if (CADASTRO.ccusto !== PC.cc) {
      t.diagnostic('C. Custo do cadastro (' + CADASTRO.ccusto + ') ≠ C. Custo do PC (' + PC.cc + '): só "casa" por causa do LIKE \'%' + PC.cc + '%\' do dataset');
    }
    assert.deepEqual([...new Set(problemas)], [], 'com esses parâmetros a Ludmila NÃO aprovaria a Aprovação 1');
  });
});
