'use strict';
/**
 * Peças do padrão novo dos vídeos longos (análise do YouTube Studio de
 * 19/11/2026, `padrao-novos-videos-quizzito.md`):
 *  - comProgresso: a barra "3/12" no alto, à direita, em todas as cenas;
 *  - criarRegancho: uma cena curta entre desafios, com a Tuti no meio, uma
 *    palavra grande e confete ("Agora vem um desafio surpresa!", "Metade!"...).
 *
 * Os vídeos antigos não usam nada daqui.
 */
const fs = require('fs');
const path = require('path');
const Z = require('./ease');
const kit = require('../kit');
const { stageHtml } = require('./render');
const { tutiFrame } = require('./tutiAnim');
const { falaEnvelope } = require('./fala');
const { confete, veu } = require('./fx');
const P = require('./palco');

const { LINE, f } = P;
const TOTAL = 12;

// ------------------------------------------------------------ barra de progresso
const CSS_BARRA = `
  #prog { position: absolute; right: 24px; top: 150px; height: 70px; padding: 0 24px 0 20px; border-radius: 44px; background: #fff;
    border: 6px solid ${LINE}; box-shadow: 0 8px 0 rgba(61,44,78,.16); display: flex; align-items: center; gap: 5px; font-family: Fredoka, sans-serif; }
  #prog .num { font-size: 40px; font-weight: 700; color: ${LINE}; margin-right: 10px; white-space: nowrap; }
  #prog .num b { color: #2E8BFF; }
  #prog i { display: block; width: 15px; height: 15px; border-radius: 50%; border: 3px solid ${LINE}; background: #E4DAFB; }
  #prog i.ok { background: #FFD23F; }
  #prog i.agora { background: #2E8BFF; }
`;
/** HTML da barra quando o desafio `n` (1 a 12) está na tela. */
function barraHtml(n) {
  let pontos = '';
  for (let k = 1; k <= TOTAL; k++) pontos += `<i class="${k < n ? 'ok' : k === n ? 'agora' : ''}"${k === n ? ' id="progAgora"' : ''}></i>`;
  return `<style>${CSS_BARRA}</style><div id="prog"><span class="num"><b>${n}</b>/${TOTAL}</span>${pontos}</div>`;
}

/**
 * Põe a barra de progresso numa cena pronta (de qualquer tipo): a barra entra
 * por baixo do véu, e o ponto do desafio atual pulsa de leve.
 */
function comProgresso(cena, n) {
  const marca = '<div id="fade">';
  if (!cena.html.includes(marca)) throw new Error(`comProgresso: a cena ${cena.nome || n} não tem o véu`);
  const html = cena.html.replace(marca, barraHtml(n) + marca);
  const frame = (t) => {
    const ops = cena.frame(t);
    const k = Z.outBack(Z.prog(t, 0.15, 0.45), 2.2);
    ops.push({ id: 'progAgora', style: `transform:scale(${f(0.6 + 0.4 * k + 0.12 * Math.max(0, Math.sin(t * 2 * Math.PI * 0.9)))})` });
    return ops;
  };
  return Object.assign({}, cena, { html, frame });
}

// ------------------------------------------------------------ regancho
const CSS_REGANCHO = `
  #bg, #fx, #fade { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
  #tuti { position: absolute; left: 610px; top: 300px; width: 700px; height: 770px; }
  #palavra { position: absolute; left: 0; top: 50px; width: 1440px; text-align: center; font-family: Fredoka, sans-serif; font-weight: 700;
    font-size: 132px; line-height: 1; color: #FFD23F; -webkit-text-stroke: 24px ${LINE}; paint-order: stroke fill; transform: scale(0); }
`;

/**
 * Cena curta de regancho: a palavra grande pula na tela, a Tuti fala no meio
 * e o confete cai. `fundo()` devolve o SVG 1920 x 1080 do cenário.
 *  - narrDir, id: a fala; palavra: o texto grande; n: desafio da barra de progresso
 *  - entrada, saida: cores do véu (sem elas a cena emenda direto)
 */
function criarRegancho({ nome, narrDir, id, palavra, fundo, n, tutiOpts = {}, tGlobal0 = 0, entrada = null, saida = null }) {
  const fala0 = JSON.parse(fs.readFileSync(path.join(narrDir, 'narracao.json'), 'utf8')).falas[id];
  const env = falaEnvelope(path.join(narrDir, `${id}.wav`));
  const T = { palavra: 0.12, fala: 0.55 };
  T.fimFala = T.fala + fala0.dur;
  const dur = T.fimFala + 0.75;
  const fala = (t) => (t >= T.fala && t <= T.fimFala ? env(t - T.fala) : null);
  const track = [
    { t: 0, pose: P.COMEMORA },
    { t: T.fala + 0.2, pose: P.FELIZ, dur: 0.4 },
    { t: T.fimFala - 0.4, pose: P.COMEMORA, dur: 0.3 },
  ];
  const pulos = [{ t: 0.05, n: 2, altura: 70, periodo: 0.42 }];
  const sons = [
    { t: 0.1, tipo: 'plim', ganho: 0.5 },
    { t: T.fimFala - 0.1, tipo: 'pouso', ganho: 0.35 },
  ];
  const falas = [{ t: T.fala, id }];

  kit.resetIds();
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${fundo()}</svg>` +
    `<div id="palavra">${palavra}</div>` +
    `<div id="tuti"></div><svg id="fx" viewBox="0 0 1920 1080"></svg><div id="fade"></div>`;
  const html = stageHtml(P.cssBase() + CSS_REGANCHO, body);

  function frame(t) {
    const tG = t + tGlobal0;
    const kP = Z.outBack(Z.prog(t, T.palavra, 0.5), 2.4) * (1 - Z.inBack(Z.prog(t, dur - 0.45, 0.4)));
    const ops = [
      { id: 'palavra', style: `transform:scale(${f(kP)}) rotate(${f(-3 + 2.5 * Math.sin(t * 2 * Math.PI * 0.8))}deg)` },
      { id: 'tuti', html: tutiFrame(t, Object.assign({ track, fala, pulos, tGlobal: tG, width: 700, height: 770 }, tutiOpts)) },
      { id: 'fx', html: confete(t - 0.15) },
      { id: 'fade', style: veu(t, dur, { entrada, saida }) },
    ];
    return ops;
  }
  const cena = { nome, dur, html, frame, sons, falas, T };
  return n ? comProgresso(cena, n) : cena;
}

module.exports = { comProgresso, criarRegancho, barraHtml, TOTAL };
