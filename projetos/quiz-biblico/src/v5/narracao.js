'use strict';
/**
 * Vídeo 5 — gera a narração, em português e inglês, com a voz da Tuti e a de
 * cada bicho.
 *
 * Uso: GOOGLE_APPLICATION_CREDENTIALS=<chave.json> node src/v5/narracao.js [ids...] [--refazer] [--nova-tomada]
 *
 * O funcionamento está em src/narrar.js. O texto do roteiro traz marcas
 * {en: ...}, {leao: ...}...; aqui elas viram `segmentos` (um por voz) e o texto
 * limpo, sem marcas, que serve de base para as legendas.
 */
const path = require('path');
const { narrar } = require('../narrar');
const roteiro = require('./roteiro');

const ROOT = path.resolve(__dirname, '..', '..');

/** Texto sem as marcas: {en: Hello!} vira Hello! */
const limpo = (texto) => texto.replace(/\{\w+:\s*([^}]*)\}/g, '$1');

/** Divide o texto nos pedaços de cada voz. Um pedaço que não termina em pontuação ganha vírgula, para a voz seguir. */
function segmentar(texto) {
  const segs = [];
  const re = /\{(\w+):\s*([^}]*)\}([!?.,;:…]*)/g; // a pontuação logo depois da marca fica junto do pedaço
  let ultimo = 0;
  let m;
  const poe = (voz, t) => {
    t = t.trim();
    if (t) segs.push({ voz, texto: t });
  };
  while ((m = re.exec(texto))) {
    poe('pt', texto.slice(ultimo, m.index));
    poe(m[1], m[2] + m[3]);
    ultimo = m.index + m[0].length;
  }
  poe('pt', texto.slice(ultimo));
  return segs.map((s, i) => (i < segs.length - 1 && !/[.!?…,]\s*$/.test(s.texto) ? Object.assign(s, { texto: `${s.texto},` }) : s));
}

function falas() {
  return roteiro.falas.map((f) =>
    Object.assign({ tipo: 'fala' }, f, {
      texto: limpo(f.texto),
      segmentos: segmentar(f.texto),
      semAlvo: !!f.bicho,
    })
  );
}

module.exports = { falas, limpo, segmentar };

if (require.main === module) {
  narrar({
    falas: falas(),
    voz: roteiro.voz,
    outDir: path.join(ROOT, 'v5-ingles-animais', 'narracao'),
    takesDir: path.join(ROOT, '_rascunho', 'narracao'),
    args: process.argv.slice(2),
  }).catch((e) => {
    console.error('ERRO:', e.message);
    process.exit(1);
  });
}
