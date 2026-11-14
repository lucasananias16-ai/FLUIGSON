'use strict';
/**
 * Vídeo 7 — os jogos com cards (2, 3, 4 e 5), com as opções na ordem em que
 * aparecem na tela (esquerda, meio, direita), como em v7-ingles-cores/01-narrativa.md.
 */
const cores = require('../art/cores');

const BRANCO = '#FFFFFF';
const CREME = '#FFF6DC';
const mancha = (hex) => () => cores.mancha(hex);
const pote = (hex) => () => cores.pote(hex);

module.exports = [
  {
    n: 2,
    texto: 'Qual é o green?',
    opcoes: [
      { id: 'vermelho', rotulo: 'Vermelho', arte: mancha('#E25A52'), fundo: BRANCO },
      { id: 'verde', rotulo: 'Verde', arte: mancha('#5DBB7A'), fundo: BRANCO, certa: true },
      { id: 'roxo', rotulo: 'Roxo', arte: mancha('#9B7EDE'), fundo: BRANCO },
    ],
  },
  {
    n: 3,
    texto: 'Yellow + blue = ?',
    opcoes: [
      { id: 'verde', rotulo: 'Verde', arte: mancha('#5DBB7A'), fundo: BRANCO, certa: true },
      { id: 'laranja', rotulo: 'Laranja', arte: mancha('#FF9838'), fundo: BRANCO },
      { id: 'roxo', rotulo: 'Roxo', arte: mancha('#9B7EDE'), fundo: BRANCO },
    ],
  },
  {
    n: 4,
    texto: 'Qual não é red?',
    opcoes: [
      { id: 'maca', rotulo: 'Maçã', arte: cores.maca, fundo: CREME },
      { id: 'morango', rotulo: 'Morango', arte: cores.morango, fundo: CREME },
      { id: 'banana', rotulo: 'Banana', arte: cores.banana, fundo: CREME, certa: true },
    ],
  },
  {
    n: 5,
    texto: 'Onde está o blue?',
    // ordem inicial; trocas: [1,2] leva o azul para a direita; [0,2] o deixa na esquerda ("número um")
    opcoes: [
      { id: 'vermelho', rotulo: 'Vermelho', arte: pote('#E25A52'), fundo: CREME },
      { id: 'azul', rotulo: 'Azul', arte: pote('#4DA3FF'), fundo: CREME, certa: true },
      { id: 'amarelo', rotulo: 'Amarelo', arte: pote('#FFD23F'), fundo: CREME },
    ],
    trocas: [
      [1, 2],
      [0, 2],
    ],
  },
];
