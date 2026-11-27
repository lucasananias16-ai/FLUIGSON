'use strict';
/**
 * Vídeo 20, versão 2 — o Natal no Polo Norte no padrão novo (19/11/2026):
 * começa já no desafio 1 (o pinguim fugindo), sem a abertura parada; a
 * barra "1/12" no alto; reganchos antes do 4 ("surpresa"), do 7 ("metade") e
 * do 12 ("o mais difícil"); e o final com o convite e tempo para a tela final.
 *
 * Uso: node src/v20/video_v2.js [--refazer]
 *
 * As cenas são as mesmas do Vídeo 20; o que muda está em src/anim/padraoNovo.js
 * e nas opções `v2` de criarAchar e criarEncerramento.
 */
const path = require('path');
const cenas = require('./cenas');
const { criarEncerramento } = require('./cenasPontas');
const { montar } = require('../anim/montar');
const { temposPorPausas } = require('../anim/fala');
const { comProgresso, criarRegancho } = require('../anim/padraoNovo');
const noel = require('../art/polo');
const roteiroTexto = require('./roteiro');

const ROOT = path.resolve(__dirname, '..', '..');
const NARR = path.join(ROOT, 'v20-natal-polo-norte', 'narracao');
const BRANCO = '#fff';
const regancho = (nome, id, palavra, n, opts = {}) => (t0) =>
  criarRegancho(Object.assign({ nome, narrDir: NARR, id, palavra, n, fundo: noel.fundoNeve, tGlobal0: t0, tutiOpts: { gorro: true } }, opts));
const comBarra = (n, criar) => (t0) => comProgresso(criar(t0), n);

/** As cenas em ordem; `criar` recebe o instante em que a cena começa no vídeo. */
function roteiro() {
  return [
    { nome: 'd1', criar: comBarra(1, (t0) => cenas.criarAchar({ tGlobal0: t0, saida: BRANCO, v2: true })) },
    { nome: 'd2', criar: comBarra(2, (t0) => cenas.criarContar({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO })) },
    { nome: 'd3', criar: comBarra(3, (t0) => cenas.criarEscolher(3, { tGlobal0: t0, entrada: BRANCO, primeiraOpcao: 2 })) },
    { nome: 'surpresa', criar: regancho('surpresa', 'v20_v2_surpresa', 'SURPRESA!', 4) },
    { nome: 'd4', criar: comBarra(4, (t0) => cenas.criarSombra({ tGlobal0: t0 })) },
    { nome: 'd5', criar: comBarra(5, (t0) => cenas.criarFalta({ tGlobal0: t0, saida: BRANCO })) },
    { nome: 'd6', criar: comBarra(6, (t0) => cenas.criarComparar({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO })) },
    { nome: 'metade', criar: regancho('metade', 'v20_v2_metade', 'METADE!', 7, { entrada: BRANCO }) },
    { nome: 'd7', criar: comBarra(7, (t0) => cenas.criarDiferente({ tGlobal0: t0 })) },
    { nome: 'd8', criar: comBarra(8, (t0) => cenas.criarSequencia({ tGlobal0: t0 })) },
    { nome: 'd9', criar: comBarra(9, (t0) => cenas.criarEscolher(9, { tGlobal0: t0 })) },
    { nome: 'd10', criar: comBarra(10, (t0) => cenas.criarMemoria({ tGlobal0: t0 })) },
    { nome: 'd11', criar: comBarra(11, (t0) => cenas.criarEscolher(11, { tGlobal0: t0 })) },
    { nome: 'ultimo', criar: regancho('ultimo', 'v20_v2_ultimo', 'O MAIS DIFÍCIL!', 12) },
    { nome: 'd12', criar: comBarra(12, (t0) => cenas.criarEscolher(12, { tGlobal0: t0, saida: BRANCO })) },
    { nome: 'encerramento', criar: (t0) => criarEncerramento({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO, v2: true }) },
  ];
}

module.exports = { roteiro };

if (require.main === module) {
  montar({
    nome: 'v20_natal_no_polo_norte_v2',
    pasta: 'v20-natal-polo-norte',
    roteiro: roteiro(),
    trechos: 'trechos-v20v2',
    mapa: 'mapa-do-video_v2.json',
    legendas: { tempos: (arquivo, frases) => temposPorPausas(arquivo, frases, roteiroTexto.cortes[path.basename(arquivo, '.wav')]) },
    args: process.argv.slice(2),
    limite: 0.84,
  }).catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  });
}
