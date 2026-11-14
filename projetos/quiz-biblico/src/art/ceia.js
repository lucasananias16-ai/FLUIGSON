'use strict';
/**
 * Comidas e cenários do Vídeo 11: a cozinha e a mesa da ceia de Natal. As cenas
 * têm os mesmos nomes e os mesmos `id` das do Vídeo 4 (art/noel.js), para as
 * cenas animadas serem as mesmas com outro cenário.
 */
const { n, o, withOutline, P, E, Ci, R, L, G, sparkle, shadow } = require('../kit');
const { place, TRACO } = require('./cenario');
const { tuti } = require('../tuti');

const MASSA = '#E0A45C';
const MASSA_ESC = '#C98A4B';
const GLACE = '#FFFFFF';

// ------------------------------------------------------------ comidas (prancheta 1000 x 1000)
function panetone() {
  const papel = 'M250 540 L750 540 L716 872 Q500 908 284 872Z';
  return (
    shadow(500, 900, 290) +
    P('M226 556 C150 380 290 190 500 190 C710 190 850 380 774 556 Q500 610 226 556Z', '#E8A85A') +
    E(400, 310, 90, 44, '#F6C98A', { sw: 0, rot: -24 }) +
    [[330, 430, '#E25A52'], [470, 380, '#5DBB7A'], [610, 440, '#E25A52'], [540, 280, '#FFD23F'], [690, 340, '#5DBB7A'], [400, 500, '#FFD23F'], [640, 520, '#9B5A3C']].map(([x, y, c]) => Ci(x, y, 24, c, { sw: o(0.7) })).join('') +
    P(papel, MASSA_ESC) +
    L('M330 548 L350 884 M415 556 L425 894 M500 560 L500 898 M585 556 L575 894 M670 548 L650 884', { color: '#A66A34', sw: o(0.7) }) +
    P('M244 520 Q500 580 756 520 L750 590 Q500 640 250 590Z', '#E25A52')
  );
}

/** Chama da vela, com o brilho em volta; a ponta do pavio fica em (500, 300). */
const chama = () =>
  `<circle cx="500" cy="220" r="150" fill="#FFE27A" opacity="0.35"/>` +
  P('M500 60 C590 170 600 230 600 250 C600 310 555 340 500 340 C445 340 400 310 400 250 C400 230 410 170 500 60Z', '#FF9F2E') +
  P('M500 170 C540 230 548 262 548 276 C548 306 526 322 500 322 C474 322 452 306 452 276 C452 262 460 230 500 170Z', '#FFE680', { sw: 0 });

/** Vela vermelha no pires dourado. `acesa` põe a chama. */
function vela(acesa = true) {
  return (
    shadow(500, 912, 230) +
    E(500, 880, 210, 46, '#F4B824') +
    R(410, 330, 180, 540, 36, '#E25A52') +
    L('M410 480 L590 430 M410 620 L590 570 M410 760 L590 710', { color: GLACE, sw: o(1.6) }) +
    P('M410 366 Q410 330 446 330 L554 330 Q590 330 590 366 L590 400 Q560 440 530 400 Q500 450 470 400 Q440 430 410 400Z', '#FF8A80') +
    L('M500 330 L500 290', { sw: o(1.1) }) +
    (acesa ? chama() : '')
  );
}

function estrelaPath(cx, cy, r1, r2) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? r2 : r1;
    d += `${i ? 'L' : 'M'}${n(cx + r * Math.cos(a))} ${n(cy + r * Math.sin(a))} `;
  }
  return d + 'Z';
}
const confeitos = (pts) => pts.map(([x, y], i) => Ci(x, y, 20, ['#E25A52', '#5DBB7A', '#FFD23F', '#4DA3FF'][i % 4], { sw: o(0.6) })).join('');

function biscoitoEstrela() {
  return (
    shadow(500, 900, 300) +
    P(estrelaPath(500, 510, 390, 200), MASSA) +
    `<path d="${estrelaPath(500, 510, 270, 135)}" fill="none" stroke="${GLACE}" stroke-linejoin="round" stroke-width="${n(o(1.6))}"/>` +
    confeitos([[500, 400], [410, 540], [590, 540], [500, 610]])
  );
}
function biscoitoCoracao() {
  const d = 'M500 860 C200 640 110 470 150 330 C190 190 390 150 500 300 C610 150 810 190 850 330 C890 470 800 640 500 860Z';
  return (
    shadow(500, 900, 280) +
    P(d, MASSA) +
    L('M500 740 C300 590 240 480 262 380 C286 290 410 280 500 400 C590 280 714 290 738 380 C760 480 700 590 500 740Z', { color: GLACE, sw: o(1.6) }) +
    confeitos([[400, 470], [600, 470], [500, 580]])
  );
}
function biscoitoRedondo() {
  return (
    shadow(500, 900, 290) +
    Ci(500, 510, 350, MASSA) +
    Ci(500, 510, 250, 'none', { stroke: GLACE, sw: o(1.6) }) +
    [[400, 400], [600, 430], [470, 560], [620, 620], [360, 600], [520, 330]].map(([x, y]) => Ci(x, y, 34, '#6B4226', { sw: o(0.6) })).join('')
  );
}

/** Biscoito de gengibre em forma de bonequinho, sorrindo. */
function gengibre() {
  const d =
    'M392 384 A152 152 0 1 1 608 384 L710 400 C800 400 800 520 710 520 L620 520 L620 640 L700 800 C730 880 620 924 574 852 L500 730 L426 852 C380 924 270 880 300 800 L380 640 L380 520 L290 520 C200 520 200 400 290 400Z';
  return (
    shadow(500, 912, 260) +
    P(d, MASSA) +
    L('M250 420 Q270 460 250 500 M750 420 Q730 460 750 500 M330 760 Q370 790 400 760 M600 760 Q630 790 670 760', { color: GLACE, sw: o(1.5) }) +
    Ci(446, 250, 20, '#3D2C4E', { sw: 0 }) +
    Ci(554, 250, 20, '#3D2C4E', { sw: 0 }) +
    L('M440 310 Q500 366 560 310', { sw: o(1.1) }) +
    E(400, 304, 28, 18, '#FF9E8A', { sw: 0, opacity: 0.8 }) +
    E(600, 304, 28, 18, '#FF9E8A', { sw: 0, opacity: 0.8 }) +
    P('M440 400 L500 430 L440 460Z', '#E25A52') +
    P('M560 400 L500 430 L560 460Z', '#E25A52') +
    Ci(500, 520, 22, '#5DBB7A', { sw: o(0.6) }) +
    Ci(500, 600, 22, '#FFD23F', { sw: o(0.6) })
  );
}

function pirulito() {
  return (
    shadow(500, 930, 150) +
    R(478, 540, 44, 380, 20, '#FFFFFF') +
    Ci(500, 350, 260, '#FF8FB1') +
    L('M500 350 C500 300 570 300 570 360 C570 440 440 450 430 350 C420 230 600 200 650 350 C690 500 430 560 360 400 C310 270 400 150 520 150', { color: '#FFFFFF', sw: o(2.2) }) +
    P('M420 600 L500 640 L420 690Z', '#4DA3FF') +
    P('M580 600 L500 640 L580 690Z', '#4DA3FF') +
    Ci(500, 640, 24, '#2E86E6', { sw: o(0.7) })
  );
}

// ------------------------------------------------------------ a cozinha e a mesa (1920 x 1080)
/** A cozinha: parede clara, janela com neve, prateleira com potes e o chão. `forno` põe o fogão; `janela` e `prateleira` podem sair. */
function cozinha({ forno = false, janela = true, prateleira = true } = {}) {
  let s = R(0, 0, 1920, 1080, 0, '#FFEFD6', { sw: 0 });
  s += R(0, 700, 1920, 120, 0, '#FBD9B0', { sw: 0 }) + L('M0 700 L1920 700', { color: '#FFFFFF', sw: o(2.4) });
  // janela com neve
  if (janela) s += R(1500, 230, 300, 270, 26, '#27386E') + E(1650, 480, 150, 40, '#E4EFFB', { sw: 0 }) + [[1570, 300], [1700, 290], [1640, 380], [1750, 390], [1590, 420]].map(([x, y]) => Ci(x, y, 7, '#FFFFFF', { sw: 0 })).join('') + R(1500, 230, 300, 270, 26, 'none') + L('M1650 230 L1650 500 M1500 365 L1800 365', { sw: o(1.1) });
  if (janela) s += P('M1480 230 Q1650 300 1820 230 L1820 200 L1480 200Z', '#E25A52');
  // prateleira com potes
  if (prateleira) s += R(640, 400, 520, 26, 10, '#B97A45');
  if (prateleira) s += R(680, 300, 90, 100, 16, '#FF8FB1') + R(672, 284, 106, 26, 10, '#FFFFFF') + R(810, 320, 80, 80, 14, '#7FB7E6') + R(802, 304, 96, 24, 10, '#FFFFFF') + R(940, 290, 100, 110, 18, '#9BCB9A') + R(932, 274, 116, 26, 10, '#FFFFFF') + Ci(1100, 360, 40, '#FFD23F');
  if (forno) {
    s += R(1240, 560, 300, 330, 18, '#DCE4F2') + R(1270, 660, 240, 180, 14, '#3B3548') + R(1290, 680, 200, 140, 10, '#FF9F2E') + R(1330, 720, 120, 70, 30, '#E8A85A') + R(1280, 626, 220, 16, 8, '#8A8496') + Ci(1290, 596, 12, '#E25A52', { sw: o(0.6) }) + Ci(1340, 596, 12, '#3B3548', { sw: o(0.6) }) + Ci(1390, 596, 12, '#3B3548', { sw: o(0.6) });
  }
  s += P('M-20 880 L1940 880 L1940 1100 L-20 1100Z', '#C98A4B');
  s += L('M-20 960 L1940 960 M-20 1030 L1940 1030 M300 880 L260 1100 M900 880 L900 1100 M1500 880 L1560 1100', { color: '#A66A34', sw: o(0.7) });
  return s;
}

/** A mesa com toalha vermelha e barra branca; `topo` é a altura do tampo. Vai de x = 600 até a borda direita. */
function mesa(topo) {
  let barra = `M600 ${topo + 70}`;
  for (let x = 600; x < 1960; x += 80) barra += ` Q${x + 40} ${topo + 120} ${x + 80} ${topo + 70}`;
  return (
    R(700, topo + 60, 60, 400, 10, '#8F5A2E') +
    P(`M600 ${topo} L1960 ${topo} L1960 ${topo + 70} L600 ${topo + 70}Z`, '#E25A52') +
    P(`${barra} L1960 ${topo + 240} L600 ${topo + 240}Z`, '#C94A44') +
    P(`${barra} L1960 ${topo + 70} L600 ${topo + 70}Z`, '#FFFFFF') +
    L(`M600 ${topo} L1960 ${topo}`, { sw: o(1) })
  );
}

/** Um desenho de prancheta com o meio em `cx` e a base em `base` (a base do desenho fica em y = 900). */
const sobre = (fn, cx, base, s) => place(fn, cx - 500 * s, base - 900 * s, s);
/** Prato com três biscoitos. */
const prato = (cx, base) =>
  E(cx, base - 12, 170, 34, '#FFFFFF') + sobre(biscoitoRedondo, cx - 80, base - 4, 0.13) + sobre(biscoitoCoracao, cx + 80, base - 4, 0.13) + sobre(biscoitoEstrela, cx, base - 30, 0.15);

/** Fundo das cenas de cards: a parede e o chão da cozinha, sem nada atrás dos cards. */
const fundoNeve = () => withOutline(TRACO, () => cozinha({ janela: false, prateleira: false }));
/** Dentro de casa não neva: existe só para as cenas terem a mesma forma das do Vídeo 4. */
const flocos = () => '';

const MESA = 860;

/** Abertura: a cozinha com o forno aceso e a mesa ainda vazia. */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = cozinha({ forno: true });
    s += mesa(MESA);
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau', { gorro: true }));
    return s;
  });
}

/** Onde o biscoito de gengibre se esconde (desafio 1): atrás do panetone (`arvoreEsc`). */
const ESCONDERIJO = { x: 1400, chao: 760, s: 0.34, arvore: { x: 1290, y: 640 } };
function cenaAchar() {
  return withOutline(TRACO, () => {
    const E_ = ESCONDERIJO;
    let s = cozinha();
    s += mesa(MESA);
    s += sobre(() => vela(false), 1840, MESA + 6, 0.22) + prato(1650, MESA + 14);
    s += `<g id="oculta">${sobre(gengibre, E_.x, E_.chao, E_.s)}</g>`;
    s += `<g id="arvoreEsc">${sobre(panetone, E_.arvore.x, MESA + 14, 0.5)}</g>`;
    return s;
  });
}

/** Desafio 2 — Contar: cinco velas na mesa (ids p1 a p5); a chama de cada uma acende (j1 a j5). */
const RENAS_X = [730, 960, 1190, 1420, 1650];
const VELA_S = 0.3;
function cenaRenas() {
  return withOutline(TRACO, () => {
    let s = cozinha({ prateleira: false });
    s += mesa(MESA);
    RENAS_X.forEach((x, i) => {
      const base = MESA + 10 + (i % 2 ? 14 : 0);
      s += `<g id="p${i + 1}">${sobre(() => vela(false), x, base, VELA_S)}<g id="j${i + 1}" style="opacity:0">${sobre(chama, x, base, VELA_S)}</g></g>`;
    });
    return s;
  });
}

/** Desafio 5 — Comparar: o panetone grande (`ca`, à esquerda) e o pequeno (`ov`, à direita). */
const GRANDE = { x: 960, s: 0.62 };
const PEQUENO = { x: 1500, s: 0.3 };
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = cozinha({ prateleira: false });
    s += mesa(MESA);
    s += `<g id="ca">${sobre(panetone, GRANDE.x, MESA + 16, GRANDE.s)}</g>`;
    s += `<g id="ov">${sobre(panetone, PEQUENO.x, MESA + 16, PEQUENO.s)}</g>`;
    return s;
  });
}

/** Encerramento: a mesa pronta, com as cinco velas acesas (chamas `j1` a `j5`), o panetone, os biscoitos e o bonequinho (`o1`). */
const VELAS_FIM = [760, 900, 1560, 1700, 1840];
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = cozinha({ forno: false });
    s += mesa(MESA);
    VELAS_FIM.forEach((x, i) => {
      const base = MESA + 6;
      s += sobre(() => vela(false), x, base, 0.24) + `<g id="j${i + 1}">${sobre(chama, x, base, 0.24)}</g>`;
    });
    s += sobre(panetone, 1230, MESA + 16, 0.56);
    s += prato(1010, MESA + 30);
    s += `<g id="o1">${sobre(gengibre, 1440, MESA + 12, 0.22)}</g>`;
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau', { gorro: true }));
    return s;
  });
}

module.exports = { panetone, vela, chama, biscoitoEstrela, biscoitoCoracao, biscoitoRedondo, gengibre, pirulito, cozinha, mesa, fundoNeve, flocos, cenaAbertura, cenaAchar, cenaRenas, cenaComparar, cenaEncerramento, ESCONDERIJO, RENAS_X, MESA, GRANDE, PEQUENO };
