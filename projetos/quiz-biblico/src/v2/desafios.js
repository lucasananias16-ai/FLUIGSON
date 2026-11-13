'use strict';
/**
 * Vídeo 2 — Desafios de Davi e Golias: os oito desafios, com o tipo de cada
 * um e as opções na ordem em que aparecem na tela (esquerda, meio, direita),
 * como aprovado em v2-davi-e-golias/01-narrativa.md.
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
  { n: 1, tipo: 'achar', texto: 'Ache a ovelhinha!' },
  { n: 2, tipo: 'contar', texto: 'Conte as pedrinhas!' },
  {
    n: 3,
    tipo: 'sombra',
    texto: 'De quem é a sombra?',
    opcoes: [
      { id: 'davi', rotulo: 'Davi', arte: pessoas.davi, fundo: LIMAO },
      { id: 'ovelha', rotulo: 'Ovelhinha', arte: animais.ovelha, fundo: ROSA },
      { id: 'golias', rotulo: 'Golias', arte: pessoas.golias, fundo: CEU, certa: true },
    ],
  },
  { n: 4, tipo: 'comparar', texto: 'Quem é o maior?' },
  {
    n: 5,
    tipo: 'escolher',
    texto: 'O que Davi levou?',
    opcoes: [
      { id: 'funda', rotulo: 'Funda', arte: objetos.funda, fundo: MENTA, certa: true },
      { id: 'espada', rotulo: 'Espada', arte: objetos.espada, fundo: LILAS },
      { id: 'escudo', rotulo: 'Escudo', arte: objetos.escudo, fundo: CEU },
    ],
  },
  {
    n: 6,
    tipo: 'intruso',
    texto: 'O que não combina?',
    opcoes: [
      { id: 'cajado', rotulo: 'Cajado', arte: objetos.cajado, fundo: LIMAO },
      { id: 'skate', rotulo: 'Skate', arte: objetos.skate, fundo: LILAS, certa: true },
      { id: 'ovelha', rotulo: 'Ovelha', arte: animais.ovelha, fundo: MENTA },
    ],
  },
  {
    n: 7,
    tipo: 'memoria',
    texto: 'Onde está a harpa?',
    // ordem inicial; depois de virar, os cards trocam de lugar (posições 0, 1, 2)
    opcoes: [
      { id: 'tambor', rotulo: 'Tambor', arte: objetos.tambor, fundo: MENTA },
      { id: 'harpa', rotulo: 'Harpa', arte: objetos.harpa, fundo: PESSEGO, certa: true },
      { id: 'flauta', rotulo: 'Flauta', arte: objetos.flauta, fundo: ROSA },
    ],
    trocas: [
      [1, 2],
      [0, 2],
    ],
  },
  {
    n: 8,
    tipo: 'escolher',
    texto: 'Davi virou o quê?',
    opcoes: [
      { id: 'padeiro', rotulo: 'Padeiro', arte: pessoas.padeiro, fundo: LIMAO },
      { id: 'pescador', rotulo: 'Pescador', arte: pessoas.pescador, fundo: CEU },
      { id: 'rei', rotulo: 'Rei', arte: pessoas.reiDavi, fundo: LILAS, certa: true },
    ],
  },
];
