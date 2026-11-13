'use strict';
/**
 * Trilha de áudio de uma cena: junta as falas da narração e os efeitos
 * sonoros nos instantes certos e grava um WAV de 48 kHz.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const A = require('../audio');
const sfx = require('./sfx');

const ROOT = path.resolve(__dirname, '..', '..');
const CACHE = path.join(ROOT, '_rascunho', 'narr48');

/** A narração é gravada em 24 kHz; aqui ela sobe para 48 kHz, a taxa do vídeo. */
function narr48(file) {
  fs.mkdirSync(CACHE, { recursive: true });
  const out = path.join(CACHE, path.basename(file));
  if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(file).mtimeMs) {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', file, '-ar', String(sfx.RATE), '-ac', '1', '-c:a', 'pcm_s16le', out]);
  }
  return A.readWav(out).data;
}

function efeito(ev) {
  if (ev.tipo === 'tique') return sfx.tique(ev.agudo, 1);
  if (ev.tipo === 'virada') return sfx.virada(ev.semente || 1);
  return sfx[ev.tipo]();
}

/**
 * Mixa uma lista de cenas em sequência. Cada item é { cena, t0 }, com
 * `cena.sons`, `cena.falas` e `cena.dur`. `narrDir` é a pasta da narração.
 */
function mixar(itens, narrDir, total) {
  const out = new Float32Array(Math.ceil(total * sfx.RATE));
  for (const { cena, t0 } of itens) {
    for (const ev of cena.sons || []) A.mixInto(out, efeito(ev), sfx.RATE, t0 + ev.t, ev.ganho === undefined ? 1 : ev.ganho);
    for (const fl of cena.falas || []) A.mixInto(out, narr48(path.join(narrDir, `${fl.id}.wav`)), sfx.RATE, t0 + fl.t, 1);
  }
  return out;
}

/** Ganho, em dB, para o áudio chegar ao volume-alvo (padrão do YouTube: perto de -16 LUFS). */
function ganhoParaAlvo(wav, alvo = -16) {
  const r = require('child_process').spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', wav, '-af', 'ebur128', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = [...r.stderr.matchAll(/I:\s+(-?[0-9.]+) LUFS/g)].pop();
  if (!m) throw new Error('Não consegui medir o volume do áudio.');
  return { lufs: parseFloat(m[1]), ganho: alvo - parseFloat(m[1]) };
}

module.exports = { mixar, ganhoParaAlvo, narr48 };
