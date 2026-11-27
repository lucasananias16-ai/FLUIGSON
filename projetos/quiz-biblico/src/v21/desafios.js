'use strict';
/**
 * Vídeo 21 — Daniel e os Leões: os doze desafios, com o tipo de cada um e as
 * opções na ordem em que aparecem na tela (esquerda, meio, direita), conforme
 * v21-biblico-daniel/01-narrativa.md.
 */
const dn = require('../art/daniel');
const cr = require('../art/criacao');
const neve = require('../art/neve');
const animais = require('../art/animais');
const objetos = require('../art/objetos');
const pessoas = require('../art/pessoas');
const ceuNatal = require('../art/ceuNatal');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';
const NOITE = '#34498F';

module.exports = [
  { n: 1, tipo: 'achar', texto: 'Ache o leãozinho!' },
  { n: 2, tipo: 'contar', texto: 'Conte os leões!' },
  {
    n: 3,
    tipo: 'escolher',
    texto: 'O que Daniel fazia?',
    primeiraOpcao: 2,
    opcoes: [
      { id: 'orava', rotulo: 'Orava', arte: dn.orando, fundo: LIMAO, certa: true },
      { id: 'pescava', rotulo: 'Pescava', arte: () => pessoas.pescador(), fundo: CEU },
      { id: 'dormia', rotulo: 'Dormia', arte: cr.descansar, fundo: LILAS },
    ],
  },
  {
    n: 4,
    tipo: 'sombra',
    texto: 'De quem é a sombra?',
    opcoes: [
      { id: 'ovelha', rotulo: 'Ovelha', arte: () => animais.ovelha(), fundo: MENTA },
      { id: 'leao', rotulo: 'Leão', arte: dn.leao('feliz'), fundo: LIMAO, certa: true },
      { id: 'camelo', rotulo: 'Camelo', arte: animais.camelo, fundo: PESSEGO },
    ],
  },
  {
    n: 5,
    tipo: 'falta',
    texto: 'O que está faltando?',
    opcoes: [
      { id: 'chapeu', rotulo: 'Chapéu', arte: neve.cartola, fundo: CEU },
      { id: 'gorro', rotulo: 'Gorro', arte: objetos.gorroNoel, fundo: ROSA },
      { id: 'coroa', rotulo: 'Coroa', arte: dn.coroa, fundo: LILAS, certa: true },
    ],
  },
  { n: 6, tipo: 'comparar', texto: 'Qual é o maior?' },
  { n: 7, tipo: 'diferente', texto: 'Qual é o diferente?' },
  {
    n: 8,
    tipo: 'sequencia',
    texto: 'O que vem depois?',
    opcoes: [
      { id: 'lua', rotulo: 'Lua', arte: objetos.lua, fundo: NOITE, certa: true },
      { id: 'estrela', rotulo: 'Estrela', arte: objetos.estrela, fundo: LILAS },
      { id: 'sol', rotulo: 'Sol', arte: ceuNatal.solCard, fundo: CEU },
    ],
  },
  {
    n: 9,
    tipo: 'intruso',
    texto: 'O que não tinha na cova?',
    opcoes: [
      { id: 'pedra', rotulo: 'Pedra', arte: dn.pedra, fundo: MENTA },
      { id: 'leao', rotulo: 'Leão', arte: dn.leao('feliz'), fundo: LIMAO },
      { id: 'televisao', rotulo: 'Televisão', arte: dn.televisao, fundo: CEU, certa: true },
    ],
  },
  {
    n: 10,
    tipo: 'memoria',
    texto: 'Onde está o anjo?',
    // ordem inicial; trocas (de lugar): [0,2] leva o anjo para a direita; [2,1] o traz para o meio ("número dois")
    opcoes: [
      { id: 'anjo', rotulo: 'Anjo', arte: () => pessoas.anjo(), fundo: CEU, certa: true },
      { id: 'coroa', rotulo: 'Coroa', arte: dn.coroa, fundo: LILAS },
      { id: 'leao', rotulo: 'Leão', arte: dn.leao('feliz'), fundo: LIMAO },
    ],
    trocas: [
      [0, 2],
      [2, 1],
    ],
  },
  {
    n: 11,
    tipo: 'escolher',
    texto: 'Quem cuidou de Daniel?',
    opcoes: [
      { id: 'anjo', rotulo: 'Anjo', arte: () => pessoas.anjo(), fundo: CEU, certa: true },
      { id: 'pescador', rotulo: 'Pescador', arte: () => pessoas.pescador(), fundo: MENTA },
      { id: 'padeiro', rotulo: 'Padeiro', arte: () => pessoas.padeiro(), fundo: PESSEGO },
    ],
  },
  {
    n: 12,
    tipo: 'escolher',
    texto: 'O que os leões fizeram?',
    opcoes: [
      { id: 'bravos', rotulo: 'Bravos', arte: dn.leao('bravo'), fundo: ROSA },
      { id: 'mansinhos', rotulo: 'Mansinhos', arte: dn.leao('manso'), fundo: LIMAO, certa: true },
      { id: 'fugiram', rotulo: 'Fugiram', arte: dn.leaoFugindo, fundo: CEU },
    ],
  },
];
