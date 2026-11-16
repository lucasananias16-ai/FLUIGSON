'use strict';
/**
 * Vídeo 13 — thumbnail para o YouTube (1280 x 720), no modelo escolhido para o
 * canal (o "C" do Vídeo 1): a Tuti apontando, "QUIZ" bem grande, a cena da
 * brincadeira e três cards numerados. Aqui é um dia de neve, com a Tuti de gorro.
 *
 * Uso: node src/v13/thumbnail.js
 *
 * Cards: barco, grande peixe e tempestade.
 *
 * A escolhida é gravada como v13_thumbnail.png; as opções ficam em `opcoes`.
 */
const path = require('path');
const kit = require('../kit');
const { P, G, withOutline } = kit;
const { tuti } = require('../tuti');
const cenario = require('../art/cenario');
const noel = require('../art/noel');
const pessoas = require('../art/pessoas');
const animais = require('../art/animais');
const objetos = require('../art/objetos');
const { letreiro, ceu, card, gravar, APONTA, TRACO } = require('../thumb');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'v13-biblico-jonas', 'youtube');
const ESCOLHIDA = 'A';

const praia = () =>
  P('M-20 700 Q560 680 1100 700 Q1520 716 1940 690 L1940 1100 L-20 1100Z', '#3E8FE0') +
  P('M-20 930 Q560 880 1100 920 Q1520 950 1940 900 L1940 1100 L-20 1100Z', '#F6D99A');

/** A parte que não muda: céu, mar, areia, a Tuti e o título. `cena` é o que fica no meio. */
function base(cena) {
  return withOutline(TRACO, () => {
    let s = ceu(1300, 620);
    s += cenario.skyCloud(250, 140, 1.0);
    s += praia();
    s += cena();
    s += G('translate(-90,120) scale(0.98)', tuti(APONTA, { shadow: false }));
    s += letreiro('QUIZ BÍBLICO', 1310, 280, 170, '#FFD23F', { stroke: 30, rot: -4 });
    s += letreiro('Jonas e o Grande Peixe', 1330, 440, 92, '#FFFFFF', { stroke: 26, rot: -4 });
    return s;
  });
}

const mar = require('../art/mar');
const opcaoA = () =>
  base(
    () =>
      card(1040, 800, 290, -6, '#FFF1B8', objetos.barco, 1, 0.74) +
      card(1350, 770, 330, 0, '#CFE6FF', mar.grandePeixe, 2, 0.74) +
      card(1660, 800, 290, 6, '#E4DAFB', mar.tempestade, 3, 0.74)
  );

gravar(
  [
    ['A', opcaoA],
  ],
  { outDir: OUT, prefixo: 'v13', escolhida: ESCOLHIDA }
);
