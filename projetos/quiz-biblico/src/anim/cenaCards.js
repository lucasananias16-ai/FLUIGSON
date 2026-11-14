'use strict';
/**
 * Cena de três cards, usada pelos dois vídeos.
 *
 * Sequência: entra a faixa com a pergunta e chegam três cards virados; a Tuti
 * pergunta e cada card vira quando ela fala a opção; contagem regressiva;
 * os errados viram de costas e o certo gira, cresce e brilha; a Tuti explica.
 *
 * Os tempos saem da narração (narracao.json), então a cena sempre acompanha
 * a voz, qualquer que seja a duração de cada fala.
 */
const fs = require('fs');
const path = require('path');
const Z = require('./ease');
const kit = require('../kit');
const { stageHtml } = require('./render');
const { tutiFrame } = require('./tutiAnim');
const { falaEnvelope } = require('./fala');
const { confete, veu } = require('./fx');
const { fundoQuiz, TRACO } = require('../art/cenario');
const { LINE, CARD, f, OLHANDO, APONTANDO, PENSANDO, PENSANDO_FRENTE, COMEMORA, FELIZ, verso, raios, timerSvg } = require('./palco');

/**
 * Monta uma cena de três cards.
 * @param {object} cfg
 *  - num: número mostrado no selo; q: { texto, opcoes, semNumero }
 *  - narrDir: pasta da narração; idPergunta, idResposta: nomes dos áudios
 *  - contagem: segundos para pensar
 *  - tGlobal0: instante em que a cena começa dentro do vídeo inteiro
 *  - entrada, saida: cores para abrir e fechar a cena com um véu; sem elas a
 *    cena emenda direto na anterior e na seguinte
 *  - layout: { cx, cy, escala, timer } para cards menores ou em outro lugar
 *  - extra: { css, antes, ops(t, T), sons(T) } para peças a mais na cena
 *  - fundo: função que desenha o fundo (o padrão é o céu com gramado)
 */
function criarCenaCards({ num, q, narrDir, idPergunta, idResposta, contagem, tGlobal0 = 0, entrada = null, saida = null, layout = {}, extra = {}, fundo = null }) {
  const NARR = narrDir;
  const CX = layout.cx || [432, 920, 1408];
  const CY = layout.cy === undefined ? 232 : layout.cy;
  const ESC = layout.escala || 1;
  const TIMER = layout.timer || { x: 1160, y: 866 };
  const manifest = JSON.parse(fs.readFileSync(path.join(NARR, 'narracao.json'), 'utf8')).falas;
  const fq = manifest[idPergunta];
  const fr = manifest[idResposta];
  const certa = q.opcoes.findIndex((o) => o.certa);
  const CONT = contagem;

  // ----- linha do tempo -----
  const T = { banner: 0.1, selo: 0.35, cards: [0.45, 0.58, 0.71], pergunta: 1.45 };
  T.viradas = [1, 2, 3].map((k) => T.pergunta + fq.partes[k].ini - 0.14);
  T.fimPergunta = T.pergunta + fq.dur;
  T.contagem = T.fimPergunta + 0.6;
  T.revela = T.contagem + CONT + 0.1;
  T.resposta = T.revela + 1.7;
  T.fimResposta = T.resposta + fr.dur;
  T.saida = T.fimResposta + 0.9;
  const dur = T.saida + 0.75;

  // ----- sons -----
  const sons = [{ t: T.selo, tipo: 'plim', ganho: 0.5 }];
  T.cards.forEach((t) => sons.push({ t: t + 0.36, tipo: 'pouso', ganho: 0.45 }));
  T.viradas.forEach((t, i) => sons.push({ t: t + 0.05, tipo: 'virada', ganho: 0.5, semente: i + 1 }));
  for (let k = 0; k < CONT; k++) sons.push({ t: T.contagem + k, tipo: 'tique', ganho: k >= CONT - 3 ? 0.5 : 0.36, agudo: k % 2 === 0 });
  sons.push({ t: T.contagem + CONT, tipo: 'fimDoTempo', ganho: 0.45 });
  sons.push({ t: T.revela + 0.15, tipo: 'virada', ganho: 0.5, semente: 5 });
  sons.push({ t: T.revela + 0.95, tipo: 'acerto', ganho: 0.6 });
  sons.push({ t: T.saida, tipo: 'sopro', ganho: 0.4 });
  if (extra.sons) sons.push(...extra.sons(T));
  const falas = [
    { t: T.pergunta, id: idPergunta },
    { t: T.resposta, id: idResposta },
  ];

  // ----- Tuti -----
  const envQ = falaEnvelope(path.join(NARR, `${idPergunta}.wav`));
  const envR = falaEnvelope(path.join(NARR, `${idResposta}.wav`));
  const fala = (t) => {
    if (t >= T.pergunta && t <= T.fimPergunta) return envQ(t - T.pergunta);
    if (t >= T.resposta && t <= T.fimResposta) return envR(t - T.resposta);
    return null;
  };
  const track = [
    { t: 0, pose: OLHANDO },
    { t: T.pergunta - 0.3, pose: 'perguntando', dur: 0.45 },
    { t: T.viradas[0] - 0.35, pose: APONTANDO, dur: 0.45 },
    { t: T.fimPergunta + 0.15, pose: PENSANDO, dur: 0.5 },
  ];
  for (let k = 1; T.contagem + k * 2.6 < T.revela - 0.6; k++) {
    track.push({ t: T.contagem + k * 2.6, pose: k % 2 ? PENSANDO_FRENTE : PENSANDO, dur: 0.6 });
  }
  track.push({ t: T.revela + 0.85, pose: COMEMORA, dur: 0.28 });
  track.push({ t: T.resposta + 1.2, pose: FELIZ, dur: 0.6 });
  track.push({ t: T.saida, pose: OLHANDO, dur: 0.5 });
  const pulos = [{ t: T.revela + 0.95, n: 2, altura: 74, periodo: 0.44 }];

  // ----- página -----
  kit.resetIds();
  const cardsHtml = q.opcoes
    .map((op, i) => {
      const badge = q.semNumero ? '' : `<div class="cnum">${i + 1}</div>`;
      return (
        `<div class="card" id="c${i}" style="left:${CX[i]}px;top:${CY}px;opacity:0">` +
        `<div class="cshadow" id="c${i}s"></div>` +
        `<div class="inner" id="c${i}i">` +
        `<div class="face front" id="c${i}f" style="background:${op.fundo}"><svg class="art" viewBox="0 0 1000 1000">${op.arte()}</svg>${badge}</div>` +
        `<div class="face back">${verso(q.semNumero ? '?' : String(i + 1))}</div>` +
        `</div>` +
        (op.certa
          ? `<div class="check" id="check"><svg viewBox="0 0 60 60" width="62" height="62"><path d="M12 32 L25 45 L49 17" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`
          : '') +
        `</div>`
      );
    })
    .join('');
  const css = `
    #bg, #fx, #fade { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
    #fade { background: #fff; opacity: 0; }
    #banner { position: absolute; left: 330px; top: 44px; width: 1260px; height: 132px; padding-left: 104px; background: #fff;
      border: 7px solid ${LINE}; border-radius: 66px; box-shadow: 0 12px 0 rgba(61,44,78,.14);
      display: flex; align-items: center; justify-content: center; font-size: 76px; font-weight: 600; white-space: nowrap; }
    #qnum { position: absolute; left: -38px; top: -19px; width: 156px; height: 156px; border-radius: 50%; background: #2E8BFF;
      border: 7px solid ${LINE}; color: #fff; font-size: 96px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    #burst { position: absolute; left: ${CX[certa] + CARD / 2 - 520}px; top: ${CY + CARD / 2 - 520}px; width: 1040px; height: 1040px; opacity: 0; }
    .card { position: absolute; width: ${CARD}px; height: ${CARD}px; perspective: 1800px; }
    .cshadow { position: absolute; left: 0; top: 0; width: 100%; height: 100%; border-radius: 52px; background: rgba(61,44,78,.16); }
    .inner { position: absolute; left: 0; top: 0; width: 100%; height: 100%; transform-style: preserve-3d; }
    .face { position: absolute; left: 0; top: 0; width: 100%; height: 100%; border-radius: 52px; border: 7px solid ${LINE};
      overflow: hidden; backface-visibility: hidden; }
    .back { transform: rotateY(180deg); }
    .art { position: absolute; left: 3%; top: 3%; width: 94%; height: 94%; }
    .cnum { position: absolute; left: 16px; top: 16px; width: 84px; height: 84px; border-radius: 50%; background: #fff;
      border: 6px solid ${LINE}; font-size: 52px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
    .check { position: absolute; right: -26px; top: -26px; width: 112px; height: 112px; border-radius: 50%; background: #3CC06F;
      border: 7px solid ${LINE}; display: flex; align-items: center; justify-content: center; transform: scale(0); }
    #timer { position: absolute; left: ${TIMER.x - 120}px; top: ${TIMER.y - 120}px; width: 240px; height: 240px; transform: scale(0); }
    #tuti { position: absolute; left: -40px; top: 436px; width: 560px; height: 616px; }
  ` + (extra.css || '');
  const body =
    `<svg id="bg" viewBox="0 0 1920 1080">${(fundo || fundoQuiz)()}</svg>` +
    `<div id="burst">${raios()}</div>` +
    `<div id="banner"><div id="qnum">${num}</div>${q.texto}</div>` +
    (extra.antes || '') +
    cardsHtml +
    `<div id="timer"></div>` +
    `<div id="tuti"></div>` +
    `<svg id="fx" viewBox="0 0 1920 1080"></svg>` +
    `<div id="fade"></div>`;
  const html = stageHtml(css, body);

  // ----- confete e brilhos -----
  function fx(t) {
    const life0 = t - (T.revela + 0.95);
    if (life0 < 0 || t > T.saida + 0.7) return '';
    const fadeOut = 1 - Z.prog(t, T.saida, 0.5);
    let s = `<g opacity="${f(fadeOut)}">` + confete(life0);
    // brilhos em volta do card certo
    const cx = CX[certa] + CARD / 2;
    const cy = CY + CARD / 2;
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 + 0.4;
      const k = ((t - T.revela) / 1.15 + i / 7) % 1;
      const size = (30 + (i % 3) * 12) * Z.bump(k);
      if (size < 6) continue;
      s += kit.withOutline(Math.min(TRACO, size * 0.16), () =>
        kit.sparkle(cx + Math.cos(a) * 335 * ESC, cy + Math.sin(a) * 305 * ESC, size, i * 20, i % 2 ? '#FFFFFF' : '#FFD23F')
      );
    }
    return s + '</g>';
  }

  // ----- quadro -----
  function frame(t) {
    const ops = [];

    // faixa da pergunta e selo com o número
    const bIn = Z.outBack(Z.prog(t, T.banner, 0.55), 1.2);
    const bOut = Z.inBack(Z.prog(t, T.saida, 0.5));
    ops.push({ id: 'banner', style: `transform:translateY(${f(-280 * (1 - bIn) - 280 * bOut)}px)` });
    ops.push({ id: 'qnum', style: `transform:scale(${f(Z.outBack(Z.prog(t, T.selo, 0.45), 2.4))})` });

    for (let i = 0; i < 3; i++) {
      const ok = i === certa;
      const kIn = Z.prog(t, T.cards[i], 0.55);
      let dy = -780 * (1 - Z.outBack(kIn, 1.0));
      const rotZ = (i - 1) * -8 * (1 - Z.outCubic(kIn));
      let sc = 1;
      let op = kIn > 0 ? 1 : 0;
      let z = 2;

      // vira para mostrar o desenho
      const kF = Z.prog(t, T.viradas[i], 0.55);
      let ang = 180 - 180 * Z.inOutCubic(kF);
      dy -= 30 * Z.bump(kF);
      sc += 0.06 * Z.bump(kF);

      // flutua de leve durante a contagem
      const calm = Z.prog(t, T.viradas[i] + 0.55, 0.9) * (1 - Z.prog(t, T.revela - 0.4, 0.4));
      dy += 5 * calm * Math.sin(((t + tGlobal0) * 2 * Math.PI) / 2.8 + i * 2.1);

      if (ok) {
        // o certo dá um giro, cresce e brilha
        ang -= 360 * Z.inOutCubic(Z.prog(t, T.revela + 0.1, 0.95));
        const kG = Z.prog(t, T.revela + 0.8, 0.6);
        sc += 0.15 * Z.outBack(kG, 2.2);
        dy -= 10 * Z.outCubic(kG);
        if (kG >= 1) sc += 0.012 * Math.sin(((t - T.revela) * 2 * Math.PI) / 1.3);
        if (t >= T.revela) z = 6;
        const kGlow = Z.outCubic(Z.prog(t, T.revela + 1.0, 0.4));
        const glow = kGlow > 0 ? `;border-color:#2FA765;box-shadow:0 0 0 ${f(14 * kGlow)}px rgba(60,192,111,.38)` : '';
        ops.push({ id: `c${i}f`, style: `background:${q.opcoes[i].fundo}${glow}` });
        ops.push({ id: 'check', style: `transform:scale(${f(Z.outBack(Z.prog(t, T.revela + 1.35, 0.4), 2.4))})` });
      } else {
        // os errados viram de costas e recuam
        ang -= 180 * Z.inOutCubic(Z.prog(t, T.revela + 0.12 + 0.1 * i, 0.55));
        const kD = Z.outCubic(Z.prog(t, T.revela + 0.95, 0.5));
        sc -= 0.09 * kD;
        op = Math.min(op, 1 - 0.4 * kD);
      }

      // saída
      const kOut = Z.inCubic(Z.prog(t, T.saida + 0.05 * i, 0.55));
      dy += 1000 * kOut;

      const cos = Math.abs(Math.cos((ang * Math.PI) / 180));
      ops.push({
        id: `c${i}`,
        style: `left:${CX[i]}px;top:${CY}px;transform:translate(0px,${f(dy)}px) scale(${f(sc * ESC)}) rotate(${f(rotZ)}deg);opacity:${f(op)};z-index:${z}`,
      });
      ops.push({ id: `c${i}i`, style: `transform:rotateY(${f(ang)}deg)` });
      ops.push({ id: `c${i}s`, style: `transform:translate(0px,16px) scaleX(${f(Math.max(0.03, cos))})` });
    }

    // raios atrás do card certo
    const kB = Z.outCubic(Z.prog(t, T.revela + 0.95, 0.5)) * (1 - Z.prog(t, T.saida, 0.4));
    ops.push({ id: 'burst', style: `opacity:${f(0.95 * kB)};transform:rotate(${f((t - T.revela) * 14)}deg) scale(${f((0.6 + 0.4 * kB) * ESC)})` });

    // contagem regressiva
    const ts = Z.outBack(Z.prog(t, T.contagem - 0.4, 0.4), 1.8) * (1 - Z.inBack(Z.prog(t, T.revela - 0.02, 0.26)));
    if (ts <= 0.001) ops.push({ id: 'timer', style: 'transform:scale(0)' });
    else {
      const el = Z.clamp(t - T.contagem, 0, CONT);
      const shown = Math.max(1, CONT - Math.floor(el));
      const pulse = t >= T.contagem ? Z.bump(Z.prog(el - Math.floor(el), 0, 0.3)) : 0;
      ops.push({ id: 'timer', style: `transform:scale(${f(ts)})`, html: timerSvg(shown, 1 - el / CONT, pulse) });
    }

    ops.push({ id: 'tuti', html: tutiFrame(t, { track, fala, pulos, tGlobal: t + tGlobal0 }) });
    ops.push({ id: 'fx', html: fx(t) });
    if (extra.ops) ops.push(...extra.ops(t, T));
    ops.push({ id: 'fade', style: veu(t, dur, { entrada, saida }) });
    return ops;
  }

  return { num, dur, html, frame, sons, falas, T };
}

module.exports = { criarCenaCards };
