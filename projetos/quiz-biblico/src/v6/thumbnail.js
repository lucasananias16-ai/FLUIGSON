'use strict';
/**
 * Vídeo 6 — thumbnail para o YouTube (1280 x 720), no modelo escolhido para o
 * canal (o "C" do Vídeo 1): a Tuti apontando, o título bem grande e três cards.
 * Aqui o título é "NÚMEROS em inglês", a Tuti usa capacete e os cards são 1, 2 e 3.
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
const OUT = path.join(ROOT, 'v6-ingles-numeros', 'youtube');
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
    s += G('translate(-90,120) scale(0.98)', tuti(APONTA, { shadow: false, capacete: true }));
    s += balao(700, 40, 330, 120, 'One, two...');
    s += letreiro('NÚMEROS', 1330, 320, 200, '#FFD23F', { stroke: 34, rot: -4 });
    s += letreiro('em inglês', 1330, 462, 130, '#FFFFFF', { stroke: 26, rot: -4 });
    return s;
  });
}

const num = (n, cor) => () => objetos.numero(String(n), cor);
const opcaoA = () =>
  base(
    () =>
      card(1040, 800, 290, -6, '#FFF1B8', num(1, '#FF8FB1'), '', 0) +
      card(1350, 770, 330, 0, '#CFF1E0', num(2, '#4DA3FF'), '', 0) +
      card(1660, 800, 290, 6, '#FFD9E4', num(3, '#5DBB7A'), '', 0)
  );

gravar(
  [
    ['A', opcaoA],
  ],
  { outDir: OUT, prefixo: 'v6', escolhida: ESCOLHIDA }
);
