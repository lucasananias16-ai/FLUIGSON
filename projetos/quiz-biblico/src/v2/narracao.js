'use strict';
/**
 * Vídeo 2 — gera a narração com a mesma voz do Vídeo 1.
 *
 * Uso: GOOGLE_APPLICATION_CREDENTIALS=<chave.json> node src/v2/narracao.js [ids...] [--refazer] [--nova-tomada]
 *
 * O funcionamento está em src/narrar.js. Falas cortadas em partes:
 *  - perguntas com três opções: pergunta, opção 1, opção 2, opção 3;
 *  - desafio 4: pergunta e duas opções;
 *  - contagem do desafio 2: um número por parte, com tempo para contar junto;
 *  - pergunta do desafio 7: aviso da troca, pergunta e os três números.
 */
const path = require('path');
const { narrar } = require('../narrar');
const roteiro = require('./roteiro');

const ROOT = path.resolve(__dirname, '..', '..');
const TRES_OPCOES = { partes: 4, pausas: [0.9, 1.0, 1.0] };
const PARTES = {
  v2_p2_contagem: { partes: 5, pausas: [0.85, 0.85, 0.85, 0.85], minParte: 0.15 },
  v2_p3_pergunta: TRES_OPCOES,
  v2_p4_pergunta: { partes: 3, pausas: [0.9, 1.0] },
  v2_p5_pergunta: TRES_OPCOES,
  v2_p6_pergunta: TRES_OPCOES,
  v2_p7_pergunta: { partes: 5, pausas: [0.5, 0.8, 0.9, 0.9] },
  v2_p8_pergunta: TRES_OPCOES,
};

function falas() {
  const lista = [{ id: 'v2_abertura', texto: roteiro.abertura, tipo: 'fala' }];
  for (const n of Object.keys(roteiro.desafios)) {
    const d = roteiro.desafios[n];
    if (d.mostrar) lista.push({ id: `v2_p${n}_mostrar`, texto: d.mostrar, tipo: 'fala' });
    lista.push({ id: `v2_p${n}_pergunta`, texto: d.pergunta, tipo: 'pergunta', vozTexto: d.perguntaVoz });
    if (d.contagem) lista.push({ id: `v2_p${n}_contagem`, texto: d.contagem, tipo: 'fala' });
    lista.push({ id: `v2_p${n}_resposta`, texto: d.resposta, tipo: 'fala', vozTexto: d.respostaVoz });
  }
  lista.push({ id: 'v2_encerramento', texto: roteiro.encerramento, tipo: 'fala' });
  return lista.map((f) => Object.assign(f, PARTES[f.id] || {}));
}

module.exports = { falas };

if (require.main === module) {
  narrar({
    falas: falas(),
    voz: roteiro.voz,
    outDir: path.join(ROOT, 'v2-davi-e-golias', 'narracao'),
    takesDir: path.join(ROOT, '_rascunho', 'narracao'),
    args: process.argv.slice(2),
  }).catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  });
}
