'use strict';
/**
 * Desenhos e cenários do Vídeo 24: a ovelhinha perdida. O pasto dos quizzes
 * bíblicos, o arbusto onde a ovelhinha se esconde, o pastor com e sem o
 * cajado e a grama. As cenas têm os mesmos nomes e `id` das do Vídeo 4.
 */
const { n, o, withOutline, P, E, Ci, R, L, G, tube, sparkle, shadow } = require('../kit');
const { place, fundoQuiz, TRACO } = require('./cenario');
const pessoas = require('./pessoas');
const animais = require('./animais');
const cr = require('./criacao');
const { tuti } = require('../tuti');

// ------------------------------------------------------------ desenhos de card (prancheta 1000 x 1000)
const ovelha = () => animais.ovelha();
const ovelhaFeliz = () => animais.ovelha({ feliz: true });
/** O pastor, com o cajado na mão. */
const pastor = () => pessoas.daviPastor();
/** O painel do "o que falta": o pastor no pasto, sem o cajado (a mão fica estendida). */
function pastorSemCajado() {
  return (
    R(90, 90, 820, 820, 60, '#CFE6FF', { sw: 0 }) +
    P('M90 760 Q500 700 910 760 L910 910 L90 910Z', '#7CC96B', { sw: 0 }) +
    G('translate(60,70) scale(0.88)', withOutline(o(1 / 0.88), () => pessoas.davi({ armR: [742, 590], behind: '' })))
  );
}
/** O cajado que entra na mão do pastor na resposta (mesmas coordenadas do painel). */
const cajadoCai = () => G('translate(60,70) scale(0.88)', withOutline(o(1 / 0.88), () => pessoas.staff(742, 250, 896)));
/** Um tufo grande de grama. */
function grama() {
  let s = shadow(500, 880, 330) + E(500, 860, 330, 50, '#5DB55A');
  for (const [x, h, c] of [[250, 300, 30], [340, 460, -20], [430, 380, 10], [520, 520, -10], [610, 400, 24], [700, 470, -26], [780, 300, 16]]) s += P(`M${x - 40} 860 Q${x + c} ${860 - h * 0.6} ${x + c * 2} ${860 - h} Q${x + c + 30} ${860 - h * 0.5} ${x + 40} 860Z`, '#6CC77A');
  return s + Ci(330, 700, 16, '#FFD23F', { sw: o(0.5) }) + Ci(660, 640, 16, '#FF8FB1', { sw: o(0.5) });
}
/** Arbusto grande e redondo; (cx, base) é o chão. */
const arbusto = (cx, base, s = 1) =>
  G(`translate(${cx},${base}) scale(${s})`, withOutline(o(1 / s), () =>
    P('M-250 0 C-290 -150 -200 -260 -110 -230 C-80 -330 80 -340 120 -240 C220 -270 300 -150 250 0Z', '#4FAE62') +
    L('M-130 -90 Q-110 -150 -60 -160 M40 -100 Q70 -170 130 -160', { color: '#3F9E60', sw: o(1.4) }) +
    Ci(-150, -150, 14, '#FF8FB1', { sw: o(0.5) }) + Ci(160, -110, 14, '#FFD23F', { sw: o(0.5) }) + Ci(10, -250, 14, '#FF8FB1', { sw: o(0.5) })));

// ------------------------------------------------------------ cenários (1920 x 1080)
const sobre = (fn, cx, base, s) => place(fn, cx - 500 * s, base - 900 * s, s);
const fundoNeve = () => withOutline(TRACO, () => fundoQuiz() + '<g id="neveF"></g>');
const flocos = () => '';

/** Onde a ovelhinha se esconde (brincadeira 1): atrás do arbusto (`arvoreEsc`). */
const ESCONDERIJO = { x: 1300, dx: 230, chao: 985, s: 0.28, arvore: { x: 1300, y: 1000 } };
function cenaAchar() {
  return withOutline(TRACO, () => {
    const E_ = ESCONDERIJO;
    let s = fundoQuiz();
    // a orelhinha e a lã ficam de fora, à direita do arbusto: é a pista
    s += `<g id="oculta">${sobre(ovelha, E_.x + E_.dx, E_.chao, E_.s)}</g>`;
    s += `<g id="arvoreEsc">${arbusto(E_.arvore.x, E_.arvore.y, 1.05)}</g>`;
    return s;
  });
}

/** Contar: cinco ovelhinhas no pasto (ids p1 a p5). */
const RENAS_X = [760, 960, 1160, 1360, 1560];
function cenaRenas() {
  return withOutline(TRACO, () => {
    let s = fundoQuiz();
    RENAS_X.forEach((x, i) => {
      s += `<g id="p${i + 1}">${sobre(i % 2 ? ovelhaFeliz : ovelha, x, 960 + (i % 2 ? 20 : 0), 0.2)}</g>`;
    });
    return s;
  });
}

/** Comparar: a ovelha pequena (`ov`, à esquerda) e a grande (`ca`, à direita). */
const CHAO = 985;
const PEQUENO = { x: 900, s: 0.3 };
const GRANDE = { x: 1420, s: 0.7 };
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = fundoQuiz();
    s += `<g id="ov">${sobre(ovelha, PEQUENO.x, CHAO, PEQUENO.s)}</g>`;
    s += `<g id="ca">${sobre(ovelha, GRANDE.x, CHAO, GRANDE.s)}</g>`;
    return s;
  });
}

/** Encerramento: o pastor com a ovelhinha achada (`o1`) e as outras ovelhas (`o2`). */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = fundoQuiz();
    s += sobre(() => cr.flor('#FF8FB1'), 800, 1010, 0.12) + sobre(() => cr.flor('#FFD23F'), 1820, 1010, 0.12);
    s += `<g id="o2">${sobre(ovelha, 1560, 1000, 0.22)}${sobre(ovelhaFeliz, 1740, 1010, 0.2)}</g>`;
    s += `<g id="o1">${sobre(pastor, 1120, 1010, 0.5)}${sobre(ovelhaFeliz, 1330, 1000, 0.22)}</g>`;
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau'));
    return s;
  });
}
const cenaAbertura = cenaEncerramento;

module.exports = { ovelha, ovelhaFeliz, pastor, pastorSemCajado, cajadoCai, grama, arbusto, fundoNeve, flocos, cenaAbertura, cenaAchar, cenaRenas, cenaComparar, cenaEncerramento, ESCONDERIJO, RENAS_X, CHAO, GRANDE, PEQUENO };
