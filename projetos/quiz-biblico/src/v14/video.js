'use strict';
/**
 * Vídeo 14 — monta o vídeo inteiro: abertura, os 8 desafios e o encerramento,
 * com narração, efeitos e trilha, mais o arquivo de legendas.
 *
 * Uso: node src/v14/video.js [--refazer]
 *
 * A montagem em si está em src/anim/montar.js. Nos desafios que não são de
 * cartas trocando, a cena dNa mostra os desenhos e a dN faz a pergunta. O
 * fundo é o mesmo em todos os desafios, então as cenas emendam direto; só a
 * abertura e o encerramento têm véu.
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
    { nome: 'd1', criar: (t0) => cenas.criarJogoMemoria(1, { tGlobal0: t0, entrada: BRANCO }) },
    { nome: 'd2a', criar: (t0) => cenas.criarMostrar(2, { tGlobal0: t0 }) },
    { nome: 'd2', criar: (t0) => cenas.criarLembrete(2, { tGlobal0: t0 }) },
    { nome: 'd3a', criar: (t0) => cenas.criarMostrar(3, { tGlobal0: t0 }) },
    { nome: 'd3', criar: (t0) => cenas.criarLembrete(3, { tGlobal0: t0 }) },
    { nome: 'd4a', criar: (t0) => cenas.criarMostrar(4, { tGlobal0: t0 }) },
    { nome: 'd4', criar: (t0) => cenas.criarLembrete(4, { tGlobal0: t0 }) },
    { nome: 'd5', criar: (t0) => cenas.criarJogoMemoria(5, { tGlobal0: t0 }) },
    { nome: 'd6a', criar: (t0) => cenas.criarMostrar(6, { tGlobal0: t0 }) },
    { nome: 'd6', criar: (t0) => cenas.criarLembrete(6, { tGlobal0: t0 }) },
    { nome: 'd7a', criar: (t0) => cenas.criarMostrar(7, { tGlobal0: t0 }) },
    { nome: 'd7', criar: (t0) => cenas.criarLembrete(7, { tGlobal0: t0 }) },
    { nome: 'd8a', criar: (t0) => cenas.criarMostrar(8, { tGlobal0: t0 }) },
    { nome: 'd8', criar: (t0) => cenas.criarLembrete(8, { tGlobal0: t0 }) },
    { nome: 'd9a', criar: (t0) => cenas.criarMostrar(9, { tGlobal0: t0 }) },
    { nome: 'd9', criar: (t0) => cenas.criarLembrete(9, { tGlobal0: t0 }) },
    { nome: 'd10', criar: (t0) => cenas.criarJogoMemoria(10, { tGlobal0: t0 }) },
    { nome: 'd11a', criar: (t0) => cenas.criarMostrar(11, { tGlobal0: t0 }) },
    { nome: 'd11', criar: (t0) => cenas.criarLembrete(11, { tGlobal0: t0 }) },
    { nome: 'd12', criar: (t0) => cenas.criarJogoMemoria(12, { tGlobal0: t0, saida: BRANCO }) },
    { nome: 'encerramento', criar: (t0) => criarEncerramento({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO }) },
  ];
}

module.exports = { roteiro };

if (require.main === module) {
  montar({
    nome: 'v14_jogo_da_memoria',
    pasta: 'v14-jogo-da-memoria',
    roteiro: roteiro(),
    trechos: 'trechos-v14',
    legendas: { tempos: (arquivo, frases) => temposPorPausas(arquivo, frases, roteiroTexto.cortes[path.basename(arquivo, '.wav')]) },
    args: process.argv.slice(2),
    limite: 0.84, // folga a mais no pico: o primeiro teste deu −0,3 dBTP, acima dos −1 recomendados
  }).catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  });
}
