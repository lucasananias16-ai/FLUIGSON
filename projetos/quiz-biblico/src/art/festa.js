'use strict';
/**
 * Cenários do Vídeo 5: a festa dos animais no campo da arca. Cenas em
 * 1920 x 1080, no mesmo traço e nas mesmas cores dos outros vídeos, com
 * bandeirinhas de festa e balões.
 *
 * Os elementos que a animação mexe ficam em grupos com `id`.
 */
const { n, o, withOutline, P, E, Ci, R, L, G, tube, clipD } = require('../kit');
const { sun, skyCloud, tree, bush, flowers, tuft, place, TRACO, CORES } = require('./cenario');
const animais = require('./animais');
const { tuti } = require('../tuti');

const { SKY, GRASS_FAR, GRASS, GRASS_NEAR } = CORES;
const CORES_FESTA = ['#E25A52', '#FFD23F', '#4DA3FF', '#5DBB7A', '#FF8FB1', '#9B7EDE'];

/** Céu, sol e nuvens, com os mesmos ids dos outros vídeos para a animação. */
const ceu = (sol = [240, 280, 78]) =>
  R(0, 0, 1920, 1080, 0, SKY, { sw: 0 }) + E(960, 720, 1400, 300, '#DDF3FF', { sw: 0 }) + `<g id="sol">${sun(sol[0], sol[1], sol[2])}</g>`;
const nuvens = (a, b) => `<g id="nv1">${skyCloud(a[0], a[1], a[2])}</g><g id="nv2">${skyCloud(b[0], b[1], b[2])}</g>`;

/** Fio de bandeirinhas coloridas de ponta a ponta, no alto da cena. */
function bandeirinhas(y = 30) {
  const trechos = [
    [[-20, y], [480, y + 70], [960, y + 30]],
    [[960, y + 30], [1440, y - 10], [1940, y + 60]],
  ];
  const na = ([p0, p1, p2], t) => [(1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]];
  let s = L(`M-20 ${y} Q480 ${y + 70} 960 ${y + 30} Q1440 ${y - 10} 1940 ${y + 60}`, { sw: o(0.7) });
  let i = 0;
  for (const tr of trechos) {
    for (let k = 0; k < 9; k++) {
      const [x, yy] = na(tr, (k + 0.5) / 9);
      s += P(`M${n(x - 28)} ${n(yy)} L${n(x + 28)} ${n(yy)} L${n(x)} ${n(yy + 62)}Z`, CORES_FESTA[i++ % CORES_FESTA.length], { sw: o(0.7) });
    }
  }
  return `<g id="bandeira">${s}</g>`;
}

/** Balão de festa com fio. `cor` e tamanho `r`; a animação mexe pelo `id`. */
const balao = (id, x, y, r, cor) =>
  `<g id="${id}">` +
  L(`M${x} ${y + r * 1.15} Q${x - 18} ${y + r * 1.9} ${x + 6} ${y + r * 2.7}`, { sw: o(0.6) }) +
  P(`M${x} ${y + r * 1.12} L${x - 12} ${y + r * 1.34} L${x + 12} ${y + r * 1.34}Z`, cor, { sw: o(0.6) }) +
  E(x, y, r * 0.86, r, cor) +
  E(x - r * 0.3, y - r * 0.38, r * 0.2, r * 0.3, '#FFFFFF', { sw: 0, opacity: 0.55, rot: 20 }) +
  `</g>`;

/** O campo da festa: morros, árvores, flores e as bandeirinhas. `mais` entra entre os planos do fundo e do meio. */
function campo({ festa = true, mais = '', sol } = {}) {
  let s = ceu(sol) + nuvens([650, 190, 0.95], [1560, 170, 1.1]);
  s += P('M-20 650 Q280 480 660 620 Q960 500 1380 610 Q1680 520 1940 610 L1940 1100 L-20 1100Z', GRASS_FAR);
  s += tree(118, 660, 0.9) + tree(1800, 650, 1.0) + bush(1040, 640, 0.9);
  s += P('M-20 770 Q480 700 960 748 Q1480 800 1940 730 L1940 1100 L-20 1100Z', GRASS);
  s += tuft(760, 800) + tuft(1840, 800) + tuft(120, 820);
  s += mais;
  s += P('M-20 970 Q520 900 1040 968 Q1500 1016 1940 950 L1940 1100 L-20 1100Z', GRASS_NEAR);
  s += flowers([
    [830, 1010, 1.3],
    [1100, 1040, 1.1],
    [1560, 1030, 1.4],
    [1820, 1040, 1.1],
    [90, 1010, 1.3],
  ]);
  if (festa) s += bandeirinhas();
  return s;
}

/** Bicho do campo com o centro em `x`, os pés em `chao`, escala `s`. */
const bichoEm = (id, fn, x, chao, s) => `<g id="${id}">${place(fn, x - 500 * s, chao - 884 * s, s)}</g>`;

/**
 * Caixa surpresa: o corpo (`cxc`) e a tampa com laço (`cxt`) são grupos
 * separados, para a tampa voar e o bicho sair. Centro em `cx`, no chão `chao`.
 */
function caixa(cx, chao, w, h, cor = '#E25A52', escura = '#C2443D', fita = '#FFD23F') {
  const x = cx - w / 2;
  const corpo = R(x, chao - h, w, h, w * 0.06, cor) + clipD(`M${x} ${chao - h * 0.2} L${x + w} ${chao - h * 0.2} L${x + w} ${chao} L${x} ${chao}Z`, R(x, chao - h, w, h, 0, escura, { sw: 0 })) + R(x, chao - h, w, h, w * 0.06, 'none') + R(cx - w * 0.09, chao - h, w * 0.18, h, 4, fita) + E(cx, chao + 8, w * 0.62, w * 0.07, '#3D2C4E', { sw: 0, opacity: 0.16 });
  const topo = chao - h;
  const tampa =
    R(x - w * 0.04, topo - h * 0.16, w * 1.08, h * 0.18, w * 0.05, cor) +
    R(cx - w * 0.09, topo - h * 0.16, w * 0.18, h * 0.18, 4, fita) +
    P(`M${cx} ${topo - h * 0.16} C${cx - w * 0.3} ${topo - h * 0.46} ${cx - w * 0.34} ${topo - h * 0.1} ${cx} ${topo - h * 0.16}Z`, fita) +
    P(`M${cx} ${topo - h * 0.16} C${cx + w * 0.3} ${topo - h * 0.46} ${cx + w * 0.34} ${topo - h * 0.1} ${cx} ${topo - h * 0.16}Z`, fita) +
    Ci(cx, topo - h * 0.16, w * 0.05, fita);
  return { corpo: `<g id="cxc">${corpo}</g>`, tampa: `<g id="cxt">${tampa}</g>` };
}

/** Abertura: o campo em festa, balões e a Tuti acenando. */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = campo();
    s += balao('b1', 1500, 280, 62, '#E25A52') + balao('b2', 1620, 330, 54, '#4DA3FF') + balao('b3', 1730, 270, 58, '#FFD23F');
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau'));
    return s;
  });
}

/**
 * Visita: o campo com a caixa surpresa à direita (ids `cxc` e `cxt`) e o bicho
 * (`bicho`) escondido dentro dela. `bicho` é { fn, escala, x, chao }.
 */
function cenaVisita({ fn, escala, caixaAlt = 300, caixaLarg = 300 }) {
  return withOutline(TRACO, () => {
    const cx = 1560;
    const chao = 900;
    const c = caixa(cx, chao, caixaLarg, caixaAlt);
    let s = campo({ festa: true });
    s += `<g id="bicho">${place(fn, 1180 - 500 * escala, chao - 884 * escala, escala)}</g>`;
    s += c.corpo + c.tampa;
    return s;
  });
}

/** Cena do jogo "A Tuti diz" e das lições: o campo limpo, para a Tuti aparecer grande. */
function cenaCampo() {
  return withOutline(TRACO, () => campo());
}

/**
 * Esconde-esconde: a girafa (`oculta`) atrás da árvore grande (`arvoreEsc`). A copa
 * esconde o corpo e os arbustos da frente escondem as pernas; só a cabeça de pescoço
 * comprido aparece no alto, porque girafa é alta.
 */
const ESC_GIRAFA = { x: 1210, chao: 905, s: 0.8, arvore: { x: 1210, y: 920, s: 1.9 } };
function cenaAchar() {
  return withOutline(TRACO, () => {
    const E_ = ESC_GIRAFA;
    let s = ceu([1700, 250, 70]) + nuvens([560, 260, 0.7], [1280, 240, 0.6]);
    s += P('M-20 650 Q280 480 660 620 Q960 500 1380 610 Q1680 520 1940 610 L1940 1100 L-20 1100Z', GRASS_FAR);
    s += bush(520, 700, 0.9) + bush(1760, 690, 0.9);
    s += P('M-20 780 Q500 710 1000 760 Q1500 810 1940 740 L1940 1100 L-20 1100Z', GRASS);
    s += tuft(620, 860) + tuft(1840, 850);
    s += bichoEm('oculta', animais.girafa, E_.x, E_.chao, E_.s);
    s += `<g id="arvoreEsc">${tree(E_.arvore.x, E_.arvore.y, E_.arvore.s)}</g>`;
    s += bush(1070, 945, 2.6) + bush(1350, 945, 2.6);
    s += P('M-20 1010 Q520 960 1040 1004 Q1500 1040 1940 990 L1940 1100 L-20 1100Z', GRASS_NEAR);
    s += flowers([
      [560, 1040, 1.2],
      [1180, 1046, 1.2],
      [1840, 1040, 1.2],
    ]);
    return s;
  });
}

/** Contar: cinco elefantes enfileirados (ids p1 a p5). */
const ELEFANTES_X = [720, 940, 1160, 1380, 1600];
function cenaElefantes() {
  return withOutline(TRACO, () => {
    let s = campo({ festa: true });
    ELEFANTES_X.forEach((x, i) => {
      s += bichoEm(`p${i + 1}`, animais.elefante, x, 930 + (i % 2 ? 12 : 0), 0.26);
    });
    return s;
  });
}

/** Final: o campo em festa com os bichos dançando (`a1` a `a3`) e a Tuti por cima. */
function cenaFinal({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = campo({ festa: true });
    s += bichoEm('a1', animais.leao, 700, 900, 0.34) + bichoEm('a2', animais.elefante, 1040, 900, 0.34) + bichoEm('a3', animais.girafa, 1380, 900, 0.34);
    s += balao('b1', 1560, 300, 62, '#E25A52') + balao('b2', 1680, 360, 54, '#4DA3FF') + balao('b3', 1790, 290, 58, '#FFD23F');
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau'));
    return s;
  });
}

module.exports = { campo, balao, caixa, cenaAbertura, cenaVisita, cenaCampo, cenaAchar, cenaElefantes, cenaFinal, ESC_GIRAFA, ELEFANTES_X };
