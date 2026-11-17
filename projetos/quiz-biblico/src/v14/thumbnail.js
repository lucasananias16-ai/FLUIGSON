'use strict';
/**
 * Vídeo 14 — thumbnail para o YouTube (1280 x 720), no modelo escolhido para o
 * canal (o "C" do Vídeo 1): a Tuti apontando, "QUIZ" bem grande, a cena da
 * brincadeira e três cards numerados. Aqui é um dia de neve, com a Tuti de gorro.
 *
 * Uso: node src/v14/thumbnail.js
 *
 * Cards: o certo virado (ursinho), e dois de costas com "?".
 *
 * A escolhida é gravada como v14_thumbnail.png; as opções ficam em `opcoes`.
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
const OUT = path.join(ROOT, 'v14-jogo-da-memoria', 'youtube');
const ESCOLHIDA = 'A';

const praia = () =>
  P('M-20 900 Q560 850 1100 890 Q1520 920 1940 870 L1940 1100 L-20 1100Z', '#7CC96B') +
  P('M-20 1010 Q520 970 1040 1004 Q1500 1036 1940 996 L1940 1100 L-20 1100Z', '#5DB55A');

/** A parte que não muda: céu, gramado, a Tuti e o título. `cena` é o que fica no meio. */
function base(cena) {
  return withOutline(TRACO, () => {
    let s = ceu(1300, 620);
    s += cenario.skyCloud(250, 140, 1.0);
    s += praia();
    s += cena();
    s += G('translate(-90,120) scale(0.98)', tuti(APONTA, { shadow: false }));
    s += letreiro('JOGO DA', 1330, 175, 140, '#FFFFFF', { stroke: 28, rot: -4 });
    s += letreiro('MEMÓRIA', 1330, 395, 210, '#FFD23F', { stroke: 34, rot: -4 });
    return s;
  });
}

const of = require('../art/oficina');
const { R, Ci } = kit;
const P_ = require('../anim/palco');
const costas = () => R(150, 150, 700, 700, 90, '#2E8BFF') + Ci(500, 500, 210, '#FFFFFF') + `<text x="500" y="590" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="300" fill="#2E8BFF">?</text>`;
const opcaoA = () =>
  base(
    () =>
      card(1040, 800, 290, -6, '#CFE6FF', costas, 1, 0.74) +
      card(1350, 770, 330, 0, '#FFE0C7', of.ursinho, 2, 0.74) +
      card(1660, 800, 290, 6, '#CFE6FF', costas, 3, 0.74)
  );

gravar(
  [
    ['A', opcaoA],
  ],
  { outDir: OUT, prefixo: 'v14', escolhida: ESCOLHIDA }
);
