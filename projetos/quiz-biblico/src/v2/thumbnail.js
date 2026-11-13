'use strict';
/**
 * Vídeo 2 — thumbnail para o YouTube (1280 x 720), no modelo escolhido para o
 * canal (o "C" do Vídeo 1): a Tuti apontando, "QUIZ" bem grande, a cena da
 * história e três cards numerados.
 *
 * Uso: node src/v2/thumbnail.js
 *
 * Opção A: o gigante Golias aparecendo por trás dos cards.
 * Opção B: o pasto ao fundo, com Davi, Golias e a ovelhinha nos cards.
 * Opção C: como a B, mas o Golias é tão grande que não cabe no card dele.
 *
 * A escolhida é gravada como v2_thumbnail.png; as opções ficam em `opcoes`.
 */
const path = require('path');
const kit = require('../kit');
const { G, withOutline } = kit;
const { tuti } = require('../tuti');
const cenario = require('../art/cenario');
const pessoas = require('../art/pessoas');
const animais = require('../art/animais');
const objetos = require('../art/objetos');
const { letreiro, ceu, chao, card, gravar, APONTA, TRACO } = require('../thumb');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'v2-davi-e-golias', 'youtube');
const ESCOLHIDA = 'C';

const FLORES = [
  [760, 1030, 1.5],
  [1850, 1040, 1.3],
];

/** A parte que não muda: céu, chão, a Tuti e o título. `cena` é o que fica no meio. */
function base(cena) {
  return withOutline(TRACO, () => {
    let s = ceu(1300, 620);
    s += cenario.skyCloud(250, 140, 1.0);
    s += chao();
    s += cena();
    s += cenario.flowers(FLORES);
    s += G('translate(-90,120) scale(0.98)', tuti(APONTA, { shadow: false }));
    s += letreiro('QUIZ', 1330, 300, 330, '#FFD23F', { stroke: 36, rot: -4 });
    s += letreiro('de Davi e Golias', 1330, 452, 122, '#FFFFFF', { stroke: 26, rot: -4 });
    return s;
  });
}

// O gigante fica atrás dos cards, com a cabeça e os ombros de fora: dá para
// ver que ele é grande mesmo com a imagem pequena.
const opcaoA = () =>
  base(
    () =>
      G('translate(1004,506) scale(0.66)', withOutline(TRACO / 0.66, () => pessoas.golias({ shadow: false }))) +
      card(1050, 912, 250, -6, '#FFF1B8', pessoas.davi, 1, 0.68) +
      card(1330, 896, 268, 0, '#FFD9E4', animais.ovelha, 2, 0.68) +
      card(1610, 912, 250, 6, '#CFF1E0', objetos.funda, 3, 0.68)
  );

const opcaoB = () =>
  base(
    () =>
      cenario.tree(1790, 760, 0.9) +
      card(1040, 800, 290, -6, '#FFF1B8', pessoas.davi, 1, 0.74) +
      card(1350, 770, 330, 0, '#CFE6FF', pessoas.golias, 2, 0.74) +
      card(1660, 800, 290, 6, '#FFD9E4', animais.ovelha, 3, 0.74)
  );

/** O Golias desenhado maior que o card, com a cabeça passando da borda de cima. */
const gigante = (escala) => () => {
  const atual = kit.o(1); // traço em vigor dentro do card
  return G(`translate(${500 - 500 * escala},${960 - 960 * escala}) scale(${escala})`, withOutline(atual / escala, () => pessoas.golias({ shadow: false })));
};

const opcaoC = () =>
  base(
    () =>
      cenario.tree(1800, 770, 0.9) +
      card(1030, 812, 280, -6, '#FFF1B8', pessoas.davi, 1, 0.74) +
      card(1660, 812, 280, 6, '#FFD9E4', animais.ovelha, 3, 0.74) +
      card(1345, 790, 330, 0, '#CFE6FF', gigante(1.34), 2, 0.74)
  );

gravar(
  [
    ['A', opcaoA],
    ['B', opcaoB],
    ['C', opcaoC],
  ],
  { outDir: OUT, prefixo: 'v2', escolhida: ESCOLHIDA }
);
