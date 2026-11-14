'use strict';
/**
 * Tuti animada: mistura poses, pisca, respira, pula e mexe a boca com a fala.
 */
const { tutiSvg, POSES, BASE } = require('../tuti');
const { clamp, lerp, prog, inOutCubic, rand } = require('./ease');

const full = (p) => Object.assign({}, BASE, typeof p === 'string' ? POSES[p] : p);

/** Pose intermediária entre `a` e `b` (k de 0 a 1). */
function mixPose(a, b, k) {
  const out = {};
  for (const key of Object.keys(BASE)) {
    const x = a[key];
    const y = b[key];
    if (typeof x === 'number' && typeof y === 'number') out[key] = lerp(x, y, k);
    else if (Array.isArray(x) && Array.isArray(y)) out[key] = x.map((v, i) => lerp(v, y[i], k));
    else out[key] = k < 0.5 ? x : y;
  }
  return out;
}

/**
 * Pose no instante `t` de uma trilha [{ t, pose, dur }]: cada item começa uma
 * transição da pose anterior para a dele.
 */
function poseAt(track, t) {
  let cur = full(track[0].pose);
  for (const kf of track) {
    if (t < kf.t) break;
    cur = mixPose(cur, full(kf.pose), inOutCubic(prog(t, kf.t, kf.dur || 0.45)));
  }
  return cur;
}

/** Abertura do olho: 1 aberto, perto de 0 no meio da piscada. */
function blink(t) {
  const period = 3.4;
  const i = Math.floor(t / period);
  const start = i * period + 1.1 + rand(i, 3) * 1.6;
  const k = (t - start) / 0.2;
  if (k < 0 || k > 1) return 1;
  return k < 0.4 ? 1 - (k / 0.4) * 0.94 : 0.06 + ((k - 0.4) / 0.6) * 0.94;
}

/**
 * SVG da Tuti no instante `t`.
 * @param {object} o
 *  - track: trilha de poses
 *  - fala(t): volume da voz de 0 a 1, ou null quando ela não está falando
 *  - pulos: [{ t, n, altura, periodo }] sequências de pulinhos
 *  - tGlobal: tempo desde o começo do vídeo, para o balanço não dar tranco entre cenas
 *  - ajuste(p, t): retoque livre na pose (por exemplo, o vaivém do aceno)
 *  - gorro: a Tuti usa gorro de Papai Noel (Vídeo 4)
 */
function tutiFrame(t, { track, fala, pulos = [], tGlobal = t, width = 560, height = 616, ajuste = null, gorro = false }) {
  const p = poseAt(track, t);
  if (ajuste) ajuste(p, t);
  p.extras = null;
  p.shadow = true;
  p.gorro = gorro;

  // respiração e balanço
  p.squash *= 1 + 0.012 * Math.sin((tGlobal * 2 * Math.PI) / 2.3);
  p.headTilt += 1.1 * Math.sin((tGlobal * 2 * Math.PI) / 3.9);
  p.earL += 2 * Math.sin((tGlobal * 2 * Math.PI) / 2.9);
  p.earR += 2 * Math.sin((tGlobal * 2 * Math.PI) / 2.9 + 1);

  // pulinhos
  for (const h of pulos) {
    const per = h.periodo || 0.46;
    const k = (t - h.t) / per;
    if (k < 0 || k >= h.n) continue;
    const f = k - Math.floor(k);
    p.jump += h.altura * Math.sin(Math.PI * f);
    p.squash *= 1 + 0.05 * Math.sin(Math.PI * f) - 0.03;
  }

  if (p.eyes === 'open') p.eyeOpen = Math.min(p.eyeOpen, blink(tGlobal));

  const v = fala ? fala(t) : null;
  if (v !== null && v !== undefined) p.mouth = clamp(0.1 + v * 0.95);

  return tutiSvg(p, {}, { width, height });
}

module.exports = { tutiFrame, mixPose, poseAt, full };
