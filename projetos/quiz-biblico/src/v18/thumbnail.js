'use strict';
/**
 * Vídeo 18 — thumbnail para o YouTube (1280 x 720), no modelo escolhido para o
 * canal (o "C" do Vídeo 1): a Tuti apontando, "QUIZ" bem grande, a cena da
 * brincadeira e três cards numerados. Aqui é um dia de neve, com a Tuti de gorro.
 *
 * Uso: node src/v18/thumbnail.js
 *
 * Cards: as árvores da primavera, do outono e do inverno.
 *
 * A escolhida é gravada como v18_thumbnail.png; as opções ficam em `opcoes`.
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
const OUT = path.join(ROOT, 'v18-estacoes', 'youtube');
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
    s += letreiro('QUIZ', 1330, 300, 330, '#FFD23F', { stroke: 36, rot: -4 });
    s += letreiro('das Estações do Ano', 1330, 452, 100, '#FFFFFF', { stroke: 26, rot: -4 });
    return s;
  });
}

const es = require('../art/estacoes');
const opcaoA = () =>
  base(
    () =>
      card(1040, 800, 290, -6, '#FFD9E4', () => es.arvoreEstacao('primavera'), 1, 0.74) +
      card(1350, 770, 330, 0, '#FFE0C7', () => es.arvoreEstacao('outono'), 2, 0.74) +
      card(1660, 800, 290, 6, '#CFE6FF', () => es.arvoreEstacao('inverno'), 3, 0.74)
  );

gravar(
  [
    ['A', opcaoA],
  ],
  { outDir: OUT, prefixo: 'v18', escolhida: ESCOLHIDA }
);
