'use strict';
/**
 * Objetos e elementos da natureza do Vídeo 1. Prancheta de 1000 x 1000.
 * Objetos nunca têm rosto, para não se confundirem com os animais.
 */
const { LINE, n, o, P, E, Ci, R, L, G, clip, clipD, tube, cloud, blob, sparkle, shadow } = require('../kit');

const WOOD = '#D9A066';
const WOOD_MID = '#B97A45';
const WOOD_DARK = '#8F5A2E';

// ------------------------------------------------------------------ Pedras
function rock(cx, cy, rx, ry, seed) {
  const d = blob(cx, cy, rx, ry, seed, 0.1, 8);
  return (
    P(d, '#B8B5C6') +
    clipD(
      d,
      P(blob(cx - rx * 0.16, cy - ry * 0.34, rx * 0.78, ry * 0.62, seed + 7, 0.1, 8), '#D5D2E0', { sw: 0 }) +
        E(cx, cy + ry * 0.92, rx, ry * 0.3, '#9A96AE', { sw: 0 })
    ) +
    L(d) +
    L(`M${n(cx + rx * 0.2)} ${n(cy - ry * 0.1)} l${n(rx * 0.16)} ${n(ry * 0.22)} l${n(-rx * 0.06)} ${n(ry * 0.2)}`, { sw: o(0.6), color: '#8E8AA4' })
  );
}
const pedras = () =>
  shadow(500, 872, 400) + rock(520, 450, 190, 140, 5) + rock(340, 700, 240, 160, 11) + rock(690, 730, 180, 130, 23);

// ----------------------------------------------------------------- Madeira
function plank(cx, cy, w, h, angle, seed) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  const k = seed % 2 ? 1 : -1;
  return G(
    `rotate(${angle} ${cx} ${cy})`,
    R(x, y, w, h, 18, WOOD),
    L(`M${x + 60} ${cy - 18} Q${cx} ${cy - 18 - 16 * k} ${x + w - 70} ${cy - 16}`, { color: WOOD_MID, sw: o(0.7) }),
    L(`M${x + 90} ${cy + 20} Q${cx + 40} ${cy + 20 + 14 * k} ${x + w - 110} ${cy + 22}`, { color: WOOD_MID, sw: o(0.7) }),
    E(cx - 60 * k, cy + 2, 26, 12, WOOD_MID, { sw: 0 }),
    Ci(x + 30, cy, 9, '#8E8AA4', { sw: o(0.5) }),
    Ci(x + w - 30, cy, 9, '#8E8AA4', { sw: o(0.5) })
  );
}
const madeira = () =>
  shadow(500, 852, 400) + plank(500, 760, 740, 124, -2, 1) + plank(486, 628, 720, 124, 3, 2) + plank(516, 496, 700, 124, -5, 3);

// -------------------------------------------------------------------- Gelo
function iceCube(cx, cy, s, angle) {
  const h = s / 2;
  return G(
    `translate(${cx},${cy}) rotate(${angle})`,
    R(-h, -h, s, s, s * 0.2, '#BFE8FF'),
    R(-h + s * 0.1, -h + s * 0.1, s * 0.8, s * 0.8, s * 0.14, '#DDF4FF', { sw: 0 }),
    L(`M${n(-s * 0.3)} ${n(-s * 0.06)} L${n(-s * 0.06)} ${n(-s * 0.3)}`, { color: '#FFFFFF', sw: o(1.6) }),
    L(`M${n(-s * 0.3)} ${n(s * 0.12)} L${n(-s * 0.2)} ${n(s * 0.02)}`, { color: '#FFFFFF', sw: o(1.6) }),
    L(`M${n(s * 0.1)} ${n(s * 0.3)} L${n(s * 0.3)} ${n(s * 0.1)}`, { color: '#9AD5F5', sw: o(1.2) })
  );
}
const gelo = () =>
  shadow(500, 874, 380) +
  iceCube(505, 400, 290, 8) +
  iceCube(350, 700, 300, -6) +
  iceCube(655, 712, 280, 5) +
  sparkle(800, 300, 40, 0, '#FFFFFF') +
  sparkle(200, 420, 28, 15, '#FFFFFF') +
  sparkle(868, 520, 22, 0, '#FFFFFF');

// ------------------------------------------------------------ Guarda-chuva
function guardaChuva() {
  const red = '#FF6B6B';
  const yellow = '#FFD23F';
  const canopy =
    'M140 548 C140 300 320 190 500 190 C680 190 860 300 860 548 Q770 474 680 548 Q590 474 500 548 Q410 474 320 548 Q230 474 140 548Z';
  return (
    shadow(470, 892, 220) +
    tube('M500 540 L500 804 Q500 872 440 872 Q384 872 384 816', 24, '#C98A4B') +
    R(487, 146, 26, 60, 12, '#C98A4B') +
    P(canopy, red) +
    clipD(
      canopy,
      P('M500 190 Q360 300 320 560 L500 560Z', yellow, { sw: 0 }) + P('M500 190 Q640 300 680 560 L900 600 L900 150Z', yellow, { sw: 0 })
    ) +
    L('M500 190 Q360 300 320 548 M500 190 L500 548 M500 190 Q640 300 680 548', { sw: o(0.8) }) +
    L(canopy)
  );
}

// ------------------------------------------------------- Neve, chuva, folhas
const SKY_CLOUD = [
  [320, 300, 92],
  [440, 236, 116],
  [590, 246, 108],
  [700, 318, 84],
  [500, 330, 124],
  [390, 344, 90],
  [620, 348, 92],
];

function snowflake(x, y, r, angle = 0) {
  const segs = [];
  for (let k = 0; k < 6; k++) {
    const t = ((k * 60 + angle) * Math.PI) / 180;
    const ux = Math.cos(t);
    const uy = Math.sin(t);
    segs.push(`M${n(x)} ${n(y)} L${n(x + ux * r)} ${n(y + uy * r)}`);
    const bx = x + ux * r * 0.56;
    const by = y + uy * r * 0.56;
    for (const s of [-1, 1]) {
      const tt = t + (s * Math.PI) / 3.4;
      segs.push(`M${n(bx)} ${n(by)} L${n(bx + Math.cos(tt) * r * 0.34)} ${n(by + Math.sin(tt) * r * 0.34)}`);
    }
  }
  return tube(segs.join(' '), o(1.1), '#FFFFFF');
}
const neve = () =>
  cloud(SKY_CLOUD, { fill: '#FFFFFF', shade: '#DCE6F7', sx: -8, sy: -14 }) +
  snowflake(290, 620, 84, 0) +
  snowflake(700, 600, 76, 30) +
  snowflake(500, 800, 90, 15) +
  [
    [500, 540, 22],
    [160, 780, 20],
    [840, 780, 22],
    [300, 850, 16],
    [712, 860, 18],
    [420, 480, 14],
    [860, 520, 14],
    [150, 520, 14],
  ]
    .map(([x, y, r]) => Ci(x, y, r, '#FFFFFF', { sw: o(0.8) }))
    .join('');

function drop(x, y, s = 1, angle = 12) {
  return G(
    `translate(${x},${y}) rotate(${angle}) scale(${s})`,
    P('M0 -56 C30 -14 40 8 40 26 A40 40 0 1 1 -40 26 C-40 8 -30 -14 0 -56Z', '#4DA3FF', { sw: o(1 / s) }),
    L('M-18 22 Q-18 40 -4 46', { color: '#BFE1FF', sw: o(0.8 / s) })
  );
}
const chuva = () =>
  [
    [286, 560],
    [450, 540],
    [614, 566],
    [760, 540],
    [352, 730],
    [520, 716],
    [690, 740],
    [430, 880],
    [600, 880],
  ]
    .map(([x, y]) => drop(x, y))
    .join('') + cloud(SKY_CLOUD, { fill: '#B9C6E2', shade: '#96A6CC', sx: -8, sy: -14 });

function leaf(x, y, s, angle, color, dark) {
  return G(
    `translate(${x},${y}) rotate(${angle}) scale(${s})`,
    P('M0 -100 C70 -56 78 34 0 100 C-78 34 -70 -56 0 -100Z', color, { sw: o(1 / s) }),
    L('M0 -76 L0 124', { color: dark, sw: o(0.8 / s) }),
    L('M0 -30 L32 -52 M0 10 L40 -14 M0 -10 L-36 -34 M0 34 L-38 8', { color: dark, sw: o(0.6 / s) })
  );
}
const folhas = () =>
  L('M250 150 Q330 220 270 300', { opacity: 0.3 }) +
  L('M730 120 Q660 200 720 280', { opacity: 0.3 }) +
  L('M520 420 Q600 480 540 560', { opacity: 0.3 }) +
  leaf(280, 420, 1.25, -28, '#5DBB7A', '#3F9E60') +
  leaf(700, 390, 1.15, 32, '#FFB23A', '#E08A1A') +
  leaf(500, 690, 1.35, 12, '#8BD46E', '#5FAE48') +
  leaf(236, 786, 0.95, 40, '#F08C1E', '#C96A12') +
  leaf(778, 760, 1.05, -36, '#5DBB7A', '#3F9E60') +
  leaf(500, 210, 0.85, -8, '#EF6A5B', '#C94A3D');

// ----------------------------------------------------------------- Números
/** Número grande. Precisa da fonte Fredoka carregada na página. */
function numero(txt, color) {
  const size = txt.length > 1 ? 520 : 640;
  const base = `x="500" y="${txt.length > 1 ? 690 : 730}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="${size}"`;
  return (
    `<text ${base} transform="translate(14,18)" fill="${LINE}" stroke="${LINE}" stroke-width="${n(o(2.8))}" stroke-linejoin="round" opacity="0.18">${txt}</text>` +
    `<text ${base} fill="${color}" stroke="${LINE}" stroke-width="${n(o(2.8))}" stroke-linejoin="round" paint-order="stroke">${txt}</text>`
  );
}
const num4 = () => numero('4', '#FF8FB1');
const num10 = () => numero('10', '#5DBB7A');
const num40 = () => numero('40', '#4DA3FF');

// ------------------------------------------------- Estrela, lua, arco-íris
function roundedPoly(pts, r) {
  const N = pts.length;
  let d = '';
  for (let i = 0; i < N; i++) {
    const p = pts[i];
    const a = pts[(i - 1 + N) % N];
    const b = pts[(i + 1) % N];
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]);
    const lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const ra = Math.min(r, la / 2);
    const rb = Math.min(r, lb / 2);
    const p1 = [p[0] + ((a[0] - p[0]) * ra) / la, p[1] + ((a[1] - p[1]) * ra) / la];
    const p2 = [p[0] + ((b[0] - p[0]) * rb) / lb, p[1] + ((b[1] - p[1]) * rb) / lb];
    d += `${i ? 'L' : 'M'}${n(p1[0])} ${n(p1[1])} Q${n(p[0])} ${n(p[1])} ${n(p2[0])} ${n(p2[1])} `;
  }
  return d + 'Z';
}
function star5(cx, cy, r1, r2, round) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const t = (-90 + i * 36) * (Math.PI / 180);
    const r = i % 2 ? r2 : r1;
    pts.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]);
  }
  return roundedPoly(pts, round);
}
function estrela() {
  const d = star5(500, 520, 350, 176, 46);
  return (
    P(d, '#FFD23F') +
    clipD(d, P(star5(470, 470, 250, 126, 34), '#FFE680', { sw: 0 }) + E(520, 880, 400, 150, '#F4B824', { sw: 0, opacity: 0.55 })) +
    L(d) +
    sparkle(170, 250, 34, 0, '#FFFFFF') +
    sparkle(850, 300, 44, 10, '#FFFFFF') +
    sparkle(820, 800, 28, 0, '#FFFFFF')
  );
}

function lua() {
  const d = 'M481.3 200 A300 300 0 1 0 757.5 614.2 A250 250 0 1 1 481.3 200Z';
  return G(
    'translate(30,10)',
    P(d, '#FFE58A'),
    clipD(
      d,
      Ci(300, 450, 30, '#F6CD5A', { sw: 0 }) +
        Ci(352, 624, 22, '#F6CD5A', { sw: 0 }) +
        Ci(440, 742, 18, '#F6CD5A', { sw: 0 }) +
        Ci(250, 560, 14, '#F6CD5A', { sw: 0 })
    ),
    sparkle(676, 330, 44, 0, '#FFD23F'),
    sparkle(790, 470, 28, 12, '#FFD23F'),
    sparkle(640, 500, 20, 0, '#FFD23F')
  );
}

/** Arco-íris; as pontas ficam para o desenho que o usa esconder (nuvens ou chão). */
function rainbowArc(cx, cy, rOuter, band) {
  const colors = ['#FF6B6B', '#FFA53A', '#FFD23F', '#5DBB7A', '#4DA3FF', '#9B7EDE'];
  const arc = (r) => `M${n(cx - r)} ${cy} A${n(r)} ${n(r)} 0 0 1 ${n(cx + r)} ${cy}`;
  const total = band * colors.length;
  let s = `<path d="${arc(rOuter - total / 2)}" fill="none" stroke="${LINE}" stroke-width="${n(total + o(2))}"/>`;
  colors.forEach((c, i) => {
    s += `<path d="${arc(rOuter - band * (i + 0.5))}" fill="none" stroke="${c}" stroke-width="${n(band + 1)}"/>`;
  });
  return s;
}
function arcoIris() {
  const puff = (x) =>
    cloud(
      [
        [x - 96, 716, 62],
        [x - 20, 680, 84],
        [x + 76, 706, 70],
        [x + 10, 740, 72],
        [x - 60, 748, 60],
      ],
      { shade: '#DCE6F7' }
    );
  return G('translate(0,-70)', rainbowArc(500, 710, 390, 36) + puff(210) + puff(800));
}

// ============================================================== Vídeo 2
const BRONZE = '#E0A93F';
const BRONZE_DARK = '#B9822A';
const COURO = '#A66A34';

/** Funda: duas tiras de couro com a bolsa e uma pedrinha, mais duas pedras ao lado. */
function funda() {
  return (
    shadow(520, 884, 300) +
    tube('M500 190 C300 300 290 560 420 690', 18, COURO) +
    tube('M500 190 C700 300 710 560 580 690', 18, COURO) +
    tube('M500 190 C470 140 500 100 530 140 C540 160 520 190 500 190', 12, COURO) +
    Ci(500, 664, 66, '#B8B5C6') +
    E(482, 644, 30, 18, '#D5D2E0', { sw: 0 }) +
    P('M372 668 C410 800 590 800 628 668 C570 724 430 724 372 668Z', '#8F5A2E') +
    P(blob(700, 846, 58, 42, 31, 0.1, 8), '#B8B5C6') +
    P(blob(796, 858, 44, 32, 47, 0.1, 8), '#C9C6D6')
  );
}

/** Espada, na diagonal. */
function espada() {
  return (
    shadow(500, 884, 260) +
    G(
      'rotate(38 500 500)',
      P('M462 150 L500 84 L538 150 L538 628 L462 628Z', '#DADDE5'),
      L('M500 140 L500 612', { color: '#AEB3C0', sw: o(0.8) }),
      R(374, 626, 252, 48, 22, BRONZE),
      R(472, 672, 56, 150, 16, '#8A5A2B'),
      L('M472 706 L528 720 M472 742 L528 756 M472 778 L528 792', { color: '#6E4420', sw: o(0.6) }),
      Ci(500, 846, 36, BRONZE)
    )
  );
}

/** Escudo redondo, o mesmo que o Golias carrega. */
function escudo() {
  const rebites = [0, 45, 90, 135, 180, 225, 270, 315]
    .map((a) => Ci(500 + Math.cos((a * Math.PI) / 180) * 290, 500 + Math.sin((a * Math.PI) / 180) * 290, 16, BRONZE_DARK, { sw: 0 }))
    .join('');
  return (
    shadow(500, 900, 280) +
    Ci(500, 500, 340, BRONZE) +
    rebites +
    Ci(500, 500, 246, '#E25A52') +
    L('M320 420 A200 200 0 0 1 430 310', { color: '#F28B82', sw: o(1.6) }) +
    Ci(500, 500, 86, BRONZE) +
    Ci(476, 478, 22, '#F3CC78', { sw: 0 })
  );
}

/** Cajado de pastor. */
function cajado() {
  return (
    shadow(470, 902, 200) +
    G('rotate(10 500 500)', tube('M420 900 L420 300 C420 150 640 150 640 300 L640 340', 46, COURO), L('M420 520 L420 600 M420 690 L420 730', { color: '#8F5A2E', sw: o(0.7) }))
  );
}

/** Skate, visto de lado. */
function skate() {
  const roda = (x) => Ci(x, 640, 66, '#FFA53A') + Ci(x, 640, 24, '#FFE0B0', { sw: o(0.6) });
  return (
    shadow(500, 720, 360, 30) +
    R(262, 560, 96, 50, 14, '#B8B5C6') +
    R(642, 560, 96, 50, 14, '#B8B5C6') +
    roda(310) +
    roda(690) +
    tube('M130 470 Q160 536 250 536 L750 536 Q840 536 870 470', 44, '#3CC6B4') +
    L('M300 536 L700 536', { color: '#FFD23F', sw: o(1.4), cap: 'round' }) +
    L('M150 380 Q190 400 170 440 M850 380 Q810 400 830 440', { opacity: 0.3 })
  );
}

/** Harpa pequena, como a de Davi. */
function harpa() {
  const cordas = [];
  for (let i = 0; i < 7; i++) {
    const x = 392 + i * 44;
    const topo = 262 - 30 * Math.sin(((x - 330) / 370) * Math.PI) + (x - 330) * 0.1;
    const base = 300 + ((700 - x) / 280) * 500;
    cordas.push(`M${x} ${n(topo)} L${x} ${n(base)}`);
  }
  return (
    shadow(480, 890, 280) +
    L(cordas.join(' '), { sw: o(0.6) }) +
    tube('M700 300 L420 820', 58, '#C98A4B') +
    tube('M330 820 L330 250', 46, '#FFC83D') +
    tube('M330 250 C420 170 600 180 700 300', 46, '#FFC83D') +
    Ci(330, 250, 40, '#FFC83D') +
    Ci(330, 250, 14, '#E0A93F', { sw: 0 }) +
    R(280, 800, 210, 56, 22, '#E0A93F')
  );
}

/** Tambor com duas baquetas. */
function tambor() {
  const corpo = 'M250 400 L250 690 A250 82 0 0 0 750 690 L750 400Z';
  const baqueta = (d, x, y) => tube(d, 20, '#D9A066') + Ci(x, y, 26, '#F7E3C0');
  return (
    shadow(500, 800, 320) +
    P(corpo, '#EF6A5B') +
    clipD(corpo, L('M250 420 L333 730 L417 430 L500 770 L583 430 L667 730 L750 420', { color: '#FFD23F', sw: o(1.2) })) +
    L(corpo) +
    L('M250 690 A250 82 0 0 0 750 690', { color: '#FFD23F', sw: o(2.2), cap: 'butt' }) +
    L('M250 690 A250 82 0 0 0 750 690', { sw: o(0.6), cap: 'butt' }) +
    E(500, 400, 250, 82, '#FFF1D6') +
    E(470, 386, 150, 40, '#FFFFFF', { sw: 0, opacity: 0.6 }) +
    baqueta('M380 330 L250 150', 246, 144) +
    baqueta('M620 330 L750 150', 754, 144)
  );
}

/** Flauta de madeira, com duas notinhas saindo. */
function flauta() {
  const nota = (x, y, s) =>
    G(`translate(${x},${y}) scale(${s})`, E(0, 0, 30, 22, '#3D2C4E', { rot: -20, sw: 0 }), L('M26 -6 L26 -110 Q60 -100 70 -70', { sw: o(1 / s) }));
  const furos = [0, 1, 2, 3, 4, 5].map((i) => E(380 + i * 62, 500, 16, 13, '#6E4420', { sw: 0 })).join('');
  return (
    shadow(500, 760, 300) +
    G(
      'rotate(-28 500 500)',
      R(180, 458, 640, 84, 42, '#E7BC85'),
      R(150, 466, 110, 68, 30, '#C98A4B'),
      L('M300 462 L300 538 M760 462 L760 538', { color: '#B97A45', sw: o(0.9) }),
      furos
    ) +
    nota(700, 240, 1) +
    nota(830, 330, 0.7)
  );
}


// ------------------------------------------------------------- Vídeo 3

/** Caixa de presente com laço. `cor` e `fita` são as cores da caixa e da fita. */
function caixa(cx, base, w, h, cor, corEscura, fita, laco) {
  const x = cx - w / 2;
  const top = base - h;
  return (
    E(cx, base + 6, w * 0.62, w * 0.09, '#3D2C4E', { sw: 0, opacity: 0.16 }) +
    R(x, top, w, h, w * 0.08, cor) +
    clipD(`M${x} ${top + h * 0.78} L${x + w} ${top + h * 0.78} L${x + w} ${base} L${x} ${base}Z`, R(x, top, w, h, 0, corEscura, { sw: 0 })) +
    R(x, top, w, h, w * 0.08, 'none', {}) +
    R(cx - w * 0.09, top, w * 0.18, h, 4, fita) +
    R(x - w * 0.03, top - h * 0.14, w * 1.06, h * 0.2, w * 0.05, cor) +
    R(cx - w * 0.09, top - h * 0.14, w * 0.18, h * 0.2, 4, fita) +
    // laço
    P(`M${cx} ${top - h * 0.14} C${cx - w * 0.34} ${top - h * 0.5} ${cx - w * 0.36} ${top - h * 0.1} ${cx} ${top - h * 0.14}Z`, fita) +
    P(`M${cx} ${top - h * 0.14} C${cx + w * 0.34} ${top - h * 0.5} ${cx + w * 0.36} ${top - h * 0.1} ${cx} ${top - h * 0.14}Z`, fita) +
    Ci(cx, top - h * 0.14, w * 0.06, fita)
  );
}

/** Um presente dourado, para o jogo da memória. */
const presente = () => caixa(500, 780, 420, 340, '#FFD23F', '#F4B824', '#E25A52', true) + sparkle(190, 280, 38, 0, '#FFFFFF') + sparkle(820, 340, 30, 10, '#FFFFFF');

/** Foguete: serve de intruso na história de Natal. Sem rosto. */
function foguete() {
  const corpo = 'M500 150 C610 240 640 430 628 640 L372 640 C360 430 390 240 500 150Z';
  const aletaE = 'M372 520 C300 540 262 610 258 700 L376 650Z';
  const aletaD = 'M628 520 C700 540 738 610 742 700 L624 650Z';
  return (
    P(aletaE, '#E25A52') +
    P(aletaD, '#E25A52') +
    P('M430 650 Q500 960 570 650Z', '#FF8A3A') +
    P('M458 650 Q500 860 542 650Z', '#FFD23F', { sw: 0 }) +
    R(398, 626, 204, 52, 20, '#9AA3B8') +
    P(corpo, '#F7F3EA') +
    clipD(corpo, P('M300 120 L700 120 L700 300 Q500 340 300 300Z', '#E25A52', { sw: 0 }) + P('M520 130 C640 250 660 450 650 700 L700 700 L700 130Z', '#DDD5C5', { sw: 0 })) +
    L(corpo) +
    Ci(500, 400, 70, '#7CCBFF') +
    Ci(480, 380, 22, '#D6F0FF', { sw: 0 }) +
    sparkle(200, 260, 34, 0, '#FFD23F') +
    sparkle(800, 220, 28, 14, '#FFD23F')
  );
}

/** Castelo de pedra com duas torres. */
function castelo() {
  const torre = (x) => {
    const w = 150;
    return (
      R(x - w / 2, 340, w, 460, 10, '#B8B5C6') +
      P(`M${x - w / 2 - 20} 340 L${x} 170 L${x + w / 2 + 20} 340Z`, '#E25A52') +
      L(`M${x - 30} 280 L${x - 30} 340 M${x + 30} 280 L${x + 30} 340`, { color: '#C2443D', sw: o(0.6) }) +
      P(`M${x - 22} 470 L${x - 22} 430 A22 22 0 0 1 ${x + 22} 430 L${x + 22} 470Z`, '#5A3B4E') +
      L(`M${x} 170 L${x} 110`, { sw: o(0.9) }) +
      P(`M${x} 112 L${x + 62} 134 L${x} 156Z`, '#FFD23F')
    );
  };
  const muro = 'M270 520 L270 800 L730 800 L730 520 L680 520 L680 480 L620 480 L620 520 L560 520 L560 480 L500 480 L500 520 L440 520 L440 480 L380 480 L380 520 L320 520 L320 480 L270 480Z';
  return (
    shadow(500, 806, 380) +
    torre(230) +
    torre(770) +
    P(muro, '#C9C6D6') +
    clipD(muro, L('M250 560 L750 560 M250 640 L750 640 M250 720 L750 720 M330 560 L330 640 M450 560 L450 640 M570 560 L570 640 M690 560 L690 640 M390 640 L390 720 M510 640 L510 720 M630 640 L630 720', { color: '#9A96AE', sw: o(0.6) })) +
    P('M420 800 L420 660 A80 80 0 0 1 580 660 L580 800Z', '#7A4A2B') +
    L('M500 600 L500 800', { color: '#5A3A28', sw: o(0.7) }) +
    Ci(540, 720, 9, '#FFD23F', { sw: o(0.5) })
  );
}

/** Barco a vela sobre as ondas. */
function barco() {
  const casco = 'M180 600 L820 600 C790 720 700 790 560 790 L440 790 C300 790 210 720 180 600Z';
  return (
    L('M500 600 L500 170', { sw: o(1.4) }) +
    P('M520 190 C700 260 780 420 790 560 L520 560Z', '#FFFFFF') +
    P('M480 250 C380 320 320 430 300 560 L480 560Z', '#FFD66B') +
    P('M500 150 L580 176 L500 204Z', '#E25A52') +
    P(casco, '#E25A52') +
    clipD(casco, P('M150 600 L850 600 L850 650 L150 650Z', '#FFD23F', { sw: 0 })) +
    L(casco) +
    Ci(360, 690, 24, '#FFF1B8') +
    Ci(500, 700, 24, '#FFF1B8') +
    Ci(640, 690, 24, '#FFF1B8') +
    P('M70 800 Q150 750 230 800 T390 800 T550 800 T710 800 T870 800 L940 800 L940 900 L70 900Z', '#4DA3FF') +
    L('M120 850 Q180 826 240 850 M420 860 Q480 836 540 860 M700 850 Q760 826 820 850', { color: '#CFE6FF', sw: o(0.8) })
  );
}

/** Manjedoura: cocho de madeira com pés cruzados e palha dentro. */
function manjedoura() {
  const cocho = 'M170 500 L830 500 L760 700 L240 700Z';
  return (
    shadow(500, 880, 360) +
    tube('M280 690 L190 870 M720 690 L810 870', 40, WOOD_DARK) +
    tube('M320 690 L430 870 M680 690 L570 870', 40, WOOD_MID) +
    // palha
    P('M200 500 C260 400 340 440 400 410 C480 360 560 430 620 400 C700 380 760 440 800 500Z', '#F2D06B') +
    L('M260 470 L330 420 M400 456 L450 396 M520 450 L560 400 M640 446 L690 410 M330 490 L380 440', { color: '#D9A93A', sw: o(0.7) }) +
    P(cocho, WOOD) +
    clipD(cocho, L('M150 560 L850 560 M150 630 L850 630', { color: WOOD_DARK, sw: o(0.7) })) +
    L(cocho) +
    R(150, 480, 700, 46, 20, WOOD_MID) +
    sparkle(130, 330, 36, 0, '#FFD23F') +
    sparkle(870, 300, 30, 12, '#FFD23F')
  );
}

/** Manjedoura com o bebê Jesus enrolado em panos e um brilho em volta. */
function manjedouraBebe() {
  const panos = 'M330 520 C330 440 400 410 500 410 C600 410 670 440 670 520 L670 560 L330 560Z';
  return (
    Ci(500, 440, 250, '#FFF3B0', { sw: 0, opacity: 0.55 }) +
    Ci(500, 440, 170, '#FFE680', { sw: 0, opacity: 0.55 }) +
    shadow(500, 880, 360) +
    tube('M280 690 L190 870 M720 690 L810 870', 40, WOOD_DARK) +
    tube('M320 690 L430 870 M680 690 L570 870', 40, WOOD_MID) +
    P('M200 520 C260 440 340 470 400 450 C480 420 560 470 620 450 C700 440 760 480 800 520Z', '#F2D06B') +
    // o bebê
    P(panos, '#FFFFFF') +
    clipD(panos, L('M330 500 Q500 560 670 500 M340 540 Q500 590 660 540', { color: '#DDD5C5', sw: o(0.7) })) +
    Ci(500, 396, 84, '#F8D2AE') +
    E(420, 360, 36, 16, '#8A5A2B', { sw: 0 }) +
    L('M452 340 Q500 316 548 340', { color: '#8A5A2B', sw: o(1.2) }) +
    E(462, 404, 22, 12, '#3D2C4E', { sw: 0 }) +
    E(538, 404, 22, 12, '#3D2C4E', { sw: 0 }) +
    L('M446 398 Q462 388 478 398 M522 398 Q538 388 554 398', { color: '#3D2C4E', sw: o(0.8) }) +
    L('M478 438 Q500 454 522 438', { sw: o(0.8) }) +
    E(432, 430, 18, 12, '#FF9DB0', { sw: 0, opacity: 0.8 }) +
    E(568, 430, 18, 12, '#FF9DB0', { sw: 0, opacity: 0.8 }) +
    // cocho na frente
    P('M170 560 L830 560 L760 710 L240 710Z', WOOD) +
    clipD('M170 560 L830 560 L760 710 L240 710Z', L('M150 620 L850 620 M150 680 L850 680', { color: WOOD_DARK, sw: o(0.7) })) +
    L('M170 560 L830 560 L760 710 L240 710Z') +
    R(150, 540, 700, 44, 20, WOOD_MID)
  );
}

/** Três presentes lado a lado, para a cena de contar. */
const tresPresentes = () =>
  caixa(230, 860, 340, 300, '#FFD23F', '#F4B824', '#E25A52') +
  caixa(570, 860, 280, 380, '#4DA3FF', '#2E86E6', '#FFFFFF') +
  caixa(860, 860, 250, 240, '#9B7EDE', '#7F62C6', '#FFD23F');

module.exports = {
  pedras,
  madeira,
  gelo,
  guardaChuva,
  neve,
  chuva,
  folhas,
  numero,
  num4,
  num10,
  num40,
  estrela,
  lua,
  arcoIris,
  rainbowArc,
  leaf,
  drop,
  SKY_CLOUD,
  rock,
  funda,
  espada,
  escudo,
  cajado,
  skate,
  harpa,
  tambor,
  flauta,
  caixa,
  presente,
  foguete,
  castelo,
  barco,
  manjedoura,
  manjedouraBebe,
  tresPresentes,
};
