'use strict';
/**
 * Vídeo 3 — Desafios do Natal de Jesus: os nove desafios, com o tipo de cada
 * um e as opções na ordem em que aparecem na tela (esquerda, meio, direita),
 * como aprovado em v3-nascimento-de-jesus/01-narrativa.md.
 */
const pessoas = require('../art/pessoas');
const animais = require('../art/animais');
const objetos = require('../art/objetos');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';

module.exports = [
  { n: 1, tipo: 'achar', texto: 'Ache a estrelinha!' },
  { n: 2, tipo: 'contar', texto: 'Conte os presentes!' },
  {
    n: 3,
    tipo: 'sombra',
    texto: 'De quem é a sombra?',
    opcoes: [
      { id: 'pastor', rotulo: 'Pastor', arte: pessoas.pastor, fundo: MENTA },
      { id: 'ovelha', rotulo: 'Ovelhinha', arte: animais.ovelha, fundo: ROSA },
      { id: 'anjo', rotulo: 'Anjo', arte: pessoas.anjo, fundo: CEU, certa: true },
    ],
  },
  { n: 4, tipo: 'comparar', texto: 'Quem é o maior?' },
  {
    n: 5,
    tipo: 'escolher',
    texto: 'Quem é a mãe de Jesus?',
    opcoes: [
      { id: 'maria', rotulo: 'Maria', arte: pessoas.maria, fundo: CEU, certa: true },
      { id: 'marta', rotulo: 'Marta', arte: pessoas.marta, fundo: LIMAO },
      { id: 'ana', rotulo: 'Ana', arte: pessoas.ana, fundo: LILAS },
    ],
  },
  {
    n: 6,
    tipo: 'escolher',
    texto: 'Onde Jesus dormiu?',
    opcoes: [
      { id: 'castelo', rotulo: 'Castelo', arte: objetos.castelo, fundo: LILAS },
      { id: 'barco', rotulo: 'Barco', arte: objetos.barco, fundo: CEU },
      { id: 'manjedoura', rotulo: 'Manjedoura', arte: objetos.manjedoura, fundo: PESSEGO, certa: true },
    ],
  },
  {
    n: 7,
    tipo: 'intruso',
    texto: 'O que não combina?',
    opcoes: [
      { id: 'estrela', rotulo: 'Estrela', arte: objetos.estrela, fundo: LIMAO },
      { id: 'foguete', rotulo: 'Foguete', arte: objetos.foguete, fundo: LILAS, certa: true },
      { id: 'ovelha', rotulo: 'Ovelhinha', arte: animais.ovelha, fundo: MENTA },
    ],
  },
  {
    n: 8,
    tipo: 'memoria',
    texto: 'Onde está a estrela?',
    // ordem inicial; depois de virar, os cards trocam de lugar (posições 0, 1, 2).
    // Trocas: [0,2] leva a estrela para a esquerda; [0,1] a deixa no meio ("número dois").
    opcoes: [
      { id: 'presente', rotulo: 'Presente', arte: objetos.presente, fundo: ROSA },
      { id: 'ovelha', rotulo: 'Ovelhinha', arte: animais.ovelha, fundo: MENTA },
      { id: 'estrela', rotulo: 'Estrela', arte: objetos.estrela, fundo: LIMAO, certa: true },
    ],
    trocas: [
      [0, 2],
      [0, 1],
    ],
  },
  {
    n: 9,
    tipo: 'escolher',
    texto: 'Quem ouviu os anjos?',
    opcoes: [
      { id: 'pastores', rotulo: 'Pastores', arte: pessoas.pastor, fundo: MENTA, certa: true },
      { id: 'pescadores', rotulo: 'Pescadores', arte: pessoas.pescador, fundo: CEU },
      { id: 'padeiros', rotulo: 'Padeiros', arte: pessoas.padeiro, fundo: LIMAO },
    ],
  },
];
