'use strict';
/**
 * Cenários do Vídeo 3: o Natal de Jesus. Cenas em 1920 x 1080, no mesmo traço
 * dos outros vídeos. De noite no campo dos pastores (abertura, desafio 1 e
 * encerramento), com a luz do entardecer no deserto dos magos (desafio 4) e
 * uma sala acolhedora para os presentes (desafio 2).
 *
 * Os elementos que a animação mexe ficam em grupos com `id`.
 */
const { n, o, withOutline, P, E, Ci, R, L, G, cloud, tube, sparkle } = require('../kit');
const { sun, skyCloud, tree, bush, flowers, tuft, place, TRACO } = require('./cenario');
const pessoas = require('./pessoas');
const animais = require('./animais');
const objetos = require('./objetos');
const { tuti } = require('../tuti');

const NOITE = '#27386E';
const NOITE_MEIO = '#34498F';
const NOITE_HORIZ = '#5A78C2';
const MORRO_LONGE = '#4E9F7A';
const MORRO = '#3C8A63';
const MORRO_PERTO = '#2F7553';
const MORRO_ESCURO = '#245F45';

/** Céu de noite: três faixas suaves e pontinhos de luz fixos. */
function ceuNoite() {
  const brilhos = [
    [140, 120, 16], [420, 250, 12], [760, 110, 14], [1010, 260, 10], [1290, 130, 16], [1500, 300, 12],
    [1780, 150, 14], [300, 420, 10], [900, 420, 12], [1180, 470, 10], [1700, 460, 14], [560, 40, 10],
  ];
  return (
    R(0, 0, 1920, 1080, 0, NOITE, { sw: 0 }) +
    E(960, 560, 1700, 460, NOITE_MEIO, { sw: 0 }) +
    E(960, 820, 1500, 300, NOITE_HORIZ, { sw: 0, opacity: 0.8 }) +
    brilhos.map(([x, y, r], i) => sparkle(x, y, r, i * 17, '#FFFFFF')).join('')
  );
}

/** Nuvem de noite, iluminada por baixo. `s` é a escala. */
const nuvemNoite = (x, y, s = 1) =>
  G(
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
        { fill: '#E6EEFF', shade: '#AEBDE3', sx: -5, sy: -9 }
      )
    )
  );

/** A estrela de Belém: brilho em volta e a estrela grande por cima. `r` é o tamanho. */
function estrelaGrande(cx, cy, r) {
  const s = (r * 3.4) / 1000;
  return (
    `<defs><radialGradient id="brilhoEstrela" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${n(r * 2.4)}">` +
    `<stop offset="0" stop-color="#FFF3B0" stop-opacity="0.85"/><stop offset="0.45" stop-color="#FFE680" stop-opacity="0.4"/><stop offset="1" stop-color="#FFE680" stop-opacity="0"/>` +
    `</radialGradient></defs>` +
    `<circle cx="${cx}" cy="${cy}" r="${n(r * 2.4)}" fill="url(#brilhoEstrela)"/>` +
    place(objetos.estrela, cx - 500 * s, cy - 520 * s, s)
  );
}

const ovelhaEm = (id, x, y, s, opts) => `<g id="${id}">${place(() => animais.ovelha(opts), x, y, s)}</g>`;
/** Pessoa com o centro em `x` e os pés em `chao`. */
const pessoaEm = (id, fn, x, chao, s, cfg) => `<g id="${id}">${place(() => fn(cfg), x - 500 * s, chao - 905 * s, s)}</g>`;

const morros = (topo) =>
  P(`M-20 ${topo + 120} Q300 ${topo - 60} 700 ${topo + 70} Q1100 ${topo - 40} 1500 ${topo + 60} Q1750 ${topo - 20} 1940 ${topo + 40} L1940 1100 L-20 1100Z`, MORRO_LONGE);

/** Abertura: noite no campo, a estrela grande no céu, um pastor e as ovelhas. */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = ceuNoite();
    s += `<g id="nv1">${nuvemNoite(640, 190, 0.95)}</g><g id="nv2">${nuvemNoite(1300, 120, 0.8)}</g>`;
    s += `<g id="estrela">${estrelaGrande(1660, 340, 110)}</g>`;
    s += morros(640);
    s += tree(118, 700, 0.9) + bush(1060, 676, 0.9);
    s += P('M-20 790 Q480 720 960 768 Q1480 820 1940 750 L1940 1100 L-20 1100Z', MORRO);
    s += tuft(760, 820) + tuft(1840, 820) + tuft(120, 840);
    s += ovelhaEm('o3', 1380, 520, 0.26);
    s += ovelhaEm('o2', 640, 710, 0.34, { feliz: true });
    s += pessoaEm('pa', pessoas.pastor, 1160, 840, 0.56);
    s += ovelhaEm('o1', 1400, 650, 0.44);
    s += P('M-20 980 Q520 910 1040 978 Q1500 1026 1940 960 L1940 1100 L-20 1100Z', MORRO_PERTO);
    s += flowers([
      [830, 1020, 1.3],
      [1100, 1046, 1.1],
      [1560, 1040, 1.4],
      [1820, 1050, 1.1],
      [90, 1020, 1.3],
    ]);
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau'));
    return s;
  });
}

/** Onde a estrelinha do desafio 1 se esconde: o centro dela e o tamanho da nuvem que a cobre. */
const ESCONDERIJO = { x: 1093, y: 371, nuvem: { x: 1290, y: 470, s: 1.8 } };

/**
 * Desafio 1 — Achar: céu cheio de pontinhos de luz e nuvens. A estrelinha
 * dourada (`oculta`) fica atrás da nuvem grande (`nuvemEsc`); só uma pontinha
 * aparece no alto, à esquerda.
 */
function cenaAchar() {
  return withOutline(TRACO, () => {
    const T = ESCONDERIJO;
    let s = ceuNoite();
    s += `<g id="nv1">${nuvemNoite(560, 230, 0.8)}</g><g id="nv2">${nuvemNoite(1700, 200, 0.7)}</g>`;
    s += nuvemNoite(300, 420, 0.6);
    s += morros(700);
    s += tree(1760, 740, 0.9) + bush(520, 740, 0.9);
    s += P('M-20 840 Q500 770 1000 820 Q1500 870 1940 800 L1940 1100 L-20 1100Z', MORRO);
    s += tuft(620, 890) + tuft(1180, 880) + tuft(1840, 890);
    // a estrelinha escondida e a nuvem que cobre quase tudo
    s += `<g id="oculta">${place(objetos.estrela, T.x - 500 * 0.3, T.y - 520 * 0.3, 0.3)}</g>`;
    s += `<g id="nuvemEsc">${nuvemNoite(T.nuvem.x, T.nuvem.y, T.nuvem.s)}</g>`;
    s += P('M-20 1010 Q520 960 1040 1004 Q1500 1040 1940 990 L1940 1100 L-20 1100Z', MORRO_PERTO);
    s += flowers([
      [560, 1040, 1.2],
      [1180, 1046, 1.2],
      [1840, 1040, 1.2],
    ]);
    return s;
  });
}

/** Desafio 2 — Contar: uma sala com a janela aberta para a noite e três presentes na mesa (ids p1 a p3). */
function cenaPresentes() {
  const caixas = [
    [1000, 'p1', 340, 300, '#FFD23F', '#F4B824', '#E25A52'],
    [1330, 'p2', 280, 380, '#4DA3FF', '#2E86E6', '#FFFFFF'],
    [1640, 'p3', 250, 240, '#9B7EDE', '#7F62C6', '#FFD23F'],
  ];
  return withOutline(TRACO, () => {
    let s = R(0, 0, 1920, 1080, 0, '#FFE9C7', { sw: 0 });
    s += R(0, 0, 1920, 760, 0, '#FFDDAA', { sw: 0 });
    // janela com a noite e a estrela
    s += R(520, 190, 330, 290, 30, NOITE);
    s += E(685, 440, 165, 50, NOITE_HORIZ, { sw: 0, opacity: 0.7 });
    s += sparkle(580, 260, 16, 0, '#FFFFFF') + sparkle(800, 240, 12, 14, '#FFFFFF') + sparkle(620, 400, 10, 0, '#FFFFFF');
    s += place(objetos.estrela, 710 - 500 * 0.16, 320 - 520 * 0.16, 0.16);
    s += R(520, 190, 330, 290, 30, 'none');
    s += L('M685 190 L685 480 M520 335 L850 335', { sw: o(1.2) });
    // chão e mesa
    s += P('M-20 780 L1940 780 L1940 1100 L-20 1100Z', '#E7BC85');
    s += L('M-20 880 L1940 880 M-20 980 L1940 980', { color: '#C99A5E', sw: o(0.7) });
    s += R(700, 800, 1160, 52, 24, '#B97A45');
    s += R(760, 840, 60, 180, 14, '#8F5A2E') + R(1740, 840, 60, 180, 14, '#8F5A2E');
    s += P('M690 800 L1870 800 L1840 880 L720 880Z', '#F7F3EA');
    s += L('M690 800 L1870 800', { sw: o(0.8) });
    for (const [x, id, w, h, cor, esc, fita] of caixas) s += `<g id="${id}">${objetos.caixa(x, 800, w, h, cor, esc, fita)}</g>`;
    return s;
  });
}

/** Desafio 4 — Comparar: a ovelhinha e o camelo, lado a lado na areia ao entardecer. */
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = R(0, 0, 1920, 1080, 0, '#FFC9A3', { sw: 0 });
    s += E(960, 600, 1500, 420, '#FFE3C7', { sw: 0 });
    s += `<g id="sol">${sun(240, 310, 80)}</g>`;
    s += `<g id="nv1">${skyCloud(560, 170, 0.8)}</g><g id="nv2">${skyCloud(1700, 150, 0.9)}</g>`;
    s += P('M-20 720 Q300 640 700 700 Q1100 620 1500 690 Q1750 640 1940 680 L1940 1100 L-20 1100Z', '#F4D79E');
    s += P('M-20 850 Q500 790 1000 830 Q1500 870 1940 810 L1940 1100 L-20 1100Z', '#F0C97E');
    s += `<g id="ov">${place(() => animais.ovelha(), 480, 582, 0.45)}</g>`;
    s += `<g id="ca">${place(animais.camelo, 760, 56, 1.05)}</g>`;
    s += P('M-20 1030 Q520 990 1040 1026 Q1500 1056 1940 1016 L1940 1100 L-20 1100Z', '#E6B866');
    s += L('M200 1060 Q240 1040 280 1060 M1600 1066 Q1640 1046 1680 1066', { color: '#C99A4E', sw: o(0.8) });
    return s;
  });
}

/**
 * Encerramento: a estrela sobre o estábulo, Jesus na manjedoura, Maria e José,
 * um pastor e as ovelhas. Com `comTuti`, a Tuti aparece dando tchau.
 */
function cenaEncerramento({ comTuti = true } = {}) {
  const feliz = { happy: true, mouth: 'aberta' };
  return withOutline(TRACO, () => {
    let s = ceuNoite();
    s += `<g id="nv1">${nuvemNoite(520, 150, 0.7)}</g><g id="nv2">${nuvemNoite(1760, 260, 0.8)}</g>`;
    // feixe de luz da estrela até a manjedoura
    s += P('M1130 270 L930 800 L1330 800Z', '#FFE680', { sw: 0, opacity: 0.22 });
    s += `<g id="estrela">${estrelaGrande(1130, 190, 100)}</g>`;
    s += morros(660);
    // o estábulo
    s += P('M780 800 L780 470 L1480 470 L1480 800Z', '#F4C98B');
    s += P('M740 480 L1130 330 L1520 480Z', '#C98A4B');
    s += L('M820 450 L1130 346 M1130 346 L1440 450 M880 470 L1130 380 M1130 380 L1380 470', { color: '#A66A34', sw: o(0.8) });
    s += R(762, 470, 36, 340, 12, '#8F5A2E') + R(1462, 470, 36, 340, 12, '#8F5A2E');
    s += P('M-20 800 Q480 740 960 782 Q1480 830 1940 764 L1940 1100 L-20 1100Z', MORRO);
    s += tuft(520, 840) + tuft(1860, 830);
    s += ovelhaEm('o3', 1580, 556, 0.28, { feliz: true });
    s += pessoaEm('ma', pessoas.maria, 890, 860, 0.5, feliz);
    s += pessoaEm('jo', pessoas.jose, 1370, 860, 0.5, feliz);
    s += `<g id="bb">${place(objetos.manjedouraBebe, 1130 - 500 * 0.4, 850 - 880 * 0.4, 0.4)}</g>`;
    s += pessoaEm('pa', pessoas.pastor, 1700, 900, 0.5, feliz);
    s += ovelhaEm('o2', 640, 690, 0.34, { feliz: true });
    s += ovelhaEm('o1', 1180, 700, 0.36);
    s += P('M-20 990 Q520 930 1040 990 Q1500 1036 1940 976 L1940 1100 L-20 1100Z', MORRO_PERTO);
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

module.exports = { ceuNoite, nuvemNoite, estrelaGrande, cenaAbertura, cenaAchar, cenaPresentes, cenaComparar, cenaEncerramento, ESCONDERIJO };
