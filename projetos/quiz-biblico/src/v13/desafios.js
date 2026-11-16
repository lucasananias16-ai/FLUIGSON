'use strict';
/**
 * Vídeo 13 — Jonas e o Grande Peixe: os doze desafios, com o tipo de cada um e
 * as opções na ordem em que aparecem na tela (esquerda, meio, direita),
 * conforme v13-biblico-jonas/01-narrativa.md.
 */
const mar = require('../art/mar');
const animais = require('../art/animais');
const objetos = require('../art/objetos');
const espaco = require('../art/espaco');
const of = require('../art/oficina');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';
const NOITE = '#34498F';

module.exports = [
  { n: 1, tipo: 'achar', texto: 'Ache o grande peixe!' },
  { n: 2, tipo: 'contar', texto: 'Conte os dias!' },
  {
    n: 3,
    tipo: 'escolher',
    texto: 'Para onde Jonas foi mandado?',
    opcoes: [
      { id: 'cidade', rotulo: 'Cidade', arte: mar.cidade, fundo: PESSEGO, certa: true },
      { id: 'floresta', rotulo: 'Floresta', arte: mar.floresta, fundo: MENTA },
      { id: 'lua', rotulo: 'Lua', arte: objetos.lua, fundo: NOITE },
    ],
  },
  {
    n: 4,
    tipo: 'escolher',
    texto: 'Jonas entrou em quê?',
    opcoes: [
      { id: 'foguete', rotulo: 'Foguete', arte: () => espaco.foguete(), fundo: LILAS },
      { id: 'barco', rotulo: 'Barco', arte: objetos.barco, fundo: CEU, certa: true },
      { id: 'trem', rotulo: 'Trem', arte: of.trenzinho, fundo: LIMAO },
    ],
  },
  {
    n: 5,
    tipo: 'escolher',
    texto: 'O que aconteceu no mar?',
    opcoes: [
      { id: 'tempestade', rotulo: 'Tempestade', arte: mar.tempestade, fundo: LILAS, certa: true },
      { id: 'neve', rotulo: 'Neve', arte: objetos.neve, fundo: CEU },
      { id: 'arco-iris', rotulo: 'Arco-íris', arte: objetos.arcoIris, fundo: LIMAO },
    ],
  },
  {
    n: 6,
    tipo: 'sombra',
    texto: 'De quem é a sombra?',
    opcoes: [
      { id: 'barco', rotulo: 'Barco', arte: objetos.barco, fundo: LIMAO },
      { id: 'peixe', rotulo: 'Grande peixe', arte: mar.grandePeixe, fundo: CEU, certa: true },
      { id: 'castelo', rotulo: 'Castelo', arte: objetos.castelo, fundo: ROSA },
    ],
  },
  { n: 7, tipo: 'comparar', texto: 'Quem é o maior?' },
  { n: 8, tipo: 'diferente', texto: 'Qual é o diferente?' },
  {
    n: 9,
    tipo: 'sequencia',
    texto: 'O que vem depois?',
    opcoes: [
      { id: 'concha', rotulo: 'Concha', arte: mar.concha, fundo: LILAS },
      { id: 'estrela-do-mar', rotulo: 'Estrela-do-mar', arte: mar.estrelaMar, fundo: CEU, certa: true },
      { id: 'peixe', rotulo: 'Peixe', arte: () => mar.peixinho('#4DA3FF'), fundo: LIMAO },
    ],
  },
  {
    n: 10,
    tipo: 'intruso',
    texto: 'O que não combina?',
    opcoes: [
      { id: 'peixe', rotulo: 'Peixe', arte: () => mar.peixinho('#4DA3FF'), fundo: MENTA },
      { id: 'barco', rotulo: 'Barco', arte: objetos.barco, fundo: LIMAO },
      { id: 'boneco', rotulo: 'Boneco de neve', arte: animais.bonecoNeve, fundo: CEU, certa: true },
    ],
  },
  {
    n: 11,
    tipo: 'memoria',
    texto: 'Onde está o grande peixe?',
    // ordem inicial; trocas: [1,0] leva o peixe para a esquerda; [1,2] o deixa lá ("número um")
    opcoes: [
      { id: 'barco', rotulo: 'Barco', arte: objetos.barco, fundo: LIMAO },
      { id: 'peixe', rotulo: 'Grande peixe', arte: mar.grandePeixe, fundo: CEU, certa: true },
      { id: 'estrela', rotulo: 'Estrela-do-mar', arte: mar.estrelaMar, fundo: ROSA },
    ],
    trocas: [
      [0, 1],
      [1, 2],
    ],
  },
  {
    n: 12,
    tipo: 'escolher',
    texto: 'Onde Jonas foi deixado?',
    opcoes: [
      { id: 'montanha', rotulo: 'Montanha', arte: mar.montanha, fundo: LILAS },
      { id: 'praia', rotulo: 'Praia', arte: mar.praia, fundo: LIMAO, certa: true },
      { id: 'nuvem', rotulo: 'Nuvem', arte: mar.nuvem, fundo: CEU },
    ],
  },
];
