'use strict';
/**
 * Desenhos e cenários do Vídeo 12: brincar na neve e montar o boneco de neve.
 * As cenas têm os mesmos nomes e os mesmos `id` das do Vídeo 4 (art/noel.js),
 * para as cenas animadas serem as mesmas com outro cenário.
 */
const { n, o, withOutline, P, E, Ci, R, L, G, tube, sparkle, shadow, clip } = require('../kit');
const { place, skyCloud, TRACO } = require('./cenario');
const noel = require('./noel');
const animais = require('./animais');
const { tuti } = require('../tuti');

const NEVE = '#E4EFFB';
const NEVE_PERTO = '#FFFFFF';
const NEVE_SOMBRA = '#C9DDF2';

// ------------------------------------------------------------ desenhos de card (prancheta 1000 x 1000)
function cenoura() {
  const d = 'M260 330 C330 260 420 270 470 320 L790 760 C810 800 770 830 740 810Z';
  return (
    shadow(520, 880, 300) +
    tube('M290 300 Q220 200 250 120 M320 290 Q330 180 400 130 M300 300 Q200 260 150 200', 30, '#5DBB7A') +
    P(d, '#FF8A3A') +
    L('M380 380 L430 360 M470 470 L520 450 M560 580 L610 560 M640 690 L680 675', { color: '#E06A1E', sw: o(1) })
  );
}
function cachecol() {
  return (
    shadow(500, 900, 280) +
    P('M180 300 Q500 420 820 300 L840 410 Q500 540 160 410Z', '#E25A52') +
    P('M600 440 L700 820 L580 850 L500 470Z', '#E25A52') +
    L('M240 330 L230 430 M360 370 L350 470 M640 370 L650 470 M760 330 L770 430', { color: '#FFFFFF', sw: o(2) }) +
    L('M560 560 L660 540 M590 680 L690 660', { color: '#FFFFFF', sw: o(2) }) +
    L('M590 850 L585 900 M630 840 L630 895 M670 830 L675 885', { color: '#C2443D', sw: o(1.3) })
  );
}
/** Luva de lã; `cor` é a cor da luva. */
function luva(cor = '#4DA3FF') {
  const corpo = 'M330 780 L330 430 C330 290 400 220 500 220 C600 220 670 290 670 430 L670 780Z';
  return (
    shadow(500, 900, 240) +
    P('M330 520 C220 500 170 420 210 360 C250 300 330 340 340 400Z', cor) +
    P(corpo, cor) +
    E(430, 380, 40, 70, '#FFFFFF', { sw: 0, opacity: 0.3, rot: 15 }) +
    R(300, 740, 400, 130, 40, '#FFFFFF') +
    L('M350 780 L350 840 M420 780 L420 840 M490 780 L490 840 M560 780 L560 840 M630 780 L630 840', { color: NEVE_SOMBRA, sw: o(1) })
  );
}
function chinelo() {
  return (
    shadow(500, 900, 300) +
    P('M330 860 C220 860 190 700 210 520 C230 300 320 160 460 160 C600 160 680 300 680 500 C680 720 620 860 520 860Z', '#FFD23F') +
    P('M300 800 C240 790 230 680 250 540 C270 360 340 240 450 240 C560 240 620 360 620 520 C620 700 580 800 500 800Z', '#4DA3FF', { sw: o(0.8) }) +
    tube('M260 520 Q440 380 450 260 Q470 380 640 520', 40, '#E25A52') +
    Ci(450, 280, 26, '#E25A52')
  );
}
function cartola() {
  return (
    shadow(500, 880, 330) +
    E(500, 760, 330, 70, '#3B3548') +
    R(300, 260, 400, 500, 40, '#3B3548') +
    R(300, 600, 400, 90, 0, '#E25A52') +
    R(300, 260, 400, 500, 40, 'none') +
    E(420, 380, 30, 110, '#5A5368', { sw: 0, opacity: 0.8 }) +
    tube('M600 600 Q640 560 680 600', 18, '#5DBB7A') +
    Ci(640, 640, 22, '#E25A52', { sw: o(0.7) })
  );
}
/** Bola de neve; (cx, base) é o pé, `r` o raio. */
const bolaNeve = (cx, base, r) =>
  E(cx, base, r * 1.05, r * 0.2, '#B9D0EA', { sw: 0 }) +
  Ci(cx, base - r, r, '#FFFFFF') +
  clip(`<circle cx="${n(cx)}" cy="${n(base - r)}" r="${n(r)}"/>`, E(cx + r * 0.25, base - r * 0.35, r * 1.1, r * 0.55, '#DCEBFA', { sw: 0 })) +
  Ci(cx, base - r, r, 'none');

// ------------------------------------------------------------ cenários (1920 x 1080)
const colinas = (topo) =>
  P(`M-20 ${topo + 120} Q300 ${topo - 60} 700 ${topo + 70} Q1100 ${topo - 40} 1500 ${topo + 60} Q1750 ${topo - 20} 1940 ${topo + 40} L1940 1100 L-20 1100Z`, '#C9DDF2');
/** Dia de neve com céu azul, nuvens e pinheiros ao fundo. `chao` é a altura da neve. */
function dia(chao = 820) {
  let s = R(0, 0, 1920, 1080, 0, '#C4E1FF', { sw: 0 });
  s += E(960, 700, 1500, 420, '#E2F0FF', { sw: 0 });
  s += `<g id="nv1">${skyCloud(520, 170, 0.8)}</g><g id="nv2">${skyCloud(1680, 150, 0.9)}</g>`;
  s += colinas(chao - 120);
  s += noel.pinheiro(1840, chao - 20, 0.45) + noel.pinheiro(1740, chao, 0.34) + noel.pinheiro(80, chao, 0.42);
  s += P(`M-20 ${chao} Q480 ${chao - 60} 960 ${chao - 20} Q1480 ${chao + 20} 1940 ${chao - 40} L1940 1100 L-20 1100Z`, NEVE);
  return s;
}
const frente = () =>
  P('M-20 1020 Q520 980 1040 1016 Q1500 1046 1940 1006 L1940 1100 L-20 1100Z', NEVE_PERTO) + sparkle(560, 1046, 12, 0, '#B9D0EA') + sparkle(1420, 1056, 10, 14, '#B9D0EA');

const fundoNeve = noel.fundoNeve;
const flocos = noel.flocos;
const sobre = (fn, cx, base, s) => place(fn, cx - 500 * s, base - 900 * s, s);

/** Abertura: o morro de neve, três bolas de neve esperando para virar boneco. */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = dia(800);
    s += bolaNeve(1180, 900, 120) + bolaNeve(1440, 920, 90) + bolaNeve(1620, 930, 60);
    s += `<g id="o1">${sobre(cenoura, 1700, 950, 0.14)}</g>`;
    s += frente();
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau', { gorro: true }));
    return s;
  });
}

/** Onde a cenoura se esconde (desafio 1): atrás do pinheiro (`arvoreEsc`). */
const ESCONDERIJO = { x: 1240, chao: 880, s: 0.26, arvore: { x: 1230, y: 900, s: 1.05 } };
function cenaAchar() {
  return withOutline(TRACO, () => {
    const E_ = ESCONDERIJO;
    let s = dia(820);
    s += bolaNeve(820, 930, 70) + bolaNeve(1640, 940, 55);
    s += `<g id="oculta">${sobre(cenoura, E_.x + 150, E_.chao, E_.s)}</g>`;
    s += `<g id="arvoreEsc">${noel.pinheiro(E_.arvore.x, E_.arvore.y, E_.arvore.s)}</g>`;
    s += frente();
    return s;
  });
}

/** Desafio 2 — Contar: seis bolas de neve (ids p1 a p6). */
const RENAS_X = [700, 890, 1080, 1270, 1460, 1650];
function cenaRenas() {
  return withOutline(TRACO, () => {
    let s = dia(800);
    RENAS_X.forEach((x, i) => {
      s += `<g id="p${i + 1}">${bolaNeve(x, 900 + (i % 2 ? 14 : 0), 72)}</g>`;
    });
    s += frente();
    return s;
  });
}

/** Desafio 6 — Comparar: o boneco pequeno (`ov`, à esquerda) e o grande (`ca`, à direita). Pés em `CHAO`. */
const CHAO = 960;
const PEQUENO = { x: 880, s: 0.36 };
const GRANDE = { x: 1420, s: 0.78 };
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = dia(820);
    s += `<g id="ov">${sobre(animais.bonecoNeve, PEQUENO.x, CHAO, PEQUENO.s)}</g>`;
    s += `<g id="ca">${sobre(animais.bonecoNeve, GRANDE.x, CHAO, GRANDE.s)}</g>`;
    s += frente();
    return s;
  });
}

/** Encerramento: o boneco de neve pronto (`o1`), com a cenoura, o chapéu e o cachecol, e a Tuti dando tchau. */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = dia(800);
    s += bolaNeve(1720, 950, 50) + bolaNeve(820, 960, 40);
    s += `<g id="o1">${sobre(animais.bonecoNeve, 1280, 980, 0.8)}</g>`;
    s += frente();
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau', { gorro: true }));
    return s;
  });
}

module.exports = { cenoura, cachecol, luva, chinelo, cartola, bolaNeve, fundoNeve, flocos, cenaAbertura, cenaAchar, cenaRenas, cenaComparar, cenaEncerramento, ESCONDERIJO, RENAS_X, CHAO, PEQUENO, GRANDE };
