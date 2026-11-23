'use strict';
/**
 * Vídeo 19 — o Natal no Verão: os doze desafios, com o tipo de cada um e as
 * opções na ordem em que aparecem na tela (esquerda, meio, direita), conforme
 * v19-natal-verao/01-narrativa.md.
 */
const vr = require('../art/verao');
const es = require('../art/estacoes');
const neve = require('../art/neve');
const mar = require('../art/mar');
const objetos = require('../art/objetos');
const floresta = require('../art/floresta');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';
const est = (e) => () => es.arvoreEstacao(e);

module.exports = [
  { n: 1, tipo: 'achar', texto: 'Ache o Papai Noel!' },
  { n: 2, tipo: 'contar', texto: 'Conte as conchinhas!' },
  {
    n: 3,
    tipo: 'escolher',
    texto: 'O que refresca no calor?',
    primeiraOpcao: 2,
    opcoes: [
      { id: 'sopa', rotulo: 'Sopa quente', arte: vr.sopa, fundo: PESSEGO },
      { id: 'coco', rotulo: 'Água de coco', arte: vr.aguaCoco, fundo: MENTA, certa: true },
      { id: 'chocolate', rotulo: 'Chocolate quente', arte: vr.chocolateQuente, fundo: LILAS },
    ],
  },
  {
    n: 4,
    tipo: 'sombra',
    texto: 'De quem é a sombra?',
    opcoes: [
      { id: 'barco', rotulo: 'Barco', arte: objetos.barco, fundo: CEU },
      { id: 'treno', rotulo: 'Trenó', arte: objetos.treno, fundo: ROSA },
      { id: 'castelo', rotulo: 'Castelo de areia', arte: vr.casteloAreia, fundo: LIMAO, certa: true },
    ],
  },
  {
    n: 5,
    tipo: 'falta',
    texto: 'O que está faltando?',
    opcoes: [
      { id: 'estrela', rotulo: 'Estrela', arte: objetos.estrela, fundo: LILAS, certa: true },
      { id: 'peixe', rotulo: 'Peixe', arte: mar.peixinho, fundo: CEU },
      { id: 'concha', rotulo: 'Concha', arte: mar.concha, fundo: ROSA },
    ],
  },
  { n: 6, tipo: 'comparar', texto: 'Qual é o maior?' },
  { n: 7, tipo: 'diferente', texto: 'Qual é o diferente?' },
  {
    n: 8,
    tipo: 'sequencia',
    texto: 'O que vem depois?',
    opcoes: [
      { id: 'concha', rotulo: 'Concha', arte: mar.concha, fundo: ROSA },
      { id: 'estrela-do-mar', rotulo: 'Estrela-do-mar', arte: mar.estrelaMar, fundo: LIMAO, certa: true },
      { id: 'peixe', rotulo: 'Peixe', arte: mar.peixinho, fundo: CEU },
    ],
  },
  {
    n: 9,
    tipo: 'intruso',
    texto: 'O que não combina?',
    opcoes: [
      { id: 'casaco', rotulo: 'Casaco', arte: vr.casaco, fundo: CEU, certa: true },
      { id: 'guarda-sol', rotulo: 'Guarda-sol', arte: floresta.guardaSol, fundo: LIMAO },
      { id: 'chinelo', rotulo: 'Chinelo', arte: neve.chinelo, fundo: MENTA },
    ],
  },
  {
    n: 10,
    tipo: 'memoria',
    texto: 'Onde está o presente?',
    // ordem inicial; trocas (de lugar): [1,2] leva o presente para a direita; [0,1] troca os outros dois ("número três")
    opcoes: [
      { id: 'sorvete', rotulo: 'Sorvete', arte: vr.sorveteCor('#FF8FB1'), fundo: ROSA },
      { id: 'presente', rotulo: 'Presente', arte: objetos.presente, fundo: LILAS, certa: true },
      { id: 'coco', rotulo: 'Coco', arte: vr.coco, fundo: MENTA },
    ],
    trocas: [
      [1, 2],
      [0, 1],
    ],
  },
  {
    n: 11,
    tipo: 'escolher',
    texto: 'O que ele veste na praia?',
    opcoes: [
      { id: 'casaco', rotulo: 'Casaco', arte: vr.casaco, fundo: CEU },
      { id: 'cachecol', rotulo: 'Cachecol', arte: neve.cachecol, fundo: LILAS },
      { id: 'bermuda', rotulo: 'Bermuda', arte: vr.bermuda, fundo: LIMAO, certa: true },
    ],
  },
  {
    n: 12,
    tipo: 'escolher',
    texto: 'Quando é o Natal no Brasil?',
    opcoes: [
      { id: 'inverno', rotulo: 'Inverno', arte: est('inverno'), fundo: CEU },
      { id: 'verao', rotulo: 'Verão', arte: est('verao'), fundo: LIMAO, certa: true },
      { id: 'outono', rotulo: 'Outono', arte: est('outono'), fundo: PESSEGO },
    ],
  },
];
