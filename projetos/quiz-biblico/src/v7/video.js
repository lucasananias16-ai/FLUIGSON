'use strict';
/**
 * Vídeo 7 — monta o vídeo inteiro: abertura, as seis cores, os jogos e o
 * arco-íris final, com narração, efeitos e trilha, mais o arquivo de legendas.
 *
 * Uso: node src/v7/video.js [--refazer]
 *
 * A montagem em si está em src/anim/montar.js. As cenas das cores emendam
 * direto uma na outra, porque o campo é o mesmo e vai se pintando.
 */
const cenas = require('./cenas');
const { montar } = require('../anim/montar');

const B = '#fff';
const CEU = '#BDE5FF';

function roteiro() {
  const cor = (i, o = {}) => ({ nome: `c${i + 1}`, criar: (t0) => cenas.criarCor(i, Object.assign({ tGlobal0: t0 }, o)) });
  return [
    { nome: 'abertura', criar: (t0) => cenas.criarAbertura({ tGlobal0: t0, entrada: B }) },
    cor(0),
    cor(1),
    cor(2, { saida: B }),
    { nome: 'j1', criar: (t0) => cenas.criarCamaleao({ tGlobal0: t0, entrada: B, saida: B }) },
    cor(3, { entrada: B }),
    cor(4),
    cor(5, { saida: CEU }),
    { nome: 'j2', criar: (t0) => cenas.criarCartas(2, { tGlobal0: t0, entrada: CEU }) },
    { nome: 'j3', criar: (t0) => cenas.criarMistura({ tGlobal0: t0 }) },
    { nome: 'j4', criar: (t0) => cenas.criarCartas(4, { tGlobal0: t0 }) },
    { nome: 'j5', criar: (t0) => cenas.criarMemoria({ tGlobal0: t0, saida: B }) },
    { nome: 'final', criar: (t0) => cenas.criarFinal({ tGlobal0: t0, entrada: B }) },
  ];
}

module.exports = { roteiro };

if (require.main === module) {
  montar({ nome: 'v7_arco_iris_sumiu', pasta: 'v7-ingles-cores', roteiro: roteiro(), trechos: 'trechos-v7', args: process.argv.slice(2), limite: 0.84 }).catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  });
}
