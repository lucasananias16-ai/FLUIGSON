'use strict';
/**
 * Vídeo 1 — Quiz da Arca de Noé: perguntas e opções na ordem em que aparecem
 * na tela (esquerda, meio, direita), como aprovado em 01-narrativa.md.
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
  {
    n: 1,
    texto: 'Quem construiu a arca?',
    opcoes: [
      { id: 'noe', rotulo: 'Noé', arte: pessoas.noe, fundo: LIMAO, certa: true },
      { id: 'davi', rotulo: 'Davi', arte: pessoas.davi, fundo: CEU },
      { id: 'moises', rotulo: 'Moisés', arte: pessoas.moises, fundo: MENTA },
    ],
  },
  {
    n: 2,
    texto: 'De que a arca foi feita?',
    opcoes: [
      { id: 'pedra', rotulo: 'Pedra', arte: objetos.pedras, fundo: PESSEGO },
      { id: 'madeira', rotulo: 'Madeira', arte: objetos.madeira, fundo: MENTA, certa: true },
      { id: 'gelo', rotulo: 'Gelo', arte: objetos.gelo, fundo: LILAS },
    ],
  },
  {
    n: 3,
    texto: 'Como os animais entraram?',
    opcoes: [
      { id: 'um', rotulo: 'Um sozinho', arte: animais.umElefante, fundo: LIMAO },
      { id: 'cinco', rotulo: 'Cinco de uma vez', arte: animais.cincoElefantes, fundo: ROSA },
      { id: 'dois', rotulo: 'Dois juntinhos', arte: animais.doisElefantes, fundo: MENTA, certa: true },
    ],
  },
  {
    n: 4,
    texto: 'Qual NÃO é um animal?',
    opcoes: [
      { id: 'leao', rotulo: 'Leão', arte: animais.leao, fundo: CEU },
      { id: 'guardachuva', rotulo: 'Guarda-chuva', arte: objetos.guardaChuva, fundo: LILAS, certa: true },
      { id: 'girafa', rotulo: 'Girafa', arte: animais.girafa, fundo: MENTA },
    ],
  },
  {
    n: 5,
    texto: 'O que caiu do céu?',
    opcoes: [
      { id: 'neve', rotulo: 'Neve', arte: objetos.neve, fundo: CEU },
      { id: 'folhas', rotulo: 'Folhas', arte: objetos.folhas, fundo: LIMAO },
      { id: 'chuva', rotulo: 'Chuva', arte: objetos.chuva, fundo: PESSEGO, certa: true },
    ],
  },
  {
    n: 6,
    texto: 'Quantos dias choveu?',
    semNumero: true, // as opções já são números: os cards não levam 1, 2, 3
    opcoes: [
      { id: '40', rotulo: 'Quarenta', arte: objetos.num40, fundo: LIMAO, certa: true },
      { id: '4', rotulo: 'Quatro', arte: objetos.num4, fundo: MENTA },
      { id: '10', rotulo: 'Dez', arte: objetos.num10, fundo: LILAS },
    ],
  },
  {
    n: 7,
    texto: 'Quem trouxe a folhinha?',
    opcoes: [
      { id: 'coruja', rotulo: 'Coruja', arte: animais.coruja, fundo: LILAS },
      { id: 'pomba', rotulo: 'Pomba', arte: animais.pomba, fundo: CEU, certa: true },
      { id: 'pinguim', rotulo: 'Pinguim', arte: animais.pinguim, fundo: PESSEGO },
    ],
  },
  {
    n: 8,
    texto: 'O que Deus colocou no céu?',
    opcoes: [
      { id: 'estrela', rotulo: 'Estrela', arte: objetos.estrela, fundo: ROSA },
      { id: 'lua', rotulo: 'Lua', arte: objetos.lua, fundo: LILAS },
      { id: 'arcoiris', rotulo: 'Arco-íris', arte: objetos.arcoIris, fundo: CEU, certa: true },
    ],
  },
];
