'use strict';
/**
 * Desenhos e cenários do Vídeo 14: o Jogo da Memória da Tuti, num parque de
 * dia. O fundo das cenas é o mesmo céu com gramado dos quizzes bíblicos.
 */
const { o, withOutline, P, E, Ci, R, L, G, sparkle, shadow } = require('../kit');
const { place, fundoQuiz, TRACO } = require('./cenario');
const of = require('./oficina');
const animais = require('./animais');
const objetos = require('./objetos');
const { tuti } = require('../tuti');

/** Balão de festa; `cor` é a cor do balão (prancheta 1000 x 1000). */
function balao(cor = '#E25A52') {
  return (
    shadow(500, 920, 160) +
    L('M500 700 Q450 790 520 900', { sw: o(1.2) }) +
    P('M500 690 L470 740 L530 740Z', cor, { sw: o(0.8) }) +
    E(500, 420, 250, 290, cor) +
    E(410, 300, 50, 90, '#FFFFFF', { sw: 0, opacity: 0.45, rot: 25 })
  );
}
/** Carta com o desenho de um número (para "quantos tinha?"). */
const numeroCard = (txt, cor) => () => objetos.numero(txt, cor);

const sobre = (fn, cx, base, s) => place(fn, cx - 500 * s, base - 900 * s, s);
const fundoNeve = () => fundoQuiz() + '<g id="neveF"></g>';
const flocos = () => '';

/** Abertura: o parque, com brinquedos e bichinhos esperando o jogo. */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = fundoQuiz();
    s += `<g id="o1">${sobre(of.ursinho, 1180, 990, 0.26)}${sobre(of.bola, 1430, 1000, 0.2)}${sobre(animais.girafa, 1700, 990, 0.32)}</g>`;
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau'));
    return s;
  });
}

/** Encerramento: os brinquedos e os bichinhos de todos os desafios comemorando (`o1`, `o2`). */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = fundoQuiz();
    s += `<g id="o1">${sobre(of.ursinho, 900, 1000, 0.24)}${sobre(animais.pinguim, 1150, 990, 0.24)}${sobre(objetos.foguete, 1380, 990, 0.3)}</g>`;
    s += `<g id="o2">${sobre(animais.girafa, 1650, 995, 0.34)}${sobre(() => balao('#E25A52'), 1820, 820, 0.28)}</g>`;
    s += sparkle(1000, 600, 30, 0, '#FFD23F') + sparkle(1500, 520, 26, 12, '#FFD23F');
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau'));
    return s;
  });
}

module.exports = { balao, numeroCard, fundoNeve, flocos, cenaAbertura, cenaEncerramento };
