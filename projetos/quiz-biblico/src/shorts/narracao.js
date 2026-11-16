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
const FALAS = [{ id: 'short_fim', texto: 'Você acertou? Tem muito mais desafios no quiz completo!', tipo: 'fala' }];
const VOZ = { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' };
const NARR = path.join(ROOT, 'shorts', 'narracao');

module.exports = { FALAS, NARR };

if (require.main === module) {
  narrar({ falas: FALAS, voz: VOZ, outDir: NARR, takesDir: path.join(ROOT, '_rascunho', 'narracao'), args: process.argv.slice(2) }).catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  });
}
