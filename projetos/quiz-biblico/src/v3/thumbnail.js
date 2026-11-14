'use strict';
/**
 * Vídeo 3 — thumbnail para o YouTube (1280 x 720), no modelo escolhido para o
 * canal (o "C" do Vídeo 1): a Tuti apontando, "QUIZ" bem grande, a cena da
 * história e três cards numerados. Aqui a cena é a noite de Natal.
 *
 * Uso: node src/v3/thumbnail.js
 *
 * Opção A: noite com a estrela de Belém e cards do anjo, da manjedoura e do presente.
 * Opção B: o estábulo ao fundo e cards de Maria, do anjo e do camelo.
 *
 * A escolhida é gravada como v3_thumbnail.png; as opções ficam em `opcoes`.
 */
const path = require('path');
const kit = require('../kit');
const { P, R, G, withOutline } = kit;
const { tuti } = require('../tuti');
const cenario = require('../art/cenario');
const natal = require('../art/natal');
const pessoas = require('../art/pessoas');
const animais = require('../art/animais');
const objetos = require('../art/objetos');
const { letreiro, card, gravar, APONTA, TRACO } = require('../thumb');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'v3-nascimento-de-jesus', 'youtube');
const ESCOLHIDA = 'A';

/** Céu de noite com raios de luz saindo da estrela. */
function ceuNoite(cx, cy) {
  let rays = '';
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const w = Math.PI / 28;
    rays += `<path d="M${cx} ${cy} L${cx + Math.cos(a - w) * 2600} ${cy + Math.sin(a - w) * 2600} L${cx + Math.cos(a + w) * 2600} ${cy + Math.sin(a + w) * 2600}Z"/>`;
  }
  return R(0, 0, 1920, 1080, 0, '#27386E', { sw: 0 }) + `<g fill="#34498F">${rays}</g>`;
}

const morros = () =>
  P('M-20 880 Q560 800 1100 856 Q1520 896 1940 820 L1940 1100 L-20 1100Z', '#3C8A63') +
  P('M-20 1010 Q520 960 1040 1004 Q1500 1040 1940 990 L1940 1100 L-20 1100Z', '#2F7553');

/** A parte que não muda: céu, estrela, chão, a Tuti e o título. `cena` é o que fica no meio. */
function base(cena) {
  return withOutline(TRACO, () => {
    let s = ceuNoite(1330, 300);
    s += morros();
    s += natal.estrelaGrande(1830, 200, 64);
    s += cena();
    s += cenario.flowers([
      [760, 1030, 1.5],
      [1850, 1040, 1.3],
    ]);
    s += G('translate(-90,120) scale(0.98)', tuti(APONTA, { shadow: false }));
    s += letreiro('QUIZ', 1330, 300, 330, '#FFD23F', { stroke: 36, rot: -4 });
    s += letreiro('do Natal de Jesus', 1330, 452, 118, '#FFFFFF', { stroke: 26, rot: -4 });
    return s;
  });
}

const opcaoA = () =>
  base(
    () =>
      card(1040, 800, 290, -6, '#CFE6FF', pessoas.anjo, 1, 0.74) +
      card(1350, 770, 330, 0, '#FFE0C7', objetos.manjedoura, 2, 0.74) +
      card(1660, 800, 290, 6, '#FFD9E4', objetos.presente, 3, 0.74)
  );

const opcaoB = () =>
  base(
    () =>
      card(1040, 800, 290, -6, '#CFE6FF', pessoas.maria, 1, 0.74) +
      card(1350, 770, 330, 0, '#FFF1B8', pessoas.anjo, 2, 0.74) +
      card(1660, 800, 290, 6, '#CFF1E0', animais.camelo, 3, 0.74)
  );

gravar(
  [
    ['A', opcaoA],
    ['B', opcaoB],
  ],
  { outDir: OUT, prefixo: 'v3', escolhida: ESCOLHIDA }
);
