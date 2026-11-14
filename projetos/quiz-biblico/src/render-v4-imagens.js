'use strict';
/**
 * Vídeo 4 — gera as imagens: abertura, encerramento, as cenas dos desafios,
 * as opções de resposta (SVG + PNG com fundo transparente) e as folhas de
 * conferência.
 *
 * Uso: node src/render-v4-imagens.js
 */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const kit = require('./kit');
const desafios = require('./v4/desafios');
const noel = require('./art/noel');
const pasto = require('./art/pasto');
const pessoas = require('./art/pessoas');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'v4-papai-noel', 'imagens');
const FONT_FILE = path.join(ROOT, 'assets', 'fonts', 'Fredoka-latin-wght.woff2');
const FONT_B64 = fs.readFileSync(FONT_FILE).toString('base64');
const FONT_CSS = `@font-face{font-family:Fredoka;src:url(data:font/woff2;base64,${FONT_B64}) format("woff2");font-weight:300 700}`;

const TIPOS = { achar: 'Achar', contar: 'Contar', sombra: 'Sombra', comparar: 'Comparar', escolher: 'Escolher', intruso: 'Intruso', memoria: 'Memória' };

/** Cenas em 1920 x 1080: [arquivo, legenda da folha, desenho]. */
const CENAS = [
  ['v4_abertura', 'Abertura', () => noel.cenaAbertura()],
  ['v4_p1_achar', 'Desafio 1 · Achar o Papai Noel', () => noel.cenaAchar()],
  ['v4_p2_renas', 'Desafio 2 · Contar as renas', () => noel.cenaRenas()],
  ['v4_p5_comparar', 'Desafio 5 · Quem é o maior?', () => noel.cenaComparar()],
  ['v4_encerramento', 'Encerramento', () => noel.cenaEncerramento()],
];

const standalone = (art, w, h) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${art}</svg>`;

/** Painel do desafio 4: a sombra e, ao lado, o Papai Noel que aparece na resposta. */
function painelSombra() {
  return (
    `<rect width="1920" height="1080" fill="#FFF6DC"/>` +
    `<rect x="150" y="90" width="720" height="900" rx="60" fill="#E4DAFB" stroke="#3D2C4E" stroke-width="9"/>` +
    `<g transform="translate(60,90) scale(0.9)">${pasto.sombra(pessoas.papaiNoel({ shadow: false }), 'silhuetaNoel')}</g>` +
    `<path d="M900 540 L1010 540 M970 500 L1014 540 L970 580" fill="none" stroke="#3D2C4E" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<rect x="1050" y="90" width="720" height="900" rx="60" fill="#CFE6FF" stroke="#3D2C4E" stroke-width="9"/>` +
    `<g transform="translate(960,90) scale(0.9)">${pessoas.papaiNoel({ shadow: false })}</g>`
  );
}

function folhaCenas() {
  const celulas = CENAS.slice(0, 3)
    .concat([['v4_p4_sombra', 'Desafio 4 · De quem é a sombra? (a sombra e a resposta)', painelSombra]])
    .concat(CENAS.slice(3))
    .map(([, legenda, fn]) => `<div class="cel"><svg viewBox="0 0 1920 1080" width="880" height="495">${fn()}</svg><div class="leg">${legenda}</div></div>`)
    .join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    ${FONT_CSS}
    * { box-sizing: border-box; margin: 0; }
    body { width: 1920px; background: #FFF6DC; font-family: Fredoka, sans-serif; color: #3D2C4E; padding: 44px 60px 40px; }
    h1 { font-size: 50px; font-weight: 600; }
    h1 small { display: block; font-size: 27px; font-weight: 400; opacity: .75; margin-top: 2px; }
    .grade { display: grid; grid-template-columns: 880px 880px; gap: 34px 40px; margin-top: 36px; }
    .cel svg { display: block; border: 6px solid #3D2C4E; border-radius: 28px; }
    .leg { font-size: 30px; font-weight: 600; margin-top: 10px; }
  </style></head><body>
    <h1>Vídeo 4 · Quiz do Papai Noel<small>cenas da abertura, dos desafios 1, 2, 5 e do encerramento</small></h1>
    <div class="grade">${celulas}</div>
  </body></html>`;
}

function folhaOpcoes() {
  const rows = desafios
    .filter((d) => d.opcoes)
    .map((d) => {
      const cards = d.opcoes
        .map(
          (op) => `
        <div class="op${op.certa ? ' certa' : ''}">
          <div class="card" style="background:${op.fundo}">
            <svg viewBox="0 0 1000 1000" width="372" height="372">${op.arte()}</svg>
            ${op.certa ? '<div class="selo">✓</div>' : ''}
          </div>
          <div class="rot">${op.rotulo}</div>
          <div class="arq">v4_p${d.n}_${op.id}</div>
        </div>`
        )
        .join('');
      return `
      <div class="row">
        <div class="q"><div class="num">${d.n}</div><div class="tipo">${TIPOS[d.tipo]}</div><div class="txt">${d.texto}</div></div>
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
    .q { width: 420px; padding-top: 70px; display: flex; flex-direction: column; gap: 12px; }
    .num { width: 92px; height: 92px; border-radius: 50%; background: #2E8BFF; color: #fff; border: 6px solid #3D2C4E;
           font-size: 54px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .tipo { font-size: 28px; font-weight: 500; opacity: .7; text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; }
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
    <h1>Vídeo 4 · Quiz do Papai Noel<small>opções de resposta dos desafios com cards (3, 4, 6, 7 e 8)</small></h1>
    ${rows}
  </body></html>`;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  // Opções avulsas: SVG e PNG de 1000 x 1000 com fundo transparente
  const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
  for (const d of desafios) {
    for (const op of d.opcoes || []) {
      kit.resetIds();
      const svg = standalone(op.arte(), 1000, 1000);
      const base = path.join(OUT, `v4_p${d.n}_${op.id}`);
      fs.writeFileSync(`${base}.svg`, svg);
      await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
      await page.screenshot({ path: `${base}.png`, omitBackground: true });
    }
  }
  // a sombra do desafio 4, também avulsa
  kit.resetIds();
  const sombra = standalone(pasto.sombra(pessoas.papaiNoel({ shadow: false }), 'silhuetaNoel'), 1000, 1000);
  fs.writeFileSync(path.join(OUT, 'v4_p4_sombra.svg'), sombra);
  await page.setContent(`<html><body style="margin:0;background:transparent">${sombra}</body></html>`);
  await page.screenshot({ path: path.join(OUT, 'v4_p4_sombra.png'), omitBackground: true });
  await page.close();

  // Cenas em 1920 x 1080
  const cena = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const [nome, , fn] of CENAS) {
    kit.resetIds();
    const svg = standalone(fn(), 1920, 1080);
    fs.writeFileSync(path.join(OUT, `${nome}.svg`), svg);
    await cena.setContent(`<html><body style="margin:0">${svg}</body></html>`);
    await cena.screenshot({ path: path.join(OUT, `${nome}.png`) });
  }
  await cena.close();

  // Folhas de conferência
  const sheet = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  for (const [html, arquivo] of [
    [folhaCenas, 'v4_folha_cenas.png'],
    [folhaOpcoes, 'v4_folha_opcoes.png'],
  ]) {
    kit.resetIds();
    await sheet.setContent(html());
    await sheet.evaluate(() => document.fonts.ready);
    await sheet.screenshot({ path: path.join(OUT, arquivo), fullPage: true });
  }
  await browser.close();

  const files = fs.readdirSync(OUT);
  console.log(`ok: ${files.filter((f) => f.endsWith('.png')).length} PNG, ${files.filter((f) => f.endsWith('.svg')).length} SVG em ${OUT}`);
})();
