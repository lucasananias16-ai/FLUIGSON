'use strict';
/**
 * Vídeo 3 — as duas pontas do vídeo: a abertura (noite no campo, a estrela de
 * Belém e um pastor; a Tuti volta e chama para os desafios) e o encerramento
 * (o estábulo com Jesus, Maria e José, a estrela em cima e a Tuti dando
 * tchau). Os gestos da Tuti seguem as frases da narração.
 */
const fs = require('fs');
const path = require('path');
const Z = require('../anim/ease');
const kit = require('../kit');
const { stageHtml } = require('../anim/render');
const { tutiFrame } = require('../anim/tutiAnim');
const { falaEnvelope, temposPorPausas, emFrases } = require('../anim/fala');
const { confete, veu } = require('../anim/fx');
const { LINE, f, FRENTE, ACENO, FELIZ, APONTANDO_CENA: APONTANDO, PREPARADO, COMEMORA, aceno, brilhos } = require('../anim/palco');
const natal = require('../art/natal');
const roteiro = require('./roteiro');

const ROOT = path.resolve(__dirname, '..', '..');
const NARR = path.join(ROOT, 'v3-nascimento-de-jesus', 'narracao');
const CEU = '#BDE5FF';
const NOTAS = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5, 1174.66]; // dó, ré, mi... até o ré de cima

const falaDe = (id) => JSON.parse(fs.readFileSync(path.join(NARR, 'narracao.json'), 'utf8')).falas[id];
const nuvens = (t, tG) => [
  { id: 'nv1', style: `transform:translate(${f(16 * Math.sin((tG * 2 * Math.PI) / 11) + 3 * t)}px,0px)` },
  { id: 'nv2', style: `transform:translate(${f(-12 * Math.sin((tG * 2 * Math.PI) / 13) - 2.5 * t)}px,0px)` },
];
/** A estrela de Belém bate de leve como um coração; `bate` (0 a 1) dá um reforço. */
const estrela = (tG, bate = 0) => ({
  id: 'estrela',
  style: `transform-box:fill-box;transform-origin:50% 50%;transform:scale(${f(1 + 0.04 * Math.sin((tG * 2 * Math.PI) / 2.6) + 0.18 * bate)})`,
});
/** Pulinho que se repete: `fase` de 0 a 1 desencontra um bicho do outro. */
const pulinho = (t, fase, altura, periodo) => -altura * Math.pow(Math.max(0, Math.sin((t / periodo + fase) * 2 * Math.PI)), 1.5);
/** Dois pulinhos seguidos a partir de `t0` (quando a Tuti fala de alguém). */
const doisPulos = (t, t0, altura) => {
  const k = (t - t0) / 0.42;
  return k > 0 && k < 2 ? -altura * Math.abs(Math.sin(Math.PI * k)) : 0;
};
const sobe = (id, dy) => ({ id, style: `transform:translate(0px,${f(dy)}px)` });

/** Abertura: a Tuti chega, apresenta a história do Natal e chama para os nove desafios. */
function criarAbertura({ tGlobal0 = 0, entrada = '#fff', saida = CEU } = {}) {
  const fa = falaDe('v3_abertura');
  const arq = path.join(NARR, 'v3_abertura.wav');
  const T = { tuti: 0.15, titulo: 0.45, fala: 1.35 };
  T.fimFala = T.fala + fa.dur;
  const dur = T.fimFala + 1.1;
  // frases: oi, amiguinho | a Tuti voltou | hoje vamos conhecer a história do nascimento de Jesus | tenho nove desafios para você | vamos lá
  const F = temposPorPausas(arq, emFrases(roteiro.abertura), roteiro.cortes.v3_abertura).map((x) => ({ ini: T.fala + x.ini, fim: T.fala + x.fim }));
  T.jesus = F[2].ini + (F[2].fim - F[2].ini) * 0.78; // "...nascimento de Jesus": a estrela brilha mais
  T.nove = F[3].ini + 0.3; // os nove selos aparecem um a um
  T.frases = F;

  const env = falaEnvelope(arq);
  const fala = (t) => (t >= T.fala && t <= T.fimFala ? env(t - T.fala) : null);
  const track = [
    { t: 0, pose: FRENTE },
    { t: F[0].ini - 0.3, pose: ACENO, dur: 0.4 },
    { t: F[1].ini - 0.1, pose: FELIZ, dur: 0.45 },
    { t: F[2].ini + 0.3, pose: APONTANDO, dur: 0.5 },
    { t: F[3].ini - 0.1, pose: 'perguntando', dur: 0.45 },
    { t: (F[3].ini + F[3].fim) / 2 + 0.2, pose: PREPARADO, dur: 0.45 },
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
  NOTAS.forEach((freq, i) => sons.push({ t: T.nove + 0.11 * i, tipo: 'nota', freq, ganho: 0.1 }));
  const falas = [{ t: T.fala, id: 'v3_abertura' }];

  kit.resetIds();
  const selos = Array.from({ length: 9 }, (_, i) => `<div class="selo" id="s${i + 1}">${i + 1}</div>`).join('');
  const css = `
    #bg, #fade { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    #fade { background: #fff; opacity: 1; }
    #faixa { position: absolute; left: 0; top: 34px; width: 1920px; display: flex; justify-content: center; }
    #titulo { padding: 10px 64px 14px; background: #FFD23F; border: 8px solid ${LINE}; border-radius: 90px; box-shadow: 0 14px 0 rgba(61,44,78,.18);
      font-size: 88px; font-weight: 700; white-space: nowrap; transform: scale(0); }
    #nove { position: absolute; left: 0; top: 220px; width: 1920px; display: flex; justify-content: center; gap: 18px; }
    .selo { width: 98px; height: 98px; border-radius: 50%; background: #2E8BFF; border: 6px solid ${LINE}; color: #fff;
      font-size: 60px; font-weight: 700; display: flex; align-items: center; justify-content: center; transform: scale(0);
      box-shadow: 0 7px 0 rgba(61,44,78,.16); }
    #tuti { position: absolute; left: 110px; top: 322px; width: 680px; height: 748px; }
  `;
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${natal.cenaAbertura({ comTuti: false })}</svg>` +
    `<div id="faixa"><div id="titulo">Desafios do Natal de Jesus</div></div>` +
    `<div id="nove">${selos}</div>` +
    `<div id="tuti"></div><div id="fade"></div>`;
  const html = stageHtml(css, body);

  function frame(t) {
    const tG = t + tGlobal0;
    const ops = nuvens(t, tG);
    ops.push(estrela(tG, Z.bump(Z.prog(t, T.jesus, 0.9))));
    const kT = Z.outBack(Z.prog(t, T.titulo, 0.55), 2);
    ops.push({ id: 'titulo', style: `transform:scale(${f(kT)}) rotate(${f(-1.6 + 1.0 * Math.sin((tG * 2 * Math.PI) / 4.5))}deg)` });
    // o pastor respira; as ovelhas pulam de leve o tempo todo
    ops.push(sobe('pa', pulinho(t, 0.4, 5, 2.4)));
    ops.push(sobe('o1', pulinho(t, 0.1, 9, 1.5)));
    ops.push(sobe('o2', pulinho(t, 0.55, 12, 1.1)));
    ops.push(sobe('o3', pulinho(t, 0.3, 6, 1.7)));
    for (let i = 0; i < 9; i++) {
      const k = Z.outBack(Z.prog(t, T.nove + 0.11 * i, 0.4), 2.4);
      const onda = k >= 1 ? -5 * Math.sin((t - T.nove) * 2 * Math.PI * 0.9 - i * 0.7) : 0;
      ops.push({ id: `s${i + 1}`, style: `transform:translate(0px,${f(onda)}px) scale(${f(k)})` });
    }
    const kIn = Z.outCubic(Z.prog(t, T.tuti, 0.85));
    ops.push({ id: 'tuti', style: `transform:translate(${f(-760 * (1 - kIn))}px,0px)`, html: tutiFrame(t, { track, fala, pulos, ajuste, tGlobal: tG, width: 680, height: 748 }) });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }
  return { nome: 'abertura', dur, html, frame, sons, falas, T };
}

/** Encerramento: Maria, José, o pastor e as ovelhas em festa, e a Tuti se despede acenando. */
function criarEncerramento({ tGlobal0 = 0, entrada = CEU, saida = '#fff' } = {}) {
  const fa = falaDe('v3_encerramento');
  const arq = path.join(NARR, 'v3_encerramento.wav');
  const T = { fala: 1.3 }; // depois do sino de festa, para a primeira frase sair limpa
  T.fimFala = T.fala + fa.dur;
  const dur = T.fimFala + 2.6;
  // frases: você viu? | Jesus nasceu para mostrar o amor de Deus | Deus ama você | tchau, amiguinho...
  const F = temposPorPausas(arq, emFrases(roteiro.encerramento)).map((x) => ({ ini: T.fala + x.ini, fim: T.fala + x.fim }));
  T.jesus = F[1].ini + 0.1;
  T.deus = F[1].ini + (F[1].fim - F[1].ini) * 0.8; // "...o amor de Deus": brilhos em volta de Jesus
  T.frases = F;

  const env = falaEnvelope(arq);
  const fala = (t) => (t >= T.fala && t <= T.fimFala ? env(t - T.fala) : null);
  const track = [
    { t: 0, pose: COMEMORA },
    { t: F[0].ini - 0.2, pose: 'perguntando', dur: 0.4 },
    { t: F[1].ini - 0.1, pose: APONTANDO, dur: 0.45 },
    { t: T.deus - 0.1, pose: FELIZ, dur: 0.5 },
    { t: F[2].ini - 0.1, pose: COMEMORA, dur: 0.35 },
    { t: F[3].ini - 0.2, pose: ACENO, dur: 0.4 },
  ];
  const pulos = [
    { t: 0.3, n: 2, altura: 64, periodo: 0.44 },
    { t: F[2].ini, n: 2, altura: 50, periodo: 0.44 },
  ];
  const ajuste = aceno(F[3].ini - 0.2, dur + 1);

  const sons = [{ t: 0.4, tipo: 'acerto', ganho: 0.5 }];
  const falas = [{ t: T.fala, id: 'v3_encerramento' }];

  kit.resetIds();
  const css = `
    #bg, #fx, #fade { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    #fade { background: ${CEU}; opacity: 1; }
    #tuti { position: absolute; left: -52px; top: 424px; width: 600px; height: 660px; }
  `;
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${natal.cenaEncerramento({ comTuti: false })}</svg>` +
    `<div id="tuti"></div><svg id="fx" viewBox="0 0 1920 1080"></svg><div id="fade"></div>`;
  const html = stageHtml(css, body);

  // as ovelhas comemoram com pulinhos, cada uma no seu tempo
  const turma = [
    ['o1', 0.0, 12, 0.96],
    ['o2', 0.35, 14, 0.9],
    ['o3', 0.6, 13, 1.0],
  ];

  function frame(t) {
    const tG = t + tGlobal0;
    const ops = nuvens(t, tG);
    ops.push(estrela(tG, Z.bump(Z.prog(t, T.deus, 0.9))));
    ops.push(sobe('ma', doisPulos(t, F[2].ini, 22) + pulinho(t, 0.5, 4, 1.3)));
    ops.push(sobe('jo', doisPulos(t, F[2].ini + 0.15, 22) + pulinho(t, 0.2, 4, 1.4)));
    ops.push(sobe('pa', doisPulos(t, F[2].ini + 0.3, 22) + pulinho(t, 0.8, 4, 1.2)));
    for (const [id, fase, altura, periodo] of turma) ops.push(sobe(id, pulinho(t, fase, altura, periodo)));
    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, ajuste, tGlobal: tG, width: 600, height: 660 }) });
    const vida = t - 0.5;
    let fx = vida > 0 && vida < 6 ? confete(vida) : '';
    // brilhos em volta de Jesus quando a Tuti fala do amor de Deus
    const kD = Z.prog(t, T.deus - 0.2, 0.3) * (1 - Z.prog(t, F[2].fim, 0.5));
    if (kD > 0) fx += `<g opacity="${f(kD)}">${brilhos(t, T.deus, 1130, 740, 260, 210)}</g>`;
    ops.push({ id: 'fx', html: fx });
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida, tOut: 0.9 }) });
    return ops;
  }
  return { nome: 'encerramento', dur, html, frame, sons, falas, T };
}

module.exports = { criarAbertura, criarEncerramento };
