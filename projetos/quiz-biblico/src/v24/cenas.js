'use strict';
/**
 * Vídeo 24 — as cenas das doze brincadeiras da Ovelhinha Perdida, no pasto
 * dos quizzes bíblicos, com a Tuti sem gorro. Vêm do Vídeo 23 (ordem dos jogos
 * em `roteiro.ordem`, "o que sumiu?" e "quem chegou primeiro?"); aqui o vídeo
 * abre no "achar" (modo `v2`) e o comparar volta a ser "qual é a maior?".
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
const noel = require('../art/ovelhaPerdida'); // mesmos nomes de cena do Vídeo 4, outro cenário
const objetos = require('../art/objetos');
const cr = require('../art/criacao');
const dn = require('../art/daniel');
const salaArt = require('../art/sala');
const mar = require('../art/mar');
const animais = require('../art/animais');
const of = require('../art/oficina');
const ceuNatal = require('../art/ceuNatal');
const desafios = require('./desafios');
const roteiro = require('./roteiro');

const NARR = path.resolve(__dirname, '..', '..', 'v24-biblico-ovelha-perdida', 'narracao');
const CONT = roteiro.contagem;
const NUM = roteiro.ordem; // número de dentro → número mostrado na tela
const LINE = P.LINE;
const f = P.f;
const R_ = kit.R;

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
    tutiOpts: {},
    extra: Object.assign({}, extra, {
      ops: (t, T) => [{ id: 'neveF', html: noel.flocos(t + tG0) }].concat(opsExtra ? opsExtra(t, T) : []),
    }),
  });
};

// =====================================================================
// 1 · Achar o Papai Noel
// =====================================================================
/**
 * `v2`: padrão novo (19/11/2026). O vídeo já começa aqui: no quadro 0 o
 * pinguim passa correndo e se esconde, a Tuti pula e pede ajuda; a contagem
 * é de 5 s e, depois da resposta, vem o gancho dos 12 desafios.
 */
function criarAchar({ tGlobal0 = 0, entrada = null, saida = null, v2 = false } = {}) {
  const d = desafio(1);
  const m = manifesto();
  const fq = v2 ? m.v24_v2_p1_pergunta : m.v24_p1_pergunta;
  const fg = m.v24_v2_gancho;
  const CONT1 = v2 ? 5 : CONT;
  const fr = m.v24_p1_resposta;
  const T = v2 ? { banner: -0.4, selo: -0.2, pergunta: 0.35, voo: 1.3 } : { banner: 0.1, selo: 0.35, pergunta: 1.2 };
  T.fimPergunta = T.pergunta + fq.dur;
  T.contagem = T.fimPergunta + 0.6;
  T.dica = T.contagem + CONT1 / 2; // na metade da contagem o pinheiro balança
  T.revela = T.contagem + CONT1 + 0.1;
  T.pulo = T.revela + 0.25; // o Papai Noel sai de trás do pinheiro
  T.resposta = T.revela + 1.7;
  T.fimResposta = T.resposta + fr.dur;
  if (v2) T.gancho = T.fimResposta + 0.4;
  T.saida = (v2 ? T.gancho + fg.dur : T.fimResposta) + 0.9;
  const dur = T.saida + 0.75;

  const E = noel.ESCONDERIJO;
  const arvore = E.arvore;
  const pouso = { x: 740, chao: 1000 }; // onde a ovelhinha fica, no pasto, longe do arbusto

  const sons = (v2 ? [{ t: 0.02, tipo: 'sopro', ganho: 0.5 }, { t: T.voo - 0.05, tipo: 'pouso', ganho: 0.4 }] : [{ t: T.selo, tipo: 'plim', ganho: 0.5 }])
    .concat(P.sonsContagem(T, CONT1))
    .concat([
      { t: T.dica, tipo: 'virada', ganho: 0.4, semente: 9 },
      { t: T.revela + 0.1, tipo: 'virada', ganho: 0.5, semente: 5 },
      { t: T.revela + 0.95, tipo: 'acerto', ganho: 0.6 },
      { t: T.saida, tipo: 'sopro', ganho: 0.4 },
    ]);
  const itens = [
    { t: T.pergunta, id: v2 ? 'v24_v2_p1_pergunta' : 'v24_p1_pergunta', dur: fq.dur },
    { t: T.resposta, id: 'v24_p1_resposta', dur: fr.dur },
  ];
  if (v2) itens.push({ t: T.gancho, id: 'v24_v2_gancho', dur: fg.dur });
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens);

  const track = [
    { t: 0, pose: v2 ? 'perguntando' : P.OLHANDO },
    { t: v2 ? T.voo : T.pergunta - 0.3, pose: P.PROCURANDO, dur: 0.45 },
  ];
  for (let k = 1; T.contagem + k * 3 < T.revela - 0.6; k++) {
    track.push({ t: T.contagem + k * 3, pose: k % 2 ? P.PENSANDO : P.PROCURANDO, dur: 0.6 });
  }
  track.push({ t: T.revela + 0.85, pose: P.COMEMORA, dur: 0.28 });
  track.push({ t: T.resposta + 1.0, pose: P.APONTANDO, dur: 0.5 });
  track.push({ t: T.resposta + 3.6, pose: P.FELIZ, dur: 0.6 });
  if (v2) {
    track.push({ t: T.gancho - 0.2, pose: P.COMEMORA, dur: 0.3 });
    track.push({ t: T.gancho + 1.6, pose: P.APONTANDO, dur: 0.45 });
    track.push({ t: T.gancho + fg.dur - 1.1, pose: P.COMEMORA, dur: 0.3 });
  }
  track.push({ t: T.saida, pose: P.OLHANDO, dur: 0.5 });
  const pulos = [{ t: T.revela + 0.95, n: 2, altura: 74, periodo: 0.44 }];
  if (v2) {
    pulos.unshift({ t: 0.02, n: 1, altura: 64, periodo: 0.42 }); // a Tuti leva um susto quando o bichinho passa
    pulos.push({ t: T.gancho, n: 2, altura: 60, periodo: 0.44 }, { t: T.gancho + fg.dur - 1.0, n: 2, altura: 70, periodo: 0.44 });
  }
  // enquanto procura, o olhar da Tuti passeia pela neve
  const ajuste = (p, t) => {
    if (p.armRFront && t < T.revela && t > (v2 ? T.voo : 0)) p.gaze = [0.25 + 0.65 * Math.sin(((t - T.pergunta) * 2 * Math.PI) / 3.4), -0.1];
  };

  kit.resetIds();
  const css = P.cssBase() + CSS_ANEL;
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${noel.cenaAchar()}<g id="neveF"></g></svg>` +
    P.bannerHtml(NUM[d.n], d.texto) +
    anelSvg(arvore.x, arvore.y - 160, 300, 230) +
    `<div id="timer"></div><div id="tuti"></div><svg id="fx" viewBox="0 0 1920 1080"></svg><div id="fade"></div>`;
  const html = stageHtml(css, body);

  const treme = (t, t0, dura = 0.9, graus = 1.5) => {
    const k = Z.prog(t, t0, dura);
    return k > 0 && k < 1 ? graus * Math.sin((t - t0) * 2 * Math.PI * 5) * (1 - k) : 0;
  };

  function frame(t) {
    const tG = t + tGlobal0;
    const ops = ceuVivo(tG).concat(P.opsBanner(t, T));

    // o Papai Noel: espia na dica e, na resposta, sai de trás do pinheiro, cresce e acena no campo aberto
    let dx = 0;
    let dy = -26 * Z.bump(Z.prog(t, T.dica + 0.1, 1.5));
    let sc = 1;
    if (v2 && t < T.voo) {
      // o biscoito entra grande, correndo aos pulinhos pela esquerda, e se esconde
      const k = Z.prog(t, -0.25, T.voo + 0.25);
      const e = Z.inOutCubic(k);
      dx = -760 * (1 - e);
      dy = -110 * Math.abs(Math.sin(Math.PI * k * 3)) * (1 - e);
      sc = 1 + 0.7 * (1 - e);
    }
    const kP = Z.prog(t, T.pulo, 1.1);
    if (kP > 0) {
      const e = Z.inOutCubic(kP);
      dx = (pouso.x - E.x) * e;
      dy = (pouso.chao - E.chao) * e - 120 * Math.sin(Math.PI * kP);
      sc = 1 + 0.5 * Z.outBack(kP, 1.4);
      const kF = t - (T.pulo + 1.1); // depois de pousar, dá dois pulinhos de alegria
      if (kF > 0 && kF < 0.9) dy -= 26 * Math.abs(Math.sin((Math.PI * kF) / 0.45));
    }
    ops.push(grupo('oculta', { dx, dy, sc, origem: '50% 100%' }));
    ops.push(grupo('arvoreEsc', { rot: treme(t, T.dica) + treme(t, T.revela + 0.1), origem: '50% 100%' }));
    ops.push(opsAnel(t, T.revela, 1.9, arvore.x, arvore.y - 160));
    ops.push({ id: 'neveF', html: noel.flocos(tG) });

    ops.push(...P.opsTimer(t, T, CONT1));
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, ajuste, tGlobal: tG }) });
    const vida = t - (T.revela + 0.95);
    const festa = vida >= 0 && t < T.saida + 0.7;
    ops.push({
      id: 'fx',
      html: festa ? `<g opacity="${f(1 - Z.prog(t, T.saida, 0.5))}">${confete(vida)}${v2 ? confete(t - T.gancho) : ''}${P.brilhos(t, T.revela, pouso.x, pouso.chao - 120, 200, 160)}</g>` : '',
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
  const fq = m.v24_p2_pergunta;
  const fc = m.v24_p2_contagem;
  const fr = m.v24_p2_resposta;
  const PX = noel.RENAS_X; // centro de cada rena (ver noel.cenaRenas)
  const LY = PX.map((_, i) => 720 + (i % 2 ? 20 : 0)); // o número fica em cima do camelo
  const GRANDE = { x: 1160, y: 560 }; // o 5 grandão do final
  const NOTAS = [523.25, 587.33, 659.25, 698.46, 783.99]; // dó, ré, mi, fá, sol

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
    { t: T.pergunta, id: 'v24_p2_pergunta', dur: fq.dur },
    { t: T.conta, id: 'v24_p2_contagem', dur: fc.dur },
    { t: T.resposta, id: 'v24_p2_resposta', dur: fr.dur },
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
    P.bannerHtml(NUM[d.n], d.texto) +
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
      ops.push(grupo(`p${i + 1}`, { dy: -14 * Z.bump(k) - 20 * festa, sc: 1 + 0.08 * Z.bump(k), origem: '50% 100%' }));
      if (k <= 0) continue;
      const some = 1 - Z.prog(t, T.saida, 0.4);
      marcas +=
        `<g opacity="${f(some)}">` +
        numero(i + 1, PX[i], LY[i] - 14 * festa, 120 * Z.outBack(Z.prog(t, T.numeros[i], 0.4), 2.2), '#FFD23F') +
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
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, tGlobal: tG }) });
    const vida = t - (T.festa + 0.15);
    ops.push({ id: 'fx', html: vida >= 0 && t < T.saida + 0.7 ? `<g opacity="${f(1 - Z.prog(t, T.saida, 0.5))}">${confete(vida)}</g>` : '' });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { num: 2, dur, html, frame, sons, falas, T };
}

// =====================================================================
// 3, 9, 11 e 12 · Três cards que viram
// =====================================================================
function criarEscolher(n, opts = {}) {
  return criarCenaCards(
    comNeve(Object.assign({ num: NUM[n], q: desafio(n), narrDir: NARR, idPergunta: `v24_p${n}_pergunta`, idResposta: `v24_p${n}_resposta`, contagem: CONT }, opts))
  );
}

// =====================================================================
// 3 · De quem é a sombra?
// =====================================================================
// =====================================================================
// 5 · O que está faltando? (a lareira sem o fogo)
// =====================================================================
function criarFalta(opts = {}) {
  const d = desafio(5);
  kit.resetIds();
  // a praia do painel usa nomes internos próprios, para não se misturar com os dos cards
  const figura = kit.withOutline(6.5, () => noel.pastorSemCajado()).replace(/(id="|url\(#)k(\d+)/g, '$1painel$2');
  // o fogo aparece na lareira na resposta
  const chapeu = kit.withOutline(6.5, noel.cajadoCai);
  const painel =
    `<div id="painel"><svg id="figura" viewBox="0 0 1000 1000">${figura}</svg>` +
    `<svg id="chapeuCai" viewBox="0 0 1000 1000">${chapeu}</svg>` +
    `<div id="interroga">?</div></div>`;
  const css = `
    #painel { position: absolute; left: 412px; top: 222px; width: 450px; height: 540px; border-radius: 52px; border: 7px solid ${LINE};
      background: #E4DAFB; overflow: hidden; box-shadow: 0 16px 0 rgba(61,44,78,.16); }
    #painel svg { position: absolute; left: 15px; top: 60px; width: 420px; height: 420px; }
    #chapeuCai { opacity: 0; }
    #interroga { position: absolute; left: 290px; top: 70px; width: 120px; height: 120px; border-radius: 50%; background: #FFF1B8; border: 6px dashed ${LINE};
      font-size: 84px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  `;
  const extra = {
    css,
    antes: painel,
    sons: (T) => [{ t: 0.55, tipo: 'pouso', ganho: 0.45 }, { t: T.revela + 0.4, tipo: 'plim', ganho: 0.45 }],
    ops: (t, T) => {
      const kIn = Z.prog(t, 0.2, 0.55);
      const dy = -820 * (1 - Z.outBack(kIn, 1.0)) + 1000 * Z.inCubic(Z.prog(t, T.saida, 0.55));
      // na resposta, o "?" some e o fogo cai do alto na lareira, com um quiquezinho
      const kC = Z.prog(t, T.revela + 0.35, 0.7);
      const queda = -420 * (1 - Z.outBounce(kC));
      const flash = 1 + 0.05 * Z.bump(Z.prog(t, T.revela + 0.9, 0.6));
      return [
        { id: 'painel', style: `transform:translate(0px,${f(dy)}px) scale(${f(flash)});opacity:${kIn > 0 ? 1 : 0}` },
        { id: 'interroga', style: `opacity:${f(1 - Z.prog(t, T.revela + 0.2, 0.3))};transform:scale(${f(1 + 0.06 * Math.sin(t * 2 * Math.PI * 1.2))})` },
        { id: 'chapeuCai', style: `opacity:${kC > 0 ? 1 : 0};transform:translate(0px,${f(queda)}px)` },
      ];
    },
  };
  return criarCenaCards(
    comNeve(
    Object.assign(
      {
        num: NUM[5],
        q: d,
        narrDir: NARR,
        idPergunta: 'v24_p5_pergunta',
        idResposta: 'v24_p5_resposta',
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
// 4 · De quem é a sombra?
// =====================================================================
function criarSombra(opts = {}) {
  const d = desafio(4);
  kit.resetIds();
  // a sombra é sempre a do desenho da opção certa; o painel usa nomes internos próprios, para não se misturar com os dos cards
  const figura = kit.withOutline(6.5, d.opcoes.find((o) => o.certa).arte).replace(/(id="|url\(#)k(\d+)/g, '$1painel$2');
  const painel =
    `<div id="painel"><svg id="sombraCor" viewBox="0 0 1000 1000">${figura}</svg>` +
    `<svg id="sombraPreta" viewBox="0 0 1000 1000">${pasto.sombra(figura, 'silhueta3')}</svg></div>`;
  const css = `
    #painel { position: absolute; left: 412px; top: 222px; width: 450px; height: 540px; border-radius: 52px; border: 7px solid ${LINE};
      background: #E4DAFB; overflow: hidden; box-shadow: 0 16px 0 rgba(61,44,78,.16); }
    #painel svg { position: absolute; left: 15px; top: 60px; width: 420px; height: 420px; }
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
        num: NUM[4],
        q: d,
        narrDir: NARR,
        idPergunta: 'v24_p4_pergunta',
        idResposta: 'v24_p4_resposta',
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
// 8 · Sequência: vela, sino, vela, sino...
// =====================================================================
function criarSequencia(opts = {}) {
  kit.resetIds();
  const AMAR = () => cr.flor('#FF8FB1'); // a resposta: depois da ovelha vem a flor
  const VELA = noel.ovelha;
  const FILA = [VELA, AMAR, VELA, AMAR, VELA];
  const X0 = 560;
  const PASSO = 150;
  const item = (fn, i) => `<g transform="translate(${X0 + i * PASSO},196) scale(0.13)">${kit.withOutline(6.5 / 0.13, fn)}</g>`;
  const fita =
    `<svg id="fila" viewBox="0 0 1920 1080" style="position:absolute;left:0;top:0;width:1920px;height:1080px">` +
    `<rect x="${X0 - 30}" y="186" width="${6 * PASSO + 50}" height="150" rx="40" fill="#fff" stroke="${LINE}" stroke-width="7"/>` +
    FILA.map(item).join('') +
    `<rect x="${X0 + 5 * PASSO + 4}" y="200" width="122" height="122" rx="28" fill="#FFF1B8" stroke="${LINE}" stroke-width="6" stroke-dasharray="16 12"/>` +
    `<text id="interroga" x="${X0 + 5 * PASSO + 65}" y="296" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="100" fill="${LINE}">?</text>` +
    `<g id="certoFila" style="opacity:0">${item(AMAR, 5)}</g></svg>`;
  const extra = {
    antes: fita,
    ops: (t, T) => {
      const kIn = Z.outBack(Z.prog(t, 0.3, 0.5), 1.4);
      const k = Z.prog(t, T.revela + 0.9, 0.5);
      return [
        { id: 'fila', style: `position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:960px 260px;transform:scale(${f(kIn * (1 - Z.prog(t, T.saida, 0.4)))})` },
        { id: 'interroga', style: `opacity:${f(1 - k)}` },
        { id: 'certoFila', style: `opacity:${f(k)}` },
      ];
    },
  };
  return criarCenaCards(comNeve(Object.assign({ num: NUM[8], q: desafio(8), narrDir: NARR, idPergunta: 'v24_p8_pergunta', idResposta: 'v24_p8_resposta', contagem: CONT, primeiraOpcao: 2, layout: { cx: [470, 920, 1370], cy: 350, escala: 0.8, timer: { x: 1160, y: 930 } }, extra }, opts)));
}

// =====================================================================
// 6 · Qual é o maior?
// =====================================================================
function criarComparar({ tGlobal0 = 0, entrada = null, saida = null } = {}) {
  const d = desafio(6);
  const m = manifesto();
  const fq = m.v24_p6_pergunta;
  const fr = m.v24_p6_resposta;
  // onde fica a régua de cada um na cena (ver noel.cenaComparar)
  // `NOEL` é o meia grande, à esquerda; `DUENDE` é o pequeno, à direita
  const NOEL = { x: noel.GRANDE.x + 290, topo: noel.CHAO - 500, chao: noel.CHAO };
  const DUENDE = { x: noel.PEQUENO.x + 140, topo: noel.CHAO - 215, chao: noel.CHAO };
  const ANEL = { x: noel.GRANDE.x, y: noel.CHAO - 260 };

  const T = { banner: 0.1, selo: 0.35, pergunta: 1.2 };
  T.duende = T.pergunta + fq.partes[1].ini - 0.12; // "a da esquerda...": a pequena pula um instante antes
  T.noel = T.pergunta + fq.partes[2].ini - 0.12; // "ou a da direita?"
  T.fimPergunta = T.pergunta + fq.dur;
  T.contagem = T.fimPergunta + 0.6;
  T.revela = T.contagem + CONT + 0.1;
  T.resposta = T.revela + 1.7;
  T.fimResposta = T.resposta + fr.dur;
  // "Mas o duendezinho ajuda muito!": começa a segunda frase
  const fr2 = temposPorPausas(wav('v24_p6_resposta'), emFrases(fr.texto))[1];
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
    { t: T.pergunta, id: 'v24_p6_pergunta', dur: fq.dur },
    { t: T.resposta, id: 'v24_p6_resposta', dur: fr.dur },
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
  const css = P.cssBase({ timer: { x: 1780, y: 330 } }) + CSS_ANEL;
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${noel.cenaComparar()}<g id="neveF"></g></svg>` +
    P.bannerHtml(NUM[d.n], d.texto) +
    anelSvg(ANEL.x, ANEL.y, 300, 330) +
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
    ops.push(opsAnel(t, T.revela + 0.3, 2.4, ANEL.x, ANEL.y, 0.018));
    ops.push({ id: 'neveF', html: noel.flocos(tG) });

    // réguas de altura na resposta
    const some = 1 - Z.prog(t, T.saida, 0.4);
    const kR = Z.outCubic(Z.prog(t, T.revela + 0.5, 1.0));
    ops.push({ id: 'extra', html: kR > 0 ? `<g opacity="${f(some)}">${regua(DUENDE.x, DUENDE, kR, '#4DA3FF', 30)}${regua(NOEL.x, NOEL, kR, '#FFD23F')}</g>` : '' });

    ops.push(...P.opsTimer(t, T, CONT));
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, tGlobal: tG }) });
    const vida = t - (T.revela + 0.95);
    let fx = '';
    if (vida >= 0 && t < T.saida + 0.7) {
      fx = `<g opacity="${f(1 - Z.prog(t, T.saida, 0.5))}">${confete(vida)}`;
      if (t >= T.mas - 0.2) fx += P.brilhos(t, T.mas, ANEL.x, ANEL.y, 300, 280);
      fx += '</g>';
    }
    ops.push({ id: 'fx', html: fx });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { num: 4, dur, html, frame, sons, falas, T };
}

// =====================================================================
// 7 · O diferente: três meias vermelhas e uma verde
// =====================================================================
function criarDiferente({ tGlobal0 = 0, entrada = null, saida = null } = {}) {
  const d = desafio(7);
  const m = manifesto();
  const fq = m.v24_p7_pergunta;
  const fr = m.v24_p7_resposta;
  const X = [760, 1040, 1320, 1600];
  const CERTO = 2;
  const T = { banner: 0.1, selo: 0.35, pergunta: 1.2 };
  T.fimPergunta = T.pergunta + fq.dur;
  T.contagem = T.fimPergunta + 0.6;
  T.revela = T.contagem + CONT + 0.1;
  T.resposta = T.revela + 1.7;
  T.fimResposta = T.resposta + fr.dur;
  T.saida = T.fimResposta + 0.9;
  const dur = T.saida + 0.75;
  const sons = [{ t: T.selo, tipo: 'plim', ganho: 0.5 }].concat(P.sonsContagem(T, CONT)).concat([{ t: T.revela + 0.95, tipo: 'acerto', ganho: 0.6 }, { t: T.saida, tipo: 'sopro', ganho: 0.4 }]);
  X.forEach((_, i) => sons.push({ t: 0.5 + 0.12 * i + 0.3, tipo: 'pouso', ganho: 0.4 }));
  const itens = [
    { t: T.pergunta, id: 'v24_p7_pergunta', dur: fq.dur },
    { t: T.resposta, id: 'v24_p7_resposta', dur: fr.dur },
  ];
  const falas = itens.map(({ t, id }) => ({ t, id }));
  const fala = vozes(itens);
  const track = P.pensando([{ t: 0, pose: P.OLHANDO }, { t: T.pergunta - 0.3, pose: P.APONTANDO, dur: 0.45 }, { t: T.fimPergunta + 0.15, pose: P.PENSANDO, dur: 0.5 }], T);
  track.push({ t: T.revela + 0.85, pose: P.COMEMORA, dur: 0.28 }, { t: T.resposta + 1.0, pose: P.APONTANDO, dur: 0.5 }, { t: T.saida, pose: P.OLHANDO, dur: 0.5 });
  const pulos = [{ t: T.revela + 0.95, n: 2, altura: 74, periodo: 0.44 }];
  kit.resetIds();
  const artes = X.map((_, i) => () => (i === CERTO ? dn.leaozinho('feliz') : noel.ovelha()));
  const enfeites = artes.map((fn, i) => `<svg id="e${i}" viewBox="0 0 1000 1000" style="position:absolute;left:${X[i] - 177}px;top:380px;width:340px;height:340px;transform:scale(0)">${kit.withOutline(6.5 / 0.34, fn)}</svg>`).join('');
  const css = P.cssBase() + CSS_ANEL;
  const body = `<svg id="bg" viewBox="0 0 1920 1080">${noel.fundoNeve()}</svg>` + P.bannerHtml(NUM[d.n], d.texto) + enfeites + anelSvg(X[CERTO] - 7, 540, 175, 185) + `<div id="timer"></div><div id="tuti"></div><svg id="fx" viewBox="0 0 1920 1080"></svg><div id="fade"></div>`;
  const html = stageHtml(css, body);
  function frame(t) {
    const tG = t + tGlobal0;
    const ops = P.opsBanner(t, T);
    X.forEach((x, i) => {
      const kIn = Z.outBack(Z.prog(t, 0.5 + 0.12 * i, 0.5), 1.6);
      // as meias dão pulinhos desencontrados; na resposta, a verde pula mais alto
      const certo = i === CERTO;
      const kR = Z.prog(t, T.revela + 0.3, 0.6);
      let dy = -10 * Math.pow(Math.max(0, Math.sin((tG * 2 * Math.PI) / 1.9 + i * 1.7)), 2);
      if (certo && t > T.revela + 0.9) dy -= 30 * Math.abs(Math.sin((t - T.revela - 0.9) * Math.PI * 2.2)) * (1 - Z.prog(t, T.resposta + 3, 0.6));
      const sc = kIn * (certo ? 1 + 0.18 * Z.outBack(kR, 2) : 1 - 0.12 * kR) * (1 - Z.prog(t, T.saida, 0.4));
      ops.push({ id: `e${i}`, style: `position:absolute;left:${x - 177}px;top:380px;width:340px;height:340px;transform-origin:50% 88%;transform:translate(0px,${f(dy)}px) scale(${f(sc)});opacity:${f(certo ? 1 : 1 - 0.5 * kR)}` });
    });
    ops.push(opsAnel(t, T.revela + 0.3, 2.6, X[CERTO] - 7, 540, 0.04));
    ops.push(...P.opsTimer(t, T, CONT));
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, tGlobal: tG }) });
    const vida = t - (T.revela + 0.95);
    ops.push({ id: 'fx', html: vida >= 0 && t < T.saida + 0.7 ? `<g opacity="${f(1 - Z.prog(t, T.saida, 0.5))}">${confete(vida)}</g>` : '' });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { num: 5, dur, html, frame, sons, falas, T };
}

// =====================================================================
// 10 · Memória: onde está o presente?
// =====================================================================
function criarMemoria({ tGlobal0 = 0, entrada = null, saida = null } = {}) {
  const d = desafio(10);
  const m = manifesto();
  const fm = m.v24_p10_mostrar;
  const fq = m.v24_p10_pergunta; // partes: aviso, pergunta, "no um", "no dois", "no três"
  const fr = m.v24_p10_resposta;
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
    { t: T.mostrar, id: 'v24_p10_mostrar', dur: fm.dur },
    { t: T.pergunta, id: 'v24_p10_pergunta', dur: fq.dur },
    { t: T.resposta, id: 'v24_p10_resposta', dur: fr.dur },
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
    P.bannerHtml(NUM[d.n], d.texto) +
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

const NOTAS3 = [523.25, 659.25, 783.99]; // dó, mi, sol: um sininho para cada um que aparece
const ids = (n) => ({ mostrar: `v24_p${n}_mostrar`, pergunta: `v24_p${n}_pergunta`, resposta: `v24_p${n}_resposta` });

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
  T.ap.forEach((t, i) => sons.push(cfg.modo === 'aparece' ? { t: t + 0.05, tipo: 'nota', freq: NOTAS3[i % 3], ganho: 0.3 } : { t: t + 0.3, tipo: 'pouso', ganho: 0.3 }));
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
    `<svg id="bg" viewBox="0 0 1920 1080">${noel.fundoNeve()}</svg>` +
    P.bannerHtml(NUM[d.n], d.texto) +
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
        num: NUM[n],
        tutiOpts: {},
        q: d,
        narrDir: NARR,
        idPergunta: ids(n).pergunta,
        idResposta: ids(n).resposta,
        contagem: CONT,
        primeiraOpcao: d.primeiraOpcao || 1,
        layout: { cx: [470, 920, 1370], cy: 350, escala: 0.8, timer: { x: 1160, y: 930 } },
        fundo: noel.fundoNeve,
        extra,
      },
      opts
    )
  );
}

module.exports = { criarAchar, criarContar, criarFalta, criarSombra, criarEscolher, criarComparar, criarDiferente, criarSequencia, criarMemoria, criarMostrar, criarLembrete };
