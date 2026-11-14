'use strict';
/**
 * Cenários do Vídeo 4: o Quiz do Papai Noel. Cenas em 1920 x 1080, no mesmo
 * traço dos outros vídeos, todas na neve: noite de neve na abertura, no
 * desafio 1 e no encerramento; dia de neve nos desafios de cards.
 *
 * Os elementos que a animação mexe ficam em grupos com `id`.
 */
const Z = require('../anim/ease');
const { n, o, withOutline, P, E, Ci, R, L, G, cloud, tube, sparkle } = require('../kit');
const { skyCloud, tuft, place, TRACO } = require('./cenario');
const { ceuNoite, nuvemNoite } = require('./natal');
const pessoas = require('./pessoas');
const animais = require('./animais');
const objetos = require('./objetos');
const { tuti } = require('../tuti');

const NEVE_LONGE = '#C9DDF2';
const NEVE = '#E4EFFB';
const NEVE_PERTO = '#FFFFFF';
const NEVE_SOMBRA = '#B9D0EA';

/** Pinheiro; (x, y) é a base do tronco. `enfeites` põe bolas coloridas e uma estrela no topo. */
function pinheiro(x, y, s = 1, enfeites = false) {
  const camada = (apice, base, meia, cor) => {
    const d = `M0 ${apice} Q${meia * 0.35} ${apice + (base - apice) * 0.35} ${meia} ${base - 14} Q${meia + 10} ${base} ${meia - 24} ${base} L${-meia + 24} ${base} Q${-meia - 10} ${base} ${-meia} ${base - 14} Q${-meia * 0.35} ${apice + (base - apice) * 0.35} 0 ${apice}Z`;
    return P(d, cor);
  };
  const neve = (base, meia) =>
    P(`M${-meia + 8} ${base - 30} Q${-meia * 0.5} ${base - 56} 0 ${base - 38} Q${meia * 0.5} ${base - 56} ${meia - 8} ${base - 30} Q${meia * 0.6} ${base - 6} 0 ${base - 20} Q${-meia * 0.6} ${base - 6} ${-meia + 8} ${base - 30}Z`, '#FFFFFF', { sw: o(0.7) });
  let g =
    R(-34, -90, 68, 100, 10, '#8F5A2E') +
    camada(-300, -50, 250, '#2F8F5A') +
    neve(-50, 250) +
    camada(-420, -190, 190, '#3AA568') +
    neve(-190, 190) +
    camada(-520, -330, 130, '#46B374') +
    neve(-330, 130);
  if (enfeites) {
    const bolas = [
      [-130, -110, '#E25A52'], [90, -140, '#FFD23F'], [-40, -230, '#4DA3FF'], [120, -260, '#E25A52'],
      [-110, -290, '#FFD23F'], [10, -380, '#E25A52'], [-50, -450, '#FFD23F'], [60, -440, '#4DA3FF'], [170, -100, '#4DA3FF'], [-190, -150, '#9B7EDE'],
    ];
    g += bolas.map(([bx, by, c]) => Ci(bx, by, 17, c, { sw: o(0.7) }) + Ci(bx - 5, by - 6, 4.5, '#FFFFFF', { sw: 0, opacity: 0.8 })).join('');
    g += tube('M-200 -170 Q-120 -130 -40 -160 Q40 -190 130 -120', 5, '#FFD23F');
    g += sparkle(0, -548, 46, 0, '#FFD23F');
  }
  return G(`translate(${x},${y}) scale(${s})`, withOutline(o(1 / s), () => g));
}

/** Casinha de madeira com telhado nevado, janela acesa e chaminé. Caixa local de 560 x 460, chão em y = 460. */
function casa() {
  const telhado = 'M-30 190 L280 20 L590 190Z';
  return (
    // chaminé e fumaça
    R(420, 40, 70, 130, 8, '#C2543F') +
    R(408, 22, 94, 32, 12, '#FFFFFF') +
    cloud([[450, -20, 26], [486, -54, 32], [520, -30, 24]], { fill: '#F2F0F8', shade: '#D6D2E4', sx: -3, sy: -5 }) +
    R(20, 180, 520, 280, 12, '#C98A4B') +
    L('M20 250 L540 250 M20 320 L540 320 M20 390 L540 390', { color: '#A66A34', sw: o(0.7) }) +
    P(telhado, '#E25A52') +
    P('M-30 190 L280 20 L590 190 Q540 214 500 190 Q440 222 380 190 Q320 216 270 190 Q210 224 150 190 Q90 216 40 190 Q0 214 -30 190Z', '#FFFFFF') +
    // janela acesa e porta
    R(70, 270, 140, 120, 14, '#FFE9A8') +
    L('M140 270 L140 390 M70 330 L210 330', { sw: o(1) }) +
    R(70, 270, 140, 120, 14, 'none') +
    P('M330 460 L330 330 A60 60 0 0 1 450 330 L450 460Z', '#B5562E') +
    Ci(432, 400, 9, '#FFD23F', { sw: o(0.5) }) +
    Ci(390, 322, 26, '#5DBB7A', { sw: o(0.7) }) +
    Ci(390, 322, 12, '#B5562E', { sw: o(0.6) })
  );
}

const renaEm = (id, x, y, s) => `<g id="${id}">${place(animais.rena, x, y, s)}</g>`;
/** Pessoa com o centro em `x` e os pés em `chao`. */
const pessoaEm = (id, fn, x, chao, s, cfg) => `<g id="${id}">${place(() => fn(cfg), x - 500 * s, chao - 905 * s, s)}</g>`;

/** Montinhos de neve, no lugar das touceiras de grama. */
const monte = (x, y) => L(`M${x - 40} ${y} Q${x - 18} ${y - 20} ${x} ${y} Q${x + 18} ${y - 20} ${x + 40} ${y}`, { color: NEVE_SOMBRA, sw: o(0.9) });

/** Flocos de neve caindo. `t` é o tempo em segundos; muda de lugar sem repetir o desenho. */
function flocos(t, qtd = 46) {
  let s = '';
  for (let i = 0; i < qtd; i++) {
    const vel = 38 + Z.rand(i, 1) * 52;
    const r = 3 + Z.rand(i, 2) * 5;
    const y = (Z.rand(i, 3) * 1180 + vel * t) % 1180 - 50;
    const x = (Z.rand(i, 4) * 1980 - 30 + Math.sin(t * (0.5 + Z.rand(i, 5)) + i) * 26 + 14 * t) % 1980;
    s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="#FFFFFF" opacity="${n(0.55 + Z.rand(i, 6) * 0.4)}"/>`;
  }
  return s;
}

/** Fundo da tela de cards: dia de neve, com a Tuti e os cards em cima. */
function fundoNeve() {
  return withOutline(TRACO, () => {
    let s = R(0, 0, 1920, 1080, 0, '#C4E1FF', { sw: 0 });
    s += E(960, 860, 1500, 360, '#E2F0FF', { sw: 0 });
    s += skyCloud(150, 150, 0.8) + skyCloud(1790, 176, 0.86);
    s += pinheiro(1840, 960, 0.4) + pinheiro(1740, 980, 0.3);
    s += P('M-20 936 Q480 884 960 918 Q1480 952 1940 902 L1940 1100 L-20 1100Z', NEVE);
    s += monte(600, 970) + monte(1480, 978) + monte(820, 1000);
    s += P('M-20 1040 Q520 1000 1040 1036 Q1500 1066 1940 1026 L1940 1100 L-20 1100Z', NEVE_PERTO);
    s += sparkle(560, 1040, 12, 0, '#FFFFFF') + sparkle(1420, 1050, 10, 14, '#B9D0EA');
    s += '<g id="neveF"></g>';
    return s;
  });
}

const colinas = (topo) =>
  P(`M-20 ${topo + 120} Q300 ${topo - 60} 700 ${topo + 70} Q1100 ${topo - 40} 1500 ${topo + 60} Q1750 ${topo - 20} 1940 ${topo + 40} L1940 1100 L-20 1100Z`, NEVE_LONGE);

/** Abertura: noite de neve, o Papai Noel acenando, duas renas e a Tuti (com `comTuti`, de gorro). */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = ceuNoite();
    s += `<g id="nv1">${nuvemNoite(640, 190, 0.95)}</g><g id="nv2">${nuvemNoite(1300, 120, 0.8)}</g>`;
    s += colinas(640);
    s += pinheiro(118, 720, 0.55) + pinheiro(1790, 700, 0.5) + pinheiro(1700, 740, 0.38);
    s += P('M-20 790 Q480 720 960 768 Q1480 820 1940 750 L1940 1100 L-20 1100Z', NEVE);
    s += monte(760, 820) + monte(1840, 820) + monte(120, 840);
    s += renaEm('o3', 1400, 480, 0.3);
    s += renaEm('o2', 560, 650, 0.38);
    s += pessoaEm('pa', pessoas.papaiNoel, 1120, 850, 0.58, { armR: [756, 470] });
    s += renaEm('o1', 1360, 640, 0.46);
    s += P('M-20 980 Q520 910 1040 978 Q1500 1026 1940 960 L1940 1100 L-20 1100Z', NEVE_PERTO);
    s += sparkle(830, 1020, 14, 0, '#B9D0EA') + sparkle(1560, 1040, 12, 14, '#B9D0EA') + monte(1100, 1046) + monte(300, 1040);
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau', { gorro: true }));
    return s;
  });
}

/** Onde o Papai Noel se esconde (desafio 1): o centro dele, os pés, a escala e o pinheiro que o cobre. */
const ESCONDERIJO = { x: 1120, chao: 815, s: 0.5, arvore: { x: 1230, y: 900, s: 1.3 } };

/** Desafio 1 — Achar: o Papai Noel (`oculta`) fica atrás do pinheiro enfeitado (`arvoreEsc`). */
function cenaAchar() {
  return withOutline(TRACO, () => {
    const T = ESCONDERIJO;
    let s = ceuNoite();
    s += `<g id="nv1">${nuvemNoite(560, 230, 0.8)}</g><g id="nv2">${nuvemNoite(1700, 200, 0.7)}</g>`;
    s += colinas(700);
    s += pinheiro(640, 800, 0.5) + pinheiro(1790, 780, 0.55) + pinheiro(1880, 800, 0.4);
    s += P('M-20 840 Q500 770 1000 820 Q1500 870 1940 800 L1940 1100 L-20 1100Z', NEVE);
    s += monte(620, 890) + monte(1180, 960) + monte(1840, 900);
    s += `<g id="oculta">${pessoaEm('', pessoas.papaiNoel, T.x, T.chao, T.s, { armR: [756, 470] })}</g>`;
    s += `<g id="arvoreEsc">${pinheiro(T.arvore.x, T.arvore.y, T.arvore.s, true)}</g>`;
    s += P('M-20 1010 Q520 960 1040 1004 Q1500 1040 1940 990 L1940 1100 L-20 1100Z', NEVE_PERTO);
    s += sparkle(560, 1040, 12, 0, '#B9D0EA') + sparkle(1180, 1050, 12, 14, '#B9D0EA');
    return s;
  });
}

/** Desafio 2 — Contar: quatro renas enfileiradas na neve (ids p1 a p4). */
const RENAS_X = [820, 1090, 1360, 1630];
function cenaRenas() {
  return withOutline(TRACO, () => {
    let s = ceuNoite();
    s += `<g id="nv1">${nuvemNoite(700, 250, 0.8)}</g><g id="nv2">${nuvemNoite(1620, 210, 0.7)}</g>`;
    s += colinas(660);
    s += pinheiro(120, 740, 0.5) + pinheiro(1820, 720, 0.45);
    s += P('M-20 790 Q480 740 960 780 Q1480 820 1940 760 L1940 1100 L-20 1100Z', NEVE);
    RENAS_X.forEach((x, i) => {
      const sc = 0.36;
      const chao = 900 + (i % 2 ? 14 : 0);
      s += `<g id="p${i + 1}">${place(animais.rena, x - 520 * sc, chao - 886 * sc, sc)}</g>`;
    });
    s += monte(700, 950) + monte(1500, 960) + monte(1900, 940);
    s += P('M-20 1010 Q520 960 1040 1004 Q1500 1040 1940 990 L1940 1100 L-20 1100Z', NEVE_PERTO);
    s += sparkle(980, 1040, 12, 14, '#B9D0EA');
    return s;
  });
}

/** Desafio 5 — Comparar: o duendezinho e o Papai Noel, lado a lado na neve. */
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = R(0, 0, 1920, 1080, 0, '#C4E1FF', { sw: 0 });
    s += E(960, 700, 1500, 420, '#E2F0FF', { sw: 0 });
    s += `<g id="nv1">${skyCloud(560, 170, 0.8)}</g><g id="nv2">${skyCloud(1700, 150, 0.9)}</g>`;
    s += pinheiro(1840, 780, 0.55) + pinheiro(60, 800, 0.5);
    s += P('M-20 760 Q300 700 700 750 Q1100 690 1500 740 Q1750 700 1940 730 L1940 1100 L-20 1100Z', NEVE_LONGE);
    s += P('M-20 880 Q500 830 1000 866 Q1500 900 1940 850 L1940 1100 L-20 1100Z', NEVE);
    s += pessoaEm('ov', pessoas.duende, 800, 970, 0.42, { armR: [756, 500] });
    s += pessoaEm('ca', pessoas.papaiNoel, 1330, 975, 0.8, { armR: [756, 500] });
    s += P('M-20 1030 Q520 990 1040 1026 Q1500 1056 1940 1016 L1940 1100 L-20 1100Z', NEVE_PERTO);
    s += monte(300, 1060) + monte(1600, 1066);
    return s;
  });
}

/** Encerramento: a casinha iluminada, o trenó, as renas, o Papai Noel e a Tuti de gorro dando tchau. */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = ceuNoite();
    s += `<g id="nv1">${nuvemNoite(520, 150, 0.7)}</g><g id="nv2">${nuvemNoite(1760, 260, 0.8)}</g>`;
    s += colinas(660);
    s += pinheiro(900, 720, 0.45) + pinheiro(1880, 760, 0.5);
    s += P('M-20 800 Q480 740 960 782 Q1480 830 1940 764 L1940 1100 L-20 1100Z', NEVE);
    s += G('translate(1090,400) scale(0.86)', withOutline(TRACO / 0.86, casa));
    s += monte(520, 850) + monte(1860, 840);
    s += `<g id="tr">${place(objetos.treno, 760, 560, 0.4)}</g>`;
    s += renaEm('o2', 620, 700, 0.3);
    s += pessoaEm('pa', pessoas.papaiNoel, 1740, 900, 0.5, { armR: [756, 470] });
    s += renaEm('o1', 960, 700, 0.32);
    s += P('M-20 990 Q520 930 1040 990 Q1500 1036 1940 976 L1940 1100 L-20 1100Z', NEVE_PERTO);
    s += sparkle(470, 1040, 12, 0, '#B9D0EA') + sparkle(1130, 1050, 12, 14, '#B9D0EA') + monte(760, 1050);
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau', { gorro: true }));
    return s;
  });
}

module.exports = { pinheiro, flocos, fundoNeve, cenaAbertura, cenaAchar, cenaRenas, cenaComparar, cenaEncerramento, ESCONDERIJO, RENAS_X };
