'use strict';
/**
 * Vídeo 1 — gera a narração com a voz escolhida.
 *
 * Uso: GOOGLE_APPLICATION_CREDENTIALS=<chave.json> node src/v1/narracao.js [ids...] [--refazer] [--nova-tomada]
 *
 * Sem ids, gera o que ainda não existe. `--refazer` monta de novo os ids
 * pedidos (ou tudo) a partir das tomadas já gravadas em _rascunho/narracao;
 * `--nova-tomada` pede uma gravação nova ao serviço. O funcionamento está em
 * src/narrar.js.
 *
 * Nas perguntas, a frase é cortada em quatro partes: pergunta, opção 1,
 * opção 2 e opção 3.
 */
const path = require('path');
const { narrar } = require('../narrar');
const roteiro = require('./roteiro');

const ROOT = path.resolve(__dirname, '..', '..');
const PAUSAS = [0.9, 1.0, 1.0]; // depois da pergunta e entre uma opção e outra

function falas() {
  const lista = [{ id: 'v1_abertura', texto: roteiro.abertura, tipo: 'fala' }];
  for (const n of Object.keys(roteiro.perguntas)) {
    lista.push({ id: `v1_p${n}_pergunta`, texto: roteiro.perguntas[n].pergunta, tipo: 'pergunta', partes: 4, pausas: PAUSAS });
    lista.push({ id: `v1_p${n}_resposta`, texto: roteiro.perguntas[n].resposta, tipo: 'fala', vozTexto: roteiro.perguntas[n].respostaVoz });
  }
  lista.push({ id: 'v1_encerramento', texto: roteiro.encerramento, tipo: 'fala' });
  return lista;
}

module.exports = { falas };

if (require.main === module) {
  narrar({
    falas: falas(),
    voz: roteiro.voz,
    outDir: path.join(ROOT, 'v1-arca-de-noe', 'narracao'),
    takesDir: path.join(ROOT, '_rascunho', 'narracao'),
    args: process.argv.slice(2),
  }).catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  });
}
