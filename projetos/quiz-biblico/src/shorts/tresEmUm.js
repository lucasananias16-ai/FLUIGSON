'use strict';
/**
 * Short nativo "3 em 1" (padrão de Shorts v2, 23/11/2026): três perguntas
 * rápidas de "de quem é a sombra?", com o placar 1/3, 2/3, 3/3, o cronômetro
 * de 3 s e o loop (o último quadro é igual ao primeiro). Feito para o formato
 * em pé: tudo o que importa fica entre 20% e 70% da altura.
 *
 * Quadro 0: a sombra 1 grande, as três opções e a Tuti com cara de dúvida.
 *
 * O painel de cada pergunta pode ser (campo `painel` da pergunta):
 *  - 'sombra' (padrão): a sombra vira o desenho colorido na resposta;
 *  - 'figura': o desenho já colorido (o tema do "o que não combina?");
 *  - 'contar': `n` cópias do desenho aparecem uma a uma ("conte rápido!");
 *  - 'texto': um texto grande (o "?" do "qual é o diferente?").
 * Cada opção pode ter `escala` (o mesmo desenho maior ou menor) ou `texto` (um número).
 */
const fs = require('fs');
const path = require('path');
const Z = require('../anim/ease');
const kit = require('../kit');
const { stageHtml } = require('../anim/render');
const { tutiFrame } = require('../anim/tutiAnim');
const { falaEnvelope } = require('../anim/fala');
const { confete } = require('../anim/fx');
const P = require('../anim/palco');

const W = 1080;
const H = 1920;
const { LINE, f } = P;
const CONT = 3;
const PAINEL = { x: 400, y: 500, w: 640, h: 500 };
const OPC = { y: 1035, size: 300, x: [45, 390, 735] };
const TUTI = { left: -50, top: 520, width: 480, height: 528 };

/**
 * @param {object} cfg
 *  - narrDir: pasta das falas; ids: { q: [3], r: [3], fim }
 *  - perguntas: [{ arte, opcoes: [{ arte, certa }], fundo }] — `arte` é o desenho da sombra
 *  - fundo: fundo em pé (src/shorts/fundos.js)
 *  - tutiOpts: acessórios da Tuti
 */
function criarTresSombras({ narrDir, ids, perguntas, fundo, tutiOpts = {} }) {
  const m = JSON.parse(fs.readFileSync(path.join(narrDir, 'narracao.json'), 'utf8')).falas;
  const dq = ids.q.map((id) => m[id].dur);
  const dr = ids.r.map((id) => m[id].dur);
  const dFim = m[ids.fim].dur;

  // ----- linha do tempo -----
  const Q = [];
  let t = 0;
  for (let k = 0; k < 3; k++) {
    const q = { ini: t, fala: t + (k === 0 ? 0.05 : 0.15) };
    q.contagem = q.fala + Math.max(dq[k] + 0.1, 0.8);
    q.revela = q.contagem + CONT;
    q.resposta = q.revela + 0.2;
    q.fim = q.resposta + dr[k] + 0.35;
    Q.push(q);
    t = q.fim;
  }
  const T = { Q, fimFala: t + 0.1 };
  T.fimFalaFim = T.fimFala + dFim;
  T.volta = T.fimFalaFim + 0.2; // a pergunta 1 volta para o loop
  const dur = T.volta + 0.5;

  // ----- sons e falas -----
  const sons = [{ t: 0, tipo: 'pouso', ganho: 0.45 }];
  Q.forEach((q, k) => {
    if (k > 0) sons.push({ t: q.ini - 0.05, tipo: 'virada', ganho: 0.45, semente: k + 3 });
    sons.push(...P.sonsContagem(q, CONT));
    sons.push({ t: q.revela + 0.05, tipo: 'acerto', ganho: 0.55 });
  });
  sons.push({ t: T.volta - 0.05, tipo: 'virada', ganho: 0.4, semente: 8 });
  const falas = [];
  const envs = [];
  Q.forEach((q, k) => {
    falas.push({ t: q.fala, id: ids.q[k] }, { t: q.resposta, id: ids.r[k] });
    envs.push({ t: q.fala, d: dq[k], env: falaEnvelope(path.join(narrDir, `${ids.q[k]}.wav`)) });
    envs.push({ t: q.resposta, d: dr[k], env: falaEnvelope(path.join(narrDir, `${ids.r[k]}.wav`)) });
  });
  falas.push({ t: T.fimFala, id: ids.fim });
  envs.push({ t: T.fimFala, d: dFim, env: falaEnvelope(path.join(narrDir, `${ids.fim}.wav`)) });
  const fala = (x) => {
    for (const e of envs) if (x >= e.t && x <= e.t + e.d) return e.env(x - e.t);
    return null;
  };

  // ----- Tuti -----
  const track = [{ t: 0, pose: 'perguntando' }];
  const pulos = [{ t: 0, n: 1, altura: 40, periodo: 0.4 }];
  Q.forEach((q, k) => {
    if (k > 0) track.push({ t: q.ini, pose: 'perguntando', dur: 0.3 });
    track.push({ t: q.contagem + 0.1, pose: P.PENSANDO, dur: 0.4 });
    track.push({ t: q.revela, pose: P.COMEMORA, dur: 0.25 });
    pulos.push({ t: q.revela + 0.05, n: 1, altura: 60, periodo: 0.42 });
  });
  track.push({ t: T.fimFala - 0.1, pose: P.COMEMORA, dur: 0.25 });
  pulos.push({ t: T.fimFala, n: 2, altura: 70, periodo: 0.42 });
  track.push({ t: T.volta - 0.35, pose: 'perguntando', dur: 0.3 }); // termina como começou: o loop emenda

  // ----- página -----
  kit.resetIds();
  const svgArte = (fn, cls = '', esc = 1) =>
    `<svg class="${cls}" viewBox="0 0 1000 1000">${esc === 1 ? kit.withOutline(6.5 / 0.5, fn) : `<g transform="translate(500,900) scale(${esc}) translate(-500,-900)">${kit.withOutline(6.5 / 0.5 / esc, fn)}</g>`}</svg>`;
  const ARRUMA = { 3: [[0.3, 0.32], [0.7, 0.32], [0.5, 0.7]], 4: [[0.3, 0.3], [0.7, 0.3], [0.3, 0.72], [0.7, 0.72]], 5: [[0.22, 0.3], [0.5, 0.3], [0.78, 0.3], [0.36, 0.72], [0.64, 0.72]] };
  const painelHtml = (p, k) => {
    const tipo = p.painel || 'sombra';
    if (tipo === 'sombra') return `<div class="sombra" id="s${k}">${svgArte(p.arte)}</div><div class="cor" id="c${k}">${svgArte(p.arte)}</div>`;
    if (tipo === 'figura') return `<div class="cor fixa" id="c${k}">${svgArte(p.arte)}</div>`;
    if (tipo === 'texto') return `<div class="texto" id="c${k}">${p.texto}</div>`;
    // contar: as cópias espalhadas pelo painel
    return ARRUMA[p.n].map(([x, y], j) => `<div class="lugarItem" style="left:${PAINEL.w * x - 105}px;top:${PAINEL.h * y - 105}px"><div class="item" id="n${k}_${j}">${svgArte(p.arte)}</div></div>`).join('');
  };
  const opcHtml = (o) => (o.texto ? `<div class="numero">${o.texto}</div>` : svgArte(o.arte, '', o.escala || 1));
  const grupos = perguntas
    .map((p, k) => {
      const cards = p.opcoes
        .map((o, i) => `<div class="lugar" style="left:${OPC.x[i]}px"><div class="opc" id="o${k}_${i}" style="background:${o.fundo || '#fff'}">${opcHtml(o)}<div class="ok" id="k${k}_${i}">${P.CHECK_SVG}</div></div></div>`)
        .join('');
      return (
        `<div class="q" id="q${k}">` +
        `<div class="painel" style="background:${p.fundo || '#E4DAFB'}">${painelHtml(p, k)}</div>` +
        cards +
        `</div>`
      );
    })
    .join('');
  const css = `
    html, body { width: ${W}px; height: ${H}px; }
    #stage { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; }
    #bg, #fx { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; }
    .q { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; transform-origin: 540px 900px; }
    .painel { position: absolute; left: ${PAINEL.x}px; top: ${PAINEL.y}px; width: ${PAINEL.w}px; height: ${PAINEL.h}px; border-radius: 56px; border: 8px solid ${LINE};
      box-shadow: 0 14px 0 rgba(61,44,78,.18); overflow: hidden; }
    .painel svg { position: absolute; left: 90px; top: 16px; width: 460px; height: 460px; }
    .sombra svg { filter: brightness(0) opacity(0.82); }
    .cor { opacity: 0; }
    .cor.fixa { opacity: 1; }
    .texto { position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
      font-size: 380px; font-weight: 700; color: #FFD23F; -webkit-text-stroke: 26px ${LINE}; paint-order: stroke fill; }
    .lugarItem { position: absolute; width: 210px; height: 210px; }
    .item { position: absolute; left: 0; top: 0; width: 210px; height: 210px; transform: scale(0); }
    .item svg { position: absolute; left: 0; top: 0; width: 210px; height: 210px; }
    .numero { position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
      font-size: 210px; font-weight: 700; color: #2E8BFF; -webkit-text-stroke: 16px ${LINE}; paint-order: stroke fill; }
    .lugar { position: absolute; top: ${OPC.y}px; width: ${OPC.size}px; height: ${OPC.size}px; }
    .opc { position: absolute; left: 0; top: 0; width: ${OPC.size}px; height: ${OPC.size}px; border-radius: 44px; border: 8px solid ${LINE};
      box-shadow: 0 12px 0 rgba(61,44,78,.18); }
    .opc svg { position: absolute; left: 14px; top: 14px; width: 256px; height: 256px; }
    .opc .ok { position: absolute; right: -22px; top: -22px; width: 76px; height: 76px; border-radius: 50%; background: #3BB273; border: 6px solid ${LINE};
      display: flex; align-items: center; justify-content: center; transform: scale(0); }
    #placar { position: absolute; left: 0; top: 400px; width: ${W}px; display: flex; justify-content: center; }
    #placar div { padding: 4px 40px 10px; background: #FFD23F; border: 8px solid ${LINE}; border-radius: 60px; font-size: 76px; font-weight: 700;
      box-shadow: 0 10px 0 rgba(61,44,78,.18); }
    #rapido { position: absolute; left: ${PAINEL.x}px; top: ${PAINEL.y + PAINEL.h - 120}px; width: ${PAINEL.w}px; text-align: center; font-size: 92px; font-weight: 700;
      color: #fff; -webkit-text-stroke: 18px ${LINE}; paint-order: stroke fill; transform: scale(0); }
    #timer { position: absolute; left: ${PAINEL.x + PAINEL.w - 200}px; top: ${PAINEL.y - 60}px; width: 240px; height: 240px; transform: scale(0); }
    #tuti { position: absolute; left: ${TUTI.left}px; top: ${TUTI.top}px; width: ${TUTI.width}px; height: ${TUTI.height}px; }
  `;
  const body =
    `<svg id="bg" viewBox="0 0 ${W} ${H}">${fundo()}</svg>` +
    grupos +
    `<div id="placar"><div id="placarTxt">1/3</div></div>` +
    `<div id="rapido">Rápido!</div>` +
    `<div id="timer"></div><div id="tuti"></div><svg id="fx" viewBox="0 0 ${W} ${H}"></svg>`;
  const html = stageHtml(P.cssBase() + css, body);
  const certa = perguntas.map((p) => p.opcoes.findIndex((o) => o.certa));

  function frame(t) {
    const ops = [];
    // qual pergunta está na tela: cada uma entra com um pulo e sai encolhendo; no fim, a 1 volta (loop)
    const atual = t >= T.volta ? 0 : Q.reduce((a, q, k) => (t >= q.ini ? k : a), 0);
    for (let k = 0; k < 3; k++) {
      const q = Q[k];
      let sc = 0;
      if (k === 0 && t < Q[1].ini) sc = 1 - Z.inBack(Z.prog(t, Q[1].ini - 0.3, 0.3)); // a 1 já está na tela no quadro 0
      else if (k === 0 && t >= T.volta - 0.35) sc = Z.outBack(Z.prog(t, T.volta - 0.35, 0.35), 1.6);
      else if (k > 0 && t >= q.ini - 0.05) {
        const fim = k < 2 ? Q[k + 1].ini : T.volta;
        sc = Z.outBack(Z.prog(t, q.ini - 0.05, 0.35), 1.6) * (1 - Z.inBack(Z.prog(t, fim - 0.3, 0.3)));
      }
      const balanco = k === atual ? 1 + 0.012 * Math.sin(t * 2 * Math.PI * 1.3) : 1;
      ops.push({ id: `q${k}`, style: `transform:scale(${f(sc * balanco)});opacity:${sc > 0.001 ? 1 : 0}` });
      // a sombra vira o bicho colorido com um "pop" na hora da resposta (no loop, a 1 volta a ser sombra)
      const revelou = t >= q.revela && !(k === 0 && t >= T.volta - 0.35);
      const kR = revelou ? Z.prog(t, q.revela, 0.25) : 0;
      const tipo = perguntas[k].painel || 'sombra';
      const pop = 1 + 0.12 * Z.bump(Z.prog(t, q.revela, 0.45)) * (revelou ? 1 : 0);
      if (tipo === 'sombra') {
        ops.push({ id: `c${k}`, style: `opacity:${f(kR)};transform:scale(${f(pop)})` });
        ops.push({ id: `s${k}`, style: `opacity:${f(1 - kR)}` });
      } else if (tipo === 'contar') {
        // as cópias aparecem uma a uma enquanto a Tuti pergunta; no fim do loop somem para entrar de novo
        const n = perguntas[k].n;
        for (let j = 0; j < n; j++) {
          const tj = q.fala + 0.25 + j * 0.32;
          const some = k === 0 && t >= T.volta - 0.35 ? 1 : 0;
          const kj = Z.outBack(Z.prog(t, tj, 0.3), 2.2) * (1 - some) + 0.1 * Z.bump(Z.prog(t, q.revela + j * 0.08, 0.3));
          ops.push({ id: `n${k}_${j}`, style: `transform:scale(${f(kj)})` });
        }
      } else {
        ops.push({ id: `c${k}`, style: `transform:scale(${f(pop)})` });
      }
      for (let i = 0; i < 3; i++) {
        const ok = i === certa[k];
        const bal = 4 * Math.sin(t * 2 * Math.PI * 1.1 + i * 2); // as opções balançam durante a contagem
        const conta = t >= q.contagem && t < q.revela ? 1 : 0;
        const sc2 = revelou ? (ok ? 1 + 0.1 * Z.outBack(Z.prog(t, q.revela, 0.4), 2) : 0.86) : 1;
        ops.push({
          id: `o${k}_${i}`,
          style: `background:${perguntas[k].opcoes[i].fundo || '#fff'};transform:rotate(${f(bal * conta)}deg) scale(${f(sc2)});opacity:${f(revelou && !ok ? 0.4 : 1)};${revelou && ok ? 'border-color:#3BB273;' : ''}`,
        });
      }
    }
    for (let k = 0; k < 3; k++) {
      for (let i = 0; i < 3; i++) {
        const kok = i === certa[k] && t >= Q[k].revela && !(k === 0 && t >= T.volta - 0.35) ? Z.outBack(Z.prog(t, Q[k].revela + 0.1, 0.35), 2) : 0;
        ops.push({ id: `k${k}_${i}`, style: `transform:scale(${f(kok)})` });
      }
    }
    // placar e "Rápido!"
    const nPlacar = t >= T.volta - 0.2 ? 1 : atual + 1;
    ops.push({ id: 'placarTxt', html: `${nPlacar}/3`, style: `transform:scale(${f(1 + 0.15 * Z.bump(Z.prog(t, atual > 0 ? Q[atual].ini : 99, 0.4)))})` });
    const q = Q[atual];
    const kRap = t < T.volta ? Z.outBack(Z.prog(t, q.contagem - 0.2, 0.3), 2.2) * (1 - Z.prog(t, q.revela - 0.25, 0.25)) : 0;
    ops.push({ id: 'rapido', style: `transform:scale(${f(kRap)}) rotate(${f(-4 + 3 * Math.sin(t * 2 * Math.PI * 2))}deg)` });
    ops.push(...P.opsTimer(t, q, CONT));
    ops.push({ id: 'tuti', html: tutiFrame(t, Object.assign({ track, fala, pulos }, tutiOpts, { width: TUTI.width, height: TUTI.height })) });
    // confete a cada acerto e na festa do fim
    let fx = '';
    for (const qq of Q) if (t >= qq.revela && t < qq.revela + 2.2) fx += confete(t - qq.revela, { pecas: 60 });
    if (t >= T.fimFala && t < T.volta - 0.3) fx += confete(t - T.fimFala);
    ops.push({ id: 'fx', html: fx });
    return ops;
  }
  return { nome: 'short', tamanho: { width: W, height: H }, dur, html, frame, sons, falas, falasExtras: [], T };
}

module.exports = { criarTresSombras };
