'use strict';
/**
 * Vídeo 7 — as cenas de O Arco-Íris Sumiu (cores em inglês): a abertura no mundo
 * cinza, uma cena para cada cor (a parte do campo se pinta depois do "Sua vez!"),
 * o jogo do camaleão, os jogos de cards, a memória e o arco-íris do final.
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
const cores = require('../art/cores');
const { fundoQuiz } = require('../art/cenario');
const desafios = require('./desafios');
const roteiro = require('./roteiro');

const NARR = path.resolve(__dirname, '..', '..', 'v7-ingles-cores', 'narracao');
const CONT = roteiro.contagem;
const LINE = P.LINE;
const f = P.f;
const PAL = [];
const CORES = roteiro.CORES;
const TUTI = { boina: true };

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

const CINZA = '#B9B9C6';
const hexDe = (en) => CORES.find((c) => c.en === en).hex;
// a palavra da cor é escrita na própria cor, então a etiqueta fica branca
const LEO_CSS = '#leo { position: absolute; } #palavra div { background: #fff; }';
/** O Leo na tela: posição, tamanho, cor e um pulinho `dy`. */
const opLeo = (cor, { x = 740, y = 810, tam = 280, dy = 0 } = {}) => ({
  id: 'leo',
  style: `left:${x}px;top:${y}px;width:${tam}px;height:${tam}px;transform:translate(0px,${f(dy)}px)`,
  html: `<svg viewBox="0 0 1000 1000" width="${tam}" height="${tam}">${kit.withOutline(6.5 / (tam / 1000), () => cores.camaleao(cor))}</svg>`,
});
const pulo2 = (t, t0, h = 26) => {
  const k = (t - t0) / 0.42;
  return k > 0 && k < 2 ? -h * Math.abs(Math.sin(Math.PI * k)) : 0;
};
/** Estado das camadas de cor: as de `feitas` visíveis, as outras não; `agora` = [cor, k]. */
const camadas = (feitas, agora) => CORES.map((c) => ({ id: `c_${c.en}`, style: `opacity:${f(feitas.includes(c.en) ? 1 : agora && agora[0] === c.en ? agora[1] : 0)}` }));

// ===== Abertura: o mundo cinza =====
function criarAbertura({ tGlobal0 = 0, entrada = '#fff', saida = null } = {}) {
  const m = manifesto();
  const { T, itens, fim } = fila(m, 0.6, [['a1', 'v7_ab_1', 0.4], ['leo', 'v7_ab_leo', 0.3], ['a2', 'v7_ab_2', 0.4]]);
  const dur = fim + 0.9;
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens.filter((x) => x.chave !== 'leo'));
  const S = segsDe(m, 'v7_ab_1', T.a1);
  const track = [
    { t: 0, pose: P.FRENTE },
    { t: T.a1 - 0.25, pose: P.ACENO, dur: 0.35 },
    { t: S[0].fim + 0.3, pose: 'perguntando', dur: 0.45 },
    { t: T.a1Fim - 2.4, pose: P.APONTANDO, dur: 0.45 },
    { t: T.a2 - 0.1, pose: P.FELIZ, dur: 0.45 },
    { t: T.a2Fim - 1.3, pose: P.COMEMORA, dur: 0.3 },
    { t: dur - 0.4, pose: P.OLHANDO, dur: 0.4 },
  ];
  const pulos = [{ t: T.a2Fim - 1.2, n: 2, altura: 60, periodo: 0.44 }];
  const ajuste = P.aceno(T.a1 - 0.25, S[0].fim + 0.3);
  const sons = [{ t: 0.45, tipo: 'plim', ganho: 0.5 }];
  kit.resetIds();
  const css = CSS_BASE.replace('#fade { background: #fff; opacity: 0; }', '#fade { background: #fff; opacity: 1; }') + LEO_CSS +
    `#faixa { position: absolute; left: 0; top: 34px; width: 1920px; display: flex; justify-content: center; }
     #titulo { padding: 10px 70px 14px; background: #FFD23F; border: 8px solid ${LINE}; border-radius: 90px; box-shadow: 0 14px 0 rgba(61,44,78,.18); font-size: 92px; font-weight: 700; white-space: nowrap; transform: scale(0); }
     #palavra { top: 250px; }`;
  const html = stageHtml(css, BG(cores.campo()) + '<div id="leo"></div><div id="faixa"><div id="titulo">O Arco-Íris Sumiu</div></div>' + CORPO());
  const janelas = [{ ini: T.leo, fim: T.leoFim + 0.5, txt: 'Hello!' }];
  function frame(t) {
    const tG = t + tGlobal0;
    const ops = camadas([], null);
    ops.push({ id: 'titulo', style: `transform:scale(${f(Z.outBack(Z.prog(t, 0.45, 0.55), 2) * (1 - Z.prog(t, dur - 0.6, 0.3)))}) rotate(${f(-1.6 + Math.sin((tG * 2 * Math.PI) / 4.5))}deg)` });
    ops.push(opLeo(CINZA, { dy: pulo2(t, T.leo) + pulo2(t, T.leo + 0.9) }));
    ops.push(...opsPalavra(t, janelas), ...opsSuaVez(t, 1e9));
    ops.push({ id: 'tuti', html: tutiFrame(t, Object.assign({ track, fala, pulos, ajuste, tGlobal: tG }, TUTI)) });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { nome: 'abertura', dur, html, frame, sons, falas, T };
}

// ===== Uma cena por cor: a Tuti ensina, a criança repete e a tinta espirra =====
function criarCor(i, { tGlobal0 = 0, entrada = null, saida = null } = {}) {
  const m = manifesto();
  const C = CORES[i];
  const feitas = CORES.slice(0, i).map((c) => c.en);
  const elogio = i === 2 || i === 5;
  const T = { fala: 0.5 };
  T.falaFim = T.fala + m[`v7_c_${C.en}`].dur;
  T.suaVez = T.falaFim + 0.2;
  T.splash = T.suaVez + 3 + 0.1;
  T.leo = T.splash + 0.75;
  T.leoFim = T.leo + m[`v7_leo_${C.en}`].dur;
  T.bem = T.leoFim + 0.4;
  T.saida = elogio ? T.bem + m.v7_muito_bem.dur + 0.7 : T.leoFim + 0.9;
  const dur = T.saida + (saida ? 0.6 : 0.1);
  const itens = [{ t: T.fala, id: `v7_c_${C.en}`, dur: m[`v7_c_${C.en}`].dur }];
  if (elogio) itens.push({ t: T.bem, id: 'v7_muito_bem', dur: m.v7_muito_bem.dur });
  const falas = itens.map(({ t, id }) => ({ t, id })).concat([{ t: T.leo, id: `v7_leo_${C.en}` }]);
  const fala = vozes(itens);
  const en = segsDe(m, `v7_c_${C.en}`, T.fala).filter((x) => x.voz === 'en');
  const track = [
    { t: 0, pose: P.OLHANDO },
    { t: T.fala - 0.1, pose: P.APONTANDO, dur: 0.4 },
    { t: T.suaVez - 0.2, pose: P.FELIZ, dur: 0.4 },
    { t: T.splash, pose: P.COMEMORA, dur: 0.28 },
    { t: T.leoFim + 0.2, pose: elogio ? P.FELIZ : P.OLHANDO, dur: 0.4 },
  ];
  const pulos = [{ t: T.splash + 0.05, n: 2, altura: 60, periodo: 0.44 }];
  const sons = [{ t: T.suaVez, tipo: 'plim', ganho: 0.3 }, { t: T.splash - 0.05, tipo: 'sopro', ganho: 0.5 }, { t: T.splash + 0.05, tipo: 'pouso', ganho: 0.5 }];
  kit.resetIds();
  const html = stageHtml(CSS_BASE + LEO_CSS, BG(cores.campo({ pintadas: feitas })) + '<div id="leo"></div>' + CORPO());
  const janelas = [{ ini: en[0].ini, fim: T.saida - 0.2, txt: `<span style="color:${C.en === 'yellow' ? LINE : C.hex}">${C.en}</span>` }];
  const [ax, ay, ar] = cores.ALVOS[C.en];
  const corAntes = i > 0 ? CORES[i - 1].hex : CINZA;
  function frame(t) {
    const tG = t + tGlobal0;
    const k = Z.prog(t, T.splash, 0.6);
    const ops = camadas(feitas, [C.en, Z.outCubic(k)]);
    ops.push(opLeo(t >= T.splash + 0.3 ? C.hex : corAntes, { dy: pulo2(t, T.leo) }));
    ops.push(...opsPalavra(t, janelas), ...opsSuaVez(t, T.suaVez));
    ops.push({ id: 'tuti', html: tutiFrame(t, Object.assign({ track, fala, pulos, tGlobal: tG }, TUTI)) });
    let fx = '';
    if (k > 0 && t < T.splash + 2.6) {
      const e = Z.outCubic(Z.prog(t, T.splash, 0.9));
      fx += `<circle cx="${ax}" cy="${ay}" r="${f(ar * (0.3 + 1.5 * e))}" fill="none" stroke="${C.hex}" stroke-width="${f(46 * (1 - e))}" opacity="${f(1 - e)}"/>`;
      for (let j = 0; j < 9; j++) {
        const a = (j / 9) * Math.PI * 2;
        fx += `<circle cx="${f(ax + Math.cos(a) * ar * 1.5 * e)}" cy="${f(ay + Math.sin(a) * ar * 1.5 * e + 120 * e * e)}" r="${f(24 * (1 - e) + 4)}" fill="${C.hex}" stroke="${LINE}" stroke-width="5" opacity="${f(1 - e)}"/>`;
      }
      fx += `<g opacity="${f(1 - Z.prog(t, T.splash + 2, 0.6))}">${P.brilhos(t, T.splash, ax, ay, ar * 1.2, ar * 1.1)}</g>`;
    }
    ops.push({ id: 'fx', html: fx });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { nome: `c${i + 1}`, dur, html, frame, sons, falas, T };
}

// ===== Jogo 1: o camaleão muda de cor =====
function criarCamaleao({ tGlobal0 = 0, entrada = '#fff', saida = '#fff' } = {}) {
  const m = manifesto();
  const RODADAS = ['blue', 'red', 'yellow'];
  const ESPERA = 5;
  const T = { intro: 0.6 };
  T.introFim = T.intro + m.v7_j1_intro.dur;
  let t = T.introFim + 0.6;
  T.r = [];
  const itens = [{ t: T.intro, id: 'v7_j1_intro', dur: m.v7_j1_intro.dur }];
  for (const cor of RODADAS) {
    const r = { cor, muda: t, diz: t + ESPERA + 0.2 };
    r.fim = r.diz + m[`v7_j1_${cor}`].dur;
    itens.push({ t: r.diz, id: `v7_j1_${cor}`, dur: m[`v7_j1_${cor}`].dur });
    T.r.push(r);
    t = r.fim + 1.3;
  }
  T.bem = t - 0.5;
  itens.push({ t: T.bem, id: 'v7_muito_bem', dur: m.v7_muito_bem.dur });
  T.saida = T.bem + m.v7_muito_bem.dur + 0.8;
  const dur = T.saida + 0.6;
  const falas = itens.map(({ t: tt, id }) => ({ t: tt, id }));
  const fala = vozes(itens);
  const track = [{ t: 0, pose: P.OLHANDO }, { t: T.intro - 0.1, pose: P.APONTANDO, dur: 0.4 }];
  for (const r of T.r) track.push({ t: r.muda, pose: P.PENSANDO, dur: 0.4 }, { t: r.diz - 0.1, pose: P.COMEMORA, dur: 0.28 });
  const pulos = T.r.map((r) => ({ t: r.diz, n: 1, altura: 50, periodo: 0.5 }));
  const sons = [{ t: T.saida, tipo: 'sopro', ganho: 0.35 }];
  for (const r of T.r) sons.push({ t: r.muda, tipo: 'virada', ganho: 0.5, semente: 3 }, { t: r.muda + 0.15, tipo: 'plim', ganho: 0.3 });
  kit.resetIds();
  const html = stageHtml(CSS_BASE + LEO_CSS + '#suavez { left: 1560px; top: 240px; }', BG(cores.campo({ pintadas: ['red', 'yellow', 'blue'] })) + '<div id="leo"></div>' + CORPO());
  const janelas = T.r.map((r) => ({ ini: r.diz, fim: r.fim + 0.9, txt: `<span style="color:${r.cor === 'yellow' ? LINE : hexDe(r.cor)}">${r.cor}</span>` }));
  function frame(tt) {
    const tG = tt + tGlobal0;
    const ops = camadas(['red', 'yellow', 'blue'], null);
    const atual = T.r.filter((r) => tt >= r.muda).pop();
    const giro = atual ? Z.bump(Z.prog(tt, atual.muda, 0.5)) : 0;
    const leo = opLeo(atual ? hexDe(atual.cor) : hexDe('blue'), { x: 760, y: 400, tam: 600, dy: -40 * giro + (atual ? pulo2(tt, atual.diz, 40) : 0) });
    if (!atual) leo.html = opLeo('#4DA3FF', { x: 760, y: 400, tam: 600 }).html.replace(/#4DA3FF/g, '#4DA3FF');
    ops.push(leo);
    const vez = T.r.find((r) => tt >= r.muda - 0.1 && tt < r.diz);
    ops.push(...opsPalavra(tt, janelas), ...opsSuaVez(tt, vez ? vez.muda : 1e9, ESPERA));
    ops.push({ id: 'tuti', html: tutiFrame(tt, Object.assign({ track, fala, pulos, tGlobal: tG }, TUTI)) });
    ops.push({ id: 'fade', style: veu(tt, dur, { entrada, saida }) });
    return ops;
  }
  return { nome: 'j1', dur, html, frame, sons, falas, T };
}

// ===== Jogos 2 e 4: três cards =====
function criarCartas(n, { tGlobal0 = 0, entrada = null, saida = null } = {}) {
  return criarCenaCards({ num: n, q: desafio(n), narrDir: NARR, idPergunta: `v7_j${n}_pergunta`, idResposta: `v7_j${n}_resposta`, contagem: CONT, tGlobal0, entrada, saida, tutiOpts: TUTI });
}

// ===== Jogo 3: mistura mágica (yellow + blue) =====
function criarMistura({ tGlobal0 = 0, entrada = null, saida = null } = {}) {
  kit.resetIds();
  const mini = (arte, x) => `<g transform="translate(${x},70) scale(0.2)">${kit.withOutline(7 / 0.2, arte)}</g>`;
  const painel =
    `<div id="painel"><svg id="potes" viewBox="0 0 450 540">${mini(() => cores.pote('#FFD23F'), 14)}${mini(() => cores.pote('#4DA3FF'), 236)}` +
    `<text x="225" y="196" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="90" fill="${LINE}">+</text>` +
    `<text x="225" y="430" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="170" fill="${LINE}">?</text></svg>` +
    `<svg id="verde" viewBox="0 0 450 540"><g transform="translate(45,90) scale(0.36)">${kit.withOutline(7 / 0.36, () => cores.mancha('#5DBB7A'))}</g></svg></div>`;
  const css = `
    #painel { position: absolute; left: 412px; top: 222px; width: 450px; height: 540px; border-radius: 52px; border: 7px solid ${LINE}; background: #FFF6DC; overflow: hidden; box-shadow: 0 16px 0 rgba(61,44,78,.16); }
    #painel svg { position: absolute; left: 0; top: 0; width: 450px; height: 540px; }
    #verde { opacity: 0; }`;
  const extra = {
    css,
    antes: painel,
    sons: (T) => [{ t: 0.55, tipo: 'pouso', ganho: 0.45 }, { t: T.revela + 0.2, tipo: 'sopro', ganho: 0.45 }],
    ops: (t, T) => {
      const kIn = Z.prog(t, 0.2, 0.55);
      const dy = -820 * (1 - Z.outBack(kIn, 1.0)) + 1000 * Z.inCubic(Z.prog(t, T.saida, 0.55));
      const k = Z.inOutCubic(Z.prog(t, T.revela + 0.2, 0.9));
      return [
        { id: 'painel', style: `transform:translate(0px,${f(dy)}px);opacity:${kIn > 0 ? 1 : 0}` },
        { id: 'potes', style: `opacity:${f(1 - k)};transform-origin:50% 50%;transform:rotate(${f(200 * k)}deg) scale(${f(1 - 0.5 * k)})` },
        { id: 'verde', style: `opacity:${f(k)};transform-origin:50% 50%;transform:rotate(${f(-160 * (1 - k))}deg) scale(${f(0.5 + 0.5 * k)})` },
      ];
    },
  };
  return criarCenaCards({ num: 3, q: desafio(3), narrDir: NARR, idPergunta: 'v7_j3_pergunta', idResposta: 'v7_j3_resposta', contagem: CONT, tGlobal0, entrada, saida, tutiOpts: TUTI, layout: { cx: [816, 1136, 1456], cy: 260, escala: 300 / 440, timer: { x: 1356, y: 880 } }, extra });
}

// ===== Jogo 5 · Onde está o blue? (memória) =====
function criarMemoria({ tGlobal0 = 0, entrada = null, saida = null } = {}) {
  const d = desafio(5);
  const m = manifesto();
  const fm = m.v7_j5_mostrar;
  const fq = m.v7_j5_pergunta; // partes: aviso, pergunta, "no um", "no dois", "no três"
  const fr = m.v7_j5_resposta;
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
    { t: T.mostrar, id: 'v7_j5_mostrar', dur: fm.dur },
    { t: T.pergunta, id: 'v7_j5_pergunta', dur: fq.dur },
    { t: T.resposta, id: 'v7_j5_resposta', dur: fr.dur },
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
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, tGlobal: tG, boina: true }) });
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




// ===== Final: o arco-íris volta, uma faixa por cor =====
function criarFinal({ tGlobal0 = 0, entrada = '#fff' } = {}) {
  const m = manifesto();
  const ORDEM = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
  const { T, itens, fim } = fila(m, 0.6, [['intro', 'v7_f_intro', 0.3], ['conta', 'v7_conta_cores', 0.6], ['leo', 'v7_f_leo', 0.5], ['fim', 'v7_f_fim', 0.9], ['tchau', 'v7_tchau', 0.5]]);
  T.saida = fim + 1.8;
  const dur = T.saida + 0.6;
  const tp = m.v7_conta_cores.partes.map((p) => ({ ini: T.conta + p.ini, fim: T.conta + p.fim }));
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens.filter((x) => x.chave !== 'leo'));
  const todas = CORES.map((c) => c.en);
  const track = [{ t: 0, pose: P.COMEMORA }, { t: T.intro + 1, pose: P.APONTANDO, dur: 0.4 }, { t: T.leo - 0.1, pose: P.COMEMORA, dur: 0.28 }, { t: T.fim + 1.2, pose: P.FELIZ, dur: 0.5 }, { t: T.tchau - 0.25, pose: P.ACENO, dur: 0.4 }];
  const pulos = tp.map((p) => ({ t: p.ini, n: 1, altura: 16, periodo: 0.34 })).concat([{ t: T.leo, n: 3, altura: 64, periodo: 0.46 }]);
  const ajuste = P.aceno(T.tchau - 0.25, dur + 1);
  const NOTAS = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0];
  const sons = tp.map((p, i) => ({ t: p.ini, tipo: 'nota', freq: NOTAS[i], ganho: 0.05 }));
  sons.push({ t: T.leoFim + 0.05, tipo: 'acerto', ganho: 0.5 });
  kit.resetIds();
  const html = stageHtml(CSS_BASE.replace('#fade { background: #fff; opacity: 0; }', '#fade { background: #fff; opacity: 1; }') + LEO_CSS + '#arco { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; } #palavra { top: 40px; }', BG(cores.campo({ pintadas: todas })) + '<svg id="arco" viewBox="0 0 1920 1080"></svg><div id="leo"></div>' + CORPO());
  const enT = segsDe(m, 'v7_tchau', T.tchau).find((x) => x.voz === 'en');
  const span = (cor) => `<span style="color:${cor === 'yellow' ? LINE : hexDe(cor)}">${cor}</span>`;
  const janelas = ORDEM.map((cor, i) => ({ ini: tp[i].ini, fim: i < 5 ? tp[i + 1].ini - 0.1 : tp[i].fim + 0.3, txt: span(cor) })).concat([{ ini: T.leo, fim: T.leoFim + 1.4, txt: 'Rainbow!' }, { ini: enT.ini, fim: enT.fim + 1.4, txt: 'Bye-bye!' }]);
  function frame(t) {
    const tG = t + tGlobal0;
    const ops = camadas(todas, null);
    let s = '';
    ORDEM.forEach((cor, i) => {
      const k = Z.inOutCubic(Z.prog(t, tp[i].ini, 0.7));
      if (k <= 0) return;
      const r = 640 - i * 50;
      const len = Math.PI * r;
      const d = `M${960 - r} 700 A${r} ${r} 0 0 1 ${960 + r} 700`;
      s += `<path d="${d}" fill="none" stroke="${LINE}" stroke-width="64" stroke-dasharray="${f(len)}" stroke-dashoffset="${f(len * (1 - k))}"/><path d="${d}" fill="none" stroke="${hexDe(cor)}" stroke-width="50" stroke-dasharray="${f(len)}" stroke-dashoffset="${f(len * (1 - k))}"/>`;
    });
    const brilha = 1 + 0.012 * Math.sin((t - T.leo) * 2 * Math.PI * 1.2) * (t > T.leo ? 1 : 0);
    ops.push({ id: 'arco', html: s, style: `transform-origin:960px 700px;transform:scale(${f(brilha)})` });
    const dito = ORDEM.filter((_, i) => t >= tp[i].ini).pop();
    ops.push(opLeo(dito ? hexDe(dito) : hexDe('purple'), { dy: pulo2(t, T.leo, 40) + pulo2(t, T.leo + 0.9, 40) }));
    ops.push(...opsPalavra(t, janelas), ...opsSuaVez(t, 1e9));
    ops.push({ id: 'tuti', html: tutiFrame(t, Object.assign({ track, fala, pulos, ajuste, tGlobal: tG }, TUTI)) });
    const vida = t - (T.leoFim + 0.1);
    ops.push({ id: 'fx', html: vida > 0 && t < T.tchauFim + 1.2 ? `<g opacity="${f(1 - Z.prog(t, T.tchauFim + 0.4, 0.8))}">${confete(vida)}</g>` : '' });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida: '#fff', tOut: 0.9 }) });
    return ops;
  }
  return { nome: 'final', dur, html, frame, sons, falas, T };
}

module.exports = { criarAbertura, criarCor, criarCamaleao, criarCartas, criarMistura, criarMemoria, criarFinal };
