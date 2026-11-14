'use strict';
/**
 * Vídeo 5 — as cenas da Festa dos Animais: abertura, as visitas (a Tuti e as
 * caixas surpresa), o jogo "A Tuti diz", os jogos com cards, o esconde-esconde,
 * a contagem de elefantes, a memória e a dança final.
 *
 * Todos os tempos saem da narração (narracao.json), inclusive o instante em que
 * cada palavra em inglês é dita (`segmentos`), para a palavra aparecer escrita
 * na tela junto com a voz.
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
const { criarCenaCards } = require('../anim/cenaCards');
const { fundoQuiz } = require('../art/cenario');
const festa = require('../art/festa');
const animais = require('../art/animais');
const desafios = require('./desafios');
const roteiro = require('./roteiro');

const NARR = path.resolve(__dirname, '..', '..', 'v5-ingles-animais', 'narracao');
const CONT = roteiro.contagem;
const SUA_VEZ = roteiro.pausaSuaVez;
const LINE = P.LINE;
const f = P.f;
const { POSES } = require('../tuti');

const manifesto = () => JSON.parse(fs.readFileSync(path.join(NARR, 'narracao.json'), 'utf8')).falas;
const wav = (id) => path.join(NARR, `${id}.wav`);
const desafio = (n) => desafios.find((x) => x.n === n);

/** Volume da voz da Tuti no instante `t`, para a boca dela. `itens`: [{ t, id, dur }]. */
function vozes(itens) {
  const envs = itens.map((x) => Object.assign({ env: falaEnvelope(wav(x.id)) }, x));
  return (t) => {
    for (const e of envs) if (t >= e.t && t <= e.t + e.dur) return e.env(t - e.t);
    return null;
  };
}

/** Mexe num grupo do cenário (um <g id> dentro do SVG de fundo). */
function grupo(id, { dx = 0, dy = 0, sc = 1, scY = null, rot = 0, origem = '50% 100%' } = {}) {
  return { id, style: `transform-box:fill-box;transform-origin:${origem};transform:translate(${f(dx)}px,${f(dy)}px) rotate(${f(rot)}deg) scale(${f(sc)},${f(scY === null ? sc : scY)})` };
}

/** Nuvens, sol, bandeirinhas e balões do campo, sempre em movimento leve. */
const campoVivo = (tG) => [
  { id: 'nv1', style: `transform:translate(${f(16 * Math.sin((tG * 2 * Math.PI) / 11))}px,0px)` },
  { id: 'nv2', style: `transform:translate(${f(-12 * Math.sin((tG * 2 * Math.PI) / 13))}px,0px)` },
  grupo('sol', { sc: 1 + 0.025 * Math.sin((tG * 2 * Math.PI) / 3.2), origem: '50% 50%' }),
  { id: 'bandeira', style: `transform-box:fill-box;transform-origin:50% 0%;transform:rotate(${f(0.35 * Math.sin((tG * 2 * Math.PI) / 3.6))}deg)` },
  grupo('b1', { dy: 9 * Math.sin((tG * 2 * Math.PI) / 2.4), rot: 3 * Math.sin((tG * 2 * Math.PI) / 3.1), origem: '50% 100%' }),
  grupo('b2', { dy: 9 * Math.sin((tG * 2 * Math.PI) / 2.1 + 1), rot: 3 * Math.sin((tG * 2 * Math.PI) / 2.7 + 1), origem: '50% 100%' }),
  grupo('b3', { dy: 9 * Math.sin((tG * 2 * Math.PI) / 2.7 + 2), rot: 3 * Math.sin((tG * 2 * Math.PI) / 3.3 + 2), origem: '50% 100%' }),
];

const CSS_BASE = `
  #bg, #fx, #fade, #extra { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
  #fade { background: #fff; opacity: 0; }
  #palavra { position: absolute; left: 0; top: 150px; width: 1920px; display: flex; justify-content: center; opacity: 0; }
  #palavra div { padding: 4px 70px 12px; background: #FFD23F; border: 8px solid ${LINE}; border-radius: 90px; box-shadow: 0 14px 0 rgba(61,44,78,.18);
    font-size: 120px; font-weight: 700; white-space: nowrap; line-height: 1.15; }
  #suavez { position: absolute; left: 1560px; top: 150px; width: 300px; height: 360px; opacity: 0; }
  #suavez .bal { position: absolute; left: 0; top: 0; width: 300px; padding: 8px 0 12px; background: #fff; border: 7px solid ${LINE}; border-radius: 50px;
    text-align: center; font-size: 58px; font-weight: 700; box-shadow: 0 10px 0 rgba(61,44,78,.14); }
  #suavez .rel { position: absolute; left: 30px; top: 110px; width: 240px; height: 240px; }
  #tuti { position: absolute; left: -40px; top: 436px; width: 560px; height: 616px; }
`;
const CORPO = (extra = '') =>
  `<div id="palavra"><div id="palavraTxt"></div></div><div id="suavez"><div class="bal">Sua vez!</div><div class="rel" id="rel"></div></div>${extra}<div id="tuti"></div><svg id="fx" viewBox="0 0 1920 1080"></svg><div id="fade"></div>`;

/** Janelas em que a palavra em inglês aparece escrita: [{ ini, fim, txt }]. */
function opsPalavra(t, janelas) {
  for (const j of janelas) {
    if (t >= j.ini - 0.05 && t <= j.fim + 0.3) {
      const kIn = Z.outBack(Z.prog(t, j.ini, 0.35), 2.2);
      const kOut = 1 - Z.prog(t, j.fim, 0.25);
      const b = 1 + 0.06 * Math.sin((t - j.ini) * 2 * Math.PI * 1.6) * (j.fim - t > 0 ? 1 : 0);
      return [{ id: 'palavra', style: `opacity:${f(Math.min(1, kIn * 3) * kOut)};transform:scale(${f(kIn * b)})`, html: undefined }, { id: 'palavraTxt', html: j.txt }];
    }
  }
  return [{ id: 'palavra', style: 'opacity:0' }];
}

/** "Sua vez!" com um relógio de 3 segundos, entre `ini` e `ini + SUA_VEZ`. */
function opsSuaVez(t, ini) {
  const el = t - ini;
  const vis = Z.outBack(Z.prog(t, ini - 0.05, 0.3), 1.8) * (1 - Z.prog(t, ini + SUA_VEZ - 0.05, 0.25));
  if (vis <= 0.001 || el < -0.1) return [{ id: 'suavez', style: 'opacity:0;transform:scale(0)' }];
  const e = Z.clamp(el, 0, SUA_VEZ);
  const mostra = Math.max(1, SUA_VEZ - Math.floor(e));
  const pulso = Z.bump(Z.prog(e - Math.floor(e), 0, 0.3));
  return [{ id: 'suavez', style: `opacity:1;transform:scale(${f(vis)})` }, { id: 'rel', html: P.timerSvg(mostra, 1 - e / SUA_VEZ, pulso) }];
}

const nuvensOps = campoVivo;

// Poses da Tuti desta festa
const GARRAS = { armL: [290, 520], armR: [710, 520], browL: 6, browR: 6, mouth: 0.9, gaze: [0, -0.1] };
const TROMBA = { armR: [760, 700], armL: [356, 848], browL: 8, browR: 8, mouth: 0.6, headTilt: -4 };
const ALTA = { armL: [330, 360], armR: [670, 360], browL: 12, browR: 12, mouth: 0.6, headTilt: 3 };
const PALMAS = { armL: [440, 640], armR: [560, 640], armLFront: true, armRFront: true, browL: 8, browR: 8, mouth: 0.6 };
const BRACOS_ALTOS = { armL: [250, 480], armR: [750, 480], browL: 10, browR: 10, mouth: 1, eyes: 'happy' };

/** Início e fim de cada segmento de uma fala, no tempo da cena (`t0` = início da fala). */
const segsDe = (m, id, t0) => (m[id].segmentos || []).map((s) => Object.assign({}, s, { ini: t0 + s.ini, fim: t0 + s.fim }));

// =====================================================================
// Abertura: "Hello!" e o aceno
// =====================================================================
function criarAbertura({ tGlobal0 = 0, entrada = '#fff', saida = '#fff' } = {}) {
  const m = manifesto();
  const fa = m.v5_abertura;
  const T = { tuti: 0.15, fala: 1.0 };
  T.fimFala = T.fala + fa.dur;
  const dur = T.fimFala + 1.3;
  const S = segsDe(m, 'v5_abertura', T.fala); // en, pt, en, pt, en
  const fala = vozes([{ t: T.fala, id: 'v5_abertura', dur: fa.dur }]);
  const track = [
    { t: 0, pose: P.FRENTE },
    { t: S[0].ini - 0.25, pose: P.ACENO, dur: 0.35 },
    { t: S[0].fim + 0.3, pose: P.FELIZ, dur: 0.45 },
    { t: S[2].ini - 0.1, pose: P.APONTANDO_CENA, dur: 0.45 },
    { t: S[3].fim - 1.6, pose: P.ACENO, dur: 0.4 },
  ];
  const pulos = [{ t: T.tuti + 0.05, n: 2, altura: 54, periodo: 0.4 }];
  const ajuste = (p, t) => {
    P.aceno(S[0].ini - 0.25, S[0].fim + 0.3)(p, t);
    P.aceno(S[3].fim - 1.6, dur + 1)(p, t);
  };
  const sons = [
    { t: T.tuti + 0.44, tipo: 'pouso', ganho: 0.3 },
    { t: T.tuti + 0.84, tipo: 'pouso', ganho: 0.3 },
    { t: dur - 0.5, tipo: 'sopro', ganho: 0.35 },
  ];
  const falas = [{ t: T.fala, id: 'v5_abertura' }];

  kit.resetIds();
  const css = CSS_BASE.replace('#fade { background: #fff; opacity: 0; }', '#fade { background: #fff; opacity: 1; }').replace('#tuti { position: absolute; left: -40px; top: 436px; width: 560px; height: 616px; }', '#tuti { position: absolute; left: 110px; top: 322px; width: 680px; height: 748px; }');
  const body = `<svg id="bg" viewBox="0 0 1920 1080">${festa.cenaAbertura({ comTuti: false })}</svg>` + CORPO();
  const html = stageHtml(css, body);
  const janelas = [
    { ini: S[0].ini, fim: S[0].fim + 0.8, txt: 'Hello!' },
    { ini: S[2].ini, fim: S[2].fim + 0.8, txt: 'Hello' },
    { ini: S[4].ini, fim: S[4].fim + 1.2, txt: 'Hello!' },
  ];

  function frame(t) {
    const tG = t + tGlobal0;
    const ops = campoVivo(tG);
    ops.push(...opsPalavra(t, janelas));
    ops.push(...opsSuaVez(t, 1e9));
    const kIn = Z.outCubic(Z.prog(t, T.tuti, 0.85));
    ops.push({ id: 'tuti', style: `transform:translate(${f(-760 * (1 - kIn))}px,0px)`, html: tutiFrame(t, { track, fala, pulos, ajuste, tGlobal: tG, width: 680, height: 748 }) });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { nome: 'abertura', dur, html, frame, sons, falas, T };
}

// =====================================================================
// Visitas: a Tuti (sheep) e as caixas surpresa (lion, elephant, giraffe)
// =====================================================================
function criarSheep({ tGlobal0 = 0, entrada = '#fff', saida = '#fff' } = {}) {
  const m = manifesto();
  const T = { fala: 0.8 };
  T.fimFala = T.fala + m.v5_v1_fala.dur;
  T.suaVez = T.fimFala + 0.2;
  T.elogio = T.suaVez + SUA_VEZ + 0.15;
  T.saida = T.elogio + m.v5_v1_elogio.dur + 0.7;
  const dur = T.saida + 0.6;
  const S = segsDe(m, 'v5_v1_fala', T.fala); // pt, en, pt, en
  const itens = [
    { t: T.fala, id: 'v5_v1_fala', dur: m.v5_v1_fala.dur },
    { t: T.elogio, id: 'v5_v1_elogio', dur: m.v5_v1_elogio.dur },
  ];
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens);
  const track = [
    { t: 0, pose: P.OLHANDO },
    { t: T.fala - 0.2, pose: P.FELIZ, dur: 0.45 },
    { t: S[2].ini, pose: P.APONTANDO_CENA, dur: 0.4 },
    { t: S[3].fim + 0.1, pose: P.COMEMORA, dur: 0.3 },
    { t: T.elogio + 0.9, pose: P.FELIZ, dur: 0.5 },
  ];
  const pulos = [
    { t: S[2].ini + 1.4, n: 3, altura: 40, periodo: 0.5 }, // "béééé!"
    { t: T.suaVez, n: 5, altura: 44, periodo: 0.6 },
  ];
  const sons = [{ t: T.suaVez, tipo: 'plim', ganho: 0.35 }, { t: T.saida, tipo: 'sopro', ganho: 0.35 }];
  kit.resetIds();
  const css = CSS_BASE.replace('#tuti { position: absolute; left: -40px; top: 436px; width: 560px; height: 616px; }', '#tuti { position: absolute; left: 520px; top: 300px; width: 760px; height: 836px; }');
  const body = `<svg id="bg" viewBox="0 0 1920 1080">${festa.cenaCampo()}</svg>` + CORPO();
  const html = stageHtml(css, body);
  const janelas = [{ ini: S[1].ini, fim: T.elogio - 0.1, txt: 'sheep' }];
  function frame(t) {
    const tG = t + tGlobal0;
    const ops = campoVivo(tG);
    ops.push(...opsPalavra(t, janelas), ...opsSuaVez(t, T.suaVez));
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, tGlobal: tG, width: 760, height: 836 }) });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { nome: 'v1', dur, html, frame, sons, falas, T };
}

const BICHOS = {
  2: { fn: animais.leao, escala: 0.5, caixa: { alt: 300, larg: 300 }, palavra: 'lion', pose: GARRAS, mexe: (t, k) => ({ sc: 1 + 0.07 * Math.abs(Math.sin(k * 2 * Math.PI * 1.4)) }) },
  3: { fn: animais.elefante, escala: 0.48, caixa: { alt: 300, larg: 300 }, palavra: 'elephant', pose: TROMBA, mexe: (t, k) => ({ rot: 6 * Math.sin(k * 2 * Math.PI * 1.6) }) },
  4: { fn: animais.girafa, escala: 0.6, caixa: { alt: 560, larg: 280 }, palavra: 'giraffe', pose: ALTA, mexe: (t, k) => ({ scY: 1 + 0.08 * Math.abs(Math.sin(k * 2 * Math.PI * 1.2)) }) },
};

function criarVisita(n, { tGlobal0 = 0, entrada = '#fff', saida = '#fff' } = {}) {
  const B = BICHOS[n];
  const m = manifesto();
  const id = (x) => `v5_v${n}_${x}`;
  const T = { antes: 0.7 };
  T.fimAntes = T.antes + m[id('antes')].dur;
  T.pop = T.fimAntes + 0.35;
  T.bicho = T.pop + 0.35;
  T.fimBicho = T.bicho + m[id('bicho')].dur;
  T.convite = T.fimBicho + 0.35;
  T.fimConvite = T.convite + m[id('convite')].dur;
  T.suaVez = T.fimConvite + 0.25;
  T.elogio = T.suaVez + SUA_VEZ + 0.15;
  T.saida = T.elogio + m[id('elogio')].dur + 0.7;
  const dur = T.saida + 0.6;
  const S = segsDe(m, id('convite'), T.convite);
  const en = S.find((s) => s.voz === 'en');
  const itens = [
    { t: T.antes, id: id('antes'), dur: m[id('antes')].dur },
    { t: T.convite, id: id('convite'), dur: m[id('convite')].dur },
    { t: T.elogio, id: id('elogio'), dur: m[id('elogio')].dur },
  ];
  const falas = itens.concat([{ t: T.bicho, id: id('bicho'), dur: 0 }]).map(({ t, id: i }) => ({ t, id: i }));
  const fala = vozes(itens);
  const track = [
    { t: 0, pose: P.OLHANDO },
    { t: T.antes - 0.2, pose: 'perguntando', dur: 0.45 },
    { t: T.bicho - 0.1, pose: P.FELIZ, dur: 0.4 },
    { t: T.convite, pose: P.APONTANDO_CENA, dur: 0.4 },
    { t: T.suaVez - 0.1, pose: B.pose, dur: 0.4 },
    { t: T.elogio, pose: P.COMEMORA, dur: 0.3 },
    { t: T.elogio + 1.2, pose: P.FELIZ, dur: 0.5 },
  ];
  const pulos = [{ t: T.pop + 0.4, n: 1, altura: 40, periodo: 0.5 }, { t: T.elogio, n: 2, altura: 60, periodo: 0.44 }];
  if (n === 4) pulos.push({ t: T.suaVez, n: 4, altura: 22, periodo: 0.75 });
  const ajuste = (p, t) => {
    if (n === 3 && t >= T.suaVez && t < T.suaVez + SUA_VEZ) p.armR = [760 + 40 * Math.sin((t - T.suaVez) * 2 * Math.PI * 1.6), 700 + 50 * Math.cos((t - T.suaVez) * 2 * Math.PI * 1.6)];
  };
  const sons = [
    { t: T.pop, tipo: 'sopro', ganho: 0.3 },
    { t: T.suaVez, tipo: 'plim', ganho: 0.35 },
    { t: T.saida, tipo: 'sopro', ganho: 0.35 },
  ];
  kit.resetIds();
  const css = CSS_BASE;
  const body = `<svg id="bg" viewBox="0 0 1920 1080">${festa.cenaVisita({ fn: B.fn, escala: B.escala, caixaAlt: B.caixa.alt, caixaLarg: B.caixa.larg })}</svg>` + CORPO();
  const html = stageHtml(css, body);
  const janelas = [{ ini: en.ini, fim: T.elogio - 0.1, txt: B.palavra }];
  const E_ = { x0: 1560 - 1180 }; // a caixa fica 380 px à direita de onde o bicho para

  function frame(t) {
    const tG = t + tGlobal0;
    const ops = campoVivo(tG);
    // a caixa balança cada vez mais antes de abrir
    const kS = Z.prog(t, T.antes, T.pop - T.antes);
    const treme = t < T.pop ? kS * 3.2 * Math.sin((t - T.antes) * 2 * Math.PI * 7) : 0;
    ops.push(grupo('cxc', { rot: treme, origem: '50% 100%' }));
    // a tampa voa para cima e some
    const kT = Z.prog(t, T.pop, 0.7);
    ops.push(grupo('cxt', { rot: treme + 40 * Z.outCubic(kT), dy: -420 * Z.outCubic(kT) + 300 * Z.inCubic(Z.prog(t, T.pop + 0.5, 0.5)), dx: 90 * Z.outCubic(kT), sc: 1 - Z.prog(t, T.pop + 0.9, 0.3), origem: '50% 100%' }));
    // o bicho pula da caixa até o lugar dele, cresce e depois imita o som e o gesto
    const kP = Z.prog(t, T.pop + 0.05, 0.85);
    const e = Z.inOutCubic(kP);
    let dx = E_.x0 * (1 - e);
    let dy = -300 * Math.sin(Math.PI * kP);
    let extra = {};
    if (t >= T.suaVez && t < T.suaVez + SUA_VEZ) extra = B.mexe(t, (t - T.suaVez) / 1);
    if (t >= T.bicho && t < T.bicho + 0.5) dy -= 14 * Math.sin(((t - T.bicho) / 0.5) * Math.PI);
    ops.push(grupo('bicho', Object.assign({ dx, dy, sc: Math.max(0.001, Z.outBack(kP, 1.3)) }, extra)));
    ops.push(...opsPalavra(t, janelas), ...opsSuaVez(t, T.suaVez));
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, ajuste, tGlobal: tG }) });
    const vida = t - (T.pop + 0.4);
    ops.push({ id: 'fx', html: vida >= 0 && vida < 2.6 ? `<g opacity="${f(1 - Z.prog(t, T.pop + 2.6, 0.5))}">${confete(vida, { pecas: 34 })}</g>` : '' });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { nome: `v${n}`, dur, html, frame, sons, falas, T };
}

// =====================================================================
// Jogo 1 · A Tuti diz (jump, clap, spin)
// =====================================================================
function criarTutiDiz({ tGlobal0 = 0, entrada = '#fff', saida = '#fff' } = {}) {
  const m = manifesto();
  const d = (id) => m[`v5_j1_${id}`].dur;
  const T = { intro: 0.8 };
  T.c1 = T.intro + d('intro') + 0.5;
  T.c2 = T.c1 + d('c1') + 2.4;
  T.c3 = T.c2 + d('c2') + 2.4;
  T.s0 = T.c3 + d('c3') + 2.8;
  T.s1 = T.s0 + d('s0') + 0.3;
  T.v1 = T.s1 + d('s1') + 0.15; // "sua vez" de pular
  T.s2 = T.v1 + SUA_VEZ + 0.2;
  T.v2 = T.s2 + d('s2') + 0.15;
  T.s3 = T.v2 + SUA_VEZ + 0.2;
  T.v3 = T.s3 + d('s3') + 0.15;
  T.fim = T.v3 + SUA_VEZ + 0.2;
  T.saida = T.fim + d('fim') + 0.8;
  const dur = T.saida + 0.6;
  const ids = ['intro', 'c1', 'c2', 'c3', 's0', 's1', 's2', 's3', 'fim'];
  const inicio = { intro: T.intro, c1: T.c1, c2: T.c2, c3: T.c3, s0: T.s0, s1: T.s1, s2: T.s2, s3: T.s3, fim: T.fim };
  const itens = ids.map((i) => ({ t: inicio[i], id: `v5_j1_${i}`, dur: d(i) }));
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens);
  // cada ação começa quando a palavra em inglês é dita, e a Tuti faz o gesto por ~2 s ou 3 s
  const enDe = (id, t0) => segsDe(m, `v5_j1_${id}`, t0).find((s) => s.voz === 'en');
  const acoes = [
    { tipo: 'pula', ini: enDe('c1', T.c1).ini, fim: enDe('c1', T.c1).ini + 2.2, txt: 'Jump!' },
    { tipo: 'palma', ini: enDe('c2', T.c2).ini, fim: enDe('c2', T.c2).ini + 2.2, txt: 'Clap!' },
    { tipo: 'gira', ini: enDe('c3', T.c3).ini, fim: enDe('c3', T.c3).ini + 2.2, txt: 'Spin!' },
    { tipo: 'pula', ini: T.v1, fim: T.v1 + SUA_VEZ, txt: 'Jump!', fala: enDe('s1', T.s1).ini },
    { tipo: 'palma', ini: T.v2, fim: T.v2 + SUA_VEZ, txt: 'Clap!', fala: enDe('s2', T.s2).ini },
    { tipo: 'gira', ini: T.v3, fim: T.v3 + SUA_VEZ, txt: 'Spin!', fala: enDe('s3', T.s3).ini },
  ];
  const track = [{ t: 0, pose: P.OLHANDO }, { t: T.intro - 0.2, pose: P.FELIZ, dur: 0.4 }];
  const pulos = [];
  for (const a of acoes) {
    if (a.tipo === 'pula') {
      pulos.push({ t: a.ini, n: Math.round((a.fim - a.ini) / 0.55), altura: 70, periodo: 0.55 });
      track.push({ t: a.ini - 0.1, pose: P.BRACOS ? P.BRACOS : BRACOS_ALTOS, dur: 0.3 });
    }
    if (a.tipo === 'palma') track.push({ t: a.ini - 0.1, pose: PALMAS, dur: 0.25 });
    if (a.tipo === 'gira') track.push({ t: a.ini - 0.1, pose: P.FELIZ, dur: 0.25 });
    track.push({ t: a.fim, pose: P.FELIZ, dur: 0.35 });
  }
  const ajuste = (p, t) => {
    for (const a of acoes) {
      if (a.tipo === 'palma' && t >= a.ini && t < a.fim) {
        const k = 0.5 + 0.5 * Math.sin((t - a.ini) * 2 * Math.PI * 2.6);
        p.armL = [330 + 130 * k, 640 - 10 * k];
        p.armR = [670 - 130 * k, 640 - 10 * k];
      }
    }
  };
  const sons = [{ t: T.saida, tipo: 'sopro', ganho: 0.35 }];
  for (const a of acoes) {
    // na demonstração a Tuti ainda está falando ("Pule!"), então o som fica bem baixo; nos comandos sem voz ele aparece mais
    const baixo = a.fala === undefined;
    if (a.tipo === 'palma') for (let k = 0; k < 5; k++) sons.push({ t: a.ini + 0.19 + k * 0.385, tipo: 'tique', ganho: baixo ? 0.16 : 0.45, agudo: true });
    if (a.tipo === 'pula') for (let k = 0; k < Math.round((a.fim - a.ini) / 0.55); k++) sons.push({ t: a.ini + 0.28 + k * 0.55, tipo: 'pouso', ganho: baixo ? 0.1 : 0.25 });
  }
  for (const v of [T.v1, T.v2, T.v3]) sons.push({ t: v, tipo: 'plim', ganho: 0.3 });
  kit.resetIds();
  const css = CSS_BASE.replace('#tuti { position: absolute; left: -40px; top: 436px; width: 560px; height: 616px; }', '#tuti { position: absolute; left: 570px; top: 250px; width: 784px; height: 862px; transform-origin: 50% 60%; }');
  const body = `<svg id="bg" viewBox="0 0 1920 1080">${festa.cenaCampo()}</svg>` + CORPO();
  const html = stageHtml(css, body);
  const janelas = acoes.map((a) => ({ ini: a.fala !== undefined ? a.fala : a.ini, fim: a.fim, txt: a.txt }));
  function frame(t) {
    const tG = t + tGlobal0;
    const ops = campoVivo(tG);
    ops.push(...opsPalavra(t, janelas));
    const v = [T.v1, T.v2, T.v3].find((x) => t >= x - 0.1 && t < x + SUA_VEZ);
    ops.push(...opsSuaVez(t, v === undefined ? 1e9 : v));
    let giro = 0;
    for (const a of acoes) if (a.tipo === 'gira' && t >= a.ini && t < a.fim) giro = 720 * Z.inOutCubic(Z.prog(t, a.ini, a.fim - a.ini - 0.3));
    ops.push({ id: 'tuti', style: `transform:perspective(1800px) rotateY(${f(giro)}deg)`, html: tutiFrame(t, { track, fala, pulos, ajuste, tGlobal: tG, width: 784, height: 862 }) });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { nome: 'j1', dur, html, frame, sons, falas, T };
}

// =====================================================================
// Jogo 2 · Qual é o lion? (três cards)
// =====================================================================
function criarCartas({ tGlobal0 = 0, entrada = null, saida = null } = {}) {
  return criarCenaCards({ num: 2, q: desafio(2), narrDir: NARR, idPergunta: 'v5_j2_pergunta', idResposta: 'v5_j2_resposta', contagem: CONT, tGlobal0, entrada, saida });
}

// =====================================================================
// Jogo 3 · Ache a giraffe
// =====================================================================
const CSS_ANEL = '#anel { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; opacity: 0; }';
const anelSvg = (cx, cy, rx, ry) =>
  `<svg id="anel" viewBox="0 0 1920 1080"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${LINE}" stroke-width="26"/>` +
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#FFD23F" stroke-width="14"/></svg>`;
function opsAnel(t, t0, dura, cx, cy) {
  const k = Z.outCubic(Z.prog(t, t0, 0.3)) * (1 - Z.prog(t, t0 + dura - 0.4, 0.4));
  const pulso = 1 + 0.03 * Math.sin((t - t0) * 2 * Math.PI * 1.6);
  return { id: 'anel', style: `opacity:${f(k)};transform-origin:${cx}px ${cy}px;transform:scale(${f((0.8 + 0.2 * k) * pulso)})` };
}

function criarAchar({ tGlobal0 = 0, entrada = '#fff', saida = '#fff' } = {}) {
  const m = manifesto();
  const fq = m.v5_j3_pergunta;
  const fr = m.v5_j3_resposta;
  const T = { banner: 0.1, selo: 0.35, pergunta: 1.2 };
  T.fimPergunta = T.pergunta + fq.dur;
  T.contagem = T.fimPergunta + 0.6;
  T.dica = T.contagem + 5;
  T.revela = T.contagem + CONT + 0.1;
  T.pulo = T.revela + 0.25;
  T.resposta = T.revela + 1.7;
  T.fimResposta = T.resposta + fr.dur;
  T.saida = T.fimResposta + 0.9;
  const dur = T.saida + 0.75;
  const G_ = festa.ESC_GIRAFA;
  const pouso = { x: 760 };
  const sons = [{ t: T.selo, tipo: 'plim', ganho: 0.5 }]
    .concat(P.sonsContagem(T, CONT))
    .concat([
      { t: T.dica, tipo: 'virada', ganho: 0.4, semente: 9 },
      { t: T.revela + 0.1, tipo: 'virada', ganho: 0.5, semente: 5 },
      { t: T.revela + 0.95, tipo: 'acerto', ganho: 0.6 },
      { t: T.saida, tipo: 'sopro', ganho: 0.4 },
    ]);
  const itens = [
    { t: T.pergunta, id: 'v5_j3_pergunta', dur: fq.dur },
    { t: T.resposta, id: 'v5_j3_resposta', dur: fr.dur },
  ];
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens);
  const track = [
    { t: 0, pose: P.OLHANDO },
    { t: T.pergunta - 0.3, pose: P.PROCURANDO, dur: 0.45 },
  ];
  for (let k = 1; T.contagem + k * 3 < T.revela - 0.6; k++) track.push({ t: T.contagem + k * 3, pose: k % 2 ? P.PENSANDO : P.PROCURANDO, dur: 0.6 });
  track.push({ t: T.revela + 0.85, pose: P.COMEMORA, dur: 0.28 });
  track.push({ t: T.resposta + 1.0, pose: P.APONTANDO, dur: 0.5 });
  track.push({ t: T.saida, pose: P.OLHANDO, dur: 0.5 });
  const pulos = [{ t: T.revela + 0.95, n: 2, altura: 74, periodo: 0.44 }];
  const ajuste = (p, t) => {
    if (p.armRFront && t < T.revela) p.gaze = [0.25 + 0.65 * Math.sin(((t - T.pergunta) * 2 * Math.PI) / 3.4), -0.1];
  };
  kit.resetIds();
  const css = P.cssBase() + CSS_ANEL + '#neve { display:none; }';
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${festa.cenaAchar()}</svg>` +
    P.bannerHtml(3, 'Ache a giraffe!') +
    anelSvg(G_.arvore.x, 560, 430, 400) +
    `<div id="timer"></div><div id="tuti"></div><svg id="fx" viewBox="0 0 1920 1080"></svg><div id="fade"></div>`;
  const html = stageHtml(css, body);
  const treme = (t, t0, dura = 0.9, graus = 1.4) => {
    const k = Z.prog(t, t0, dura);
    return k > 0 && k < 1 ? graus * Math.sin((t - t0) * 2 * Math.PI * 5) * (1 - k) : 0;
  };
  function frame(t) {
    const tG = t + tGlobal0;
    const ops = campoVivo(tG).concat(P.opsBanner(t, T));
    let dx = 0;
    let dy = -16 * Z.bump(Z.prog(t, T.dica + 0.1, 1.5));
    const kP = Z.prog(t, T.pulo, 1.0);
    if (kP > 0) {
      dx = (pouso.x - G_.x) * Z.inOutCubic(kP);
      dy = -90 * Math.sin(Math.PI * kP);
      const kF = t - (T.pulo + 1.0);
      if (kF > 0 && kF < 0.9) dy -= 26 * Math.abs(Math.sin((Math.PI * kF) / 0.45));
    }
    ops.push(grupo('oculta', { dx, dy, origem: '50% 100%' }));
    ops.push(grupo('arvoreEsc', { rot: treme(t, T.dica) + treme(t, T.revela + 0.1), origem: '50% 100%' }));
    ops.push(opsAnel(t, T.revela, 1.9, G_.arvore.x, 560));
    ops.push(...P.opsTimer(t, T, CONT));
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, ajuste, tGlobal: tG }) });
    const vida = t - (T.revela + 0.95);
    ops.push({
      id: 'fx',
      html: vida >= 0 && t < T.saida + 0.7 ? `<g opacity="${f(1 - Z.prog(t, T.saida, 0.5))}">${confete(vida)}${P.brilhos(t, T.revela, pouso.x, 640, 230, 300)}</g>` : '',
    });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { nome: 'j3', dur, html, frame, sons, falas, T };
}

// =====================================================================
// Jogo 4 · Conte os elefantes, em inglês
// =====================================================================
function criarContar({ tGlobal0 = 0, entrada = '#fff', saida = '#fff' } = {}) {
  const m = manifesto();
  const fq = m.v5_j4_pergunta;
  const fc = m.v5_j4_contagem;
  const fr = m.v5_j4_resposta;
  const PX = festa.ELEFANTES_X;
  const NOTAS = [523.25, 587.33, 659.25, 698.46, 783.99];
  const T = { banner: 0.1, selo: 0.35, pergunta: 1.2 };
  T.fimPergunta = T.pergunta + fq.dur;
  T.conta = T.fimPergunta + 0.7;
  T.numeros = fc.partes.map((p) => T.conta + p.ini);
  T.fimConta = T.conta + fc.dur;
  T.festa = T.fimConta + 0.25;
  T.resposta = T.festa + 1.25;
  T.fimResposta = T.resposta + fr.dur;
  T.saida = T.fimResposta + 1.3;
  const dur = T.saida + 0.75;
  const sons = [{ t: T.selo, tipo: 'plim', ganho: 0.5 }];
  T.numeros.forEach((t, i) => sons.push({ t, tipo: 'nota', freq: NOTAS[i], ganho: 0.1 })); // baixinho: acompanha a voz sem cobrir
  sons.push({ t: T.festa, tipo: 'acerto', ganho: 0.55 }, { t: T.saida, tipo: 'sopro', ganho: 0.4 });
  const itens = [
    { t: T.pergunta, id: 'v5_j4_pergunta', dur: fq.dur },
    { t: T.conta, id: 'v5_j4_contagem', dur: fc.dur },
    { t: T.resposta, id: 'v5_j4_resposta', dur: fr.dur },
  ];
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens);
  const track = [
    { t: 0, pose: P.OLHANDO },
    { t: T.pergunta - 0.3, pose: P.APONTANDO, dur: 0.45 },
    { t: T.conta - 0.2, pose: PALMAS, dur: 0.3 },
    { t: T.festa - 0.1, pose: P.COMEMORA, dur: 0.28 },
    { t: T.saida, pose: P.OLHANDO, dur: 0.5 },
  ];
  const pulos = [{ t: T.festa, n: 2, altura: 74, periodo: 0.44 }];
  const ajuste = (p, t) => {
    // a Tuti bate palmas a cada número, junto com a criança
    for (const tn of T.numeros) {
      const k = (t - tn) / 0.45;
      if (k > -0.15 && k < 1 && t < T.fimConta + 0.4) {
        const a = Z.bump(Z.clamp(k + 0.15, 0, 1));
        p.armL = [330 + 130 * a, 640];
        p.armR = [670 - 130 * a, 640];
        p.armLFront = true;
        p.armRFront = true;
      }
    }
  };
  kit.resetIds();
  const css = P.cssBase() + CSS_ANEL + '#extra { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }';
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${festa.cenaElefantes()}</svg>` +
    P.bannerHtml(4, 'Conte em inglês!') +
    `<svg id="extra" viewBox="0 0 1920 1080"></svg>` +
    `<div id="timer"></div><div id="tuti"></div><svg id="fx" viewBox="0 0 1920 1080"></svg><div id="fade"></div>`;
  const html = stageHtml(css, body);
  const numero = (txt, x, y, size, cor) =>
    `<text x="${x}" y="${f(y)}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${f(size)}" fill="${cor}" stroke="${LINE}" stroke-width="${f(size * 0.14)}" stroke-linejoin="round" paint-order="stroke">${txt}</text>`;
  function frame(t) {
    const tG = t + tGlobal0;
    const ops = campoVivo(tG).concat(P.opsBanner(t, T));
    let marcas = '';
    for (let i = 0; i < PX.length; i++) {
      const k = Z.prog(t, T.numeros[i], 0.45);
      const fe = Z.bump(Z.prog(t, T.festa + 0.08 * i, 0.5));
      ops.push(grupo(`p${i + 1}`, { dy: -34 * Z.bump(k) - 30 * fe, sc: 1 + 0.1 * Z.bump(k), origem: '50% 100%' }));
      if (k <= 0) continue;
      const some = 1 - Z.prog(t, T.saida, 0.4);
      marcas +=
        `<g opacity="${f(some)}"><ellipse cx="${PX[i]}" cy="${860 + (i % 2 ? 12 : 0)}" rx="${f(112 * Z.outCubic(k))}" ry="${f(118 * Z.outCubic(k))}" fill="none" stroke="#FFD23F" stroke-width="10" opacity="0.9"/>` +
        numero(i + 1, PX[i], 700 - 14 * fe, 132 * Z.outBack(Z.prog(t, T.numeros[i], 0.4), 2.2), '#FFD23F') +
        `</g>`;
    }
    const k5 = Z.prog(t, T.festa, 0.5);
    if (k5 > 0) marcas += `<g opacity="${f(1 - Z.prog(t, T.saida, 0.4))}">${numero(5, 960, 480 - 10 * Math.sin((t - T.festa) * 2 * Math.PI * 0.9), 300 * Z.outBack(k5, 2), '#4DA3FF')}</g>`;
    ops.push({ id: 'extra', html: marcas });
    ops.push({ id: 'timer', style: 'transform:scale(0)' });
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, ajuste, tGlobal: tG }) });
    const vida = t - (T.festa + 0.15);
    ops.push({ id: 'fx', html: vida >= 0 && t < T.saida + 0.7 ? `<g opacity="${f(1 - Z.prog(t, T.saida, 0.5))}">${confete(vida)}</g>` : '' });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { nome: 'j4', dur, html, frame, sons, falas, T };
}

// =====================================================================
// Jogo 5 · Onde está o lion? (memória)
// =====================================================================
function criarMemoria({ tGlobal0 = 0, entrada = null, saida = null } = {}) {
  const d = desafio(5);
  const m = manifesto();
  const fm = m.v5_j5_mostrar;
  const fq = m.v5_j5_pergunta; // partes: aviso, pergunta, "no um", "no dois", "no três"
  const fr = m.v5_j5_resposta;
  const CARD = P.CARD;
  const SX = [432, 920, 1408];
  const CY = 232;
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
    { t: T.mostrar, id: 'v5_j5_mostrar', dur: fm.dur },
    { t: T.pergunta, id: 'v5_j5_pergunta', dur: fq.dur },
    { t: T.resposta, id: 'v5_j5_resposta', dur: fr.dur },
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
  `;
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${fundoQuiz()}</svg>` +
    `<div id="burst">${P.raios()}</div>` +
    P.bannerHtml(d.n, d.texto) +
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

      // "olhe bem onde o lion está": o card do leão pulsa
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
      ops.push({ id: `c${i}`, style: `left:${f(x)}px;top:${CY}px;transform:translate(0px,${f(dy)}px) scale(${f(sc)}) rotate(${f(rotZ)}deg);opacity:${f(op)};z-index:${z}` });
      ops.push({ id: `c${i}i`, style: `transform:rotateY(${f(ang)}deg)` });
      ops.push({ id: `c${i}s`, style: `transform:translate(0px,16px) scaleX(${f(Math.max(0.03, cos))})` });
      ops.push({ id: `c${i}n`, style: `opacity:${f(Z.prog(t, T.numeros + 0.08 * slot[i], 0.3))}` });
    }

    const kB = Z.outCubic(Z.prog(t, T.revela + 0.95, 0.5)) * (1 - Z.prog(t, T.saida, 0.4));
    ops.push({ id: 'burst', style: `opacity:${f(0.95 * kB)};transform:rotate(${f((t - T.revela) * 14)}deg) scale(${f(0.6 + 0.4 * kB)})` });
    ops.push(...P.opsTimer(t, T, CONT));
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, tGlobal: tG }) });
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


// =====================================================================
// Final: a revisão das palavras, a dança dos bichos e "Bye-bye!"
// =====================================================================
function criarFinal({ tGlobal0 = 0, entrada = '#fff', saida = '#fff' } = {}) {
  const m = manifesto();
  const T = { fala: 0.8 };
  T.fimFala = T.fala + m.v5_encerramento.dur;
  T.danca = T.fimFala + 0.4;
  const DANCA = 6;
  T.tchau = T.danca + DANCA + 0.3;
  T.fimTchau = T.tchau + m.v5_tchau.dur;
  T.saida = T.fimTchau + 1.6;
  const dur = T.saida + 0.6;
  const S = segsDe(m, 'v5_encerramento', T.fala).filter((s) => s.voz === 'en');
  const limpa = (s) => s.texto.replace(/[,.!?]+$/, '');
  const palavraDe = (nome) => S.find((s) => limpa(s) === nome);
  const St = segsDe(m, 'v5_tchau', T.tchau).find((s) => s.voz === 'en');
  const itens = [
    { t: T.fala, id: 'v5_encerramento', dur: m.v5_encerramento.dur },
    { t: T.tchau, id: 'v5_tchau', dur: m.v5_tchau.dur },
  ];
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens);
  const track = [{ t: 0, pose: P.COMEMORA }, { t: T.fala - 0.2, pose: P.FELIZ, dur: 0.45 }];
  for (let k = 0; T.danca + k * 0.6 < T.danca + DANCA; k++) track.push({ t: T.danca + k * 0.6, pose: k % 2 ? BRACOS_ALTOS : P.FELIZ, dur: 0.3 });
  track.push({ t: T.tchau - 0.25, pose: P.ACENO, dur: 0.4 });
  const pulos = [{ t: 0.4, n: 2, altura: 60, periodo: 0.44 }, { t: T.danca, n: Math.round(DANCA / 0.6), altura: 40, periodo: 0.6 }];
  const ajuste = P.aceno(T.tchau - 0.25, dur + 1);
  const sons = [{ t: T.danca, tipo: 'acerto', ganho: 0.45 }, { t: T.saida, tipo: 'sopro', ganho: 0.35 }];
  for (let k = 0; k < Math.round(DANCA / 0.625); k++) sons.push({ t: T.danca + 0.3 + k * 0.625, tipo: 'pouso', ganho: 0.22 });
  kit.resetIds();
  const css = CSS_BASE.replace('#fade { background: #fff; opacity: 0; }', '#fade { background: #fff; opacity: 1; }').replace('left: -40px; top: 436px; width: 560px; height: 616px;', 'left: -52px; top: 424px; width: 600px; height: 660px;');
  const body = `<svg id="bg" viewBox="0 0 1920 1080">${festa.cenaFinal({ comTuti: false })}</svg>` + CORPO();
  const html = stageHtml(css, body);
  const janelas = S.map((s) => ({ ini: s.ini, fim: s.fim + 0.45, txt: limpa(s) })).concat([{ ini: St.ini, fim: St.fim + 1.2, txt: 'Bye-bye!' }]);
  const hop = (t, t0, h = 60) => {
    const k = (t - t0) / 0.5;
    return k > 0 && k < 2 ? -h * Math.abs(Math.sin(Math.PI * k)) : 0;
  };
  function frame(t) {
    const tG = t + tGlobal0;
    const ops = campoVivo(tG);
    const dancando = t >= T.danca && t < T.danca + DANCA;
    const k = t - T.danca;
    const lion = palavraDe('lion');
    const ele = palavraDe('elephant');
    const gir = palavraDe('giraffe');
    ops.push(grupo('a1', { dy: hop(t, lion.ini) + (dancando ? -46 * Math.abs(Math.sin(k * Math.PI / 0.625)) : 0), rot: dancando ? 7 * Math.sin(k * 2 * Math.PI * 1.6) : 0 }));
    ops.push(grupo('a2', { dy: hop(t, ele.ini) + (dancando ? -34 * Math.abs(Math.sin(k * Math.PI / 0.625 + 0.8)) : 0), rot: dancando ? -8 * Math.sin(k * 2 * Math.PI * 1.6) : 0 }));
    ops.push(grupo('a3', { dy: hop(t, gir.ini) + (dancando ? -40 * Math.abs(Math.sin(k * Math.PI / 0.625 + 1.6)) : 0), scY: dancando ? 1 + 0.07 * Math.sin(k * 2 * Math.PI * 1.6) : 1, sc: 1 }));
    ops.push(...opsPalavra(t, janelas), ...opsSuaVez(t, 1e9));
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, ajuste, tGlobal: tG, width: 600, height: 660 }) });
    const vida = t - (T.danca - 0.1);
    ops.push({ id: 'fx', html: vida > 0 && t < T.fimTchau + 1.4 ? `<g opacity="${f(1 - Z.prog(t, T.fimTchau + 0.6, 0.8))}">${confete(vida)}</g>` : '' });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida, tOut: 0.9 }) });
    return ops;
  }
  return { nome: 'final', dur, html, frame, sons, falas, T };
}

module.exports = { criarAbertura, criarSheep, criarVisita, criarTutiDiz, criarCartas, criarAchar, criarContar, criarMemoria, criarFinal };
