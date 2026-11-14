'use strict';
/**
 * Vídeo 11 — A Ceia e os Doces de Natal: os oito desafios, com o tipo de cada
 * um e as opções na ordem em que aparecem na tela (esquerda, meio, direita),
 * como aprovado em v11-natal-ceia/01-narrativa.md.
 */
const ceia = require('../art/ceia');
const cores = require('../art/cores');
const sala = require('../art/sala');
const objetos = require('../art/objetos');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';

module.exports = [
  { n: 1, tipo: 'achar', texto: 'Ache o biscoito!' },
  { n: 2, tipo: 'contar', texto: 'Conte as velas!' },
  {
    n: 3,
    tipo: 'sombra',
    texto: 'De quem é a sombra?',
    opcoes: [
      { id: 'maca', rotulo: 'Maçã', arte: cores.maca, fundo: MENTA },
      { id: 'banana', rotulo: 'Banana', arte: cores.banana, fundo: CEU },
      { id: 'panetone', rotulo: 'Panetone', arte: ceia.panetone, fundo: ROSA, certa: true },
    ],
  },
  {
    n: 4,
    tipo: 'escolher',
    texto: 'Qual é a estrela?',
    opcoes: [
      { id: 'estrela', rotulo: 'Biscoito de estrela', arte: ceia.biscoitoEstrela, fundo: CEU, certa: true },
      { id: 'coracao', rotulo: 'Biscoito de coração', arte: ceia.biscoitoCoracao, fundo: ROSA },
      { id: 'redondo', rotulo: 'Biscoito redondo', arte: ceia.biscoitoRedondo, fundo: MENTA },
    ],
  },
  { n: 5, tipo: 'comparar', texto: 'Qual é o maior?' },
  {
    n: 6,
    tipo: 'sequencia',
    texto: 'O que vem depois?',
    opcoes: [
      { id: 'maca', rotulo: 'Maçã', arte: cores.maca, fundo: LIMAO },
      { id: 'pirulito', rotulo: 'Pirulito', arte: ceia.pirulito, fundo: LILAS, certa: true },
      { id: 'biscoito', rotulo: 'Biscoito', arte: ceia.biscoitoRedondo, fundo: PESSEGO },
    ],
  },
  {
    n: 7,
    tipo: 'intruso',
    texto: 'O que não combina?',
    opcoes: [
      { id: 'bota', rotulo: 'Bota', arte: sala.bota, fundo: CEU, certa: true },
      { id: 'panetone', rotulo: 'Panetone', arte: ceia.panetone, fundo: ROSA },
      { id: 'maca', rotulo: 'Maçã', arte: cores.maca, fundo: MENTA },
    ],
  },
  {
    n: 8,
    tipo: 'memoria',
    texto: 'Onde está o panetone?',
    // ordem inicial; trocas: [0,1] leva o panetone para o meio; [1,2] o deixa na direita ("número três")
    opcoes: [
      { id: 'panetone', rotulo: 'Panetone', arte: ceia.panetone, fundo: ROSA, certa: true },
      { id: 'biscoito', rotulo: 'Biscoito', arte: ceia.biscoitoEstrela, fundo: CEU },
      { id: 'presente', rotulo: 'Presente', arte: objetos.presente, fundo: MENTA },
    ],
    trocas: [
      [0, 1],
      [1, 2],
    ],
  },
];
