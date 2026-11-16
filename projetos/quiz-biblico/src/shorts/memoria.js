'use strict';
/**
 * Jogo da memória genérico: três cards aparecem, a Tuti mostra onde está o
 * certo, eles viram de costas, trocam de lugar e a criança diz o número. É a
 * mesma cena dos vídeos (cada vídeo tem a sua cópia em src/vN/cenas.js), com
 * as falas, o fundo e as posições como parâmetros, para os Shorts.
 *
 *  - d: o desafio ({ n, texto, opcoes, trocas }), como em src/vN/desafios.js
 *  - narrDir, ids: pasta da narração e { mostrar, pergunta, resposta }
 *  - layout: { sx, cy, escala, num } para mudar o lugar e o tamanho dos cards
 *  - css: CSS a mais, depois do padrão
 */
const fs = require('fs');
const path = require('path');
const Z = require('../anim/ease');
const kit = require('../kit');
const { stageHtml } = require('../anim/render');
const { tutiFrame } = require('../anim/tutiAnim');
const { falaEnvelope } = require('../anim/fala');
const { confete, veu } = require('../anim/fx');
const P = require('../anim/palco');

const f = P.f;

function criarMemoria({ d, narrDir, ids, contagem = 10, fundo, tutiOpts = {}, layout = {}, css: cssExtra = '', tGlobal0 = 0, entrada = null, saida = null }) {
  const NARR = narrDir;
  const CONT = contagem;
  const m = JSON.parse(fs.readFileSync(path.join(NARR, 'narracao.json'), 'utf8')).falas;
  const wav = (id) => path.join(NARR, `${id}.wav`);
  const vozes = (itens) => {
    const envs = itens.map((x) => Object.assign({ env: falaEnvelope(wav(x.id)) }, x));
    return (t) => {
      for (const e of envs) if (t >= e.t && t <= e.t + e.dur) return e.env(t - e.t);
      return null;
    };
  };
  const fm = m[ids.mostrar];
  const fq = m[ids.pergunta]; // partes: aviso, pergunta, "no um", "no dois", "no três"
  const fr = m[ids.resposta];
  const ESC = layout.escala || 1;
  const CARD = P.CARD;
  const SX = layout.sx || [432, 920, 1408];
  const CY = layout.cy === undefined ? 232 : layout.cy;
  const certa = d.opcoes.findIndex((o) => o.certa);

  const T = { banner: 0.1, selo: 0.35, cards: [0.45, 0.58, 0.71], mostrar: 1.45 };
  T.fimMostrar = T.mostrar + fm.dur;
  T.vira = T.fimMostrar + 0.5; // os três viram de costas
  T.troca = T.vira + 0.95;

  // trocas de lugar: quem vai para a direita passa por cima, quem vai para a esquerda, por baixo
  const slot = [0, 1, 2]; // slot[i] = posição do card i
  const movs = [];
  let tt = T.troca;
  for (const [a, b] of d.trocas) {
    const ca = slot.indexOf(a);
    const cb = slot.indexOf(b);
    const dura = 1.05 + 0.3 * Math.abs(a - b);
    movs.push({ t0: tt, dura, card: ca, de: a, para: b, arco: a < b ? -1 : 1 });
    movs.push({ t0: tt, dura, card: cb, de: b, para: a, arco: b < a ? -1 : 1 });
    slot[ca] = b;
    slot[cb] = a;
    tt += dura + 0.35;
  }
  T.fimTrocas = tt;
  T.numeros = T.fimTrocas - 0.25; // os números 1, 2, 3 aparecem no verso assim que as cartas param
  T.pergunta = T.numeros + 0.6; // e só depois a Tuti fala, para o plim não cobrir a voz
  T.falados = [2, 3, 4].map((k) => T.pergunta + fq.partes[k].ini);
  T.fimPergunta = T.pergunta + fq.dur;
  T.contagem = T.fimPergunta + 0.6;
  T.revela = T.contagem + CONT + 0.1;
  T.resposta = T.revela + 1.7;
  T.fimResposta = T.resposta + fr.dur;
  T.saida = T.fimResposta + 0.9;
  const dur = T.saida + 0.75;
  const centroCerto = { x: SX[slot[certa]] + CARD / 2, y: CY + CARD / 2 };

  const sons = [{ t: T.selo, tipo: 'plim', ganho: 0.5 }];
  T.cards.forEach((t) => sons.push({ t: t + 0.36, tipo: 'pouso', ganho: 0.45 }));
  [0, 1, 2].forEach((i) => sons.push({ t: T.vira + 0.1 * i + 0.05, tipo: 'virada', ganho: 0.5, semente: i + 1 }));
  for (let k = 0; k < movs.length; k += 2) sons.push({ t: movs[k].t0, tipo: 'sopro', ganho: 0.32 });
  sons.push({ t: T.numeros, tipo: 'plim', ganho: 0.4 });
  sons.push(...P.sonsContagem(T, CONT));
  sons.push({ t: T.revela + 0.15, tipo: 'virada', ganho: 0.5, semente: 5 });
  sons.push({ t: T.revela + 0.95, tipo: 'acerto', ganho: 0.6 });
  sons.push({ t: T.revela + 1.35, tipo: 'virada', ganho: 0.4, semente: 6 });
  sons.push({ t: T.saida, tipo: 'sopro', ganho: 0.4 });
  const itens = [
    { t: T.mostrar, id: ids.mostrar, dur: fm.dur },
    { t: T.pergunta, id: ids.pergunta, dur: fq.dur },
    { t: T.resposta, id: ids.resposta, dur: fr.dur },
  ];
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens);

  const track = P.pensando(
    [
      { t: 0, pose: P.OLHANDO },
      { t: T.mostrar - 0.3, pose: P.APONTANDO, dur: 0.45 },
      { t: T.vira - 0.1, pose: P.OLHANDO, dur: 0.5 },
      { t: T.pergunta + fq.partes[1].ini - 0.3, pose: 'perguntando', dur: 0.45 },
      { t: T.falados[0] - 0.3, pose: P.APONTANDO, dur: 0.45 },
      { t: T.fimPergunta + 0.15, pose: P.PENSANDO, dur: 0.5 },
    ],
    T
  );
  track.push({ t: T.revela + 0.85, pose: P.COMEMORA, dur: 0.28 });
  track.push({ t: T.resposta + 1.2, pose: P.FELIZ, dur: 0.6 });
  track.push({ t: T.saida, pose: P.OLHANDO, dur: 0.5 });
  const pulos = [{ t: T.revela + 0.95, n: 2, altura: 74, periodo: 0.44 }];

  kit.resetIds();
  const cardsHtml = d.opcoes
    .map(
      (op, i) =>
        `<div class="card" id="c${i}" style="left:${SX[i]}px;top:${CY}px;opacity:0">` +
        `<div class="cshadow" id="c${i}s"></div>` +
        `<div class="inner" id="c${i}i">` +
        `<div class="face front" id="c${i}f" style="background:${op.fundo}"><svg class="art" viewBox="0 0 1000 1000">${op.arte()}</svg></div>` +
        `<div class="face back">${P.verso('?')}<div class="vnum" id="c${i}n">${P.verso(String(slot[i] + 1))}</div></div>` +
        `</div>` +
        (op.certa ? `<div class="check" id="check">${P.CHECK_SVG}</div>` : '') +
        `</div>`
    )
    .join('');
  const css =
    P.cssBase() +
    P.cssCards() +
    `
    #burst { position: absolute; left: ${centroCerto.x - 520}px; top: ${centroCerto.y - 520}px; width: 1040px; height: 1040px; opacity: 0; }
    .vnum { position: absolute; left: 0; top: 0; width: 100%; height: 100%; opacity: 0; }
  ` + cssExtra;
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${fundo()}</svg>` +
    `<div id="burst">${P.raios()}</div>` +
    P.bannerHtml(layout.num === undefined ? d.n : layout.num, d.texto) +
    cardsHtml +
    `<div id="timer"></div><div id="tuti"></div><svg id="fx" viewBox="0 0 1920 1080"></svg><div id="fade"></div>`;
  const html = stageHtml(css, body);

  function frame(t) {
    const tG = t + tGlobal0;
    const ops = P.opsBanner(t, T);

    for (let i = 0; i < 3; i++) {
      const ok = i === certa;
      const kIn = Z.prog(t, T.cards[i], 0.55);
      let x = SX[i];
      let dy = -780 * (1 - Z.outBack(kIn, 1.0));
      const rotZ = (i - 1) * -8 * (1 - Z.outCubic(kIn));
      let sc = 1;
      let op = kIn > 0 ? 1 : 0;
      let z = 2;

      // "olhe bem onde o presente está": o card do presente pulsa
      let destaque = 0;
      if (ok) {
        destaque = Z.prog(t, T.mostrar + 1.3, 0.3) * (1 - Z.prog(t, T.vira - 0.25, 0.25));
        sc += 0.05 * destaque * (0.6 + 0.4 * Math.sin((t - T.mostrar) * 2 * Math.PI * 1.4));
      }

      // vira de costas
      let ang = 180 * Z.inOutCubic(Z.prog(t, T.vira + 0.1 * i, 0.55));
      dy -= 26 * Z.bump(Z.prog(t, T.vira + 0.1 * i, 0.55));

      // troca de lugar
      for (const mv of movs) {
        if (mv.card !== i || t < mv.t0) continue;
        const k = Z.prog(t, mv.t0, mv.dura);
        x = Z.lerp(SX[mv.de], SX[mv.para], Z.inOutCubic(k));
        dy += mv.arco * 78 * Math.sin(Math.PI * k);
        sc += (mv.arco < 0 ? 0.05 : -0.05) * Math.sin(Math.PI * k);
        if (k < 1) z = mv.arco < 0 ? 4 : 1;
      }

      // pula quando a Tuti fala o número do lugar dele
      const kN = Z.bump(Z.prog(t, T.falados[slot[i]], 0.5));
      dy -= 28 * kN;
      sc += 0.05 * kN;

      // flutua de leve durante a contagem
      const calm = Z.prog(t, T.fimPergunta, 0.9) * (1 - Z.prog(t, T.revela - 0.4, 0.4));
      dy += 5 * calm * Math.sin((tG * 2 * Math.PI) / 2.8 + i * 2.1);

      if (ok) {
        // o certo vira para a frente girando, cresce e brilha
        ang -= 540 * Z.inOutCubic(Z.prog(t, T.revela + 0.1, 0.95));
        const kG = Z.prog(t, T.revela + 0.8, 0.6);
        sc += 0.15 * Z.outBack(kG, 2.2);
        dy -= 10 * Z.outCubic(kG);
        if (kG >= 1) sc += 0.012 * Math.sin(((t - T.revela) * 2 * Math.PI) / 1.3);
        if (t >= T.revela) z = 6;
        const kGlow = Z.outCubic(Z.prog(t, T.revela + 1.0, 0.4));
        let borda = '';
        if (kGlow > 0) borda = `;border-color:#2FA765;box-shadow:0 0 0 ${f(14 * kGlow)}px rgba(60,192,111,.38)`;
        else if (destaque > 0) borda = `;box-shadow:0 0 0 ${f(16 * destaque)}px rgba(255,210,63,.75)`;
        ops.push({ id: `c${i}f`, style: `background:${d.opcoes[i].fundo}${borda}` });
        ops.push({ id: 'check', style: `transform:scale(${f(Z.outBack(Z.prog(t, T.revela + 1.35, 0.4), 2.4))})` });
      } else {
        // depois do certo, os outros também viram, para a criança ver o que eram
        ang -= 180 * Z.inOutCubic(Z.prog(t, T.revela + 1.3 + 0.15 * i, 0.55));
        const kD = Z.outCubic(Z.prog(t, T.revela + 1.9, 0.5));
        sc -= 0.09 * kD;
        op = Math.min(op, 1 - 0.38 * kD);
      }

      dy += 1000 * Z.inCubic(Z.prog(t, T.saida + 0.05 * i, 0.55));
      const cos = Math.abs(Math.cos((ang * Math.PI) / 180));
      ops.push({ id: `c${i}`, style: `left:${f(x)}px;top:${CY}px;transform:translate(0px,${f(dy)}px) scale(${f(sc * ESC)}) rotate(${f(rotZ)}deg);opacity:${f(op)};z-index:${z}` });
      ops.push({ id: `c${i}i`, style: `transform:rotateY(${f(ang)}deg)` });
      ops.push({ id: `c${i}s`, style: `transform:translate(0px,16px) scaleX(${f(Math.max(0.03, cos))})` });
      ops.push({ id: `c${i}n`, style: `opacity:${f(Z.prog(t, T.numeros + 0.08 * slot[i], 0.3))}` });
    }

    const kB = Z.outCubic(Z.prog(t, T.revela + 0.95, 0.5)) * (1 - Z.prog(t, T.saida, 0.4));
    ops.push({ id: 'burst', style: `opacity:${f(0.95 * kB)};transform:rotate(${f((t - T.revela) * 14)}deg) scale(${f((0.6 + 0.4 * kB) * ESC)})` });
    ops.push(...P.opsTimer(t, T, CONT));
    ops.push({ id: 'tuti', html: tutiFrame(t, Object.assign({ track, fala, pulos, tGlobal: tG }, tutiOpts)) });
    const vida = t - (T.revela + 0.95);
    ops.push({
      id: 'fx',
      html: vida >= 0 && t < T.saida + 0.7 ? `<g opacity="${f(1 - Z.prog(t, T.saida, 0.5))}">${confete(vida)}${P.brilhos(t, T.revela, centroCerto.x, centroCerto.y)}</g>` : '',
    });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { num: 7, dur, html, frame, sons, falas, T };
}

module.exports = { criarMemoria };
