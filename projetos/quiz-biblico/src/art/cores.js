'use strict';
/**
 * Desenhos e cenário do Vídeo 7: o mundo cinza que se pinta. O campo é
 * desenhado em camadas; cada camada existe em cinza e, por cima, em cor
 * (grupo `c_<cor>`, que a animação faz aparecer quando a cor é dita).
 */
const { n, o, withOutline, P, E, Ci, R, L, G, tube, cloud, sparkle, eye, cheek, shadow } = require('../kit');
const { sun, skyCloud, tree, bush, tuft, place, TRACO, CORES } = require('./cenario');
const { tuti } = require('../tuti');

const { SKY, GRASS_FAR, GRASS, GRASS_NEAR } = CORES;
const FOLHA = '#5DBB7A';

// ------------------------------------------------------------ frutas e tintas (prancheta 1000 x 1000)
const cabinho = (x, y) => tube(`M${x} ${y} Q${x + 10} ${y - 60} ${x + 40} ${y - 90}`, 16, '#8F5A2E') + P(`M${x + 20} ${y - 60} C${x + 90} ${y - 130} ${x + 170} ${y - 90} ${x + 180} ${y - 50} C${x + 110} ${y - 20} ${x + 50} ${y - 30} ${x + 20} ${y - 60}Z`, FOLHA);

function maca() {
  return shadow(500, 880, 260) + P('M500 330 C380 250 200 320 200 540 C200 740 340 880 500 850 C660 880 800 740 800 540 C800 320 620 250 500 330Z', '#E25A52') + E(340, 470, 50, 90, '#F29088', { sw: 0, rot: 20 }) + cabinho(500, 330);
}
function morango() {
  const sementes = [[400, 480], [500, 440], [600, 480], [440, 580], [560, 580], [500, 690], [380, 600], [620, 600]].map(([x, y]) => E(x, y, 12, 18, '#FFE680', { sw: 0 })).join('');
  return shadow(500, 880, 230) + P('M500 860 C340 760 230 560 270 400 C320 300 680 300 730 400 C770 560 660 760 500 860Z', '#E25A52') + sementes + P('M300 380 L400 300 L460 360 L500 270 L540 360 L600 300 L700 380 Q500 440 300 380Z', FOLHA);
}
function banana() {
  const d = 'M230 330 C250 600 480 800 780 760 C820 750 830 700 800 690 C580 690 420 540 330 310 C300 280 240 290 230 330Z';
  return shadow(520, 860, 300) + P(d, '#FFD23F') + L('M300 400 C380 600 540 720 760 726', { color: '#E8B93F', sw: o(0.9) }) + P('M230 330 C240 290 300 280 330 310 L300 250 L250 260Z', '#8F5A2E');
}
function laranja() {
  return shadow(500, 880, 250) + Ci(500, 570, 300, '#FF9838') + E(380, 450, 60, 90, '#FFC078', { sw: 0, rot: 25 }) + [0, 1, 2, 3, 4].map((i) => Ci(430 + i * 34, 640 + (i % 2) * 30, 6, '#E07A20', { sw: 0 })).join('') + cabinho(500, 280);
}
function uvas() {
  const pos = [[380, 420], [500, 400], [620, 420], [320, 530], [440, 530], [560, 530], [680, 530], [380, 640], [500, 640], [620, 640], [440, 750], [560, 750], [500, 850]];
  return shadow(500, 930, 220) + cabinho(500, 330) + pos.map(([x, y]) => Ci(x, y, 68, '#9B7EDE') + Ci(x - 20, y - 22, 16, '#C9B4F2', { sw: 0 })).join('');
}
function borboleta(cor = '#FF9838') {
  const asa = (sx) => P(`M500 500 C${500 + sx * 120} 260 ${500 + sx * 400} 260 ${500 + sx * 360} 480 C${500 + sx * 420} 700 ${500 + sx * 160} 760 500 560Z`, cor) + Ci(500 + sx * 250, 430, 46, '#FFE680', { sw: o(0.6) }) + Ci(500 + sx * 230, 610, 30, '#FFE680', { sw: o(0.6) });
  return asa(-1) + asa(1) + E(500, 520, 34, 150, '#3D2C4E') + L('M490 380 Q450 300 420 290 M510 380 Q550 300 580 290', { sw: o(0.9) });
}
/** Mancha de tinta de uma cor. */
function mancha(cor) {
  const d = 'M500 180 C640 120 720 260 820 300 C940 350 900 520 840 600 C900 720 760 860 640 800 C560 900 380 880 340 780 C200 800 100 660 190 560 C90 440 200 280 320 300 C340 200 420 160 500 180Z';
  return P(d, cor) + E(380, 380, 70, 44, '#FFFFFF', { sw: 0, opacity: 0.35, rot: -30 }) + Ci(840, 780, 44, cor) + Ci(170, 300, 34, cor);
}
/** Pote de tinta de uma cor, com a tinta escorrendo. */
function pote(cor) {
  return (
    shadow(500, 880, 280) +
    P('M270 380 L730 380 L700 860 Q500 900 300 860Z', '#F7F3EA') +
    P('M290 560 L710 560 L700 760 Q500 790 300 760Z', cor, { sw: o(0.8) }) +
    E(500, 380, 240, 60, cor) +
    P('M300 400 C300 520 360 520 370 440 C380 520 430 500 420 400Z', cor) +
    L('M270 380 L730 380', { sw: o(1) })
  );
}

/** Camaleão Leo, pintado de `cor`. Sem recortes, para poder mudar de cor a cada quadro. */
function camaleao(cor = '#B9B9C6', escura = null) {
  const esc = escura || 'rgba(61,44,78,.18)';
  return (
    shadow(500, 880, 300) +
    // rabo enrolado
    `<path d="M300 690 C140 700 110 540 220 510 C310 490 340 590 270 600" fill="none" stroke="#3D2C4E" stroke-width="${n(54 + 2 * o(1))}" stroke-linecap="round"/><path d="M300 690 C140 700 110 540 220 510 C310 490 340 590 270 600" fill="none" stroke="${cor}" stroke-width="54" stroke-linecap="round"/>` +
    // patas
    R(360, 740, 70, 120, 28, cor) + R(600, 740, 70, 120, 28, cor) +
    // corpo e crista
    P('M300 520 L350 430 L410 500 L470 410 L530 490 L590 420 L640 520Z', cor) +
    E(500, 640, 250, 150, cor) +
    E(500, 700, 200, 70, esc, { sw: 0 }) +
    // cabeça
    P('M600 520 C640 380 820 380 860 500 C900 560 880 640 800 660 C700 680 620 640 600 520Z', cor) +
    Ci(760, 500, 78, cor) + eye(770, 500, 0.62) +
    L('M720 600 Q790 640 860 590', { sw: o(0.9) }) +
    cheek(700, 590, 22) +
    Ci(430, 600, 22, esc, { sw: 0 }) + Ci(520, 580, 16, esc, { sw: 0 }) + Ci(360, 660, 16, esc, { sw: 0 })
  );
}

// ------------------------------------------------------------ o campo que se pinta (1920 x 1080)
const FILTRO = '<filter id="cinza" x="-5%" y="-5%" width="110%" height="110%"><feColorMatrix type="saturate" values="0"/></filter>';
/** Uma camada do campo: em cinza e, por cima, em cor (invisível até a cor ser dita, ou já visível se estiver em `pintadas`). */
const camada = (cor, arte, pintadas) => `<g filter="url(#cinza)">${arte}</g><g id="c_${cor}" style="opacity:${pintadas.includes(cor) ? 1 : 0}">${arte}</g>`;

/** Onde fica cada coisa que ganha cor, para o splash e os brilhos: centro e tamanho. */
const ALVOS = { red: [640, 800, 150], yellow: [1650, 230, 170], blue: [960, 300, 500], green: [1000, 900, 520], orange: [1180, 820, 150], purple: [1560, 800, 170] };

/**
 * O campo. `pintadas` lista as cores que já voltaram; as outras partes ficam
 * cinza, cada uma com o seu grupo `c_<cor>` para a animação pintar.
 */
function campo({ pintadas = [], comTuti = false } = {}) {
  return withOutline(TRACO, () => {
    const ceu = R(0, 0, 1920, 1080, 0, SKY, { sw: 0 }) + E(960, 720, 1400, 300, '#DDF3FF', { sw: 0 });
    const sol = sun(1650, 230, 96);
    const verde =
      P('M-20 650 Q280 480 660 620 Q960 500 1380 610 Q1680 520 1940 610 L1940 1100 L-20 1100Z', GRASS_FAR) +
      tree(118, 680, 0.95) + bush(1010, 650, 0.9) +
      P('M-20 770 Q480 700 960 748 Q1480 800 1940 730 L1940 1100 L-20 1100Z', GRASS) +
      tuft(840, 800) + tuft(1840, 800) + tuft(300, 830) +
      P('M-20 970 Q520 900 1040 968 Q1500 1016 1940 950 L1940 1100 L-20 1100Z', GRASS_NEAR);
    let s = FILTRO;
    s += camada('blue', ceu, pintadas);
    s += `<g filter="url(#cinza)">${skyCloud(520, 200, 0.95)}${skyCloud(1180, 150, 0.8)}</g>`;
    s += camada('yellow', sol, pintadas);
    s += camada('green', verde, pintadas);
    s += camada('red', place(maca, 640 - 150, 800 - 190, 0.3) + place(maca, 520, 870, 0.14), pintadas);
    s += camada('orange', place(laranja, 1180 - 150, 820 - 170, 0.3) + place(() => borboleta(), 900, 420, 0.16), pintadas);
    s += camada('purple', place(uvas, 1560 - 150, 800 - 190, 0.3) + [[1320, 1010], [1760, 1030], [760, 1040]].map(([x, y]) => [0, 1, 2, 3, 4].map((i) => Ci(x + Math.cos(i * 1.257) * 14, y + Math.sin(i * 1.257) * 14, 11, '#9B7EDE', { sw: o(0.55) })).join('') + Ci(x, y, 8, '#FFD23F', { sw: o(0.5) })).join(''), pintadas);
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau', { boina: true }));
    return s;
  });
}

module.exports = { maca, morango, banana, laranja, uvas, borboleta, mancha, pote, camaleao, campo, ALVOS };
