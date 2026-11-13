'use strict';
/**
 * Peças do palco compartilhadas pelas cenas de desafio: poses da Tuti, o
 * verso dos cards, os raios de luz, o relógio da contagem e os trechos de
 * página (CSS e HTML) que se repetem.
 */
const Z = require('./ease');
const kit = require('../kit');
const { POSES } = require('../tuti');
const { TRACO } = require('../art/cenario');

const LINE = '#3D2C4E';
const CARD = 440;

const f = (v) => Math.round(v * 1000) / 1000;

// Poses da Tuti usadas na cena
const OLHANDO = { gaze: [0.7, -0.35], mouth: 0.15 };
const APONTANDO = { headTilt: 4, lean: 1, armR: [772, 556], gaze: [0.85, -0.45], browL: 8, browR: 8, mouth: 0.3 };
const PENSANDO = Object.assign({}, POSES.perguntando, { mouth: 0 });
const PENSANDO_FRENTE = Object.assign({}, PENSANDO, { gaze: [0, -0.1], headTilt: -4, browR: 6, browTiltR: 0 });
const COMEMORA = Object.assign({}, POSES.comemorando, { jump: 0, squash: 1 });
const FELIZ = { armL: [300, 650], armR: [700, 650], browL: 8, browR: 8, mouth: 0.4 };

/** Verso do card: azul do lenço da Tuti, com bolinhas e o número (ou "?"). */
function verso(label) {
  let dots = '';
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 7; c++) dots += `<circle cx="${f(10 + c * 70 + (r % 2) * 35)}" cy="${10 + r * 70}" r="13"/>`;
  }
  return (
    `<svg viewBox="0 0 440 440" width="100%" height="100%">` +
    `<rect width="440" height="440" fill="#2E8BFF"/><g fill="#fff" opacity="0.3">${dots}</g>` +
    `<rect x="20" y="20" width="400" height="400" rx="34" fill="none" stroke="#8CC2FF" stroke-width="6"/>` +
    `<circle cx="220" cy="220" r="116" fill="#fff" stroke="${LINE}" stroke-width="7"/>` +
    `<text x="220" y="272" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="156" fill="#2E8BFF">${label}</text>` +
    `</svg>`
  );
}

/** Raios de luz atrás do card certo. */
function raios() {
  let rays = '';
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 * Math.PI) / 180;
    const w = (8 * Math.PI) / 180;
    rays += `<path d="M0 0 L${f(Math.cos(a - w) * 520)} ${f(Math.sin(a - w) * 520)} L${f(Math.cos(a + w) * 520)} ${f(Math.sin(a + w) * 520)}Z"/>`;
  }
  return (
    `<svg viewBox="-520 -520 1040 1040" width="1040" height="1040"><defs><radialGradient id="rg" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="520">` +
    `<stop offset="0" stop-color="#FFF6C4" stop-opacity="1"/><stop offset="0.55" stop-color="#FFE680" stop-opacity="0.75"/><stop offset="1" stop-color="#FFE680" stop-opacity="0"/>` +
    `</radialGradient></defs><g fill="url(#rg)">${rays}</g></svg>`
  );
}

function timerSvg(num, frac, pulse) {
  const R = 88;
  const C = 2 * Math.PI * R;
  const color = num <= 3 ? '#FF8A3A' : '#2E8BFF';
  return (
    `<svg viewBox="-120 -120 240 240" width="240" height="240">` +
    `<circle r="112" cy="8" fill="${LINE}" opacity="0.14"/>` +
    `<circle r="108" fill="#fff" stroke="${LINE}" stroke-width="7"/>` +
    `<circle r="${R}" fill="none" stroke="#E4EBF5" stroke-width="18"/>` +
    `<circle r="${R}" fill="none" stroke="${color}" stroke-width="18" stroke-linecap="round" stroke-dasharray="${f(C * frac)} ${f(C)}" transform="rotate(-90)"/>` +
    `<text y="${f(36 + 4 * pulse)}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${f(104 * (1 + 0.16 * pulse))}" fill="${LINE}">${num}</text>` +
    `</svg>`
  );
}

/** Tuti procurando: casco sobre os olhos, olhando ao longe. */
const PROCURANDO = { headTilt: -4, armR: [640, 318], armRFront: true, armL: [394, 800], gaze: [0.7, -0.1], browL: 10, browR: 10, mouth: 0.15 };

/** CSS do que toda cena de desafio tem: fundo, véu, faixa da pergunta, relógio e Tuti. */
function cssBase({ timer = { x: 1160, y: 866 } } = {}) {
  return `
    #bg, #fx, #fade { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    #fade { background: #fff; opacity: 0; }
    #banner { position: absolute; left: 330px; top: 44px; width: 1260px; height: 132px; padding-left: 104px; background: #fff;
      border: 7px solid ${LINE}; border-radius: 66px; box-shadow: 0 12px 0 rgba(61,44,78,.14);
      display: flex; align-items: center; justify-content: center; font-size: 76px; font-weight: 600; white-space: nowrap; }
    #qnum { position: absolute; left: -38px; top: -19px; width: 156px; height: 156px; border-radius: 50%; background: #2E8BFF;
      border: 7px solid ${LINE}; color: #fff; font-size: 96px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    #timer { position: absolute; left: ${timer.x - 120}px; top: ${timer.y - 120}px; width: 240px; height: 240px; transform: scale(0); }
    #tuti { position: absolute; left: -40px; top: 436px; width: 560px; height: 616px; }
  `;
}

/** CSS dos cards que viram. */
function cssCards() {
  return `
    .card { position: absolute; width: ${CARD}px; height: ${CARD}px; perspective: 1800px; }
    .cshadow { position: absolute; left: 0; top: 0; width: 100%; height: 100%; border-radius: 52px; background: rgba(61,44,78,.16); }
    .inner { position: absolute; left: 0; top: 0; width: 100%; height: 100%; transform-style: preserve-3d; }
    .face { position: absolute; left: 0; top: 0; width: 100%; height: 100%; border-radius: 52px; border: 7px solid ${LINE};
      overflow: hidden; backface-visibility: hidden; }
    .back { transform: rotateY(180deg); }
    .art { position: absolute; left: 3%; top: 3%; width: 94%; height: 94%; }
    .cnum { position: absolute; left: 16px; top: 16px; width: 84px; height: 84px; border-radius: 50%; background: #fff;
      border: 6px solid ${LINE}; font-size: 52px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .check { position: absolute; right: -26px; top: -26px; width: 112px; height: 112px; border-radius: 50%; background: #3CC06F;
      border: 7px solid ${LINE}; display: flex; align-items: center; justify-content: center; transform: scale(0); }
  `;
}

const CHECK_SVG = `<svg viewBox="0 0 60 60" width="62" height="62"><path d="M12 32 L25 45 L49 17" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const bannerHtml = (num, texto) => `<div id="banner"><div id="qnum">${num}</div>${texto}</div>`;

/** Faixa da pergunta: desce no começo, sobe na saída; o selo do número pula. */
function opsBanner(t, T) {
  const bIn = Z.outBack(Z.prog(t, T.banner, 0.55), 1.2);
  const bOut = Z.inBack(Z.prog(t, T.saida, 0.5));
  return [
    { id: 'banner', style: `transform:translateY(${f(-280 * (1 - bIn) - 280 * bOut)}px)` },
    { id: 'qnum', style: `transform:scale(${f(Z.outBack(Z.prog(t, T.selo, 0.45), 2.4))})` },
  ];
}

/** Relógio da contagem regressiva, de `T.contagem` até `T.revela`. */
function opsTimer(t, T, CONT) {
  const ts = Z.outBack(Z.prog(t, T.contagem - 0.4, 0.4), 1.8) * (1 - Z.inBack(Z.prog(t, T.revela - 0.02, 0.26)));
  if (ts <= 0.001) return [{ id: 'timer', style: 'transform:scale(0)' }];
  const el = Z.clamp(t - T.contagem, 0, CONT);
  const shown = Math.max(1, CONT - Math.floor(el));
  const pulse = t >= T.contagem ? Z.bump(Z.prog(el - Math.floor(el), 0, 0.3)) : 0;
  return [{ id: 'timer', style: `transform:scale(${f(ts)})`, html: timerSvg(shown, 1 - el / CONT, pulse) }];
}

/** Tique-taque da contagem e o sininho do fim do tempo. */
function sonsContagem(T, CONT) {
  const sons = [];
  for (let k = 0; k < CONT; k++) sons.push({ t: T.contagem + k, tipo: 'tique', ganho: k >= CONT - 3 ? 0.5 : 0.36, agudo: k % 2 === 0 });
  sons.push({ t: T.contagem + CONT, tipo: 'fimDoTempo', ganho: 0.45 });
  return sons;
}

/** Brilhos piscando em volta de um ponto (o card certo, a ovelhinha achada...). */
function brilhos(t, t0, cx, cy, rx = 335, ry = 305) {
  let s = '';
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.4;
    const k = ((t - t0) / 1.15 + i / 7) % 1;
    const size = (30 + (i % 3) * 12) * Z.bump(k);
    if (size < 6) continue;
    s += kit.withOutline(Math.min(TRACO, size * 0.16), () =>
      kit.sparkle(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, size, i * 20, i % 2 ? '#FFFFFF' : '#FFD23F')
    );
  }
  return s;
}

/** A Tuti alterna o jeito de pensar durante a contagem. */
function pensando(track, T) {
  for (let k = 1; T.contagem + k * 2.6 < T.revela - 0.6; k++) {
    track.push({ t: T.contagem + k * 2.6, pose: k % 2 ? PENSANDO_FRENTE : PENSANDO, dur: 0.6 });
  }
  return track;
}

module.exports = {
  LINE,
  CARD,
  f,
  OLHANDO,
  APONTANDO,
  PENSANDO,
  PENSANDO_FRENTE,
  COMEMORA,
  FELIZ,
  PROCURANDO,
  verso,
  raios,
  timerSvg,
  cssBase,
  cssCards,
  CHECK_SVG,
  bannerHtml,
  opsBanner,
  opsTimer,
  sonsContagem,
  brilhos,
  pensando,
};
