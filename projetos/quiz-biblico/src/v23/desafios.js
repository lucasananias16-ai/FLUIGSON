'use strict';
/**
 * Vídeo 23 — os Reis Magos e a Estrela: as doze brincadeiras, com o tipo de
 * cada uma e as opções na ordem em que aparecem na tela (esquerda, meio,
 * direita). `n` é o número "de dentro" (o dos áudios); o número mostrado na
 * tela e a ordem no vídeo estão em `roteiro.ordem`.
 */
const rs = require('../art/reis');
const mar = require('../art/mar');
const animais = require('../art/animais');
const objetos = require('../art/objetos');
const ceuNatal = require('../art/ceuNatal');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';
const NOITE = '#34498F';
const VAZIO = { vazio: true };
const tres = (artes, s = 0.36) => artes.map(([arte, x]) => ({ arte, x, y: 590, s }));
const palmeira = () => rs.palmeira(500, 900, 1.6);

module.exports = [
  { n: 1, tipo: 'achar', texto: 'Cadê a coroa?' },
  { n: 2, tipo: 'contar', texto: 'Conte os camelos!' },
  {
    n: 3,
    tipo: 'escolher',
    texto: 'O que brilhava no céu?',
    primeiraOpcao: 2,
    opcoes: [
      { id: 'lua', rotulo: 'Lua', arte: objetos.lua, fundo: NOITE },
      { id: 'nuvem', rotulo: 'Nuvem', arte: mar.nuvem, fundo: CEU },
      { id: 'estrela', rotulo: 'Estrela', arte: objetos.estrela, fundo: LILAS, certa: true },
    ],
  },
  {
    n: 4,
    tipo: 'sombra',
    texto: 'Quem vem lá?',
    opcoes: [
      { id: 'ovelha', rotulo: 'Ovelha', arte: () => animais.ovelha(), fundo: MENTA },
      { id: 'camelo', rotulo: 'Camelo', arte: animais.camelo, fundo: PESSEGO, certa: true },
      { id: 'leao', rotulo: 'Leão', arte: animais.leao, fundo: LIMAO },
    ],
  },
  {
    n: 5,
    tipo: 'falta',
    texto: 'Quem está faltando?',
    opcoes: [
      { id: 'sol', rotulo: 'Sol', arte: ceuNatal.solCard, fundo: CEU },
      { id: 'nuvem', rotulo: 'Nuvem', arte: mar.nuvem, fundo: MENTA },
      { id: 'estrela', rotulo: 'Estrela', arte: objetos.estrela, fundo: LILAS, certa: true },
    ],
  },
  { n: 6, tipo: 'comparar', texto: 'Qual é o pequenininho?' },
  { n: 7, tipo: 'diferente', texto: 'Qual é a diferente?' },
  {
    n: 8,
    tipo: 'sequencia',
    texto: 'Quem vem agora?',
    opcoes: [
      { id: 'camelo', rotulo: 'Camelo', arte: animais.camelo, fundo: PESSEGO, certa: true },
      { id: 'estrela', rotulo: 'Estrela', arte: objetos.estrela, fundo: LILAS },
      { id: 'presente', rotulo: 'Presente', arte: rs.PRES.vermelho, fundo: MENTA },
    ],
  },
  {
    n: 9,
    tipo: 'intruso',
    texto: 'Quem não mora no deserto?',
    opcoes: [
      { id: 'boneco', rotulo: 'Boneco de neve', arte: () => animais.bonecoNeve(), fundo: CEU, certa: true },
      { id: 'palmeira', rotulo: 'Palmeira', arte: palmeira, fundo: LIMAO },
      { id: 'camelo', rotulo: 'Camelo', arte: animais.camelo, fundo: PESSEGO },
    ],
  },
  {
    n: 10,
    tipo: 'memoria',
    texto: 'Onde está o menino Jesus?',
    // ordem inicial; três trocas (de lugar): [1,2] leva o menino Jesus para a direita; [0,2] o traz para a esquerda; [1,2] troca os outros dois ("número um")
    opcoes: [
      { id: 'coroa', rotulo: 'Coroa', arte: rs.coroa, fundo: LILAS },
      { id: 'jesus', rotulo: 'Menino Jesus', arte: rs.meninoJesus, fundo: LIMAO, certa: true },
      { id: 'presente', rotulo: 'Presente', arte: rs.PRES.azul, fundo: ROSA },
    ],
    trocas: [
      [1, 2],
      [0, 2],
      [1, 2],
    ],
  },
  {
    n: 13,
    tipo: 'sumiu',
    texto: 'Qual presente sumiu?',
    mostrar: { modo: 'sumiu', falta: 1, itens: tres([[rs.PRES.azul, 720], [rs.PRES.vermelho, 1070], [rs.PRES.amarelo, 1420]]) },
    lembrete: { antes: [{ arte: rs.PRES.azul }, VAZIO, { arte: rs.PRES.amarelo }], depois: [rs.PRES.azul, rs.PRES.vermelho, rs.PRES.amarelo].map((arte) => ({ arte })) },
    primeiraOpcao: 2,
    opcoes: [
      { id: 'azul', rotulo: 'Presente azul', arte: rs.PRES.azul, fundo: CEU },
      { id: 'vermelho', rotulo: 'Presente vermelho', arte: rs.PRES.vermelho, fundo: ROSA, certa: true },
      { id: 'amarelo', rotulo: 'Presente amarelo', arte: rs.PRES.amarelo, fundo: LIMAO },
    ],
  },
  {
    n: 14,
    tipo: 'aparece',
    texto: 'Quem chegou primeiro?',
    // na ordem em que chegam: o de verde (meio), o de roxo (esquerda) e o de vermelho (direita)
    mostrar: { modo: 'aparece', itens: tres([[rs.reiMago('verde'), 1070], [rs.reiMago('roxo'), 720], [rs.reiMago('vermelho'), 1420]], 0.4) },
    lembrete: { antes: [VAZIO, VAZIO, VAZIO], depois: [rs.reiMago('verde'), rs.reiMago('roxo'), rs.reiMago('vermelho')].map((arte, i) => ({ arte, num: i + 1 })) },
    opcoes: [
      { id: 'roxo', rotulo: 'Rei de roxo', arte: rs.reiMago('roxo'), fundo: LILAS },
      { id: 'verde', rotulo: 'Rei de verde', arte: rs.reiMago('verde'), fundo: MENTA, certa: true },
      { id: 'vermelho', rotulo: 'Rei de vermelho', arte: rs.reiMago('vermelho'), fundo: ROSA },
    ],
  },
];
