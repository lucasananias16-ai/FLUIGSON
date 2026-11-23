'use strict';
/**
 * Vídeo 20 — o Natal no Polo Norte: os doze desafios, com o tipo de cada um e
 * as opções na ordem em que aparecem na tela (esquerda, meio, direita),
 * conforme v20-natal-polo-norte/01-narrativa.md.
 */
const pl = require('../art/polo');
const vr = require('../art/verao');
const neve = require('../art/neve');
const objetos = require('../art/objetos');
const animais = require('../art/animais');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';

module.exports = [
  { n: 1, tipo: 'achar', texto: 'Ache o pinguim!' },
  { n: 2, tipo: 'contar', texto: 'Conte os peixinhos!' },
  {
    n: 3,
    tipo: 'escolher',
    texto: 'O que a gente veste no frio?',
    primeiraOpcao: 2,
    opcoes: [
      { id: 'maio', rotulo: 'Maiô', arte: pl.maio, fundo: LIMAO },
      { id: 'casaco', rotulo: 'Casaco', arte: vr.casaco, fundo: CEU, certa: true },
      { id: 'chinelo', rotulo: 'Chinelo', arte: neve.chinelo, fundo: MENTA },
    ],
  },
  {
    n: 4,
    tipo: 'sombra',
    texto: 'De quem é a sombra?',
    opcoes: [
      { id: 'foca', rotulo: 'Foca', arte: pl.foca, fundo: CEU },
      { id: 'urso', rotulo: 'Urso-polar', arte: pl.ursoPolar, fundo: LILAS, certa: true },
      { id: 'pinguim', rotulo: 'Pinguim', arte: pl.pinguim, fundo: MENTA },
    ],
  },
  {
    n: 5,
    tipo: 'falta',
    texto: 'O que está faltando?',
    opcoes: [
      { id: 'chamine', rotulo: 'Chaminé', arte: objetos.chamine, fundo: PESSEGO, certa: true },
      { id: 'janela', rotulo: 'Janela', arte: objetos.janela, fundo: CEU },
      { id: 'porta', rotulo: 'Porta', arte: objetos.porta, fundo: LIMAO },
    ],
  },
  { n: 6, tipo: 'comparar', texto: 'Qual é o maior?' },
  { n: 7, tipo: 'diferente', texto: 'Qual é o diferente?' },
  {
    n: 8,
    tipo: 'sequencia',
    texto: 'O que vem depois?',
    opcoes: [
      { id: 'floco', rotulo: 'Floco', arte: pl.floco, fundo: CEU },
      { id: 'presente', rotulo: 'Presente', arte: objetos.presente, fundo: ROSA },
      { id: 'estrela', rotulo: 'Estrela', arte: objetos.estrela, fundo: LILAS, certa: true },
    ],
  },
  {
    n: 9,
    tipo: 'intruso',
    texto: 'Quem não mora no Polo Norte?',
    opcoes: [
      { id: 'pinguim', rotulo: 'Pinguim', arte: pl.pinguim, fundo: CEU },
      { id: 'camelo', rotulo: 'Camelo', arte: animais.camelo, fundo: LIMAO, certa: true },
      { id: 'foca', rotulo: 'Foca', arte: pl.foca, fundo: MENTA },
    ],
  },
  {
    n: 10,
    tipo: 'memoria',
    texto: 'Onde está o pinguim?',
    // ordem inicial; trocas (de lugar): [2,0] leva o pinguim para a esquerda; [1,2] troca os outros dois ("número um")
    opcoes: [
      { id: 'gorro', rotulo: 'Gorro', arte: pl.gorro, fundo: ROSA },
      { id: 'presente', rotulo: 'Presente', arte: objetos.presente, fundo: LILAS },
      { id: 'pinguim', rotulo: 'Pinguim', arte: pl.pinguim, fundo: CEU, certa: true },
    ],
    trocas: [
      [2, 0],
      [1, 2],
    ],
  },
  {
    n: 11,
    tipo: 'escolher',
    texto: 'Onde ficam os presentes?',
    opcoes: [
      { id: 'saco', rotulo: 'Saco vermelho', arte: pl.sacoPresentes, fundo: LIMAO, certa: true },
      { id: 'balde', rotulo: 'Balde', arte: pl.balde, fundo: ROSA },
      { id: 'aquario', rotulo: 'Aquário', arte: pl.aquario, fundo: MENTA },
    ],
  },
  {
    n: 12,
    tipo: 'escolher',
    texto: 'O que deixa o céu colorido?',
    opcoes: [
      { id: 'arco-iris', rotulo: 'Arco-íris', arte: pl.arcoIris, fundo: CEU },
      { id: 'aurora', rotulo: 'Aurora', arte: pl.aurora, fundo: LILAS, certa: true },
      { id: 'fogos', rotulo: 'Fogos', arte: pl.fogos, fundo: PESSEGO },
    ],
  },
];
