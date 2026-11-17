'use strict';
/**
 * Vídeo 15 — A Cartinha para o Papai Noel: os doze desafios, com o tipo de cada
 * um e as opções na ordem em que aparecem na tela (esquerda, meio, direita),
 * conforme v15-natal-cartinha/01-narrativa.md.
 */
const ct = require('../art/cartinha');
const of = require('../art/oficina');
const objetos = require('../art/objetos');
const pessoas = require('../art/pessoas');
const mar = require('../art/mar');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';

module.exports = [
  { n: 1, tipo: 'achar', texto: 'Ache a cartinha!' },
  { n: 2, tipo: 'contar', texto: 'Conte as cartinhas!' },
  {
    n: 3,
    tipo: 'escolher',
    texto: 'Com o que se escreve?',
    opcoes: [
      { id: 'lapis', rotulo: 'Lápis', arte: ct.lapis, fundo: LIMAO, certa: true },
      { id: 'garfo', rotulo: 'Garfo', arte: ct.garfo, fundo: CEU },
      { id: 'colher', rotulo: 'Colher', arte: ct.colher, fundo: MENTA },
    ],
  },
  {
    n: 4,
    tipo: 'sombra',
    texto: 'De quem é a sombra?',
    opcoes: [
      { id: 'bola', rotulo: 'Bola', arte: of.bola, fundo: MENTA },
      { id: 'ursinho', rotulo: 'Ursinho', arte: of.ursinho, fundo: PESSEGO, certa: true },
      { id: 'carrinho', rotulo: 'Carrinho', arte: of.carrinho, fundo: LIMAO },
    ],
  },
  {
    n: 5,
    tipo: 'falta',
    texto: 'O que está faltando?',
    opcoes: [
      { id: 'laco', rotulo: 'Laço', arte: () => of.laco('#E25A52'), fundo: ROSA },
      { id: 'botao', rotulo: 'Botão', arte: ct.botao, fundo: LIMAO },
      { id: 'selo', rotulo: 'Selo', arte: ct.selo, fundo: CEU, certa: true },
    ],
  },
  { n: 6, tipo: 'comparar', texto: 'Qual é o maior?' },
  { n: 7, tipo: 'diferente', texto: 'Qual é o diferente?' },
  {
    n: 8,
    tipo: 'sequencia',
    texto: 'O que vem depois?',
    opcoes: [
      { id: 'selo', rotulo: 'Selo', arte: ct.selo, fundo: CEU },
      { id: 'presente', rotulo: 'Presente', arte: objetos.presente, fundo: ROSA, certa: true },
      { id: 'lapis', rotulo: 'Lápis', arte: ct.lapis, fundo: LIMAO },
    ],
  },
  {
    n: 9,
    tipo: 'intruso',
    texto: 'O que não cabe?',
    opcoes: [
      { id: 'carta', rotulo: 'Cartinha', arte: ct.carta, fundo: LILAS },
      { id: 'foto', rotulo: 'Foto', arte: ct.foto, fundo: MENTA },
      { id: 'castelo', rotulo: 'Castelo', arte: objetos.castelo, fundo: ROSA, certa: true },
    ],
  },
  {
    n: 10,
    tipo: 'memoria',
    texto: 'Onde está a cartinha?',
    // ordem inicial; trocas (de lugar): [0,2] leva a cartinha para a direita; [1,2] a traz para o meio ("número dois")
    opcoes: [
      { id: 'carta', rotulo: 'Cartinha', arte: ct.carta, fundo: LILAS, certa: true },
      { id: 'selo', rotulo: 'Selo', arte: ct.selo, fundo: CEU },
      { id: 'lapis', rotulo: 'Lápis', arte: ct.lapis, fundo: LIMAO },
    ],
    trocas: [
      [0, 2],
      [1, 2],
    ],
  },
  {
    n: 11,
    tipo: 'escolher',
    texto: 'Quem lê as cartinhas?',
    opcoes: [
      { id: 'pescador', rotulo: 'Pescador', arte: pessoas.pescador, fundo: CEU },
      { id: 'noel', rotulo: 'Papai Noel', arte: () => pessoas.papaiNoel(), fundo: ROSA, certa: true },
      { id: 'padeiro', rotulo: 'Padeiro', arte: pessoas.padeiro, fundo: LIMAO },
    ],
  },
  {
    n: 12,
    tipo: 'escolher',
    texto: 'Para onde vai a cartinha?',
    opcoes: [
      { id: 'polo', rotulo: 'Polo Norte', arte: ct.poloNorte, fundo: CEU, certa: true },
      { id: 'praia', rotulo: 'Praia', arte: mar.praia, fundo: LIMAO },
      { id: 'floresta', rotulo: 'Floresta', arte: mar.floresta, fundo: MENTA },
    ],
  },
];
