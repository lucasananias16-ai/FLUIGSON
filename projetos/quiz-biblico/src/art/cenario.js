'use strict';
/**
 * Cenários do Vídeo 1: a arca e as cenas de abertura e encerramento.
 * As cenas são desenhadas direto em 1920 x 1080.
 */
const { n, o, withOutline, P, E, Ci, R, L, G, clipD, tube, cloud } = require('../kit');
const { rainbowArc } = require('./objetos');
const pessoas = require('./pessoas');
const animais = require('./animais');
const { tuti } = require('../tuti');

const SKY = '#BDE5FF';
const GRASS_FAR = '#A9E4A2';
const GRASS = '#7ED07D';
const GRASS_NEAR = '#63BF68';
const GRASS_DARK = '#4FA95A';

/** Peso do traço na tela, em pixels, para tudo o que entra numa cena. */
const TRACO = 6.5;

/** Coloca um desenho de prancheta 1000 x 1000 na cena, mantendo o peso do traço. */
function place(fn, x, y, s) {
  return G(`translate(${n(x)},${n(y)}) scale(${s})`, withOutline(TRACO / s, fn));
}

/** Arca de Noé. Caixa local de 1200 x 820; o casco apoia no chão em y = 692. */
function arca() {
  const wood = '#B97A45';
  const light = '#D9A066';
  const dark = '#8F5A2E';
  const roof = '#E0625A';
  const roofDark = '#C2443D';
  const hole = '#5A3B4E';
  const hullD = 'M40 360 Q600 424 1160 360 Q1134 640 900 692 L300 692 Q66 640 40 360Z';
  const roofD = 'M244 208 L330 96 L870 96 L956 208Z';
  const rampD = 'M512 688 L688 688 L764 814 L436 814Z';
  let s = '';

  // casa em cima do convés
  s += R(300, 196, 600, 240, 16, '#E7BC85');
  s += L('M375 204 L375 400 M525 204 L525 400 M675 204 L675 400 M825 204 L825 400', { color: '#CDA06A', sw: o(0.6) });
  for (const x of [450, 600, 750]) {
    s += P(`M${x - 40} 356 L${x - 40} 296 A40 40 0 0 1 ${x + 40} 296 L${x + 40} 356Z`, hole);
    s += R(x - 52, 350, 104, 18, 8, light);
  }
  s += P(roofD, roof);
  s += clipD(roofD, L('M200 134 L1000 134 M200 172 L1000 172', { color: roofDark, sw: o(0.7) }));
  s += R(316, 78, 568, 30, 14, roofDark);

  // casco
  s += P(hullD, wood);
  s += clipD(
    hullD,
    P('M0 340 Q600 424 1200 340 L1200 396 Q600 482 0 396Z', light, { sw: 0 }) +
      L('M0 396 Q600 482 1200 396', { color: dark, sw: o(0.7) }) +
      L('M0 480 Q600 562 1200 480 M0 566 Q600 640 1200 566 M100 640 Q600 690 1100 640', { color: dark, sw: o(0.6) }) +
      L('M210 440 L216 512 M410 462 L412 536 M850 458 L846 532 M1010 436 L1002 508 M320 544 L326 606 M900 540 L892 602', {
        color: dark,
        sw: o(0.6),
      })
  );
  s += L(hullD);

  // escotilhas
  for (const x of [250, 950]) {
    s += Ci(x, 520, 44, light) + Ci(x, 520, 26, hole, { sw: o(0.7) });
  }

  // porta aberta e rampa
  s += P('M518 692 L518 548 A82 82 0 0 1 682 548 L682 692Z', hole);
  s += P(rampD, light);
  s += clipD(rampD, L('M400 720 L800 720 M400 752 L800 752 M400 784 L800 784', { color: dark, sw: o(0.6) }));
  return s;
}

function sun(x, y, r) {
  let rays = '';
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2;
    const c = Math.cos(t);
    const sn = Math.sin(t);
    rays += tube(`M${n(x + c * r * 1.34)} ${n(y + sn * r * 1.34)} L${n(x + c * r * 1.66)} ${n(y + sn * r * 1.66)}`, r * 0.15, '#FFD23F');
  }
  return rays + Ci(x, y, r, '#FFD23F') + E(x - r * 0.3, y - r * 0.32, r * 0.34, r * 0.22, '#FFE680', { sw: 0, rot: -35 });
}

function skyCloud(x, y, s = 1) {
  return G(
    `translate(${x},${y}) scale(${s})`,
    withOutline(o(1 / s), () =>
      cloud(
        [
          [-110, 10, 60],
          [-40, -30, 80],
          [50, -20, 72],
          [120, 14, 56],
          [0, 24, 76],
          [-60, 30, 60],
          [70, 34, 58],
        ],
        { shade: '#D6E6F8', sx: -5, sy: -9 }
      )
    )
  );
}

/** Árvore; (x, y) é a base do tronco. */
function tree(x, y, s = 1) {
  return G(
    `translate(${x},${y}) scale(${s})`,
    withOutline(o(1 / s), () =>
      tube('M0 0 L0 -130', 34, '#A66A34') +
      cloud(
        [
          [-72, -176, 62],
          [0, -236, 78],
          [74, -178, 60],
          [0, -156, 72],
          [-42, -214, 56],
          [46, -218, 56],
        ],
        { fill: '#5DBB7A', shade: '#3F9E60', sx: -6, sy: -10 }
      )
    )
  );
}

function bush(x, y, s = 1) {
  return G(
    `translate(${x},${y}) scale(${s})`,
    withOutline(o(1 / s), () =>
      cloud(
        [
          [-70, 0, 46],
          [-14, -34, 58],
          [52, -10, 50],
          [0, 10, 52],
        ],
        { fill: '#5DBB7A', shade: '#3F9E60', sx: -5, sy: -8 }
      )
    )
  );
}

function flower(x, y, s, color) {
  let petals = '';
  for (let i = 0; i < 5; i++) {
    const t = (i / 5) * Math.PI * 2 - Math.PI / 2;
    petals += Ci(x + Math.cos(t) * 13 * s, y + Math.sin(t) * 13 * s, 10 * s, color, { sw: o(0.55) });
  }
  return L(`M${x} ${y} L${x} ${n(y + 38 * s)}`, { color: GRASS_DARK, sw: o(0.8) }) + petals + Ci(x, y, 8 * s, '#FFD23F', { sw: o(0.55) });
}
const tuft = (x, y) => L(`M${x - 14} ${y} l5 -20 M${x} ${y} l0 -27 M${x + 14} ${y} l-5 -20`, { color: GRASS_DARK, sw: o(0.8) });

function flowers(list) {
  const colors = ['#FF8FB1', '#FFFFFF', '#FFB23A', '#C9B4F2'];
  return list.map(([x, y, s], i) => flower(x, y, s || 1, colors[i % colors.length])).join('');
}

/** Abertura: a arca num campo verde. Com `comTuti`, a Tuti aparece acenando na frente. */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = R(0, 0, 1920, 1080, 0, SKY, { sw: 0 });
    s += E(960, 720, 1400, 300, '#DDF3FF', { sw: 0 });
    s += `<g id="sol">${sun(250, 180, 88)}</g>`;
    s += `<g id="nv1">${skyCloud(650, 150, 0.95)}</g><g id="nv2">${skyCloud(1560, 120, 1.1)}</g>`;
    // morros ao fundo
    s += P('M-20 650 Q280 480 660 620 Q960 500 1380 610 Q1680 520 1940 610 L1940 1100 L-20 1100Z', GRASS_FAR);
    s += tree(118, 660, 0.9) + bush(1820, 640, 1.1);
    // campo
    s += P('M-20 770 Q480 700 960 748 Q1480 800 1940 730 L1940 1100 L-20 1100Z', GRASS);
    s += tuft(760, 800) + tuft(1840, 800) + tuft(120, 820);
    // arca
    s += E(1240, 842, 520, 30, '#3D2C4E', { sw: 0, opacity: 0.14 });
    s += G('translate(700,196) scale(0.92)', withOutline(TRACO / 0.92, arca));
    // primeiro plano
    s += P('M-20 970 Q520 900 1040 968 Q1500 1016 1940 950 L1940 1100 L-20 1100Z', GRASS_NEAR);
    s += flowers([
      [830, 990, 1.3],
      [1010, 1024, 1.1],
      [1480, 1010, 1.4],
      [1720, 1030, 1.1],
      [90, 1010, 1.3],
      [1290, 1040, 1],
    ]);
    s += tuft(660, 1040) + tuft(1620, 1050) + tuft(1150, 1000);
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau'));
    return s;
  });
}

/**
 * Encerramento: a arca em terra firme, arco-íris no céu, Noé, a família e os
 * animais felizes. Com `comTuti`, a Tuti aparece dando tchau.
 */
function cenaEncerramento({ comTuti = true } = {}) {
  const feliz = { happy: true, mouth: 'aberta', behind: '' };
  return withOutline(TRACO, () => {
    let s = R(0, 0, 1920, 1080, 0, SKY, { sw: 0 });
    s += E(960, 720, 1400, 300, '#DDF3FF', { sw: 0 });
    s += `<g id="sol">${sun(210, 150, 78)}</g>`;
    s += `<g id="arco">${withOutline(TRACO, () => rainbowArc(1010, 840, 770, 29))}</g>`;
    s += `<g id="nv1">${skyCloud(520, 120, 0.8)}</g><g id="nv2">${skyCloud(1700, 250, 0.9)}</g>`;
    s += `<g id="pomba">${G('translate(600,150) scale(0.2)', withOutline(TRACO / 0.2, animais.pomba))}</g>`;
    // morros ao fundo e o monte onde a arca parou
    s += P('M-20 690 Q260 560 600 660 Q900 600 1300 660 Q1660 580 1940 660 L1940 1100 L-20 1100Z', GRASS_FAR);
    s += P('M640 760 Q820 560 1190 566 Q1560 560 1760 760Z', '#C7B08A');
    s += G('translate(830,150) scale(0.62)', withOutline(TRACO / 0.62, arca));
    // campo
    s += P('M-20 760 Q480 700 960 742 Q1480 790 1940 724 L1940 1100 L-20 1100Z', GRASS);
    s += tuft(480, 800) + tuft(1100, 790) + tuft(1880, 780);
    // animais
    s += `<g id="b1">${place(animais.girafa, 1372, 312, 0.62)}</g>`;
    s += `<g id="b2">${place(animais.elefante, 1136, 468, 0.44)}</g>`;
    s += `<g id="b3">${place(animais.elefante, 1296, 566, 0.46)}</g>`;
    s += `<g id="b4">${place(animais.leao, 1596, 672, 0.36)}</g>`;
    // Noé e a família
    s += `<g id="g2">${place(() => pessoas.esposa(feliz), 532, 566, 0.4)}</g>`;
    s += `<g id="g1">${place(() => pessoas.noe(Object.assign({}, feliz, { armL: [300, 470], armR: [700, 470] })), 352, 572, 0.42)}</g>`;
    s += `<g id="g4">${place(() => pessoas.nora(Object.assign({}, feliz, { armR: [700, 500] })), 882, 584, 0.39)}</g>`;
    s += `<g id="g3">${place(() => pessoas.filho(Object.assign({}, feliz, { armL: [300, 480], armR: [700, 480] })), 706, 590, 0.41)}</g>`;
    // primeiro plano
    s += P('M-20 990 Q520 930 1040 990 Q1500 1036 1940 976 L1940 1100 L-20 1100Z', GRASS_NEAR);
    s += flowers([
      [470, 1030, 1.2],
      [1130, 1040, 1.2],
      [1560, 1046, 1.1],
      [1840, 1030, 1.3],
      [760, 1050, 1],
    ]);
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau'));
    return s;
  });
}

/** Fundo da tela de pergunta: céu limpo para os cards e um gramado para a Tuti. */
function fundoQuiz() {
  return withOutline(TRACO, () => {
    let s = R(0, 0, 1920, 1080, 0, SKY, { sw: 0 });
    s += E(960, 860, 1500, 360, '#DDF3FF', { sw: 0 });
    s += skyCloud(150, 150, 0.8) + skyCloud(1790, 176, 0.86);
    s += P('M-20 936 Q480 884 960 918 Q1480 952 1940 902 L1940 1100 L-20 1100Z', GRASS);
    s += tuft(600, 970) + tuft(1480, 978) + tuft(1790, 960) + tuft(820, 1000);
    s += P('M-20 1040 Q520 1000 1040 1036 Q1500 1066 1940 1026 L1940 1100 L-20 1100Z', GRASS_NEAR);
    s += flowers([
      [560, 1022, 1.1],
      [1420, 1016, 1.2],
      [1790, 1030, 1.1],
      [900, 1046, 1],
      [1640, 1054, 0.9],
    ]);
    return s;
  });
}

const CORES = { SKY, GRASS_FAR, GRASS, GRASS_NEAR, GRASS_DARK };

module.exports = { arca, cenaAbertura, cenaEncerramento, fundoQuiz, sun, skyCloud, tree, bush, flowers, tuft, place, TRACO, CORES };
