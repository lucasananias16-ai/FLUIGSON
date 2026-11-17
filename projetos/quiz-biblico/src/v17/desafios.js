'use strict';
/**
 * Vídeo 17 — O Natal na Floresta: os doze desafios, com o tipo de cada um e as
 * opções na ordem em que aparecem na tela (esquerda, meio, direita), conforme
 * v17-natal-floresta/01-narrativa.md.
 */
const fl = require('../art/floresta');
const neve = require('../art/neve');
const mar = require('../art/mar');
const sala = require('../art/sala');
const objetos = require('../art/objetos');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';

module.exports = [
  { n: 1, tipo: 'achar', texto: 'Ache o esquilo!' },
  { n: 2, tipo: 'contar', texto: 'Conte as pinhas!' },
  {
    n: 3,
    tipo: 'escolher',
    texto: 'O que o coelho come?',
    opcoes: [
      { id: 'cenoura', rotulo: 'Cenoura', arte: neve.cenoura, fundo: MENTA, certa: true },
      { id: 'peixe', rotulo: 'Peixe', arte: () => mar.peixinho('#4DA3FF'), fundo: CEU },
      { id: 'osso', rotulo: 'Osso', arte: fl.osso, fundo: PESSEGO },
    ],
  },
  {
    n: 4,
    tipo: 'sombra',
    texto: 'De quem é a sombra?',
    opcoes: [
      { id: 'coelho', rotulo: 'Coelho', arte: fl.coelho, fundo: ROSA },
      { id: 'esquilo', rotulo: 'Esquilo', arte: fl.esquilo, fundo: LIMAO },
      { id: 'urso', rotulo: 'Urso', arte: fl.urso, fundo: PESSEGO, certa: true },
    ],
  },
  {
    n: 5,
    tipo: 'falta',
    texto: 'O que está faltando?',
    opcoes: [
      { id: 'estrela', rotulo: 'Estrela', arte: objetos.estrela, fundo: CEU, certa: true },
      { id: 'meia', rotulo: 'Meia', arte: objetos.meia, fundo: MENTA },
      { id: 'bola', rotulo: 'Bola', arte: () => sala.bolaNatal('#4DA3FF'), fundo: ROSA },
    ],
  },
  { n: 6, tipo: 'comparar', texto: 'Quem é o maior?' },
  { n: 7, tipo: 'diferente', texto: 'Qual é o diferente?' },
  {
    n: 8,
    tipo: 'sequencia',
    texto: 'O que vem depois?',
    opcoes: [
      { id: 'pinha', rotulo: 'Pinha', arte: fl.pinha, fundo: PESSEGO },
      { id: 'bola', rotulo: 'Bola', arte: () => sala.bolaNatal('#E25A52'), fundo: ROSA, certa: true },
      { id: 'estrela', rotulo: 'Estrela', arte: objetos.estrela, fundo: CEU },
    ],
  },
  {
    n: 9,
    tipo: 'intruso',
    texto: 'O que não combina?',
    opcoes: [
      { id: 'gorro', rotulo: 'Gorro', arte: objetos.gorroNoel, fundo: ROSA },
      { id: 'cachecol', rotulo: 'Cachecol', arte: neve.cachecol, fundo: CEU },
      { id: 'guarda-sol', rotulo: 'Guarda-sol', arte: fl.guardaSol, fundo: LIMAO, certa: true },
    ],
  },
  {
    n: 10,
    tipo: 'memoria',
    texto: 'Onde está o esquilo?',
    // ordem inicial; trocas (de lugar): [1,0] leva o esquilo para a esquerda; [1,2] o deixa lá ("número um")
    opcoes: [
      { id: 'coelho', rotulo: 'Coelho', arte: fl.coelho, fundo: ROSA },
      { id: 'esquilo', rotulo: 'Esquilo', arte: fl.esquilo, fundo: LIMAO, certa: true },
      { id: 'urso', rotulo: 'Urso', arte: fl.urso, fundo: PESSEGO },
    ],
    trocas: [
      [1, 0],
      [1, 2],
    ],
  },
  {
    n: 11,
    tipo: 'escolher',
    texto: 'Onde o esquilo mora?',
    opcoes: [
      { id: 'arvore', rotulo: 'Árvore', arte: () => require('../art/criacao').arvore(), fundo: MENTA, certa: true },
      { id: 'mar', rotulo: 'Mar', arte: mar.praia, fundo: CEU },
      { id: 'nuvem', rotulo: 'Nuvem', arte: mar.nuvem, fundo: LILAS },
    ],
  },
  {
    n: 12,
    tipo: 'escolher',
    texto: 'O que os amigos fazem?',
    opcoes: [
      { id: 'abraco', rotulo: 'Abraço', arte: fl.abraco, fundo: ROSA, certa: true },
      { id: 'brigam', rotulo: 'Brigam', arte: fl.brigam, fundo: LIMAO },
      { id: 'sozinhos', rotulo: 'Sozinhos', arte: fl.sozinho, fundo: CEU },
    ],
  },
];
