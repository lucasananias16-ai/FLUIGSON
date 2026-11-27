'use strict';
/**
 * Vídeo 24 — gera a narração com a mesma voz dos outros vídeos.
 *
 * Uso: GOOGLE_APPLICATION_CREDENTIALS=<chave.json> node src/v24/narracao.js [ids...] [--refazer] [--nova-tomada]
 *
 * O funcionamento está em src/narrar.js. Falas cortadas em partes:
 *  - perguntas com três opções: pergunta, opção 1, opção 2, opção 3;
 *  - desafio 6: aviso, pergunta e três opções;
 *  - contagem do desafio 2: um número por parte, com tempo para contar junto;
 *  - pergunta do desafio 8: aviso da troca, pergunta e os três números.
 */
const path = require('path');
const { narrar } = require('../narrar');
const roteiro = require('./roteiro');

const ROOT = path.resolve(__dirname, '..', '..');
const TRES_OPCOES = { partes: 4, pausas: [0.9, 1.0, 1.0] };
const DUAS_FRASES = { partes: 5, pausas: [0.5, 0.9, 1.0, 1.0] }; // duas frases e as três opções
const PARTES = {
  v24_p13_pergunta: DUAS_FRASES,
  v24_p14_pergunta: TRES_OPCOES,
  v24_p2_contagem: { partes: 5, pausas: [0.85, 0.85, 0.85, 0.85], minParte: 0.15 },
  v24_p3_pergunta: TRES_OPCOES,
  v24_p4_pergunta: DUAS_FRASES,
  v24_p5_pergunta: DUAS_FRASES,
  v24_p6_pergunta: { partes: 3, pausas: [0.9, 1.0] },
  v24_p8_pergunta: { partes: 5, pausas: [0.5, 0.9, 1.0, 1.0] }, // o aviso, a pergunta e as três opções
  v24_p9_pergunta: TRES_OPCOES,
  v24_p10_pergunta: { partes: 5, pausas: [0.5, 0.8, 0.9, 0.9] },
};

function falas() {
  const lista = [{ id: 'v24_abertura', texto: roteiro.abertura, tipo: 'fala' }];
  for (const n of Object.keys(roteiro.desafios)) {
    const d = roteiro.desafios[n];
    if (d.mostrar) lista.push({ id: `v24_p${n}_mostrar`, texto: d.mostrar, tipo: 'fala' });
    lista.push({ id: `v24_p${n}_pergunta`, texto: d.pergunta, tipo: 'pergunta', vozTexto: d.perguntaVoz });
    if (d.contagem) lista.push({ id: `v24_p${n}_contagem`, texto: d.contagem, tipo: 'fala' });
    lista.push({ id: `v24_p${n}_resposta`, texto: d.resposta, tipo: 'fala', vozTexto: d.respostaVoz });
  }
  lista.push({ id: 'v24_encerramento', texto: roteiro.encerramento, tipo: 'fala' });
  // versão 2 (padrão novo): falas a mais, gravadas na mesma pasta
  if (roteiro.v2) for (const [k, texto] of Object.entries(roteiro.v2)) lista.push({ id: `v24_v2_${k}`, texto, tipo: 'fala' });
  for (const [k, texto] of Object.entries(roteiro.shorts || {})) lista.push({ id: `v24_s_${k}`, texto, tipo: 'fala' });
  return lista.map((f) => Object.assign(f, PARTES[f.id] || {}));
}

module.exports = { falas };

if (require.main === module) {
  narrar({
    falas: falas(),
    voz: roteiro.voz,
    outDir: path.join(ROOT, 'v24-biblico-ovelha-perdida', 'narracao'),
    takesDir: path.join(ROOT, '_rascunho', 'narracao'),
    args: process.argv.slice(2),
  }).catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  });
}
