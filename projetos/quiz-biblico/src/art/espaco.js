'use strict';
/**
 * Cenários e personagens do Vídeo 6: a viagem de foguete da Tuti. Cenas em
 * 1920 x 1080, de noite, no mesmo traço dos outros vídeos.
 *
 * Os elementos que a animação mexe ficam em grupos com `id`.
 */
const { n, o, withOutline, P, E, Ci, R, L, G, tube, clipD, sparkle, eye, cheek, shadow } = require('../kit');
const { place, TRACO } = require('./cenario');
const { ceuNoite } = require('./natal');
const { tuti } = require('../tuti');

const CHAO_LONGE = '#3E4F8F';
const CHAO = '#4A5FA8';
const CHAO_PERTO = '#5B72C0';

/** Robô Bip: copiloto simpático, com antena, olhos grandes e um coração de luz. Prancheta 1000 x 1000. */
function bip({ acena = true } = {}) {
  const corpo = '#DCE4F2';
  const escuro = '#AEBBD6';
  const azul = '#4DA3FF';
  return (
    shadow(500, 900, 230) +
    // pernas e pés
    tube('M430 760 L430 850 M570 760 L570 850', 44, escuro) +
    R(376, 836, 110, 54, 24, azul) +
    R(514, 836, 110, 54, 24, azul) +
    // braços
    tube('M330 560 Q250 620 262 720', 40, escuro) +
    Ci(262, 730, 34, azul) +
    (acena ? tube('M670 560 Q760 520 770 410', 40, escuro) + Ci(772, 398, 34, azul) : tube('M670 560 Q750 620 738 720', 40, escuro) + Ci(738, 730, 34, azul)) +
    // corpo
    R(320, 480, 360, 300, 70, corpo) +
    clipD('M320 700 L680 700 L680 800 L320 800Z', R(320, 480, 360, 300, 70, escuro, { sw: 0 })) +
    R(320, 480, 360, 300, 70, 'none') +
    R(400, 540, 200, 130, 30, '#2B3A67') +
    P('M500 640 C440 600 452 560 500 586 C548 560 560 600 500 640Z', '#FF8FB1', { sw: o(0.6) }) +
    Ci(420, 720, 16, '#FFD23F', { sw: o(0.6) }) +
    Ci(470, 720, 16, '#5DBB7A', { sw: o(0.6) }) +
    // antena e cabeça
    L('M500 200 L500 130', { sw: o(1.2) }) +
    Ci(500, 110, 30, '#E25A52') +
    R(290, 190, 420, 290, 90, corpo) +
    R(250, 290, 50, 100, 20, azul) +
    R(700, 290, 50, 100, 20, azul) +
    R(330, 236, 340, 200, 60, '#2B3A67') +
    eye(430, 330, 0.6) +
    eye(570, 330, 0.6) +
    L('M462 400 Q500 426 538 400', { color: '#FFFFFF', sw: o(0.9) })
  );
}

/** Foguete grande, com janela. `chama` liga o fogo. Prancheta 1000 x 1000; a base fica em y = 700. */
function foguete({ chama = false } = {}) {
  const corpo = 'M500 60 C640 180 670 430 650 700 L350 700 C330 430 360 180 500 60Z';
  return (
    (chama ? P('M410 720 Q500 1060 590 720Z', '#FF8A3A') + P('M450 720 Q500 920 550 720Z', '#FFD23F', { sw: 0 }) : '') +
    P('M352 540 C260 570 214 660 210 780 L360 710Z', '#E25A52') +
    P('M648 540 C740 570 786 660 790 780 L640 710Z', '#E25A52') +
    R(390, 690, 220, 56, 20, '#9AA3B8') +
    P(corpo, '#F7F3EA') +
    clipD(corpo, P('M300 40 L700 40 L700 250 Q500 290 300 250Z', '#E25A52', { sw: 0 }) + P('M540 60 C680 200 700 460 690 720 L720 720 L720 60Z', '#DDD5C5', { sw: 0 }) + R(300, 590, 400, 40, 0, '#4DA3FF', { sw: 0 })) +
    L(corpo) +
    Ci(500, 400, 92, '#2B3A67') +
    Ci(500, 400, 70, '#7CCBFF') +
    Ci(474, 374, 22, '#D6F0FF', { sw: 0 })
  );
}

/** Planeta com anel. */
const planeta = (x, y, r, cor, anel) =>
  Ci(x, y, r, cor) +
  E(x - r * 0.3, y - r * 0.3, r * 0.3, r * 0.2, '#FFFFFF', { sw: 0, opacity: 0.35, rot: -30 }) +
  (anel ? `<ellipse cx="${x}" cy="${y}" rx="${n(r * 1.7)}" ry="${n(r * 0.42)}" fill="none" stroke="#3D2C4E" stroke-width="${n(o(2.2))}" transform="rotate(-18 ${x} ${y})"/><ellipse cx="${x}" cy="${y}" rx="${n(r * 1.7)}" ry="${n(r * 0.42)}" fill="none" stroke="${anel}" stroke-width="${n(o(1))}" transform="rotate(-18 ${x} ${y})"/>` : '');

/** Lua pequena no céu, com crateras. */
const luaCeu = (x, y, r) => Ci(x, y, r, '#F4F1DE') + Ci(x - r * 0.3, y - r * 0.2, r * 0.2, '#DDD9C2', { sw: o(0.5) }) + Ci(x + r * 0.3, y + r * 0.3, r * 0.14, '#DDD9C2', { sw: o(0.5) }) + Ci(x + r * 0.25, y - r * 0.4, r * 0.1, '#DDD9C2', { sw: o(0.5) });

const chao = () =>
  P('M-20 880 Q500 800 1000 850 Q1500 900 1940 820 L1940 1100 L-20 1100Z', CHAO_LONGE) +
  P('M-20 950 Q480 900 960 936 Q1480 968 1940 916 L1940 1100 L-20 1100Z', CHAO) +
  P('M-20 1040 Q520 1000 1040 1036 Q1500 1066 1940 1026 L1940 1100 L-20 1100Z', CHAO_PERTO);

/** Céu de noite com a Lua e planetas ao longe e o chão embaixo: fundo das lições e dos jogos. */
function fundo({ limpo = false } = {}) {
  return withOutline(TRACO, () => {
    let s = ceuNoite();
    if (!limpo) s += luaCeu(1740, 250, 80) + planeta(150, 300, 44, '#FF8FB1', '#FFD23F');
    s += chao();
    return s;
  });
}

/** Abertura e final: a base de lançamento, com o foguete (`fog`, com a chama em `chama`) e o Bip (`bip`). */
function cenaBase({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = ceuNoite() + luaCeu(1740, 230, 80) + planeta(180, 300, 44, '#FF8FB1', '#FFD23F');
    s += chao();
    // torre e plataforma
    s += R(1560, 420, 36, 520, 10, '#8A93AD') + L('M1560 500 L1596 560 M1596 620 L1560 680 M1560 740 L1596 800', { color: '#5E6785', sw: o(0.7) }) + R(1430, 470, 150, 22, 8, '#8A93AD');
    s += R(1120, 920, 520, 44, 16, '#8A93AD');
    s += `<g id="fog"><g id="chama" style="opacity:0">${place(() => P('M410 720 Q500 1060 590 720Z', '#FF8A3A') + P('M450 720 Q500 920 550 720Z', '#FFD23F', { sw: 0 }), 1380 - 500 * 0.72, 930 - 746 * 0.72, 0.72)}</g>${place(foguete, 1380 - 500 * 0.72, 930 - 746 * 0.72, 0.72)}</g>`;
    s += `<g id="bip">${place(bip, 900 - 500 * 0.42, 990 - 890 * 0.42, 0.42)}</g>`;
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau', { capacete: true }));
    return s;
  });
}

/** Chegada: a superfície da Lua, a Terra no céu, o foguete pousado e o Bip. */
function cenaLua({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = R(0, 0, 1920, 1080, 0, '#1B2247', { sw: 0 });
    const pts = [[140, 120, 16], [420, 250, 12], [760, 110, 14], [1010, 300, 10], [1290, 130, 16], [1780, 150, 14], [300, 420, 10], [1180, 470, 10], [560, 40, 10], [1560, 420, 12]];
    s += pts.map(([x, y, r], i) => sparkle(x, y, r, i * 17, '#FFFFFF')).join('');
    // a Terra
    s += Ci(1600, 260, 120, '#4DA3FF') + clipD('M1480 260 a120 120 0 1 0 240 0 a120 120 0 1 0 -240 0', P('M1500 200 Q1560 160 1600 220 Q1640 260 1580 300 Q1520 300 1500 200Z', '#5DBB7A', { sw: 0 }) + P('M1640 300 Q1700 280 1720 340 Q1680 380 1640 300Z', '#5DBB7A', { sw: 0 }) + E(1560, 330, 60, 14, '#FFFFFF', { sw: 0, opacity: 0.6 })) + Ci(1600, 260, 120, 'none');
    // o chão da Lua
    s += P('M-20 760 Q480 660 960 720 Q1480 780 1940 690 L1940 1100 L-20 1100Z', '#CFCBB8');
    s += P('M-20 900 Q520 840 1040 890 Q1500 930 1940 870 L1940 1100 L-20 1100Z', '#E4E0CC');
    s += E(600, 800, 110, 26, '#B5B19E') + E(1700, 940, 130, 30, '#C9C5B0') + E(1050, 1000, 90, 20, '#C9C5B0') + E(320, 990, 70, 16, '#C9C5B0');
    s += `<g id="fog2">${place(foguete, 1300 - 500 * 0.62, 850 - 746 * 0.62, 0.62)}</g>`;
    // bandeirinha
    s += L('M960 880 L960 700', { sw: o(1.1) }) + P('M960 700 L1060 730 L960 764Z', '#FFD23F');
    s += `<g id="bip2">${place(bip, 760 - 500 * 0.42, 990 - 890 * 0.42, 0.42)}</g>`;
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau', { capacete: true }));
    return s;
  });
}

/** Estrela dourada simples, para contar (centro em x, y). */
const estrelinha = (x, y, r) => sparkle(x, y, r, 0, '#FFD23F');

module.exports = { bip, foguete, planeta, luaCeu, fundo, cenaBase, cenaLua, estrelinha };
