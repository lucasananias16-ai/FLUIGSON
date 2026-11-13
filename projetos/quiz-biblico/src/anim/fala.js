'use strict';
/** Leitura da narração para a animação: volume da voz e tempo de cada frase. */
const A = require('../audio');

/** Volume da fala ao longo do tempo, de 0 a 1, para a boca da Tuti. */
function falaEnvelope(file) {
  const { data, rate } = A.readWav(file);
  const env = A.envelope(data, rate, 1 / 60);
  const sorted = Array.from(env.values).sort((a, b) => a - b);
  const ref = sorted[Math.floor(sorted.length * 0.95)] || 1;
  const v = Array.from(env.values, (x) => Math.min(1, Math.pow(x / ref, 0.7)));
  for (let i = 1; i < v.length; i++) v[i] = Math.max(v[i], v[i - 1] * 0.72); // a boca fecha devagar
  return (t) => {
    const i = t / env.win;
    const i0 = Math.floor(i);
    if (i0 < 0 || i0 >= v.length - 1) return 0;
    return v[i0] + (v[i0 + 1] - v[i0]) * (i - i0);
  };
}

/**
 * Início e fim de cada frase dentro de um áudio. O corte entre duas frases é
 * estimado pelo tamanho do texto e depois ajustado para a pausa mais próxima.
 */
function temposDasFrases(file, frases) {
  const { data, rate } = A.readWav(file);
  const total = data.length / rate;
  const segs = A.speechSegments(data, rate, { minPause: 0.1, pad: 0 }).filter((s) => s.end - s.start >= 0.05);
  if (!segs.length) return frases.map((_, i) => ({ ini: (total * i) / frases.length, fim: (total * (i + 1)) / frases.length }));
  const falado = segs.reduce((a, s) => a + s.end - s.start, 0);
  const pos = (frac) => {
    let alvo = frac * falado;
    for (const s of segs) {
      const d = s.end - s.start;
      if (alvo <= d) return s.start + alvo;
      alvo -= d;
    }
    return segs[segs.length - 1].end;
  };
  const pausas = segs.slice(1).map((s, i) => ({ ini: segs[i].end, fim: s.start }));
  const chars = frases.map((x) => x.replace(/[^\p{L}\p{N}]/gu, '').length);
  const soma = chars.reduce((a, b) => a + b, 0);
  const out = [];
  let ini = segs[0].start;
  let acc = 0;
  for (let i = 0; i < frases.length; i++) {
    if (i === frases.length - 1) {
      out.push({ ini, fim: segs[segs.length - 1].end });
      break;
    }
    acc += chars[i];
    // a estimativa nunca pode cair antes do começo da própria frase
    const t = Math.max(pos(acc / soma), ini + 0.3);
    let corte = { ini: t, fim: t };
    let melhor = 0.7;
    for (const p of pausas) {
      const dist = Math.abs((p.ini + p.fim) / 2 - t);
      if (dist < melhor && p.ini > ini + 0.2) {
        melhor = dist;
        corte = p;
      }
    }
    out.push({ ini, fim: corte.ini });
    ini = corte.fim;
  }
  return out;
}

/** Divide um texto em frases (pelo ponto, exclamação, interrogação ou reticências). */
const emFrases = (texto) => texto.match(/[^.!?]+(?:\.\.\.|[.!?])+/g).map((x) => x.trim());

module.exports = { falaEnvelope, temposDasFrases, emFrases };
