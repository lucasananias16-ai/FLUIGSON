'use strict';
/**
 * Vídeo 2 — monta o vídeo inteiro: abertura, os 8 desafios e o encerramento,
 * com narração, efeitos e trilha, mais o arquivo de legendas.
 *
 * Uso: node src/v2/video.js [--refazer]
 *
 * A montagem em si está em src/anim/montar.js. O céu fecha e abre (um véu
 * azul) sempre que o cenário muda; do desafio 5 ao 8 o fundo é o mesmo e as
 * cenas emendam direto.
 */
const cenas = require('./cenas');
const { criarAbertura, criarEncerramento } = require('./cenasPontas');
const { montar } = require('../anim/montar');
const { temposPorPausas } = require('../anim/fala');

const CEU = '#BDE5FF';

/** As cenas em ordem; `criar` recebe o instante em que a cena começa no vídeo. */
function roteiro() {
  return [
    { nome: 'abertura', criar: (t0) => criarAbertura({ tGlobal0: t0 }) },
    { nome: 'd1', criar: (t0) => cenas.criarAchar({ tGlobal0: t0, entrada: CEU, saida: CEU }) },
    { nome: 'd2', criar: (t0) => cenas.criarContar({ tGlobal0: t0, entrada: CEU, saida: CEU }) },
    { nome: 'd3', criar: (t0) => cenas.criarSombra({ tGlobal0: t0, entrada: CEU, saida: CEU }) },
    { nome: 'd4', criar: (t0) => cenas.criarComparar({ tGlobal0: t0, entrada: CEU, saida: CEU }) },
    { nome: 'd5', criar: (t0) => cenas.criarEscolher(5, { tGlobal0: t0, entrada: CEU }) },
    { nome: 'd6', criar: (t0) => cenas.criarEscolher(6, { tGlobal0: t0 }) },
    { nome: 'd7', criar: (t0) => cenas.criarMemoria({ tGlobal0: t0 }) },
    { nome: 'd8', criar: (t0) => cenas.criarEscolher(8, { tGlobal0: t0, saida: CEU }) },
    { nome: 'encerramento', criar: (t0) => criarEncerramento({ tGlobal0: t0 }) },
  ];
}

module.exports = { roteiro };

if (require.main === module) {
  montar({
    nome: 'v2_desafios_de_davi_e_golias',
    pasta: 'v2-davi-e-golias',
    roteiro: roteiro(),
    trechos: 'trechos-v2',
    legendas: { tempos: temposPorPausas },
    args: process.argv.slice(2),
  }).catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  });
}
