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
  if (ev.tipo === 'nota') return sfx.bell(ev.freq, 0.9, { decay: 4.5, gain: 0.5 }); // sininho afinado (a contagem das pedrinhas)
  return sfx[ev.tipo]();
}

/**
 * Mixa uma lista de cenas em sequência. Cada item é { cena, t0 }, com
 * `cena.sons`, `cena.falas` e `cena.dur`. `narrDir` é a pasta da narração.
 * Devolve a mixagem em mono e, separada, só a voz (usada para abaixar a
 * música enquanto a Tuti fala).
 */
function mixar(itens, narrDir, total) {
  const n = Math.ceil(total * sfx.RATE);
  const voz = new Float32Array(n);
  const efeitos = new Float32Array(n);
  for (const { cena, t0 } of itens) {
    for (const ev of cena.sons || []) A.mixInto(efeitos, efeito(ev), sfx.RATE, t0 + ev.t, ev.ganho === undefined ? 1 : ev.ganho);
    for (const fl of cena.falas || []) A.mixInto(voz, narr48(path.join(narrDir, `${fl.id}.wav`)), sfx.RATE, t0 + fl.t, 1);
  }
  const mono = new Float32Array(n);
  for (let i = 0; i < n; i++) mono[i] = voz[i] + efeitos[i];
  return { mono, voz };
}

/**
 * Junta a mixagem em mono com a trilha em estéreo. A trilha fica bem abaixo
 * da voz e desce mais um pouco (`duck`, em dB) sempre que a Tuti fala.
 * `nivel` é o volume da trilha em dB em relação ao arquivo original dela.
 * Sem `trilha`, devolve só a voz e os efeitos em estéreo.
 */
// Voz e efeitos vão no centro; com este fator o volume em estéreo fica igual ao do mono.
const CENTRO = Math.SQRT1_2;

function comTrilha(mono, voz, trilha, { nivel = -16.7, duck = -4 } = {}) {
  const n = mono.length;
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  const base = Math.pow(10, nivel / 20);
  const baixo = Math.pow(10, duck / 20);
  const win = Math.round(0.02 * sfx.RATE);
  const sobe = Math.exp(-1 / (0.12 * sfx.RATE)); // a trilha desce rápido quando a voz entra
  const desce = Math.exp(-1 / (0.6 * sfx.RATE)); // e volta devagar quando a voz para
  let pres = 0;
  let alvo = 0;
  for (let i = 0; i < n; i++) {
    if (i % win === 0) {
      let e = 0;
      const end = Math.min(n, i + win);
      for (let j = i; j < end; j++) e += voz[j] * voz[j];
      alvo = Math.sqrt(e / win) > 0.012 ? 1 : 0;
    }
    const k = alvo > pres ? sobe : desce;
    pres = alvo + (pres - alvo) * k;
    const g = base * (1 + (baixo - 1) * pres);
    const centro = mono[i] * CENTRO;
    L[i] = centro + (trilha && i < trilha.L.length ? trilha.L[i] * g : 0);
    R[i] = centro + (trilha && i < trilha.R.length ? trilha.R[i] * g : 0);
  }
  return { L, R };
}

/** Ganho, em dB, para o áudio chegar ao volume-alvo (padrão do YouTube: perto de -16 LUFS). */
function ganhoParaAlvo(wav, alvo = -16) {
  const r = require('child_process').spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', wav, '-af', 'ebur128', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = [...r.stderr.matchAll(/I:\s+(-?[0-9.]+) LUFS/g)].pop();
  if (!m) throw new Error('Não consegui medir o volume do áudio.');
  return { lufs: parseFloat(m[1]), ganho: alvo - parseFloat(m[1]) };
}

module.exports = { mixar, comTrilha, ganhoParaAlvo, narr48 };
