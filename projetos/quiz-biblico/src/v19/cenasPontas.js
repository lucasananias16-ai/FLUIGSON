'use strict';
/**
 * Vídeo 19 — as duas pontas do vídeo: a abertura (a praia de Natal com a
 * árvore na areia e a Tuti de gorro chamando para os doze desafios) e o
 * encerramento (a praia, o barquinho passeando no mar e a Tuti dando tchau).
 * Os gestos da Tuti seguem as frases da narração.
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
const { LINE, f, FRENTE, ACENO, FELIZ, APONTANDO_CENA: APONTANDO, PREPARADO, COMEMORA, aceno } = P;
const noel = require('../art/verao');
const roteiro = require('./roteiro');

const ROOT = path.resolve(__dirname, '..', '..');
const NARR = path.join(ROOT, 'v19-natal-verao', 'narracao');
const CEU = '#BDE5FF';
const NOTAS = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5, 1174.66, 1318.51, 1396.91, 1567.98]; // dó, ré, mi... uma nota por desafio

const falaDe = (id) => JSON.parse(fs.readFileSync(path.join(NARR, 'narracao.json'), 'utf8')).falas[id];
const nuvens = (t, tG) => [
  { id: 'nv1', style: `transform:translate(${f(16 * Math.sin((tG * 2 * Math.PI) / 11) + 3 * t)}px,0px)` },
  { id: 'nv2', style: `transform:translate(${f(-12 * Math.sin((tG * 2 * Math.PI) / 13) - 2.5 * t)}px,0px)` },
];
/** Pulinho que se repete: `fase` de 0 a 1 desencontra um bicho do outro. */
const pulinho = (t, fase, altura, periodo) => -altura * Math.pow(Math.max(0, Math.sin((t / periodo + fase) * 2 * Math.PI)), 1.5);
/** Dois pulinhos seguidos a partir de `t0`. */
const doisPulos = (t, t0, altura) => {
  const k = (t - t0) / 0.42;
  return k > 0 && k < 2 ? -altura * Math.abs(Math.sin(Math.PI * k)) : 0;
};
const sobe = (id, dy) => ({ id, style: `transform:translate(0px,${f(dy)}px)` });
const NEVE_CSS = '#neve { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }';

/** Abertura: a Tuti chega, mostra as quatro árvores e chama para os doze desafios. */
function criarAbertura({ tGlobal0 = 0, entrada = '#fff', saida = CEU } = {}) {
  const fa = falaDe('v19_abertura');
  const arq = path.join(NARR, 'v19_abertura.wav');
  const T = { tuti: 0.15, titulo: 0.45, fala: 1.35 };
  T.fimFala = T.fala + fa.dur;
  const dur = T.fimFala + 1.1;
  // frases: oi, amiguinho | a Tuti voltou | aqui no Brasil o Natal é no verão... | são doze desafios | vamos lá
  const F = temposPorPausas(arq, emFrases(roteiro.abertura), roteiro.cortes.v19_abertura).map((x) => ({ ini: T.fala + x.ini, fim: T.fala + x.fim }));
  T.oito = F[3].ini + 0.2; // os oito selos aparecem um a um
  T.frases = F;

  const env = falaEnvelope(arq);
  const fala = (t) => (t >= T.fala && t <= T.fimFala ? env(t - T.fala) : null);
  const track = [
    { t: 0, pose: FRENTE },
    { t: F[0].ini - 0.3, pose: ACENO, dur: 0.4 },
    { t: F[1].ini - 0.1, pose: FELIZ, dur: 0.45 },
    { t: F[2].ini - 0.1, pose: APONTANDO, dur: 0.45 }, // mostra a praia de Natal
    { t: F[3].ini - 0.1, pose: PREPARADO, dur: 0.45 },
    { t: F[4].ini - 0.05, pose: COMEMORA, dur: 0.28 },
  ];
  const pulos = [
    { t: T.tuti + 0.05, n: 2, altura: 54, periodo: 0.4 },
    { t: F[1].ini + 0.1, n: 1, altura: 40, periodo: 0.42 },
    { t: F[4].ini + 0.05, n: 2, altura: 76, periodo: 0.44 },
  ];
  const ajuste = aceno(F[0].ini - 0.3, F[1].ini - 0.1);

  const sons = [
    { t: T.titulo, tipo: 'plim', ganho: 0.5 },
    { t: T.tuti + 0.44, tipo: 'pouso', ganho: 0.3 },
    { t: T.tuti + 0.84, tipo: 'pouso', ganho: 0.3 },
    { t: dur - 0.5, tipo: 'sopro', ganho: 0.35 },
  ];
  // escadinha de sininhos bem baixa: toca junto com a fala e não pode cobrir a voz
  NOTAS.forEach((freq, i) => sons.push({ t: T.oito + 0.11 * i, tipo: 'nota', freq, ganho: 0.1 }));
  const falas = [{ t: T.fala, id: 'v19_abertura' }];

  kit.resetIds();
  const selos = Array.from({ length: 12 }, (_, i) => `<div class="selo" id="s${i + 1}">${i + 1}</div>`).join('');
  const css = `
    #bg, #fade { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    ${NEVE_CSS}
    #fade { background: #fff; opacity: 1; }
    #faixa { position: absolute; left: 0; top: 34px; width: 1920px; display: flex; justify-content: center; }
    #titulo { padding: 10px 70px 14px; background: #FFD23F; border: 8px solid ${LINE}; border-radius: 90px; box-shadow: 0 14px 0 rgba(61,44,78,.18);
      font-size: 90px; font-weight: 700; white-space: nowrap; transform: scale(0); }
    #oito { position: absolute; left: 0; top: 182px; width: 1920px; display: flex; justify-content: center; gap: 12px; }
    .selo { width: 98px; height: 98px; border-radius: 50%; background: #E25A52; border: 6px solid ${LINE}; color: #fff;
      font-size: 60px; font-weight: 700; display: flex; align-items: center; justify-content: center; transform: scale(0);
      box-shadow: 0 7px 0 rgba(61,44,78,.16); }
    #tuti { position: absolute; left: 110px; top: 322px; width: 680px; height: 748px; }
  `;
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${noel.cenaAbertura({ comTuti: false })}</svg>` +
    `<svg id="neve" viewBox="0 0 1920 1080"></svg>` +
    `<div id="faixa"><div id="titulo">As Estações do Ano</div></div>` +
    `<div id="oito">${selos}</div>` +
    `<div id="tuti"></div><div id="fade"></div>`;
  const html = stageHtml(css, body);

  function frame(t) {
    const tG = t + tGlobal0;
    const ops = nuvens(t, tG);
    const kT = Z.outBack(Z.prog(t, T.titulo, 0.55), 2);
    ops.push({ id: 'titulo', style: `transform:scale(${f(kT)}) rotate(${f(-1.6 + 1.0 * Math.sin((tG * 2 * Math.PI) / 4.5))}deg)` });
    ops.push({ id: 'neve', html: noel.flocos(tG) });

    for (let i = 0; i < 12; i++) {
      const k = Z.outBack(Z.prog(t, T.oito + 0.11 * i, 0.4), 2.4);
      const onda = k >= 1 ? -5 * Math.sin((t - T.oito) * 2 * Math.PI * 0.9 - i * 0.7) : 0;
      ops.push({ id: `s${i + 1}`, style: `transform:translate(0px,${f(onda)}px) scale(${f(k)})` });
    }
    const kIn = Z.outCubic(Z.prog(t, T.tuti, 0.85));
    ops.push({ id: 'tuti', style: `transform:translate(${f(-760 * (1 - kIn))}px,0px)`, html: tutiFrame(t, { track, fala, pulos, ajuste, tGlobal: tG, width: 680, height: 748, gorro: true }) });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { nome: 'abertura', dur, html, frame, sons, falas, T };
}

/** Encerramento: as quatro árvores e a borboleta voando; a Tuti comemora e se despede acenando. */
/**
 * `v2`: padrão novo (19/11/2026). Festa maior por ter completado os 12, o
 * convite para o próximo quiz e uns 10 s finais com a Tuti dançando.
 */
function criarEncerramento({ tGlobal0 = 0, entrada = CEU, saida = '#fff', v2 = false } = {}) {
  const idFala = v2 ? 'v19_v2_encerramento' : 'v19_encerramento';
  const fa = falaDe(idFala);
  const arq = path.join(NARR, `${idFala}.wav`);
  const T = { fala: 1.3 }; // depois do sino de festa, para a primeira frase sair limpa
  T.fimFala = T.fala + fa.dur;
  const dur = T.fimFala + (v2 ? 10 : 3.2);
  // frases: Natal no calor também é muito bom | feliz Natal, amiguinho | até a próxima
  const F = temposPorPausas(arq, emFrases(v2 ? roteiro.v2.encerramento : roteiro.encerramento), roteiro.cortes[idFala]).map((x) => ({ ini: T.fala + x.ini, fim: T.fala + x.fim }));
  T.frases = F;

  const env = falaEnvelope(arq);
  const fala = (t) => (t >= T.fala && t <= T.fimFala ? env(t - T.fala) : null);
  // v2 — frases: uhuu | você completou os doze desafios | (a frase do tema) | vem jogar o próximo quiz comigo
  const trackV2 = v2 ? [{ t: 0, pose: COMEMORA }, { t: F[2].ini - 0.2, pose: APONTANDO, dur: 0.45 }, { t: F[3].ini - 0.3, pose: ACENO, dur: 0.4 }] : [];
  const pulosV2 = v2 ? [{ t: 0.2, n: 3, altura: 80, periodo: 0.42 }, { t: F[1].ini + 0.1, n: 2, altura: 64, periodo: 0.44 }] : [];
  // depois do convite, a Tuti dança: um par de pulinhos a cada 2,4 s até o fim
  if (v2) for (let t = T.fimFala + 1.2; t < dur - 1.5; t += 2.4) pulosV2.push({ t, n: 2, altura: 40, periodo: 0.44 });
  const track = v2 ? trackV2 : [
    { t: 0, pose: COMEMORA },
    { t: F[0].ini - 0.2, pose: APONTANDO, dur: 0.45 }, // mostra a praia
    { t: F[1].ini - 0.2, pose: FELIZ, dur: 0.45 },
    { t: F[2].ini - 0.3, pose: ACENO, dur: 0.4 },
  ];
  const pulos = v2 ? pulosV2 : [
    { t: 0.3, n: 2, altura: 64, periodo: 0.44 },
    { t: F[1].ini + 0.1, n: 2, altura: 50, periodo: 0.44 },
  ];
  const ajuste = v2 ? aceno(F[3].ini - 0.3, dur + 1) : aceno(F[2].ini - 0.3, dur + 1);

  const sons = [{ t: 0.4, tipo: 'acerto', ganho: 0.5 }];
  if (v2) sons.push({ t: 0.15, tipo: 'fimDoTempo', ganho: 0.4 }, { t: F[1].ini, tipo: 'plim', ganho: 0.35 });
  const falas = [{ t: T.fala, id: idFala }];

  kit.resetIds();
  const css = `
    #bg, #fx, #fade { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    ${NEVE_CSS}
    #fade { background: ${CEU}; opacity: 1; }
    #tuti { position: absolute; left: -52px; top: 424px; width: 600px; height: 660px; }
  `;
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${noel.cenaEncerramento({ comTuti: false })}</svg>` +
    `<svg id="neve" viewBox="0 0 1920 1080"></svg>` +
    `<div id="tuti"></div><svg id="fx" viewBox="0 0 1920 1080"></svg><div id="fade"></div>`;
  const html = stageHtml(css, body);


  function frame(t) {
    const tG = t + tGlobal0;
    const ops = nuvens(t, tG);
    ops.push({ id: 'neve', html: noel.flocos(tG) });
    // o barquinho passeia devagar no mar, balançando nas ondas
    ops.push({ id: 'o2', style: `transform:translate(${f(-260 * Math.sin((t * 2 * Math.PI) / 9))}px,${f(8 * Math.sin((t * 2 * Math.PI) / 1.6))}px)` });
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, ajuste, tGlobal: tG, width: 600, height: 660, gorro: true }) });
    const vida = t - 0.5;
    // v2: festa maior, com uma segunda chuva de confete em "você completou os doze desafios"
    ops.push({ id: 'fx', html: (vida > 0 && vida < 6 ? confete(vida) : '') + (v2 && t > F[1].ini && t < F[1].ini + 6 ? confete(t - F[1].ini) : '') });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida, tOut: 0.9 }) });
    return ops;
  }
  return { nome: 'encerramento', dur, html, frame, sons, falas, T };
}

module.exports = { criarAbertura, criarEncerramento };
