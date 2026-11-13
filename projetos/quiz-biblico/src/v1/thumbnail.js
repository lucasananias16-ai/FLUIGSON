'use strict';
/**
 * Vídeo 1 — thumbnails para o YouTube (1280 x 720), no mesmo traço do vídeo.
 *
 * Uso: node src/v1/thumbnail.js
 *
 * Opção A: título grande, a Tuti apontando e a arca com o arco-íris.
 * Opção B: a Tuti e três cards do quiz, mostrando como é a brincadeira.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const kit = require('../kit');
const { P, E, R, G, withOutline } = kit;
const { tuti } = require('../tuti');
const cenario = require('../art/cenario');
const animais = require('../art/animais');
const { rainbowArc } = require('../art/objetos');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'v1-arca-de-noe', 'youtube');
const FONT = path.join(ROOT, 'assets', 'fonts', 'Fredoka-latin-wght.woff2');
const LINE = '#3D2C4E';
const TRACO = 8; // um pouco mais grosso que no vídeo: a thumbnail é vista pequena

/** Texto com contorno grosso e sombra dura, legível mesmo em miniatura. */
function letreiro(txt, x, y, size, fill, { stroke = 28, rot = 0, anchor = 'middle' } = {}) {
  const base = `x="${x}" y="${y}" text-anchor="${anchor}" font-family="Fredoka" font-weight="700" font-size="${size}" stroke-linejoin="round"`;
  const tr = rot ? ` transform="rotate(${rot} ${x} ${y})"` : '';
  return (
    `<g${tr}>` +
    `<text ${base} transform="translate(0,${Math.round(size * 0.06)})" fill="${LINE}" stroke="${LINE}" stroke-width="${stroke}">${txt}</text>` +
    `<text ${base} fill="${fill}" stroke="${LINE}" stroke-width="${stroke}" paint-order="stroke">${txt}</text>` +
    `</g>`
  );
}

/** Céu com raios de luz saindo de um ponto, para dar energia ao fundo. */
function ceu(cx, cy) {
  let rays = '';
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const w = Math.PI / 28;
    rays += `<path d="M${cx} ${cy} L${cx + Math.cos(a - w) * 2600} ${cy + Math.sin(a - w) * 2600} L${cx + Math.cos(a + w) * 2600} ${cy + Math.sin(a + w) * 2600}Z"/>`;
  }
  return R(0, 0, 1920, 1080, 0, '#8ED4FF', { sw: 0 }) + `<g fill="#A9E0FF">${rays}</g>`;
}

const chao = () =>
  P('M-20 880 Q560 800 1100 856 Q1520 896 1940 820 L1940 1100 L-20 1100Z', '#7ED07D') +
  P('M-20 1010 Q520 960 1040 1004 Q1500 1040 1940 990 L1940 1100 L-20 1100Z', '#63BF68');

const APONTA = { headTilt: 5, lean: 1, armR: [790, 500], armL: [394, 800], gaze: [0.7, -0.5], browL: 12, browR: 12, mouth: 0.75, extras: null };

function opcaoA() {
  return withOutline(TRACO, () => {
    let s = ceu(1300, 620);
    s += withOutline(TRACO, () => rainbowArc(1330, 960, 800, 38));
    s += cenario.skyCloud(250, 140, 1.0);
    s += chao();
    s += G('translate(1080,500) scale(0.64)', withOutline(TRACO / 0.64, cenario.arca));
    s += G('translate(1436,584) scale(0.5)', withOutline(TRACO / 0.5, animais.elefante));
    s += G('translate(1010,650) scale(0.4)', withOutline(TRACO / 0.4, animais.leao));
    s += cenario.flowers([
      [760, 1030, 1.5],
      [1460, 1046, 1.4],
      [1850, 1040, 1.3],
    ]);
    s += G('translate(-90,120) scale(0.98)', tuti(APONTA, { shadow: false }));
    s += letreiro('QUIZ', 1330, 300, 330, '#FFD23F', { stroke: 36, rot: -4 });
    s += letreiro('da Arca de Noé', 1330, 456, 132, '#FFFFFF', { stroke: 26, rot: -4 });
    return s;
  });
}

function card(x, y, size, rot, fundo, arte, num) {
  const r = size * 0.12;
  return G(
    `translate(${x},${y}) rotate(${rot})`,
    R(-size / 2, -size / 2 + 18, size, size, r, '#3D2C4E', { sw: 0, opacity: 0.18 }),
    R(-size / 2, -size / 2, size, size, r, fundo, { sw: TRACO * 1.3 }),
    G(`translate(${-size * 0.47},${-size * 0.47}) scale(${(size * 0.94) / 1000})`, withOutline(TRACO / ((size * 0.94) / 1000), arte)),
    `<circle cx="${-size / 2 + 58}" cy="${-size / 2 + 58}" r="44" fill="#fff" stroke="${LINE}" stroke-width="${TRACO}"/>` +
      `<text x="${-size / 2 + 58}" y="${-size / 2 + 78}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="58" fill="${LINE}">${num}</text>`
  );
}

function opcaoB() {
  return withOutline(TRACO, () => {
    let s = ceu(1240, 600);
    s += cenario.skyCloud(230, 140, 0.9);
    s += chao();
    s += card(900, 740, 360, -6, '#FFF1B8', animais.umElefante, 1);
    s += card(1290, 716, 390, 0, '#CFE6FF', animais.leao, 2);
    s += card(1680, 740, 360, 6, '#CFF1E0', animais.girafa, 3);
    s += G('translate(-150,170) scale(0.93)', tuti(Object.assign({}, APONTA, { armR: [800, 560] }), { shadow: false }));
    s += letreiro('QUIZ', 1290, 260, 270, '#FFD23F', { stroke: 34, rot: -3 });
    s += letreiro('da Arca de Noé', 1290, 400, 124, '#FFFFFF', { stroke: 26, rot: -3 });
    return s;
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const [nome, fn] of [
    ['A', opcaoA],
    ['B', opcaoB],
  ]) {
    kit.resetIds();
    const html = `<html><head><style>@font-face{font-family:Fredoka;src:url("file://${FONT}") format("woff2");font-weight:300 700}body{margin:0}</style></head><body><svg viewBox="0 0 1920 1080" width="1920" height="1080">${fn()}</svg></body></html>`;
    const tmp = path.join(OUT, `_thumb_${nome}.html`);
    fs.writeFileSync(tmp, html);
    await page.goto('file://' + tmp);
    await page.evaluate(() => document.fonts.ready);
    const grande = path.join(OUT, `_thumb_${nome}_1920.png`);
    await page.screenshot({ path: grande });
    fs.unlinkSync(tmp);
    const final = path.join(OUT, `v1_thumbnail_${nome}.png`);
    execFileSync('convert', [grande, '-filter', 'Lanczos', '-resize', '1280x720', '-strip', final]);
    fs.unlinkSync(grande);
    console.log(final, (fs.statSync(final).size / 1024).toFixed(0) + ' KB');
  }
  await browser.close();
})();
