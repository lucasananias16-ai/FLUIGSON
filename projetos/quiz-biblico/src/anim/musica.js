'use strict';
/**
 * Trilha de fundo composta por código: calma, alegre e sem direitos autorais.
 *
 * 96 batidas por minuto, em dó maior. Um dedilhado suave leva a harmonia, com
 * baixo, uma cama de acordes e, em parte das seções, uma melodia de sininho.
 * A melodia só usa notas do acorde de cada compasso, então nunca soa fora.
 *
 * Tudo é determinístico: a mesma duração gera sempre a mesma trilha.
 */
const RATE = 48000;
const TAU = Math.PI * 2;
const BPM = 96;
const BEAT = 60 / BPM;
const BAR = 4 * BEAT;

const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Notas em números MIDI (60 = dó central)
const ACORDES = {
  C: { baixo: 48, quinta: 55, notas: [60, 64, 67] },
  G: { baixo: 43, quinta: 50, notas: [59, 62, 67] },
  Am: { baixo: 45, quinta: 52, notas: [57, 60, 64] },
  F: { baixo: 41, quinta: 48, notas: [57, 60, 65] },
  Dm: { baixo: 50, quinta: 57, notas: [57, 62, 65] },
};
const SECOES = {
  A: ['C', 'G', 'Am', 'F', 'C', 'G', 'F', 'G'],
  A2: ['C', 'G', 'Am', 'F', 'C', 'F', 'G', 'C'],
  B: ['F', 'C', 'G', 'Am', 'F', 'C', 'Dm', 'G'],
};
const FORMA = ['A', 'A2', 'B', 'A2'];
const INTRO = 2; // compassos só de dedilhado antes da primeira seção

// Melodia: por compasso, [batida, nota, duração em batidas]
const MELODIA = {
  A2: [
    [[0, 76, 1], [1, 79, 1], [2, 76, 1], [3, 72, 1]],
    [[0, 74, 2], [2.5, 71, 0.5], [3, 74, 1]],
    [[0, 72, 1], [1, 76, 1], [2, 72, 1], [3, 69, 1]],
    [[0, 72, 2], [2, 69, 2]],
    [[0, 76, 1], [1, 79, 1], [2, 84, 1.5], [3.5, 79, 0.5]],
    [[0, 81, 1], [1, 77, 1], [2, 72, 2]],
    [[0, 74, 1], [1, 79, 1], [2, 74, 1], [3, 71, 1]],
    [[0, 72, 3]],
  ],
  B: [
    [[0, 77, 1.5], [1.5, 81, 0.5], [2, 84, 2]],
    [[0, 79, 1.5], [1.5, 76, 0.5], [2, 72, 2]],
    [[0, 74, 1], [1, 79, 1], [2, 83, 2]],
    [[0, 81, 1.5], [1.5, 76, 0.5], [2, 72, 2]],
    [[0, 77, 1], [1, 72, 1], [2, 69, 2]],
    [[0, 76, 1], [1, 72, 1], [2, 67, 2]],
    [[0, 74, 1], [1, 77, 1], [2, 81, 2]],
    [[0, 79, 2], [2, 74, 2]],
  ],
};

// Timbres: cada parcial tem harmônico (h), volume (a) e queda por segundo (d)
const DEDILHADO = [
  { h: 1, a: 1, d: 3.2 },
  { h: 2, a: 0.42, d: 5 },
  { h: 3, a: 0.22, d: 7.5 },
  { h: 4, a: 0.1, d: 10 },
  { h: 5, a: 0.05, d: 13 },
];
const SININHO = [
  { h: 1, a: 1, d: 2.6 },
  { h: 2, a: 0.18, d: 5 },
  { h: 3, a: 0.06, d: 8 },
  { h: 4.2, a: 0.05, d: 12 },
];
const BAIXO = [
  { h: 1, a: 1, d: 1.4 },
  { h: 2, a: 0.45, d: 2.2 },
  { h: 3, a: 0.18, d: 3.5 },
];
const CAMA = [
  { h: 1, a: 1, d: 0 },
  { h: 2, a: 0.12, d: 0 },
];

/** Soma uma nota nos canais esquerdo e direito. `pan` vai de -1 a 1. */
function nota(L, R, t0, freq, dur, parciais, { amp, pan = 0, ataque = 0.004, soltura = 0.08 }) {
  const i0 = Math.round(t0 * RATE);
  const n = Math.round((dur + soltura) * RATE);
  const gl = amp * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = amp * Math.sin(((pan + 1) * Math.PI) / 4);
  const w = parciais.map((p) => (TAU * freq * p.h) / RATE);
  const dec = parciais.map((p) => Math.exp(-p.d / RATE));
  const lvl = parciais.map((p) => p.a);
  for (let i = 0; i < n; i++) {
    const idx = i0 + i;
    if (idx < 0) continue;
    if (idx >= L.length) break;
    const t = i / RATE;
    let env = t < ataque ? t / ataque : 1;
    if (t > dur) env *= 1 - (t - dur) / soltura;
    let s = 0;
    for (let k = 0; k < w.length; k++) {
      s += lvl[k] * Math.sin(w[k] * i);
      lvl[k] *= dec[k];
    }
    s *= env;
    L[idx] += s * gl;
    R[idx] += s * gr;
  }
}

/** Chocalho bem leve: ruído agudo e curto. */
function chocalho(L, R, t0, amp, rnd) {
  const i0 = Math.round(t0 * RATE);
  const n = Math.round(0.07 * RATE);
  let lo = 0;
  for (let i = 0; i < n; i++) {
    const idx = i0 + i;
    if (idx < 0 || idx >= L.length) continue;
    const x = rnd() * 2 - 1;
    lo += 0.45 * (x - lo); // passa-altas: tira os graves do ruído
    const s = (x - lo) * amp * Math.exp((-55 * i) / RATE) * Math.min(1, i / 60);
    L[idx] += s * 0.62;
    R[idx] += s * 0.78;
  }
}

/** Reverberação suave (estrutura Freeverb), um canal. */
function reverb(input, spread = 0) {
  const k = RATE / 44100;
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((d) => ({ buf: new Float32Array(Math.round((d + spread) * k)), i: 0, store: 0 }));
  const alls = [556, 441, 341, 225].map((d) => ({ buf: new Float32Array(Math.round((d + spread) * k)), i: 0 }));
  const feedback = 0.8;
  const damp = 0.28;
  const out = new Float32Array(input.length);
  for (let n = 0; n < input.length; n++) {
    const x = input[n] * 0.015;
    let y = 0;
    for (const c of combs) {
      const o = c.buf[c.i];
      c.store = o * (1 - damp) + c.store * damp;
      c.buf[c.i] = x + c.store * feedback;
      c.i = c.i + 1 === c.buf.length ? 0 : c.i + 1;
      y += o;
    }
    for (const a of alls) {
      const b = a.buf[a.i];
      const o = b - y;
      a.buf[a.i] = y + b * 0.5;
      a.i = a.i + 1 === a.buf.length ? 0 : a.i + 1;
      y = o;
    }
    out[n] = y;
  }
  return out;
}

const rms = (x) => {
  let e = 0;
  for (let i = 0; i < x.length; i++) e += x[i] * x[i];
  return Math.sqrt(e / Math.max(1, x.length));
};

/**
 * Compõe a trilha com `seconds` de duração. Devolve { L, R } em 48 kHz,
 * com pico em torno de -3 dB e os últimos segundos sumindo aos poucos.
 */
function compor(seconds) {
  const N = Math.ceil(seconds * RATE);
  const L = new Float32Array(N);
  const R = new Float32Array(N);
  const rnd = seeded(2026);
  const jit = () => (rnd() - 0.5) * 0.008; // pequenas diferenças de tempo, como mão humana
  const vel = () => 1 + (rnd() - 0.5) * 0.2; // e de força
  const bars = Math.ceil(seconds / BAR);

  for (let b = 0; b < bars; b++) {
    const t0 = b * BAR;
    const intro = b < INTRO;
    const k = b - INTRO;
    const secIdx = intro ? -1 : Math.floor(k / 8);
    const secao = intro ? null : FORMA[secIdx % FORMA.length];
    const nome = intro ? 'C' : SECOES[secao][k % 8];
    const ac = ACORDES[nome];

    // dedilhado em colcheias: grave, agudo, meio, agudo...
    const ordem = [0, 2, 1, 2, 0, 2, 1, 2];
    for (let e = 0; e < 8; e++) {
      const m = ac.notas[ordem[e]] + (e === 5 && b % 2 === 1 ? 12 : 0);
      const acento = e === 0 ? 1.25 : e === 4 ? 1.1 : 0.9;
      nota(L, R, t0 + e * (BEAT / 2) + jit(), hz(m), 1.1, DEDILHADO, { amp: 0.15 * acento * vel(), pan: -0.25 + (ordem[e] - 1) * 0.12, soltura: 0.15 });
    }

    // cama de acordes, bem ao fundo
    for (const m of ac.notas) {
      nota(L, R, t0, hz(m) * 1.0025, BAR - 0.1, CAMA, { amp: 0.026, pan: -0.7, ataque: 0.5, soltura: 0.7 });
      nota(L, R, t0, hz(m) * 0.9975, BAR - 0.1, CAMA, { amp: 0.026, pan: 0.7, ataque: 0.5, soltura: 0.7 });
    }

    if (intro) continue;

    // baixo nas batidas 1 e 3
    nota(L, R, t0 + jit(), hz(ac.baixo), BEAT * 1.7, BAIXO, { amp: 0.12, ataque: 0.012, soltura: 0.12 });
    nota(L, R, t0 + 2 * BEAT + jit(), hz(k % 2 ? ac.quinta : ac.baixo), BEAT * 1.5, BAIXO, { amp: 0.09, ataque: 0.012, soltura: 0.12 });

    // melodia de sininho nas seções A2 e B
    if (MELODIA[secao]) {
      for (const [beat, m, len] of MELODIA[secao][k % 8]) {
        nota(L, R, t0 + beat * BEAT + jit(), hz(m), len * BEAT + 0.25, SININHO, { amp: 0.085 * vel(), pan: 0.3, soltura: 0.2 });
      }
    }

    // chocalho nos contratempos, a partir da segunda seção e fora das seções A
    if (secIdx >= 1 && secao !== 'A') {
      for (let e = 1; e < 8; e += 2) chocalho(L, R, t0 + e * (BEAT / 2) + jit(), 0.05 * vel(), rnd);
    }
  }

  // reverberação leve
  const mono = new Float32Array(N);
  for (let i = 0; i < N; i++) mono[i] = (L[i] + R[i]) * 0.5;
  const wl = reverb(mono, 0);
  const wr = reverb(mono, 23);
  const wet = (0.22 * rms(mono)) / Math.max(1e-9, rms(wl));
  for (let i = 0; i < N; i++) {
    L[i] += wl[i] * wet;
    R[i] += wr[i] * wet;
  }

  // some aos poucos no final e ajusta o pico
  const fade = Math.min(N, Math.round(3 * RATE));
  let pk = 0;
  for (let i = 0; i < N; i++) {
    if (i >= N - fade) {
      const g = Math.pow((N - i) / fade, 1.5);
      L[i] *= g;
      R[i] *= g;
    }
    pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]));
  }
  const g = 0.7 / pk;
  for (let i = 0; i < N; i++) {
    L[i] *= g;
    R[i] *= g;
  }
  return { L, R };
}

/** Grava um WAV estéreo de 16 bits. */
function writeStereo(file, L, R) {
  const fs = require('fs');
  const b = Buffer.alloc(44 + L.length * 4);
  b.write('RIFF', 0, 'ascii');
  b.writeUInt32LE(36 + L.length * 4, 4);
  b.write('WAVEfmt ', 8, 'ascii');
  b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20);
  b.writeUInt16LE(2, 22);
  b.writeUInt32LE(RATE, 24);
  b.writeUInt32LE(RATE * 4, 28);
  b.writeUInt16LE(4, 32);
  b.writeUInt16LE(16, 34);
  b.write('data', 36, 'ascii');
  b.writeUInt32LE(L.length * 4, 40);
  for (let i = 0; i < L.length; i++) {
    b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
    b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
  }
  fs.writeFileSync(file, b);
  return file;
}

module.exports = { compor, writeStereo, RATE, BPM, BAR };

if (require.main === module) {
  // node src/anim/musica.js <segundos> <saida.wav>
  const seconds = Number(process.argv[2] || 60);
  const out = process.argv[3] || 'trilha.wav';
  const t = Date.now();
  const { L, R } = compor(seconds);
  writeStereo(out, L, R);
  console.log(`${out}: ${seconds} s em ${((Date.now() - t) / 1000).toFixed(1)} s`);
}
