'use strict';
/**
 * Vídeo 1 — renderiza uma pergunta sozinha, com voz, efeitos e trilha, para
 * validar o visual, o ritmo e a virada dos cards.
 *
 * Uso: node src/v1/teste-pergunta.js <número da pergunta> [--so-audio] [--sem-trilha]
 *
 * `--so-audio` reaproveita a imagem já renderizada e refaz só o som.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { criarPergunta } = require('./cenaPergunta');
const { renderVideo } = require('../anim/render');
const { mixar, comTrilha, ganhoParaAlvo } = require('../anim/mix');
const musica = require('../anim/musica');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, '_rascunho', 'video');

(async () => {
  const args = process.argv.slice(2);
  const num = Number(args.find((a) => !a.startsWith('--')) || 1);
  const soAudio = args.includes('--so-audio');
  const semTrilha = args.includes('--sem-trilha');
  // o teste abre e fecha clareando a tela; no vídeo inteiro as perguntas emendam direto
  const cena = criarPergunta(num, { entrada: '#fff', saida: '#fff' });
  fs.mkdirSync(OUT, { recursive: true });

  // som: voz e efeitos em mono, mais a trilha em estéreo
  const { mono, voz } = mixar([{ cena, t0: 0 }], path.join(ROOT, 'v1-arca-de-noe', 'narracao'), cena.dur);
  const wav = path.join(OUT, `v1_p${num}_teste.wav`);
  const st = comTrilha(mono, voz, semTrilha ? null : musica.compor(cena.dur));
  musica.writeStereo(wav, st.L, st.R);
  const g = ganhoParaAlvo(wav, -15.5); // volume final do vídeo
  const audioFilter = `volume=${g.ganho.toFixed(2)}dB,alimiter=limit=0.89:level=false`;

  const semSom = path.join(OUT, `v1_p${num}_imagem.mp4`);
  const out = path.join(OUT, `v1_p${num}_teste${semTrilha ? '' : '_com_trilha'}.mp4`);
  if (!soAudio || !fs.existsSync(semSom)) {
    const r = await renderVideo(cena, { out: semSom, name: `p${num}` });
    console.log(`imagem: ${r.frames} quadros em ${r.seconds.toFixed(0)} s`);
  }
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', semSom, '-i', wav, '-c:v', 'copy', '-af', audioFilter, '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-shortest', '-movflags', '+faststart', out]);
  console.log(`${out}\n${cena.dur.toFixed(1)} s; mixagem em ${g.lufs} LUFS, ganho ${g.ganho.toFixed(1)} dB`);
})().catch((e) => {
  console.error('ERRO:', e.message);
  process.exit(1);
});
