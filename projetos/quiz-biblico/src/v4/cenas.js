'use strict';
/**
 * Vídeo 4 — as cenas dos oito desafios do Quiz do Papai Noel (o Papai Noel escondido,
 * as renas, as cores da roupa, a sombra, o duendezinho e o Papai Noel, a chaminé, o
 * intruso e a memória). Parte do código é dos Vídeos 2 e 3, adaptado para a neve.
 *
 * Cada tipo de desafio tem a sua dinâmica:
 *  1 achar     o Papai Noel atrás do pinheiro
 *  2 contar    as quatro renas, junto com a Tuti
 *  3 cores     três cards com a roupa de cada cor
 *  4 sombra    a sombra do Papai Noel e três cards
 *  5 comparar  o duendezinho e o Papai Noel lado a lado
 *  6 escolher  janela, porta ou chaminé
 *  7 intruso   três cards que viram (a prancha de surfe não combina)
 *  8 memória   os cards viram de costas e trocam de lugar
 *
 * Todos os tempos saem da narração (narracao.json).
 */
const fs = require('fs');
const path = require('path');
const Z = require('../anim/ease');
const kit = require('../kit');
const { stageHtml } = require('../anim/render');
const { tutiFrame } = require('../anim/tutiAnim');
const { falaEnvelope, temposPorPausas, emFrases } = require('../anim/fala');
const { confete, veu } = require('../anim/fx');
const P = require('../anim/palco');
const { criarCenaCards } = require('../anim/cenaCards');
const { fundoQuiz } = require('../art/cenario');
const pasto = require('../art/pasto');
const noel = require('../art/noel');
const pessoas = require('../art/pessoas');
const desafios = require('./desafios');
const roteiro = require('./roteiro');

const NARR = path.resolve(__dirname, '..', '..', 'v4-papai-noel', 'narracao');
const CONT = roteiro.contagem;
const LINE = P.LINE;
const f = P.f;

const manifesto = () => JSON.parse(fs.readFileSync(path.join(NARR, 'narracao.json'), 'utf8')).falas;
const wav = (id) => path.join(NARR, `${id}.wav`);
const desafio = (n) => desafios.find((x) => x.n === n);

/** Volume da voz no instante `t`, para a boca da Tuti. `itens`: [{ t, id, dur }]. */
function vozes(itens) {
  const envs = itens.map((x) => Object.assign({ env: falaEnvelope(wav(x.id)) }, x));
  return (t) => {
    for (const e of envs) if (t >= e.t && t <= e.t + e.dur) return e.env(t - e.t);
    return null;
  };
}

/** Mexe num grupo do cenário (um <g id> dentro do SVG de fundo). */
function grupo(id, { dx = 0, dy = 0, sc = 1, rot = 0, origem = '50% 100%' } = {}) {
  return { id, style: `transform-box:fill-box;transform-origin:${origem};transform:translate(${f(dx)}px,${f(dy)}px) rotate(${f(rot)}deg) scale(${f(sc)})` };
}

/** Nuvens e sol do pasto, sempre em movimento leve. `sol` desloca o sol quando ele ficaria atrás da faixa. */
const ceuVivo = (tG, sol = { dx: 0, dy: 0 }) => [
  { id: 'nv1', style: `transform:translate(${f(16 * Math.sin((tG * 2 * Math.PI) / 11))}px,0px)` },
  { id: 'nv2', style: `transform:translate(${f(-12 * Math.sin((tG * 2 * Math.PI) / 13))}px,0px)` },
  grupo('sol', { dx: sol.dx, dy: sol.dy, sc: 1 + 0.025 * Math.sin((tG * 2 * Math.PI) / 3.2), origem: '50% 50%' }),
];

/** Anel brilhante em volta de um ponto (o pinheiro, o Papai Noel). */
const anelSvg = (cx, cy, rx, ry) =>
  `<svg id="anel" viewBox="0 0 1920 1080"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${LINE}" stroke-width="26"/>` +
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#FFD23F" stroke-width="14"/></svg>`;
const CSS_ANEL = `#anel, #extra, #neve { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; } #anel { opacity: 0; }`;
/** O anel aparece em `t0`, pulsa e some depois de `dura` segundos. */
function opsAnel(t, t0, dura, cx, cy, pulsa = 0.04) {
  const k = Z.outCubic(Z.prog(t, t0, 0.3)) * (1 - Z.prog(t, t0 + dura - 0.4, 0.4));
  const pulso = 1 + pulsa * Math.sin((t - t0) * 2 * Math.PI * 1.6);
  return { id: 'anel', style: `opacity:${f(k)};transform-origin:${cx}px ${cy}px;transform:scale(${f((0.8 + 0.2 * k) * pulso)})` };
}

/** Peças de neve que valem para as cenas de cards: fundo nevado e flocos caindo. */
const comNeve = (opts = {}) => {
  const { extra = {}, ...resto } = opts;
  const tG0 = opts.tGlobal0 || 0;
  const opsExtra = extra.ops;
  return Object.assign({}, resto, {
    fundo: noel.fundoNeve,
    extra: Object.assign({}, extra, {
      ops: (t, T) => [{ id: 'neveF', html: noel.flocos(t + tG0) }].concat(opsExtra ? opsExtra(t, T) : []),
    }),
  });
};

// =====================================================================
// 1 · Achar o Papai Noel
// =====================================================================
function criarAchar({ tGlobal0 = 0, entrada = null, saida = null } = {}) {
  const d = desafio(1);
  const m = manifesto();
  const fq = m.v4_p1_pergunta;
  const fr = m.v4_p1_resposta;
  const T = { banner: 0.1, selo: 0.35, pergunta: 1.2 };
  T.fimPergunta = T.pergunta + fq.dur;
  T.contagem = T.fimPergunta + 0.6;
  T.dica = T.contagem + 5; // na metade da contagem o pinheiro balança
  T.revela = T.contagem + CONT + 0.1;
  T.pulo = T.revela + 0.25; // o Papai Noel sai de trás do pinheiro
  T.resposta = T.revela + 1.7;
  T.fimResposta = T.resposta + fr.dur;
  T.saida = T.fimResposta + 0.9;
  const dur = T.saida + 0.75;

  const E = noel.ESCONDERIJO;
  const arvore = E.arvore;
  const pouso = { x: 780, chao: 905 }; // onde o Papai Noel para, no campo aberto

  const sons = [{ t: T.selo, tipo: 'plim', ganho: 0.5 }]
    .concat(P.sonsContagem(T, CONT))
    .concat([
      { t: T.dica, tipo: 'virada', ganho: 0.4, semente: 9 },
      { t: T.revela + 0.1, tipo: 'virada', ganho: 0.5, semente: 5 },
      { t: T.revela + 0.95, tipo: 'acerto', ganho: 0.6 },
      { t: T.saida, tipo: 'sopro', ganho: 0.4 },
    ]);
  const itens = [
    { t: T.pergunta, id: 'v4_p1_pergunta', dur: fq.dur },
    { t: T.resposta, id: 'v4_p1_resposta', dur: fr.dur },
  ];
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens);

  const track = [
    { t: 0, pose: P.OLHANDO },
    { t: T.pergunta - 0.3, pose: P.PROCURANDO, dur: 0.45 },
  ];
  for (let k = 1; T.contagem + k * 3 < T.revela - 0.6; k++) {
    track.push({ t: T.contagem + k * 3, pose: k % 2 ? P.PENSANDO : P.PROCURANDO, dur: 0.6 });
  }
  track.push({ t: T.revela + 0.85, pose: P.COMEMORA, dur: 0.28 });
  track.push({ t: T.resposta + 1.0, pose: P.APONTANDO, dur: 0.5 });
  track.push({ t: T.resposta + 3.6, pose: P.FELIZ, dur: 0.6 });
  track.push({ t: T.saida, pose: P.OLHANDO, dur: 0.5 });
  const pulos = [{ t: T.revela + 0.95, n: 2, altura: 74, periodo: 0.44 }];
  // enquanto procura, o olhar da Tuti passeia pela neve
  const ajuste = (p, t) => {
    if (p.armRFront && t < T.revela) p.gaze = [0.25 + 0.65 * Math.sin(((t - T.pergunta) * 2 * Math.PI) / 3.4), -0.1];
  };

  kit.resetIds();
  const css = P.cssBase() + CSS_ANEL;
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${noel.cenaAchar()}<g id="neveF"></g></svg>` +
    P.bannerHtml(d.n, d.texto) +
    anelSvg(arvore.x, 560, 400, 380) +
    `<div id="timer"></div><div id="tuti"></div><svg id="fx" viewBox="0 0 1920 1080"></svg><div id="fade"></div>`;
  const html = stageHtml(css, body);

  const treme = (t, t0, dura = 0.9, graus = 1.4) => {
    const k = Z.prog(t, t0, dura);
    return k > 0 && k < 1 ? graus * Math.sin((t - t0) * 2 * Math.PI * 5) * (1 - k) : 0;
  };

  function frame(t) {
    const tG = t + tGlobal0;
    const ops = ceuVivo(tG).concat(P.opsBanner(t, T));

    // o Papai Noel: espia na dica e, na resposta, sai de trás do pinheiro, cresce e acena no campo aberto
    let dx = 0;
    let dy = -10 * Z.bump(Z.prog(t, T.dica + 0.1, 1.5));
    let sc = 1;
    const kP = Z.prog(t, T.pulo, 1.1);
    if (kP > 0) {
      const e = Z.inOutCubic(kP);
      dx = (pouso.x - E.x) * e;
      dy = (pouso.chao - E.chao) * e - 120 * Math.sin(Math.PI * kP);
      sc = 1 + 0.45 * Z.outBack(kP, 1.4);
      const kF = t - (T.pulo + 1.1); // depois de pousar, dá dois pulinhos de alegria
      if (kF > 0 && kF < 0.9) dy -= 26 * Math.abs(Math.sin((Math.PI * kF) / 0.45));
    }
    ops.push(grupo('oculta', { dx, dy, sc, origem: '50% 100%' }));
    ops.push(grupo('arvoreEsc', { rot: treme(t, T.dica) + treme(t, T.revela + 0.1), origem: '50% 100%' }));
    ops.push(opsAnel(t, T.revela, 1.9, arvore.x, 560));
    ops.push({ id: 'neveF', html: noel.flocos(tG) });

    ops.push(...P.opsTimer(t, T, CONT));
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, ajuste, tGlobal: tG, gorro: true }) });
    const vida = t - (T.revela + 0.95);
    const festa = vida >= 0 && t < T.saida + 0.7;
    ops.push({
      id: 'fx',
      html: festa ? `<g opacity="${f(1 - Z.prog(t, T.saida, 0.5))}">${confete(vida)}${P.brilhos(t, T.revela, pouso.x, 640, 230, 300)}</g>` : '',
    });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { num: 1, dur, html, frame, sons, falas, T };
}

// =====================================================================
// 2 · Contar as renas
// =====================================================================
function criarContar({ tGlobal0 = 0, entrada = null, saida = null } = {}) {
  const d = desafio(2);
  const m = manifesto();
  const fq = m.v4_p2_pergunta;
  const fc = m.v4_p2_contagem;
  const fr = m.v4_p2_resposta;
  const PX = noel.RENAS_X; // centro de cada rena (ver noel.cenaRenas)
  const LY = [600, 614, 600, 614]; // onde fica o número, logo acima dos chifres de cada uma
  const AROS = PX.map((x, i) => [x, 770 + (i % 2 ? 14 : 0), 150, 160]); // aro de cada rena: x, y, raios
  const GRANDE = { x: 1700, y: 430 }; // o 4 grandão do final
  const NOTAS = [523.25, 587.33, 659.25, 698.46]; // dó, ré, mi, fá

  const T = { banner: 0.1, selo: 0.35, pergunta: 1.2 };
  T.fimPergunta = T.pergunta + fq.dur;
  T.conta = T.fimPergunta + 0.7;
  T.numeros = fc.partes.map((p) => T.conta + p.ini); // instante de cada número
  T.fimConta = T.conta + fc.dur;
  T.festa = T.fimConta + 0.25; // sino de acerto, o 4 grandão e o confete
  T.resposta = T.festa + 1.25; // a Tuti só fala depois do sino, para a voz ficar limpa
  T.fimResposta = T.resposta + fr.dur;
  T.saida = T.fimResposta + 1.3;
  const dur = T.saida + 0.75;

  const sons = [{ t: T.selo, tipo: 'plim', ganho: 0.5 }];
  // um sininho baixinho em cada número: ele acompanha a voz, sem cobrir
  T.numeros.forEach((t, i) => sons.push({ t, tipo: 'nota', freq: NOTAS[i], ganho: 0.18 }));
  sons.push({ t: T.festa, tipo: 'acerto', ganho: 0.55 }, { t: T.saida, tipo: 'sopro', ganho: 0.4 });
  const itens = [
    { t: T.pergunta, id: 'v4_p2_pergunta', dur: fq.dur },
    { t: T.conta, id: 'v4_p2_contagem', dur: fc.dur },
    { t: T.resposta, id: 'v4_p2_resposta', dur: fr.dur },
  ];
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens);

  const track = [
    { t: 0, pose: P.OLHANDO },
    { t: T.pergunta - 0.3, pose: P.APONTANDO, dur: 0.45 },
    { t: T.festa - 0.1, pose: P.COMEMORA, dur: 0.28 },
    { t: T.saida, pose: P.OLHANDO, dur: 0.5 },
  ];
  // a Tuti dá um pulinho a cada número e comemora no fim
  const pulos = T.numeros.map((t) => ({ t, n: 1, altura: 16, periodo: 0.34 })).concat([{ t: T.festa, n: 2, altura: 74, periodo: 0.44 }]);

  kit.resetIds();
  const css = P.cssBase() + CSS_ANEL;
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${noel.cenaRenas()}<g id="neveF"></g></svg>` +
    P.bannerHtml(d.n, d.texto) +
    `<svg id="extra" viewBox="0 0 1920 1080"></svg>` +
    `<div id="timer"></div><div id="tuti"></div><svg id="fx" viewBox="0 0 1920 1080"></svg><div id="fade"></div>`;
  const html = stageHtml(css, body);

  const numero = (txt, x, y, size, cor) =>
    `<text x="${x}" y="${f(y)}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="${f(size)}" fill="${cor}" stroke="${LINE}" stroke-width="${f(size * 0.14)}" stroke-linejoin="round" paint-order="stroke">${txt}</text>`;

  function frame(t) {
    const tG = t + tGlobal0;
    const ops = ceuVivo(tG).concat(P.opsBanner(t, T));
    let marcas = '';
    for (let i = 0; i < PX.length; i++) {
      const k = Z.prog(t, T.numeros[i], 0.45);
      const festa = Z.bump(Z.prog(t, T.festa + 0.08 * i, 0.5));
      // a rena pula quando é contada e de novo na comemoração
      ops.push(grupo(`p${i + 1}`, { dy: -18 * Z.bump(k) - 24 * festa, sc: 1 + 0.18 * Z.bump(k) + 0.06 * Z.outCubic(k), origem: '50% 70%' }));
      if (k <= 0) continue;
      const some = 1 - Z.prog(t, T.saida, 0.4);
      const aro = Z.outCubic(k);
      marcas +=
        `<g opacity="${f(some)}"><ellipse cx="${AROS[i][0]}" cy="${AROS[i][1]}" rx="${f(AROS[i][2] * aro)}" ry="${f(AROS[i][3] * aro)}" fill="none" stroke="#FFD23F" stroke-width="10" opacity="0.9"/>` +
        numero(i + 1, PX[i], LY[i] - 14 * festa, 132 * Z.outBack(Z.prog(t, T.numeros[i], 0.4), 2.2), '#FFD23F') +
        `</g>`;
    }
    // no fim, o 4 grandão
    const k5 = Z.prog(t, T.festa, 0.5);
    if (k5 > 0) {
      const some = 1 - Z.prog(t, T.saida, 0.4);
      marcas += `<g opacity="${f(some)}">${numero(PX.length, GRANDE.x, GRANDE.y - 10 * Math.sin((t - T.festa) * 2 * Math.PI * 0.9), 300 * Z.outBack(k5, 2), '#4DA3FF')}</g>`;
    }
    ops.push({ id: 'extra', html: marcas });
    ops.push({ id: 'timer', style: 'transform:scale(0)' });
    ops.push({ id: 'neveF', html: noel.flocos(tG) });
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, tGlobal: tG, gorro: true }) });
    const vida = t - (T.festa + 0.15);
    ops.push({ id: 'fx', html: vida >= 0 && t < T.saida + 0.7 ? `<g opacity="${f(1 - Z.prog(t, T.saida, 0.5))}">${confete(vida)}</g>` : '' });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { num: 2, dur, html, frame, sons, falas, T };
}

// =====================================================================
// 4 · De quem é a sombra?
// =====================================================================
function criarSombra(opts = {}) {
  const d = desafio(4);
  kit.resetIds();
  // o Papai Noel do painel usa nomes internos próprios, para não se misturar com os dos cards
  const figura = pessoas.papaiNoel({ shadow: false }).replace(/(id="|url\(#)k(\d+)/g, '$1painel$2');
  const painel =
    `<div id="painel"><svg id="sombraCor" viewBox="0 0 1000 1000">${figura}</svg>` +
    `<svg id="sombraPreta" viewBox="0 0 1000 1000">${pasto.sombra(figura, 'silhueta3')}</svg></div>`;
  const css = `
    #painel { position: absolute; left: 412px; top: 222px; width: 450px; height: 540px; border-radius: 52px; border: 7px solid ${LINE};
      background: #E4DAFB; overflow: hidden; box-shadow: 0 16px 0 rgba(61,44,78,.16); }
    #painel svg { position: absolute; left: -4px; top: 10px; width: 480px; height: 480px; }
    #sombraCor { opacity: 0; }
  `;
  const extra = {
    css,
    antes: painel,
    sons: (T) => [{ t: 0.55, tipo: 'pouso', ganho: 0.45 }, { t: T.revela + 0.4, tipo: 'plim', ganho: 0.45 }],
    ops: (t, T) => {
      const kIn = Z.prog(t, 0.2, 0.55);
      const dy = -820 * (1 - Z.outBack(kIn, 1.0)) + 1000 * Z.inCubic(Z.prog(t, T.saida, 0.55));
      const k = Z.inOutCubic(Z.prog(t, T.revela + 0.35, 0.8)); // a sombra ganha cor
      const flash = 1 + 0.05 * Z.bump(Z.prog(t, T.revela + 0.35, 0.8));
      return [
        { id: 'painel', style: `transform:translate(0px,${f(dy)}px) scale(${f(flash)});opacity:${kIn > 0 ? 1 : 0}` },
        { id: 'sombraPreta', style: `opacity:${f(1 - k)}` },
        { id: 'sombraCor', style: `opacity:${f(k)}` },
      ];
    },
  };
  return criarCenaCards(
    comNeve(
    Object.assign(
      {
        num: 4,
        q: d,
        narrDir: NARR,
        idPergunta: 'v4_p4_pergunta',
        idResposta: 'v4_p4_resposta',
        contagem: CONT,
        layout: { cx: [816, 1136, 1456], cy: 260, escala: 300 / 440, timer: { x: 1356, y: 880 } },
        extra,
      },
      opts
    )
    )
  );
}

// =====================================================================
// 5 · Quem é o maior?
// =====================================================================
function criarComparar({ tGlobal0 = 0, entrada = null, saida = null } = {}) {
  const d = desafio(5);
  const m = manifesto();
  const fq = m.v4_p5_pergunta;
  const fr = m.v4_p5_resposta;
  // onde fica a régua de cada um na cena (ver noel.cenaComparar)
  const DUENDE = { x: 950, topo: 600, chao: 970 };
  const NOEL = { x: 1700, topo: 273, chao: 975 };

  const T = { banner: 0.1, selo: 0.35, pergunta: 1.2 };
  T.duende = T.pergunta + fq.partes[1].ini - 0.12; // "o duendezinho...": o pulinho começa um instante antes do nome
  T.noel = T.pergunta + fq.partes[2].ini - 0.12; // "ou o Papai Noel?"
  T.fimPergunta = T.pergunta + fq.dur;
  T.contagem = T.fimPergunta + 0.6;
  T.revela = T.contagem + CONT + 0.1;
  T.resposta = T.revela + 1.7;
  T.fimResposta = T.resposta + fr.dur;
  // "Mas o duendezinho ajuda muito!": começa a segunda frase
  const fr2 = temposPorPausas(wav('v4_p5_resposta'), emFrases(fr.texto))[1];
  T.mas = T.resposta + fr2.ini;
  T.saida = T.fimResposta + 0.9;
  const dur = T.saida + 0.75;

  const sons = [{ t: T.selo, tipo: 'plim', ganho: 0.5 }]
    .concat(P.sonsContagem(T, CONT))
    .concat([
      { t: T.duende, tipo: 'pouso', ganho: 0.24 },
      { t: T.noel, tipo: 'pouso', ganho: 0.4 },
      { t: T.revela + 0.95, tipo: 'acerto', ganho: 0.6 },
      { t: T.saida, tipo: 'sopro', ganho: 0.4 },
    ]);
  const itens = [
    { t: T.pergunta, id: 'v4_p5_pergunta', dur: fq.dur },
    { t: T.resposta, id: 'v4_p5_resposta', dur: fr.dur },
  ];
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens);

  const track = P.pensando(
    [
      { t: 0, pose: P.OLHANDO },
      { t: T.pergunta - 0.3, pose: 'perguntando', dur: 0.45 },
      { t: T.duende - 0.35, pose: P.APONTANDO, dur: 0.45 },
      { t: T.fimPergunta + 0.15, pose: P.PENSANDO, dur: 0.5 },
    ],
    T
  );
  track.push({ t: T.revela + 0.85, pose: P.COMEMORA, dur: 0.28 });
  track.push({ t: T.resposta + 1.2, pose: P.APONTANDO, dur: 0.6 });
  track.push({ t: T.mas, pose: P.FELIZ, dur: 0.6 });
  track.push({ t: T.saida, pose: P.OLHANDO, dur: 0.5 });
  const pulos = [{ t: T.revela + 0.95, n: 2, altura: 74, periodo: 0.44 }];

  kit.resetIds();
  const css = P.cssBase({ timer: { x: 1790, y: 420 } }) + CSS_ANEL;
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${noel.cenaComparar()}<g id="neveF"></g></svg>` +
    P.bannerHtml(d.n, d.texto) +
    anelSvg(1335, 625, 340, 390) +
    `<svg id="extra" viewBox="0 0 1920 1080"></svg>` +
    `<div id="timer"></div><div id="tuti"></div><svg id="fx" viewBox="0 0 1920 1080"></svg><div id="fade"></div>`;
  const html = stageHtml(css, body);

  /** Régua que cresce do chão até a altura de cada um. */
  function regua(x, quem, k, cor, cap = 46) {
    if (k <= 0) return '';
    const topo = quem.chao - (quem.chao - quem.topo) * k;
    let tracos = '';
    for (let y = quem.chao - 60; y > topo + 20; y -= 60) tracos += `M${x - 16} ${y} L${x + 16} ${y} `;
    return (
      `<path d="M${x} ${quem.chao} L${x} ${f(topo)}" stroke="${LINE}" stroke-width="34" stroke-linecap="round" fill="none"/>` +
      `<path d="M${x} ${quem.chao} L${x} ${f(topo)}" stroke="${cor}" stroke-width="20" stroke-linecap="round" fill="none"/>` +
      `<path d="${tracos}" stroke="${LINE}" stroke-width="6" stroke-linecap="round" fill="none"/>` +
      `<path d="M${x - cap} ${f(topo)} L${x + cap} ${f(topo)}" stroke="${LINE}" stroke-width="16" stroke-linecap="round" fill="none"/>`
    );
  }

  function frame(t) {
    const tG = t + tGlobal0;
    const ops = ceuVivo(tG).concat(P.opsBanner(t, T));

    // cada um se mexe quando a Tuti fala o nome dele
    const kO = Z.bump(Z.prog(t, T.duende, 0.5));
    ops.push(grupo('ov', { dy: -34 * kO }));
    const kC = Z.bump(Z.prog(t, T.noel, 0.55));
    const cresce = 0.035 * Z.outBack(Z.prog(t, T.revela + 0.8, 0.6), 2.2); // na resposta, o Papai Noel "cresce"
    ops.push(grupo('ca', { sc: 1 + 0.03 * kC + cresce, dy: -6 * kC }));
    ops.push(opsAnel(t, T.revela + 0.3, 2.4, 1335, 625, 0.018));
    ops.push({ id: 'neveF', html: noel.flocos(tG) });

    // réguas de altura na resposta
    const some = 1 - Z.prog(t, T.saida, 0.4);
    const kR = Z.outCubic(Z.prog(t, T.revela + 0.5, 1.0));
    ops.push({ id: 'extra', html: kR > 0 ? `<g opacity="${f(some)}">${regua(DUENDE.x, DUENDE, kR, '#4DA3FF', 30)}${regua(NOEL.x, NOEL, kR, '#FFD23F')}</g>` : '' });

    ops.push(...P.opsTimer(t, T, CONT));
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, tGlobal: tG, gorro: true }) });
    const vida = t - (T.revela + 0.95);
    let fx = '';
    if (vida >= 0 && t < T.saida + 0.7) {
      fx = `<g opacity="${f(1 - Z.prog(t, T.saida, 0.5))}">${confete(vida)}`;
      if (t >= T.mas - 0.2) fx += P.brilhos(t, T.mas, 800, 800, 190, 230);
      fx += '</g>';
    }
    ops.push({ id: 'fx', html: fx });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { num: 4, dur, html, frame, sons, falas, T };
}

// =====================================================================
// 3, 6 e 7 · Três cards que viram
// =====================================================================
function criarEscolher(n, opts = {}) {
  return criarCenaCards(
    comNeve(Object.assign({ num: n, q: desafio(n), narrDir: NARR, idPergunta: `v4_p${n}_pergunta`, idResposta: `v4_p${n}_resposta`, contagem: CONT }, opts))
  );
}

// =====================================================================
// 8 · Memória: onde está o presente?
// =====================================================================
function criarMemoria({ tGlobal0 = 0, entrada = null, saida = null } = {}) {
  const d = desafio(8);
  const m = manifesto();
  const fm = m.v4_p8_mostrar;
  const fq = m.v4_p8_pergunta; // partes: aviso, pergunta, "no um", "no dois", "no três"
  const fr = m.v4_p8_resposta;
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
    { t: T.mostrar, id: 'v4_p8_mostrar', dur: fm.dur },
    { t: T.pergunta, id: 'v4_p8_pergunta', dur: fq.dur },
    { t: T.resposta, id: 'v4_p8_resposta', dur: fr.dur },
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
    `<svg id="bg" viewBox="0 0 1920 1080">${noel.fundoNeve()}</svg>` +
    `<div id="burst">${P.raios()}</div>` +
    P.bannerHtml(d.n, d.texto) +
    cardsHtml +
    `<div id="timer"></div><div id="tuti"></div><svg id="fx" viewBox="0 0 1920 1080"></svg><div id="fade"></div>`;
  const html = stageHtml(css, body);

  function frame(t) {
    const tG = t + tGlobal0;
    const ops = P.opsBanner(t, T);
    ops.push({ id: 'neveF', html: noel.flocos(tG) });

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
      ops.push({ id: `c${i}`, style: `left:${f(x)}px;top:${CY}px;transform:translate(0px,${f(dy)}px) scale(${f(sc)}) rotate(${f(rotZ)}deg);opacity:${f(op)};z-index:${z}` });
      ops.push({ id: `c${i}i`, style: `transform:rotateY(${f(ang)}deg)` });
      ops.push({ id: `c${i}s`, style: `transform:translate(0px,16px) scaleX(${f(Math.max(0.03, cos))})` });
      ops.push({ id: `c${i}n`, style: `opacity:${f(Z.prog(t, T.numeros + 0.08 * slot[i], 0.3))}` });
    }

    const kB = Z.outCubic(Z.prog(t, T.revela + 0.95, 0.5)) * (1 - Z.prog(t, T.saida, 0.4));
    ops.push({ id: 'burst', style: `opacity:${f(0.95 * kB)};transform:rotate(${f((t - T.revela) * 14)}deg) scale(${f(0.6 + 0.4 * kB)})` });
    ops.push(...P.opsTimer(t, T, CONT));
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, tGlobal: tG, gorro: true }) });
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

module.exports = { criarAchar, criarContar, criarSombra, criarComparar, criarEscolher, criarMemoria };
