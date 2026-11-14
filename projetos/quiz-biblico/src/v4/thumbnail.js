'use strict';
/**
 * Vídeo 4 — thumbnail para o YouTube (1280 x 720), no modelo escolhido para o
 * canal (o "C" do Vídeo 1): a Tuti apontando, "QUIZ" bem grande, a cena da
 * brincadeira e três cards numerados. Aqui é um dia de neve, com a Tuti de gorro.
 *
 * Uso: node src/v4/thumbnail.js
 *
 * Opção A: três cards com o Papai Noel de roupa azul, vermelha e verde.
 * Opção B: cards do Papai Noel, da rena e do presente.
 *
 * A escolhida é gravada como v4_thumbnail.png; as opções ficam em `opcoes`.
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
const OUT = path.join(ROOT, 'v4-papai-noel', 'youtube');
const ESCOLHIDA = 'A';

const neve = () =>
  P('M-20 880 Q560 800 1100 856 Q1520 896 1940 820 L1940 1100 L-20 1100Z', '#E4EFFB') +
  P('M-20 1010 Q520 960 1040 1004 Q1500 1040 1940 990 L1940 1100 L-20 1100Z', '#FFFFFF');

/** A parte que não muda: céu, neve, a Tuti de gorro e o título. `cena` é o que fica no meio. */
function base(cena) {
  return withOutline(TRACO, () => {
    let s = ceu(1300, 620);
    s += cenario.skyCloud(250, 140, 1.0);
    s += noel.pinheiro(1840, 900, 0.5) + noel.pinheiro(1760, 930, 0.36);
    s += neve();
    s += cena();
    s += G('translate(-90,120) scale(0.98)', tuti(APONTA, { shadow: false, gorro: true }));
    s += letreiro('QUIZ', 1330, 300, 330, '#FFD23F', { stroke: 36, rot: -4 });
    s += letreiro('do Papai Noel', 1330, 452, 122, '#FFFFFF', { stroke: 26, rot: -4 });
    return s;
  });
}

const opcaoA = () =>
  base(
    () =>
      card(1040, 800, 290, -6, '#E4DAFB', () => pessoas.papaiNoel({ cor: 'azul' }), 1, 0.74) +
      card(1350, 770, 330, 0, '#FFF1B8', () => pessoas.papaiNoel({ cor: 'vermelha' }), 2, 0.74) +
      card(1660, 800, 290, 6, '#FFE0C7', () => pessoas.papaiNoel({ cor: 'verde' }), 3, 0.74)
  );

const opcaoB = () =>
  base(
    () =>
      card(1040, 800, 290, -6, '#FFF1B8', pessoas.papaiNoel, 1, 0.74) +
      card(1350, 770, 330, 0, '#CFF1E0', animais.rena, 2, 0.74) +
      card(1660, 800, 290, 6, '#FFD9E4', objetos.presente, 3, 0.74)
  );

gravar(
  [
    ['A', opcaoA],
    ['B', opcaoB],
  ],
  { outDir: OUT, prefixo: 'v4', escolhida: ESCOLHIDA }
);
