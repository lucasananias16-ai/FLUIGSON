'use strict';
/**
 * Efeitos sonoros sintetizados (48 kHz, mono). Suaves de propósito: a voz da
 * Tuti é sempre o som principal.
 */
const RATE = 48000;
const TAU = Math.PI * 2;

const buf = (seconds) => new Float32Array(Math.round(seconds * RATE));

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

/** Nota de sininho: fundamental e dois harmônicos, com queda exponencial. */
function bell(freq, dur, { decay = 5, gain = 1 } = {}) {
  const out = buf(dur);
  for (let i = 0; i < out.length; i++) {
    const t = i / RATE;
    const env = Math.min(1, t / 0.004) * Math.exp(-decay * t);
    out[i] = gain * env * (Math.sin(TAU * freq * t) + 0.35 * Math.sin(TAU * freq * 2.01 * t) + 0.12 * Math.sin(TAU * freq * 3.02 * t));
  }
  return out;
}

function add(dest, src, at = 0, gain = 1) {
  const off = Math.round(at * RATE);
  for (let i = 0; i < src.length && off + i < dest.length; i++) dest[off + i] += src[i] * gain;
  return dest;
}

/** Ruído filtrado com frequência de corte que varia no tempo (para sopros). */
function swish(dur, cutoff, envelope, seed = 1) {
  const out = buf(dur);
  const rnd = seeded(seed);
  let lo = 0;
  let hi = 0;
  for (let i = 0; i < out.length; i++) {
    const k = i / out.length;
    const a = Math.min(0.95, (TAU * cutoff(k)) / RATE);
    const x = rnd() * 2 - 1;
    lo += a * (x - lo);
    hi += a * 0.5 * (lo - hi);
    out[i] = (lo - hi) * envelope(k) * 2.4;
  }
  return out;
}

/** "Plim" do selo da pergunta. */
function plim() {
  const out = buf(0.5);
  add(out, bell(1318.5, 0.45, { decay: 9, gain: 0.5 }));
  add(out, bell(1975.5, 0.4, { decay: 10, gain: 0.3 }), 0.07);
  return out;
}

/** Card pousando. */
function pouso() {
  const out = buf(0.16);
  for (let i = 0; i < out.length; i++) {
    const t = i / RATE;
    const f = 190 - 90 * Math.min(1, t / 0.1);
    out[i] = 0.7 * Math.exp(-26 * t) * Math.sin(TAU * f * t);
  }
  return out;
}

/** Card virando. */
const virada = (seed = 1) =>
  swish(
    0.22,
    (k) => 900 + 2600 * Math.sin(Math.PI * k),
    (k) => Math.pow(Math.sin(Math.PI * k), 1.4) * 0.5,
    seed
  );

/** Tique e taque do relógio. */
function tique(agudo, forte = 1) {
  const out = buf(0.12);
  const f = agudo ? 1150 : 860;
  for (let i = 0; i < out.length; i++) {
    const t = i / RATE;
    out[i] = 0.5 * forte * Math.exp(-48 * t) * (Math.sin(TAU * f * t) + 0.4 * Math.sin(TAU * f * 2.4 * t));
  }
  return out;
}

/** Fim do tempo. */
const fimDoTempo = () => add(add(buf(0.9), bell(880, 0.9, { decay: 4.5, gain: 0.4 })), bell(1320, 0.8, { decay: 5, gain: 0.25 }), 0.02);

/** Acerto: arpejo que sobe, com brilho no final. */
function acerto() {
  const out = buf(1.6);
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => add(out, bell(f, 1.0, { decay: 4.2, gain: 0.34 }), i * 0.1));
  add(out, bell(1568, 0.9, { decay: 5, gain: 0.16 }), 0.4);
  const rnd = seeded(7);
  for (let i = 0; i < 9; i++) add(out, bell(2100 + rnd() * 1900, 0.25, { decay: 16, gain: 0.07 }), 0.45 + i * 0.07);
  return out;
}

/** Sopro de transição. */
const sopro = () =>
  swish(
    0.6,
    (k) => 500 + 3200 * k,
    (k) => Math.pow(Math.sin(Math.PI * k), 1.6) * 0.45,
    11
  );

module.exports = { RATE, plim, pouso, virada, tique, fimDoTempo, acerto, sopro, bell, add, buf };
