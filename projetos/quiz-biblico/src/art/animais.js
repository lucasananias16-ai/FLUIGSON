'use strict';
/**
 * Animais do Vídeo 1. Prancheta de 1000 x 1000, chão em y ≈ 880.
 * Só os seres vivos têm rosto; os objetos nunca têm.
 */
const { n, o, P, E, Ci, R, L, G, clip, clipD, tube, cloud, curl, blob, squircle, eye, cheek, shadow } = require('../kit');

/**
 * Perna na frente do corpo. Dentro do corpo (`inner`, a forma do corpo um
 * pouco encolhida) o contorno da perna some, e as duas viram uma silhueta só.
 */
function leg(cx, top, bottom, w, color, inner) {
  return (
    R(cx - w / 2, top, w, bottom - top, w * 0.44, color) +
    clip(inner, R(cx - w / 2 - o(1), top - o(2), w + o(2), bottom - top, 0, color, { sw: 0 }))
  );
}

// ---------------------------------------------------------------- Elefante
function elefante() {
  const body = '#A9B9DC';
  const shade = '#8D9FC9';
  const nail = '#EEF2FB';
  const nails = (cx) =>
    [-30, 0, 30].map((dx) => E(cx + dx, 858 - Math.abs(dx) * 0.1, 12, 10, nail, { sw: o(0.5) })).join('');
  const trunk = 'M742 470 C846 470 884 560 864 646 C852 700 882 734 918 708';
  const inner = '<ellipse cx="430" cy="560" rx="243" ry="183"/>';
  return (
    shadow(480, 884, 340) +
    // pernas do lado de lá
    R(322, 650, 104, 222, 46, shade) +
    R(596, 650, 104, 222, 46, shade) +
    // rabo
    tube('M224 500 Q166 530 162 612', 14, body) +
    E(160, 634, 17, 24, shade) +
    // corpo
    E(430, 560, 250, 190, body) +
    leg(286, 640, 872, 112, body, inner) +
    leg(540, 640, 872, 112, body, inner) +
    nails(286) +
    nails(540) +
    // cabeça
    Ci(650, 440, 168, body) +
    // tromba
    tube(trunk, 68, body) +
    Ci(752, 468, 36, body, { sw: 0 }) +
    L('M836 548 Q866 560 896 550', { color: shade, sw: o(0.7) }) +
    L('M830 606 Q860 620 890 612', { color: shade, sw: o(0.7) }) +
    // orelha
    E(548, 444, 108, 140, shade, { rot: -8 }) +
    E(544, 450, 70, 100, '#F7B8C8', { rot: -8, sw: 0 }) +
    // rosto
    eye(694, 398, 0.64) +
    L('M664 336 Q694 320 724 336', { sw: o(0.8) }) +
    cheek(724, 478, 26) +
    L('M690 536 Q724 560 760 540', { sw: o(0.8) })
  );
}

/** Vários elefantes pequenos numa mesma ilustração, com o traço compensado. */
function elefantes(places, scale, ow) {
  const { withOutline } = require('../kit');
  return places
    .map(([x, y]) => G(`translate(${x},${y}) scale(${scale})`, withOutline(ow, elefante)))
    .join('');
}
const umElefante = () => G('translate(-20,-10) scale(1.02)', elefante());
const doisElefantes = () =>
  elefantes(
    [
      [20, 80],
      [400, 270],
    ],
    0.6,
    14
  );
// Cinco, arrumados como a face 5 de um dado
const cincoElefantes = () =>
  elefantes(
    [
      [40, 10],
      [520, 10],
      [280, 280],
      [40, 550],
      [520, 550],
    ],
    0.42,
    17
  );

// -------------------------------------------------------------------- Leão
function leao() {
  const fur = '#FFC55A';
  const furShade = '#F2A93B';
  const mane = '#E8833A';
  const maneShade = '#C96A28';
  const cream = '#FFF1D6';
  const nose = '#7A4A2B';
  const ring = [[500, 370, 150]];
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2 + 0.26;
    ring.push([500 + Math.cos(t) * 158, 370 + Math.sin(t) * 150, 62 + (i % 2) * 6]);
  }
  const bodyD = 'M372 560 C338 700 330 800 366 872 L634 872 C670 800 662 700 628 560Z';
  return (
    shadow(500, 890, 270) +
    // rabo
    tube('M640 810 C770 810 806 710 764 632', 22, fur) +
    P(blob(758, 606, 36, 46, 3, 0.16), mane) +
    // corpo sentado
    E(376, 858, 72, 34, fur) +
    E(624, 858, 72, 34, fur) +
    P(bodyD, fur) +
    clipD(bodyD, E(500, 760, 92, 130, cream, { sw: 0 })) +
    tube('M446 660 L446 842', 60, fur) +
    tube('M554 660 L554 842', 60, fur) +
    Ci(446, 654, 44, fur, { sw: 0 }) +
    Ci(554, 654, 44, fur, { sw: 0 }) +
    L('M432 856 L432 872 M460 856 L460 872 M540 856 L540 872 M568 856 L568 872', { sw: o(0.6) }) +
    // juba, orelhas e cabeça
    cloud(ring, { fill: mane, shade: maneShade, sx: -8, sy: -12 }) +
    Ci(392, 248, 44, fur) +
    Ci(392, 252, 22, mane, { sw: 0 }) +
    Ci(608, 248, 44, fur) +
    Ci(608, 252, 22, mane, { sw: 0 }) +
    G('translate(500,378)', P(squircle(150, 138), fur)) +
    // rosto
    E(500, 440, 80, 58, cream, { sw: 0 }) +
    eye(444, 362, 0.62) +
    eye(556, 362, 0.62) +
    L('M418 306 Q444 292 470 306', { sw: o(0.8) }) +
    L('M530 306 Q556 292 582 306', { sw: o(0.8) }) +
    cheek(392, 430, 24) +
    cheek(608, 430, 24) +
    L('M500 432 L500 446 M466 444 Q483 466 500 446 Q517 466 534 444', { sw: o(0.8) }) +
    P('M478 408 Q500 400 522 408 Q518 428 500 434 Q482 428 478 408Z', nose, { sw: o(0.7) }) +
    [-1, 1].map((s) => Ci(500 + s * 50, 448, 4, furShade, { sw: 0 }) + Ci(500 + s * 64, 436, 4, furShade, { sw: 0 })).join('')
  );
}

// ------------------------------------------------------------------ Girafa
function girafa() {
  const body = '#FFD66B';
  const shade = '#F1B945';
  const spot = '#D98A3A';
  const cream = '#FFF1D6';
  const hoof = '#7A4A2B';
  const neckD = 'M486 590 L556 262 L668 282 L606 626Z';
  const inner = '<ellipse cx="420" cy="640" rx="189" ry="111"/>';
  const bodyShape = `<ellipse cx="420" cy="640" rx="196" ry="118"/><path d="${neckD}"/>`;
  const spots = [
    [300, 600, 40, 32, 1],
    [392, 690, 38, 28, 2],
    [470, 606, 34, 28, 3],
    [370, 560, 26, 20, 4],
    [540, 690, 30, 24, 5],
    [574, 520, 30, 26, 6],
    [600, 420, 28, 24, 7],
    [606, 330, 22, 20, 8],
    [250, 680, 24, 20, 9],
  ]
    .map(([x, y, rx, ry, seed]) => P(blob(x, y, rx, ry, seed, 0.2, 7), spot, { sw: 0 }))
    .join('');
  const far = (cx) => R(cx - 24, 690, 48, 160, 20, shade) + R(cx - 28, 838, 56, 40, 14, hoof);
  const near = (cx) => leg(cx, 690, 850, 52, body, inner) + R(cx - 30, 838, 60, 40, 14, hoof);
  return (
    shadow(430, 886, 270) +
    tube('M236 610 Q196 650 204 716', 12, body) +
    P(blob(204, 738, 18, 26, 4, 0.14), hoof) +
    far(330) +
    far(540) +
    E(420, 640, 196, 118, body) +
    P(neckD, body) +
    clip(inner, P(neckD, body, { sw: o(2.4), stroke: body })) +
    clip(bodyShape, spots) +
    near(282) +
    near(486) +
    // chifrinhos e orelha
    tube('M612 150 L600 84', 14, body) +
    Ci(598, 72, 17, hoof) +
    tube('M668 144 L676 78', 14, body) +
    Ci(678, 66, 17, hoof) +
    E(548, 186, 52, 25, body, { rot: 22 }) +
    E(546, 188, 30, 12, '#FFAEC0', { rot: 22, sw: 0 }) +
    // cabeça e focinho
    E(650, 214, 108, 86, body, { rot: -8 }) +
    E(738, 244, 74, 56, cream) +
    E(650, 232, 60, 40, body, { sw: 0 }) +
    eye(652, 196, 0.6) +
    L('M624 138 Q652 124 680 138', { sw: o(0.8) }) +
    cheek(690, 262, 22) +
    Ci(770, 228, 6, hoof, { sw: 0 }) +
    L('M712 268 Q744 290 776 270', { sw: o(0.8) })
  );
}

// ------------------------------------------------------------------ Coruja
function coruja() {
  const body = '#A8713F';
  const dark = '#8A5A2B';
  const belly = '#F6D9A8';
  const disc = '#FFF1D6';
  const orange = '#FFA53A';
  const bodyD =
    'M500 196 C690 196 752 420 736 600 C722 734 620 800 500 800 C380 800 278 734 264 600 C248 420 310 196 500 196Z';
  const marks = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4 - (r % 2); c++) {
      const x = 410 + c * 60 + (r % 2) * 30;
      const y = 600 + r * 54;
      marks.push(L(`M${x - 16} ${y} Q${x} ${y + 20} ${x + 16} ${y}`, { color: '#DDB377', sw: o(0.7) }));
    }
  }
  return (
    shadow(500, 880, 300) +
    tube('M120 812 L880 812', 40, '#A66A34') +
    L('M170 806 L250 806 M700 818 L800 818', { color: '#8A5A2B', sw: o(0.6) }) +
    // tufos das orelhas
    P('M340 300 L296 150 L440 232Z', dark) +
    P('M660 300 L704 150 L560 232Z', dark) +
    // asas, corpo e barriga
    E(266, 566, 66, 150, dark, { rot: 12 }) +
    E(734, 566, 66, 150, dark, { rot: -12 }) +
    P(bodyD, body) +
    clipD(bodyD, E(500, 650, 156, 190, belly, { sw: 0 }) + marks.join('')) +
    // rosto
    Ci(404, 388, 108, disc) +
    Ci(596, 388, 108, disc) +
    eye(404, 392, 1.12) +
    eye(596, 392, 1.12) +
    P('M468 452 Q500 440 532 452 Q520 496 500 510 Q480 496 468 452Z', orange) +
    // pés
    E(440, 800, 46, 22, orange) +
    L('M424 792 L424 812 M456 792 L456 812', { sw: o(0.6) }) +
    E(560, 800, 46, 22, orange) +
    L('M544 792 L544 812 M576 792 L576 812', { sw: o(0.6) })
  );
}

// ------------------------------------------------------------------- Pomba
function pomba() {
  const white = '#FFFFFF';
  const shade = '#E3DDF2';
  const beak = '#FFB23A';
  const green = '#5DBB7A';
  const leaf = (x, y, a) =>
    G(`translate(${x},${y}) rotate(${a})`, P('M0 0 C24 -26 70 -26 92 0 C70 26 24 26 0 0Z', green), L('M10 0 L80 0', { color: '#3F9E60', sw: o(0.6) }));
  const bodyD = 'M232 566 C250 440 420 386 560 420 C640 440 690 500 690 560 C690 660 560 716 430 700 C330 688 250 640 232 566Z';
  const wingD = 'M350 500 C300 380 350 230 500 170 C520 250 580 300 590 400 C598 480 560 540 480 560 C420 574 372 548 350 500Z';
  return (
    // cauda
    P('M262 560 L96 486 Q84 536 118 566 Q90 606 128 632 Q112 676 160 690 L290 640Z', white) +
    L('M118 566 L226 576 M128 632 L236 610', { color: shade, sw: o(0.7) }) +
    // corpo e cabeça
    P(bodyD, white) +
    clipD(bodyD, E(470, 700, 250, 70, shade, { sw: 0 })) +
    L(bodyD) +
    Ci(690, 442, 112, white) +
    E(626, 500, 74, 62, white, { sw: 0 }) +
    // asa
    P(wingD, white) +
    clipD(wingD, L('M420 500 C400 400 440 300 500 240 M486 520 C470 430 500 350 548 300', { color: shade, sw: o(0.8) })) +
    // raminho de oliveira no bico
    L('M838 462 Q884 430 912 372', { color: '#6E8F2E', sw: o(1) }) +
    leaf(872, 434, -68) +
    leaf(866, 446, 6) +
    leaf(904, 386, -24) +
    P('M786 430 L856 456 L788 486Z', beak) +
    // rosto
    eye(714, 424, 0.52) +
    cheek(672, 486, 22)
  );
}

// ----------------------------------------------------------------- Pinguim
function pinguim() {
  const dark = '#3E4C73';
  const orange = '#FFA53A';
  const bodyD =
    'M500 130 C690 130 758 330 750 560 C742 762 640 862 500 862 C360 862 258 762 250 560 C242 330 310 130 500 130Z';
  const maskD =
    'M500 306 C560 232 664 262 670 372 C674 432 642 470 662 560 C694 722 612 834 500 834 C388 834 306 722 338 560 C358 470 326 432 330 372 C336 262 440 232 500 306Z';
  return (
    shadow(500, 884, 250) +
    E(428, 868, 64, 27, orange) +
    E(572, 868, 64, 27, orange) +
    E(262, 566, 54, 152, dark, { rot: 16 }) +
    E(738, 566, 54, 152, dark, { rot: -16 }) +
    P(bodyD, dark) +
    clipD(bodyD, P(maskD, '#FFFFFF', { sw: 0 })) +
    eye(428, 374, 0.72) +
    eye(572, 374, 0.72) +
    cheek(366, 446, 26) +
    cheek(634, 446, 26) +
    P('M452 434 Q500 414 548 434 Q524 486 500 494 Q476 486 452 434Z', orange)
  );
}

// ------------------------------------------------------------------ Ovelha
/**
 * Ovelha do rebanho (Vídeo 2). É de quatro patas e tem o rosto um pouco mais
 * escuro que o da Tuti, para ninguém confundir as duas.
 */
function ovelha({ feliz = false, olhar = [0, 0] } = {}) {
  const pele = '#DCC3AC';
  const peleEscura = '#C6AA91';
  const casco = '#5E455C';
  const corpo = [[540, 600, 150]];
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2 + 0.2;
    corpo.push([540 + Math.cos(t) * 200, 600 + Math.sin(t) * 128, 70 + (i % 3) * 5]);
  }
  const perna = (x) => R(x - 26, 700, 52, 160, 22, pele) + R(x - 30, 836, 60, 46, 16, casco);
  const topete = [
    [-96, -64, 44],
    [-52, -104, 52],
    [6, -116, 54],
    [62, -98, 48],
    [100, -58, 42],
    [0, -74, 60],
  ];
  return (
    shadow(520, 884, 330) +
    // rabinho e patas
    cloud([[786, 560, 34], [812, 586, 26]], { sx: -4, sy: -6 }) +
    perna(396) +
    perna(486) +
    perna(606) +
    perna(690) +
    cloud(corpo) +
    curl(560, 640, 26, 190) +
    curl(660, 570, 22, 160) +
    curl(470, 560, 20, 200) +
    curl(600, 700, 20, 175) +
    // cabeça
    G(
      'translate(330,450)',
      E(-150, -14, 66, 34, pele, { rot: -24 }),
      E(-154, -10, 40, 17, '#FFAEC0', { rot: -24, sw: 0 }),
      E(150, -14, 66, 34, pele, { rot: 24 }),
      E(154, -10, 40, 17, '#FFAEC0', { rot: 24, sw: 0 }),
      P(squircle(138, 124), pele),
      cloud(topete, { sx: -5, sy: -8 }),
      cheek(-88, 52, 20),
      cheek(88, 52, 20),
      eye(-52, 14, 0.52, { gaze: olhar, closed: feliz }),
      eye(52, 14, 0.52, { gaze: olhar, closed: feliz }),
      L('M0 68 L0 78 M-26 76 Q-13 92 0 78 Q13 92 26 76', { sw: o(0.8) }),
      P('M-14 54 Q0 48 14 54 Q12 66 0 70 Q-12 66 -14 54Z', '#F27C93', { sw: o(0.6) }),
      E(0, 100, 60, 14, peleEscura, { sw: 0, opacity: 0 })
    )
  );
}

// ------------------------------------------------------- Vídeo 3: camelo
function camelo() {
  const corpo = '#E7B974';
  const sombra = '#CFA05D';
  const creme = '#FFE9C7';
  const casco = '#7A4A2B';
  const inner = '<ellipse cx="430" cy="600" rx="210" ry="106"/>';
  const giba = blob(420, 462, 98, 92, 3, 0.07, 8);
  const pescoco = 'M500 590 C560 470 584 360 622 292 L736 322 C700 402 690 500 640 640Z';
  const longe = (cx) => R(cx - 24, 640, 48, 232, 20, sombra) + R(cx - 28, 846, 56, 34, 14, casco);
  const perto = (cx) => leg(cx, 640, 850, 54, corpo, inner) + R(cx - 31, 838, 62, 40, 14, casco);
  return (
    shadow(450, 886, 320) +
    tube('M222 560 Q168 600 176 676', 12, corpo) +
    P(blob(176, 700, 16, 24, 5, 0.14), casco) +
    longe(318) +
    longe(540) +
    E(430, 600, 218, 112, corpo) +
    P(giba, corpo) +
    clip(inner, P(giba, corpo, { sw: o(2.4), stroke: corpo }) + P(pescoco, corpo, { sw: o(2.4), stroke: corpo })) +
    P(pescoco, corpo, { sw: 0 }) +
    L('M500 590 C560 470 584 360 622 292', { sw: o(0.9) }) +
    L('M640 640 C690 500 700 402 736 322', { sw: o(0.9) }) +
    perto(272) +
    perto(488) +
    // orelha e cabeça
    E(640, 238, 26, 40, sombra, { rot: -18 }) +
    E(640, 242, 13, 24, '#FFAEC0', { rot: -18, sw: 0 }) +
    E(690, 282, 92, 72, corpo, { rot: -8 }) +
    E(770, 316, 70, 54, creme) +
    E(690, 296, 64, 42, corpo, { sw: 0 }) +
    eye(688, 262, 0.58) +
    L('M660, 214 Q688 200 716 214', { sw: o(0.8) }) +
    cheek(732, 340, 22) +
    Ci(800, 300, 6, casco, { sw: 0 }) +
    L('M752 348 Q778 366 806 348', { sw: o(0.8) })
  );
}

module.exports = { elefante, umElefante, doisElefantes, cincoElefantes, leao, girafa, coruja, pomba, pinguim, ovelha, camelo };
