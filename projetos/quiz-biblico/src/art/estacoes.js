'use strict';
/**
 * Desenhos e cenários do Vídeo 18: as estações do ano. A árvore das quatro
 * estações (com flores, verde, de outono e de inverno), a borboleta, o
 * girassol, o sorvete, as folhas, a boia e o parque. As cenas têm os mesmos
 * nomes e `id` das do Vídeo 4 (art/noel.js).
 */
const { n, o, withOutline, P, E, Ci, R, L, G, tube, sparkle, shadow, cloud } = require('../kit');
const { place, fundoQuiz, sun, TRACO } = require('./cenario');
const mar = require('./mar');
const cr = require('./criacao');
const { tuti } = require('../tuti');

// ------------------------------------------------------------ desenhos de card (prancheta 1000 x 1000)
const COPA = [[-150, -40, 120], [0, -120, 160], [150, -40, 120], [0, 20, 140], [-90, -140, 110], [90, -140, 110]];
/** A árvore de cada estação: 'primavera' | 'verao' | 'outono' | 'inverno' (base do tronco em 500, 900). */
function arvoreEstacao(estacao) {
  const tronco = P('M460 900 L470 560 Q440 520 400 500 M470 600 L480 900Z', '#A66A34') + R(455, 540, 90, 360, 20, '#A66A34');
  const copa = (fill, shade) => G('translate(500,440)', cloud(COPA, { fill, shade }));
  let s = shadow(500, 905, 300);
  if (estacao === 'inverno') {
    s += R(455, 540, 90, 360, 20, '#A66A34') + tube('M500 560 L380 380 M420 440 L330 420 M500 560 L640 360 M600 420 L700 400 M500 600 L500 330', 26, '#A66A34');
    s += E(380, 372, 50, 18, '#FFFFFF') + E(640, 352, 50, 18, '#FFFFFF') + E(500, 322, 40, 16, '#FFFFFF') + P('M300 900 Q500 860 700 900Z', '#FFFFFF');
    s += [[220, 260], [780, 300], [300, 560], [720, 600], [600, 200]].map(([x, y], i) => sparkle(x, y, 18, i * 20, '#CFE6FF')).join('');
    return s;
  }
  s += R(455, 540, 90, 360, 20, '#A66A34');
  if (estacao === 'primavera') {
    s += copa('#6CC77A', '#4FAE62');
    s += [[380, 380], [520, 300], [640, 420], [440, 500], [600, 520], [500, 420], [330, 470]].map(([x, y]) => Ci(x, y, 26, '#FF8FB1', { sw: o(0.6) }) + Ci(x, y, 9, '#FFD23F', { sw: 0 })).join('');
  } else if (estacao === 'verao') {
    s += copa('#4FAE62', '#3F9E60') + [[400, 450], [600, 430], [520, 330]].map(([x, y]) => Ci(x, y, 22, '#E25A52', { sw: o(0.6) })).join('');
  } else {
    s += copa('#F39A3B', '#D9772A');
    s += [[250, 690, 20], [760, 740, -30], [660, 860, 40], [320, 850, -10]].map(([x, y, r]) => folhaEm(x, y, 70, '#F39A3B', r)).join('');
  }
  return s;
}
/** Uma folha pequena na posição (x, y), com tamanho `t` e rotação `r`. */
const folhaEm = (x, y, t, cor, r = 0) => G(`translate(${x},${y}) rotate(${r}) scale(${n(t / 100)})`, withOutline(o(100 / t), () => P('M0 -100 C70 -60 70 60 0 100 C-70 60 -70 -60 0 -100Z', cor) + L('M0 -90 L0 90', { sw: o(0.8) })));
/** Folha grande de card; `cor` é a cor. */
const folha = (cor = '#F39A3B') => shadow(500, 900, 200) + G('rotate(-20 500 500)', P('M500 140 C760 280 760 720 500 860 C240 720 240 280 500 140Z', cor) + L('M500 170 L500 840 M500 380 L380 300 M500 380 L620 300 M500 560 L360 480 M500 560 L640 480 M500 720 L400 660 M500 720 L600 660', { sw: o(1) })) + tube('M500 860 L520 930', 18, '#8F5A2E');
const folhaCor = (cor) => () => folha(cor);
function borboleta() {
  return (
    E(380, 400, 170, 150, '#9B7EDE', { rot: -20 }) + E(620, 400, 170, 150, '#9B7EDE', { rot: 20 }) +
    E(400, 620, 120, 100, '#FF8FB1', { rot: 20 }) + E(600, 620, 120, 100, '#FF8FB1', { rot: -20 }) +
    Ci(370, 400, 50, '#FFD23F', { sw: 0 }) + Ci(630, 400, 50, '#FFD23F', { sw: 0 }) +
    E(500, 520, 34, 190, '#3D2C4E') + Ci(500, 310, 50, '#3D2C4E') +
    L('M480 270 Q440 180 400 170 M520 270 Q560 180 600 170', { sw: o(1.2) })
  );
}
function girassol() {
  const petalas = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    return E(500 + 150 * Math.cos(a), 330 + 150 * Math.sin(a), 80, 36, '#FFD23F', { rot: (a * 180) / Math.PI });
  }).join('');
  return shadow(500, 905, 180) + tube('M500 900 L500 420', 36, '#3F9E60') + E(410, 660, 100, 40, '#5DBB7A', { rot: -30 }) + E(590, 580, 100, 40, '#5DBB7A', { rot: 30 }) + petalas + Ci(500, 330, 110, '#8F5A2E') + [[470, 300], [530, 310], [490, 360], [540, 360], [450, 345]].map(([x, y]) => Ci(x, y, 10, '#5A3A28', { sw: 0 })).join('');
}
function sorvete() {
  return shadow(500, 900, 150) + P('M380 460 L620 460 L500 880Z', '#E8A85A') + L('M420 520 L560 700 M580 520 L460 740 M450 600 L540 600', { color: '#C98A4B', sw: o(1) }) + Ci(430, 400, 110, '#FF8FB1') + Ci(570, 400, 110, '#FFF1B8') + Ci(500, 290, 110, '#8F5A2E') + Ci(500, 190, 30, '#E25A52');
}
function boia() {
  return shadow(500, 880, 330) + Ci(500, 500, 330, '#FFFFFF') + Ci(500, 500, 150, '#CFE6FF', { sw: o(1) }) + P('M500 170 A330 330 0 0 1 830 500 L650 500 A150 150 0 0 0 500 350Z', '#E25A52', { sw: o(0.8) }) + P('M500 830 A330 330 0 0 1 170 500 L350 500 A150 150 0 0 0 500 650Z', '#E25A52', { sw: o(0.8) });
}
/** A praia de verão sem o sol (o "o que falta"; o sol entra no canto de cima à direita). */
function praiaSemSol() {
  return (
    R(90, 90, 820, 820, 60, '#BDE5FF', { sw: 0 }) +
    P('M90 520 Q300 480 500 520 Q700 560 910 510 L910 720 L90 720Z', '#3E8FE0') +
    L('M150 580 Q200 560 250 580 M480 600 Q530 580 580 600 M720 570 Q770 550 820 570', { color: '#FFFFFF', sw: o(1.2) }) +
    P('M90 700 Q500 640 910 700 L910 910 L90 910Z', '#F6D99A') +
    place(sorvete, 230, 650, 0.2) + place(mar.estrelaMar, 600, 720, 0.16)
  );
}
const solTopo = () => G('translate(620,140)', sun(140, 140, 70));

// ------------------------------------------------------------ cenários (1920 x 1080)
const sobre = (fn, cx, base, s) => place(fn, cx - 500 * s, base - 900 * s, s);
const fundoNeve = () => withOutline(TRACO, () => fundoQuiz() + '<g id="neveF"></g>');
const flocos = () => '';
/** A flor grande do jardim, onde a borboleta se esconde. */
const florGrande = (cx, base, s) => sobre(() => cr.flor('#FF8FB1'), cx, base, s);

/** Abertura: o parque com as quatro árvores das estações, lado a lado (`o1`). */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = fundoQuiz();
    s += `<g id="o1">${['primavera', 'verao', 'outono', 'inverno'].map((e, i) => sobre(() => arvoreEstacao(e), 850 + i * 300, 990, 0.44)).join('')}</g>`;
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau'));
    return s;
  });
}

/** Onde a borboleta se esconde (desafio 1): atrás da flor grande (`arvoreEsc`). */
const ESCONDERIJO = { x: 1300, chao: 745, s: 0.2, arvore: { x: 1300, y: 990 } };
function cenaAchar() {
  return withOutline(TRACO, () => {
    const E_ = ESCONDERIJO;
    let s = fundoQuiz();
    // uma pontinha da asa fica de fora, à direita da flor: é a pista
    s += `<g id="oculta">${sobre(borboleta, E_.x + 105, E_.chao, E_.s)}</g>`;
    s += `<g id="arvoreEsc">${florGrande(E_.arvore.x, E_.arvore.y, 0.62)}</g>`;
    s += sobre(() => arvoreEstacao('primavera'), 1760, 990, 0.4);
    return s;
  });
}

/** Desafio 2 — Contar: a árvore de outono e cinco folhas no chão (ids p1 a p5). */
const RENAS_X = [760, 960, 1160, 1360, 1560];
function cenaRenas() {
  return withOutline(TRACO, () => {
    let s = fundoQuiz();
    s += sobre(() => arvoreEstacao('outono'), 1780, 990, 0.42);
    RENAS_X.forEach((x, i) => {
      s += `<g id="p${i + 1}">${sobre(folhaCor('#F39A3B'), x, 920 + (i % 2 ? 20 : 0), 0.2)}</g>`;
    });
    return s;
  });
}

/** Desafio 6 — Comparar: o girassol pequeno (`ov`, à esquerda) e o grande (`ca`, à direita). */
const CHAO = 970;
const PEQUENO = { x: 900, s: 0.3 };
const GRANDE = { x: 1420, s: 0.7 };
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = fundoQuiz();
    s += `<g id="ov">${sobre(girassol, PEQUENO.x, CHAO, PEQUENO.s)}</g>`;
    s += `<g id="ca">${sobre(girassol, GRANDE.x, CHAO, GRANDE.s)}</g>`;
    return s;
  });
}

/** Encerramento: as quatro árvores (`o1`) e a borboleta (`o2`) voando. */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = fundoQuiz();
    s += `<g id="o1">${['primavera', 'verao', 'outono', 'inverno'].map((e, i) => sobre(() => arvoreEstacao(e), 850 + i * 300, 990, 0.44)).join('')}</g>`;
    s += `<g id="o2">${sobre(borboleta, 1300, 520, 0.14)}</g>`;
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau'));
    return s;
  });
}

module.exports = { arvoreEstacao, folha, folhaCor, folhaEm, borboleta, girassol, sorvete, boia, praiaSemSol, solTopo, fundoNeve, flocos, cenaAbertura, cenaAchar, cenaRenas, cenaComparar, cenaEncerramento, ESCONDERIJO, RENAS_X, CHAO, GRANDE, PEQUENO };
