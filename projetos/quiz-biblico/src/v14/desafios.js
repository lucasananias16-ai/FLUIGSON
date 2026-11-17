'use strict';
/**
 * Vídeo 14 — Jogo da Memória da Tuti: os doze desafios, de cinco tipos:
 *  - memoria: as cartas viram e trocam de lugar (`trocas`);
 *  - sumiu: quatro desenhos aparecem, somem numa nuvem e voltam com um a menos;
 *  - cor: um desenho aparece e some; qual era a cor?
 *  - quantos: alguns desenhos aparecem e somem; quantos eram?
 *  - aparece: três desenhos aparecem um de cada vez; quem veio primeiro (ou por último)?
 * Nos quatro últimos, `mostrar` diz o que aparece antes da pergunta (cena dNa) e
 * `lembrete` o que fica na faixa de cima durante a pergunta (antes e depois da resposta).
 * As opções estão na ordem da tela (esquerda, meio, direita).
 */
const jogos = require('../art/jogos');
const of = require('../art/oficina');
const animais = require('../art/animais');
const objetos = require('../art/objetos');
const cores = require('../art/cores');
const mar = require('../art/mar');
const ceu = require('../art/ceuNatal');

const MENTA = '#CFF1E0';
const ROSA = '#FFD9E4';
const CEU = '#CFE6FF';
const LIMAO = '#FFF1B8';
const LILAS = '#E4DAFB';
const PESSEGO = '#FFE0C7';
const BRANCO = '#FFFFFF';

const AZUL = '#4DA3FF';
const AMARELO = '#FFD23F';
const VERMELHO = '#E25A52';
const balao = (c) => () => jogos.balao(c);
const peixe = (c) => () => mar.peixinho(c);
const fileira = (artes, y, s, x0 = 640, passo = 280) => artes.map((arte, i) => ({ arte, x: x0 + i * passo, y, s }));
const VAZIO = { vazio: true };

module.exports = [
  {
    n: 1,
    tipo: 'memoria',
    texto: 'Onde está o ursinho?',
    opcoes: [
      { id: 'ursinho', rotulo: 'Ursinho', arte: of.ursinho, fundo: PESSEGO, certa: true },
      { id: 'bola', rotulo: 'Bola', arte: of.bola, fundo: MENTA },
      { id: 'piao', rotulo: 'Pião', arte: of.piao, fundo: LIMAO },
    ],
    trocas: [[0, 2]], // o ursinho vai para a direita ("número três")
  },
  {
    n: 2,
    tipo: 'sumiu',
    texto: 'O que sumiu?',
    mostrar: { modo: 'sumiu', falta: 1, itens: fileira([cores.maca, cores.banana, cores.uvas, cores.laranja], 580, 0.34) },
    lembrete: { antes: [{ arte: cores.maca }, VAZIO, { arte: cores.uvas }, { arte: cores.laranja }], depois: [cores.maca, cores.banana, cores.uvas, cores.laranja].map((arte) => ({ arte })) },
    primeiraOpcao: 2,
    opcoes: [
      { id: 'morango', rotulo: 'Morango', arte: cores.morango, fundo: ROSA },
      { id: 'banana', rotulo: 'Banana', arte: cores.banana, fundo: LIMAO, certa: true },
      { id: 'uva', rotulo: 'Uva', arte: cores.uvas, fundo: LILAS },
    ],
  },
  {
    n: 3,
    tipo: 'cor',
    texto: 'De que cor era?',
    mostrar: { modo: 'some', itens: [{ arte: balao(VERMELHO), x: 1060, y: 560, s: 0.46 }] },
    lembrete: { antes: [{ cinza: balao(VERMELHO) }], depois: [{ arte: balao(VERMELHO) }] },
    opcoes: [
      { id: 'azul', rotulo: 'Balão azul', arte: balao(AZUL), fundo: BRANCO },
      { id: 'amarelo', rotulo: 'Balão amarelo', arte: balao(AMARELO), fundo: BRANCO },
      { id: 'vermelho', rotulo: 'Balão vermelho', arte: balao(VERMELHO), fundo: BRANCO, certa: true },
    ],
  },
  {
    n: 4,
    tipo: 'quantos',
    texto: 'Quantas estrelas?',
    mostrar: { modo: 'some', itens: fileira([objetos.estrela, objetos.estrela, objetos.estrela], 580, 0.32, 780, 300) },
    lembrete: { antes: [VAZIO], depois: [1, 2, 3].map(() => ({ arte: objetos.estrela })) },
    opcoes: [
      { id: '2', rotulo: 'Dois', arte: jogos.numeroCard('2', '#5DBB7A'), fundo: BRANCO },
      { id: '3', rotulo: 'Três', arte: jogos.numeroCard('3', AZUL), fundo: BRANCO, certa: true },
      { id: '4', rotulo: 'Quatro', arte: jogos.numeroCard('4', '#FF8A3A'), fundo: BRANCO },
    ],
  },
  {
    n: 5,
    tipo: 'memoria',
    texto: 'Onde está a girafa?',
    opcoes: [
      { id: 'leao', rotulo: 'Leão', arte: animais.leao, fundo: LIMAO },
      { id: 'girafa', rotulo: 'Girafa', arte: animais.girafa, fundo: MENTA, certa: true },
      { id: 'elefante', rotulo: 'Elefante', arte: animais.elefante, fundo: CEU },
    ],
    trocas: [[1, 2], [0, 2]], // a girafa vai para a direita e depois para a esquerda ("número um")
  },
  {
    n: 6,
    tipo: 'aparece',
    texto: 'Quem veio primeiro?',
    // na ordem em que aparecem: a coruja (direita), o pinguim (esquerda) e a pomba (meio)
    mostrar: { modo: 'aparece', itens: [{ arte: animais.coruja, x: 1420, y: 590, s: 0.36 }, { arte: animais.pinguim, x: 720, y: 590, s: 0.36 }, { arte: animais.pomba, x: 1070, y: 590, s: 0.36 }] },
    lembrete: { antes: [VAZIO, VAZIO, VAZIO], depois: [animais.coruja, animais.pinguim, animais.pomba].map((arte, i) => ({ arte, num: i + 1 })) },
    opcoes: [
      { id: 'pinguim', rotulo: 'Pinguim', arte: animais.pinguim, fundo: CEU },
      { id: 'pomba', rotulo: 'Pomba', arte: animais.pomba, fundo: LILAS },
      { id: 'coruja', rotulo: 'Coruja', arte: animais.coruja, fundo: PESSEGO, certa: true },
    ],
  },
  {
    n: 7,
    tipo: 'sumiu',
    texto: 'O que sumiu?',
    mostrar: { modo: 'sumiu', falta: 2, itens: fileira([of.ursinho, of.bola, of.trenzinho, of.boneca], 580, 0.32) },
    lembrete: { antes: [{ arte: of.ursinho }, { arte: of.bola }, VAZIO, { arte: of.boneca }], depois: [of.ursinho, of.bola, of.trenzinho, of.boneca].map((arte) => ({ arte })) },
    primeiraOpcao: 2,
    opcoes: [
      { id: 'trenzinho', rotulo: 'Trenzinho', arte: of.trenzinho, fundo: LIMAO, certa: true },
      { id: 'carrinho', rotulo: 'Carrinho', arte: of.carrinho, fundo: MENTA },
      { id: 'boneca', rotulo: 'Boneca', arte: of.boneca, fundo: ROSA },
    ],
  },
  {
    n: 8,
    tipo: 'cor',
    texto: 'De que cor era?',
    mostrar: { modo: 'some', itens: [{ arte: peixe(AMARELO), x: 1060, y: 580, s: 0.44 }] },
    lembrete: { antes: [{ cinza: peixe(AMARELO) }], depois: [{ arte: peixe(AMARELO) }] },
    opcoes: [
      { id: 'azul', rotulo: 'Peixinho azul', arte: peixe(AZUL), fundo: BRANCO },
      { id: 'amarelo', rotulo: 'Peixinho amarelo', arte: peixe(AMARELO), fundo: BRANCO, certa: true },
      { id: 'vermelho', rotulo: 'Peixinho vermelho', arte: peixe(VERMELHO), fundo: BRANCO },
    ],
  },
  {
    n: 9,
    tipo: 'quantos',
    texto: 'Quantas bolas?',
    mostrar: { modo: 'some', itens: [640, 830, 1020, 1210, 1400].map((x, i) => ({ arte: of.bola, x, y: i % 2 ? 650 : 530, s: 0.24 })) },
    lembrete: { antes: [VAZIO], depois: [1, 2, 3, 4, 5].map(() => ({ arte: of.bola })) },
    opcoes: [
      { id: '5', rotulo: 'Cinco', arte: jogos.numeroCard('5', '#E25A52'), fundo: BRANCO, certa: true },
      { id: '6', rotulo: 'Seis', arte: jogos.numeroCard('6', '#9B7EDE'), fundo: BRANCO },
      { id: '4', rotulo: 'Quatro', arte: jogos.numeroCard('4', '#FF8A3A'), fundo: BRANCO },
    ],
  },
  {
    n: 10,
    tipo: 'memoria',
    texto: 'Onde está a lua?',
    opcoes: [
      { id: 'estrela', rotulo: 'Estrela', arte: objetos.estrela, fundo: LILAS },
      { id: 'lua', rotulo: 'Lua', arte: objetos.lua, fundo: '#34498F', certa: true },
      { id: 'sol', rotulo: 'Sol', arte: ceu.solCard, fundo: CEU },
    ],
    trocas: [[0, 1], [1, 2], [0, 1]], // três trocas; a lua termina no meio ("número dois")
  },
  {
    n: 11,
    tipo: 'aparece',
    texto: 'Quem veio por último?',
    // na ordem em que aparecem: o morango (direita), a laranja (esquerda) e a maçã (meio)
    mostrar: { modo: 'aparece', itens: [{ arte: cores.morango, x: 1420, y: 590, s: 0.34 }, { arte: cores.laranja, x: 720, y: 590, s: 0.34 }, { arte: cores.maca, x: 1070, y: 590, s: 0.34 }] },
    lembrete: { antes: [VAZIO, VAZIO, VAZIO], depois: [cores.morango, cores.laranja, cores.maca].map((arte, i) => ({ arte, num: i + 1 })) },
    opcoes: [
      { id: 'maca', rotulo: 'Maçã', arte: cores.maca, fundo: MENTA, certa: true },
      { id: 'laranja', rotulo: 'Laranja', arte: cores.laranja, fundo: LIMAO },
      { id: 'morango', rotulo: 'Morango', arte: cores.morango, fundo: ROSA },
    ],
  },
  {
    n: 12,
    tipo: 'memoria',
    texto: 'Onde está o foguete?',
    opcoes: [
      { id: 'presente', rotulo: 'Presente', arte: objetos.presente, fundo: MENTA },
      { id: 'foguete', rotulo: 'Foguete', arte: objetos.foguete, fundo: CEU, certa: true },
      { id: 'castelo', rotulo: 'Castelo', arte: objetos.castelo, fundo: ROSA },
    ],
    trocas: [[1, 0], [1, 2]], // o foguete vai para a esquerda e fica lá ("número um")
  },
];
