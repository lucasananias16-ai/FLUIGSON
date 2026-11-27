'use strict';
/**
 * Vídeo 22 — a Véspera de Natal: os doze desafios, com o tipo de cada um e as
 * opções na ordem em que aparecem na tela (esquerda, meio, direita), conforme
 * v22-natal-vespera/01-narrativa.md.
 */
const vp = require('../art/vespera');
const vr = require('../art/verao');
const es = require('../art/estacoes');
const cr = require('../art/criacao');
const dn = require('../art/daniel');
const ceia = require('../art/ceia');
const sala = require('../art/sala');
const objetos = require('../art/objetos');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';
const vela = () => ceia.vela();

module.exports = [
  { n: 1, tipo: 'achar', texto: 'Ache o biscoito!' },
  { n: 2, tipo: 'contar', texto: 'Conte as meias!' },
  {
    n: 3,
    tipo: 'escolher',
    texto: 'O que deixar para o Papai Noel?',
    primeiraOpcao: 2,
    opcoes: [
      { id: 'leite', rotulo: 'Leite com biscoito', arte: vp.leiteBiscoito, fundo: CEU, certa: true },
      { id: 'sapato', rotulo: 'Sapato', arte: cr.correr, fundo: LIMAO },
      { id: 'pedra', rotulo: 'Pedra', arte: dn.pedra, fundo: MENTA },
    ],
  },
  {
    n: 4,
    tipo: 'sombra',
    texto: 'De quem é a sombra?',
    opcoes: [
      { id: 'sino', rotulo: 'Sino', arte: sala.sino, fundo: LILAS },
      { id: 'meia', rotulo: 'Meia', arte: vp.meia, fundo: MENTA, certa: true },
      { id: 'vela', rotulo: 'Vela', arte: vela, fundo: PESSEGO },
    ],
  },
  {
    n: 5,
    tipo: 'falta',
    texto: 'O que está faltando?',
    opcoes: [
      { id: 'neve', rotulo: 'Neve', arte: objetos.neve, fundo: CEU },
      { id: 'flor', rotulo: 'Flor', arte: () => cr.flor('#FF8FB1'), fundo: MENTA },
      { id: 'fogo', rotulo: 'Fogo', arte: vp.fogo, fundo: LIMAO, certa: true },
    ],
  },
  { n: 6, tipo: 'comparar', texto: 'Qual é a maior?' },
  { n: 7, tipo: 'diferente', texto: 'Qual é a diferente?' },
  {
    n: 8,
    tipo: 'sequencia',
    texto: 'O que vem depois?',
    opcoes: [
      { id: 'vela', rotulo: 'Vela', arte: vela, fundo: PESSEGO },
      { id: 'presente', rotulo: 'Presente', arte: objetos.presente, fundo: ROSA },
      { id: 'sino', rotulo: 'Sino', arte: sala.sino, fundo: LILAS, certa: true },
    ],
  },
  {
    n: 9,
    tipo: 'intruso',
    texto: 'O que não combina?',
    opcoes: [
      { id: 'vela', rotulo: 'Vela', arte: vela, fundo: PESSEGO },
      { id: 'boia', rotulo: 'Boia', arte: es.boia, fundo: CEU, certa: true },
      { id: 'sino', rotulo: 'Sino', arte: sala.sino, fundo: LILAS },
    ],
  },
  {
    n: 10,
    tipo: 'memoria',
    texto: 'Onde está a meia?',
    // ordem inicial; trocas (de lugar): [0,1] leva a meia para o meio; [1,2] a leva para a direita ("número três")
    opcoes: [
      { id: 'meia', rotulo: 'Meia', arte: vp.meia, fundo: MENTA, certa: true },
      { id: 'vela', rotulo: 'Vela', arte: vela, fundo: PESSEGO },
      { id: 'presente', rotulo: 'Presente', arte: objetos.presente, fundo: LILAS },
    ],
    trocas: [
      [0, 1],
      [1, 2],
    ],
  },
  {
    n: 11,
    tipo: 'escolher',
    texto: 'O que vestir para dormir?',
    opcoes: [
      { id: 'pijama', rotulo: 'Pijama', arte: vp.pijama, fundo: LILAS, certa: true },
      { id: 'casaco', rotulo: 'Casaco', arte: vr.casaco, fundo: ROSA },
      { id: 'bermuda', rotulo: 'Bermuda', arte: vr.bermuda, fundo: LIMAO },
    ],
  },
  {
    n: 12,
    tipo: 'escolher',
    texto: 'Quando o Papai Noel chega?',
    opcoes: [
      { id: 'manha', rotulo: 'De manhã', arte: vp.horaDe('manha'), fundo: PESSEGO },
      { id: 'tarde', rotulo: 'De tarde', arte: vp.horaDe('tarde'), fundo: CEU },
      { id: 'noite', rotulo: 'De noite', arte: vp.horaDe('noite'), fundo: LILAS, certa: true },
    ],
  },
];
