'use strict';
/**
 * Vídeo 6 — os três jogos com cards (2, 4 e 5), com as opções na ordem em que
 * aparecem na tela (esquerda, meio, direita), como em
 * v6-ingles-numeros/01-narrativa.md.
 */
const { numero } = require('../art/objetos');

const MENTA = '#CFF1E0';
const LIMAO = '#FFF1B8';
const CEU = '#CFE6FF';
const ROSA = '#FFD9E4';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';
const num = (n, cor) => () => numero(String(n), cor);

module.exports = [
  {
    n: 2,
    texto: 'Qual é o four?',
    semNumero: true, // sem o selo 1-2-3 no canto: o próprio card já é um número
    opcoes: [
      { id: '2', rotulo: '2', arte: num(2, '#FF8FB1'), fundo: LIMAO },
      { id: '4', rotulo: '4', arte: num(4, '#4DA3FF'), fundo: MENTA, certa: true },
      { id: '7', rotulo: '7', arte: num(7, '#5DBB7A'), fundo: ROSA },
    ],
  },
  {
    n: 4,
    texto: 'Qual faltou?',
    semNumero: true,
    opcoes: [
      { id: '3', rotulo: '3', arte: num(3, '#FFA53A'), fundo: CEU, certa: true },
      { id: '5', rotulo: '5', arte: num(5, '#9B7EDE'), fundo: LIMAO },
      { id: '6', rotulo: '6', arte: num(6, '#E25A52'), fundo: MENTA },
    ],
  },
  {
    n: 5,
    texto: 'Onde está o ten?',
    // ordem inicial; trocas: [0,1] leva o dez para o meio; [1,2] o deixa na direita ("número três")
    opcoes: [
      { id: '10', rotulo: '10', arte: num(10, '#4DA3FF'), fundo: PESSEGO, certa: true },
      { id: '8', rotulo: '8', arte: num(8, '#5DBB7A'), fundo: LILAS },
      { id: '9', rotulo: '9', arte: num(9, '#FF8FB1'), fundo: LIMAO },
    ],
    trocas: [
      [0, 1],
      [1, 2],
    ],
  },
];
