'use strict';
/**
 * Vídeo 1 — monta o vídeo inteiro: abertura, as 8 perguntas e o encerramento,
 * com narração, efeitos e trilha, mais o arquivo de legendas.
 *
 * Uso: node src/v1/video.js [--refazer]
 *
 * A montagem em si está em src/anim/montar.js.
 */
const { criarPergunta } = require('./cenaPergunta');
const { criarAbertura, criarEncerramento } = require('./cenasPontas');
const { montar } = require('../anim/montar');

const CEU = '#BDE5FF';

/** As cenas em ordem; `criar` recebe o instante em que a cena começa no vídeo. */
function roteiro() {
  const lista = [{ nome: 'abertura', criar: (t0) => criarAbertura({ tGlobal0: t0 }) }];
  for (let n = 1; n <= 8; n++) {
    lista.push({ nome: `p${n}`, criar: (t0) => criarPergunta(n, { tGlobal0: t0, entrada: n === 1 ? CEU : null, saida: n === 8 ? CEU : null }) });
  }
  lista.push({ nome: 'encerramento', criar: (t0) => criarEncerramento({ tGlobal0: t0 }) });
  return lista;
}

module.exports = { roteiro };

if (require.main === module) {
  montar({ nome: 'v1_quiz_arca_de_noe', pasta: 'v1-arca-de-noe', roteiro: roteiro(), args: process.argv.slice(2) }).catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  });
}
