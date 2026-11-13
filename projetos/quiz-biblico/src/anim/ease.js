'use strict';
/** Funções de tempo para a animação. Tudo é função pura do instante `t`. */

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
/** Progresso de 0 a 1 de um trecho que começa em `t0` e dura `dur`. */
const prog = (t, t0, dur) => clamp((t - t0) / dur);

const outCubic = (k) => 1 - Math.pow(1 - k, 3);
const inCubic = (k) => k * k * k;
const inOutCubic = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const inOutSine = (k) => -(Math.cos(Math.PI * k) - 1) / 2;
/** Passa um pouco do ponto e volta: bom para coisas que "pulam" no lugar. */
const outBack = (k, s = 1.70158) => 1 + (s + 1) * Math.pow(k - 1, 3) + s * Math.pow(k - 1, 2);
const inBack = (k, s = 1.70158) => (s + 1) * k * k * k - s * k * k;
function outBounce(k) {
  const n = 7.5625;
  const d = 2.75;
  if (k < 1 / d) return n * k * k;
  if (k < 2 / d) return n * (k -= 1.5 / d) * k + 0.75;
  if (k < 2.5 / d) return n * (k -= 2.25 / d) * k + 0.9375;
  return n * (k -= 2.625 / d) * k + 0.984375;
}
/** Sobe e desce uma vez (0 → 1 → 0). */
const bump = (k) => Math.sin(Math.PI * clamp(k));

/** Número pseudoaleatório estável para um índice (0 a 1). */
function rand(i, salt = 0) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

module.exports = { clamp, lerp, prog, outCubic, inCubic, inOutCubic, inOutSine, outBack, inBack, outBounce, bump, rand };
