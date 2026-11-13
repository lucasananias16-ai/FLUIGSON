'use strict';
/**
 * Vídeo 1 — thumbnails para o YouTube (1280 x 720), no mesmo traço do vídeo.
 *
 * Uso: node src/v1/thumbnail.js
 *
 * Opção A: título grande, a Tuti apontando e a arca com o arco-íris.
 * Opção B: a Tuti e três cards do quiz, mostrando como é a brincadeira.
 * Opção C: igual à A, com os três cards no lugar do leão e do elefante.
 *
 * A escolhida (C) é gravada como v1_thumbnail.png; as três opções ficam na
 * subpasta `opcoes`.
 */
const path = require('path');
const kit = require('../kit');
const { G, withOutline } = kit;
const { tuti } = require('../tuti');
const cenario = require('../art/cenario');
const animais = require('../art/animais');
const { rainbowArc } = require('../art/objetos');
const { letreiro, ceu, chao, card, gravar, APONTA, TRACO } = require('../thumb');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'v1-arca-de-noe', 'youtube');
const ESCOLHIDA = 'C';

const FLORES_A = [
  [760, 1030, 1.5],
  [1460, 1046, 1.4],
  [1850, 1040, 1.3],
];

/** Composição da opção A; `frente` é o que aparece na frente da arca. */
function baseA(frente, flores = FLORES_A) {
  return withOutline(TRACO, () => {
    let s = ceu(1300, 620);
    s += withOutline(TRACO, () => rainbowArc(1330, 960, 800, 38));
    s += cenario.skyCloud(250, 140, 1.0);
    s += chao();
    s += G('translate(1080,500) scale(0.64)', withOutline(TRACO / 0.64, cenario.arca));
    s += frente();
    s += cenario.flowers(flores);
    s += G('translate(-90,120) scale(0.98)', tuti(APONTA, { shadow: false }));
    s += letreiro('QUIZ', 1330, 300, 330, '#FFD23F', { stroke: 36, rot: -4 });
    s += letreiro('da Arca de Noé', 1330, 456, 132, '#FFFFFF', { stroke: 26, rot: -4 });
    return s;
  });
}

const opcaoA = () =>
  baseA(
    () =>
      G('translate(1436,584) scale(0.5)', withOutline(TRACO / 0.5, animais.elefante)) +
      G('translate(1010,650) scale(0.4)', withOutline(TRACO / 0.4, animais.leao))
  );

// Igual à A, com os três cards do quiz no lugar dos animais. Os cards ficam
// abaixo das janelas, para a arca continuar reconhecível atrás deles.
const opcaoC = () =>
  baseA(
    () =>
      card(1050, 904, 250, -6, '#FFF1B8', animais.umElefante, 1, 0.68) +
      card(1330, 886, 268, 0, '#CFE6FF', animais.leao, 2, 0.68) +
      card(1610, 904, 250, 6, '#CFF1E0', animais.girafa, 3, 0.68),
    [FLORES_A[0], FLORES_A[2]]
  );

function opcaoB() {
  return withOutline(TRACO, () => {
    let s = ceu(1240, 600);
    s += cenario.skyCloud(230, 140, 0.9);
    s += chao();
    s += card(900, 740, 360, -6, '#FFF1B8', animais.umElefante, 1);
    s += card(1290, 716, 390, 0, '#CFE6FF', animais.leao, 2);
    s += card(1680, 740, 360, 6, '#CFF1E0', animais.girafa, 3);
    s += G('translate(-150,170) scale(0.93)', tuti(Object.assign({}, APONTA, { armR: [800, 560] }), { shadow: false }));
    s += letreiro('QUIZ', 1290, 260, 270, '#FFD23F', { stroke: 34, rot: -3 });
    s += letreiro('da Arca de Noé', 1290, 400, 124, '#FFFFFF', { stroke: 26, rot: -3 });
    return s;
  });
}

gravar(
  [
    ['A', opcaoA],
    ['B', opcaoB],
    ['C', opcaoC],
  ],
  { outDir: OUT, prefixo: 'v1', escolhida: ESCOLHIDA }
);
