'use strict';
/**
 * Vídeo 1 — as duas pontas do vídeo: a abertura (a arca no campo, a Tuti se
 * apresenta) e o encerramento (arco-íris, Noé, a família, os animais e a
 * Tuti dando tchau). Os gestos da Tuti seguem as frases da narração.
 */
const fs = require('fs');
const path = require('path');
const Z = require('../anim/ease');
const kit = require('../kit');
const { stageHtml } = require('../anim/render');
const { tutiFrame } = require('../anim/tutiAnim');
const { falaEnvelope, temposDasFrases, emFrases } = require('../anim/fala');
const { confete, veu } = require('../anim/fx');
const cenario = require('../art/cenario');
const roteiro = require('./roteiro');

const ROOT = path.resolve(__dirname, '..', '..');
const NARR = path.join(ROOT, 'v1-arca-de-noe', 'narracao');
const LINE = '#3D2C4E';
const CEU = '#BDE5FF';
const f = (v) => Math.round(v * 1000) / 1000;

const { FRENTE, ACENO, FELIZ, APONTANDO_CENA: APONTANDO, PREPARADO, COMEMORA, aceno } = require('../anim/palco');

const falaDe = (id) => JSON.parse(fs.readFileSync(path.join(NARR, 'narracao.json'), 'utf8')).falas[id];
const nuvens = (t, tG) => [
  { id: 'nv1', style: `transform:translate(${f(16 * Math.sin((tG * 2 * Math.PI) / 11) + 3 * t)}px,0px)` },
  { id: 'nv2', style: `transform:translate(${f(-12 * Math.sin((tG * 2 * Math.PI) / 13) - 2.5 * t)}px,0px)` },
];

/** Abertura: a Tuti chega, se apresenta e chama para o quiz. */
function criarAbertura({ tGlobal0 = 0, entrada = '#fff', saida = CEU } = {}) {
  const fa = falaDe('v1_abertura');
  const arq = path.join(NARR, 'v1_abertura.wav');
  const T = { tuti: 0.15, titulo: 0.45, fala: 1.35 };
  T.fimFala = T.fala + fa.dur;
  const dur = T.fimFala + 1.1;
  // frases: oi amiguinho | eu sou a Tuti | hoje vamos brincar... | eu pergunto... | preparado | vamos lá
  const F = temposDasFrases(arq, emFrases(roteiro.abertura)).map((x) => ({ ini: T.fala + x.ini, fim: T.fala + x.fim }));

  const env = falaEnvelope(arq);
  const fala = (t) => (t >= T.fala && t <= T.fimFala ? env(t - T.fala) : null);
  const track = [
    { t: 0, pose: FRENTE },
    { t: F[0].ini - 0.3, pose: ACENO, dur: 0.4 },
    { t: F[1].ini - 0.1, pose: FELIZ, dur: 0.45 },
    { t: F[2].ini + 0.5, pose: APONTANDO, dur: 0.5 },
    { t: F[3].ini - 0.1, pose: 'perguntando', dur: 0.45 },
    { t: (F[3].ini + F[3].fim) / 2, pose: FELIZ, dur: 0.45 },
    { t: F[4].ini - 0.1, pose: PREPARADO, dur: 0.4 },
    { t: F[5].ini - 0.05, pose: COMEMORA, dur: 0.28 },
  ];
  const pulos = [
    { t: T.tuti + 0.05, n: 2, altura: 54, periodo: 0.4 },
    { t: F[5].ini + 0.05, n: 2, altura: 76, periodo: 0.44 },
  ];
  const ajuste = aceno(F[0].ini - 0.3, F[1].ini - 0.1);

  const sons = [
    { t: T.titulo, tipo: 'plim', ganho: 0.5 },
    { t: T.tuti + 0.44, tipo: 'pouso', ganho: 0.3 },
    { t: T.tuti + 0.84, tipo: 'pouso', ganho: 0.3 },
    { t: dur - 0.5, tipo: 'sopro', ganho: 0.35 },
  ];
  const falas = [{ t: T.fala, id: 'v1_abertura' }];

  kit.resetIds();
  const css = `
    #bg, #fade { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    #fade { background: #fff; opacity: 1; }
    #faixa { position: absolute; left: 0; top: 34px; width: 1920px; display: flex; justify-content: center; }
    #titulo { padding: 10px 70px 14px; background: #FFD23F; border: 8px solid ${LINE}; border-radius: 90px; box-shadow: 0 14px 0 rgba(61,44,78,.18);
      font-size: 98px; font-weight: 700; white-space: nowrap; transform: scale(0); }
    #tuti { position: absolute; left: 110px; top: 322px; width: 680px; height: 748px; }
  `;
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${cenario.cenaAbertura({ comTuti: false })}</svg>` +
    `<div id="faixa"><div id="titulo">Quiz da Arca de Noé</div></div>` +
    `<div id="tuti"></div><div id="fade"></div>`;
  const html = stageHtml(css, body);

  function frame(t) {
    const tG = t + tGlobal0;
    const ops = nuvens(t, tG);
    ops.push({ id: 'sol', style: `transform-origin:250px 180px;transform:scale(${f(1 + 0.025 * Math.sin((tG * 2 * Math.PI) / 3.2))})` });
    const kT = Z.outBack(Z.prog(t, T.titulo, 0.55), 2);
    ops.push({ id: 'titulo', style: `transform:scale(${f(kT)}) rotate(${f(-2 + 1.2 * Math.sin((tG * 2 * Math.PI) / 4.5))}deg)` });
    const kIn = Z.outCubic(Z.prog(t, T.tuti, 0.85));
    ops.push({ id: 'tuti', style: `transform:translate(${f(-760 * (1 - kIn))}px,0px)`, html: tutiFrame(t, { track, fala, pulos, ajuste, tGlobal: tG, width: 680, height: 748 }) });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { nome: 'abertura', dur, html, frame, sons, falas, T };
}

/** Encerramento: festa em terra firme e a Tuti se despede acenando. */
function criarEncerramento({ tGlobal0 = 0, entrada = CEU, saida = '#fff' } = {}) {
  const fa = falaDe('v1_encerramento');
  const arq = path.join(NARR, 'v1_encerramento.wav');
  const T = { fala: 1.0 };
  T.fimFala = T.fala + fa.dur;
  const dur = T.fimFala + 2.6;
  // frases: você foi demais | Deus cuidou de Noé... | e Ele cuida de você também | tchau, amiguinho...
  const F = temposDasFrases(arq, emFrases(roteiro.encerramento)).map((x) => ({ ini: T.fala + x.ini, fim: T.fala + x.fim }));

  const env = falaEnvelope(arq);
  const fala = (t) => (t >= T.fala && t <= T.fimFala ? env(t - T.fala) : null);
  const track = [
    { t: 0, pose: COMEMORA },
    { t: F[1].ini - 0.1, pose: APONTANDO, dur: 0.45 },
    { t: F[2].ini - 0.1, pose: FELIZ, dur: 0.45 },
    { t: F[3].ini - 0.2, pose: ACENO, dur: 0.4 },
  ];
  const pulos = [{ t: 0.45, n: 3, altura: 64, periodo: 0.44 }];
  const ajuste = aceno(F[3].ini - 0.2, dur + 1);

  const sons = [{ t: 0.4, tipo: 'acerto', ganho: 0.5 }];
  const falas = [{ t: T.fala, id: 'v1_encerramento' }];

  kit.resetIds();
  const css = `
    #bg, #fx, #fade { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    #fade { background: ${CEU}; opacity: 1; }
    #tuti { position: absolute; left: -52px; top: 424px; width: 600px; height: 660px; }
  `;
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${cenario.cenaEncerramento({ comTuti: false })}</svg>` +
    `<div id="tuti"></div><svg id="fx" viewBox="0 0 1920 1080"></svg><div id="fade"></div>`;
  const html = stageHtml(css, body);

  // todo mundo comemora com pulinhos, cada um no seu tempo
  const pulinho = (t, fase, altura, periodo) => -altura * Math.pow(Math.max(0, Math.sin((t / periodo + fase) * 2 * Math.PI)), 1.5);
  const turma = [
    ['g1', 0.0, 13, 0.92],
    ['g2', 0.3, 10, 1.0],
    ['g3', 0.55, 13, 0.88],
    ['g4', 0.8, 10, 0.96],
    ['b1', 0.2, 6, 1.5],
    ['b2', 0.6, 5, 1.3],
    ['b3', 0.1, 5, 1.2],
    ['b4', 0.45, 7, 1.05],
  ];

  function frame(t) {
    const tG = t + tGlobal0;
    const ops = nuvens(t, tG);
    ops.push({ id: 'sol', style: `transform-origin:210px 150px;transform:scale(${f(1 + 0.025 * Math.sin((tG * 2 * Math.PI) / 3.2))})` });
    ops.push({ id: 'arco', style: `opacity:${f(Z.inOutCubic(Z.prog(t, 0.2, 1.4)))}` });
    ops.push({ id: 'pomba', style: `transform:translate(${f(26 * Math.sin((tG * 2 * Math.PI) / 7))}px,${f(9 * Math.sin((tG * 2 * Math.PI) / 2.1))}px)` });
    for (const [id, fase, altura, periodo] of turma) ops.push({ id, style: `transform:translate(0px,${f(pulinho(t, fase, altura, periodo))}px)` });
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, ajuste, tGlobal: tG, width: 600, height: 660 }) });
    const vida = t - 0.5;
    ops.push({ id: 'fx', html: vida > 0 && vida < 6 ? confete(vida) : '' });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida, tOut: 0.9 }) });
    return ops;
  }
  return { nome: 'encerramento', dur, html, frame, sons, falas, T };
}

module.exports = { criarAbertura, criarEncerramento };
