'use strict';
/**
 * Vídeo 4 — monta o vídeo inteiro: abertura, os 8 desafios e o encerramento,
 * com narração, efeitos e trilha, mais o arquivo de legendas.
 *
 * Uso: node src/v4/video.js [--refazer]
 *
 * A montagem em si está em src/anim/montar.js. Um véu da mesma cor fecha uma
 * cena e abre a seguinte sempre que o cenário muda; nos desafios 3 e 4 (e do 6
 * ao 8) o fundo é o mesmo e as cenas emendam direto.
 */
const path = require('path');
const cenas = require('./cenas');
const { criarAbertura, criarEncerramento } = require('./cenasPontas');
const { montar } = require('../anim/montar');
const { temposPorPausas } = require('../anim/fala');
const roteiroTexto = require('./roteiro');

const CEU = '#BDE5FF';
const BRANCO = '#fff';

/** As cenas em ordem; `criar` recebe o instante em que a cena começa no vídeo. */
function roteiro() {
  return [
    { nome: 'abertura', criar: (t0) => criarAbertura({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO }) },
    { nome: 'd1', criar: (t0) => cenas.criarAchar({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO }) },
    { nome: 'd2', criar: (t0) => cenas.criarContar({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO }) },
    { nome: 'd3', criar: (t0) => cenas.criarEscolher(3, { tGlobal0: t0, entrada: BRANCO }) },
    { nome: 'd4', criar: (t0) => cenas.criarSombra({ tGlobal0: t0, saida: CEU }) },
    { nome: 'd5', criar: (t0) => cenas.criarComparar({ tGlobal0: t0, entrada: CEU, saida: CEU }) },
    { nome: 'd6', criar: (t0) => cenas.criarEscolher(6, { tGlobal0: t0, entrada: CEU }) },
    { nome: 'd7', criar: (t0) => cenas.criarEscolher(7, { tGlobal0: t0 }) },
    { nome: 'd8', criar: (t0) => cenas.criarMemoria({ tGlobal0: t0, saida: BRANCO }) },
    { nome: 'encerramento', criar: (t0) => criarEncerramento({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO }) },
  ];
}

module.exports = { roteiro };

if (require.main === module) {
  montar({
    nome: 'v4_quiz_do_papai_noel',
    pasta: 'v4-papai-noel',
    roteiro: roteiro(),
    trechos: 'trechos-v4',
    legendas: { tempos: (arquivo, frases) => temposPorPausas(arquivo, frases, roteiroTexto.cortes[path.basename(arquivo, '.wav')]) },
    args: process.argv.slice(2),
    limite: 0.84, // folga a mais no pico: o primeiro teste deu −0,3 dBTP, acima dos −1 recomendados
  }).catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  });
}
