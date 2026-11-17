'use strict';
/**
 * Vídeo 16 — thumbnail para o YouTube (1280 x 720), no modelo escolhido para o
 * canal (o "C" do Vídeo 1): a Tuti apontando, "QUIZ" bem grande, a cena da
 * brincadeira e três cards numerados. Aqui é um dia de neve, com a Tuti de gorro.
 *
 * Uso: node src/v16/thumbnail.js
 *
 * Cards: luz, árvore e elefante.
 *
 * A escolhida é gravada como v16_thumbnail.png; as opções ficam em `opcoes`.
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
const OUT = path.join(ROOT, 'v16-biblico-criacao', 'youtube');
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
    s += letreiro('QUIZ BÍBLICO', 1310, 280, 170, '#FFD23F', { stroke: 30, rot: -4 });
    s += letreiro('A Criação do Mundo', 1330, 440, 100, '#FFFFFF', { stroke: 26, rot: -4 });
    return s;
  });
}

const cr = require('../art/criacao');
const opcaoA = () =>
  base(
    () =>
      card(1040, 800, 290, -6, '#FFF1B8', cr.luz, 1, 0.74) +
      card(1350, 770, 330, 0, '#CFF1E0', cr.arvore, 2, 0.74) +
      card(1660, 800, 290, 6, '#CFE6FF', animais.elefante, 3, 0.74)
  );

gravar(
  [
    ['A', opcaoA],
  ],
  { outDir: OUT, prefixo: 'v16', escolhida: ESCOLHIDA }
);
