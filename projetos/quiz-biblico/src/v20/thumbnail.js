'use strict';
/**
 * Vídeo 20 — thumbnail para o YouTube (1280 x 720), no modelo escolhido para o
 * canal (o "C" do Vídeo 1): a Tuti de gorro apontando, "QUIZ" bem grande, a
 * Polo Norte com a aurora e três cards numerados.
 *
 * Uso: node src/v20/thumbnail.js
 *
 * Cards: o pinguim de cachecol, o urso-polar e o iglu.
 *
 * A escolhida é gravada como v20_thumbnail.png; as opções ficam em `opcoes`.
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
const OUT = path.join(ROOT, 'v20-natal-polo-norte', 'youtube');
const ESCOLHIDA = 'A';
const pl = require('../art/polo');

const gelo = () =>
  P('M-20 700 L1940 700 L1940 900 L-20 900Z', '#4E8FD6') +
  P('M-20 880 Q560 820 1100 866 Q1520 900 1940 840 L1940 1100 L-20 1100Z', '#FFFFFF') +
  P('M-20 1010 Q520 970 1040 1004 Q1500 1036 1940 996 L1940 1100 L-20 1100Z', '#DCE8F7');
/** Faixas da aurora no céu da thumbnail. */
const auroraCeu = () =>
  ['#7CF0B4', '#B48CF2', '#5FD6C8'].map((c, i) => `<path d="M-50 ${120 + i * 70} C500 ${40 + i * 70} 1000 ${220 + i * 70} 1970 ${90 + i * 70} L1970 ${150 + i * 70} C1000 ${290 + i * 70} 500 ${110 + i * 70} -50 ${180 + i * 70}Z" fill="${c}" opacity="0.55"/>`).join('');

/** A parte que não muda: céu com a aurora, mar, gelo, a Tuti de gorro e o título. `cena` é o que fica no meio. */
function base(cena) {
  return withOutline(TRACO, () => {
    let s = ceu(1300, 620);
    s += auroraCeu();
    s += gelo();
    s += cena();
    s += G('translate(-90,120) scale(0.98)', tuti(APONTA, { shadow: false, gorro: true }));
    s += letreiro('QUIZ', 1330, 300, 330, '#FFD23F', { stroke: 36, rot: -4 });
    s += letreiro('do Natal no Polo Norte', 1330, 452, 100, '#FFFFFF', { stroke: 26, rot: -4 });
    return s;
  });
}

const opcaoA = () =>
  base(
    () =>
      card(1040, 800, 290, -6, '#CFE6FF', pl.pinguim, 1, 0.74) +
      card(1350, 770, 330, 0, '#E4DAFB', pl.ursoPolar, 2, 0.74) +
      card(1660, 800, 290, 6, '#CFF1E0', pl.iglu, 3, 0.74)
  );

gravar(
  [
    ['A', opcaoA],
  ],
  { outDir: OUT, prefixo: 'v20', escolhida: ESCOLHIDA }
);
