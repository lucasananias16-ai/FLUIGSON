'use strict';
/**
 * Vídeo 12 — O Boneco de Neve: os doze desafios, com o tipo de cada um e as
 * opções na ordem em que aparecem na tela (esquerda, meio, direita), conforme
 * v12-natal-boneco-neve/01-narrativa.md.
 */
const neve = require('../art/neve');
const animais = require('../art/animais');
const objetos = require('../art/objetos');
const of = require('../art/oficina');
const cores = require('../art/cores');
const ceia = require('../art/ceia');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';

module.exports = [
  { n: 1, tipo: 'achar', texto: 'Ache a cenoura!' },
  { n: 2, tipo: 'contar', texto: 'Conte as bolas de neve!' },
  {
    n: 3,
    tipo: 'falta',
    texto: 'O que está faltando?',
    opcoes: [
      { id: 'guarda-chuva', rotulo: 'Guarda-chuva', arte: objetos.guardaChuva, fundo: MENTA },
      { id: 'luva', rotulo: 'Luva', arte: () => neve.luva('#4DA3FF'), fundo: LIMAO },
      { id: 'chapeu', rotulo: 'Chapéu', arte: neve.cartola, fundo: ROSA, certa: true },
    ],
  },
  {
    n: 4,
    tipo: 'escolher',
    texto: 'O que esquenta?',
    opcoes: [
      { id: 'cachecol', rotulo: 'Cachecol', arte: neve.cachecol, fundo: CEU, certa: true },
      { id: 'piao', rotulo: 'Pião', arte: of.piao, fundo: LIMAO },
      { id: 'prancha', rotulo: 'Prancha', arte: objetos.prancha, fundo: PESSEGO },
    ],
  },
  {
    n: 5,
    tipo: 'sombra',
    texto: 'De quem é a sombra?',
    opcoes: [
      { id: 'pinguim', rotulo: 'Pinguim', arte: animais.pinguim, fundo: MENTA },
      { id: 'rena', rotulo: 'Rena', arte: animais.rena, fundo: PESSEGO },
      { id: 'boneco', rotulo: 'Boneco de neve', arte: animais.bonecoNeve, fundo: CEU, certa: true },
    ],
  },
  { n: 6, tipo: 'comparar', texto: 'Qual é o maior?' },
  { n: 7, tipo: 'diferente', texto: 'Qual é a diferente?' },
  {
    n: 8,
    tipo: 'sequencia',
    texto: 'Quem vem depois?',
    opcoes: [
      { id: 'rena', rotulo: 'Rena', arte: animais.rena, fundo: PESSEGO },
      { id: 'pinguim', rotulo: 'Pinguim', arte: animais.pinguim, fundo: CEU, certa: true },
      { id: 'boneco', rotulo: 'Boneco de neve', arte: animais.bonecoNeve, fundo: LILAS },
    ],
  },
  {
    n: 9,
    tipo: 'intruso',
    texto: 'O que não combina?',
    opcoes: [
      { id: 'chinelo', rotulo: 'Chinelo', arte: neve.chinelo, fundo: LIMAO, certa: true },
      { id: 'treno', rotulo: 'Trenó', arte: objetos.treno, fundo: ROSA },
      { id: 'boneco', rotulo: 'Boneco de neve', arte: animais.bonecoNeve, fundo: CEU },
    ],
  },
  {
    n: 10,
    tipo: 'memoria',
    texto: 'Onde está a luva?',
    // ordem inicial; trocas: [1,2] leva a luva para a direita; [0,1] a deixa lá ("número três")
    opcoes: [
      { id: 'cenoura', rotulo: 'Cenoura', arte: neve.cenoura, fundo: MENTA },
      { id: 'luva', rotulo: 'Luva', arte: () => neve.luva('#4DA3FF'), fundo: LIMAO, certa: true },
      { id: 'chapeu', rotulo: 'Chapéu', arte: neve.cartola, fundo: ROSA },
    ],
    trocas: [
      [1, 2],
      [0, 1],
    ],
  },
  {
    n: 11,
    tipo: 'escolher',
    texto: 'Quem gosta do frio?',
    opcoes: [
      { id: 'camelo', rotulo: 'Camelo', arte: animais.camelo, fundo: LIMAO },
      { id: 'leao', rotulo: 'Leão', arte: animais.leao, fundo: PESSEGO },
      { id: 'pinguim', rotulo: 'Pinguim', arte: animais.pinguim, fundo: CEU, certa: true },
    ],
  },
  {
    n: 12,
    tipo: 'escolher',
    texto: 'Qual é o nariz?',
    opcoes: [
      { id: 'banana', rotulo: 'Banana', arte: cores.banana, fundo: MENTA },
      { id: 'cenoura', rotulo: 'Cenoura', arte: neve.cenoura, fundo: CEU, certa: true },
      { id: 'pirulito', rotulo: 'Pirulito', arte: ceia.pirulito, fundo: LILAS },
    ],
  },
];
