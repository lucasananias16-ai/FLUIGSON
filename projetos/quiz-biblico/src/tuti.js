'use strict';
/**
 * Tuti — mascote do canal: ovelhinha curiosa de lenço azul no pescoço.
 *
 * O desenho é gerado em SVG a partir de parâmetros de pose. As mesmas peças
 * servem às poses estáticas e à animação quadro a quadro (basta interpolar
 * os números de uma pose para a outra).
 *
 * Sistema de coordenadas da figura: 1000 x 1100, chão em y = 1000.
 */

const C = {
  line: '#3D2C4E',
  wool: '#FFFFFF',
  woolShade: '#E3DDF2',
  skin: '#FFD9B8',
  skinShade: '#F6BF98',
  earIn: '#FFAEC0',
  cheek: '#FF9DB0',
  nose: '#F27C93',
  hoof: '#5E455C',
  scarf: '#2E8BFF',
  scarfDark: '#1A6AD9',
  scarfLight: '#7DB9FF',
  pupil: '#2B1F3A',
  mouth: '#7A2B45',
  tongue: '#FF8097',
  star: '#FFD23F',
};
const O = 10; // espessura do contorno

/** Pose neutra: em pé, braços soltos, olhando para a frente. */
const BASE = {
  jump: 0, // px acima do chão
  lean: 0, // graus, inclinação do corpo inteiro
  squash: 1, // escala vertical (1 = normal); a largura compensa
  headTilt: 0, // graus
  headDx: 0,
  headDy: 0,
  armL: [346, 848], // alvo do casco; "L" é o braço à esquerda de quem vê
  armR: [654, 848],
  armLFront: false, // true = braço desenhado na frente da cabeça
  armRFront: false,
  legL: [442, 986], // alvo do pé
  legR: [558, 986],
  gaze: [0, 0], // direção do olhar, de -1 a 1
  eyes: 'open', // open | happy | wink
  eyeOpen: 1, // 0..1, para piscar
  browL: 0, // elevação da sobrancelha em px
  browR: 0,
  browTiltL: 0, // graus
  browTiltR: 0,
  mouth: 0, // abertura da boca, 0..1
  earL: 0, // rotação extra das orelhas, graus
  earR: 0,
  extras: null, // 'wave' | 'sparkles'
  shadow: true,
  gorro: false, // gorro de Papai Noel (Vídeo 4); desligado, o desenho é o de sempre
};

const POSES = {
  neutra: {},
  perguntando: {
    headTilt: 7,
    lean: 1.5,
    armR: [606, 536], // casco no queixo
    armRFront: true,
    armL: [394, 800], // casco na cintura
    gaze: [0.6, -0.65],
    browL: 4,
    browR: 14,
    browTiltR: -8,
    mouth: 0.2,
    earR: -6,
  },
  comemorando: {
    jump: 58,
    squash: 1.03,
    headDy: -6,
    armL: [244, 492],
    armR: [756, 492],
    legL: [404, 958],
    legR: [596, 958],
    eyes: 'happy',
    browL: 10,
    browR: 10,
    mouth: 1,
    earL: -14,
    earR: -14,
    extras: 'sparkles',
  },
  tchau: {
    headTilt: -6,
    lean: -1.5,
    armR: [716, 532],
    gaze: [0, 0],
    browL: 6,
    browR: 6,
    mouth: 0.55,
    earL: -4,
    extras: 'wave',
  },
};

const n = (v) => (Math.round(v * 10) / 10).toString();
let uid = 0;
let idPrefix = 't';

/** Nuvem de lã: união de círculos com contorno externo único e sombra suave. */
function cloud(circles, { sx = -7, sy = -11 } = {}) {
  const id = `${idPrefix}w${uid++}`;
  const big = circles.map(([x, y, r]) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r + O)}"/>`).join('');
  const fill = circles.map(([x, y, r]) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}"/>`).join('');
  return (
    `<g fill="${C.line}">${big}</g>` +
    `<clipPath id="${id}">${fill}</clipPath>` +
    `<g fill="${C.woolShade}">${fill}</g>` +
    `<g clip-path="url(#${id})"><g fill="${C.wool}" transform="translate(${sx},${sy})">${fill}</g></g>`
  );
}

/** Pequenos arcos que sugerem os cachinhos da lã. */
function curl(x, y, r, rot = 0) {
  return `<path transform="translate(${n(x)},${n(y)}) rotate(${rot})" d="M${-r} 0 A${r} ${r} 0 0 0 ${r} 0" fill="none" stroke="${C.woolShade}" stroke-width="7" stroke-linecap="round"/>`;
}

/**
 * Cinemática inversa de dois ossos. `pole` indica para que lado a
 * articulação (cotovelo ou joelho) deve apontar.
 */
function ik(sx, sy, tx, ty, L1, L2, pole) {
  let dx = tx - sx;
  let dy = ty - sy;
  const d0 = Math.hypot(dx, dy) || 0.001;
  const d = Math.min(L1 + L2 - 1, Math.max(Math.abs(L1 - L2) + 1, d0));
  dx *= d / d0;
  dy *= d / d0;
  const a = Math.atan2(dy, dx);
  const cosA = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d);
  const A = Math.acos(Math.max(-1, Math.min(1, cosA)));
  const cands = [a + A, a - A].map((ea) => [sx + Math.cos(ea) * L1, sy + Math.sin(ea) * L1]);
  const mx = sx + dx / 2;
  const my = sy + dy / 2;
  const score = (e) => (e[0] - mx) * pole[0] + (e[1] - my) * pole[1];
  const elbow = score(cands[0]) >= score(cands[1]) ? cands[0] : cands[1];
  return [[sx, sy], elbow, [sx + dx, sy + dy]];
}

/** Braço ou perna: cápsula dobrável com casco escuro na ponta. */
function limb(pts, w, hoof) {
  const d = 'M' + pts.map((p) => `${n(p[0])} ${n(p[1])}`).join(' L');
  const [x1, y1] = pts[pts.length - 2];
  const [x2, y2] = pts[pts.length - 1];
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const hx = x2 - ux * hoof;
  const hy = y2 - uy * hoof;
  const px = (-uy * w) / 2;
  const py = (ux * w) / 2;
  const skinPts = pts.slice(0, -1).concat([[hx, hy]]);
  const dSkin = 'M' + skinPts.map((p) => `${n(p[0])} ${n(p[1])}`).join(' L');
  const round = 'stroke-linecap="round" stroke-linejoin="round" fill="none"';
  return (
    `<path d="${d}" ${round} stroke="${C.line}" stroke-width="${w + 2 * O}"/>` +
    `<path d="M${n(hx)} ${n(hy)} L${n(x2)} ${n(y2)}" ${round} stroke="${C.hoof}" stroke-width="${w}"/>` +
    `<circle cx="${n(pts[0][0])}" cy="${n(pts[0][1])}" r="${w / 2}" fill="${C.skin}"/>` +
    `<path d="${dSkin}" stroke-linecap="butt" stroke-linejoin="round" fill="none" stroke="${C.skin}" stroke-width="${w}"/>` +
    `<path d="M${n(hx + px)} ${n(hy + py)} L${n(hx - px)} ${n(hy - py)}" stroke="${C.line}" stroke-width="7" stroke-linecap="butt"/>`
  );
}

/** Contorno em "squircle": mais cheio nas bochechas do que uma elipse. */
function squircle(rx, ry, k = 2.6, steps = 72) {
  const pts = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    pts.push([Math.sign(c) * Math.pow(Math.abs(c), 2 / k) * rx, Math.sign(s) * Math.pow(Math.abs(s), 2 / k) * ry]);
  }
  return 'M' + pts.map((p) => `${n(p[0])} ${n(p[1])}`).join(' L') + 'Z';
}

function star(x, y, r, rot = 0, fill = C.star) {
  const a = r * 0.24;
  return `<path transform="translate(${n(x)},${n(y)}) rotate(${rot})" d="M0 ${-r} Q${a} ${-a} ${r} 0 Q${a} ${a} 0 ${r} Q${-a} ${a} ${-r} 0 Q${-a} ${-a} 0 ${-r}Z" fill="${fill}" stroke="${C.line}" stroke-width="7" stroke-linejoin="round"/>`;
}

/** Gorro de Papai Noel: vermelho, com faixa de pelo e pompom caído para o lado. Coordenadas da cabeça. */
function gorroNatal() {
  const vermelho = '#E25A52';
  const sombra = '#C2443D';
  const corpo = 'M-186 -128 C-196 -270 -50 -360 70 -338 C170 -320 246 -262 280 -168 C236 -212 176 -230 120 -222 C150 -176 148 -140 186 -128 Q0 -186 -186 -128Z';
  const idc = `${idPrefix}g${uid++}`;
  return (
    `<path d="${corpo}" fill="${vermelho}" stroke="${C.line}" stroke-width="${O}" stroke-linejoin="round"/>` +
    `<clipPath id="${idc}"><path d="${corpo}"/></clipPath>` +
    `<path clip-path="url(#${idc})" d="M-120 -190 Q0 -260 150 -250 L150 -120 L-120 -120Z" fill="${sombra}" opacity="0.55"/>` +
    `<path d="M-196 -128 Q0 -196 196 -128 Q214 -86 176 -78 Q0 -140 -176 -78 Q-214 -86 -196 -128Z" fill="#FFFFFF" stroke="${C.line}" stroke-width="${O}" stroke-linejoin="round"/>` +
    `<path d="M-150 -112 Q-60 -138 0 -134 M60 -134 Q120 -134 160 -112" fill="none" stroke="${C.woolShade}" stroke-width="7" stroke-linecap="round"/>` +
    `<circle cx="282" cy="-160" r="38" fill="#FFFFFF" stroke="${C.line}" stroke-width="${O}"/>` +
    `<path d="M262 -170 Q282 -190 302 -172" fill="none" stroke="${C.woolShade}" stroke-width="7" stroke-linecap="round"/>`
  );
}

/** Círculos que formam o topete de lã da cabeça. */
const CAP = [
      [-172, -82, 48],
      [-136, -138, 56],
      [-74, -180, 62],
      [0, -198, 66],
      [74, -180, 62],
      [136, -138, 56],
      [172, -82, 48],
      [-100, -112, 50],
      [-34, -128, 54],
      [34, -128, 54],
      [100, -112, 50],
      [0, -150, 70],
];

function head(p) {
  const g = [];

  // Orelhas, atrás do rosto
  for (const s of [-1, 1]) {
    const extra = s < 0 ? p.earL : p.earR;
    const rot = s * (24 + extra);
    g.push(
      `<g transform="translate(${s * 178},-30) rotate(${n(rot)})">` +
        `<ellipse cx="${s * 62}" cy="0" rx="82" ry="44" fill="${C.skin}" stroke="${C.line}" stroke-width="${O}"/>` +
        `<ellipse cx="${s * 70}" cy="5" rx="52" ry="23" fill="${C.earIn}"/>` +
        `</g>`
    );
  }

  // Rosto
  const faceD = squircle(200, 178);
  const faceId = `${idPrefix}f${uid++}`;
  g.push(`<path d="${faceD}" fill="${C.skin}" stroke="${C.line}" stroke-width="${O}" stroke-linejoin="round"/>`);
  g.push(
    `<clipPath id="${faceId}"><path d="${faceD}"/></clipPath>` +
      `<g clip-path="url(#${faceId})"><g fill="${C.skinShade}" opacity="0.6" transform="translate(0,13)">` +
      CAP.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('') +
      `</g></g>`
  );

  // Topete de lã
  g.push(
    cloud(CAP)
  );
  g.push(curl(-66, -150, 22, 200) + curl(48, -172, 24, 160) + curl(112, -116, 18, 190) + curl(-128, -104, 16, 170));

  // Bochechas
  for (const s of [-1, 1]) {
    g.push(`<ellipse cx="${s * 134}" cy="82" rx="30" ry="24" fill="${C.cheek}" opacity="0.75"/>`);
  }

  // Olhos
  for (const s of [-1, 1]) {
    const cx = s * 82;
    const cy = 22;
    const closed = p.eyes === 'happy' || (p.eyes === 'wink' && s > 0);
    if (closed) {
      g.push(
        `<path d="M${cx - 40} ${cy + 16} Q${cx} ${cy - 40} ${cx + 40} ${cy + 16}" fill="none" stroke="${C.line}" stroke-width="13" stroke-linecap="round"/>`
      );
      continue;
    }
    const open = Math.max(0.06, p.eyeOpen);
    const gx = p.gaze[0] * 11;
    const gy = p.gaze[1] * 9;
    g.push(
      `<g transform="translate(${cx},${cy}) scale(1,${n(open)})">` +
        `<ellipse rx="46" ry="54" fill="#fff" stroke="${C.line}" stroke-width="8"/>` +
        `<ellipse cx="${n(gx)}" cy="${n(gy + 3)}" rx="31" ry="38" fill="${C.pupil}"/>` +
        `<circle cx="${n(gx - 11)}" cy="${n(gy - 13)}" r="12.5" fill="#fff"/>` +
        `<circle cx="${n(gx + 12)}" cy="${n(gy + 18)}" r="5.5" fill="#fff"/>` +
        `</g>`
    );
  }

  // Sobrancelhas
  for (const s of [-1, 1]) {
    const raise = s < 0 ? p.browL : p.browR;
    const tilt = s < 0 ? p.browTiltL : p.browTiltR;
    const cx = s * 84;
    const cy = -46 - raise;
    g.push(
      `<path transform="rotate(${n(tilt)} ${cx} ${n(cy)})" d="M${cx - 25} ${n(cy + 5)} Q${cx} ${n(cy - 9)} ${cx + 25} ${n(cy + 5)}" fill="none" stroke="${C.line}" stroke-width="8" stroke-linecap="round"/>`
    );
  }

  // Boca aberta (por baixo do "w")
  const my = 106;
  if (p.mouth > 0.02) {
    const id = `${idPrefix}m${uid++}`;
    const depth = 8 + p.mouth * 44;
    const w = 20 + p.mouth * 12;
    const dm = `M${-w} ${my + 8} Q${-w} ${n(my + 8 + depth)} 0 ${n(my + 8 + depth)} Q${w} ${n(my + 8 + depth)} ${w} ${my + 8}Z`;
    g.push(
      `<clipPath id="${id}"><path d="${dm}"/></clipPath>` +
        `<path d="${dm}" fill="${C.mouth}" stroke="${C.line}" stroke-width="7" stroke-linejoin="round"/>` +
        `<ellipse cx="0" cy="${n(my + 8 + depth + 4)}" rx="${n(w * 0.78)}" ry="${n(depth * 0.5)}" fill="${C.tongue}" clip-path="url(#${id})"/>`
    );
  }
  // Focinho e sorriso em "w"
  g.push(
    `<path d="M0 98 L0 ${my + 4} M-38 ${my - 1} Q-19 ${my + 22} 0 ${my + 4} Q19 ${my + 22} 38 ${my - 1}" fill="none" stroke="${C.line}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M-19 77 Q0 70 19 77 Q16 94 0 100 Q-16 94 -19 77Z" fill="${C.nose}" stroke="${C.line}" stroke-width="7" stroke-linejoin="round"/>`
  );

  if (p.gorro) g.push(gorroNatal());

  return g.join('');
}

function body() {
  const circles = [[0, 0, 128]];
  const N = 11;
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2 + 0.28;
    circles.push([Math.cos(t) * 132, Math.sin(t) * 118, 56 + (i % 3) * 4]);
  }
  return (
    cloud(circles) +
    curl(-70, 40, 24, 200) +
    curl(64, 62, 22, 165) +
    curl(-18, 104, 20, 185) +
    curl(96, -6, 18, 150) +
    curl(-110, -24, 18, 215)
  );
}

function scarf() {
  // Faixa em volta do pescoço e ponta triangular na frente (lenço de pescoço)
  const band = 'M-150 -78 C-132 26 132 26 150 -78 C166 118 -166 118 -150 -78Z';
  const tri = 'M-88 62 Q0 96 88 62 L14 168 Q0 184 -14 168Z';
  const id = `${idPrefix}s${uid++}`;
  const dots = [
    [-46, 96],
    [0, 110],
    [46, 96],
    [-22, 136],
    [22, 136],
    [0, 162],
  ]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8.5"/>`)
    .join('');
  return (
    `<path d="${tri}" fill="${C.scarf}" stroke="${C.line}" stroke-width="${O}" stroke-linejoin="round"/>` +
    `<clipPath id="${id}"><path d="${tri}"/></clipPath>` +
    `<g clip-path="url(#${id})" fill="#fff" opacity="0.92">${dots}</g>` +
    `<path d="${band}" fill="${C.scarfDark}" stroke="${C.line}" stroke-width="${O}" stroke-linejoin="round"/>`
  );
}

function extras(p) {
  if (p.extras === 'sparkles') {
    return (
      star(150, 300, 40, 12) +
      star(862, 250, 48, -10) +
      star(218, 130, 26, 30, '#FF8FB1') +
      star(790, 110, 28, 20, '#7DD3A8') +
      star(900, 520, 26, 8, '#7DB9FF') +
      star(96, 560, 24, -14, '#FFB55A') +
      [
        [300, 70, '#7DB9FF'],
        [700, 52, '#FFD23F'],
        [60, 410, '#FF8FB1'],
        [940, 380, '#7DD3A8'],
        [392, 30, '#FF8FB1'],
      ]
        .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="13" fill="${c}" stroke="${C.line}" stroke-width="6"/>`)
        .join('')
    );
  }
  if (p.extras === 'wave') {
    const [x, y] = p.armR;
    const arc = (r, a0, a1) => {
      const rad = Math.PI / 180;
      const x0 = x + Math.cos(a0 * rad) * r;
      const y0 = y + Math.sin(a0 * rad) * r;
      const x1 = x + Math.cos(a1 * rad) * r;
      const y1 = y + Math.sin(a1 * rad) * r;
      return `<path d="M${n(x0)} ${n(y0)} A${r} ${r} 0 0 1 ${n(x1)} ${n(y1)}" fill="none" stroke="${C.line}" stroke-width="9" stroke-linecap="round" opacity="0.55"/>`;
    };
    return arc(66, -74, -14) + arc(100, -66, -22);
  }
  return '';
}

/**
 * Devolve o grupo SVG da Tuti para a pose pedida.
 * @param {string|object} pose nome em POSES ou objeto com parâmetros
 * @param {object} override parâmetros que sobrescrevem a pose
 */
function tuti(pose = 'neutra', override = {}) {
  const p = Object.assign({}, BASE, typeof pose === 'string' ? POSES[pose] : pose, override);
  const out = [];

  if (p.shadow) {
    const k = 1 - Math.min(0.45, p.jump / 180);
    out.push(`<ellipse cx="500" cy="1004" rx="${n(190 * k)}" ry="${n(24 * k)}" fill="#3D2C4E" opacity="${n(0.16 * k)}"/>`);
  }

  out.push(extras(p));

  const sq = p.squash;
  out.push(
    `<g transform="translate(0,${n(-p.jump)}) rotate(${n(p.lean)} 500 1000) translate(500,1000) scale(${n(1 / Math.sqrt(sq))},${n(sq)}) translate(-500,-1000)">`
  );

  // Rabinho
  out.push(cloud([[352, 842, 30], [326, 822, 24], [330, 856, 22]], { sx: -4, sy: -6 }));

  // Pernas
  out.push(limb(ik(450, 856, p.legL[0], p.legL[1], 68, 68, [-1, -0.3]), 60, 34));
  out.push(limb(ik(550, 856, p.legR[0], p.legR[1], 68, 68, [1, -0.3]), 60, 34));

  // Corpo
  out.push(`<g transform="translate(500,742)">${body()}</g>`);

  const armL = limb(ik(398, 676, p.armL[0], p.armL[1], 92, 92, [-1, 1]), 56, 30);
  const armR = limb(ik(602, 676, p.armR[0], p.armR[1], 92, 92, [1, 1]), 56, 30);
  if (!p.armLFront) out.push(armL);
  if (!p.armRFront) out.push(armR);

  // Lenço
  out.push(`<g transform="rotate(${n(p.headTilt * 0.5)} 500 548) translate(500,548)">${scarf()}</g>`);

  // Cabeça (gira em torno do pescoço)
  out.push(
    `<g transform="rotate(${n(p.headTilt)} 500 548) translate(${n(500 + p.headDx)},${n(378 + p.headDy)})">${head(p)}</g>`
  );

  if (p.armLFront) out.push(armL);
  if (p.armRFront) out.push(armR);

  out.push('</g>');
  return `<g class="tuti">${out.join('')}</g>`;
}

/** SVG completo (fundo transparente) com a Tuti na pose pedida. */
function tutiSvg(pose, override = {}, { width = 1000, height = 1100, prefix = 't' } = {}) {
  uid = 0;
  idPrefix = prefix;
  // com o gorro, a ponta passa do alto do desenho quando a Tuti pula: deixa aparecer
  const gorro = override.gorro || (typeof pose === 'object' && pose && pose.gorro);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1100" width="${width}" height="${height}"${gorro ? ' overflow="visible"' : ''}>${tuti(pose, override)}</svg>`;
}

module.exports = { tuti, tutiSvg, POSES, BASE, C };
