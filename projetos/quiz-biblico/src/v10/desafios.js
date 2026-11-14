'use strict';
/**
 * Vídeo 10 — As Renas e o Trenó: os oito desafios, com o tipo de cada um e as
 * opções na ordem em que aparecem na tela (esquerda, meio, direita), como
 * aprovado em v10-natal-renas/01-narrativa.md.
 */
const ceu = require('../art/ceuNatal');
const of = require('../art/oficina');
const animais = require('../art/animais');
const objetos = require('../art/objetos');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';
const NOITE = '#34498F';

module.exports = [
  { n: 1, tipo: 'achar', texto: 'Ache a rena!' },
  { n: 2, tipo: 'contar', texto: 'Conte as casinhas!' },
  {
    n: 3,
    tipo: 'sombra',
    texto: 'De quem é a sombra?',
    opcoes: [
      { id: 'carrinho', rotulo: 'Carrinho', arte: of.carrinho, fundo: MENTA },
      { id: 'barco', rotulo: 'Barco', arte: objetos.barco, fundo: LIMAO },
      { id: 'treno', rotulo: 'Trenó', arte: objetos.treno, fundo: ROSA, certa: true },
    ],
  },
  {
    n: 4,
    tipo: 'escolher',
    texto: 'Quem puxa o trenó?',
    opcoes: [
      { id: 'rena', rotulo: 'Rena', arte: animais.rena, fundo: PESSEGO, certa: true },
      { id: 'elefante', rotulo: 'Elefante', arte: animais.elefante, fundo: CEU },
      { id: 'girafa', rotulo: 'Girafa', arte: animais.girafa, fundo: MENTA },
    ],
  },
  { n: 5, tipo: 'diferente', texto: 'Qual é a diferente?' },
  {
    n: 6,
    tipo: 'sequencia',
    texto: 'O que vem depois?',
    opcoes: [
      { id: 'lua', rotulo: 'Lua', arte: objetos.lua, fundo: NOITE, certa: true },
      { id: 'estrela', rotulo: 'Estrela', arte: objetos.estrela, fundo: LILAS },
      { id: 'sol', rotulo: 'Sol', arte: ceu.solCard, fundo: CEU },
    ],
  },
  {
    n: 7,
    tipo: 'intruso',
    texto: 'O que não cabe?',
    opcoes: [
      { id: 'ursinho', rotulo: 'Ursinho', arte: of.ursinho, fundo: ROSA },
      { id: 'bola', rotulo: 'Bola', arte: of.bola, fundo: LIMAO },
      { id: 'elefante', rotulo: 'Elefante', arte: animais.elefante, fundo: CEU, certa: true },
    ],
  },
  {
    n: 8,
    tipo: 'memoria',
    texto: 'Onde está o trenó?',
    // ordem inicial; trocas: [1,2] leva o trenó para o meio; [0,1] o deixa na esquerda ("número um")
    opcoes: [
      { id: 'rena', rotulo: 'Rena', arte: animais.rena, fundo: PESSEGO },
      { id: 'presente', rotulo: 'Presente', arte: objetos.presente, fundo: MENTA },
      { id: 'treno', rotulo: 'Trenó', arte: objetos.treno, fundo: ROSA, certa: true },
    ],
    trocas: [
      [1, 2],
      [0, 1],
    ],
  },
];
