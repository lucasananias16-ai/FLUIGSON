'use strict';
/**
 * Vídeo 7 — thumbnail para o YouTube (1280 x 720), no modelo escolhido para o
 * canal (o "C" do Vídeo 1): a Tuti apontando, o título bem grande e três cards.
 * Aqui o título é "CORES em inglês", a Tuti usa boina de pintora e os cards são manchas de tinta.
 *
 * Uso: node src/v5/thumbnail.js
 *
 *
 * A escolhida é gravada como v5_thumbnail.png; as opções ficam em `opcoes`.
 */
const path = require('path');
const { G, R, P, withOutline } = require('../kit');
const { tuti } = require('../tuti');
const cenario = require('../art/cenario');
const animais = require('../art/animais');
const objetos = require('../art/objetos');
const { letreiro, ceu, chao, card, gravar, APONTA, TRACO, LINE } = require('../thumb');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'v7-ingles-cores', 'youtube');
const ESCOLHIDA = 'A';

/** Balão de fala com a ponta para baixo e à esquerda, na direção da Tuti. */
const balao = (x, y, w, h, txt) =>
  G(
    'rotate(-5 ' + x + ' ' + y + ')',
    P(`M${x - 40} ${y + h - 6} L${x - 96} ${y + h + 64} L${x + 26} ${y + h - 2}Z`, '#FFFFFF'),
    R(x - w / 2, y, w, h, h / 2, '#FFFFFF'),
    `<text x="${x}" y="${y + h * 0.72}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${h * 0.7}" fill="${LINE}">${txt}</text>`
  );

function base(cena) {
  return withOutline(TRACO, () => {
    let s = ceu(1300, 620);
    s += cenario.skyCloud(250, 140, 1.0);
    s += chao();
    s += cena();
    s += cenario.flowers([
      [760, 1030, 1.5],
      [1850, 1040, 1.3],
    ]);
    s += G('translate(-90,120) scale(0.98)', tuti(APONTA, { shadow: false, boina: true }));
    s += balao(690, 60, 250, 120, 'Red!');
    s += letreiro('CORES', 1330, 320, 250, '#FFD23F', { stroke: 34, rot: -4 });
    s += letreiro('em inglês', 1330, 462, 130, '#FFFFFF', { stroke: 26, rot: -4 });
    return s;
  });
}

const cores = require('../art/cores');
const mancha = (hex) => () => cores.mancha(hex);
const opcaoA = () =>
  base(
    () =>
      card(1040, 800, 290, -6, '#FFFFFF', mancha('#E25A52'), '', 0) +
      card(1350, 770, 330, 0, '#FFFFFF', mancha('#FFD23F'), '', 0) +
      card(1660, 800, 290, 6, '#FFFFFF', mancha('#4DA3FF'), '', 0)
  );

gravar(
  [
    ['A', opcaoA],
  ],
  { outDir: OUT, prefixo: 'v7', escolhida: ESCOLHIDA }
);
