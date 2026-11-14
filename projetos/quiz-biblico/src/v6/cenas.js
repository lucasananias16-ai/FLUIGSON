'use strict';
/**
 * Vídeo 6 — as cenas do Foguete da Tuti (números em inglês): abertura, as duas
 * lições (one a five, six a ten), o jogo com o corpo, os jogos de cards, a
 * contagem de estrelas, o robô que pula um número, a memória e a contagem
 * regressiva com a decolagem até a Lua.
 *
 * Todos os tempos saem da narração (narracao.json): cada número acende na tela
 * quando é dito.
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
const espaco = require('../art/espaco');
const desafios = require('./desafios');
const roteiro = require('./roteiro');

const NARR = path.resolve(__dirname, '..', '..', 'v6-ingles-numeros', 'narracao');
const CONT = roteiro.contagem;
const LINE = P.LINE;
const f = P.f;
const PAL = roteiro.palavras;
const TUTI = { capacete: true };

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

/** "Sua vez!" com um relógio regressivo, entre `ini` e `ini + SUA_VEZ`. */
function opsSuaVez(t, ini, SUA_VEZ = 3) {
  const el = t - ini;
  const vis = Z.outBack(Z.prog(t, ini - 0.05, 0.3), 1.8) * (1 - Z.prog(t, ini + SUA_VEZ - 0.05, 0.25));
  if (vis <= 0.001 || el < -0.1) return [{ id: 'suavez', style: 'opacity:0;transform:scale(0)' }];
  const e = Z.clamp(el, 0, SUA_VEZ);
  const mostra = Math.max(1, Math.ceil(SUA_VEZ - e));
  const pulso = Z.bump(Z.prog(e - Math.floor(e), 0, 0.3));
  return [{ id: 'suavez', style: `opacity:1;transform:scale(${f(vis)})` }, { id: 'rel', html: P.timerSvg(mostra, 1 - e / SUA_VEZ, pulso) }];
}


const PALMAS = { armL: [440, 640], armR: [560, 640], armLFront: true, armRFront: true, browL: 8, browR: 8, mouth: 0.6 };
const BRACOS_ALTOS = { armL: [250, 480], armR: [750, 480], browL: 10, browR: 10, mouth: 1, eyes: 'happy' };
const NOTAS = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5, 1174.66, 1318.5];
const CORES_NUM = ['#FFD23F', '#FF8FB1', '#4DA3FF', '#5DBB7A', '#FFA53A', '#9B7EDE', '#E25A52', '#3CC6B4', '#FFD23F', '#4DA3FF'];
const segsDe = (m, id, t0) => (m[id].segmentos || []).map((s) => Object.assign({}, s, { ini: t0 + s.ini, fim: t0 + s.fim }));
const tx = (txt, x, y, size, cor, extra = '') =>
  `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${f(size)}" fill="${cor}" stroke="${LINE}" stroke-width="${f(size * 0.13)}" stroke-linejoin="round" paint-order="stroke"${extra}>${txt}</text>`;
/** Número gigante com a palavra em inglês embaixo; `k` (0 a 1) é o quanto já apareceu. */
const numeroGrande = (num, x, y, size, k) => (k <= 0 ? '' : tx(num, x, y, size * Z.outBack(k, 2), CORES_NUM[(num - 1) % 10]) + tx(PAL[num], x, y + size * 0.36, size * 0.3 * Z.outBack(k, 2), '#FFFFFF'));
const BG = (svg) => `<svg id="bg" viewBox="0 0 1920 1080">${svg}</svg>`;
const EXTRA = '<svg id="extra" viewBox="0 0 1920 1080"></svg>';
/** Monta trilha de falas em sequência: [[chave, id, folga antes]] a partir de `t0`. Devolve T (inícios e fins) e os itens. */
function fila(m, t0, lista) {
  const T = {};
  const itens = [];
  let t = t0;
  for (const [chave, id, antes = 0.35] of lista) {
    t += antes;
    T[chave] = t;
    itens.push({ t, id, dur: m[id].dur, chave });
    t += m[id].dur;
    T[`${chave}Fim`] = t;
  }
  return { T, itens, fim: t };
}

// ===== Abertura: a Tuti, o Bip e o foguete =====
function criarAbertura({ tGlobal0 = 0, entrada = '#fff', saida = '#fff' } = {}) {
  const m = manifesto();
  const { T, itens, fim } = fila(m, 0.6, [['a1', 'v6_ab_1', 0.4], ['bip', 'v6_ab_bip', 0.3], ['a2', 'v6_ab_2', 0.4]]);
  const dur = fim + 1.3;
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens.filter((x) => x.chave !== 'bip'));
  const S = segsDe(m, 'v6_ab_1', T.a1);
  const track = [
    { t: 0, pose: P.FRENTE },
    { t: T.a1 - 0.25, pose: P.ACENO, dur: 0.35 },
    { t: S[0].fim + 0.3, pose: P.FELIZ, dur: 0.45 },
    { t: T.a1Fim - 2.4, pose: P.APONTANDO_CENA, dur: 0.45 },
    { t: T.a2 - 0.1, pose: 'perguntando', dur: 0.45 },
    { t: T.a2Fim - 1.3, pose: P.COMEMORA, dur: 0.3 },
  ];
  const pulos = [{ t: 0.2, n: 2, altura: 54, periodo: 0.4 }, { t: T.a2Fim - 1.2, n: 2, altura: 70, periodo: 0.44 }];
  const ajuste = P.aceno(T.a1 - 0.25, S[0].fim + 0.3);
  const sons = [{ t: 0.45, tipo: 'plim', ganho: 0.5 }, { t: dur - 0.5, tipo: 'sopro', ganho: 0.35 }];
  kit.resetIds();
  const css =
    CSS_BASE.replace('#fade { background: #fff; opacity: 0; }', '#fade { background: #fff; opacity: 1; }').replace('#tuti { position: absolute; left: -40px; top: 436px; width: 560px; height: 616px; }', '#tuti { position: absolute; left: 110px; top: 322px; width: 680px; height: 748px; }') +
    `#faixa { position: absolute; left: 0; top: 34px; width: 1920px; display: flex; justify-content: center; }
     #titulo { padding: 10px 70px 14px; background: #FFD23F; border: 8px solid ${LINE}; border-radius: 90px; box-shadow: 0 14px 0 rgba(61,44,78,.18); font-size: 92px; font-weight: 700; white-space: nowrap; transform: scale(0); }
     #palavra { top: 250px; left: 420px; width: 1000px; }`;
  const html = stageHtml(css, BG(espaco.cenaBase({ comTuti: false })) + '<div id="faixa"><div id="titulo">O Foguete da Tuti</div></div>' + CORPO());
  const janelas = [{ ini: T.bip, fim: T.bipFim + 0.5, txt: 'Hello!' }];
  function frame(t) {
    const tG = t + tGlobal0;
    const ops = [];
    ops.push({ id: 'titulo', style: `transform:scale(${f(Z.outBack(Z.prog(t, 0.45, 0.55), 2))}) rotate(${f(-1.6 + Math.sin((tG * 2 * Math.PI) / 4.5))}deg)` });
    const kB = (t - T.bip) / 0.45;
    ops.push(grupo('bip', { dy: kB > 0 && kB < 4 ? -30 * Math.abs(Math.sin(Math.PI * kB)) : 0 }));
    ops.push(...opsPalavra(t, janelas), ...opsSuaVez(t, 1e9));
    const kIn = Z.outCubic(Z.prog(t, 0.15, 0.85));
    ops.push({ id: 'tuti', style: `transform:translate(${f(-760 * (1 - kIn))}px,0px)`, html: tutiFrame(t, Object.assign({ track, fala, pulos, ajuste, tGlobal: tG, width: 680, height: 748 }, TUTI)) });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { nome: 'abertura', dur, html, frame, sons, falas, T };
}

// ===== Lições: cinco números que acendem, e depois a criança repete =====
function criarLicao(n, { tGlobal0 = 0, entrada = '#fff', saida = '#fff' } = {}) {
  const m = manifesto();
  const conta = n === 1 ? 'v6_conta_1a5' : 'v6_conta_6a10';
  const base = n === 1 ? 1 : 6;
  const { T, itens, fim } = fila(m, 0.5, [['intro', `v6_l${n}_intro`, 0.3], ['c1', conta, 0.5], ['rep', 'v6_repita', 0.7], ['c2', conta, 0.4], ['bem', n === 1 ? 'v6_muito_bem' : 'v6_l2_fim', 0.8]]);
  T.saida = fim + 0.8;
  const dur = T.saida + 0.6;
  const partes = m[conta].partes;
  const t1 = partes.map((p) => T.c1 + p.ini);
  const t2 = partes.map((p) => T.c2 + p.ini);
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens);
  const track = [
    { t: 0, pose: P.OLHANDO },
    { t: T.intro - 0.2, pose: P.FELIZ, dur: 0.4 },
    { t: T.c1 - 0.3, pose: P.APONTANDO, dur: 0.4 },
    { t: T.rep - 0.1, pose: P.FELIZ, dur: 0.4 },
    { t: T.c2 - 0.3, pose: P.APONTANDO, dur: 0.4 },
    { t: T.bem - 0.1, pose: P.COMEMORA, dur: 0.3 },
    { t: T.saida, pose: P.OLHANDO, dur: 0.5 },
  ];
  const pulos = t1.concat(t2).map((t) => ({ t, n: 1, altura: 16, periodo: 0.34 })).concat([{ t: T.bem, n: 2, altura: 70, periodo: 0.44 }]);
  const sons = [{ t: T.saida, tipo: 'sopro', ganho: 0.35 }, { t: T.c2 - 0.3, tipo: 'plim', ganho: 0.3 }];
  t1.concat(t2).forEach((t, i) => sons.push({ t, tipo: 'nota', freq: NOTAS[base - 1 + (i % 5)], ganho: 0.05 }));
  kit.resetIds();
  const html = stageHtml(CSS_BASE + '#suavez { left: 1590px; top: 30px; }', BG(espaco.fundo()) + EXTRA + CORPO());
  const X = [640, 880, 1120, 1360, 1600];
  /** Estrelinhas que mostram a quantidade, em fileiras de até cinco, acima do cartão. */
  const pontos = (q, cx, k) => {
    let s = '';
    for (let j = 0; j < q; j++) {
      const linha = Math.floor(j / 5);
      const naLinha = Math.min(5, q - linha * 5);
      const x = cx + ((j % 5) - (naLinha - 1) / 2) * 40;
      s += kit.withOutline(4, () => kit.sparkle(x, 318 - linha * 42, 17 * k, 0, '#FFD23F'));
    }
    return s;
  };
  function frame(t) {
    const tG = t + tGlobal0;
    const ops = [];
    let s = '';
    for (let i = 0; i < 5; i++) {
      const num = base + i;
      const segunda = t >= T.rep - 0.2;
      const k = segunda ? Z.prog(t, t2[i], 0.35) : Z.prog(t, t1[i], 0.35);
      const apaga = segunda ? 0 : Z.prog(t, T.rep - 0.5, 0.3);
      const aceso = Z.clamp(k) * (1 - apaga);
      const pulo = Z.bump(k);
      const entra = Z.outBack(Z.prog(t, 0.3 + 0.08 * i, 0.45), 1.6);
      const y = 380 - 34 * pulo;
      s += `<g transform="translate(${X[i]},${f(y + 130)}) scale(${f(entra * (1 + 0.1 * pulo))}) translate(${-X[i]},${f(-(y + 130))})">`;
      s += `<rect x="${X[i] - 104}" y="${f(y)}" width="208" height="260" rx="40" fill="${aceso > 0.5 ? '#FFF6C4' : '#FFFFFF'}" stroke="${LINE}" stroke-width="7" opacity="${f(0.55 + 0.45 * aceso)}"/>`;
      s += tx(num, X[i], y + 190, num === 10 ? 150 : 180, aceso > 0.5 ? CORES_NUM[num - 1] : '#C9CEDD');
      s += '</g>';
      if (aceso > 0.02) s += `<g opacity="${f(aceso)}">${tx(PAL[num], X[i], 730, 62 * Z.outBack(Z.clamp(k), 2), '#FFFFFF')}${pontos(num, X[i], Z.clamp(k))}</g>`;
    }
    ops.push({ id: 'extra', html: s });
    ops.push(...opsPalavra(t, []), ...opsSuaVez(t, T.c2, m[conta].dur + 0.4));
    ops.push({ id: 'tuti', html: tutiFrame(t, Object.assign({ track, fala, pulos, tGlobal: tG }, TUTI)) });
    const vida = t - T.bem;
    ops.push({ id: 'fx', html: vida >= 0 && t < T.saida + 0.5 ? `<g opacity="${f(1 - Z.prog(t, T.saida, 0.5))}">${confete(vida, { pecas: 50 })}</g>` : '' });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { nome: `l${n}`, dur, html, frame, sons, falas, T };
}

// ===== Jogo 1: contar com o corpo (clap three, jump five) =====
function criarCorpo({ tGlobal0 = 0, entrada = '#fff', saida = '#fff' } = {}) {
  const m = manifesto();
  const A = fila(m, 0.5, [['pal', 'v6_j1_palmas', 0.3], ['c3', 'v6_conta_1a3', 0.4], ['pul', 'v6_j1_pulos', 0.7], ['c5', 'v6_conta_1a5', 0.4], ['vez', 'v6_j1_vez', 0.9], ['k1', 'v6_j1_c1', 0.4]]);
  const T = A.T;
  const ESP = 0.85; // intervalo entre os gestos na vez da criança
  T.v1 = T.k1Fim + 0.3;
  T.k2 = T.v1 + 3 * ESP + 0.5;
  T.k2Fim = T.k2 + m.v6_j1_c2.dur;
  T.v2 = T.k2Fim + 0.3;
  T.bem = T.v2 + 5 * ESP + 0.5;
  T.saida = T.bem + m.v6_muito_bem.dur + 0.8;
  const dur = T.saida + 0.6;
  const itens = A.itens.concat([{ t: T.k2, id: 'v6_j1_c2', dur: m.v6_j1_c2.dur }, { t: T.bem, id: 'v6_muito_bem', dur: m.v6_muito_bem.dur }]);
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens);
  // cada gesto: { t, num, tipo }
  const gestos = []
    .concat(m.v6_conta_1a3.partes.map((p, i) => ({ t: T.c3 + p.ini, num: i + 1, tipo: 'palma' })))
    .concat(m.v6_conta_1a5.partes.map((p, i) => ({ t: T.c5 + p.ini, num: i + 1, tipo: 'pulo' })))
    .concat([0, 1, 2].map((i) => ({ t: T.v1 + i * ESP, num: i + 1, tipo: 'palma', mudo: true })))
    .concat([0, 1, 2, 3, 4].map((i) => ({ t: T.v2 + i * ESP, num: i + 1, tipo: 'pulo', mudo: true })));
  const track = [
    { t: 0, pose: P.OLHANDO },
    { t: T.pal - 0.2, pose: P.FELIZ, dur: 0.4 },
    { t: T.c3 - 0.3, pose: PALMAS, dur: 0.3 },
    { t: T.pul - 0.1, pose: P.FELIZ, dur: 0.4 },
    { t: T.c5 - 0.2, pose: BRACOS_ALTOS, dur: 0.3 },
    { t: T.vez - 0.1, pose: P.FELIZ, dur: 0.4 },
    { t: T.v1 - 0.3, pose: PALMAS, dur: 0.3 },
    { t: T.k2 - 0.1, pose: P.FELIZ, dur: 0.4 },
    { t: T.v2 - 0.2, pose: BRACOS_ALTOS, dur: 0.3 },
    { t: T.bem - 0.1, pose: P.COMEMORA, dur: 0.3 },
  ];
  const pulos = gestos.filter((g) => g.tipo === 'pulo').map((g) => ({ t: g.t, n: 1, altura: 80, periodo: 0.6 }));
  const ajuste = (p, t) => {
    for (const g of gestos) {
      if (g.tipo !== 'palma') continue;
      const k = (t - g.t) / 0.5;
      if (k > -0.2 && k < 1) {
        const a = Z.bump(Z.clamp(k + 0.2, 0, 1));
        p.armL = [300 + 160 * a, 640];
        p.armR = [700 - 160 * a, 640];
        p.armLFront = true;
        p.armRFront = true;
      }
    }
  };
  const sons = [{ t: T.saida, tipo: 'sopro', ganho: 0.35 }, { t: T.v1 - 0.1, tipo: 'plim', ganho: 0.3 }, { t: T.v2 - 0.1, tipo: 'plim', ganho: 0.3 }];
  for (const g of gestos) sons.push(g.tipo === 'palma' ? { t: g.t + 0.1, tipo: 'tique', ganho: g.mudo ? 0.5 : 0.16, agudo: true } : { t: g.t + 0.42, tipo: 'pouso', ganho: g.mudo ? 0.3 : 0.1 });
  kit.resetIds();
  const css = CSS_BASE.replace('#tuti { position: absolute; left: -40px; top: 436px; width: 560px; height: 616px; }', '#tuti { position: absolute; left: 330px; top: 250px; width: 784px; height: 862px; }') + '#palavra { left: -240px; top: 60px; } #suavez { left: 1560px; top: 60px; }';
  const html = stageHtml(css, BG(espaco.fundo()) + EXTRA + CORPO());
  const en1 = segsDe(m, 'v6_j1_palmas', T.pal).find((x) => x.voz === 'en');
  const en2 = segsDe(m, 'v6_j1_pulos', T.pul).find((x) => x.voz === 'en');
  const janelas = [
    { ini: en1.ini, fim: T.c3Fim + 0.3, txt: 'Clap three!' },
    { ini: en2.ini, fim: T.c5Fim + 0.3, txt: 'Jump five!' },
    { ini: T.k1, fim: T.v1 + 3 * ESP, txt: 'Clap three!' },
    { ini: T.k2, fim: T.v2 + 5 * ESP, txt: 'Jump five!' },
  ];
  function frame(t) {
    const tG = t + tGlobal0;
    const ops = [];
    let s = '';
    const g = gestos.filter((x) => t >= x.t).pop();
    if (g && t < g.t + 1.1) s = `<g opacity="${f(1 - Z.prog(t, g.t + 0.8, 0.3))}">${numeroGrande(g.num, 1420, 640, 380, Z.prog(t, g.t, 0.3))}</g>`;
    ops.push({ id: 'extra', html: s });
    ops.push(...opsPalavra(t, janelas));
    if (t >= T.v1 - 0.1 && t < T.v1 + 3 * ESP + 0.3) ops.push(...opsSuaVez(t, T.v1, 3 * ESP));
    else ops.push(...opsSuaVez(t, T.v2, 5 * ESP));
    ops.push({ id: 'tuti', html: tutiFrame(t, Object.assign({ track, fala, pulos, ajuste, tGlobal: tG, width: 784, height: 862 }, TUTI)) });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { nome: 'j1', dur, html, frame, sons, falas, T };
}

// ===== Jogos 2 e 4: três cards com números =====
function criarCartas(n, { tGlobal0 = 0, entrada = null, saida = null } = {}) {
  return criarCenaCards({ num: n, q: desafio(n), narrDir: NARR, idPergunta: `v6_j${n}_pergunta`, idResposta: `v6_j${n}_resposta`, contagem: CONT, tGlobal0, entrada, saida, fundo: () => espaco.fundo({ limpo: true }), tutiOpts: TUTI });
}

// ===== Jogo 3: quantas estrelas? =====
function criarEstrelas({ tGlobal0 = 0, entrada = '#fff', saida = '#fff' } = {}) {
  const m = manifesto();
  const EST = [[700, 330], [960, 270], [1230, 350], [1500, 280], [1730, 400], [860, 520], [1360, 560]];
  const T = { banner: 0.1, selo: 0.35, pergunta: 1.2 };
  T.fimPergunta = T.pergunta + m.v6_j3_pergunta.dur;
  T.contagem = T.fimPergunta + 0.6;
  T.revela = T.contagem + CONT + 0.1;
  T.vamos = T.revela + 0.5;
  T.conta = T.vamos + m.v6_j3_vamos.dur + 0.4;
  T.numeros = m.v6_conta_1a7.partes.map((p) => T.conta + p.ini);
  T.festa = T.conta + m.v6_conta_1a7.dur + 0.25;
  T.fim = T.festa + 1.25;
  T.saida = T.fim + m.v6_j3_fim.dur + 1.2;
  const dur = T.saida + 0.75;
  const itens = [
    { t: T.pergunta, id: 'v6_j3_pergunta', dur: m.v6_j3_pergunta.dur },
    { t: T.vamos, id: 'v6_j3_vamos', dur: m.v6_j3_vamos.dur },
    { t: T.conta, id: 'v6_conta_1a7', dur: m.v6_conta_1a7.dur },
    { t: T.fim, id: 'v6_j3_fim', dur: m.v6_j3_fim.dur },
  ];
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens);
  const sons = [{ t: T.selo, tipo: 'plim', ganho: 0.5 }].concat(P.sonsContagem(T, CONT));
  T.numeros.forEach((t, i) => sons.push({ t, tipo: 'nota', freq: NOTAS[i], ganho: 0.05 }));
  sons.push({ t: T.festa, tipo: 'acerto', ganho: 0.55 }, { t: T.saida, tipo: 'sopro', ganho: 0.4 });
  const track = P.pensando([{ t: 0, pose: P.OLHANDO }, { t: T.pergunta - 0.3, pose: 'perguntando', dur: 0.45 }, { t: T.fimPergunta + 0.15, pose: P.PENSANDO, dur: 0.5 }], T);
  track.push({ t: T.vamos - 0.1, pose: P.APONTANDO, dur: 0.4 }, { t: T.festa - 0.1, pose: P.COMEMORA, dur: 0.28 }, { t: T.saida, pose: P.OLHANDO, dur: 0.5 });
  const pulos = [{ t: T.festa, n: 2, altura: 74, periodo: 0.44 }];
  kit.resetIds();
  const html = stageHtml(P.cssBase() + '#extra { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }', BG(espaco.fundo({ limpo: true })) + P.bannerHtml(3, 'Quantas estrelas?') + EXTRA + '<div id="timer"></div><div id="tuti"></div><svg id="fx" viewBox="0 0 1920 1080"></svg><div id="fade"></div>');
  function frame(t) {
    const tG = t + tGlobal0;
    const ops = P.opsBanner(t, T);
    let s = '';
    const some = 1 - Z.prog(t, T.saida, 0.4);
    EST.forEach(([x, y], i) => {
      const entra = Z.outBack(Z.prog(t, 0.5 + 0.1 * i, 0.4), 2);
      const k = Z.prog(t, T.numeros[i], 0.4);
      const pisca = 1 + 0.06 * Math.sin((tG * 2 * Math.PI) / 1.7 + i * 1.3);
      const r = 62 * entra * pisca * (1 + 0.35 * Z.bump(k) + 0.12 * Z.clamp(k));
      s += `<g opacity="${f(some)}">` + kit.withOutline(7, () => kit.sparkle(x, y, r, 0, k > 0 ? '#FFD23F' : '#FFF1B8'));
      if (k > 0) s += tx(i + 1, x + 78, y - 34, 84 * Z.outBack(k, 2.2), '#FFFFFF');
      s += '</g>';
    });
    const k7 = Z.prog(t, T.festa, 0.5);
    if (k7 > 0) s += `<g opacity="${f(some)}">${numeroGrande(7, 1130, 860, 300, k7)}</g>`;
    ops.push({ id: 'extra', html: s });
    ops.push(...P.opsTimer(t, T, CONT));
    ops.push({ id: 'tuti', html: tutiFrame(t, Object.assign({ track, fala, pulos, tGlobal: tG }, TUTI)) });
    const vida = t - (T.festa + 0.15);
    ops.push({ id: 'fx', html: vida >= 0 && t < T.saida + 0.7 ? `<g opacity="${f(1 - Z.prog(t, T.saida, 0.5))}">${confete(vida)}</g>` : '' });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { nome: 'j3', dur, html, frame, sons, falas, T };
}

// ===== Jogo 4, primeira parte: o Bip conta e pula um número =====
function criarBipConta({ tGlobal0 = 0, entrada = '#fff', saida = null } = {}) {
  const m = manifesto();
  const { T, itens, fim } = fila(m, 0.5, [['intro', 'v6_j4_intro', 0.3], ['bip', 'v6_j4_bip', 0.6]]);
  T.saida = fim + 1.0;
  const dur = T.saida + 0.5;
  const tp = m.v6_j4_bip.partes.map((p) => T.bip + p.ini);
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens.filter((x) => x.chave === 'intro'));
  const track = [{ t: 0, pose: P.OLHANDO }, { t: T.intro - 0.2, pose: P.APONTANDO, dur: 0.4 }, { t: T.bip - 0.2, pose: P.PENSANDO, dur: 0.4 }];
  const sons = tp.map((t, i) => ({ t, tipo: 'nota', freq: NOTAS[[0, 1, 3][i]], ganho: 0.05 }));
  kit.resetIds();
  const bipSvg = `<svg id="bipzao" viewBox="0 0 1000 1000" style="position:absolute;left:1330px;top:380px;width:560px;height:560px">${kit.withOutline(6.5 / 0.56, () => espaco.bip({ acena: false }))}</svg>`;
  const html = stageHtml(CSS_BASE, BG(espaco.fundo({ limpo: true })) + bipSvg + EXTRA + CORPO());
  const X = [640, 860, 1080, 1300];
  function frame(t) {
    const tG = t + tGlobal0;
    const ops = [];
    let s = '';
    const some = 1 - Z.prog(t, T.saida, 0.4);
    const mostra = [[1, tp[0]], [2, tp[1]], ['?', tp[2] - 0.05], [4, tp[2]]];
    mostra.forEach(([txt, t0], i) => {
      const k = Z.prog(t, t0, 0.35);
      if (k <= 0) return;
      const falta = txt === '?';
      const bal = falta ? 8 * Math.sin((t - t0) * 2 * Math.PI * 1.2) : 0;
      s += `<g opacity="${f(some)}" transform="rotate(${f(bal)} ${X[i]} 470)"><rect x="${X[i] - 96}" y="350" width="192" height="240" rx="38" fill="${falta ? '#FFD9E4' : '#FFFFFF'}" stroke="${LINE}" stroke-width="7" ${falta ? 'stroke-dasharray="18 14"' : ''}/>${tx(txt, X[i], 530, 170 * Z.outBack(k, 2), falta ? '#E25A52' : CORES_NUM[txt - 1])}</g>`;
    });
    ops.push({ id: 'extra', html: s });
    const kb = tp.map((x) => Z.bump(Z.prog(t, x, 0.4))).reduce((a, b) => a + b, 0);
    ops.push({ id: 'bipzao', style: `position:absolute;left:1330px;top:380px;width:560px;height:560px;transform:translate(0px,${f(-26 * kb)}px)` });
    ops.push(...opsPalavra(t, []), ...opsSuaVez(t, 1e9));
    ops.push({ id: 'tuti', html: tutiFrame(t, Object.assign({ track, fala, pulos: [], tGlobal: tG }, TUTI)) });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { nome: 'j4a', dur, html, frame, sons, falas, T };
}

// ===== Jogo 5 · Onde está o ten? (memória) =====
function criarMemoria({ tGlobal0 = 0, entrada = null, saida = null } = {}) {
  const d = desafio(5);
  const m = manifesto();
  const fm = m.v6_j5_mostrar;
  const fq = m.v6_j5_pergunta; // partes: aviso, pergunta, "no um", "no dois", "no três"
  const fr = m.v6_j5_resposta;
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
    { t: T.mostrar, id: 'v6_j5_mostrar', dur: fm.dur },
    { t: T.pergunta, id: 'v6_j5_pergunta', dur: fq.dur },
    { t: T.resposta, id: 'v6_j5_resposta', dur: fr.dur },
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
    `<svg id="bg" viewBox="0 0 1920 1080">${espaco.fundo({ limpo: true })}</svg>` +
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

      // "olhe bem onde o ten está": o card do dez pulsa
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
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, tGlobal: tG, capacete: true }) });
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



// ===== Final: contagem regressiva, decolagem e chegada à Lua =====
function criarFinal({ tGlobal0 = 0 } = {}) {
  const m = manifesto();
  const { T, itens: it1, fim } = fila(m, 0.6, [['intro', 'v6_f_intro', 0.3], ['c1', 'v6_conta_10a6', 0.6], ['c2', 'v6_conta_5a1', 0.8], ['bip', 'v6_f_bip', 0.5]]);
  T.bordo = T.intro + m.v6_f_intro.dur * 0.3; // "Todos a bordo!"
  T.dec = fim + 0.15; // o foguete sobe
  T.troca = T.dec + 2.3; // clarão e chegada à Lua
  T.lua = T.troca + 3.1; // depois do sino de chegada, para a voz sair limpa
  T.luaFim = T.lua + m.v6_f_lua.dur;
  T.tchau = T.luaFim + 0.5;
  T.tchauFim = T.tchau + m.v6_tchau.dur;
  T.saida = T.tchauFim + 1.8;
  const dur = T.saida + 0.6;
  const itens = it1.concat([{ t: T.lua, id: 'v6_f_lua', dur: m.v6_f_lua.dur, chave: 'lua' }, { t: T.tchau, id: 'v6_tchau', dur: m.v6_tchau.dur, chave: 'tchau' }]);
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens.filter((x) => x.chave !== 'bip'));
  const nums = m.v6_conta_10a6.partes.map((p, i) => ({ t: T.c1 + p.ini, num: 10 - i })).concat(m.v6_conta_5a1.partes.map((p, i) => ({ t: T.c2 + p.ini, num: 5 - i })));
  const track = [
    { t: 0, pose: P.OLHANDO },
    { t: T.intro - 0.2, pose: P.COMEMORA, dur: 0.3 },
    { t: T.troca, pose: P.COMEMORA, dur: 0.2 },
    { t: T.lua + 1.4, pose: P.FELIZ, dur: 0.5 },
    { t: T.tchau - 0.25, pose: P.ACENO, dur: 0.4 },
  ];
  const pulos = [{ t: T.intro, n: 2, altura: 50, periodo: 0.44 }, { t: T.lua - 0.2, n: 3, altura: 70, periodo: 0.5 }];
  const ajuste = P.aceno(T.tchau - 0.25, dur + 1);
  const sons = nums.map((x) => ({ t: x.t, tipo: 'tique', ganho: 0.16, agudo: x.num % 2 === 0 }));
  sons.push({ t: T.bordo + 0.2, tipo: 'sopro', ganho: 0.3 }, { t: T.dec - 0.1, tipo: 'sopro', ganho: 0.6 }, { t: T.dec + 0.5, tipo: 'sopro', ganho: 0.5 }, { t: T.dec + 1.1, tipo: 'sopro', ganho: 0.4 });
  sons.push({ t: T.troca + 1.5, tipo: 'pouso', ganho: 0.5 }, { t: T.troca + 1.55, tipo: 'acerto', ganho: 0.5 });
  kit.resetIds();
  const base = espaco.cenaBase({ comTuti: false });
  const lua = espaco.cenaLua({ comTuti: false });
  const css = CSS_BASE.replace('left: -40px; top: 436px; width: 560px; height: 616px;', 'left: -52px; top: 424px; width: 600px; height: 660px;').replace('#fade { background: #fff; opacity: 0; }', '#fade { background: #fff; opacity: 1; }') + '#bg2 { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; opacity: 0; } #palavra { top: 60px; }';
  const html = stageHtml(css, BG(base) + `<svg id="bg2" viewBox="0 0 1920 1080">${lua}</svg>` + EXTRA + CORPO());
  const enT = segsDe(m, 'v6_tchau', T.tchau).find((x) => x.voz === 'en');
  const janelas = [{ ini: T.bip, fim: T.dec + 1.6, txt: 'Blast off!' }, { ini: enT.ini, fim: enT.fim + 1.4, txt: 'Bye-bye!' }];
  function frame(t) {
    const tG = t + tGlobal0;
    const ops = [];
    const naLua = t >= T.troca;
    ops.push({ id: 'bg2', style: `opacity:${naLua ? 1 : 0}` });
    // todos a bordo: a Tuti e o Bip correm para o foguete
    const kB = Z.inOutCubic(Z.prog(t, T.bordo, 0.9));
    ops.push(grupo('bip', { dx: 470 * kB, dy: -60 * Math.sin(Math.PI * kB), sc: Math.max(0.001, 1 - kB) }));
    // o foguete treme, acende e sobe
    const treme = t > T.c2 && t < T.dec ? 2.2 * Math.sin(t * 60) * Z.prog(t, T.c2, T.dec - T.c2) : 0;
    // com todos a bordo, o foguete balança de leve: ninguém fica parado enquanto a Tuti fala lá de dentro
    const sobe = -1500 * Z.inCubic(Z.prog(t, T.dec, 2.1)) + (kB >= 1 && t < T.dec ? 5 * Math.sin(t * 5.2) : 0);
    ops.push({ id: 'fog', style: `transform:translate(${f(treme)}px,${f(sobe)}px)` });
    ops.push({ id: 'chama', style: `opacity:${t >= T.bip ? 1 : 0};transform-box:fill-box;transform-origin:50% 0%;transform:scaleY(${f(0.8 + 0.25 * Math.sin(t * 40) + 0.6 * Z.prog(t, T.dec, 0.6))})` });
    // na Lua: o foguete pousa e o Bip comemora
    const kP = Z.outCubic(Z.prog(t, T.troca + 0.2, 1.3));
    ops.push({ id: 'fog2', style: `transform:translate(0px,${f(-900 * (1 - kP))}px)` });
    const kq = (t - T.lua) / 0.5;
    ops.push(grupo('bip2', { dy: kq > 0 && kq < 4 ? -30 * Math.abs(Math.sin(Math.PI * kq)) : 0, sc: Math.max(0.001, Z.outBack(Z.prog(t, T.troca + 1.5, 0.4), 1.6)) }));
    // os números gigantes da contagem
    let s = '';
    const g = nums.filter((x) => t >= x.t).pop();
    if (g && t < T.dec + 0.2) s = `<g opacity="${f(1 - Z.prog(t, T.dec - 0.3, 0.4))}">${numeroGrande(g.num, 640, 640, 430, Z.prog(t, g.t, 0.28))}</g>`;
    ops.push({ id: 'extra', html: s });
    ops.push(...opsPalavra(t, janelas), ...opsSuaVez(t, 1e9));
    let estilo;
    if (!naLua) estilo = `transform:translate(${f(1250 * kB)}px,${f(-90 * Math.sin(Math.PI * kB))}px) scale(${f(Math.max(0.001, 1 - kB))})`;
    else estilo = `transform:scale(${f(Z.outBack(Z.prog(t, T.troca + 1.5, 0.45), 1.4))})`;
    ops.push({ id: 'tuti', style: estilo, html: tutiFrame(t, Object.assign({ track, fala, pulos, ajuste, tGlobal: tG, width: 600, height: 660 }, TUTI)) });
    const vida = t - (T.troca + 1.6);
    ops.push({ id: 'fx', html: vida > 0 && t < T.tchauFim + 1.2 ? `<g opacity="${f(1 - Z.prog(t, T.tchauFim + 0.4, 0.8))}">${confete(vida)}</g>` : '' });
    const clarao = Z.prog(t, T.troca - 0.5, 0.5) * (1 - Z.prog(t, T.troca, 0.6));
    const veuIn = 1 - Z.prog(t, 0, 0.4);
    const veuOut = Z.prog(t, dur - 0.9, 0.9);
    ops.push({ id: 'fade', style: `background:#fff;opacity:${f(Z.clamp(Math.max(clarao, veuIn, veuOut)))}` });
    return ops;
  }
  return { nome: 'final', dur, html, frame, sons, falas, T };
}

module.exports = { criarAbertura, criarLicao, criarCorpo, criarCartas, criarEstrelas, criarBipConta, criarMemoria, criarFinal };
