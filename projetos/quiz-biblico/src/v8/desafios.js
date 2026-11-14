'use strict';
/**
 * Vídeo 8 — A Oficina dos Duendes: os oito desafios, com o tipo de cada um e
 * as opções na ordem em que aparecem na tela (esquerda, meio, direita), como
 * aprovado em v8-natal-oficina/01-narrativa.md.
 */
const of = require('../art/oficina');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';
const BRANCO = '#FFFFFF';
const laco = (hex) => () => of.laco(hex);

module.exports = [
  { n: 1, tipo: 'achar', texto: 'Ache o ursinho!' },
  { n: 2, tipo: 'contar', texto: 'Conte os presentes!' },
  {
    n: 3,
    tipo: 'sombra',
    texto: 'De quem é a sombra?',
    opcoes: [
      { id: 'bola', rotulo: 'Bola', arte: of.bola, fundo: MENTA },
      { id: 'piao', rotulo: 'Pião', arte: of.piao, fundo: LIMAO },
      { id: 'trenzinho', rotulo: 'Trenzinho', arte: of.trenzinho, fundo: ROSA, certa: true },
    ],
  },
  { n: 4, tipo: 'comparar', texto: 'Qual é o maior?' },
  {
    n: 5,
    tipo: 'sequencia',
    texto: 'O que vem depois?',
    opcoes: [
      { id: 'ursinho', rotulo: 'Ursinho', arte: of.ursinho, fundo: PESSEGO, certa: true },
      { id: 'piao', rotulo: 'Pião', arte: of.piao, fundo: LIMAO },
      { id: 'boneca', rotulo: 'Boneca', arte: of.boneca, fundo: LILAS },
    ],
  },
  {
    n: 6,
    tipo: 'intruso',
    texto: 'O que não é brinquedo?',
    opcoes: [
      { id: 'boneca', rotulo: 'Boneca', arte: of.boneca, fundo: LILAS },
      { id: 'carrinho', rotulo: 'Carrinho', arte: of.carrinho, fundo: CEU },
      { id: 'vassoura', rotulo: 'Vassoura', arte: of.vassoura, fundo: MENTA, certa: true },
    ],
  },
  {
    n: 7,
    tipo: 'par',
    texto: 'Qual laço combina?',
    opcoes: [
      { id: 'azul', rotulo: 'Laço azul', arte: laco('#4DA3FF'), fundo: BRANCO },
      { id: 'vermelho', rotulo: 'Laço vermelho', arte: laco('#E25A52'), fundo: BRANCO, certa: true },
      { id: 'verde', rotulo: 'Laço verde', arte: laco('#5DBB7A'), fundo: BRANCO },
    ],
  },
  {
    n: 8,
    tipo: 'memoria',
    texto: 'Onde está o ursinho?',
    // ordem inicial; trocas: [0,1] leva o ursinho para o meio; [1,2] o deixa na direita ("número três")
    opcoes: [
      { id: 'ursinho', rotulo: 'Ursinho', arte: of.ursinho, fundo: PESSEGO, certa: true },
      { id: 'piao', rotulo: 'Pião', arte: of.piao, fundo: LIMAO },
      { id: 'bola', rotulo: 'Bola', arte: of.bola, fundo: MENTA },
    ],
    trocas: [
      [0, 1],
      [1, 2],
    ],
  },
];
