'use strict';
/**
 * Vídeo 6 — monta o vídeo inteiro: abertura, lições, jogos e a decolagem, com
 * narração, efeitos e trilha, mais o arquivo de legendas.
 *
 * Uso: node src/v6/video.js [--refazer]
 *
 * A montagem em si está em src/anim/montar.js.
 */
const cenas = require('./cenas');
const { montar } = require('../anim/montar');

const B = '#fff';

/** As cenas em ordem; `criar` recebe o instante em que a cena começa no vídeo. */
function roteiro() {
  const veus = { entrada: B, saida: B };
  return [
    { nome: 'abertura', criar: (t0) => cenas.criarAbertura(Object.assign({ tGlobal0: t0 }, veus)) },
    { nome: 'l1', criar: (t0) => cenas.criarLicao(1, Object.assign({ tGlobal0: t0 }, veus)) },
    { nome: 'j1', criar: (t0) => cenas.criarCorpo(Object.assign({ tGlobal0: t0 }, veus)) },
    { nome: 'l2', criar: (t0) => cenas.criarLicao(2, Object.assign({ tGlobal0: t0 }, veus)) },
    { nome: 'j2', criar: (t0) => cenas.criarCartas(2, Object.assign({ tGlobal0: t0 }, veus)) },
    { nome: 'j3', criar: (t0) => cenas.criarEstrelas(Object.assign({ tGlobal0: t0 }, veus)) },
    { nome: 'j4a', criar: (t0) => cenas.criarBipConta({ tGlobal0: t0, entrada: B, saida: B }) },
    { nome: 'j4', criar: (t0) => cenas.criarCartas(4, Object.assign({ tGlobal0: t0 }, veus)) },
    { nome: 'j5', criar: (t0) => cenas.criarMemoria(Object.assign({ tGlobal0: t0 }, veus)) },
    { nome: 'final', criar: (t0) => cenas.criarFinal({ tGlobal0: t0 }) },
  ];
}

module.exports = { roteiro };

if (require.main === module) {
  montar({ nome: 'v6_foguete_da_tuti', pasta: 'v6-ingles-numeros', roteiro: roteiro(), trechos: 'trechos-v6', args: process.argv.slice(2), limite: 0.84 }).catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  });
}
