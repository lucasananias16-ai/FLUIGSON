'use strict';
/**
 * Desenhos e cenários do Vídeo 21: Daniel e os leões. O leãozinho de cara
 * redonda (acordado, dormindo, bravo, mansinho ou fugindo), Daniel orando, o
 * rei com e sem coroa, a coroa, a televisão e a pedra grande do esconderijo.
 * As cenas têm os mesmos nomes e `id` das do Vídeo 4 (art/noel.js).
 */
const { n, o, withOutline, P, E, Ci, R, L, G, tube, sparkle, shadow } = require('../kit');
const { place, fundoQuiz, TRACO } = require('./cenario');
const pessoas = require('./pessoas');
const { tuti } = require('../tuti');

const PELO = '#FFC55A';
const JUBA = '#E8833A';
const CREME = '#FFF1D6';
const TXT = (x, y, t, s, cor = '#9B7EDE') => `<text x="${x}" y="${y}" font-family="Fredoka" font-weight="700" font-size="${s}" fill="${cor}" stroke="#3D2C4E" stroke-width="${Math.round(s / 13)}" paint-order="stroke">${t}</text>`;

// ------------------------------------------------------------ desenhos de card (prancheta 1000 x 1000)
/** Leãozinho sentado, de frente. `humor`: 'feliz' | 'dormindo' | 'bravo' | 'manso'. */
function leaozinho(humor = 'feliz') {
  let juba = '';
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2;
    juba += Ci(500 + Math.cos(t) * 215, 400 + Math.sin(t) * 205, 92, JUBA);
  }
  const olhos =
    humor === 'dormindo' || humor === 'manso'
      ? L('M395 390 Q430 420 465 390 M535 390 Q570 420 605 390', { sw: o(1.5) })
      : Ci(430, 385, 30, '#3D2C4E', { sw: 0 }) + Ci(570, 385, 30, '#3D2C4E', { sw: 0 }) + Ci(420, 374, 10, '#FFFFFF', { sw: 0 }) + Ci(560, 374, 10, '#FFFFFF', { sw: 0 });
  const boca =
    humor === 'bravo'
      ? P('M430 500 Q500 470 570 500 Q560 590 500 596 Q440 590 430 500Z', '#7A2E3A') + P('M452 500 L470 536 L488 498Z', '#FFFFFF', { sw: o(0.5) }) + P('M512 498 L530 536 L548 500Z', '#FFFFFF', { sw: o(0.5) })
      : L('M500 480 L500 510 M455 520 Q478 548 500 512 Q522 548 545 520', { sw: o(1.3) });
  const sobr = humor === 'bravo' ? L('M385 320 L470 350 M615 320 L530 350', { sw: o(1.8) }) : '';
  let extra = '';
  if (humor === 'dormindo') extra = TXT(700, 250, 'Z', 150) + TXT(820, 150, 'z', 100);
  if (humor === 'manso') extra = P('M760 190 C760 130 840 130 840 190 C840 130 920 130 920 190 C920 250 840 300 840 300 C840 300 760 250 760 190Z', '#FF8FB1');
  return (
    shadow(500, 890, 280) +
    tube('M640 820 C780 820 810 720 770 650', 24, PELO) + Ci(766, 630, 40, JUBA) +
    P('M380 600 C340 720 336 810 370 872 L630 872 C664 810 660 720 620 600Z', PELO) +
    E(500, 760, 90, 110, CREME, { sw: 0 }) +
    E(410, 866, 70, 30, PELO) + E(590, 866, 70, 30, PELO) +
    juba +
    Ci(330, 250, 50, PELO) + Ci(670, 250, 50, PELO) +
    Ci(500, 400, 190, PELO) +
    E(500, 500, 90, 66, CREME, { sw: 0 }) +
    olhos + sobr +
    P('M470 455 Q500 440 530 455 Q515 485 500 488 Q485 485 470 455Z', '#7A4A2B') +
    boca +
    Ci(385, 455, 24, '#FFB3A0', { sw: 0, opacity: 0.8 }) + Ci(615, 455, 24, '#FFB3A0', { sw: 0, opacity: 0.8 }) +
    extra
  );
}
const leao = (humor) => () => leaozinho(humor);
/** O leão fugindo: de costas para a esquerda, com risquinhos de velocidade. */
const leaoFugindo = () => L('M60 420 L220 420 M40 540 L200 540 M80 660 L210 660', { color: '#9BB7E0', sw: o(2.2) }) + G('translate(120,0)', leaozinho('feliz'));

/** Daniel, de túnica verde. */
const daniel = (over = {}) => pessoas.person(Object.assign({ robe: '#3CA567', robeDark: '#2F8F5A', sash: '#FFD23F', hair: 'curto', hairColor: '#5A3A28', hairShade: '#7A5540', beard: 'curta' }, over));
/** Daniel orando: as mãos juntas e brilhos em volta. */
const orando = () => daniel({ armR: [540, 560], armL: [460, 560], happy: true }) + sparkle(200, 250, 40, 0, '#FFD23F') + sparkle(810, 300, 34, 12, '#FFD23F') + sparkle(760, 130, 24, 20, '#FFFFFF');
/** O rei, com a coroa. */
const rei = () => pessoas.reiDavi();
/** A coroa, grande, no card. */
function coroa() {
  return (
    shadow(500, 800, 300) +
    P('M200 760 L200 340 L360 520 L500 260 L640 520 L800 340 L800 760Z', '#FFD23F') +
    R(200, 680, 600, 90, 20, '#F4B824') +
    Ci(360, 724, 26, '#E25A52') + Ci(500, 724, 30, '#4DA3FF') + Ci(640, 724, 26, '#5DBB7A') +
    Ci(200, 330, 30, '#E25A52') + Ci(500, 250, 34, '#4DA3FF') + Ci(800, 330, 30, '#5DBB7A') +
    sparkle(160, 200, 34, 0, '#FFFFFF') + sparkle(850, 560, 28, 10, '#FFFFFF')
  );
}
/** O painel do "o que falta": o rei no palácio, sem a coroa. */
function reiSemCoroa() {
  return (
    R(90, 90, 820, 820, 60, '#E4DAFB', { sw: 0 }) +
    R(90, 90, 120, 720, 0, '#C9B8F2', { sw: 0 }) + R(790, 90, 120, 720, 0, '#C9B8F2', { sw: 0 }) +
    P('M90 800 L910 800 L910 910 L90 910Z', '#E25A52', { sw: 0 }) +
    G('translate(60,70) scale(0.88)', withOutline(o(1 / 0.88), () => pessoas.reiDavi({ hat: '' })))
  );
}
/** A coroa que cai na cabeça do rei na resposta (mesma escala do painel). */
const coroaCai = () =>
  G('translate(60,70) scale(0.88)', withOutline(o(1 / 0.88), () => G('translate(500,300)', P('M-116 -150 L-116 -226 L-70 -186 L-36 -244 L0 -192 L36 -244 L70 -186 L116 -226 L116 -150Z', '#FFD23F') + Ci(-58, -186, 9, '#E25A52', { sw: o(0.5) }) + Ci(0, -200, 11, '#4DA3FF', { sw: o(0.5) }) + Ci(58, -186, 9, '#5DBB7A', { sw: o(0.5) }))));
/** Televisão antiga, com antena e pezinhos. */
function televisao() {
  return (
    shadow(500, 880, 330) +
    L('M500 300 L380 130 M500 300 L620 130', { sw: o(1.6) }) + Ci(380, 130, 22, '#E25A52') + Ci(620, 130, 22, '#E25A52') +
    tube('M300 820 L270 880 M700 820 L730 880', 30, '#5A3A28') +
    R(150, 290, 700, 540, 60, '#8F5A2E') +
    R(210, 350, 440, 420, 40, '#7DC1F5') +
    P('M230 700 Q330 560 430 660 Q520 590 630 720 L630 750 L230 750Z', '#5DBB7A', { sw: 0 }) + Ci(540, 450, 46, '#FFD23F', { sw: 0 }) +
    Ci(750, 450, 40, '#FFD23F') + Ci(750, 580, 40, '#E25A52') +
    L('M710 680 L790 680 M710 720 L790 720', { sw: o(1) })
  );
}
/** Pedra grande; (cx, base) é o chão. */
const pedraGrande = (cx, base, s = 1) =>
  G(`translate(${cx},${base}) scale(${s})`, withOutline(o(1 / s), () => P('M-270 0 C-290 -190 -180 -330 -20 -340 C150 -350 280 -230 280 0Z', '#A7A0B8') + P('M-150 -250 C-80 -300 20 -305 80 -285', 'none', { stroke: '#C9C3D6', sw: o(2.2) }) + E(120, -90, 50, 30, '#8E87A0', { sw: 0 }) + E(-150, -60, 40, 24, '#8E87A0', { sw: 0 })));
const pedra = () => shadow(500, 880, 320) + pedraGrande(500, 870, 1.1);

// ------------------------------------------------------------ cenários (1920 x 1080)
const sobre = (fn, cx, base, s) => place(fn, cx - 500 * s, base - 900 * s, s);
const fundoNeve = () => withOutline(TRACO, () => fundoQuiz() + '<g id="neveF"></g>');
const flocos = () => '';

/** Onde o leãozinho se esconde (desafio 1): atrás da pedra grande (`arvoreEsc`). */
const ESCONDERIJO = { x: 1300, dx: 235, chao: 985, s: 0.3, arvore: { x: 1300, y: 1000 } };
function cenaAchar() {
  return withOutline(TRACO, () => {
    const E_ = ESCONDERIJO;
    let s = fundoQuiz();
    // a ponta da juba e o rabo ficam de fora, à direita da pedra: é a pista
    s += `<g id="oculta">${sobre(leao('feliz'), E_.x + E_.dx, E_.chao, E_.s)}</g>`;
    s += `<g id="arvoreEsc">${pedraGrande(E_.arvore.x, E_.arvore.y, 1.05)}</g>`;
    return s;
  });
}

/** Desafio 2 — Contar: cinco leões no gramado (ids p1 a p5). */
const RENAS_X = [760, 960, 1160, 1360, 1560];
function cenaRenas() {
  return withOutline(TRACO, () => {
    let s = fundoQuiz();
    RENAS_X.forEach((x, i) => {
      s += `<g id="p${i + 1}">${sobre(leao(i === 2 ? 'manso' : 'feliz'), x, 960 + (i % 2 ? 20 : 0), 0.2)}</g>`;
    });
    return s;
  });
}

/** Desafio 6 — Comparar: o leão pequeno (`ov`, à esquerda) e o grande (`ca`, à direita). */
const CHAO = 980;
const PEQUENO = { x: 900, s: 0.3 };
const GRANDE = { x: 1420, s: 0.7 };
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = fundoQuiz();
    s += `<g id="ov">${sobre(leao('feliz'), PEQUENO.x, CHAO, PEQUENO.s)}</g>`;
    s += `<g id="ca">${sobre(leao('feliz'), GRANDE.x, CHAO, GRANDE.s)}</g>`;
    return s;
  });
}

/** Encerramento: Daniel e o anjo (`o1`) com os leões dormindo (`o2`). */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = fundoQuiz();
    s += `<g id="o1">${sobre(() => daniel({ happy: true }), 1180, 1000, 0.46)}${sobre(() => pessoas.anjo(), 1500, 940, 0.4)}</g>`;
    s += `<g id="o2">${sobre(leao('dormindo'), 900, 1010, 0.24)}${sobre(leao('manso'), 1760, 1010, 0.26)}</g>`;
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau'));
    return s;
  });
}
const cenaAbertura = cenaEncerramento;

module.exports = { leaozinho, leao, leaoFugindo, daniel, orando, rei, coroa, reiSemCoroa, coroaCai, televisao, pedra, pedraGrande, fundoNeve, flocos, cenaAbertura, cenaAchar, cenaRenas, cenaComparar, cenaEncerramento, ESCONDERIJO, RENAS_X, CHAO, GRANDE, PEQUENO };
