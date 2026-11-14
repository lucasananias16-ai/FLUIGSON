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
    else if (c.brow === 'seria') g.push(L(`M${s * 88} -56 L${s * 38} -40`, { sw: o(1.3) }));
    else g.push(L(`M${s * 62 - 22} ${-42} Q${s * 62} ${-56} ${s * 62 + 22} ${-42}`, { sw: o(0.8) }));
  }
  g.push(E(0, 52, c.beard ? 21 : 15, c.beard ? 15 : 11, c.skinShade, { sw: 0 }));

  // Barba e bigode
  let mouthY = 84;
  if (c.beard === 'curta') {
    g.push(P('M-156 24 C-164 112 -102 178 0 182 C102 178 164 112 156 24 C134 96 72 124 0 122 C-72 124 -134 96 -156 24Z', c.hairColor));
  } else if (c.beard) {
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
  const comBigode = c.beard && c.beard !== 'curta';

  // Boca
  if (c.mouth === 'aberta') {
    const w = comBigode ? 20 : 30;
    const h = comBigode ? 30 : 46;
    g.push(P(`M${-w} ${mouthY - 2} Q0 ${mouthY + h} ${w} ${mouthY - 2}Z`, '#7A2B45', { sw: o(0.7) }));
    g.push(E(0, mouthY + h * 0.42, w * 0.42, h * 0.16, '#FF8097', { sw: 0 }));
  } else if (c.mouth === 'confiante') {
    g.push(L(`M-18 ${mouthY} Q4 ${mouthY + 12} 22 ${mouthY - 5}`, { sw: o(0.8) }));
  } else if (comBigode) {
    g.push(L(`M-17 ${mouthY - 2} Q0 ${mouthY + 14} 17 ${mouthY - 2}`, { sw: o(0.8) }));
  } else {
    g.push(L(`M-28 ${mouthY - 2} Q0 ${mouthY + 24} 28 ${mouthY - 2}`, { sw: o(0.8) }));
  }
  if (c.hat) g.push(c.hat); // chapéu, coroa ou capacete, por cima do cabelo
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
      beard: null, // 'longa' | 'media' | 'curta'
      brow: null, // 'branca' | 'seria'
      hat: '', // desenho por cima do cabelo, nas coordenadas da cabeça
      back: '', // desenhado atrás de tudo (uma capa, por exemplo)
      armL: [356, 708],
      armR: [644, 708],
      gaze: [0, 0],
      happy: false,
      mouth: 'sorriso', // 'sorriso' | 'aberta' | 'confiante'
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
  out.push(c.back);

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

// ------------------------------------------------------------- Vídeo 2

const DAVI = { skin: '#F2C49B', skinShade: '#DFA57A', hairColor: '#8A5A2B', hairShade: '#6E4420' };

/** Davi pastor, com o cajado na mão. */
const daviPastor = (over = {}) => davi(Object.assign({ behind: staff(742, 250, 896), armR: [742, 590] }, over));

/** Davi adulto, já rei: os mesmos cachos, agora com barba, coroa e capa. */
function reiDavi(over = {}) {
  const coroa =
    P('M-116 -150 L-116 -226 L-70 -186 L-36 -244 L0 -192 L36 -244 L70 -186 L116 -226 L116 -150Z', '#FFD23F') +
    L('M-116 -166 L116 -166', { color: '#E0A93F', sw: o(0.7) }) +
    Ci(-58, -186, 9, '#E25A52', { sw: o(0.5) }) +
    Ci(0, -200, 11, '#4DA3FF', { sw: o(0.5) }) +
    Ci(58, -186, 9, '#5DBB7A', { sw: o(0.5) });
  return person(
    Object.assign({}, DAVI, {
      robe: '#8B5FD0',
      robeDark: '#6F45B5',
      sash: '#FFD23F',
      hair: 'cachos',
      beard: 'curta',
      hat: coroa,
      back: P('M398 484 C300 620 276 760 286 862 L714 862 C724 760 700 620 602 484Z', '#E25A52') + L('M330 700 L322 850 M670 700 L678 850', { color: '#C2443D', sw: o(0.7) }),
      armR: [706, 560],
      armL: [356, 708],
    }, over)
  );
}

/** Pescador, com chapéu de palha, vara e um peixe. */
function pescador(over = {}) {
  const chapeu =
    E(0, -112, 236, 52, '#F2D38A') +
    P('M-128 -118 C-128 -250 128 -250 128 -118 Q0 -92 -128 -118Z', '#F2D38A') +
    P('M-128 -134 Q0 -106 128 -134 L128 -118 Q0 -92 -128 -118Z', '#D8574F', { sw: o(0.6) });
  const vara =
    tube('M690 628 L866 170', 14, WOOD_DARK) +
    L('M866 170 Q892 320 856 420', { sw: o(0.5) }) +
    G('translate(852,470) rotate(80)', P('M-66 0 C-40 -42 30 -42 56 0 C30 42 -40 42 -66 0Z', '#4DA3FF'), P('M50 0 L96 -34 L96 34Z', '#4DA3FF'), Ci(-34, -8, 7, '#3D2C4E', { sw: 0 }));
  return person(
    Object.assign(
      { robe: '#3CC6B4', robeDark: '#27A896', sash: WOOD, hair: 'curto', hairColor: '#5A3A28', hairShade: '#7A5540', beard: 'curta', hat: chapeu, armR: [726, 534], armL: [356, 708], behind: vara },
      over
    )
  );
}

/** Padeiro, com chapéu branco e um pão nas mãos. */
function padeiro(over = {}) {
  const chapeu =
    cloud(
      [
        [-78, -216, 54],
        [0, -238, 64],
        [78, -216, 54],
        [0, -204, 60],
      ],
      { fill: '#FFFFFF', shade: '#E3DDF2', sx: -5, sy: -8 }
    ) + R(-118, -196, 236, 62, 14, '#FFFFFF');
  const pao =
    E(500, 668, 132, 58, '#D9A066') +
    E(486, 652, 96, 26, '#E7BC85', { sw: 0 }) +
    L('M430 646 L452 686 M486 640 L508 684 M542 644 L564 686', { color: '#A66A34', sw: o(0.8) });
  return person(
    Object.assign(
      { skin: '#EDB98C', robe: '#F7F3EA', robeDark: '#DDD5C5', sash: null, hair: 'curto', hairColor: '#5A3A28', hairShade: '#7A5540', hat: chapeu, armL: [408, 640], armR: [592, 640], behind: pao },
      over
    )
  );
}

/**
 * Golias: um soldado enorme, de capacete, escudo e lança. Grande e sério,
 * mas sem cara de mau. O corpo é próprio (mais largo e mais alto que o boneco
 * comum) para ele parecer gigante mesmo sozinho num card.
 */
function golias(over = {}) {
  const c = Object.assign(
    {
      skin: '#E3AC7E',
      skinShade: '#CC9063',
      hair: null,
      hairColor: '#5A3A28',
      hairShade: '#7A5540',
      beard: 'media',
      brow: 'seria',
      mouth: 'confiante',
      gaze: [0, 0],
      happy: false,
      veil: null,
      veilDark: null,
      band: null,
      hat: '',
      shadow: true,
      lanca: true,
    },
    over
  );
  const bronze = '#E0A93F';
  const bronzeDark = '#B9822A';
  const aco = '#8FB0C4';
  const acoDark = '#6C90A6';
  const couro = '#9A6233';
  const torso = 'M316 438 Q500 394 684 438 L656 650 Q500 682 344 650Z';
  const escamas = [];
  for (let r = 0; r < 5; r++) {
    for (let k = 0; k < 9; k++) {
      const x = 330 + k * 44 + (r % 2) * 22;
      const y = 452 + r * 40;
      escamas.push(L(`M${x - 20} ${y} Q${x} ${y + 26} ${x + 20} ${y}`, { color: acoDark, sw: o(0.6) }));
    }
  }
  const capacete =
    // penacho
    P('M-92 -216 C-104 -372 104 -372 92 -216Z', '#E25A52') +
    L('M-40 -316 L-32 -236 M0 -330 L0 -240 M40 -316 L32 -236', { color: '#C2443D', sw: o(0.6) }) +
    // casco e protetores do rosto
    P('M-182 -58 C-192 -252 192 -252 182 -58Z', bronze) +
    P('M-182 -58 L-150 -58 L-140 62 Q-168 78 -186 44Z', bronze) +
    P('M182 -58 L150 -58 L140 62 Q168 78 186 44Z', bronze) +
    P('M-192 -86 L192 -86 L192 -52 L-192 -52Z', bronzeDark);
  const out = [];
  if (c.shadow) out.push(shadow(500, 908, 320));
  if (c.lanca) {
    out.push(tube('M214 902 L214 190', 22, '#A66A34'));
    out.push(P('M214 60 C258 112 250 176 214 198 C178 176 170 112 214 60Z', '#C9CDD6'));
  }
  // pernas, grevas e sandálias
  out.push(tube('M432 720 L426 856', 84, c.skin) + tube('M568 720 L574 856', 84, c.skin));
  out.push(R(380, 770, 92, 92, 22, bronze) + R(528, 770, 92, 92, 22, bronze));
  out.push(E(420, 884, 76, 30, couro) + E(580, 884, 76, 30, couro));
  // saiote de tiras de couro
  out.push(P('M348 630 L652 630 L680 770 Q500 800 320 770Z', couro));
  out.push(L('M400 660 L388 780 M450 664 L444 790 M500 666 L500 794 M550 664 L556 790 M600 660 L612 780', { color: '#7A4A2B', sw: o(0.7) }));
  // armadura de escamas e cinturão
  out.push(P(torso, aco));
  out.push(clipD(torso, escamas.join('')));
  out.push(L(torso));
  out.push(P('M340 622 Q500 652 660 622 L664 664 Q500 696 336 664Z', bronze));
  // braços: um segura a lança, o outro some atrás do escudo
  out.push(limb(ik(344, 462, 214, 606, 112, 112, [-1, 1]), 80, 42, { color: c.skin, tip: c.skin }));
  out.push(limb(ik(656, 462, 716, 612, 100, 100, [1, 1]), 80, 42, { color: c.skin, tip: c.skin }));
  out.push(R(300, 436, 96, 62, 26, bronze) + R(604, 436, 96, 62, 26, bronze));
  // cabeça
  out.push(G('translate(500,292) scale(0.84)', head(Object.assign({}, c, { hat: capacete }))));
  // escudo
  out.push(Ci(716, 612, 168, bronze) + Ci(716, 612, 124, '#E25A52') + Ci(716, 612, 44, bronze));
  out.push([0, 60, 120, 180, 240, 300].map((a) => Ci(716 + Math.cos((a * Math.PI) / 180) * 146, 612 + Math.sin((a * Math.PI) / 180) * 146, 9, bronzeDark, { sw: 0 })).join(''));
  return out.join('');
}


// ------------------------------------------------------------- Vídeo 3

/** Pastor de ovelhas: lenço de cabeça com faixa, barba curta e cajado. */
const pastor = (over = {}) =>
  person(
    Object.assign(
      {
        robe: '#7FA35B',
        robeDark: '#648A43',
        sash: WOOD,
        hair: 'veu',
        veil: '#F5E6C4',
        veilDark: '#E0CC9C',
        band: '#B5562E',
        beard: 'curta',
        hairColor: '#6E4420',
        hairShade: '#55331A',
        armR: [748, 566],
        armL: [356, 708],
        behind: staff(748, 196, 896),
      },
      over
    )
  );

/** Anjo: túnica branca, asas, cachos louros e uma auréola dourada. */
function anjo(over = {}) {
  const asa = (s) =>
    P(
      `M${500 + s * 60} 470 C${500 + s * 260} 320 ${500 + s * 430} 360 ${500 + s * 462} 560 C${500 + s * 474} 656 ${500 + s * 404} 726 ${500 + s * 330} 706 C${500 + s * 296} 652 ${500 + s * 214} 644 ${500 + s * 130} 620Z`,
      '#FFFFFF'
    ) +
    L(
      `M${500 + s * 150} 520 Q${500 + s * 300} 450 ${500 + s * 390} 520 M${500 + s * 150} 580 Q${500 + s * 300} 520 ${500 + s * 420} 600 M${500 + s * 170} 640 Q${500 + s * 290} 600 ${500 + s * 370} 664`,
      { color: '#CFC6EA', sw: o(0.7) }
    );
  const aureola =
    `<ellipse cx="0" cy="-226" rx="104" ry="28" fill="none" stroke="${'#3D2C4E'}" stroke-width="${n(o(2.4))}"/>` +
    `<ellipse cx="0" cy="-226" rx="104" ry="28" fill="none" stroke="#FFD23F" stroke-width="${n(o(1.2))}"/>`;
  return person(
    Object.assign(
      {
        skin: '#F8D2AE',
        skinShade: '#EDB58A',
        robe: '#FFFFFF',
        robeDark: '#E3DDF2',
        sash: '#FFD23F',
        hem: 800,
        hair: 'cachos',
        hairColor: '#F2CF72',
        hairShade: '#D9AE45',
        happy: true,
        mouth: 'aberta',
        hat: aureola,
        back: asa(-1) + asa(1),
        armL: [286, 470],
        armR: [714, 470],
      },
      over
    )
  );
}

/** Maria: véu azul sobre uma túnica clara. */
const maria = (over = {}) =>
  person(
    Object.assign(
      { skin: '#F2C49B', skinShade: '#DFA57A', robe: '#F7F3EA', robeDark: '#DDD5C5', sash: '#FFD23F', hair: 'veu', veil: '#3F7FE0', veilDark: '#2E5FB8' },
      over
    )
  );

/** Marta: cachos escuros com uma florzinha e vestido coral. */
function marta(over = {}) {
  const flor = [0, 1, 2, 3, 4].map((i) => {
    const t = (i / 5) * Math.PI * 2 - Math.PI / 2;
    return Ci(118 + Math.cos(t) * 24, -146 + Math.sin(t) * 24, 18, '#FFFFFF', { sw: o(0.55) });
  });
  return person(
    Object.assign(
      {
        skin: '#D9A074',
        skinShade: '#C0845A',
        robe: '#FF8F7A',
        robeDark: '#E5705B',
        sash: '#8B5FD0',
        hair: 'cachos',
        hairColor: '#4A2E1F',
        hairShade: '#6A4632',
        hat: flor.join('') + Ci(118, -146, 14, '#FFD23F', { sw: o(0.55) }),
      },
      over
    )
  );
}

/** Ana: véu amarelo, vestido roxo e sobrancelhas brancas de quem já viveu muito. */
const ana = (over = {}) =>
  person(
    Object.assign(
      { robe: '#9B7EDE', robeDark: '#7F62C6', sash: '#FFFFFF', hair: 'veu', veil: '#FFD966', veilDark: '#E8B93F', brow: 'branca' },
      over
    )
  );

/** José: túnica marrom, cabelo curto e barba curta. */
const jose = (over = {}) =>
  person(
    Object.assign(
      { robe: '#C98A4B', robeDark: '#A66A34', sash: '#5A3A28', hair: 'curto', hairColor: '#4A2E1F', hairShade: '#6A4632', beard: 'curta', },
      over
    )
  );

module.exports = { person, head, noe, davi, moises, esposa, filho, nora, hammer, staff, sling, daviPastor, reiDavi, pescador, padeiro, golias, pastor, anjo, maria, marta, ana, jose };
