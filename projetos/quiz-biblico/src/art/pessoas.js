'use strict';
/**
 * Personagens humanos. Todos saem do mesmo boneco (`person`), mudando cabelo,
 * barba, roupa e o que seguram. Prancheta de 1000 x 1000, chão em y = 900.
 */
const { n, o, P, E, Ci, R, L, G, clipD, tube, cloud, curl, ik, limb, squircle, eye, cheek, shadow } = require('../kit');

const WOOD = '#C98A4B';
const WOOD_DARK = '#A66A34';
const STONE = '#B8B5C6';

const FACE = squircle(168, 158);
const CACHOS = [
  [-141, -67, 39],
  [-112, -113, 46],
  [-61, -148, 51],
  [0, -162, 54],
  [61, -148, 51],
  [112, -113, 46],
  [141, -67, 39],
  [-82, -92, 41],
  [-28, -105, 44],
  [28, -105, 44],
  [82, -92, 41],
  [0, -123, 57],
];
const VEIL_BACK =
  'M-186 -30 C-196 -236 196 -236 186 -30 C196 60 212 120 226 172 C170 200 128 190 116 150 L-116 150 C-128 190 -170 200 -226 172 C-212 120 -196 60 -186 -30Z';
const VEIL_FRONT = 'M-186 -30 C-196 -236 196 -236 186 -30 Q0 -116 -186 -30Z';

function head(c) {
  const g = [];
  const veiled = c.hair === 'veu';

  if (veiled) g.push(P(VEIL_BACK, c.veil));
  if (c.hair === 'lados') {
    for (const s of [-1, 1]) {
      g.push(
        cloud(
          [
            [s * 150, -74, 36],
            [s * 166, -22, 40],
            [s * 172, 34, 34],
          ],
          { fill: c.hairColor, shade: c.hairShade, sx: -4, sy: -7 }
        )
      );
    }
  }
  if (!veiled) {
    for (const s of [-1, 1]) {
      g.push(Ci(s * 166, 26, 29, c.skin) + L(`M${s * 172} 14 Q${s * 184} 26 ${s * 172} 38`, { sw: o(0.6), color: c.skinShade }));
    }
  }

  g.push(P(FACE, c.skin));

  if (c.hair === 'cachos') {
    g.push(cloud(CACHOS, { fill: c.hairColor, shade: c.hairShade }));
    g.push(curl(-58, -124, 19, 200, c.hairShade) + curl(40, -142, 20, 160, c.hairShade) + curl(98, -96, 15, 190, c.hairShade));
  } else if (c.hair === 'curto') {
    g.push(P('M-172 -16 C-190 -216 190 -216 172 -16 C150 -76 96 -106 30 -98 C-40 -90 -128 -100 -172 -16Z', c.hairColor));
    g.push(L('M-96 -150 Q-40 -176 20 -168', { color: c.hairShade, sw: o(0.7) }));
  } else if (veiled) {
    g.push(P(VEIL_FRONT, c.veil));
    if (c.band) g.push(tube('M-176 -52 Q0 -134 176 -52', o(1.8), c.band, { cap: 'butt' }));
    else g.push(L('M-120 -150 Q-40 -196 60 -184', { color: c.veilDark, sw: o(0.7) }));
  }

  // Bochechas, olhos, sobrancelhas e nariz
  for (const s of [-1, 1]) {
    g.push(cheek(s * 108, 66, 25));
    g.push(eye(s * 60, 10, 0.66, { gaze: c.gaze, closed: c.happy }));
    if (c.brow === 'branca') g.push(E(s * 62, -48, 28, 11, '#FFFFFF', { rot: s * 10, sw: o(0.7) }));
    else g.push(L(`M${s * 62 - 22} ${-42} Q${s * 62} ${-56} ${s * 62 + 22} ${-42}`, { sw: o(0.8) }));
  }
  g.push(E(0, 52, c.beard ? 21 : 15, c.beard ? 15 : 11, c.skinShade, { sw: 0 }));

  // Barba e bigode
  let mouthY = 84;
  if (c.beard) {
    const longa = c.beard === 'longa';
    const d = longa
      ? 'M-154 26 C-172 150 -112 266 0 274 C112 266 172 150 154 26 C120 70 70 90 0 88 C-70 90 -120 70 -154 26Z'
      : 'M-154 26 C-166 130 -104 214 0 220 C104 214 166 130 154 26 C120 70 70 90 0 88 C-70 90 -120 70 -154 26Z';
    g.push(P(d, c.hairColor));
    g.push(
      curl(-78, longa ? 186 : 150, 18, 200, c.hairShade) +
        curl(70, longa ? 196 : 158, 18, 160, c.hairShade) +
        (longa ? curl(-6, 232, 16, 180, c.hairShade) : '')
    );
    g.push(P('M0 76 C-22 66 -66 74 -76 106 C-52 114 -18 108 0 94 C18 108 52 114 76 106 C66 74 22 66 0 76Z', c.hairColor));
    mouthY = 112;
  }

  // Boca
  if (c.mouth === 'aberta') {
    const w = c.beard ? 20 : 30;
    const h = c.beard ? 30 : 46;
    g.push(P(`M${-w} ${mouthY - 2} Q0 ${mouthY + h} ${w} ${mouthY - 2}Z`, '#7A2B45', { sw: o(0.7) }));
    g.push(E(0, mouthY + h * 0.42, w * 0.42, h * 0.16, '#FF8097', { sw: 0 }));
  } else if (c.beard) {
    g.push(L(`M-17 ${mouthY - 2} Q0 ${mouthY + 14} 17 ${mouthY - 2}`, { sw: o(0.8) }));
  } else {
    g.push(L(`M-28 ${mouthY - 2} Q0 ${mouthY + 24} 28 ${mouthY - 2}`, { sw: o(0.8) }));
  }
  return g.join('');
}

function person(cfg = {}) {
  const c = Object.assign(
    {
      skin: '#EDB98C',
      skinShade: '#D99D6E',
      robe: '#5DBB7A',
      robeDark: '#3F9E60',
      sash: WOOD,
      hem: 848, // altura da barra da roupa; menor que 800 mostra as pernas
      hair: null, // 'lados' | 'cachos' | 'curto' | 'veu'
      hairColor: '#FFFFFF',
      hairShade: '#E3DDF2',
      veil: '#FFF3D6',
      veilDark: '#EAD7A8',
      band: null,
      beard: null, // 'longa' | 'media'
      brow: null, // 'branca'
      armL: [356, 708],
      armR: [644, 708],
      gaze: [0, 0],
      happy: false,
      mouth: 'sorriso', // 'sorriso' | 'aberta'
      behind: '', // desenhado atrás dos braços: o que a mão segura
      front: '',
      shadow: true,
    },
    cfg
  );
  const out = [];
  const hem = c.hem;
  const k = (hem - 476) / 372;
  const xl = 408 - 76 * k;
  const xr = 592 + 76 * k;
  const robeD = `M408 476 Q500 452 592 476 L${n(xr)} ${hem} Q500 ${hem + 36} ${n(xl)} ${hem}Z`;

  if (c.shadow) out.push(shadow(500, 904, 220));

  // Pernas e pés
  if (hem < 800) {
    out.push(tube(`M452 ${hem - 20} L448 866`, 50, c.skin) + tube(`M548 ${hem - 20} L552 866`, 50, c.skin));
  }
  out.push(E(442, 880, 54, 25, '#9A6233') + E(558, 880, 54, 25, '#9A6233'));

  // Roupa
  out.push(P(robeD, c.robe));
  out.push(clipD(robeD, P(`M200 ${hem - 34} Q500 ${hem + 4} 800 ${hem - 34} L800 ${hem + 80} L200 ${hem + 80}Z`, c.robeDark, { sw: 0 })));
  out.push(L(`M500 ${c.sash ? 676 : 560} L500 ${hem - 40}`, { color: c.robeDark, sw: o(0.7) }));
  if (c.sash) {
    out.push(P('M374 618 Q500 646 626 618 L633 662 Q500 692 367 662Z', c.sash));
  }
  out.push(L(robeD)); // refaz o contorno por cima da barra

  out.push(c.behind);

  // Braços
  const arm = (sx, target, pole) => limb(ik(sx, 530, target[0], target[1], 88, 88, pole), 58, 30, { color: c.robe, tip: c.skin });
  out.push(arm(412, c.armL, [-1, 1]));
  out.push(arm(588, c.armR, [1, 1]));

  out.push(G('translate(500,318)', head(c)));
  out.push(c.front);
  return out.join('');
}

/** Martelo; a origem é o ponto onde a mão segura o cabo. */
function hammer(x, y, angle = 0) {
  return G(
    `translate(${x},${y}) rotate(${angle})`,
    R(-14, -176, 28, 232, 12, WOOD),
    R(-74, -214, 148, 70, 16, STONE),
    R(-58, -202, 116, 16, 8, '#DAD7E4', { sw: 0 })
  );
}

/** Cajado de pastor com a ponta curva. */
function staff(x, top, bottom) {
  return tube(`M${x} ${bottom} L${x} ${top + 78} C${x} ${top - 8} ${x + 92} ${top - 8} ${x + 92} ${top + 62}`, 26, WOOD_DARK);
}

/** Funda: duas tiras de couro com uma pedrinha na bolsa. */
function sling(x, y) {
  return (
    L(`M${x - 8} ${y + 8} Q${x - 40} ${y + 110} ${x - 2} ${y + 176}`) +
    L(`M${x + 10} ${y + 8} Q${x + 70} ${y + 96} ${x + 52} ${y + 172}`) +
    Ci(x + 25, y + 168, 24, STONE) +
    P(`M${x - 22} ${y + 168} Q${x + 25} ${y + 232} ${x + 72} ${y + 168} Q${x + 25} ${y + 196} ${x - 22} ${y + 168}Z`, WOOD_DARK)
  );
}

const noe = (over = {}) =>
  person(
    Object.assign(
      {
        robe: '#5DBB7A',
        robeDark: '#3F9E60',
        sash: WOOD,
        hair: 'lados',
        beard: 'longa',
        brow: 'branca',
        armR: [744, 468],
        armL: [372, 690],
        behind: hammer(744, 468, 18),
      },
      over
    )
  );

const davi = (over = {}) =>
  person(
    Object.assign(
      {
        skin: '#F2C49B',
        skinShade: '#DFA57A',
        robe: '#FFB23A',
        robeDark: '#F08C1E',
        sash: '#B5562E',
        hem: 768,
        hair: 'cachos',
        hairColor: '#8A5A2B',
        hairShade: '#6E4420',
        armR: [720, 566],
        armL: [352, 694],
        behind: sling(720, 566),
      },
      over
    )
  );

const moises = (over = {}) =>
  person(
    Object.assign(
      {
        robe: '#E25A52',
        robeDark: '#C2443D',
        sash: '#4D6FB8',
        hair: 'veu',
        veil: '#FFF3D6',
        veilDark: '#EAD7A8',
        band: '#4D6FB8',
        beard: 'media',
        hairColor: '#A8958A',
        hairShade: '#8B786D',
        armR: [748, 566],
        armL: [356, 708],
        behind: staff(748, 196, 896),
      },
      over
    )
  );

const esposa = (over = {}) =>
  person(
    Object.assign(
      { robe: '#9B7EDE', robeDark: '#7F62C6', sash: '#FFD23F', hair: 'veu', veil: '#D9C8F7', veilDark: '#BBA4EB' },
      over
    )
  );

const filho = (over = {}) =>
  person(
    Object.assign(
      { robe: '#4DA3FF', robeDark: '#2E86E6', sash: WOOD, hair: 'curto', hairColor: '#5A3A28', hairShade: '#7A5540' },
      over
    )
  );

const nora = (over = {}) =>
  person(
    Object.assign(
      { skin: '#F2C49B', skinShade: '#DFA57A', robe: '#3CC6B4', robeDark: '#27A896', sash: '#FF8FB1', hair: 'veu', veil: '#FFC2D2', veilDark: '#F59DB5' },
      over
    )
  );

module.exports = { person, noe, davi, moises, esposa, filho, nora, hammer, staff, sling };
