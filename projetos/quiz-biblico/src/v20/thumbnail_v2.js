'use strict';
/**
 * Vídeo 20, versão 2 — as 3 miniaturas do padrão novo (19/11/2026), para o
 * "Testar e comparar" do YouTube Studio:
 *  A · "FUGIU!": a Tuti espantada e o pinguim gigante correndo, fundo vermelho com raios;
 *  B · "A ou B?": dois cartões grandes (o casaco e o maiô), o "?" no meio e o relógio no 5;
 *  C · "CADÊ?": o Polo Norte de noite, o pinguim meio escondido atrás do iglu e a lupa.
 * Pouca palavra, letra enorme, a Tuti grande e expressiva e o selo QUIZZITO no canto.
 *
 * Uso: node src/v20/thumbnail_v2.js
 */
const path = require('path');
const kit = require('../kit');
const { P, R, G, Ci, L, E, withOutline } = kit;
const { tuti } = require('../tuti');
const cenario = require('../art/cenario');
const animais = require('../art/animais');
const fl = require('../art/floresta');
const pl = require('../art/polo');
const vr = require('../art/verao');
const neve = require('../art/neve');
const noel = require('../art/noel');
const objetos = require('../art/objetos');
const { letreiro, gravar, TRACO, LINE } = require('../thumb');

const OUT = path.join(path.resolve(__dirname, '..', '..'), 'v20-natal-polo-norte', 'youtube');
const ESPANTO = { headTilt: -5, armL: [236, 520], armR: [764, 520], gaze: [0.75, -0.25], browL: 18, browR: 18, mouth: 1, earL: -16, earR: -16, extras: null };
const FESTA = { jump: 0, armL: [236, 470], armR: [764, 470], eyes: 'happy', browL: 10, browR: 10, mouth: 1, earL: -14, earR: -14, extras: 'sparkles' };
const sobre = (fn, cx, base, s) => cenario.place(fn, cx - 500 * s, base - 900 * s, s);

/** Raios saindo de (cx, cy) sobre a cor `cor`, com raios `cor2`. */
function raios(cx, cy, cor, cor2) {
  let r = '';
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const w = Math.PI / 32;
    r += `<path d="M${cx} ${cy} L${cx + Math.cos(a - w) * 2600} ${cy + Math.sin(a - w) * 2600} L${cx + Math.cos(a + w) * 2600} ${cy + Math.sin(a + w) * 2600}Z"/>`;
  }
  return R(0, 0, 1920, 1080, 0, cor, { sw: 0 }) + `<g fill="${cor2}">${r}</g>`;
}
/** Selo pequeno QUIZZITO no canto de baixo, à direita. */
const selo = () =>
  `<g transform="translate(1600,992) rotate(-3)"><rect x="-150" y="-46" width="300" height="88" rx="44" fill="#fff" stroke="${LINE}" stroke-width="9"/>` +
  `<text x="0" y="20" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="54" fill="#2E8BFF">QUIZZITO</text></g>`;

// A · FUGIU!
const opcaoA = () =>
  withOutline(TRACO, () => {
    let s = raios(1250, 560, '#E5484D', '#F06A6E');
    s += P('M-20 940 Q560 900 1100 930 Q1520 950 1940 910 L1940 1100 L-20 1100Z', '#FFFFFF');
    // linhas de movimento atrás do passarinho
    s += [[900, 470, 300], [860, 560, 380], [920, 650, 280]].map(([x, y, w]) => L(`M${x} ${y} L${x + w} ${y}`, { color: '#FFFFFF', sw: 22 })).join('');
    s += G('translate(1120,240) rotate(-6) scale(0.68)', withOutline(TRACO / 0.68, pl.pinguim));
    s += G('translate(-150,150) scale(1.08)', tuti(ESPANTO, { shadow: false, gorro: true }));
    s += letreiro('FUGIU!', 1340, 230, 260, '#FFD23F', { stroke: 40, rot: -5 });
    return s + selo();
  });

// B · A ou B?
const cartao = (x, y, cor, letra, arte) =>
  G(`translate(${x},${y}) rotate(${letra === 'A' ? -5 : 5})`,
    R(-230, -212, 460, 460, 56, LINE, { sw: 0, opacity: 0.2 }) + R(-230, -230, 460, 460, 56, cor, { sw: TRACO * 1.4 }) +
    R(-200, -200, 400, 400, 40, '#FFFFFF', { sw: TRACO }) +
    G('translate(-190,-190) scale(0.38)', withOutline(TRACO / 0.38, arte)) +
    `<circle cx="-200" cy="-200" r="62" fill="${cor}" stroke="${LINE}" stroke-width="${TRACO}"/>` +
    `<text x="-200" y="-176" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="76" fill="#fff" stroke="${LINE}" stroke-width="8" paint-order="stroke">${letra}</text>`);
const opcaoB = () =>
  withOutline(TRACO, () => {
    let s = raios(1180, 520, '#7B5CE0', '#8E73EA');
    s += cartao(820, 540, '#2E8BFF', 'A', vr.casaco) + cartao(1560, 540, '#FF8A3D', 'B', pl.maio);
    s += letreiro('?', 1190, 700, 420, '#FFD23F', { stroke: 44 });
    // relógio no 5
    s += `<g transform="translate(1190,150)"><circle r="96" fill="#fff" stroke="${LINE}" stroke-width="12"/><circle r="72" fill="none" stroke="#2E8BFF" stroke-width="18" stroke-dasharray="226 452" transform="rotate(-90)"/>` +
      `<text y="34" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="100" fill="${LINE}">5</text></g>`;
    s += G('translate(-210,330) scale(0.82)', tuti(FESTA, { shadow: false, gorro: true }));
    return s + selo();
  });

// C · CADÊ?
const opcaoC = () =>
  withOutline(TRACO, () => {
    let s = R(0, 0, 1920, 1080, 0, '#2B3F86', { sw: 0 });
    s += [[620, 120], [880, 260], [1180, 90], [1480, 200], [1760, 120], [1020, 360], [1830, 380], [700, 420]].map(([x, y], i) => kit.sparkle(x, y, 22 + (i % 3) * 8, i * 15, '#FFF6C8')).join('');
    s += Ci(1700, 330, 70, '#FFF6C8');
    s += P('M-20 860 Q560 800 1100 846 Q1520 880 1940 820 L1940 1100 L-20 1100Z', '#FFFFFF');
    s += P('M-20 1000 Q520 960 1040 996 Q1500 1026 1940 986 L1940 1100 L-20 1100Z', '#DCE8F7');
    s += sobre(pl.ursoPolar, 980, 1000, 0.3) + sobre(() => pl.casinhaNoel(), 1230, 990, 0.3);
    // o pinguim meio escondido atrás do iglu, com a lupa em cima
    s += sobre(pl.pinguim, 1720, 990, 0.34);
    s += sobre(pl.iglu, 1520, 1010, 0.6);
    s += `<g transform="translate(1700,760)"><circle r="150" fill="#FFFFFF" fill-opacity="0.22" stroke="${LINE}" stroke-width="22"/><circle r="150" fill="none" stroke="#FFD23F" stroke-width="12"/>` +
      `<path d="M100 110 L230 250" stroke="${LINE}" stroke-width="58" stroke-linecap="round"/><path d="M100 110 L230 250" stroke="#8F5A2E" stroke-width="36" stroke-linecap="round"/></g>`;
    s += G('translate(-170,160) scale(1.0)', tuti(ESPANTO, { shadow: false, gorro: true }));
    s += letreiro('CADÊ?', 1060, 250, 250, '#FFD23F', { stroke: 40, rot: -4 });
    return s + selo();
  });

gravar(
  [
    ['A', opcaoA],
    ['B', opcaoB],
    ['C', opcaoC],
  ],
  { outDir: OUT, prefixo: 'v20_v2', escolhida: 'A' }
);
