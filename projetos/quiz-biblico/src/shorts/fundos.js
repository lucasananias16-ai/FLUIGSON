'use strict';
/**
 * Fundos em pé (1080 x 1920) para os Shorts, no mesmo traço dos vídeos.
 * O alto fica livre para o selo e a pergunta; o meio, para os cards; embaixo
 * ficam a Tuti e o relógio.
 */
const { o, withOutline, P, E, Ci, R, L, sparkle } = require('../kit');
const { skyCloud, TRACO } = require('../art/cenario');
const noel = require('../art/noel');

/** Varal de luzinhas de Natal atravessando a tela na altura `y`. */
function luzinhas(y) {
  let s = L(`M-20 ${y} Q270 ${y + 70} 540 ${y + 10} Q810 ${y - 50} 1100 ${y + 30}`, { color: '#3B3548', sw: o(0.5) });
  const cores = ['#E25A52', '#FFD23F', '#4DA3FF', '#5DBB7A', '#FF8FB1'];
  for (let i = 0; i < 12; i++) {
    const x = 30 + i * 90;
    const k = x / 1080;
    const yy = k < 0.5 ? y + 70 * Math.sin(Math.PI * k * 2) * 0.55 + 10 * k : y + 10 - 60 * Math.sin(Math.PI * (k - 0.5) * 2) * 0.6 + 40 * (k - 0.5);
    s += E(x, yy + 22, 13, 18, cores[i % 5], { sw: o(0.5) });
  }
  return s;
}

/** Cozinha de Natal (Vídeo 11). */
function cozinha() {
  return withOutline(TRACO, () => {
    let s = R(0, 0, 1080, 1920, 0, '#FFEFD6', { sw: 0 });
    s += R(0, 1420, 1080, 140, 0, '#FBD9B0', { sw: 0 }) + L('M0 1420 L1080 1420', { color: '#FFFFFF', sw: o(2.4) });
    s += luzinhas(14);
    s += P('M-20 1640 L1100 1640 L1100 1940 L-20 1940Z', '#C98A4B');
    s += L('M-20 1730 L1100 1730 M-20 1820 L1100 1820 M300 1640 L270 1940 M800 1640 L820 1940', { color: '#A66A34', sw: o(0.7) });
    return s;
  });
}

/** Dia de neve (vídeos de Natal ao ar livre). */
function neve() {
  return withOutline(TRACO, () => {
    let s = R(0, 0, 1080, 1920, 0, '#C4E1FF', { sw: 0 });
    s += E(540, 1500, 900, 400, '#E2F0FF', { sw: 0 });
    s += skyCloud(160, 820, 0.7) + skyCloud(930, 880, 0.6);
    s += noel.pinheiro(990, 1600, 0.45) + noel.pinheiro(90, 1620, 0.35);
    s += P('M-20 1560 Q300 1500 600 1540 Q900 1580 1100 1520 L1100 1940 L-20 1940Z', '#E4EFFB');
    s += P('M-20 1780 Q400 1740 800 1776 Q1000 1790 1100 1770 L1100 1940 L-20 1940Z', '#FFFFFF');
    s += sparkle(300, 1820, 12, 0, '#B9D0EA') + sparkle(820, 1860, 10, 14, '#B9D0EA');
    return s;
  });
}

/** Céu de dia com gramado (quiz bíblico e vídeos ao ar livre). */
function pasto() {
  return withOutline(TRACO, () => {
    let s = R(0, 0, 1080, 1920, 0, '#BDE5FF', { sw: 0 });
    s += skyCloud(170, 830, 0.7) + skyCloud(920, 900, 0.6);
    s += P('M-20 1540 Q300 1480 600 1520 Q900 1560 1100 1500 L1100 1940 L-20 1940Z', '#8FD18A');
    s += P('M-20 1760 Q400 1720 800 1756 Q1000 1770 1100 1750 L1100 1940 L-20 1940Z', '#6FBF6A');
    s += Ci(130, 1820, 14, '#FFD23F', { sw: o(0.6) }) + Ci(930, 1850, 12, '#FF8FB1', { sw: o(0.6) });
    return s;
  });
}

module.exports = { cozinha, neve, pasto };
