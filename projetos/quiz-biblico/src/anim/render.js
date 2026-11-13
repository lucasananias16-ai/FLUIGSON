'use strict';
/**
 * Renderizador quadro a quadro.
 *
 * Uma cena é { html, dur, frame(t) }: `html` é a página do palco (1920 x 1080)
 * e `frame(t)` devolve o que muda naquele instante, como uma lista de
 * { id, style?, html? }. O Chromium tira uma foto de cada quadro e o ffmpeg
 * junta tudo num MP4.
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { once } = require('events');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const TMP = path.join(ROOT, '_rascunho', 'tmp');
const FONT = path.join(ROOT, 'assets', 'fonts', 'Fredoka-latin-wght.woff2');

/** Página do palco: recebe o CSS e o conteúdo da cena. */
function stageHtml(css, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Fredoka; src: url("file://${FONT}") format("woff2"); font-weight: 300 700; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1920px; height: 1080px; overflow: hidden; background: #BDE5FF; }
  #stage { position: relative; width: 1920px; height: 1080px; overflow: hidden; font-family: Fredoka, sans-serif; color: #3D2C4E; }
  ${css}
  </style></head><body><div id="stage">${body}</div><script>
  window.__apply = function (ops) {
    for (var i = 0; i < ops.length; i++) {
      var o = ops[i], el = document.getElementById(o.id);
      if (!el) continue;
      if (o.style !== undefined) el.style.cssText = o.style;
      if (o.html !== undefined) el.innerHTML = o.html;
    }
  };
  </script></body></html>`;
}

/** Só manda para a página o que mudou desde o quadro anterior. */
function differ() {
  const last = {};
  return (ops) => {
    const out = [];
    for (const o of ops) {
      const prev = last[o.id] || (last[o.id] = {});
      const d = { id: o.id };
      let changed = false;
      for (const k of ['style', 'html']) {
        if (o[k] !== undefined && o[k] !== prev[k]) {
          d[k] = o[k];
          prev[k] = o[k];
          changed = true;
        }
      }
      if (changed) out.push(d);
    }
    return out;
  };
}

async function openStage(browser, scene, name) {
  fs.mkdirSync(TMP, { recursive: true });
  const file = path.join(TMP, `${name}.html`);
  fs.writeFileSync(file, scene.html);
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto('file://' + file);
  await page.evaluate(() => document.fonts.ready);
  return page;
}

/** Fotos de instantes escolhidos, para conferir a cena sem renderizar o vídeo. */
async function stills(scene, times, outDir, name = 'cena') {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await openStage(browser, scene, name);
  const diff = differ();
  const files = [];
  for (const t of times) {
    await page.evaluate((ops) => window.__apply(ops), diff(scene.frame(t)));
    const f = path.join(outDir, `${name}_${t.toFixed(2).padStart(6, '0')}.png`);
    await page.screenshot({ path: f });
    files.push(f);
  }
  await browser.close();
  return files;
}

/**
 * Renderiza a cena em MP4 (H.264, 1080p). `audio` é um WAV opcional já mixado.
 * `from` e `to` permitem renderizar só um trecho.
 */
async function renderVideo(scene, { out, name = 'cena', fps = 30, from = 0, to = scene.dur, audio = null, audioFilter = null, crf = 17 }) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-'];
  if (audio) args.push('-i', audio);
  args.push(
    '-vf', 'scale=in_color_matrix=bt601:in_range=full:out_color_matrix=bt709:out_range=tv,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', String(crf),
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-movflags', '+faststart'
  );
  if (audio) {
    if (audioFilter) args.push('-af', audioFilter);
    args.push('-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-shortest');
  }
  args.push(out);
  const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = once(ff, 'exit');

  const browser = await chromium.launch();
  const page = await openStage(browser, scene, name);
  const diff = differ();
  const n = Math.round((to - from) * fps);
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    const t = from + i / fps;
    await page.evaluate((ops) => window.__apply(ops), diff(scene.frame(t)));
    const jpg = await page.screenshot({ type: 'jpeg', quality: 96 });
    if (!ff.stdin.write(jpg)) await once(ff.stdin, 'drain');
  }
  ff.stdin.end();
  await browser.close();
  const [code] = await done;
  if (code !== 0) throw new Error(`ffmpeg terminou com código ${code}`);
  return { frames: n, seconds: (Date.now() - t0) / 1000 };
}

module.exports = { stageHtml, stills, renderVideo, TMP };
