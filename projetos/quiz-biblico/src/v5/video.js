'use strict';
/**
 * Vídeo 5 — monta o vídeo inteiro: a abertura, as visitas dos bichos, os
 * jogos e a dança final, com narração, efeitos e trilha, mais o arquivo de
 * legendas.
 *
 * Uso: node src/v5/video.js [--refazer]
 *
 * A montagem em si está em src/anim/montar.js. Um véu branco fecha uma cena e
 * abre a seguinte.
 */
const cenas = require('./cenas');
const { montar } = require('../anim/montar');

const BRANCO = '#fff';

/** As cenas em ordem; `criar` recebe o instante em que a cena começa no vídeo. */
function roteiro() {
  const v = (n) => ({ nome: `v${n}`, criar: (t0) => cenas.criarVisita(n, { tGlobal0: t0, entrada: BRANCO, saida: BRANCO }) });
  return [
    { nome: 'abertura', criar: (t0) => cenas.criarAbertura({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO }) },
    { nome: 'v1', criar: (t0) => cenas.criarSheep({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO }) },
    v(2),
    v(3),
    v(4),
    { nome: 'j1', criar: (t0) => cenas.criarTutiDiz({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO }) },
    { nome: 'j2', criar: (t0) => cenas.criarCartas({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO }) },
    { nome: 'j3', criar: (t0) => cenas.criarAchar({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO }) },
    { nome: 'j4', criar: (t0) => cenas.criarContar({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO }) },
    { nome: 'j5', criar: (t0) => cenas.criarMemoria({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO }) },
    { nome: 'final', criar: (t0) => cenas.criarFinal({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO }) },
  ];
}

module.exports = { roteiro };

if (require.main === module) {
  montar({
    nome: 'v5_festa_dos_animais',
    pasta: 'v5-ingles-animais',
    roteiro: roteiro(),
    trechos: 'trechos-v5',
    args: process.argv.slice(2),
    limite: 0.84, // folga a mais no pico, como no Vídeo 4
  }).catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  });
}
