'use strict';
/**
 * Vídeo 24 — a Ovelhinha Perdida: as doze brincadeiras, com o tipo de cada uma
 * e as opções na ordem em que aparecem na tela (esquerda, meio, direita). `n`
 * é o número "de dentro" (o dos áudios); o número mostrado na tela e a ordem
 * no vídeo estão em `roteiro.ordem`.
 */
const op = require('../art/ovelhaPerdida');
const rs = require('../art/reis');
const dn = require('../art/daniel');
const cr = require('../art/criacao');
const animais = require('../art/animais');
const objetos = require('../art/objetos');
const pessoas = require('../art/pessoas');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';
const VAZIO = { vazio: true };
const tres = (artes, s = 0.36) => artes.map(([arte, x]) => ({ arte, x, y: 590, s }));
const flor = () => cr.flor('#FF8FB1');

module.exports = [
  { n: 1, tipo: 'achar', texto: 'Cadê a ovelhinha?' },
  { n: 2, tipo: 'contar', texto: 'Conte as ovelhinhas!' },
  {
    n: 3,
    tipo: 'escolher',
    texto: 'Quem cuida das ovelhinhas?',
    opcoes: [
      { id: 'pescador', rotulo: 'Pescador', arte: () => pessoas.pescador(), fundo: CEU },
      { id: 'pastor', rotulo: 'Pastor', arte: op.pastor, fundo: MENTA, certa: true },
      { id: 'padeiro', rotulo: 'Padeiro', arte: () => pessoas.padeiro(), fundo: PESSEGO },
    ],
  },
  {
    n: 4,
    tipo: 'sombra',
    texto: 'Quem será?',
    opcoes: [
      { id: 'camelo', rotulo: 'Camelo', arte: animais.camelo, fundo: PESSEGO },
      { id: 'leao', rotulo: 'Leão', arte: dn.leao('feliz'), fundo: LIMAO },
      { id: 'ovelha', rotulo: 'Ovelha', arte: op.ovelha, fundo: MENTA, certa: true },
    ],
  },
  {
    n: 5,
    tipo: 'falta',
    texto: 'O que está faltando?',
    opcoes: [
      { id: 'guarda-chuva', rotulo: 'Guarda-chuva', arte: objetos.guardaChuva, fundo: CEU },
      { id: 'cajado', rotulo: 'Cajado', arte: objetos.cajado, fundo: LIMAO, certa: true },
      { id: 'coroa', rotulo: 'Coroa', arte: rs.coroa, fundo: LILAS },
    ],
  },
  { n: 6, tipo: 'comparar', texto: 'Qual é a grandona?' },
  { n: 7, tipo: 'diferente', texto: 'Quem é o engraçadinho?' },
  {
    n: 8,
    tipo: 'sequencia',
    texto: 'Quem vem agora?',
    opcoes: [
      { id: 'ovelha', rotulo: 'Ovelha', arte: op.ovelha, fundo: MENTA },
      { id: 'flor', rotulo: 'Flor', arte: flor, fundo: ROSA, certa: true },
      { id: 'pedra', rotulo: 'Pedra', arte: dn.pedra, fundo: CEU },
    ],
  },
  {
    n: 9,
    tipo: 'intruso',
    texto: 'O que não tem no pasto?',
    opcoes: [
      { id: 'grama', rotulo: 'Grama', arte: op.grama, fundo: LIMAO },
      { id: 'flor', rotulo: 'Flor', arte: flor, fundo: ROSA },
      { id: 'foguete', rotulo: 'Foguete', arte: objetos.foguete, fundo: LILAS, certa: true },
    ],
  },
  {
    n: 10,
    tipo: 'memoria',
    texto: 'Onde está a ovelhinha?',
    // ordem inicial; três trocas (de lugar): [0,1] leva a ovelhinha para o meio; [1,2] a leva para a direita; [0,1] troca os outros dois ("número três")
    opcoes: [
      { id: 'ovelha', rotulo: 'Ovelhinha', arte: op.ovelha, fundo: MENTA, certa: true },
      { id: 'flor', rotulo: 'Flor', arte: flor, fundo: ROSA },
      { id: 'cajado', rotulo: 'Cajado', arte: objetos.cajado, fundo: LIMAO },
    ],
    trocas: [
      [0, 1],
      [1, 2],
      [0, 1],
    ],
  },
  {
    n: 13,
    tipo: 'sumiu',
    texto: 'Quem foi dar uma voltinha?',
    mostrar: { modo: 'sumiu', falta: 0, itens: tres([[op.ovelha, 720], [animais.pomba, 1070], [animais.camelo, 1420]]) },
    lembrete: { antes: [VAZIO, { arte: animais.pomba }, { arte: animais.camelo }], depois: [op.ovelha, animais.pomba, animais.camelo].map((arte) => ({ arte })) },
    primeiraOpcao: 2,
    opcoes: [
      { id: 'ovelha', rotulo: 'Ovelha', arte: op.ovelha, fundo: MENTA, certa: true },
      { id: 'passarinho', rotulo: 'Passarinho', arte: animais.pomba, fundo: CEU },
      { id: 'camelo', rotulo: 'Camelo', arte: animais.camelo, fundo: PESSEGO },
    ],
  },
  {
    n: 14,
    tipo: 'aparece',
    texto: 'Quem chegou primeiro?',
    // na ordem em que chegam: o passarinho (direita), a ovelha (esquerda) e o pastor (meio)
    mostrar: { modo: 'aparece', itens: tres([[animais.pomba, 1420], [op.ovelha, 720], [op.pastor, 1070]], 0.38) },
    lembrete: { antes: [VAZIO, VAZIO, VAZIO], depois: [animais.pomba, op.ovelha, op.pastor].map((arte, i) => ({ arte, num: i + 1 })) },
    opcoes: [
      { id: 'ovelha', rotulo: 'Ovelha', arte: op.ovelha, fundo: MENTA },
      { id: 'pastor', rotulo: 'Pastor', arte: op.pastor, fundo: LIMAO },
      { id: 'passarinho', rotulo: 'Passarinho', arte: animais.pomba, fundo: CEU, certa: true },
    ],
  },
];
