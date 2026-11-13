'use strict';
/**
 * Utilitários de áudio em PCM (mono, ponto flutuante): ler e gravar WAV,
 * achar as pausas de uma fala, juntar trechos e mixar faixas.
 */
const fs = require('fs');

const RATE = 48000;

/** Lê um WAV PCM de 16 bits e devolve { rate, data } em mono. */
function readWav(file) {
  const b = fs.readFileSync(file);
  if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WAVE') throw new Error(`Não é WAV: ${file}`);
  let pos = 12;
  let fmt = null;
  let data = null;
  while (pos + 8 <= b.length) {
    const id = b.toString('ascii', pos, pos + 4);
    const size = b.readUInt32LE(pos + 4);
    if (id === 'fmt ') fmt = { channels: b.readUInt16LE(pos + 10), rate: b.readUInt32LE(pos + 12), bits: b.readUInt16LE(pos + 22) };
    if (id === 'data') {
      // alguns geradores gravam um tamanho inválido; nesse caso vai até o fim do arquivo
      const end = size === 0 || pos + 8 + size > b.length ? b.length : pos + 8 + size;
      data = b.subarray(pos + 8, end);
      break;
    }
    pos += 8 + size + (size % 2);
  }
  if (!fmt || !data || fmt.bits !== 16) throw new Error(`WAV não suportado: ${file}`);
  const frames = Math.floor(data.length / 2 / fmt.channels);
  const out = new Float32Array(frames);
  for (let i = 0; i < frames; i++) {
    let s = 0;
    for (let c = 0; c < fmt.channels; c++) s += data.readInt16LE((i * fmt.channels + c) * 2);
    out[i] = s / fmt.channels / 32768;
  }
  return { rate: fmt.rate, data: out };
}

/** Grava um WAV PCM de 16 bits, mono. */
function writeWav(file, data, rate = RATE) {
  const b = Buffer.alloc(44 + data.length * 2);
  b.write('RIFF', 0, 'ascii');
  b.writeUInt32LE(36 + data.length * 2, 4);
  b.write('WAVEfmt ', 8, 'ascii');
  b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20);
  b.writeUInt16LE(1, 22);
  b.writeUInt32LE(rate, 24);
  b.writeUInt32LE(rate * 2, 28);
  b.writeUInt16LE(2, 32);
  b.writeUInt16LE(16, 34);
  b.write('data', 36, 'ascii');
  b.writeUInt32LE(data.length * 2, 40);
  for (let i = 0; i < data.length; i++) {
    const v = Math.max(-1, Math.min(1, data[i]));
    b.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  fs.writeFileSync(file, b);
  return file;
}

/** Volume ao longo do tempo (RMS em janelas de `win` segundos). */
function envelope(data, rate, win = 0.01) {
  const n = Math.max(1, Math.round(rate * win));
  const out = new Float32Array(Math.ceil(data.length / n));
  for (let i = 0; i < out.length; i++) {
    let s = 0;
    const end = Math.min(data.length, (i + 1) * n);
    for (let j = i * n; j < end; j++) s += data[j] * data[j];
    out[i] = Math.sqrt(s / (end - i * n));
  }
  return { win: n / rate, values: out };
}

/**
 * Trechos de fala separados por pausas. Devolve [{ start, end }] em segundos.
 * `minPause` é a menor pausa que separa dois trechos.
 */
function speechSegments(data, rate, { threshDb = -34, minPause = 0.12, pad = 0.03 } = {}) {
  const env = envelope(data, rate, 0.01);
  const thresh = Math.pow(10, threshDb / 20);
  const segs = [];
  let start = null;
  let lastLoud = null;
  for (let i = 0; i < env.values.length; i++) {
    const t = i * env.win;
    if (env.values[i] > thresh) {
      if (start === null) start = t;
      lastLoud = t + env.win;
    } else if (start !== null && t - lastLoud >= minPause) {
      segs.push({ start, end: lastLoud });
      start = null;
    }
  }
  if (start !== null) segs.push({ start, end: lastLoud });
  const total = data.length / rate;
  return segs.map((s) => ({ start: Math.max(0, s.start - pad), end: Math.min(total, s.end + pad) }));
}

/**
 * Divide uma fala em `n` partes, cortando nas `n - 1` maiores pausas.
 * Serve para separar "pergunta, opção 1, opção 2, opção 3" de uma frase só.
 * Devolve menos de `n` partes se a fala não tiver pausas suficientes.
 */
function splitParts(data, rate, n, opts = {}) {
  let segs = speechSegments(data, rate, Object.assign({ minPause: 0.06, pad: 0 }, opts)).filter((s) => s.end - s.start >= 0.05);
  // Estalos e respirações soltas (curtos e fracos) não contam como fala
  const rms = (s) => {
    const x = slice(data, rate, s.start, s.end);
    let e = 0;
    for (let i = 0; i < x.length; i++) e += x[i] * x[i];
    return Math.sqrt(e / Math.max(1, x.length));
  };
  const ref = Math.max(...segs.map(rms), 0);
  segs = segs.filter((s) => s.end - s.start >= 0.2 || rms(s) >= 0.3 * ref);
  while (segs.length > n) {
    let k = 0;
    let best = Infinity;
    for (let i = 0; i < segs.length - 1; i++) {
      const gap = segs[i + 1].start - segs[i].end;
      if (gap < best) {
        best = gap;
        k = i;
      }
    }
    segs.splice(k, 2, { start: segs[k].start, end: segs[k + 1].end });
  }
  return segs;
}

/** Tira o silêncio do começo e do fim de uma fala. */
function trim(data, rate, pad = 0.04) {
  const segs = speechSegments(data, rate, { minPause: 0.06, pad: 0 }).filter((s) => s.end - s.start >= 0.05);
  if (!segs.length) return data;
  return slice(data, rate, Math.max(0, segs[0].start - pad), Math.min(data.length / rate, segs[segs.length - 1].end + pad));
}

const slice = (data, rate, start, end) => data.subarray(Math.round(start * rate), Math.round(end * rate));
const silence = (seconds, rate = RATE) => new Float32Array(Math.round(seconds * rate));

function concat(parts) {
  const out = new Float32Array(parts.reduce((a, p) => a + p.length, 0));
  let pos = 0;
  for (const p of parts) {
    out.set(p, pos);
    pos += p.length;
  }
  return out;
}

/** Suaviza o começo e o fim de um trecho para o corte não estalar. */
function fadeEdges(data, rate, seconds = 0.008) {
  const n = Math.min(Math.round(seconds * rate), Math.floor(data.length / 2));
  const out = Float32Array.from(data);
  for (let i = 0; i < n; i++) {
    const k = i / n;
    out[i] *= k;
    out[out.length - 1 - i] *= k;
  }
  return out;
}

/** Soma `src` em `dest` a partir de `at` segundos, com ganho. */
function mixInto(dest, src, rate, at, gain = 1) {
  const off = Math.round(at * rate);
  const n = Math.min(src.length, dest.length - off);
  for (let i = 0; i < n; i++) dest[off + i] += src[i] * gain;
  return dest;
}

/**
 * Altura da voz ao longo da fala. Devolve a mediana em Hz e o quanto a voz
 * varia, em semitons. Voz mais alta e mais variada é sinal de fala animada.
 */
function pitchStats(data, rate, { fmin = 140, fmax = 560 } = {}) {
  const N = Math.round(0.04 * rate);
  const H = Math.round(0.01 * rate);
  const lagMin = Math.floor(rate / fmax);
  const lagMax = Math.ceil(rate / fmin);
  const r = new Float64Array(lagMax + 1);
  const f0 = [];
  for (let s = 0; s + N + lagMax < data.length; s += H) {
    let e = 0;
    for (let i = 0; i < N; i++) e += data[s + i] * data[s + i];
    if (e / N < 2.5e-4) continue;
    let best = 0;
    for (let lag = lagMin; lag <= lagMax; lag++) {
      let num = 0;
      let d2 = 0;
      for (let i = 0; i < N; i++) {
        const b = data[s + i + lag];
        num += data[s + i] * b;
        d2 += b * b;
      }
      r[lag] = num / Math.sqrt(e * d2 + 1e-12);
      if (r[lag] > best) best = r[lag];
    }
    if (best < 0.55) continue;
    for (let lag = lagMin + 1; lag < lagMax; lag++) {
      if (r[lag] >= 0.9 * best && r[lag] >= r[lag - 1] && r[lag] >= r[lag + 1]) {
        f0.push(rate / lag);
        break;
      }
    }
  }
  if (f0.length < 5) return { mediana: 0, desvio: 0 };
  f0.sort((a, b) => a - b);
  const med = f0[Math.floor(f0.length / 2)];
  const desvio = Math.sqrt(f0.reduce((a, x) => a + Math.pow(12 * Math.log2(x / med), 2), 0) / f0.length);
  return { mediana: med, desvio };
}

const peak = (data) => data.reduce((m, v) => Math.max(m, Math.abs(v)), 0);

module.exports = { RATE, readWav, writeWav, envelope, speechSegments, splitParts, trim, slice, silence, concat, fadeEdges, mixInto, peak, pitchStats };
