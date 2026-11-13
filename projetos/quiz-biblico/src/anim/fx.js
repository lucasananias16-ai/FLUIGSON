'use strict';
/** Efeitos visuais compartilhados pelas cenas. */
const Z = require('./ease');

const CORES = ['#FF6B6B', '#FFD23F', '#5DBB7A', '#4DA3FF', '#9B7EDE', '#FF8FB1', '#FFA53A'];
const f = (v) => Math.round(v * 1000) / 1000;

/**
 * Chuva de confete. `vida` é o tempo em segundos desde que começou; as peças
 * nascem ao longo do primeiro segundo e caem balançando.
 */
function confete(vida, { pecas = 90 } = {}) {
  if (vida < 0) return '';
  let s = '';
  for (let i = 0; i < pecas; i++) {
    const life = vida - Z.rand(i, 1) * 1.1;
    if (life < 0) continue;
    const x = Z.rand(i, 2) * 1920 + Math.sin(life * (1.4 + Z.rand(i, 5) * 2) + i) * (40 + Z.rand(i, 4) * 60);
    const y = -40 + (330 + Z.rand(i, 3) * 360) * life + 50 * life * life;
    if (y > 1120) continue;
    const w = 16 + Z.rand(i, 7) * 12;
    const c = CORES[i % CORES.length];
    if (i % 3 === 0) s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(w / 2)}" fill="${c}"/>`;
    else {
      const rot = life * (130 + Z.rand(i, 6) * 300) * (i % 2 ? 1 : -1);
      s += `<rect x="${f(x - w / 2)}" y="${f(y - w * 0.3)}" width="${f(w)}" height="${f(w * 0.6)}" rx="3" fill="${c}" transform="rotate(${f(rot)} ${f(x)} ${f(y)})"/>`;
    }
  }
  return s;
}

/**
 * Opacidade do véu que abre e fecha uma cena. `entrada` e `saida` são cores
 * (ou null); devolve o estilo do elemento #fade.
 */
function veu(t, dur, { entrada = null, saida = null, tIn = 0.4, tOut = 0.45 } = {}) {
  const a = entrada ? 1 - Z.prog(t, 0, tIn) : 0;
  const b = saida ? Z.prog(t, dur - tOut, tOut) : 0;
  const cor = b > 0 ? saida : entrada || saida || '#fff';
  return `background:${cor};opacity:${f(Z.clamp(Math.max(a, b)))}`;
}

module.exports = { confete, veu, CORES };
