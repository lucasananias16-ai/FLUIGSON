'use strict';
/**
 * Vídeo 5 — os dois jogos com cards (o 2 e o 5), com as opções na ordem em que
 * aparecem na tela (esquerda, meio, direita), como em
 * v5-ingles-animais/01-narrativa.md.
 */
const animais = require('../art/animais');

const MENTA = '#CFF1E0';
const LIMAO = '#FFF1B8';
const CEU = '#CFE6FF';

module.exports = [
  {
    n: 2,
    tipo: 'escolher',
    texto: 'Qual é o lion?',
    opcoes: [
      { id: 'elefante', rotulo: 'Elefante', arte: animais.elefante, fundo: CEU },
      { id: 'leao', rotulo: 'Leão', arte: animais.leao, fundo: LIMAO, certa: true },
      { id: 'girafa', rotulo: 'Girafa', arte: animais.girafa, fundo: MENTA },
    ],
  },
  {
    n: 5,
    tipo: 'memoria',
    texto: 'Onde está o lion?',
    // ordem inicial; depois de virar, os cards trocam de lugar (posições 0, 1, 2).
    // Trocas: [0,2] leva o leão para a esquerda; [0,1] o deixa no meio ("número dois").
    opcoes: [
      { id: 'elefante', rotulo: 'Elefante', arte: animais.elefante, fundo: CEU },
      { id: 'girafa', rotulo: 'Girafa', arte: animais.girafa, fundo: MENTA },
      { id: 'leao', rotulo: 'Leão', arte: animais.leao, fundo: LIMAO, certa: true },
    ],
    trocas: [
      [0, 2],
      [0, 1],
    ],
  },
];
