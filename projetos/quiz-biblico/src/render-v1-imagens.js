'use strict';
/**
 * Vídeo 1 — gera as imagens: abertura, encerramento, as 24 opções de resposta
 * (SVG + PNG com fundo transparente) e as folhas de conferência.
 *
 * Uso: node src/render-v1-imagens.js
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const kit = require('./kit');
const perguntas = require('./v1/opcoes');
const cenario = require('./art/cenario');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'v1-arca-de-noe', 'imagens');
const FONT_FILE = path.join(ROOT, 'assets', 'fonts', 'Fredoka-latin-wght.woff2');
const FONT_B64 = fs.readFileSync(FONT_FILE).toString('base64');
const FONT_CSS = `@font-face{font-family:Fredoka;src:url(data:font/woff2;base64,${FONT_B64}) format("woff2");font-weight:300 700}`;

/** SVG avulso de uma ilustração; embute a fonte só quando há texto. */
function standalone(art, w, h) {
  const style = art.includes('<text') ? `<style>${FONT_CSS}</style>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${style}${art}</svg>`;
}

function sheetHtml(lista, titulo) {
  const rows = lista
    .map((q) => {
      const cards = q.opcoes
        .map(
          (op) => `
        <div class="op${op.certa ? ' certa' : ''}">
          <div class="card" style="background:${op.fundo}">
            <svg viewBox="0 0 1000 1000" width="372" height="372">${op.arte()}</svg>
            ${op.certa ? '<div class="selo">✓</div>' : ''}
          </div>
          <div class="rot">${op.rotulo}</div>
          <div class="arq">v1_p${q.n}_${op.id}</div>
        </div>`
        )
        .join('');
      return `
      <div class="row">
        <div class="q"><div class="num">${q.n}</div><div class="txt">${q.texto}</div></div>
        ${cards}
      </div>`;
    })
    .join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    ${FONT_CSS}
    * { box-sizing: border-box; margin: 0; }
    body { width: 1920px; background: #FFF6DC; font-family: Fredoka, sans-serif; color: #3D2C4E; padding: 44px 60px 50px; }
    h1 { font-size: 50px; font-weight: 600; }
    h1 small { display: block; font-size: 27px; font-weight: 400; opacity: .75; margin-top: 2px; }
    .row { display: flex; align-items: flex-start; gap: 44px; margin-top: 44px; }
    .q { width: 420px; padding-top: 96px; display: flex; flex-direction: column; gap: 20px; }
    .num { width: 92px; height: 92px; border-radius: 50%; background: #2E8BFF; color: #fff; border: 6px solid #3D2C4E;
           font-size: 54px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .txt { font-size: 44px; font-weight: 600; line-height: 1.12; }
    .op { width: 400px; text-align: center; }
    .card { position: relative; width: 400px; height: 400px; border-radius: 44px; border: 6px solid #3D2C4E;
            display: flex; align-items: center; justify-content: center; }
    .certa .card { border-color: #2FA765; box-shadow: 0 0 0 8px #BFEFD2; }
    .selo { position: absolute; top: -22px; right: -22px; width: 72px; height: 72px; border-radius: 50%; background: #3CC06F;
            border: 6px solid #3D2C4E; color: #fff; font-size: 44px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .rot { font-size: 36px; font-weight: 600; margin-top: 16px; }
    .certa .rot { color: #1F8A52; }
    .arq { font: 500 20px/1.2 ui-monospace, Menlo, Consolas, monospace; opacity: .6; margin-top: 2px; }
  </style></head><body>
    <h1>Vídeo 1 · Quiz da Arca de Noé<small>${titulo}</small></h1>
    ${rows}
  </body></html>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  // Opções avulsas: SVG e PNG de 1000 x 1000 com fundo transparente
  const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
  for (const q of perguntas) {
    for (const op of q.opcoes) {
      kit.resetIds();
      const svg = standalone(op.arte(), 1000, 1000);
      const base = path.join(OUT, `v1_p${q.n}_${op.id}`);
      fs.writeFileSync(`${base}.svg`, svg);
      await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `${base}.png`, omitBackground: true });
    }
  }
  await page.close();

  // Cenas em 1920 x 1080
  const cena = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const [nome, fn] of [
    ['abertura', cenario.cenaAbertura],
    ['encerramento', cenario.cenaEncerramento],
  ]) {
    kit.resetIds();
    const svg = standalone(fn(), 1920, 1080);
    fs.writeFileSync(path.join(OUT, `v1_${nome}.svg`), svg);
    await cena.setContent(`<html><body style="margin:0">${svg}</body></html>`);
    await cena.screenshot({ path: path.join(OUT, `v1_${nome}.png`) });
  }
  await cena.close();

  // Folhas de conferência
  const sheet = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const partes = [
    [perguntas.slice(0, 4), 'opções de resposta · perguntas 1 a 4', 'v1_folha_opcoes_1.png'],
    [perguntas.slice(4), 'opções de resposta · perguntas 5 a 8', 'v1_folha_opcoes_2.png'],
  ];
  for (const [lista, titulo, arquivo] of partes) {
    kit.resetIds();
    await sheet.setContent(sheetHtml(lista, titulo));
    await sheet.evaluate(() => document.fonts.ready);
    await sheet.screenshot({ path: path.join(OUT, arquivo), fullPage: true });
  }
  await browser.close();

  const files = fs.readdirSync(OUT);
  console.log(`ok: ${files.filter((f) => f.endsWith('.png')).length} PNG, ${files.filter((f) => f.endsWith('.svg')).length} SVG em ${OUT}`);
})();
