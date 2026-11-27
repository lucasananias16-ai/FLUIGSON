'use strict';
/**
 * Vídeo 23 — os Reis Magos e a Estrela, no padrão novo (19/11/2026) e com o
 * roteiro variado (pedido de 27/11): abre com a sombra do camelo, a ordem dos
 * jogos é outra e entram o "o que sumiu?", o "quem chegou primeiro?" e o
 * "qual é o menor?". O tom é leve, de passeio.
 *
 * Uso: node src/v23/video.js [--refazer]
 *
 * O nome de cada cena é o número mostrado na tela (d1 a d12); o jogo de cada
 * uma está em `roteiro.ordem`. As cenas dNa são o "olhe bem" que vem antes da
 * pergunta dos jogos de memória.
 */
const path = require('path');
const cenas = require('./cenas');
const { criarEncerramento } = require('./cenasPontas');
const { montar } = require('../anim/montar');
const { temposPorPausas } = require('../anim/fala');
const { comProgresso, criarRegancho } = require('../anim/padraoNovo');
const noel = require('../art/reis');
const roteiroTexto = require('./roteiro');

const ROOT = path.resolve(__dirname, '..', '..');
const NARR = path.join(ROOT, 'v23-natal-reis-magos', 'narracao');
const BRANCO = '#fff';
const regancho = (nome, id, palavra, n, opts = {}) => (t0) =>
  criarRegancho(Object.assign({ nome, narrDir: NARR, id, palavra, n, fundo: noel.fundoNeve, tGlobal0: t0, tutiOpts: { gorro: true } }, opts));
const comBarra = (n, criar) => (t0) => comProgresso(criar(t0), n);

/** As cenas em ordem; `criar` recebe o instante em que a cena começa no vídeo. */
function roteiro() {
  return [
    { nome: 'd1', criar: comBarra(1, (t0) => cenas.criarSombra({ tGlobal0: t0, inicioRapido: true, contagem: 5, primeiraOpcao: 2 })) },
    { nome: 'gancho', criar: regancho('gancho', 'v23_v2_gancho', 'VEM COMIGO?', 1) },
    { nome: 'd2', criar: comBarra(2, (t0) => cenas.criarEscolher(3, { tGlobal0: t0, primeiraOpcao: 2 })) },
    { nome: 'd3', criar: comBarra(3, (t0) => cenas.criarComparar({ tGlobal0: t0, saida: BRANCO })) },
    { nome: 'd4', criar: comBarra(4, (t0) => cenas.criarAchar({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO })) },
    { nome: 'surpresa', criar: regancho('surpresa', 'v23_v2_surpresa', 'VAMOS PASSEAR!', 5, { entrada: BRANCO }) },
    { nome: 'd5a', criar: comBarra(5, (t0) => cenas.criarMostrar(13, { tGlobal0: t0 })) },
    { nome: 'd5', criar: comBarra(5, (t0) => cenas.criarLembrete(13, { tGlobal0: t0, saida: BRANCO })) },
    { nome: 'd6', criar: comBarra(6, (t0) => cenas.criarContar({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO })) },
    { nome: 'd7', criar: comBarra(7, (t0) => cenas.criarEscolher(9, { tGlobal0: t0, entrada: BRANCO, primeiraOpcao: 2 })) },
    { nome: 'metade', criar: regancho('metade', 'v23_v2_metade', 'QUE LEGAL!', 8) },
    { nome: 'd8a', criar: comBarra(8, (t0) => cenas.criarMostrar(14, { tGlobal0: t0 })) },
    { nome: 'd8', criar: comBarra(8, (t0) => cenas.criarLembrete(14, { tGlobal0: t0 })) },
    { nome: 'd9', criar: comBarra(9, (t0) => cenas.criarDiferente({ tGlobal0: t0 })) },
    { nome: 'd10', criar: comBarra(10, (t0) => cenas.criarSequencia({ tGlobal0: t0 })) },
    { nome: 'd11', criar: comBarra(11, (t0) => cenas.criarFalta({ tGlobal0: t0, primeiraOpcao: 2 })) },
    { nome: 'ultimo', criar: regancho('ultimo', 'v23_v2_ultimo', 'SURPRESA!', 12) },
    { nome: 'd12', criar: comBarra(12, (t0) => cenas.criarMemoria({ tGlobal0: t0, saida: BRANCO })) },
    { nome: 'encerramento', criar: (t0) => criarEncerramento({ tGlobal0: t0, entrada: BRANCO, saida: BRANCO, v2: true }) },
  ];
}

module.exports = { roteiro };

if (require.main === module) {
  montar({
    nome: 'v23_os_reis_magos_e_a_estrela',
    pasta: 'v23-natal-reis-magos',
    roteiro: roteiro(),
    trechos: 'trechos-v23',
    legendas: { tempos: (arquivo, frases) => temposPorPausas(arquivo, frases, roteiroTexto.cortes[path.basename(arquivo, '.wav')]) },
    args: process.argv.slice(2),
    limite: 0.84,
  }).catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  });
}
