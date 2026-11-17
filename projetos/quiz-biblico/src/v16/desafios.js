'use strict';
/**
 * Vídeo 16 — A Criação do Mundo: os doze desafios, com o tipo de cada um e as
 * opções na ordem em que aparecem na tela (esquerda, meio, direita), conforme
 * v16-biblico-criacao/01-narrativa.md.
 */
const cr = require('../art/criacao');
const of = require('../art/oficina');
const animais = require('../art/animais');
const objetos = require('../art/objetos');
const ceuNatal = require('../art/ceuNatal');
const mar = require('../art/mar');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';
const NOITE = '#34498F';

module.exports = [
  { n: 1, tipo: 'achar', texto: 'Ache o passarinho!' },
  { n: 2, tipo: 'contar', texto: 'Conte as estrelas!' },
  {
    n: 3,
    tipo: 'escolher',
    texto: 'O que Deus fez primeiro?',
    opcoes: [
      { id: 'luz', rotulo: 'Luz', arte: cr.luz, fundo: LIMAO, certa: true },
      { id: 'carro', rotulo: 'Carro', arte: of.carrinho, fundo: CEU },
      { id: 'casa', rotulo: 'Casa', arte: cr.casa, fundo: MENTA },
    ],
  },
  {
    n: 4,
    tipo: 'sombra',
    texto: 'De quem é a sombra?',
    opcoes: [
      { id: 'leao', rotulo: 'Leão', arte: animais.leao, fundo: LIMAO },
      { id: 'girafa', rotulo: 'Girafa', arte: animais.girafa, fundo: MENTA },
      { id: 'elefante', rotulo: 'Elefante', arte: animais.elefante, fundo: CEU, certa: true },
    ],
  },
  {
    n: 5,
    tipo: 'falta',
    texto: 'O que está faltando?',
    opcoes: [
      { id: 'sol', rotulo: 'Sol', arte: ceuNatal.solCard, fundo: CEU },
      { id: 'lua', rotulo: 'Lua', arte: objetos.lua, fundo: NOITE, certa: true },
      { id: 'guarda-chuva', rotulo: 'Guarda-chuva', arte: objetos.guardaChuva, fundo: MENTA },
    ],
  },
  { n: 6, tipo: 'comparar', texto: 'Quem é o maior?' },
  { n: 7, tipo: 'diferente', texto: 'Qual é a diferente?' },
  {
    n: 8,
    tipo: 'sequencia',
    texto: 'O que vem depois?',
    opcoes: [
      { id: 'lua', rotulo: 'Lua', arte: objetos.lua, fundo: NOITE, certa: true },
      { id: 'estrela', rotulo: 'Estrela', arte: objetos.estrela, fundo: LILAS },
      { id: 'sol', rotulo: 'Sol', arte: ceuNatal.solCard, fundo: CEU },
    ],
  },
  {
    n: 9,
    tipo: 'intruso',
    texto: 'O que Deus não criou?',
    opcoes: [
      { id: 'arvore', rotulo: 'Árvore', arte: cr.arvore, fundo: MENTA },
      { id: 'peixe', rotulo: 'Peixe', arte: () => mar.peixinho('#4DA3FF'), fundo: CEU },
      { id: 'foguete', rotulo: 'Foguete', arte: objetos.foguete, fundo: LILAS, certa: true },
    ],
  },
  {
    n: 10,
    tipo: 'memoria',
    texto: 'Onde está o sol?',
    // ordem inicial; trocas (de lugar): [0,2] leva o sol para a direita; [0,1] o deixa lá ("número três")
    opcoes: [
      { id: 'sol', rotulo: 'Sol', arte: ceuNatal.solCard, fundo: CEU, certa: true },
      { id: 'lua', rotulo: 'Lua', arte: objetos.lua, fundo: NOITE },
      { id: 'estrela', rotulo: 'Estrela', arte: objetos.estrela, fundo: LILAS },
    ],
    trocas: [
      [0, 2],
      [0, 1],
    ],
  },
  {
    n: 11,
    tipo: 'escolher',
    texto: 'Quem mora na água?',
    opcoes: [
      { id: 'leao', rotulo: 'Leão', arte: animais.leao, fundo: LIMAO },
      { id: 'peixe', rotulo: 'Peixe', arte: () => mar.peixinho('#FF8A3A'), fundo: CEU, certa: true },
      { id: 'passarinho', rotulo: 'Passarinho', arte: animais.pomba, fundo: ROSA },
    ],
  },
  {
    n: 12,
    tipo: 'escolher',
    texto: 'O que Deus fez no 7º dia?',
    opcoes: [
      { id: 'descansou', rotulo: 'Descansou', arte: cr.descansar, fundo: LILAS, certa: true },
      { id: 'correu', rotulo: 'Correu', arte: cr.correr, fundo: PESSEGO },
      { id: 'nadou', rotulo: 'Nadou', arte: cr.nadar, fundo: CEU },
    ],
  },
];
