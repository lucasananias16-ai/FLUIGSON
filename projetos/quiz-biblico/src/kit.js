'use strict';
/**
 * Peças de desenho compartilhadas pelas ilustrações.
 * Mantêm o mesmo traço da Tuti: contorno grosso e arredondado, cores chapadas,
 * olhos grandes com brilho.
 *
 * Toda ilustração é desenhada numa prancheta de 1000 x 1000 com contorno de
 * 10 unidades. `withOutline` troca essa espessura quando um desenho vai ser
 * reduzido dentro de outro, para o traço continuar com o mesmo peso na tela.
 */

const LINE = '#3D2C4E';
let O = 10;
let uid = 0;

const n = (v) => (Math.round(v * 10) / 10).toString();
/** Espessura do contorno atual, multiplicada por k. */
const o = (k = 1) => O * k;

function withOutline(w, fn) {
  const prev = O;
  O = w;
  try {
    return fn();
  } finally {
    O = prev;
  }
}
function resetIds() {
  uid = 0;
}
const nextId = () => `k${uid++}`;

function attrs(fill, { sw, stroke, opacity, attr } = {}) {
  const w = sw === undefined ? O : sw;
  let s = ` fill="${fill}"`;
  if (w > 0) s += ` stroke="${stroke || LINE}" stroke-width="${n(w)}" stroke-linejoin="round" stroke-linecap="round"`;
  if (opacity !== undefined) s += ` opacity="${opacity}"`;
  if (attr) s += ` ${attr}`;
  return s;
}
const rot = (opt, cx, cy) => (opt && opt.rot ? ` transform="rotate(${n(opt.rot)} ${n(cx)} ${n(cy)})"` : '');

/** Forma fechada com preenchimento e contorno. `sw: 0` tira o contorno. */
const P = (d, fill, opt) => `<path d="${d}"${attrs(fill, opt)}/>`;
const E = (cx, cy, rx, ry, fill, opt) =>
  `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}"${rot(opt, cx, cy)}${attrs(fill, opt)}/>`;
const Ci = (cx, cy, r, fill, opt) => `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}"${attrs(fill, opt)}/>`;
const R = (x, y, w, h, r, fill, opt) =>
  `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${n(r)}"${rot(opt, x + w / 2, y + h / 2)}${attrs(fill, opt)}/>`;
/** Traço de detalhe, sem preenchimento. */
const L = (d, opt = {}) =>
  `<path d="${d}" fill="none" stroke="${opt.color || LINE}" stroke-width="${n(opt.sw === undefined ? O * 0.8 : opt.sw)}" stroke-linecap="${opt.cap || 'round'}" stroke-linejoin="round"${opt.opacity !== undefined ? ` opacity="${opt.opacity}"` : ''}/>`;
const G = (transform, ...children) => `<g transform="${transform}">${children.join('')}</g>`;

/** Desenha `content` só dentro das formas `shapes` (marcação SVG sem estilo). */
function clip(shapes, content) {
  const id = nextId();
  return `<clipPath id="${id}">${shapes}</clipPath><g clip-path="url(#${id})">${content}</g>`;
}
const clipD = (d, content) => clip(`<path d="${d}"/>`, content);

/** Tubo: linha grossa com contorno (tromba, pescoço, cabo, galho). */
function tube(d, w, color, { cap = 'round' } = {}) {
  return (
    `<path d="${d}" fill="none" stroke="${LINE}" stroke-width="${n(w + 2 * O)}" stroke-linecap="${cap}" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="${color}" stroke-width="${n(w)}" stroke-linecap="${cap}" stroke-linejoin="round"/>`
  );
}

/** Nuvem: união de círculos com um único contorno externo e sombra suave. */
function cloud(circles, { fill = '#FFFFFF', shade = '#E3DDF2', sx = -7, sy = -11 } = {}) {
  const id = nextId();
  const big = circles.map(([x, y, r]) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r + O)}"/>`).join('');
  const inner = circles.map(([x, y, r]) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}"/>`).join('');
  return (
    `<g fill="${LINE}">${big}</g>` +
    `<clipPath id="${id}">${inner}</clipPath>` +
    `<g fill="${shade}">${inner}</g>` +
    `<g clip-path="url(#${id})"><g fill="${fill}" transform="translate(${sx},${sy})">${inner}</g></g>`
  );
}

/** Arquinho que sugere um cacho ou uma dobra. */
function curl(x, y, r, angle = 0, color = '#E3DDF2') {
  return `<path transform="translate(${n(x)},${n(y)}) rotate(${angle})" d="M${-r} 0 A${r} ${r} 0 0 0 ${r} 0" fill="none" stroke="${color}" stroke-width="${n(O * 0.7)}" stroke-linecap="round"/>`;
}

/** Cinemática inversa de dois ossos; `pole` diz para onde a articulação aponta. */
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
  const joint = score(cands[0]) >= score(cands[1]) ? cands[0] : cands[1];
  return [[sx, sy], joint, [sx + dx, sy + dy]];
}

/** Braço ou perna: cápsula dobrável com a ponta (mão, casco, pata) de outra cor. */
function limb(pts, w, tipLen, { color, tip }) {
  const d = 'M' + pts.map((p) => `${n(p[0])} ${n(p[1])}`).join(' L');
  const [x1, y1] = pts[pts.length - 2];
  const [x2, y2] = pts[pts.length - 1];
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const hx = x2 - ux * tipLen;
  const hy = y2 - uy * tipLen;
  const px = (-uy * w) / 2;
  const py = (ux * w) / 2;
  const body = pts.slice(0, -1).concat([[hx, hy]]);
  const dBody = 'M' + body.map((p) => `${n(p[0])} ${n(p[1])}`).join(' L');
  const round = 'stroke-linecap="round" stroke-linejoin="round" fill="none"';
  return (
    `<path d="${d}" ${round} stroke="${LINE}" stroke-width="${n(w + 2 * O)}"/>` +
    `<path d="M${n(hx)} ${n(hy)} L${n(x2)} ${n(y2)}" ${round} stroke="${tip}" stroke-width="${n(w)}"/>` +
    `<circle cx="${n(pts[0][0])}" cy="${n(pts[0][1])}" r="${n(w / 2)}" fill="${color}"/>` +
    `<path d="${dBody}" stroke-linecap="butt" stroke-linejoin="round" fill="none" stroke="${color}" stroke-width="${n(w)}"/>` +
    `<path d="M${n(hx + px)} ${n(hy + py)} L${n(hx - px)} ${n(hy - py)}" stroke="${LINE}" stroke-width="${n(O * 0.7)}" stroke-linecap="butt"/>`
  );
}

/** Contorno em "squircle": mais cheio do que uma elipse. */
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

/** Curva fechada e suave que passa pelos pontos dados. */
function smooth(pts) {
  const N = pts.length;
  let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
  for (let i = 0; i < N; i++) {
    const p0 = pts[(i - 1 + N) % N];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % N];
    const p3 = pts[(i + 2) % N];
    d += ` C${n(p1[0] + (p2[0] - p0[0]) / 6)} ${n(p1[1] + (p2[1] - p0[1]) / 6)} ${n(p2[0] - (p3[0] - p1[0]) / 6)} ${n(p2[1] - (p3[1] - p1[1]) / 6)} ${n(p2[0])} ${n(p2[1])}`;
  }
  return d + 'Z';
}

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Forma orgânica irregular (pedra, mancha, moita). */
function blob(cx, cy, rx, ry, seed, k = 0.14, N = 9) {
  const r = rng(seed);
  const pts = [];
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2;
    const f = 1 + (r() - 0.5) * 2 * k;
    pts.push([cx + Math.cos(t) * rx * f, cy + Math.sin(t) * ry * f]);
  }
  return smooth(pts);
}

/** Estrela de quatro pontas (brilho). */
function sparkle(x, y, r, angle = 0, fill = '#FFD23F') {
  const a = r * 0.24;
  return `<path transform="translate(${n(x)},${n(y)}) rotate(${angle})" d="M0 ${-r} Q${n(a)} ${n(-a)} ${r} 0 Q${n(a)} ${n(a)} 0 ${r} Q${n(-a)} ${n(a)} ${-r} 0 Q${n(-a)} ${n(-a)} 0 ${-r}Z"${attrs(fill, { sw: O * 0.7 })}/>`;
}

/** Olho no estilo da Tuti. `s` é o tamanho; o contorno não afina com ele. */
function eye(cx, cy, s = 1, { gaze = [0, 0], closed = false } = {}) {
  if (closed) {
    return L(`M${n(cx - 40 * s)} ${n(cy + 16 * s)} Q${n(cx)} ${n(cy - 40 * s)} ${n(cx + 40 * s)} ${n(cy + 16 * s)}`, {
      sw: Math.max(O * 0.8, 13 * s),
    });
  }
  const gx = gaze[0] * 11;
  const gy = gaze[1] * 9;
  return (
    `<g transform="translate(${n(cx)},${n(cy)}) scale(${n(s)})">` +
    `<ellipse rx="46" ry="54" fill="#fff" stroke="${LINE}" stroke-width="${n((O * 0.75) / s)}"/>` +
    `<ellipse cx="${n(gx)}" cy="${n(gy + 3)}" rx="31" ry="38" fill="#2B1F3A"/>` +
    `<circle cx="${n(gx - 11)}" cy="${n(gy - 13)}" r="12.5" fill="#fff"/>` +
    `<circle cx="${n(gx + 12)}" cy="${n(gy + 18)}" r="5.5" fill="#fff"/>` +
    `</g>`
  );
}
const cheek = (cx, cy, r = 26) => E(cx, cy, r, r * 0.8, '#FF9DB0', { sw: 0, opacity: 0.75 });

/** Sombra no chão. */
const shadow = (cx, cy, rx, ry = rx * 0.13) => E(cx, cy, rx, ry, '#3D2C4E', { sw: 0, opacity: 0.14 });

module.exports = {
  LINE,
  n,
  o,
  withOutline,
  resetIds,
  nextId,
  P,
  E,
  Ci,
  R,
  L,
  G,
  clip,
  clipD,
  tube,
  cloud,
  curl,
  ik,
  limb,
  squircle,
  smooth,
  blob,
  rng,
  sparkle,
  eye,
  cheek,
  shadow,
};
