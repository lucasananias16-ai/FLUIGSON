'use strict';
/**
 * Molde dos Shorts (1080 x 1920, em pé): uma pergunta de cards de um vídeo
 * longo, com o mesmo áudio e a mesma animação, arrumada para a tela do celular.
 * No alto, o selo da série e a pergunta; no meio, os três cards; embaixo, a
 * Tuti grande e o relógio. No fim, a Tuti chama para o quiz completo.
 *
 * A cena de cards é a mesma dos vídeos (src/anim/cenaCards.js): aqui só mudam
 * o tamanho do palco, as posições e as peças a mais.
 */
const fs = require('fs');
const path = require('path');
const Z = require('../anim/ease');
const { criarCenaCards } = require('../anim/cenaCards');
const { criarMemoria } = require('./memoria');
const { tutiFrame } = require('../anim/tutiAnim');
const { falaEnvelope } = require('../anim/fala');
const { confete } = require('../anim/fx');
const P = require('../anim/palco');
const { NARR: NARR_SHORT } = require('./narracao');

const W = 1080;
const H = 1920;
const { LINE, f } = P;
const TUTI = { left: 60, top: 1010, width: 700, height: 770 };

/** Troca o palco deitado (1920 x 1080) pelo em pé, conferindo cada troca. */
function emPe(html, pecas) {
  const trocas = [
    ['html, body { width: 1920px; height: 1080px;', `html, body { width: ${W}px; height: ${H}px;`],
    ['#stage { position: relative; width: 1920px; height: 1080px;', `#stage { position: relative; width: ${W}px; height: ${H}px;`],
    ['<svg id="bg" viewBox="0 0 1920 1080">', `<svg id="bg" viewBox="0 0 ${W} ${H}">`],
    ['<svg id="fx" viewBox="0 0 1920 1080">', `<svg id="fx" viewBox="0 0 ${W} ${H}">`],
    ['<div id="fade">', `${pecas}<div id="fade">`],
  ];
  for (const [a, b] of trocas) {
    if (!html.includes(a)) throw new Error('molde do Short: não achei ' + a);
    html = html.replace(a, b);
  }
  return html;
}

/**
 * @param {object} cfg
 *  - q, num, narrDir, idPergunta, idResposta: os mesmos da cena de cards do vídeo
 *  - fundo: fundo em pé (src/shorts/fundos.js)
 *  - selo: texto do selo no alto (ex.: "QUIZ DE NATAL")
 *  - corSelo: cor do selo
 *  - tutiOpts: acessórios da Tuti (gorro...)
 *  - primeiraOpcao, contagem: como na cena do vídeo
 */
/** CSS que arruma a cena de cards (ou de memória) no palco em pé. */
const cssEmPe = (corSelo) => `
    #bg, #fx, #fade { width: ${W}px; height: ${H}px; }
    #banner { left: 40px; top: 236px; width: 1000px; height: 128px; padding-left: 96px; font-size: 64px; }
    #qnum { width: 146px; height: 146px; font-size: 86px; }
    #tuti { left: ${TUTI.left}px; top: ${TUTI.top}px; width: ${TUTI.width}px; height: ${TUTI.height}px; }
    #topo { position: absolute; left: 0; top: 70px; width: ${W}px; display: flex; justify-content: center; }
    #selo { padding: 6px 54px 12px; background: ${corSelo}; border: 8px solid ${LINE}; border-radius: 80px; box-shadow: 0 12px 0 rgba(61,44,78,.18);
      font-size: 76px; font-weight: 700; white-space: nowrap; transform: scale(0); }
    #rodape { position: absolute; left: 0; top: 1786px; width: ${W}px; text-align: center; font-size: 50px; font-weight: 700; color: #fff;
      -webkit-text-stroke: 12px ${LINE}; paint-order: stroke fill; }
    #fx2 { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; }
    #fim { position: absolute; left: 70px; top: 470px; width: 940px; padding: 50px 40px 56px; border-radius: 64px; background: #fff; border: 8px solid ${LINE};
      box-shadow: 0 16px 0 rgba(61,44,78,.16); text-align: center; font-size: 86px; line-height: 1.12; font-weight: 700; transform: scale(0); }
    #fim b { color: #2E8BFF; }
  `;

/** Posição dos cards no palco em pé: 330 px numa fileira, a 22, 375 e 728 da esquerda (a escala encolhe o card em volta do meio). */
const CARDS = { x: [-33, 320, 673], y: 450, escala: 0.75 };
const TUTI_DIM = { width: TUTI.width, height: TUTI.height };

function criarShort({ q, narrDir, idPergunta, idResposta, fundo, selo, corSelo = '#FFD23F', tutiOpts = {}, primeiraOpcao = 1, contagem = 10, extra = {}, inicioRapido = false }) {
  const base = criarCenaCards({
    inicioRapido,
    num: '?',
    q,
    narrDir,
    idPergunta,
    idResposta,
    contagem,
    primeiraOpcao,
    fundo,
    tutiOpts: Object.assign({}, tutiOpts, TUTI_DIM),
    layout: { cx: CARDS.x, cy: CARDS.y, escala: CARDS.escala, timer: { x: 890, y: 1200 } },
    extra: Object.assign({}, extra, { css: cssEmPe(corSelo) + (extra.css || '') }),
  });
  return emShort(base, { selo, tutiOpts });
}

/** Jogo da memória em pé: `d` é o desafio e `ids` as três falas ({ mostrar, pergunta, resposta }). */
function criarShortMemoria({ d, narrDir, ids, fundo, selo, corSelo = '#FFD23F', tutiOpts = {}, contagem = 10 }) {
  const base = criarMemoria({
    d,
    narrDir,
    ids,
    contagem,
    fundo,
    tutiOpts: Object.assign({}, tutiOpts, TUTI_DIM),
    layout: { sx: CARDS.x, cy: CARDS.y, escala: CARDS.escala, num: '?' },
    css: cssEmPe(corSelo) + '#timer { left: 770px; top: 1080px; }',
  });
  return emShort(base, { selo, tutiOpts });
}

/** Põe a cena no palco em pé, com o selo, o rodapé, a festa embaixo e o quadro final. */
function emShort(base, { selo, tutiOpts = {} }) {
  const fimFala = JSON.parse(fs.readFileSync(path.join(NARR_SHORT, 'narracao.json'), 'utf8')).falas.short_fim;
  const envFim = falaEnvelope(path.join(NARR_SHORT, 'short_fim.wav'));
  const T = Object.assign({}, base.T);
  T.fim = base.dur - 0.2; // o quadro final entra quando os cards já saíram
  T.falaFim = T.fim + 0.5;
  const dur = T.falaFim + fimFala.dur + 1.3;

  const pecas =
    `<div id="topo"><div id="selo">${selo}</div></div>` +
    `<div id="rodape">Quizzito · quiz completo no canal</div>` +
    `<svg id="fx2" viewBox="0 0 ${W} ${H}"></svg>` +
    `<div id="fim">Você acertou?<br><b>Tem mais no<br>quiz completo!</b></div>`;
  const html = emPe(base.html, pecas);

  // com o início rápido, o plim do selo não entra: a pergunta já começa em 0,3 s
  const sons = base.sons.concat((base.T.pergunta < 1 ? [] : [{ t: 0.15, tipo: 'plim', ganho: 0.45 }]).concat([{ t: T.fim, tipo: 'plim', ganho: 0.45 }]));
  const falas = base.falas.slice(); // o áudio do fim vem de outra pasta: ver `falasExtras`
  const falasExtras = [{ t: T.falaFim, arquivo: path.join(NARR_SHORT, 'short_fim.wav') }];

  const trackFim = [{ t: 0, pose: P.FELIZ }, { t: T.falaFim + 1.4, pose: P.ACENO, dur: 0.4 }];
  const ajusteFim = P.aceno(T.falaFim + 1.4, dur + 1);

  function frame(t) {
    const ops = base.frame(Math.min(t, base.dur - 1 / 30));
    const kS = Z.outBack(Z.prog(t, base.T.pergunta < 1 ? -0.3 : 0.1, 0.5), 2) * (1 + 0.03 * Math.sin(t * 2 * Math.PI * 0.8));
    ops.push({ id: 'selo', style: `transform:scale(${f(kS)}) rotate(${f(-2 + Math.sin((t * 2 * Math.PI) / 4))}deg)` });
    const vida = t - (T.revela + 0.95);
    const festa = vida >= 0 && t < T.saida + 0.7;
    ops.push({ id: 'fx2', html: festa ? `<g opacity="${f(1 - Z.prog(t, T.saida, 0.5))}" transform="translate(-300,820)">${confete(vida)}</g>` : '' });
    const kF = Z.outBack(Z.prog(t, T.fim, 0.5), 1.8);
    ops.push({ id: 'fim', style: `transform:scale(${f(kF)}) translate(0px,${f(-8 * Math.sin((t * 2 * Math.PI) / 2.4))}px)` });
    // depois da resposta, a faixa sobe sumindo e os cards somem (no palco em pé eles cairiam ainda à vista)
    const kSai = Z.prog(t, T.saida, 0.45);
    if (kSai > 0) {
      ops.push({ id: 'banner', style: `transform:translateY(${f(-280 * Z.inBack(kSai))}px);opacity:${f(1 - kSai)}` });
      for (let i = 0; i < 3; i++) if (Z.prog(t, T.saida + 0.05 * i, 0.55) >= 0.5) ops.push({ id: `c${i}`, style: 'display:none' });
    }
    if (t >= T.fim) {
      const fala = (x) => (x >= T.falaFim && x <= T.falaFim + fimFala.dur ? envFim(x - T.falaFim) : null);
      ops.push({ id: 'tuti', html: tutiFrame(t, Object.assign({ track: trackFim, fala, pulos: [{ t: T.fim + 0.1, n: 2, altura: 60, periodo: 0.44 }], ajuste: ajusteFim }, tutiOpts, { width: TUTI.width, height: TUTI.height })) });
    }
    return ops;
  }
  return { nome: 'short', tamanho: { width: W, height: H }, dur, html, frame, sons, falas, falasExtras, T };
}

module.exports = { criarShort, criarShortMemoria, W, H };
