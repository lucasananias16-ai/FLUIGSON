'use strict';
/**
 * Desenhos e cenários do Vídeo 22: a véspera de Natal. A sala à noite, a
 * lareira (com e sem fogo), a poltrona, as meias de Natal, o leite com
 * biscoito, o pijama e os cards de manhã, tarde e noite. As cenas têm os
 * mesmos nomes e `id` das do Vídeo 4 (art/noel.js).
 */
const { n, o, withOutline, P, E, Ci, R, L, G, tube, sparkle, shadow } = require('../kit');
const { place, TRACO } = require('./cenario');
const ceia = require('./ceia');
const { tuti } = require('../tuti');

// ------------------------------------------------------------ desenhos de card (prancheta 1000 x 1000)
/** Meia de Natal; `cor` é a cor da meia (a boca é branca). */
function meiaCor(cor = '#E25A52', escuro = '#C2443D') {
  const forma = 'M360 220 L640 220 L640 600 C640 700 700 740 780 780 C860 830 800 920 700 910 C580 900 480 840 420 760 C370 690 360 640 360 560Z';
  return () =>
    shadow(560, 922, 300) +
    P(forma, cor) +
    P('M420 760 C400 700 420 660 470 640 C520 700 520 780 470 830Z', '#FFFFFF', { sw: o(0.7) }) +
    P('M690 905 C640 860 660 790 720 760 C800 790 840 850 800 890Z', '#FFFFFF', { sw: o(0.7) }) +
    L('M380 400 L620 400 M380 480 L620 480', { color: escuro, sw: o(1.6) }) +
    R(330, 150, 340, 120, 40, '#FFFFFF') +
    L('M390 200 Q500 180 610 200', { color: '#E3DDF2', sw: o(0.8) }) +
    tube('M500 150 L500 90', 10, '#8F5A2E');
}
const meia = meiaCor();
/** Copo de leite com um biscoito ao lado. */
function leiteBiscoito() {
  return (
    shadow(500, 880, 340) +
    P('M250 300 L530 300 L500 850 L280 850Z', '#EAF4FF') +
    P('M262 420 L518 420 L500 850 L280 850Z', '#FFFFFF', { sw: 0 }) +
    L('M262 420 L518 420', { color: '#CFE6FF', sw: o(1.2) }) +
    P('M250 300 L530 300 L500 850 L280 850Z', 'none') +
    Ci(700, 720, 150, '#D9A066') +
    [[650, 670], [740, 690], [690, 770], [770, 770], [630, 760]].map(([x, y]) => Ci(x, y, 20, '#7A4A2B', { sw: 0 })).join('') +
    sparkle(760, 380, 34, 0, '#FFD23F')
  );
}
/** Pijama azul de bolinhas, com a calça. */
function pijama() {
  const blusa = 'M340 180 L660 180 L800 300 L740 390 L680 340 L680 560 L320 560 L320 340 L260 390 L200 300Z';
  const calca = 'M330 580 L670 580 L690 880 L540 880 L500 680 L460 880 L310 880Z';
  const bolas = (pts) => pts.map(([x, y]) => Ci(x, y, 18, '#FFFFFF', { sw: 0 })).join('');
  return (
    shadow(500, 890, 300) +
    P(calca, '#7DB7F5') + bolas([[400, 660], [600, 660], [380, 780], [620, 780], [420, 840], [590, 840]]) +
    P(blusa, '#4DA3FF') + bolas([[400, 280], [600, 280], [500, 380], [400, 480], [600, 480], [260, 310], [740, 310]]) +
    P('M420 180 Q500 260 580 180', '#FFFFFF') +
    L('M500 250 L500 560', { sw: o(0.9) }) + Ci(500, 330, 12, '#FFD23F') + Ci(500, 430, 12, '#FFD23F') +
    `<text x="760" y="170" font-family="Fredoka" font-weight="700" font-size="120" fill="#9B7EDE" stroke="#3D2C4E" stroke-width="9" paint-order="stroke">z</text>`
  );
}
/** O fogo, grande, no card. */
const chamas = (cx, base, s) =>
  G(`translate(${cx},${base}) scale(${s})`, P('M-120 0 C-190 -150 -60 -200 -40 -330 C40 -240 60 -200 70 -150 C100 -200 110 -230 100 -270 C190 -170 180 -70 130 0Z', '#FF8A3A') + P('M-60 0 C-90 -80 -20 -110 -10 -190 C40 -120 80 -80 60 0Z', '#FFD23F', { sw: o(0.6) }));
const fogo = () => shadow(500, 860, 260) + tube('M330 850 L670 790 M330 790 L670 850', 44, '#8F5A2E') + withOutline(o(1 / 1.7), () => chamas(500, 800, 1.7));
/** A lareira de tijolos na prancheta; `aceso` põe o fogo. */
function lareiraCard({ aceso = true } = {}) {
  let s = R(190, 300, 620, 560, 20, '#C98A6B');
  s += L('M190 400 L810 400 M190 500 L340 500 M660 500 L810 500 M190 600 L340 600 M660 600 L810 600 M190 700 L340 700 M660 700 L810 700 M300 300 L300 400 M500 300 L500 400 M700 300 L700 400', { color: '#A66A4B', sw: o(0.8) });
  s += R(150, 250, 700, 70, 18, '#8F5A2E');
  s += P('M340 860 L340 600 A160 160 0 0 1 660 600 L660 860Z', '#3B3548');
  s += tube('M410 850 L590 820 M410 820 L590 850', 26, '#8F5A2E');
  if (aceso) s += fogoNaLareira();
  return s;
}
const fogoNaLareira = () => withOutline(o(1 / 0.8), () => chamas(500, 830, 0.8));
/** O painel do "o que falta": a lareira apagada, com as meias penduradas. */
function lareiraSemFogo() {
  return (
    R(90, 90, 820, 820, 60, '#DCEFE4', { sw: 0 }) +
    P('M90 860 L910 860 L910 910 L90 910Z', '#C98A4B', { sw: 0 }) +
    lareiraCard({ aceso: false }) +
    place(meia, 250, 300, 0.16) + place(meiaCor('#3CA567', '#2F8F5A'), 590, 300, 0.16)
  );
}
/** O fogo que entra na lareira na resposta (mesmas coordenadas do painel). */
const fogoCai = () => fogoNaLareira();
/** Céu de um pedaço do dia: 'manha' (sol nascendo), 'tarde' (sol alto) ou 'noite' (lua e estrelas). */
function hora(qual) {
  const ceu = { manha: '#FFD9B8', tarde: '#8ED4FF', noite: '#27386E' }[qual];
  let s = R(130, 150, 740, 680, 60, ceu);
  if (qual === 'manha') s += Ci(500, 690, 135, '#FFB23F') + L('M500 500 L500 430 M350 560 L300 510 M650 560 L700 510 M310 680 L240 680 M690 680 L760 680', { color: '#FFB23F', sw: o(2.4) });
  if (qual === 'tarde') s += Ci(500, 400, 130, '#FFD23F') + L('M500 230 L500 180 M500 570 L500 620 M330 400 L280 400 M670 400 L720 400 M380 280 L345 245 M620 280 L655 245 M380 520 L345 555 M620 520 L655 555', { color: '#FFD23F', sw: o(2.4) });
  if (qual === 'noite') s += P('M560 250 A170 170 0 1 0 700 520 A130 130 0 1 1 560 250Z', '#FFF6C8') + [[260, 280], [330, 520], [760, 300], [240, 420], [700, 640]].map(([x, y], i) => sparkle(x, y, 22, i * 15, '#FFFFFF')).join('');
  s += P('M130 700 Q500 640 870 700 L870 830 L130 830Z', qual === 'noite' ? '#2F7553' : '#7CC96B');
  return s;
}
const horaDe = (q) => () => hora(q);

// ------------------------------------------------------------ cenários (1920 x 1080)
const sobre = (fn, cx, base, s) => place(fn, cx - 500 * s, base - 900 * s, s);
/** Fundo das cenas de cards: a sala sem a janela (ela ficaria atrás do terceiro card). */
const fundoNeve = () => withOutline(TRACO, () => salaCrua());
const flocos = () => '';

/** Poltrona vermelha; (cx, base) é o chão. */
const poltrona = (cx, base) =>
  R(cx - 210, base - 420, 420, 330, 70, '#D9534F') + R(cx - 260, base - 250, 110, 220, 44, '#C2443D') + R(cx + 150, base - 250, 110, 220, 44, '#C2443D') +
  R(cx - 170, base - 190, 340, 130, 34, '#E8736E') + R(cx - 220, base - 40, 60, 40, 10, '#8F5A2E') + R(cx + 160, base - 40, 60, 40, 10, '#8F5A2E') +
  Ci(cx, base - 330, 16, '#C2443D', { sw: o(0.6) });
/** A lareira grande da sala; (cx, base) é o chão. */
const lareira = (cx, base, s) => G(`translate(${cx - 500 * s},${base - 860 * s}) scale(${s})`, withOutline(o(1 / s), () => lareiraCard()));

/** Onde o biscoito se esconde (desafio 1): atrás da poltrona (`arvoreEsc`). */
const ESCONDERIJO = { x: 1300, dx: 235, chao: 945, s: 0.3, arvore: { x: 1300, y: 950 } };
function cenaAchar() {
  return withOutline(TRACO, () => {
    const E_ = ESCONDERIJO;
    let s = salaCrua({ janela: true });
    s += lareira(700, 880, 0.62);
    // um bracinho e a perna ficam de fora, à direita da poltrona: é a pista
    s += `<g id="oculta">${sobre(ceia.gengibre, E_.x + E_.dx, E_.chao, E_.s)}</g>`;
    s += `<g id="arvoreEsc">${poltrona(E_.arvore.x, E_.arvore.y)}</g>`;
    return s;
  });
}
/**
 * A sala da véspera: parede, chão de madeira e tapete. A janela da noite só
 * entra onde não fica atrás de card, relógio ou meia (`janela`).
 */
function salaCrua({ janela = false } = {}) {
  let s = R(0, 0, 1920, 1080, 0, '#DCEFE4', { sw: 0 });
  s += L('M0 800 L1920 800', { color: '#FFFFFF', sw: o(3) });
  if (janela) s += R(1560, 250, 280, 250, 26, '#27386E') + E(1700, 470, 140, 40, '#E4EFFB', { sw: 0 }) + [[1620, 320], [1750, 300], [1690, 390], [1790, 400]].map(([x, y]) => Ci(x, y, 7, '#FFFFFF', { sw: 0 })).join('') + R(1560, 250, 280, 250, 26, 'none') + L('M1700 250 L1700 500 M1560 375 L1840 375', { sw: o(1.1) });
  s += P('M-20 860 L1940 860 L1940 1100 L-20 1100Z', '#C98A4B');
  s += L('M-20 940 L1940 940 M-20 1020 L1940 1020 M300 860 L260 1100 M900 860 L900 1100 M1500 860 L1560 1100', { color: '#A66A34', sw: o(0.7) });
  s += E(1150, 990, 520, 70, '#E86F95') + E(1150, 990, 430, 48, '#FF8FB1', { sw: o(0.6) });
  return s;
}

/** Desafio 2 — Contar: cinco meias penduradas num cordão (ids p1 a p5). */
const RENAS_X = [760, 960, 1160, 1360, 1560];
function cenaRenas() {
  return withOutline(TRACO, () => {
    let s = salaCrua();
    s += L('M640 330 Q1160 400 1680 330', { color: '#8F5A2E', sw: o(1.2) });
    const cores = [['#E25A52', '#C2443D'], ['#3CA567', '#2F8F5A'], ['#E25A52', '#C2443D'], ['#4DA3FF', '#2E86E6'], ['#E25A52', '#C2443D']];
    RENAS_X.forEach((x, i) => {
      s += `<g id="p${i + 1}">${sobre(meiaCor(cores[i][0], cores[i][1]), x - 10, 640 + (i % 2 ? 20 : 0), 0.3)}</g>`;
    });
    return s;
  });
}

/** Desafio 6 — Comparar: a meia grande (`ca`, à esquerda) e a pequena (`ov`, à direita). */
const CHAO = 990;
const GRANDE = { x: 900, s: 0.62 };
const PEQUENO = { x: 1450, s: 0.28 };
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = salaCrua();
    s += `<g id="ov">${sobre(meia, PEQUENO.x, CHAO, PEQUENO.s)}</g>`;
    s += `<g id="ca">${sobre(meia, GRANDE.x, CHAO, GRANDE.s)}</g>`;
    return s;
  });
}

/** Encerramento: a lareira acesa com as meias (`o1`) e a poltrona com o leite e o biscoito (`o2`). */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = salaCrua({ janela: true });
    s += lareira(1050, 880, 0.78);
    s += `<g id="o1">${sobre(meia, 900, 520, 0.2)}${sobre(meiaCor('#3CA567', '#2F8F5A'), 1050, 520, 0.2)}${sobre(meiaCor('#4DA3FF', '#2E86E6'), 1200, 520, 0.2)}</g>`;
    s += poltrona(1620, 960);
    s += `<g id="o2">${sobre(leiteBiscoito, 1620, 800, 0.18)}</g>`;
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau', { gorro: true }));
    return s;
  });
}
const cenaAbertura = cenaEncerramento;

module.exports = { meia, meiaCor, leiteBiscoito, pijama, fogo, lareiraSemFogo, fogoCai, hora, horaDe, poltrona, fundoNeve, flocos, cenaAbertura, cenaAchar, cenaRenas, cenaComparar, cenaEncerramento, ESCONDERIJO, RENAS_X, CHAO, GRANDE, PEQUENO };
