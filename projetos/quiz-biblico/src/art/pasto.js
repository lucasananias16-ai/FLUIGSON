'use strict';
/**
 * Cenários do Vídeo 2: o pasto de Davi. Cenas em 1920 x 1080, no mesmo traço
 * e nas mesmas cores do Vídeo 1.
 *
 * Os elementos que a animação mexe ficam em grupos com `id` (nuvens, sol,
 * ovelhas, pedrinhas, a moita que esconde a ovelha).
 */
const { n, o, withOutline, P, E, Ci, R, L, G, blob, clipD, cloud } = require('../kit');
const { sun, skyCloud, tree, bush, flowers, tuft, place, TRACO, CORES } = require('./cenario');
const pessoas = require('./pessoas');
const animais = require('./animais');
const { tuti } = require('../tuti');

const { SKY, GRASS_FAR, GRASS, GRASS_NEAR } = CORES;

const ceu = (sol = [250, 180, 88]) =>
  R(0, 0, 1920, 1080, 0, SKY, { sw: 0 }) +
  E(960, 720, 1400, 300, '#DDF3FF', { sw: 0 }) +
  `<g id="sol">${sun(sol[0], sol[1], sol[2])}</g>`;

const nuvens = (a, b) => `<g id="nv1">${skyCloud(a[0], a[1], a[2])}</g><g id="nv2">${skyCloud(b[0], b[1], b[2])}</g>`;

/** Pedra do pasto. */
function pedra(cx, cy, rx, ry, seed) {
  const d = blob(cx, cy, rx, ry, seed, 0.1, 8);
  return P(d, '#B8B5C6') + clipD(d, P(blob(cx - rx * 0.16, cy - ry * 0.34, rx * 0.78, ry * 0.62, seed + 7, 0.1, 8), '#D5D2E0', { sw: 0 })) + L(d);
}

/** Onde a ovelhinha do desafio 1 se esconde (canto de cima à esquerda do desenho dela). */
const ESCONDERIJO = { x: 1300, y: 500 };

const ovelhaEm = (id, x, y, s, opts) => `<g id="${id}">${place(() => animais.ovelha(opts), x, y, s)}</g>`;

/** Abertura: Davi menino no pasto com as ovelhas. */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = ceu() + nuvens([650, 150, 0.95], [1560, 120, 1.1]);
    s += P('M-20 650 Q280 480 660 620 Q960 500 1380 610 Q1680 520 1940 610 L1940 1100 L-20 1100Z', GRASS_FAR);
    s += tree(118, 660, 0.9) + tree(1790, 640, 1.0) + bush(1040, 636, 0.9);
    s += ovelhaEm('o3', 1380, 470, 0.26);
    s += P('M-20 770 Q480 700 960 748 Q1480 800 1940 730 L1940 1100 L-20 1100Z', GRASS);
    s += tuft(760, 800) + tuft(1840, 800) + tuft(120, 820);
    s += ovelhaEm('o2', 640, 690, 0.34, { feliz: true });
    s += `<g id="dv">${place(() => pessoas.daviPastor(), 870, 396, 0.6)}</g>`;
    s += ovelhaEm('o1', 1400, 624, 0.44);
    s += P('M-20 970 Q520 900 1040 968 Q1500 1016 1940 950 L1940 1100 L-20 1100Z', GRASS_NEAR);
    s += flowers([
      [830, 1010, 1.3],
      [1100, 1040, 1.1],
      [1560, 1030, 1.4],
      [1820, 1040, 1.1],
      [90, 1010, 1.3],
    ]);
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau'));
    return s;
  });
}

/**
 * Desafio 1 — Achar: um pasto com moitas, pedras e uma árvore. A ovelhinha
 * fica atrás da moita `moita`, só com as orelhas e o topete aparecendo.
 */
function cenaAchar() {
  return withOutline(TRACO, () => {
    let s = ceu([1700, 250, 70]) + nuvens([560, 250, 0.7], [1280, 230, 0.6]);
    s += P('M-20 600 Q300 470 700 560 Q1100 470 1500 550 Q1750 490 1940 540 L1940 1100 L-20 1100Z', GRASS_FAR);
    s += tree(700, 640, 1.15) + bush(1130, 580, 0.9) + pedra(980, 606, 56, 38, 5);
    s += P('M-20 780 Q500 700 1000 752 Q1500 800 1940 730 L1940 1100 L-20 1100Z', GRASS);
    s += tuft(620, 830) + tuft(1180, 800) + tuft(1840, 820) + tuft(960, 930);
    s += pedra(660, 880, 78, 50, 11) + bush(900, 800, 1.2);
    // a ovelhinha escondida e a moita na frente dela: a moita é mais baixa do
    // lado da cabeça, e só as orelhas e o topete ficam de fora
    const T = ESCONDERIJO;
    s += `<g id="oculta">${place(() => animais.ovelha(), T.x, T.y, 0.34)}</g>`;
    s += `<g id="moita">${cloud(
      [
        [T.x + 100, T.y + 250, 100],
        [T.x + 275, T.y + 205, 112],
        [T.x + 400, T.y + 262, 96],
        [T.x + 250, T.y + 312, 110],
        [T.x + 110, T.y + 312, 84],
        [T.x + 380, T.y + 320, 80],
      ],
      { fill: '#5DBB7A', shade: '#3F9E60', sx: -6, sy: -10 }
    )}</g>`;
    s += pedra(1700, 968, 66, 42, 23);
    s += P('M-20 1010 Q520 960 1040 1004 Q1500 1040 1940 990 L1940 1100 L-20 1100Z', GRASS_NEAR);
    s += flowers([
      [560, 1030, 1.2],
      [1180, 1040, 1.2],
      [1840, 1040, 1.2],
      [800, 1056, 1],
    ]);
    return s;
  });
}

/** Desafio 2 — Contar: o riacho com cinco pedrinhas lisas (ids p1 a p5). */
function cenaRiacho() {
  const agua = 'M-20 600 C300 560 520 660 920 620 C1320 580 1520 660 1940 610 L1940 800 C1520 850 1320 770 920 810 C520 850 300 760 -20 800Z';
  return withOutline(TRACO, () => {
    let s = ceu([250, 160, 76]) + nuvens([700, 150, 0.8], [1560, 140, 0.9]);
    s += P('M-20 520 Q300 420 700 500 Q1100 420 1500 490 Q1750 440 1940 480 L1940 1100 L-20 1100Z', GRASS_FAR);
    s += tree(1760, 520, 0.9) + bush(520, 512, 0.9) + bush(1240, 500, 0.8);
    s += P('M-20 590 Q500 540 1000 580 Q1500 620 1940 570 L1940 1100 L-20 1100Z', GRASS);
    s += P(agua, '#7CCBFF');
    s += clipD(
      agua,
      L('M120 660 Q200 640 280 660 M520 720 Q600 700 680 720 M900 690 Q980 670 1060 690 M1300 720 Q1380 700 1460 720 M1620 680 Q1700 660 1780 680 M300 760 Q360 746 420 760 M1100 770 Q1160 756 1220 770', {
        color: '#C9EBFF',
        sw: o(1),
      })
    );
    // cinco pedrinhas na beira d'água
    [600, 880, 1160, 1440, 1720].forEach((x, i) => {
      const y = 838 + (i % 2 ? 14 : 0);
      s += `<g id="p${i + 1}">` + E(x, y + 44, 92, 16, '#3D2C4E', { sw: 0, opacity: 0.14 }) + pedra(x, y, 88, 56, 40 + i * 9) + `</g>`;
    });
    s += tuft(480, 940) + tuft(1300, 960) + tuft(1860, 930);
    s += P('M-20 1010 Q520 960 1040 1004 Q1500 1040 1940 990 L1940 1100 L-20 1100Z', GRASS_NEAR);
    s += flowers([
      [560, 1040, 1.1],
      [1020, 1050, 1.1],
      [1580, 1046, 1.2],
    ]);
    return s;
  });
}

/** Desafio 4 — Comparar: Davi pequeno e Golias enorme, lado a lado no mesmo chão. */
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = ceu([200, 300, 64]) + nuvens([520, 300, 0.6], [1760, 330, 0.6]);
    s += P('M-20 700 Q300 600 700 680 Q1100 600 1500 670 Q1750 620 1940 660 L1940 1100 L-20 1100Z', GRASS_FAR);
    s += bush(500, 690, 0.9) + bush(1800, 660, 0.9);
    s += P('M-20 840 Q500 780 1000 820 Q1500 860 1940 800 L1940 1100 L-20 1100Z', GRASS);
    s += `<g id="dv">${place(() => pessoas.davi(), 590, 656, 0.36)}</g>`;
    s += `<g id="gl">${place(() => pessoas.golias(), 870, 206, 0.86)}</g>`;
    s += P('M-20 1030 Q520 990 1040 1026 Q1500 1056 1940 1016 L1940 1100 L-20 1100Z', GRASS_NEAR);
    s += flowers([
      [1820, 1040, 1.1],
      [460, 1046, 1],
    ]);
    return s;
  });
}

/** Encerramento: Davi sorrindo com a funda, as ovelhas ao redor, céu ensolarado. */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = ceu([1640, 190, 100]) + nuvens([560, 150, 0.9], [1150, 110, 0.7]);
    s += P('M-20 650 Q280 480 660 620 Q960 500 1380 610 Q1680 520 1940 610 L1940 1100 L-20 1100Z', GRASS_FAR);
    s += tree(1820, 640, 0.9) + bush(1180, 610, 0.8) + tree(118, 660, 0.8);
    s += ovelhaEm('o4', 1500, 476, 0.26, { feliz: true });
    s += P('M-20 770 Q480 700 960 748 Q1480 800 1940 730 L1940 1100 L-20 1100Z', GRASS);
    s += tuft(760, 800) + tuft(1840, 800);
    s += ovelhaEm('o3', 610, 686, 0.34, { feliz: true });
    s += `<g id="dv">${place(() => pessoas.davi({ happy: true, mouth: 'aberta', armL: [300, 500] }), 800, 384, 0.62)}</g>`;
    s += ovelhaEm('o2', 1560, 650, 0.38, { feliz: true });
    s += ovelhaEm('o1', 1220, 640, 0.44);
    s += P('M-20 990 Q520 930 1040 990 Q1500 1036 1940 976 L1940 1100 L-20 1100Z', GRASS_NEAR);
    s += flowers([
      [470, 1030, 1.2],
      [1130, 1046, 1.2],
      [1840, 1040, 1.3],
      [760, 1050, 1],
    ]);
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau'));
    return s;
  });
}

/** Sombra de um desenho de prancheta 1000 x 1000 (desafio 3). */
function sombra(arte, id = 'silhueta') {
  return (
    `<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%"><feColorMatrix type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.11  0 0 0 0 0.2  0 0 0 1 0"/></filter>` +
    `<g filter="url(#${id})">${arte}</g>`
  );
}
const sombraGolias = () => sombra(pessoas.golias({ shadow: false }));

module.exports = { cenaAbertura, cenaAchar, cenaRiacho, cenaComparar, cenaEncerramento, sombra, sombraGolias, pedra, ESCONDERIJO };
