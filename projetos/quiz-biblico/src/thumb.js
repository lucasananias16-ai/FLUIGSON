'use strict';
/**
 * Peças das thumbnails do canal (1280 x 720), no mesmo traço dos vídeos:
 * letreiro, céu com raios, chão, card numerado e a gravação em PNG.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const kit = require('./kit');
const { P, R, G, withOutline } = kit;

const ROOT = path.resolve(__dirname, '..');
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

/** Pose da Tuti nas thumbnails: apontando para o título, boca aberta. */
const APONTA = { headTilt: 5, lean: 1, armR: [790, 500], armL: [394, 800], gaze: [0.7, -0.5], browL: 12, browR: 12, mouth: 0.75, extras: null };

/** Card do quiz com o selo do número. `selo` é a escala do selo. */
function card(x, y, size, rot, fundo, arte, num, selo = 1) {
  const r = size * 0.12;
  return G(
    `translate(${x},${y}) rotate(${rot})`,
    R(-size / 2, -size / 2 + 18, size, size, r, '#3D2C4E', { sw: 0, opacity: 0.18 }),
    R(-size / 2, -size / 2, size, size, r, fundo, { sw: TRACO * 1.3 }),
    G(`translate(${-size * 0.47},${-size * 0.47}) scale(${(size * 0.94) / 1000})`, withOutline(TRACO / ((size * 0.94) / 1000), arte)),
    `<circle cx="${-size / 2 + 58 * selo}" cy="${-size / 2 + 58 * selo}" r="${44 * selo}" fill="#fff" stroke="${LINE}" stroke-width="${TRACO}"/>` +
      `<text x="${-size / 2 + 58 * selo}" y="${-size / 2 + 78 * selo}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${58 * selo}" fill="${LINE}">${num}</text>`
  );
}

/**
 * Grava as opções de thumbnail em PNG de 1280 x 720.
 * @param {Array} opcoes [[letra, desenho()]], cada desenho numa prancheta 1920 x 1080
 * @param {object} cfg { outDir, prefixo, escolhida } — a escolhida também é
 *   gravada como <prefixo>_thumbnail.png; todas ficam na subpasta `opcoes`.
 */
async function gravar(opcoes, { outDir, prefixo, escolhida }) {
  const OPCOES = path.join(outDir, 'opcoes');
  fs.mkdirSync(OPCOES, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const [nome, fn] of opcoes) {
    kit.resetIds();
    const html = `<html><head><style>@font-face{font-family:Fredoka;src:url("file://${FONT}") format("woff2");font-weight:300 700}body{margin:0}</style></head><body><svg viewBox="0 0 1920 1080" width="1920" height="1080">${fn()}</svg></body></html>`;
    const tmp = path.join(outDir, `_thumb_${nome}.html`);
    fs.writeFileSync(tmp, html);
    await page.goto('file://' + tmp);
    await page.evaluate(() => document.fonts.ready);
    const grande = path.join(outDir, `_thumb_${nome}_1920.png`);
    await page.screenshot({ path: grande });
    fs.unlinkSync(tmp);
    const final = path.join(OPCOES, `${prefixo}_thumbnail_${nome}.png`);
    execFileSync('convert', [grande, '-filter', 'Lanczos', '-resize', '1280x720', '-strip', final]);
    fs.unlinkSync(grande);
    console.log(final, (fs.statSync(final).size / 1024).toFixed(0) + ' KB');
    if (nome === escolhida) {
      fs.copyFileSync(final, path.join(outDir, `${prefixo}_thumbnail.png`));
      console.log(`escolhida: ${path.join(outDir, `${prefixo}_thumbnail.png`)}`);
    }
  }
  await browser.close();
}

module.exports = { letreiro, ceu, chao, card, gravar, APONTA, TRACO, LINE };
