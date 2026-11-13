'use strict';
/**
 * Vídeo 1 — renderiza uma pergunta sozinha, com voz e efeitos, para validar
 * o visual, o ritmo e a virada dos cards.
 *
 * Uso: node src/v1/teste-pergunta.js <número da pergunta>
 */
const path = require('path');
const A = require('../audio');
const { criarPergunta } = require('./cenaPergunta');
const { renderVideo } = require('../anim/render');
const { mixar, ganhoParaAlvo } = require('../anim/mix');
const Z = require('../anim/ease');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, '_rascunho', 'video');

(async () => {
  const num = Number(process.argv[2] || 1);
  const cena = criarPergunta(num);
  // o teste abre e fecha clareando a tela; no vídeo inteiro as cenas emendam direto
  const frame = cena.frame;
  cena.frame = (t) => {
    const fade = 1 - Z.prog(t, 0, 0.35) + Z.prog(t, cena.dur - 0.3, 0.3);
    return frame(t).concat([{ id: 'fade', style: `opacity:${Math.round(Z.clamp(fade) * 1000) / 1000}` }]);
  };
  const wav = path.join(OUT, `v1_p${num}_teste.wav`);
  require('fs').mkdirSync(OUT, { recursive: true });
  A.writeWav(wav, mixar([{ cena, t0: 0 }], path.join(ROOT, 'v1-arca-de-noe', 'narracao'), cena.dur), 48000);
  const g = ganhoParaAlvo(wav);
  const out = path.join(OUT, `v1_p${num}_teste.mp4`);
  const r = await renderVideo(cena, {
    out,
    name: `p${num}`,
    audio: wav,
    audioFilter: `volume=${g.ganho.toFixed(2)}dB,alimiter=limit=0.89:level=false`,
  });
  console.log(`${out}\n${cena.dur.toFixed(1)} s, ${r.frames} quadros em ${r.seconds.toFixed(0)} s; volume medido ${g.lufs} LUFS, ganho ${g.ganho.toFixed(1)} dB`);
})().catch((e) => {
  console.error('ERRO:', e.message);
  process.exit(1);
});
