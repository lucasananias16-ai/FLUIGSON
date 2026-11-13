'use strict';
/**
 * Vídeo 1 — cena de uma pergunta: três cards que viram. A cena em si está em
 * src/anim/cenaCards.js; aqui entram os dados do Vídeo 1.
 */
const path = require('path');
const { criarCenaCards } = require('../anim/cenaCards');
const perguntas = require('./opcoes');
const roteiro = require('./roteiro');

const NARR = path.resolve(__dirname, '..', '..', 'v1-arca-de-noe', 'narracao');

/**
 * Monta a cena da pergunta `num` (1 a 8).
 * `tGlobal0` é o instante em que a cena começa dentro do vídeo inteiro.
 * `entrada` e `saida` são cores para abrir e fechar a cena com um véu; sem
 * elas a cena emenda direto na anterior e na seguinte.
 */
function criarPergunta(num, opts = {}) {
  return criarCenaCards(
    Object.assign(
      {
        num,
        q: perguntas.find((x) => x.n === num),
        narrDir: NARR,
        idPergunta: `v1_p${num}_pergunta`,
        idResposta: `v1_p${num}_resposta`,
        contagem: roteiro.contagem,
      },
      opts
    )
  );
}

module.exports = { criarPergunta };
