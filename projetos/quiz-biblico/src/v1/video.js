'use strict';
/**
 * Vídeo 1 — monta o vídeo inteiro: abertura, as 8 perguntas e o encerramento,
 * com narração, efeitos e trilha, mais o arquivo de legendas.
 *
 * Uso: node src/v1/video.js [--refazer]
 *
 * Cada cena vira um trecho de imagem em _rascunho/video/trechos. Um trecho só
 * é renderizado de novo quando a cena muda (ou com --refazer), então ajustar
 * uma pergunta não obriga a refazer as outras.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { criarPergunta } = require('./cenaPergunta');
const { criarAbertura, criarEncerramento } = require('./cenasPontas');
const { gerarSrt } = require('./legendas');
const { renderVideo } = require('../anim/render');
const { mixar, comTrilha, ganhoParaAlvo } = require('../anim/mix');
const musica = require('../anim/musica');

const ROOT = path.resolve(__dirname, '..', '..');
const NARR = path.join(ROOT, 'v1-arca-de-noe', 'narracao');
const OUT = path.join(ROOT, '_rascunho', 'video');
const SEG = path.join(OUT, 'trechos');
const FPS = 30;
const CEU = '#BDE5FF';
const NOME = 'v1_quiz_arca_de_noe';
const SIMULTANEOS = 3;

/** As cenas em ordem, cada uma com o instante em que começa no vídeo. */
function cenas() {
  const lista = [];
  let t0 = 0;
  const add = (cena, nome) => {
    cena.nome = nome;
    cena.dur = Math.ceil(cena.dur * FPS) / FPS; // duração em quadros inteiros, para o som não escorregar
    cena.t0 = t0;
    lista.push(cena);
    t0 += cena.dur;
  };
  add(criarAbertura({ tGlobal0: 0 }), 'abertura');
  for (let n = 1; n <= 8; n++) {
    add(criarPergunta(n, { tGlobal0: t0, entrada: n === 1 ? CEU : null, saida: n === 8 ? CEU : null }), `p${n}`);
  }
  add(criarEncerramento({ tGlobal0: t0 }), 'encerramento');
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

(async () => {
  const refazer = process.argv.includes('--refazer');
  fs.mkdirSync(SEG, { recursive: true });
  const { lista, total } = cenas();
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
  const imagem = path.join(OUT, `${NOME}_imagem.mp4`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', imagem]);

  // 3. som: voz, efeitos e trilha
  const { mono, voz } = mixar(lista.map((cena) => ({ cena, t0: cena.t0 })), NARR, total);
  const st = comTrilha(mono, voz, musica.compor(total));
  const wav = path.join(OUT, `${NOME}.wav`);
  musica.writeStereo(wav, st.L, st.R);
  const g = ganhoParaAlvo(wav, -15.5);

  // 4. junta imagem e som
  const final = path.join(OUT, `${NOME}.mp4`);
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error', '-i', imagem, '-i', wav, '-c:v', 'copy',
    '-af', `volume=${g.ganho.toFixed(2)}dB,alimiter=limit=0.89:level=false`,
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-shortest', '-movflags', '+faststart', final,
  ]);

  // 5. legendas e mapa do vídeo
  const manifest = JSON.parse(fs.readFileSync(path.join(NARR, 'narracao.json'), 'utf8')).falas;
  const legDir = path.join(ROOT, 'v1-arca-de-noe', 'legendas');
  fs.mkdirSync(legDir, { recursive: true });
  fs.writeFileSync(path.join(legDir, `${NOME}.srt`), gerarSrt(lista, manifest, NARR));
  const mapa = lista.map((c) => ({ cena: c.nome, inicio: +c.t0.toFixed(3), duracao: +c.dur.toFixed(3) }));
  fs.writeFileSync(path.join(ROOT, 'v1-arca-de-noe', 'mapa-do-video.json'), JSON.stringify({ duracao: +total.toFixed(3), cenas: mapa }, null, 2) + '\n');

  const mm = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
  console.log(`\n${final}`);
  console.log(`duração ${mm(total)} (${total.toFixed(1)} s); mixagem medida em ${g.lufs} LUFS, ganho ${g.ganho.toFixed(1)} dB; tudo em ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  for (const c of mapa) console.log(`  ${mm(c.inicio).padStart(5)}  ${c.cena}`);
})().catch((e) => {
  console.error('ERRO:', e.message);
  process.exit(1);
});
