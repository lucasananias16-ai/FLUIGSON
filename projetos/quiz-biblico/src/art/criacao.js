'use strict';
/**
 * Desenhos e cenários do Vídeo 16: a Criação do Mundo. Um jardim de dia (o
 * céu com gramado dos quizzes bíblicos, com árvores e flores) e o céu da noite
 * para contar as estrelas. As cenas têm os mesmos nomes e `id` das do Vídeo 4.
 */
const { n, o, withOutline, P, E, Ci, R, L, G, tube, sparkle, shadow, cloud } = require('../kit');
const { place, fundoQuiz, tree, skyCloud, sun, flowers, TRACO } = require('./cenario');
const { ceuNoite } = require('./natal');
const ceuNatal = require('./ceuNatal');
const animais = require('./animais');
const objetos = require('./objetos');
const { tuti } = require('../tuti');

// ------------------------------------------------------------ desenhos de card (prancheta 1000 x 1000)
/** A luz: um clarão amarelo com raios e brilhos. */
function luz() {
  let raios = '';
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const r1 = 200;
    const r2 = i % 2 ? 330 : 400;
    raios += `M${n(500 + r1 * Math.cos(a))} ${n(500 + r1 * Math.sin(a))} L${n(500 + r2 * Math.cos(a))} ${n(500 + r2 * Math.sin(a))} `;
  }
  return (
    `<circle cx="500" cy="500" r="420" fill="#FFF3B0" opacity="0.6"/>` +
    L(raios, { color: '#FFD23F', sw: o(3.2) }) +
    Ci(500, 500, 180, '#FFE680') +
    Ci(500, 500, 110, '#FFFFFF', { sw: 0, opacity: 0.8 }) +
    sparkle(200, 220, 40, 0, '#FFFFFF') + sparkle(800, 780, 34, 10, '#FFFFFF')
  );
}
const casa = () => shadow(500, 880, 330) + ceuNatal.casinha(500, 860, 520, '#E8A66B');
const arvore = () => shadow(500, 900, 260) + tree(500, 900, 2.6);
/** Flor; `cor` é a cor das pétalas. */
function flor(cor = '#FFD23F') {
  const petalas = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = (i / 6) * Math.PI * 2;
    return E(500 + 130 * Math.cos(a), 360 + 130 * Math.sin(a), 95, 70, cor, { rot: (a * 180) / Math.PI });
  });
  return shadow(500, 900, 200) + tube('M500 900 Q480 700 500 480', 34, '#3F9E60') + E(410, 700, 90, 40, '#5DBB7A', { rot: -30 }) + petalas.join('') + Ci(500, 360, 85, '#FF8A3A') + Ci(470, 330, 20, '#FFFFFF', { sw: 0, opacity: 0.6 });
}
const florCor = (cor) => () => flor(cor);
/** Céu da noite, só com estrelas (o "o que falta" é a lua, no canto de cima à direita). */
function noite() {
  return (
    R(90, 90, 820, 820, 60, '#27386E') +
    [[230, 260, 26], [420, 180, 18], [300, 470, 22], [520, 380, 16], [200, 680, 18], [460, 620, 24], [640, 560, 18], [780, 720, 22], [600, 780, 16]].map(([x, y, r], i) => sparkle(x, y, r, i * 13, '#FFFFFF')).join('') +
    P('M90 800 Q500 740 910 800 L910 910 L90 910Z', '#2F7553', { sw: 0 })
  );
}
/** A lua do "o que falta": cai no canto do céu da noite. */
const luaNoite = () => G('translate(620,140) scale(0.3)', withOutline(o(1 / 0.3), objetos.lua));
/** Descansar: a cama com o travesseiro e os "Z". */
function descansar() {
  return (
    shadow(500, 880, 380) +
    R(150, 520, 700, 240, 30, '#4DA3FF') + R(130, 440, 60, 400, 20, '#8F5A2E') + R(810, 560, 60, 280, 20, '#8F5A2E') +
    E(300, 500, 120, 60, '#FFFFFF') + R(380, 500, 450, 80, 30, '#FFD9E4') +
    `<text x="640" y="320" font-family="Fredoka" font-weight="700" font-size="140" fill="#9B7EDE" stroke="#3D2C4E" stroke-width="10" paint-order="stroke">Z</text>` +
    `<text x="760" y="220" font-family="Fredoka" font-weight="700" font-size="100" fill="#9B7EDE" stroke="#3D2C4E" stroke-width="8" paint-order="stroke">z</text>`
  );
}
/** Correr: o tênis com risquinhos de velocidade. */
function correr() {
  return (
    shadow(520, 860, 330) +
    L('M90 420 L250 420 M60 520 L230 520 M110 620 L240 620', { color: '#9BB7E0', sw: o(2) }) +
    P('M300 760 L300 470 Q300 400 380 400 L520 400 Q560 520 700 560 Q860 600 880 700 L880 760Z', '#E25A52') +
    R(280, 740, 620, 70, 30, '#FFFFFF') +
    L('M400 470 L470 470 M410 530 L500 530 M420 590 L530 590', { color: '#FFFFFF', sw: o(1.6) })
  );
}
/** Nadar: a boia na água. */
function nadar() {
  return (
    P('M80 640 Q200 600 320 640 T560 640 T800 640 T920 640 L920 900 L80 900Z', '#4DA3FF') +
    L('M150 720 Q200 700 250 720 M500 760 Q550 740 600 760 M760 720 Q810 700 860 720', { color: '#CFE6FF', sw: o(1.2) }) +
    Ci(500, 520, 230, '#FFFFFF') + Ci(500, 520, 110, '#4DA3FF', { sw: o(1) }) +
    P('M500 290 A230 230 0 0 1 730 520 L610 520 A110 110 0 0 0 500 410Z', '#E25A52', { sw: o(0.8) }) +
    P('M500 750 A230 230 0 0 1 270 520 L390 520 A110 110 0 0 0 500 630Z', '#E25A52', { sw: o(0.8) })
  );
}

// ------------------------------------------------------------ cenários (1920 x 1080)
const sobre = (fn, cx, base, s) => place(fn, cx - 500 * s, base - 900 * s, s);
/** O jardim: o céu com gramado, árvores dos lados e flores. */
const jardim = () => fundoQuiz() + tree(1850, 930, 1.2);
const fundoNeve = () => withOutline(TRACO, () => fundoQuiz() + '<g id="neveF"></g>');
const flocos = () => '';

/** Abertura: o jardim com o sol, bichos e flores. */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = jardim() + sun(1500, 190, 70);
    s += `<g id="o1">${sobre(() => animais.ovelha(), 1180, 990, 0.24)}${sobre(animais.girafa, 1520, 985, 0.34)}</g>`;
    s += sobre(florCor('#FFD23F'), 960, 1000, 0.12) + sobre(florCor('#FF8FB1'), 1700, 1010, 0.12);
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau'));
    return s;
  });
}

/** Onde o passarinho se esconde (desafio 1): atrás da árvore (`arvoreEsc`). */
const ESCONDERIJO = { x: 1290, chao: 620, s: 0.22, arvore: { x: 1250, y: 960 } };
function cenaAchar() {
  return withOutline(TRACO, () => {
    const E_ = ESCONDERIJO;
    let s = fundoQuiz();
    // a ponta da asa e o rabo ficam de fora, à direita da copa: é a pista
    s += `<g id="oculta">${sobre(animais.pomba, E_.x + 250, E_.chao, E_.s)}</g>`;
    s += `<g id="arvoreEsc">${tree(E_.arvore.x, E_.arvore.y, 2.3)}</g>`;
    s += sobre(florCor('#FFD23F'), 800, 1000, 0.1);
    return s;
  });
}

/** Desafio 2 — Contar: cinco estrelas no céu da noite (ids p1 a p5). */
const RENAS_X = [740, 960, 1180, 1400, 1620];
function cenaRenas() {
  return withOutline(TRACO, () => {
    let s = ceuNoite();
    s += P('M-20 880 Q480 830 960 862 Q1480 896 1940 846 L1940 1100 L-20 1100Z', '#2F7553');
    s += P('M-20 1000 Q520 960 1040 996 Q1500 1026 1940 986 L1940 1100 L-20 1100Z', '#245F45');
    RENAS_X.forEach((x, i) => {
      s += `<g id="p${i + 1}">${sobre(objetos.estrela, x, 580 + (i % 2 ? 40 : 0), 0.24)}</g>`;
    });
    return s;
  });
}

/** Desafio 6 — Comparar: a ovelhinha (`ov`, à esquerda) e o elefante (`ca`, à direita). */
const CHAO = 960;
const PEQUENO = { x: 900, s: 0.3 };
const GRANDE = { x: 1420, s: 0.72 };
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = fundoQuiz();
    s += `<g id="ov">${sobre(() => animais.ovelha(), PEQUENO.x, CHAO, PEQUENO.s)}</g>`;
    s += `<g id="ca">${sobre(animais.elefante, GRANDE.x, CHAO, GRANDE.s)}</g>`;
    return s;
  });
}

/** Encerramento: o jardim completo, com o sol, os bichos (`o1`, `o2`) e flores. */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = jardim() + sun(1500, 190, 80);
    s += `<g id="o1">${sobre(animais.elefante, 1000, 990, 0.3)}${sobre(() => animais.ovelha(), 1260, 1000, 0.2)}</g>`;
    s += `<g id="o2">${sobre(animais.girafa, 1560, 990, 0.36)}${sobre(animais.pomba, 1330, 600, 0.16)}</g>`;
    s += sobre(florCor('#FFD23F'), 820, 1010, 0.12) + sobre(florCor('#FF8FB1'), 1760, 1010, 0.12);
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau'));
    return s;
  });
}

module.exports = { luz, casa, arvore, flor, florCor, noite, luaNoite, descansar, correr, nadar, fundoNeve, flocos, cenaAbertura, cenaAchar, cenaRenas, cenaComparar, cenaEncerramento, ESCONDERIJO, RENAS_X, CHAO, GRANDE, PEQUENO };
