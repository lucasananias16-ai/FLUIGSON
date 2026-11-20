'use strict';
/**
 * Vídeo 18 — As Estações do Ano: os doze desafios, com o tipo de cada um e as
 * opções na ordem em que aparecem na tela (esquerda, meio, direita), conforme
 * v18-estacoes/01-narrativa.md.
 */
const es = require('../art/estacoes');
const neve = require('../art/neve');
const mar = require('../art/mar');
const cr = require('../art/criacao');
const objetos = require('../art/objetos');
const ceuNatal = require('../art/ceuNatal');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';
const NOITE = '#34498F';
const est = (e) => () => es.arvoreEstacao(e);

module.exports = [
  { n: 1, tipo: 'achar', texto: 'Ache a borboleta!' },
  { n: 2, tipo: 'contar', texto: 'Conte as folhas!' },
  {
    n: 3,
    tipo: 'escolher',
    texto: 'O que é gostoso no verão?',
    primeiraOpcao: 2,
    opcoes: [
      { id: 'sorvete', rotulo: 'Sorvete', arte: es.sorvete, fundo: ROSA, certa: true },
      { id: 'cachecol', rotulo: 'Cachecol', arte: neve.cachecol, fundo: CEU },
      { id: 'luva', rotulo: 'Luva', arte: () => neve.luva('#4DA3FF'), fundo: LIMAO },
    ],
  },
  {
    n: 4,
    tipo: 'sombra',
    texto: 'De quem é a sombra?',
    opcoes: [
      { id: 'guarda-chuva', rotulo: 'Guarda-chuva', arte: objetos.guardaChuva, fundo: MENTA, certa: true },
      { id: 'sorvete', rotulo: 'Sorvete', arte: es.sorvete, fundo: ROSA },
      { id: 'cachecol', rotulo: 'Cachecol', arte: neve.cachecol, fundo: CEU },
    ],
  },
  {
    n: 5,
    tipo: 'falta',
    texto: 'O que está faltando?',
    opcoes: [
      { id: 'lua', rotulo: 'Lua', arte: objetos.lua, fundo: NOITE },
      { id: 'sol', rotulo: 'Sol', arte: ceuNatal.solCard, fundo: LIMAO, certa: true },
      { id: 'nuvem', rotulo: 'Nuvem', arte: mar.nuvem, fundo: CEU },
    ],
  },
  { n: 6, tipo: 'comparar', texto: 'Qual é o maior?' },
  { n: 7, tipo: 'diferente', texto: 'Qual é a diferente?' },
  {
    n: 8,
    tipo: 'sequencia',
    texto: 'Qual vem depois?',
    opcoes: [
      { id: 'inverno', rotulo: 'Inverno', arte: est('inverno'), fundo: CEU },
      { id: 'verao', rotulo: 'Verão', arte: est('verao'), fundo: LIMAO, certa: true },
      { id: 'outono', rotulo: 'Outono', arte: est('outono'), fundo: PESSEGO },
    ],
  },
  {
    n: 9,
    tipo: 'intruso',
    texto: 'O que não combina?',
    opcoes: [
      { id: 'cachecol', rotulo: 'Cachecol', arte: neve.cachecol, fundo: CEU },
      { id: 'luva', rotulo: 'Luva', arte: () => neve.luva('#E25A52'), fundo: LILAS },
      { id: 'boia', rotulo: 'Boia', arte: es.boia, fundo: LIMAO, certa: true },
    ],
  },
  {
    n: 10,
    tipo: 'memoria',
    texto: 'Onde está a flor?',
    // ordem inicial; trocas (de lugar): [2,0] leva a flor para a esquerda; [0,1] a traz para o meio ("número dois")
    opcoes: [
      { id: 'sol', rotulo: 'Sol', arte: ceuNatal.solCard, fundo: LIMAO },
      { id: 'guarda-chuva', rotulo: 'Guarda-chuva', arte: objetos.guardaChuva, fundo: MENTA },
      { id: 'flor', rotulo: 'Flor', arte: () => cr.flor('#FF8FB1'), fundo: ROSA, certa: true },
    ],
    trocas: [
      [2, 0],
      [0, 1],
    ],
  },
  {
    n: 11,
    tipo: 'escolher',
    texto: 'Quando as folhas caem?',
    opcoes: [
      { id: 'primavera', rotulo: 'Primavera', arte: est('primavera'), fundo: ROSA },
      { id: 'outono', rotulo: 'Outono', arte: est('outono'), fundo: PESSEGO, certa: true },
      { id: 'verao', rotulo: 'Verão', arte: est('verao'), fundo: LIMAO },
    ],
  },
  {
    n: 12,
    tipo: 'escolher',
    texto: 'Quando faz mais frio?',
    opcoes: [
      { id: 'verao', rotulo: 'Verão', arte: est('verao'), fundo: LIMAO },
      { id: 'inverno', rotulo: 'Inverno', arte: est('inverno'), fundo: CEU, certa: true },
      { id: 'primavera', rotulo: 'Primavera', arte: est('primavera'), fundo: ROSA },
    ],
  },
];
