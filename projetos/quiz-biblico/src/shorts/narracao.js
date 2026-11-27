'use strict';
/**
 * Shorts — a fala da Tuti que fecha todo Short, chamando para o quiz completo.
 * É a mesma para todos os Shorts, então é gravada uma vez só.
 *
 * Uso: GOOGLE_APPLICATION_CREDENTIALS=<chave.json> node src/shorts/narracao.js [--refazer]
 */
const path = require('path');
const { narrar } = require('../narrar');

const ROOT = path.resolve(__dirname, '..', '..');
const FALAS = [
  { id: 'short_fim', texto: 'Você acertou? Tem muito mais desafios no quiz completo!', tipo: 'fala' },
  // Shorts nativos "3 em 1" (padrão de Shorts v2, 23/11/2026)
  { id: 's3_e_agora', texto: 'E agora?', tipo: 'fala' },
  { id: 's3_ultima', texto: 'A última é difícil!', tipo: 'fala' },
  { id: 's3_fim', texto: 'Acertou as três? Tenta de novo!', tipo: 'fala' },
  // S1 · qual é o diferente?
  { id: 's1_q1', texto: 'Qual é o diferente? Rápido!', tipo: 'fala' },
  { id: 's1_r1', texto: 'O coelho marrom!', tipo: 'fala' },
  { id: 's1_r2', texto: 'O de chocolate!', tipo: 'fala' },
  { id: 's1_r3', texto: 'O de cachecol vermelho!', tipo: 'fala' },
  { id: 's1b_r1', texto: 'A meia verde!', tipo: 'fala' },
  { id: 's1b_r2', texto: 'O sino!', tipo: 'fala' },
  { id: 's1b_r3', texto: 'O biscoito!', tipo: 'fala' },
  // S2 · de quem é a sombra? (Véspera de Natal)
  { id: 's2_q1', texto: 'De quem é essa sombra? Rápido!', tipo: 'fala' },
  { id: 's2n_r1', texto: 'Da meia!', tipo: 'fala' },
  { id: 's2n_r2', texto: 'Do sino!', tipo: 'fala' },
  { id: 's2n_r3', texto: 'Da vela!', tipo: 'fala' },
  // S5 · conte rápido! (Daniel e Véspera de Natal; as respostas são as mesmas: três, quatro, cinco)
  { id: 's5d_q1', texto: 'Quantos leões? Conte rápido!', tipo: 'fala' },
  { id: 's5d_q2', texto: 'E quantas coroas?', tipo: 'fala' },
  { id: 's5d_q3', texto: 'A última é difícil! Quantas estrelas?', tipo: 'fala' },
  { id: 's5n_q1', texto: 'Quantas meias? Conte rápido!', tipo: 'fala' },
  { id: 's5n_q2', texto: 'E quantas velas?', tipo: 'fala' },
  { id: 's5n_q3', texto: 'A última é difícil! Quantos biscoitos?', tipo: 'fala' },
  // Vídeo 23 · os Reis Magos (tom leve)
  { id: 's4r_q1', texto: 'Quem não combina com o deserto?', tipo: 'fala' },
  { id: 's4r_r1', texto: 'O boneco de neve! Ele vira sorvete!', tipo: 'fala' },
  { id: 's4r_q2', texto: 'E com o céu da noite?', tipo: 'fala' },
  { id: 's4r_r2', texto: 'O sol! Ele só acorda de manhã!', tipo: 'fala' },
  { id: 's4r_q3', texto: 'A última! E com os reis magos?', tipo: 'fala' },
  { id: 's4r_r3', texto: 'A televisão! Ha ha!', tipo: 'fala' },
  { id: 's2r_r1', texto: 'Do camelo!', tipo: 'fala' },
  { id: 's2r_r2', texto: 'Da coroa!', tipo: 'fala' },
  { id: 's2r_r3', texto: 'Do rei!', tipo: 'fala' },
  { id: 's5r_q1', texto: 'Quantos camelos? Conte comigo!', tipo: 'fala' },
  { id: 's5r_q3', texto: 'A última! Quantas estrelas?', tipo: 'fala' },
  // S3 · qual é o maior?
  { id: 's3m_q1', texto: 'Qual é o maior? Rápido!', tipo: 'fala' },
  { id: 's3m_r1', texto: 'O da direita!', tipo: 'fala' },
  { id: 's3m_r2', texto: 'O da esquerda!', tipo: 'fala' },
  { id: 's3m_r3', texto: 'O do meio!', tipo: 'fala' },
  // S4 · o que não combina?
  { id: 's4_q1', texto: 'O que não combina com a praia? Rápido!', tipo: 'fala' },
  { id: 's4_r1', texto: 'O casaco! Na praia não precisa!', tipo: 'fala' },
  { id: 's4_q2', texto: 'E com o Polo Norte?', tipo: 'fala' },
  { id: 's4_r2', texto: 'O camelo! Ele mora no deserto!', tipo: 'fala' },
  { id: 's4_q3', texto: 'A última é difícil! E com a neve?', tipo: 'fala' },
  { id: 's4_r3', texto: 'A boia! No frio ninguém nada!', tipo: 'fala' },
  // S5 · conte rápido!
  { id: 's5_q1', texto: 'Quantas estrelas? Conte rápido!', tipo: 'fala' },
  { id: 's5_r1', texto: 'Três!', tipo: 'fala' },
  { id: 's5_q2', texto: 'E quantos peixinhos?', tipo: 'fala' },
  { id: 's5_r2', texto: 'Quatro!', tipo: 'fala' },
  { id: 's5_q3', texto: 'A última é difícil! Quantas flores?', tipo: 'fala' },
  { id: 's5_r3', texto: 'Cinco!', tipo: 'fala' },
];
const VOZ = { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' };
const NARR = path.join(ROOT, 'shorts', 'narracao');

module.exports = { FALAS, NARR };

if (require.main === module) {
  narrar({ falas: FALAS, voz: VOZ, outDir: NARR, takesDir: path.join(ROOT, '_rascunho', 'narracao'), args: process.argv.slice(2) }).catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  });
}
