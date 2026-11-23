'use strict';
/**
 * Vídeo 19 — thumbnail para o YouTube (1280 x 720), no modelo escolhido para o
 * canal (o "C" do Vídeo 1): a Tuti de gorro apontando, "QUIZ" bem grande, a
 * praia de Natal e três cards numerados.
 *
 * Uso: node src/v19/thumbnail.js
 *
 * Cards: o Papai Noel de bermuda, a árvore de Natal e a água de coco.
 *
 * A escolhida é gravada como v19_thumbnail.png; as opções ficam em `opcoes`.
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
const OUT = path.join(ROOT, 'v19-natal-verao', 'youtube');
const ESCOLHIDA = 'A';
const vr = require('../art/verao');
const mar = require('../art/mar');

const areia = () =>
  P('M-20 700 Q560 680 1100 700 Q1520 716 1940 690 L1940 900 L-20 900Z', '#3E8FE0') +
  P('M-20 880 Q560 820 1100 866 Q1520 900 1940 840 L1940 1100 L-20 1100Z', '#F6D99A') +
  P('M-20 1010 Q520 970 1040 1004 Q1500 1036 1940 996 L1940 1100 L-20 1100Z', '#E8C27A');

/** A parte que não muda: céu, mar, areia, a Tuti de gorro e o título. `cena` é o que fica no meio. */
function base(cena) {
  return withOutline(TRACO, () => {
    let s = ceu(1300, 620);
    s += cenario.skyCloud(250, 140, 1.0);
    s += cenario.sun(1875, 85, 52);
    s += areia();
    s += cena();
    s += G('translate(-90,120) scale(0.98)', tuti(APONTA, { shadow: false, gorro: true }));
    s += letreiro('QUIZ', 1330, 300, 330, '#FFD23F', { stroke: 36, rot: -4 });
    s += letreiro('do Natal no Verão', 1330, 452, 100, '#FFFFFF', { stroke: 26, rot: -4 });
    return s;
  });
}

const opcaoA = () =>
  base(
    () =>
      card(1040, 800, 290, -6, '#CFE6FF', () => vr.arvoreNatal(), 1, 0.74) +
      card(1350, 770, 330, 0, '#FFF1B8', vr.noelPraia, 2, 0.74) +
      card(1660, 800, 290, 6, '#CFF1E0', vr.aguaCoco, 3, 0.74)
  );

gravar(
  [
    ['A', opcaoA],
  ],
  { outDir: OUT, prefixo: 'v19', escolhida: ESCOLHIDA }
);
