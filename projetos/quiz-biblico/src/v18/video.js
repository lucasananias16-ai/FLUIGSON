'use strict';
/**
 * Vídeo 18 — monta o vídeo inteiro: abertura, os 8 desafios e o encerramento,
 * com narração, efeitos e trilha, mais o arquivo de legendas.
 *
 * Uso: node src/v18/video.js [--refazer]
 *
 * A montagem em si está em src/anim/montar.js. Um véu da mesma cor fecha uma
 * cena e abre a seguinte sempre que o cenário muda; do 3 ao 5 e do 7 ao 12 o fundo
 * é o mesmo (o parque) e as cenas emendam direto.
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
    { nome: 'd3', criar: (t0) => cenas.criarEscolher(3, { tGlobal0: t0, entrada: BRANCO, primeiraOpcao: 2 }) },
    { nome: 'd4', criar: (t0) => cenas.criarSombra({ tGlobal0: t0 }) },
    { nome: 'd5', criar: (t0) => cenas.criarFalta({ tGlobal0: t0, saida: BRANCO }) },
    { nome: 'd6', criar: (t0) => cenas.criarComparar({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO }) },
    { nome: 'd7', criar: (t0) => cenas.criarDiferente({ tGlobal0: t0, entrada: BRANCO }) },
    { nome: 'd8', criar: (t0) => cenas.criarSequencia({ tGlobal0: t0 }) },
    { nome: 'd9', criar: (t0) => cenas.criarEscolher(9, { tGlobal0: t0 }) },
    { nome: 'd10', criar: (t0) => cenas.criarMemoria({ tGlobal0: t0 }) },
    { nome: 'd11', criar: (t0) => cenas.criarEscolher(11, { tGlobal0: t0 }) },
    { nome: 'd12', criar: (t0) => cenas.criarEscolher(12, { tGlobal0: t0, saida: BRANCO }) },
    { nome: 'encerramento', criar: (t0) => criarEncerramento({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO }) },
  ];
}

module.exports = { roteiro };

if (require.main === module) {
  montar({
    nome: 'v18_estacoes_do_ano',
    pasta: 'v18-estacoes',
    roteiro: roteiro(),
    trechos: 'trechos-v18',
    legendas: { tempos: (arquivo, frases) => temposPorPausas(arquivo, frases, roteiroTexto.cortes[path.basename(arquivo, '.wav')]) },
    args: process.argv.slice(2),
    limite: 0.84, // folga a mais no pico: o primeiro teste deu −0,3 dBTP, acima dos −1 recomendados
  }).catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  });
}
