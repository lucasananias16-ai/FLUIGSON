'use strict';
/**
 * Vídeo 9 — A Árvore de Natal: os oito desafios, com o tipo de cada um e as
 * opções na ordem em que aparecem na tela (esquerda, meio, direita), como
 * aprovado em v9-natal-arvore/01-narrativa.md.
 */
const sala = require('../art/sala');
const objetos = require('../art/objetos');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';
const BRANCO = '#FFFFFF';
const luz = (hex) => () => sala.luz(hex);

module.exports = [
  { n: 1, tipo: 'achar', texto: 'Ache a estrela!' },
  { n: 2, tipo: 'contar', texto: 'Conte as bolas!' },
  {
    n: 3,
    tipo: 'escolher',
    texto: 'O que vai no topo?',
    opcoes: [
      { id: 'meia', rotulo: 'Meia', arte: objetos.meia, fundo: MENTA },
      { id: 'estrela', rotulo: 'Estrela', arte: objetos.estrela, fundo: CEU, certa: true },
      { id: 'bota', rotulo: 'Bota', arte: sala.bota, fundo: LIMAO },
    ],
  },
  {
    n: 4,
    tipo: 'sequencia',
    texto: 'Qual vem depois?',
    opcoes: [
      { id: 'amarela', rotulo: 'Luz amarela', arte: luz('#FFD23F'), fundo: BRANCO, certa: true },
      { id: 'azul', rotulo: 'Luz azul', arte: luz('#4DA3FF'), fundo: BRANCO },
      { id: 'verde', rotulo: 'Luz verde', arte: luz('#5DBB7A'), fundo: BRANCO },
    ],
  },
  { n: 5, tipo: 'diferente', texto: 'Qual é o diferente?' },
  { n: 6, tipo: 'comparar', texto: 'Qual é o maior?' },
  {
    n: 7,
    tipo: 'intruso',
    texto: 'O que não combina?',
    opcoes: [
      { id: 'bola', rotulo: 'Bola', arte: () => sala.bolaNatal('#4DA3FF'), fundo: ROSA },
      { id: 'sino', rotulo: 'Sino', arte: sala.sino, fundo: LILAS },
      { id: 'guarda-chuva', rotulo: 'Guarda-chuva', arte: objetos.guardaChuva, fundo: PESSEGO, certa: true },
    ],
  },
  {
    n: 8,
    tipo: 'memoria',
    texto: 'Onde está a estrela?',
    // ordem inicial; trocas: [0,2] leva a estrela para a esquerda; [0,1] a deixa no meio ("número dois")
    opcoes: [
      { id: 'bola', rotulo: 'Bola', arte: () => sala.bolaNatal('#E25A52'), fundo: MENTA },
      { id: 'sino', rotulo: 'Sino', arte: sala.sino, fundo: LILAS },
      { id: 'estrela', rotulo: 'Estrela', arte: objetos.estrela, fundo: CEU, certa: true },
    ],
    trocas: [
      [0, 2],
      [0, 1],
    ],
  },
];
