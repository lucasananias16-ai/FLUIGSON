'use strict';
/**
 * Vídeo 14 — as cenas dos doze desafios do Jogo da Memória da Tuti.
 *  - memoria: a cena genérica do jogo da memória (src/shorts/memoria.js);
 *  - criarMostrar (cenas dNa): os desenhos aparecem, a Tuti pede para olhar bem
 *    e uma nuvem esconde tudo (no "o que sumiu?", eles voltam com um a menos);
 *  - criarLembrete (cenas dN): a pergunta com três cards; na faixa de cima fica
 *    o lembrete, que mostra o que era quando a resposta aparece.
 */
const fs = require('fs');
const path = require('path');
const Z = require('../anim/ease');
const kit = require('../kit');
const { stageHtml } = require('../anim/render');
const { tutiFrame } = require('../anim/tutiAnim');
const { falaEnvelope } = require('../anim/fala');
const { veu } = require('../anim/fx');
const P = require('../anim/palco');
const { criarCenaCards } = require('../anim/cenaCards');
const { criarMemoria } = require('../shorts/memoria');
const pasto = require('../art/pasto');
const jogos = require('../art/jogos');
const desafios = require('./desafios');
const roteiro = require('./roteiro');

const NARR = path.resolve(__dirname, '..', '..', 'v14-jogo-da-memoria', 'narracao');
const CONT = roteiro.contagem;
const LINE = P.LINE;
const f = P.f;
const NOTAS = [523.25, 659.25, 783.99]; // dó, mi, sol: um sininho para cada um que aparece

const manifesto = () => JSON.parse(fs.readFileSync(path.join(NARR, 'narracao.json'), 'utf8')).falas;
const desafio = (n) => desafios.find((x) => x.n === n);
const ids = (n) => ({ mostrar: `v14_p${n}_mostrar`, pergunta: `v14_p${n}_pergunta`, resposta: `v14_p${n}_resposta` });

// =====================================================================
// Jogo da memória: as cartas trocam de lugar
// =====================================================================
function criarJogoMemoria(n, opts = {}) {
  return criarMemoria(Object.assign({ d: desafio(n), narrDir: NARR, ids: ids(n), contagem: CONT, fundo: jogos.fundoNeve }, opts));
}

// =====================================================================
// Mostrar: os desenhos aparecem e somem numa nuvem
// =====================================================================
function criarMostrar(n, { tGlobal0 = 0, entrada = null, saida = null } = {}) {
  const d = desafio(n);
  const cfg = d.mostrar;
  const fm = manifesto()[ids(n).mostrar];
  const N = cfg.itens.length;
  const T = { banner: 0.1, selo: 0.35, fala: 0.9 };
  T.fimFala = T.fala + fm.dur;
  T.ap = cfg.modo === 'aparece' ? cfg.itens.map((_, i) => T.fimFala + 0.5 + 1.1 * i) : cfg.itens.map((_, i) => 0.45 + 0.12 * i);
  T.puff = cfg.modo === 'aparece' ? T.ap[N - 1] + 1.6 : Math.max(T.fimFala, T.ap[N - 1] + 0.5) + 2.2;
  T.volta = T.puff + 0.75;
  const dur = cfg.modo === 'sumiu' ? T.volta + 1.8 : T.puff + 1.3;
  T.saida = dur + 10; // a faixa da pergunta fica: a cena seguinte é a pergunta do mesmo desafio

  const sons = [{ t: T.selo, tipo: 'plim', ganho: 0.5 }];
  T.ap.forEach((t, i) => sons.push(cfg.modo === 'aparece' ? { t: t + 0.05, tipo: 'nota', freq: NOTAS[i % 3], ganho: 0.3 } : { t: t + 0.3, tipo: 'pouso', ganho: 0.3 }));
  sons.push({ t: T.puff, tipo: 'sopro', ganho: 0.5 });
  if (cfg.modo === 'sumiu') sons.push({ t: T.volta, tipo: 'virada', ganho: 0.4, semente: 3 });
  const falas = [{ t: T.fala, id: ids(n).mostrar }];

  const env = falaEnvelope(path.join(NARR, `${ids(n).mostrar}.wav`));
  const fala = (t) => (t >= T.fala && t <= T.fimFala ? env(t - T.fala) : null);
  const track = [
    { t: 0, pose: P.OLHANDO },
    { t: T.fala - 0.3, pose: P.APONTANDO, dur: 0.45 },
    { t: T.fimFala + 0.2, pose: P.OLHANDO, dur: 0.5 },
    { t: T.puff - 0.2, pose: P.PENSANDO, dur: 0.5 },
  ];

  kit.resetIds();
  const tam = (it) => 1000 * it.s;
  const itensHtml = cfg.itens
    .map((it, i) => `<svg id="m${i}" viewBox="0 0 1000 1000" style="position:absolute;left:${f(it.x - tam(it) / 2)}px;top:${f(it.y - tam(it) / 2)}px;width:${f(tam(it))}px;height:${f(tam(it))}px;transform:scale(0)">${kit.withOutline(6.5 / it.s, it.arte)}</svg>`)
    .join('');
  const nuvem = kit.withOutline(14, () => kit.cloud([[-120, 20, 90], [-40, -50, 110], [70, -30, 100], [140, 30, 80], [0, 50, 100]], { fill: '#FFFFFF', shade: '#E3DDF2' }));
  const nuvensHtml = cfg.itens
    .map((it, i) => `<svg id="n${i}" viewBox="-260 -200 520 400" style="position:absolute;left:${f(it.x - 200)}px;top:${f(it.y - 160)}px;width:400px;height:320px;transform:scale(0)">${nuvem}</svg>`)
    .join('');
  let vazio = '';
  if (cfg.modo === 'sumiu') {
    const it = cfg.itens[cfg.falta];
    vazio = `<div id="vazio" style="position:absolute;left:${f(it.x - 100)}px;top:${f(it.y - 100)}px;width:200px;height:200px;border-radius:40px;background:#FFF1B8;border:7px dashed ${LINE};font-size:130px;font-weight:700;display:flex;align-items:center;justify-content:center;transform:scale(0)">?</div>`;
  }
  const css = P.cssBase();
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${jogos.fundoNeve()}</svg>` +
    P.bannerHtml(d.n, d.texto) +
    vazio +
    itensHtml +
    nuvensHtml +
    `<div id="timer"></div><div id="tuti"></div><svg id="fx" viewBox="0 0 1920 1080"></svg><div id="fade"></div>`;
  const html = stageHtml(css, body);

  function frame(t) {
    const tG = t + tGlobal0;
    const ops = P.opsBanner(t, T);
    cfg.itens.forEach((it, i) => {
      const kIn = Z.outBack(Z.prog(t, T.ap[i], 0.4), 1.8);
      const some = Z.prog(t, T.puff + 0.18, 0.12);
      let sc = kIn * (1 - some);
      if (cfg.modo === 'sumiu' && i !== cfg.falta) sc += some * Z.outBack(Z.prog(t, T.volta + 0.06 * i, 0.4), 1.8);
      const bob = 6 * Math.sin((tG * 2 * Math.PI) / 2.4 + i * 1.3);
      ops.push({ id: `m${i}`, style: `position:absolute;left:${f(it.x - tam(it) / 2)}px;top:${f(it.y - tam(it) / 2)}px;width:${f(tam(it))}px;height:${f(tam(it))}px;transform:translate(0px,${f(bob)}px) scale(${f(sc)})` });
      const kN = Z.prog(t, T.puff + 0.03 * i, 0.75);
      ops.push({ id: `n${i}`, style: `position:absolute;left:${f(it.x - 200)}px;top:${f(it.y - 160)}px;width:400px;height:320px;opacity:${f(1 - Z.prog(kN, 0.6, 0.4))};transform:scale(${f(1.15 * Z.outCubic(Math.min(1, kN * 2)))})` });
    });
    if (cfg.modo === 'sumiu') {
      const k = Z.outBack(Z.prog(t, T.volta + 0.25, 0.4), 2);
      ops.push({ id: 'vazio', style: `transform:scale(${f(k * (1 + 0.04 * Math.sin(t * 2 * Math.PI * 1.2)))})` });
    }
    ops.push({ id: 'timer', style: 'transform:scale(0)' });
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, tGlobal: tG }) });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { num: n, dur, html, frame, sons, falas, T };
}

// =====================================================================
// Pergunta com lembrete: três cards e a faixa de cima
// =====================================================================
function criarLembrete(n, opts = {}) {
  const d = desafio(n);
  const lem = d.lembrete;
  kit.resetIds();
  const M = Math.max(lem.antes.length, lem.depois.length);
  const PASSO = 160;
  const LARG = M * PASSO + 40;
  const X0 = 960 - LARG / 2;
  const pos = (i, m) => 960 - (m * PASSO) / 2 + i * PASSO + 14; // canto de cada desenho, centrado na faixa
  const desenho = (fn, x) => `<g transform="translate(${f(x)},196) scale(0.13)">${kit.withOutline(6.5 / 0.13, fn)}</g>`;
  const caixa = (x) =>
    `<rect x="${f(x)}" y="200" width="122" height="122" rx="28" fill="#FFF1B8" stroke="${LINE}" stroke-width="6" stroke-dasharray="16 12"/>` +
    `<text x="${f(x + 61)}" y="296" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="100" fill="${LINE}">?</text>`;
  const antes = lem.antes
    .map((e, i) => {
      const x = pos(i, lem.antes.length);
      if (e.vazio) return caixa(x);
      if (e.cinza) return `<g transform="translate(${f(x)},196) scale(0.13)">${pasto.sombra(kit.withOutline(6.5 / 0.13, e.cinza), `cinza${n}`)}</g>`;
      return desenho(e.arte, x);
    })
    .join('');
  const depois = lem.depois
    .map((e, i) => {
      const x = pos(i, lem.depois.length);
      const num = e.num
        ? `<circle cx="${f(x + 14)}" cy="208" r="26" fill="#2E8BFF" stroke="${LINE}" stroke-width="5"/><text x="${f(x + 14)}" y="222" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="38" fill="#fff">${e.num}</text>`
        : '';
      return desenho(e.arte, x) + num;
    })
    .join('');
  const fita =
    `<svg id="fila" viewBox="0 0 1920 1080" style="position:absolute;left:0;top:0;width:1920px;height:1080px">` +
    `<rect x="${f(X0)}" y="186" width="${f(LARG)}" height="150" rx="40" fill="#fff" stroke="${LINE}" stroke-width="7"/>` +
    `<g id="fitaA">${antes}</g><g id="fitaD" style="opacity:0">${depois}</g></svg>`;
  const extra = {
    antes: fita,
    sons: (T) => [{ t: T.revela + 0.9, tipo: 'plim', ganho: 0.35 }],
    ops: (t, T) => {
      const kIn = Z.outBack(Z.prog(t, 0.3, 0.5), 1.4);
      const k = Z.prog(t, T.revela + 0.9, 0.5);
      return [
        { id: 'fila', style: `position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:960px 260px;transform:scale(${f(kIn * (1 - Z.prog(t, T.saida, 0.4)))})` },
        { id: 'fitaA', style: `opacity:${f(1 - k)}` },
        { id: 'fitaD', style: `opacity:${f(k)}` },
      ];
    },
  };
  return criarCenaCards(
    Object.assign(
      {
        num: n,
        q: d,
        narrDir: NARR,
        idPergunta: ids(n).pergunta,
        idResposta: ids(n).resposta,
        contagem: CONT,
        primeiraOpcao: d.primeiraOpcao || 1,
        layout: { cx: [470, 920, 1370], cy: 350, escala: 0.8, timer: { x: 1160, y: 930 } },
        fundo: jogos.fundoNeve,
        extra,
      },
      opts
    )
  );
}

module.exports = { criarJogoMemoria, criarMostrar, criarLembrete };
