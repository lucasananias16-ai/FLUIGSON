'use strict';
/**
 * Vídeo 4 — Quiz do Papai Noel: os oito desafios, com o tipo de cada um e as
 * opções na ordem em que aparecem na tela (esquerda, meio, direita), como
 * aprovado em v4-papai-noel/01-narrativa.md.
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
  { n: 1, tipo: 'achar', texto: 'Ache o Papai Noel!' },
  { n: 2, tipo: 'contar', texto: 'Conte as renas!' },
  {
    n: 3,
    tipo: 'escolher',
    texto: 'De que cor é a roupa?',
    opcoes: [
      { id: 'azul', rotulo: 'Azul', arte: () => pessoas.papaiNoel({ cor: 'azul' }), fundo: LILAS },
      { id: 'vermelha', rotulo: 'Vermelha', arte: () => pessoas.papaiNoel({ cor: 'vermelha' }), fundo: LIMAO, certa: true },
      { id: 'verde', rotulo: 'Verde', arte: () => pessoas.papaiNoel({ cor: 'verde' }), fundo: PESSEGO },
    ],
  },
  {
    n: 4,
    tipo: 'sombra',
    texto: 'De quem é a sombra?',
    opcoes: [
      { id: 'rena', rotulo: 'Rena', arte: animais.rena, fundo: MENTA },
      { id: 'boneco', rotulo: 'Boneco de neve', arte: animais.bonecoNeve, fundo: CEU },
      { id: 'noel', rotulo: 'Papai Noel', arte: pessoas.papaiNoel, fundo: ROSA, certa: true },
    ],
  },
  { n: 5, tipo: 'comparar', texto: 'Quem é o maior?' },
  {
    n: 6,
    tipo: 'escolher',
    texto: 'Por onde ele entra?',
    opcoes: [
      { id: 'chamine', rotulo: 'Chaminé', arte: objetos.chamine, fundo: MENTA, certa: true },
      { id: 'janela', rotulo: 'Janela', arte: objetos.janela, fundo: ROSA },
      { id: 'porta', rotulo: 'Porta', arte: objetos.porta, fundo: CEU },
    ],
  },
  {
    n: 7,
    tipo: 'intruso',
    texto: 'O que não combina?',
    opcoes: [
      { id: 'gorro', rotulo: 'Gorro', arte: objetos.gorroNoel, fundo: LIMAO },
      { id: 'treno', rotulo: 'Trenó', arte: objetos.treno, fundo: LILAS },
      { id: 'prancha', rotulo: 'Prancha de surfe', arte: objetos.prancha, fundo: PESSEGO, certa: true },
    ],
  },
  {
    n: 8,
    tipo: 'memoria',
    texto: 'Onde está o presente?',
    // ordem inicial; depois de virar, os cards trocam de lugar (posições 0, 1, 2).
    // Trocas: [1,2] leva o presente para a direita; [0,2] o deixa na esquerda ("número um").
    opcoes: [
      { id: 'gorro', rotulo: 'Gorro', arte: objetos.gorroNoel, fundo: LIMAO },
      { id: 'presente', rotulo: 'Presente', arte: objetos.presente, fundo: ROSA, certa: true },
      { id: 'meia', rotulo: 'Meia de Natal', arte: objetos.meia, fundo: MENTA },
    ],
    trocas: [
      [1, 2],
      [0, 2],
    ],
  },
];
