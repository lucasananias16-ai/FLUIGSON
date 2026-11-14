'use strict';
/**
 * Enfeites e cenários do Vídeo 9: a sala de casa e a árvore de Natal. As cenas
 * têm os mesmos nomes e os mesmos `id` das do Vídeo 4 (art/noel.js), para as
 * cenas animadas serem as mesmas com outro cenário.
 */
const { n, o, withOutline, P, E, Ci, R, L, G, tube, sparkle, shadow } = require('../kit');
const { place, TRACO } = require('./cenario');
const objetos = require('./objetos');
const { tuti } = require('../tuti');

const VERDE = ['#2F8F5A', '#3AA568', '#46B374'];
const CORES_BOLA = ['#E25A52', '#FFD23F', '#4DA3FF', '#9B7EDE', '#FF8FB1'];

// ------------------------------------------------------------ enfeites (prancheta 1000 x 1000)
function bolaNatal(cor = '#E25A52') {
  return shadow(500, 900, 240) + R(450, 150, 100, 80, 18, '#FFD23F') + L('M500 150 C500 90 560 90 560 130', { sw: o(1) }) + Ci(500, 540, 320, cor) + E(380, 400, 60, 100, '#FFFFFF', { sw: 0, opacity: 0.4, rot: 25 }) + L('M200 600 Q500 700 800 600', { color: '#FFFFFF', sw: o(1.4), opacity: 0.7 });
}
function sino() {
  const corpo = 'M500 180 C340 180 300 380 290 560 C280 680 230 720 180 760 L820 760 C770 720 720 680 710 560 C700 380 660 180 500 180Z';
  return shadow(500, 900, 260) + P('M430 190 C430 100 570 100 570 190Z', '#E25A52') + P(corpo, '#FFD23F') + E(400, 400, 40, 110, '#FFE680', { sw: 0, rot: 12 }) + R(160, 740, 680, 60, 30, '#F4B824') + Ci(500, 850, 54, '#E0A93F');
}
function luz(cor = '#E25A52') {
  return R(440, 150, 120, 130, 26, '#3F9E60') + P('M500 270 C330 380 300 640 500 860 C700 640 670 380 500 270Z', cor) + E(430, 480, 36, 90, '#FFFFFF', { sw: 0, opacity: 0.45, rot: 14 }) + sparkle(190, 300, 34, 0, '#FFD23F') + sparkle(820, 620, 28, 12, '#FFD23F');
}
function bota() {
  const d = 'M330 170 L600 170 L600 600 C720 620 840 680 840 780 C840 840 800 860 740 860 L330 860Z';
  return shadow(560, 880, 300) + P(d, '#E25A52') + P('M330 760 L840 760 C850 840 800 860 740 860 L330 860Z', '#3B3548') + R(300, 130, 330, 120, 40, '#FFFFFF') + Ci(465, 400, 30, '#FFD23F', { sw: o(0.7) });
}

// ------------------------------------------------------------ a árvore e a sala (1920 x 1080)
/** Pontos onde ficam as cinco bolas numa árvore de 600 de altura (x a partir do centro, y a partir da base). */
const PONTOS_BOLA = [[0, -430], [-70, -310], [80, -290], [-120, -160], [130, -140]];

/**
 * Árvore de Natal de casa: três camadas verdes num vaso. (x, base) é o pé; `alt` a
 * altura. `bolas` = quantas bolas, `ids` dá um grupo `p1..p5` a cada bola, `luzes`
 * põe a fiada de luzinhas (grupos `lz1` e `lz2`) e `estrela` põe a do topo.
 */
function arvore(x, base, alt, { bolas = 0, ids = false, luzes = false, estrela = false } = {}) {
  const s = alt / 600;
  const camada = (apice, b, meia, cor) => P(`M0 ${apice} Q${meia * 0.4} ${apice + (b - apice) * 0.4} ${meia} ${b - 12} Q${meia + 8} ${b} ${meia - 22} ${b} L${-meia + 22} ${b} Q${-meia - 8} ${b} ${-meia} ${b - 12} Q${-meia * 0.4} ${apice + (b - apice) * 0.4} 0 ${apice}Z`, cor);
  let g = R(-26, -70, 52, 60, 8, '#8F5A2E') + P('M-70 -20 L70 -20 L54 30 L-54 30Z', '#E25A52') + camada(-330, -60, 230, VERDE[0]) + camada(-450, -200, 176, VERDE[1]) + camada(-560, -340, 122, VERDE[2]);
  if (luzes) {
    g += L('M-190 -110 Q-60 -60 60 -110 Q130 -140 200 -100 M-130 -250 Q0 -200 140 -250 M-80 -380 Q10 -350 90 -390', { color: '#3B3548', sw: o(0.5) });
    const pts = [[-150, -92], [-60, -78], [40, -100], [150, -112], [-90, -234], [10, -222], [100, -236], [-40, -366], [50, -372]];
    const grupo = (k) => pts.filter((_, i) => i % 2 === k).map(([lx, ly], i) => E(lx, ly + 12, 11, 15, ['#FFD23F', '#4DA3FF', '#FF8FB1'][i % 3], { sw: o(0.5) })).join('');
    g += `<g id="lz1">${grupo(0)}</g><g id="lz2">${grupo(1)}</g>`;
  }
  for (let i = 0; i < bolas; i++) {
    const [bx, by] = PONTOS_BOLA[i];
    const b = Ci(bx, by, 26, CORES_BOLA[i], { sw: o(0.8) }) + Ci(bx - 8, by - 9, 7, '#FFFFFF', { sw: 0, opacity: 0.7 }) + R(bx - 7, by - 36, 14, 12, 3, '#FFD23F', { sw: o(0.5) });
    g += ids ? `<g id="p${i + 1}">${b}</g>` : b;
  }
  if (estrela) g += `<g id="topo">${sparkle(0, -590, 60, 0, '#FFD23F')}</g>`;
  return G(`translate(${x},${base}) scale(${n(s)})`, withOutline(o(1 / s), () => g));
}

const PRES = [
  ['#FFD23F', '#F4B824', '#E25A52'],
  ['#4DA3FF', '#2E86E6', '#FFFFFF'],
  ['#9B7EDE', '#7F62C6', '#FFD23F'],
];
const caixa = (cx, base, w, h, i) => objetos.caixa(cx, base, w, h, PRES[i % 3][0], PRES[i % 3][1], PRES[i % 3][2]);

/** A sala: parede verde-clara, janela com neve, quadro, chão de madeira e tapete. */
function sala({ lareira = false } = {}) {
  let s = R(0, 0, 1920, 1080, 0, '#DCEFE4', { sw: 0 });
  s += L('M0 800 L1920 800', { color: '#FFFFFF', sw: o(3) });
  s += R(1560, 250, 280, 250, 26, '#27386E') + E(1700, 470, 140, 40, '#E4EFFB', { sw: 0 }) + [[1620, 320], [1750, 300], [1690, 390], [1790, 400]].map(([x, y]) => Ci(x, y, 7, '#FFFFFF', { sw: 0 })).join('') + R(1560, 250, 280, 250, 26, 'none') + L('M1700 250 L1700 500 M1560 375 L1840 375', { sw: o(1.1) });
  if (lareira) {
    s += '<g transform="translate(300,0)">';
    s += R(560, 520, 360, 350, 16, '#C98A6B') + R(530, 490, 420, 50, 14, '#8F5A2E') + P('M640 870 L640 690 A100 100 0 0 1 840 690 L840 870Z', '#3B3548');
    s += P('M700 870 C680 800 730 780 740 730 C770 780 800 800 780 870Z', '#FF8A3A') + P('M722 870 C716 830 740 820 742 790 C756 820 770 830 760 870Z', '#FFD23F', { sw: 0 });
    s += place(objetos.meia, 600, 530, 0.1) + place(objetos.meia, 780, 530, 0.1);
    s += '</g>';
  }
  s += P('M-20 860 L1940 860 L1940 1100 L-20 1100Z', '#C98A4B');
  s += L('M-20 940 L1940 940 M-20 1020 L1940 1020 M300 860 L260 1100 M900 860 L900 1100 M1500 860 L1560 1100', { color: '#A66A34', sw: o(0.7) });
  s += E(1150, 990, 520, 70, '#E86F95') + E(1150, 990, 430, 48, '#FF8FB1', { sw: o(0.6) });
  return s;
}

/** Sofá; (cx, base) é o meio do pé. */
const sofa = (cx, base) =>
  R(cx - 300, base - 300, 600, 240, 60, '#4D8FD6') + R(cx - 350, base - 200, 110, 180, 40, '#3A78BE') + R(cx + 240, base - 200, 110, 180, 40, '#3A78BE') + R(cx - 260, base - 150, 520, 120, 30, '#6AA6E6') + R(cx - 300, base - 40, 60, 40, 10, '#8F5A2E') + R(cx + 240, base - 40, 60, 40, 10, '#8F5A2E') + L(`M${cx} ${base - 150} L${cx} ${base - 34}`, { color: '#3A78BE', sw: o(0.8) });

/** Fundo das cenas de cards: a sala vazia. */
const fundoNeve = () => withOutline(TRACO, () => sala());
/** Dentro de casa não neva: existe só para as cenas terem a mesma forma das do Vídeo 4. */
const flocos = () => '';

/** Abertura: a sala com a lareira e a árvore ainda vazia. */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = sala({ lareira: true });
    s += arvore(1520, 960, 620);
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau', { gorro: true }));
    return s;
  });
}

/** Onde a estrela se esconde (desafio 1): atrás do sofá (`arvoreEsc`). */
const ESCONDERIJO = { x: 1100, chao: 770, s: 0.3, arvore: { x: 1100 } };
function cenaAchar() {
  return withOutline(TRACO, () => {
    const E_ = ESCONDERIJO;
    let s = sala();
    s += arvore(1640, 950, 420);
    s += `<g id="oculta">${place(objetos.estrela, E_.x + 120 - 500 * E_.s, E_.chao - 880 * E_.s, E_.s)}</g>`;
    s += `<g id="arvoreEsc">${sofa(E_.x, 940)}</g>`;
    return s;
  });
}

/** Desafio 2 — Contar: a árvore grande com cinco bolas (ids p1 a p5). */
const ARV = { x: 1180, base: 960, alt: 700 };
const BOLAS = PONTOS_BOLA.map(([x, y]) => [ARV.x + (x * ARV.alt) / 600, ARV.base + (y * ARV.alt) / 600]);
const RENAS_X = BOLAS.map((b) => b[0]);
function cenaRenas() {
  return withOutline(TRACO, () => sala() + arvore(ARV.x, ARV.base, ARV.alt, { bolas: 5, ids: true }));
}

/** Desafio 6 — Comparar: o pinheiro pequeno (`ov`) e o grande (`ca`). */
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = sala();
    s += `<g id="ov">${arvore(800, 970, 190)}</g>`;
    s += `<g id="ca">${arvore(1330, 975, 540)}</g>`;
    return s;
  });
}

/** Encerramento: a árvore pronta, com bolas, luzes (`lz1`, `lz2`), a estrela (`topo`) e os presentes. */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = sala({ lareira: true });
    s += arvore(1520, 950, 640, { bolas: 5, luzes: true, estrela: true });
    s += `<g id="o1">${caixa(1300, 1000, 150, 120, 0)}</g><g id="o2">${caixa(1730, 1000, 150, 170, 1)}</g>`;
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau', { gorro: true }));
    return s;
  });
}

module.exports = { bolaNatal, sino, luz, bota, arvore, sala, sofa, fundoNeve, flocos, cenaAbertura, cenaAchar, cenaRenas, cenaComparar, cenaEncerramento, ESCONDERIJO, RENAS_X, BOLAS, CORES_BOLA };
