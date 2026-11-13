'use strict';
/**
 * Prévia rápida de ilustrações em grade, para conferir o desenho.
 *
 * Uso: node src/preview.js <arquivo-de-saida.png> <modulo:funcao> [...]
 * Ex.:  node src/preview.js /tmp/p.png pessoas:noe pessoas:davi
 */
const path = require('path');
const { chromium } = require('playwright');

const BG = ['#CFF1E0', '#FFD9E4', '#CFE6FF', '#FFF1B8', '#E4DAFB', '#FFE0C7'];

(async () => {
  const [out, ...items] = process.argv.slice(2);
  const cell = Number(process.env.CELL || 500);
  const cols = Number(process.env.COLS || Math.min(items.length, 3));
  const rows = Math.ceil(items.length / cols);
  const cards = items
    .map((it, i) => {
      const [mod, fn] = it.split(':');
      const art = require(path.join(__dirname, 'art', mod))[fn]();
      return `<svg viewBox="0 0 1000 1000" width="${cell}" height="${cell}" style="background:${BG[i % BG.length]}">${art}</svg>`;
    })
    .join('');
  const font = path.join(__dirname, '..', 'assets', 'fonts', 'Fredoka-latin-wght.woff2');
  const html = `<html><head><style>@font-face{font-family:Fredoka;src:url("file://${font}") format("woff2");font-weight:300 700}</style></head><body style="margin:0;display:grid;grid-template-columns:repeat(${cols},${cell}px)">${cards}</body></html>`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: cols * cell, height: rows * cell } });
  const tmp = out.replace(/\.png$/, '.html');
  require('fs').writeFileSync(tmp, html);
  await page.goto('file://' + tmp);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out });
  require('fs').unlinkSync(tmp);
  await browser.close();
  console.log('ok', out);
})();
