'use strict';
/**
 * Gera as poses da Tuti (SVG + PNG com fundo transparente) e a folha de
 * apresentação em 16:9 usada para validar o mascote.
 *
 * Uso: node src/render-tuti.js
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { tutiSvg } = require('./tuti');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'personagens', 'tuti');
const FONT = path.join(ROOT, 'assets', 'fonts', 'Fredoka-latin-wght.woff2');

const POSES = [
  { id: 'perguntando', label: 'Perguntando', bg: '#CFF1E0' },
  { id: 'comemorando', label: 'Comemorando', bg: '#FFD9E4' },
  { id: 'tchau', label: 'Dando tchau', bg: '#CFE6FF' },
];

function sheetHtml() {
  const cards = POSES.map(
    (p) => `
    <div class="card">
      <div class="disc" style="background:${p.bg}"></div>
      <div class="art">${tutiSvg(p.id, {}, { width: 600, height: 660, prefix: p.id.slice(0, 2) })}</div>
      <div class="label">${p.label}</div>
    </div>`
  ).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face { font-family: Fredoka; src: url("file://${FONT}") format("woff2"); font-weight: 300 700; }
    * { box-sizing: border-box; margin: 0; }
    body { width: 1920px; height: 1080px; background: #FFF6DC; font-family: Fredoka, sans-serif; color: #3D2C4E; overflow: hidden; }
    h1 { position: absolute; top: 40px; left: 0; right: 0; text-align: center; font-size: 60px; font-weight: 600; letter-spacing: .5px; }
    h1 small { display: block; font-size: 30px; font-weight: 400; opacity: .75; margin-top: 2px; }
    .row { position: absolute; top: 186px; left: 60px; right: 60px; display: flex; justify-content: space-between; }
    .card { position: relative; width: 580px; height: 780px; }
    .disc { position: absolute; left: 20px; top: 104px; width: 540px; height: 540px; border-radius: 50%; }
    .art { position: absolute; left: -10px; top: 10px; }
    .label { position: absolute; left: 0; right: 0; top: 690px; text-align: center; font-size: 46px; font-weight: 600; }
    .pal { position: absolute; bottom: 44px; left: 0; right: 0; display: flex; justify-content: center; gap: 18px; }
    .pal i { width: 40px; height: 40px; border-radius: 50%; border: 4px solid #3D2C4E; }
  </style></head><body>
    <h1>Tuti<small>mascote do canal · ovelhinha de lenço azul</small></h1>
    <div class="row">${cards}</div>
    <div class="pal">${['#FFFFFF', '#FFD9B8', '#FF9DB0', '#2E8BFF', '#1A6AD9', '#5E455C', '#3D2C4E'].map((c) => `<i style="background:${c}"></i>`).join('')}</div>
  </body></html>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  // Poses individuais, fundo transparente
  const page = await browser.newPage({ viewport: { width: 1000, height: 1100 }, deviceScaleFactor: 2 });
  for (const p of POSES) {
    const svg = tutiSvg(p.id);
    fs.writeFileSync(path.join(OUT, `tuti_${p.id}.svg`), svg);
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    await page.screenshot({ path: path.join(OUT, `tuti_${p.id}.png`), omitBackground: true });
  }
  await page.close();

  // Folha de apresentação
  const htmlPath = path.join(OUT, '_folha.html');
  fs.writeFileSync(htmlPath, sheetHtml());
  const sheet = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await sheet.goto('file://' + htmlPath);
  await sheet.evaluate(() => document.fonts.ready);
  await sheet.screenshot({ path: path.join(OUT, 'tuti_folha.png') });
  await sheet.close();
  fs.unlinkSync(htmlPath);

  await browser.close();
  console.log('ok', fs.readdirSync(OUT).join(' '));
})();
