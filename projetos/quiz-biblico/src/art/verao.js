'use strict';
/**
 * Desenhos e cenários do Vídeo 19: o Natal no verão. A praia de Natal, a
 * árvore de Natal na areia, o Papai Noel de bermuda, o castelo de areia, a
 * água de coco, a sopa, o chocolate quente, o casaco, a bermuda e os sorvetes.
 * As cenas têm os mesmos nomes e `id` das do Vídeo 4 (art/noel.js).
 */
const { n, o, withOutline, P, E, Ci, R, L, G, tube, sparkle, shadow } = require('../kit');
const { place, skyCloud, sun, TRACO } = require('./cenario');
const mar = require('./mar');
const objetos = require('./objetos');
const pessoas = require('./pessoas');
const floresta = require('./floresta');
const { tuti } = require('../tuti');

const AREIA = '#F6D99A';
const AREIA_ESC = '#E8C27A';

// ------------------------------------------------------------ desenhos de card (prancheta 1000 x 1000)
/** Árvore de Natal verdinha (sem neve), com bolas; base do tronco em (500, 900). `estrela` põe a estrela no topo. */
function arvoreNatal({ estrela = true } = {}) {
  const camada = (apice, base, meia, cor) =>
    P(`M500 ${apice} Q${500 + meia * 0.35} ${apice + (base - apice) * 0.35} ${500 + meia} ${base - 14} Q${500 + meia + 10} ${base} ${500 + meia - 24} ${base} L${500 - meia + 24} ${base} Q${500 - meia - 10} ${base} ${500 - meia} ${base - 14} Q${500 - meia * 0.35} ${apice + (base - apice) * 0.35} 500 ${apice}Z`, cor);
  let s = shadow(500, 905, 300) + R(465, 780, 70, 120, 12, '#8F5A2E');
  s += camada(470, 800, 300, '#2F8F5A') + camada(320, 620, 230, '#3AA568') + camada(190, 450, 160, '#46B374');
  s += L('M260 700 Q500 760 740 690 M320 540 Q500 590 680 530 M380 390 Q500 420 610 380', { color: '#FFD23F', sw: o(1.6) });
  const bolas = [[330, 740, '#E25A52'], [600, 760, '#4DA3FF'], [450, 660, '#FFD23F'], [690, 650, '#9B7EDE'], [400, 520, '#4DA3FF'], [590, 500, '#E25A52'], [500, 410, '#FFD23F'], [440, 320, '#E25A52'], [560, 300, '#4DA3FF']];
  s += bolas.map(([x, y, c]) => Ci(x, y, 24, c) + Ci(x - 7, y - 8, 6, '#FFFFFF', { sw: 0, opacity: 0.8 })).join('');
  if (estrela) s += estrelaTopoEm(500, 175, 0.2);
  return s;
}
const estrelaTopoEm = (cx, cy, s) => G(`translate(${n(cx - 500 * s)},${n(cy - 500 * s)}) scale(${s})`, withOutline(o(1 / s), objetos.estrela));
/** O painel do "o que falta": a árvore de Natal na areia da praia, sem a estrela. */
function arvoreSemEstrela() {
  return (
    R(90, 90, 820, 820, 60, '#BDE5FF', { sw: 0 }) +
    P('M90 560 Q500 530 910 560 L910 760 L90 760Z', '#3E8FE0', { sw: 0 }) +
    L('M150 610 Q200 590 250 610 M720 620 Q770 600 820 620', { color: '#FFFFFF', sw: o(1.2) }) +
    P('M90 760 Q500 700 910 760 L910 910 L90 910Z', AREIA) +
    G('translate(80,70) scale(0.84)', withOutline(o(1 / 0.84), () => arvoreNatal({ estrela: false }))) +
    place(mar.concha, 170, 780, 0.12) + place(mar.estrelaMar, 730, 790, 0.12)
  );
}
/** A estrela que cai no topo da árvore na resposta (mesma escala do painel). */
const estrelaTopo = () => estrelaTopoEm(500, 225, 0.17);

/** Castelo de areia com duas torres e bandeirinha. */
function casteloAreia() {
  const torre = (x, topo) => P(`M${x - 90} 800 L${x - 80} ${topo} L${x + 80} ${topo} L${x + 90} 800Z`, AREIA) + P(`M${x - 96} ${topo} L${x - 96} ${topo - 50} L${x - 50} ${topo - 50} L${x - 50} ${topo - 20} L${x - 16} ${topo - 20} L${x - 16} ${topo - 50} L${x + 16} ${topo - 50} L${x + 16} ${topo - 20} L${x + 50} ${topo - 20} L${x + 50} ${topo - 50} L${x + 96} ${topo - 50} L${x + 96} ${topo}Z`, AREIA);
  return (
    shadow(500, 860, 400) +
    torre(270, 440) + torre(730, 440) +
    P('M330 820 L340 560 L660 560 L670 820Z', AREIA_ESC) +
    torre(500, 340) +
    P('M450 820 L450 720 A50 50 0 0 1 550 720 L550 820Z', '#B98A4E') +
    Ci(270, 560, 26, '#B98A4E') + Ci(730, 560, 26, '#B98A4E') + Ci(500, 470, 26, '#B98A4E') +
    L('M500 290 L500 160', { sw: o(1) }) + P('M500 164 L590 192 L500 220Z', '#E25A52') +
    E(500, 850, 380, 46, AREIA) +
    place(mar.concha, 180, 760, 0.12) + place(mar.estrelaMar, 760, 780, 0.12)
  );
}
/** Coco verde com canudinho: a água de coco. */
function aguaCoco() {
  return (
    shadow(500, 900, 280) +
    Ci(500, 590, 290, '#5DBB7A') +
    P('M290 420 Q500 320 710 420 Q620 380 500 380 Q380 380 290 420Z', '#3F9E60', { sw: o(0.6) }) +
    E(500, 380, 120, 44, '#FFF6D6') +
    tube('M520 390 L600 170 L700 140', 34, '#FF8FB1') +
    E(400, 520, 50, 90, '#8FD9A0', { sw: 0, opacity: 0.7, rot: -20 }) +
    sparkle(220, 260, 30, 0, '#7DC1F5') + sparkle(790, 330, 24, 10, '#7DC1F5')
  );
}
/** Coco simples (para o jogo da memória). */
const coco = aguaCoco;
const vapor = (xs) => xs.map((x) => L(`M${x} 330 Q${x - 40} 270 ${x} 220 Q${x + 40} 170 ${x} 110`, { color: '#9AA6C2', sw: o(1.4), opacity: 0.85 })).join('');
/** Prato fundo de sopa quente, com vapor. */
function sopa() {
  return (
    shadow(500, 860, 340) +
    E(500, 520, 340, 90, '#F2994A') +
    P('M160 520 Q170 820 500 840 Q830 820 840 520 Q500 600 160 520Z', '#FFFFFF') +
    L('M240 640 Q500 700 760 640', { color: '#4DA3FF', sw: o(1.8) }) +
    Ci(400, 510, 22, '#E25A52', { sw: o(0.6) }) + Ci(580, 520, 18, '#5DBB7A', { sw: o(0.6) }) + R(470, 490, 50, 26, 8, '#FFD23F', { sw: o(0.6) }) +
    vapor([380, 500, 620])
  );
}
/** Caneca de chocolate quente, com vapor. */
function chocolateQuente() {
  return (
    shadow(500, 880, 280) +
    P('M760 500 C900 500 900 720 740 720', 'none', { stroke: '#3D2C4E', sw: o(5.5) }) +
    P('M760 500 C900 500 900 720 740 720', 'none', { stroke: '#E25A52', sw: o(3.2) }) +
    P('M260 400 L760 400 L730 820 Q500 860 290 820Z', '#E25A52') +
    E(510, 400, 250, 56, '#8F5A2E') +
    Ci(440, 390, 34, '#FFFFFF', { sw: o(0.6) }) + Ci(540, 380, 30, '#FFFFFF', { sw: o(0.6) }) +
    L('M300 560 L720 560 M310 660 L710 660', { color: '#FFFFFF', sw: o(1.6) }) +
    vapor([400, 510, 620])
  );
}
/** Casaco de frio, vermelho, com botões e gola. */
function casaco() {
  const corpo = 'M330 240 L670 240 L820 380 L760 470 L700 420 L700 860 L300 860 L300 420 L240 470 L180 380Z';
  return (
    shadow(500, 880, 300) +
    P(corpo, '#4DA3FF') +
    P('M300 820 L700 820 L700 860 L300 860Z', '#FFFFFF') +
    P('M240 470 L180 380 L150 420 L210 510Z', '#FFFFFF') + P('M760 470 L820 380 L850 420 L790 510Z', '#FFFFFF') +
    P('M330 240 Q500 330 670 240 L640 200 Q500 250 360 200Z', '#FFFFFF') +
    L('M500 300 L500 820', { sw: o(1) }) +
    [400, 520, 640, 760].map((y) => Ci(540, y, 18, '#FFD23F')).join('') +
    R(340, 600, 110, 70, 12, '#2E86E6')
  );
}
/** Bermuda de praia florida. */
function bermuda() {
  const d = 'M240 300 L760 300 L800 780 L560 800 L500 480 L440 800 L200 780Z';
  return (
    shadow(500, 860, 320) +
    P(d, '#FF8A3D') +
    R(240, 300, 520, 70, 16, '#FFD23F') +
    L('M470 320 Q500 400 450 440 M530 320 Q500 400 550 440', { color: '#FFFFFF', sw: o(1.2) }) +
    [[330, 470], [650, 460], [310, 660], [660, 650], [430, 580]].map(([x, y]) => Ci(x, y, 34, '#FFFFFF', { sw: 0, opacity: 0.9 }) + Ci(x, y, 12, '#FFD23F', { sw: 0 })).join('')
  );
}
/** Sorvete de casquinha de uma bola; `cor` é o sabor (rosa = morango, marrom = chocolate). */
function sorveteCor(cor = '#FF8FB1') {
  return () =>
    shadow(500, 900, 150) +
    P('M370 460 L630 460 L500 880Z', '#E8A85A') +
    L('M410 520 L560 720 M590 520 L450 750 M440 600 L560 600', { color: '#C98A4B', sw: o(1) }) +
    P('M330 470 Q300 260 500 230 Q700 260 670 470 Q620 440 580 480 Q540 440 500 480 Q460 440 420 480 Q380 440 330 470Z', cor) +
    Ci(500, 200, 34, '#E25A52') + L('M500 170 Q520 130 560 120', { sw: o(1) });
}
/** O Papai Noel de bermuda e óculos de sol (prancheta 1000). */
function noelPraia() {
  const roupa = pessoas.papaiNoel({ hem: 690, front: R(484, 498, 32, 150, 14, '#FFFFFF') + R(466, 590, 68, 58, 10, '#FFD23F') });
  const oculos = G('translate(0,0)', R(380, 238, 104, 62, 26, '#3D2C4E') + R(516, 238, 104, 62, 26, '#3D2C4E') + L('M484 262 L516 262', { sw: o(1.4) }));
  const shorts = P('M372 640 L628 640 L640 770 L520 776 L500 700 L480 776 L360 770Z', '#FF8A3D') + [[420, 690], [580, 690]].map(([x, y]) => Ci(x, y, 20, '#FFFFFF', { sw: 0 })).join('');
  return roupa + shorts + oculos;
}

// ------------------------------------------------------------ cenários (1920 x 1080)
const sobre = (fn, cx, base, s) => place(fn, cx - 500 * s, base - 900 * s, s);
/** A praia (céu, sol, mar e areia), sem as conchinhas de enfeite (que atrapalhariam a contagem). */
function praia({ estrela = true } = {}) {
  const horiz = 560;
  const areia = 860;
  let s = R(0, 0, 1920, 1080, 0, '#BDE5FF', { sw: 0 });
  s += E(960, horiz, 1500, 220, '#DDF1FF', { sw: 0 });
  s += `<g id="sol">${sun(1700, 180, 80)}</g>`;
  s += `<g id="nv1">${skyCloud(480, 160, 0.8)}</g><g id="nv2">${skyCloud(1240, 120, 0.7)}</g>`;
  s += P(`M-20 ${horiz} Q480 ${horiz - 20} 960 ${horiz} Q1440 ${horiz + 20} 1940 ${horiz} L1940 ${areia + 40} L-20 ${areia + 40}Z`, '#3E8FE0');
  s += P(`M-20 ${horiz + 120} Q480 ${horiz + 90} 960 ${horiz + 120} Q1440 ${horiz + 150} 1940 ${horiz + 120} L1940 ${areia + 40} L-20 ${areia + 40}Z`, '#7DC1F5', { sw: 0, opacity: 0.35 });
  for (let i = 0; i < 9; i++) {
    const x = 120 + i * 220;
    const y = horiz + 50 + (i % 3) * 70;
    s += L(`M${x} ${y} Q${x + 40} ${y - 18} ${x + 80} ${y}`, { color: '#FFFFFF', sw: o(1.1), opacity: 0.8 });
  }
  s += P(`M-20 ${areia} Q500 ${areia - 40} 1000 ${areia} Q1500 ${areia + 30} 1940 ${areia - 20} L1940 1100 L-20 1100Z`, AREIA);
  s += P(`M-20 ${areia + 8} Q500 ${areia - 32} 1000 ${areia + 8}`, 'none', { stroke: '#FFFFFF', sw: o(2) });
  s += E(400, 1010, 60, 12, AREIA_ESC, { sw: 0 }) + E(1300, 1040, 80, 14, AREIA_ESC, { sw: 0 });
  if (estrela) s += place(mar.estrelaMar, 860, 990, 0.08);
  return s;
}
/** Fundo das cenas de cards: a praia de Natal. */
const fundoNeve = () => withOutline(TRACO, () => praia() + '<g id="neveF"></g>');
/** Na praia não neva: existe só para as cenas terem a mesma forma das do Vídeo 4. */
const flocos = () => '';

/** Abertura: a praia, a árvore de Natal na areia e o guarda-sol (`o1`). */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = praia();
    s += `<g id="o1">${sobre(floresta.guardaSol, 1700, 1000, 0.4)}${sobre(() => arvoreNatal(), 1250, 1010, 0.62)}${sobre(casteloAreia, 870, 1030, 0.26)}</g>`;
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau', { gorro: true }));
    return s;
  });
}

/** Onde o Papai Noel se esconde (desafio 1): atrás do guarda-sol (`arvoreEsc`). */
const ESCONDERIJO = { x: 1300, dx: 195, chao: 980, s: 0.4, arvore: { x: 1300, y: 1010 } };
/** Guarda-sol grande aberto de frente (um disco listrado): tampa o Papai Noel sentado. (cx, base) é o pé do cabo. */
function guardaSolFrente(cx, base) {
  const cy = base - 330;
  const r = 300;
  let g = tube(`M${cx} ${cy} L${cx} ${base}`, 24, '#8F5A2E') + E(cx, base, 60, 14, AREIA_ESC, { sw: 0 });
  for (let i = 0; i < 10; i++) {
    const a0 = (i / 10) * Math.PI * 2;
    const a1 = ((i + 1) / 10) * Math.PI * 2;
    g += P(`M${cx} ${cy} L${n(cx + r * Math.cos(a0))} ${n(cy + r * 0.92 * Math.sin(a0))} A${r} ${n(r * 0.92)} 0 0 1 ${n(cx + r * Math.cos(a1))} ${n(cy + r * 0.92 * Math.sin(a1))}Z`, i % 2 ? '#FFFFFF' : '#E25A52');
  }
  return g + Ci(cx, cy, 26, '#FFD23F');
}
function cenaAchar() {
  return withOutline(TRACO, () => {
    const E_ = ESCONDERIJO;
    let s = praia();
    s += sobre(() => arvoreNatal(), 1760, 1010, 0.42);
    // o pompom do gorro e a mão ficam de fora, à direita do guarda-sol: é a pista
    s += `<g id="oculta">${sobre(noelPraia, E_.x + E_.dx, E_.chao, E_.s)}</g>`;
    s += `<g id="arvoreEsc">${guardaSolFrente(E_.arvore.x, E_.arvore.y)}</g>`;
    return s;
  });
}

/** Desafio 2 — Contar: a árvore de Natal e cinco conchinhas na areia (ids p1 a p5). */
const RENAS_X = [760, 960, 1160, 1360, 1560];
function cenaRenas() {
  return withOutline(TRACO, () => {
    let s = praia();
    s += sobre(() => arvoreNatal(), 1790, 1000, 0.42);
    RENAS_X.forEach((x, i) => {
      s += `<g id="p${i + 1}">${sobre(mar.concha, x, 960 + (i % 2 ? 20 : 0), 0.17)}</g>`;
    });
    return s;
  });
}

/** Desafio 6 — Comparar: o castelo pequeno (`ov`, à esquerda) e o grande (`ca`, à direita). */
const CHAO = 990;
const PEQUENO = { x: 900, s: 0.3 };
const GRANDE = { x: 1420, s: 0.72 };
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = praia();
    s += `<g id="ov">${sobre(casteloAreia, PEQUENO.x, CHAO, PEQUENO.s)}</g>`;
    s += `<g id="ca">${sobre(casteloAreia, GRANDE.x, CHAO, GRANDE.s)}</g>`;
    return s;
  });
}

/** Encerramento: a árvore e o guarda-sol (`o1`) e o barquinho (`o2`) passeando no mar. */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = praia();
    s += `<g id="o2">${sobre(objetos.barco, 1150, 720, 0.24)}</g>`;
    s += `<g id="o1">${sobre(floresta.guardaSol, 1700, 1000, 0.4)}${sobre(() => arvoreNatal(), 1250, 1010, 0.62)}${sobre(casteloAreia, 870, 1030, 0.26)}</g>`;
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau', { gorro: true }));
    return s;
  });
}

module.exports = { arvoreNatal, arvoreSemEstrela, estrelaTopo, casteloAreia, aguaCoco, coco, sopa, chocolateQuente, casaco, bermuda, sorveteCor, noelPraia, fundoNeve, flocos, cenaAbertura, cenaAchar, cenaRenas, cenaComparar, cenaEncerramento, ESCONDERIJO, RENAS_X, CHAO, GRANDE, PEQUENO };
