'use strict';
/**
 * Monta um vídeo inteiro a partir das cenas: renderiza a imagem de cada uma,
 * emenda, mixa voz, efeitos e trilha, junta imagem e som e grava o arquivo de
 * legendas e o mapa do vídeo.
 *
 * Cada cena vira um trecho de imagem em _rascunho/video/<trechos>. Um trecho
 * só é renderizado de novo quando a cena muda (ou com --refazer), então
 * ajustar uma cena não obriga a refazer as outras.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { gerarSrt } = require('./legendas');
const { renderVideo } = require('./render');
const { mixar, comTrilha, ganhoParaAlvo } = require('./mix');
const musica = require('./musica');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, '_rascunho', 'video');
const FPS = 30;
const SIMULTANEOS = 3;

/**
 * Põe as cenas em ordem. `roteiro` é uma lista de { nome, criar(t0) }, em que
 * `criar` recebe o instante em que a cena começa no vídeo.
 */
function emOrdem(roteiro) {
  const lista = [];
  let t0 = 0;
  for (const item of roteiro) {
    const cena = item.criar(t0);
    cena.nome = item.nome;
    cena.dur = Math.ceil(cena.dur * FPS) / FPS; // duração em quadros inteiros, para o som não escorregar
    cena.t0 = t0;
    lista.push(cena);
    t0 += cena.dur;
  }
  return { lista, total: t0 };
}

/** Resumo da cena: muda sempre que a imagem dela muda. */
function digest(cena) {
  const h = crypto.createHash('sha1').update(cena.html).update(String(cena.dur));
  for (let t = 0; t < cena.dur; t += 0.25) h.update(JSON.stringify(cena.frame(t)));
  return h.digest('hex');
}

async function emParalelo(tarefas, limite) {
  let i = 0;
  await Promise.all(
    Array.from({ length: limite }, async () => {
      while (i < tarefas.length) await tarefas[i++]();
    })
  );
}

/**
 * @param {object} cfg
 *  - nome: nome dos arquivos finais (sem extensão)
 *  - pasta: pasta do vídeo dentro do projeto (narração, legendas, mapa)
 *  - roteiro: lista de { nome, criar(t0) }
 *  - trechos: subpasta de _rascunho/video para os trechos de imagem
 *  - legendas: opções passadas ao gerador de legendas
 *  - args: argumentos da linha de comando (--refazer)
 */
async function montar({ nome, pasta, roteiro, trechos = 'trechos', legendas = {}, args = [] }) {
  const NARR = path.join(ROOT, pasta, 'narracao');
  const SEG = path.join(OUT, trechos);
  const refazer = args.includes('--refazer');
  fs.mkdirSync(SEG, { recursive: true });
  const { lista, total } = emOrdem(roteiro);
  const t0 = Date.now();

  // 1. imagem de cada cena
  const tarefas = [];
  for (const cena of lista) {
    const seg = path.join(SEG, `${cena.nome}.mp4`);
    const marca = `${seg}.sha1`;
    const d = digest(cena);
    if (!refazer && fs.existsSync(seg) && fs.existsSync(marca) && fs.readFileSync(marca, 'utf8') === d) {
      console.log(`${cena.nome.padEnd(13)} sem mudanças`);
      continue;
    }
    tarefas.push(async () => {
      const r = await renderVideo(cena, { out: seg, name: cena.nome, fps: FPS });
      fs.writeFileSync(marca, d);
      console.log(`${cena.nome.padEnd(13)} ${cena.dur.toFixed(2).padStart(6)} s  ${r.frames} quadros em ${r.seconds.toFixed(0)} s`);
    });
  }
  await emParalelo(tarefas, SIMULTANEOS);

  // 2. emenda os trechos
  const lst = path.join(SEG, 'lista.txt');
  fs.writeFileSync(lst, lista.map((c) => `file '${path.join(SEG, `${c.nome}.mp4`)}'`).join('\n') + '\n');
  const imagem = path.join(OUT, `${nome}_imagem.mp4`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', imagem]);

  // 3. som: voz, efeitos e trilha
  const { mono, voz } = mixar(lista.map((cena) => ({ cena, t0: cena.t0 })), NARR, total);
  const st = comTrilha(mono, voz, musica.compor(total));
  const wav = path.join(OUT, `${nome}.wav`);
  musica.writeStereo(wav, st.L, st.R);
  const g = ganhoParaAlvo(wav, -15.5);

  // 4. junta imagem e som
  const final = path.join(OUT, `${nome}.mp4`);
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error', '-i', imagem, '-i', wav, '-c:v', 'copy',
    '-af', `volume=${g.ganho.toFixed(2)}dB,alimiter=limit=0.89:level=false`,
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-shortest', '-movflags', '+faststart', final,
  ]);

  // 5. legendas e mapa do vídeo
  const manifest = JSON.parse(fs.readFileSync(path.join(NARR, 'narracao.json'), 'utf8')).falas;
  const legDir = path.join(ROOT, pasta, 'legendas');
  fs.mkdirSync(legDir, { recursive: true });
  fs.writeFileSync(path.join(legDir, `${nome}.srt`), gerarSrt(lista, manifest, NARR, legendas));
  const mapa = lista.map((c) => ({ cena: c.nome, inicio: +c.t0.toFixed(3), duracao: +c.dur.toFixed(3) }));
  fs.writeFileSync(path.join(ROOT, pasta, 'mapa-do-video.json'), JSON.stringify({ duracao: +total.toFixed(3), cenas: mapa }, null, 2) + '\n');

  const mm = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
  console.log(`\n${final}`);
  console.log(`duração ${mm(total)} (${total.toFixed(1)} s); mixagem medida em ${g.lufs} LUFS, ganho ${g.ganho.toFixed(1)} dB; tudo em ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  for (const c of mapa) console.log(`  ${mm(c.inicio).padStart(5)}  ${c.cena}`);
  return { final, total, lista };
}

module.exports = { montar, emOrdem, digest, FPS };
