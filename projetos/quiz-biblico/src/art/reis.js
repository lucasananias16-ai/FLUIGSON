'use strict';
/**
 * Desenhos e cenários do Vídeo 23: os Reis Magos e a Estrela. O deserto à
 * noite com a estrela grande, a palmeira, os três reis magos, as coroas, os
 * presentes coloridos e o menino Jesus. As cenas têm os mesmos nomes e `id`
 * das do Vídeo 4 (art/noel.js).
 */
const { n, o, withOutline, P, E, Ci, R, L, G, tube, sparkle, shadow } = require('../kit');
const { place, TRACO } = require('./cenario');
const pessoas = require('./pessoas');
const animais = require('./animais');
const objetos = require('./objetos');
const { tuti } = require('../tuti');

const CEU = '#3B4A8F';
const AREIA = '#E8C27A';
const AREIA_ESC = '#D9A95B';

// ------------------------------------------------------------ desenhos de card (prancheta 1000 x 1000)
/** Coroa; `cor` e `escuro` são o metal (dourada por padrão). */
function coroaCor(cor = '#FFD23F', escuro = '#F4B824') {
  return () =>
    shadow(500, 800, 300) +
    P('M200 760 L200 340 L360 520 L500 260 L640 520 L800 340 L800 760Z', cor) +
    R(200, 680, 600, 90, 20, escuro) +
    Ci(360, 724, 26, '#E25A52') + Ci(500, 724, 30, '#FFFFFF') + Ci(640, 724, 26, '#5DBB7A') +
    Ci(200, 330, 30, '#E25A52') + Ci(500, 250, 34, '#FFFFFF') + Ci(800, 330, 30, '#5DBB7A');
}
const coroa = coroaCor();
const coroaAzul = coroaCor('#4DA3FF', '#2E86E6');
/** Presente de uma cor só, com fita e laço. */
const presenteCor = (cor, escuro, fita = '#FFFFFF') => () => objetos.caixa(500, 800, 440, 360, cor, escuro, fita, true);
const PRES = { azul: presenteCor('#4DA3FF', '#2E86E6', '#FFD23F'), vermelho: presenteCor('#E25A52', '#C2443D', '#FFD23F'), amarelo: presenteCor('#FFD23F', '#F4B824', '#E25A52') };
/** Rei mago: túnica da cor `cor`, coroa e um presente na mão. */
const TUNICAS = { roxo: ['#8B5FD0', '#6F45B5'], verde: ['#3CA567', '#2F8F5A'], vermelho: ['#E25A52', '#C2443D'] };
const PELES = { roxo: ['#F2C49B', '#DFA57A', '#8A5A2B'], verde: ['#C68E5E', '#A8734A', '#3B2A22'], vermelho: ['#8D5A3A', '#744629', '#2A1D18'] };
function reiMago(qual = 'roxo') {
  const [robe, robeDark] = TUNICAS[qual];
  const [skin, skinShade, hairColor] = PELES[qual];
  return () =>
    pessoas.reiDavi({ robe, robeDark, skin, skinShade, hairColor, hairShade: hairColor, back: '', armR: [640, 600], armL: [360, 600] }) +
    G('translate(410,560) scale(0.18)', withOutline(o(1 / 0.18), PRES.amarelo));
}
/** Palmeira; (cx, base) é o pé. */
const palmeira = (cx, base, s = 1) =>
  G(`translate(${cx},${base}) scale(${s})`, withOutline(o(1 / s), () => {
    let f = tube('M0 0 Q30 -200 0 -420', 54, '#A66A34') + L('M-22 -80 L26 -90 M-18 -180 L30 -190 M-20 -280 L24 -292', { color: '#8F5A2E', sw: o(1) });
    for (const [a, len] of [[-150, 260], [-110, 240], [-60, 250], [-25, 270], [200, 240]]) {
      const r = (a * Math.PI) / 180;
      const x = Math.cos(r) * len;
      const y = -420 + Math.sin(r) * len * 0.75 + 70;
      f += P(`M0 -420 Q${n(x * 0.5)} ${n(-420 + (y + 420) * 0.5 - 110)} ${n(x)} ${n(y)} Q${n(x * 0.45)} ${n(-420 + (y + 420) * 0.5 - 30)} 0 -420Z`, '#3F9E60');
    }
    return f + Ci(-16, -410, 24, '#8F5A2E') + Ci(22, -404, 22, '#8F5A2E');
  }));
/** Moita do deserto, na frente do pé da palmeira: é atrás dela que a coroa se esconde. */
const moita = (cx, base) => P(`M${cx - 190} ${base} C${cx - 220} ${base - 150} ${cx - 90} ${base - 230} ${cx - 20} ${base - 170} C${cx + 30} ${base - 260} ${cx + 180} ${base - 200} ${cx + 190} ${base}Z`, '#4FAE62') + L(`M${cx - 100} ${base - 60} Q${cx - 80} ${base - 120} ${cx - 40} ${base - 130} M${cx + 60} ${base - 70} Q${cx + 80} ${base - 130} ${cx + 120} ${base - 130}`, { color: '#3F9E60', sw: o(1.2) });
/** O painel do "o que falta": o céu da noite no deserto, sem a estrela grande. */
function noiteSemEstrela() {
  return (
    R(90, 90, 820, 820, 60, CEU, { sw: 0 }) +
    [[220, 240], [760, 300], [300, 480], [700, 520], [180, 620]].map(([x, y], i) => sparkle(x, y, 16, i * 14, '#FFFFFF')).join('') +
    P('M90 760 Q300 660 520 740 Q720 800 910 700 L910 910 L90 910Z', AREIA, { sw: 0 }) +
    G('translate(560,560) scale(0.3)', withOutline(o(1 / 0.3), animais.camelo))
  );
}
/** A estrela grande que entra no céu na resposta (mesmas coordenadas do painel). */
const estrelaCai = () => G('translate(330,130) scale(0.34)', withOutline(o(1 / 0.34), objetos.estrela));
const meninoJesus = objetos.manjedouraBebe;

// ------------------------------------------------------------ cenários (1920 x 1080)
const sobre = (fn, cx, base, s) => place(fn, cx - 500 * s, base - 900 * s, s);
/** O deserto à noite: o céu azul-escuro com estrelinhas, a estrela grande (`sol`) e as dunas. */
function deserto({ estrela = true } = {}) {
  let s = R(0, 0, 1920, 1080, 0, CEU, { sw: 0 });
  s += E(960, 700, 1700, 380, '#5362A8', { sw: 0 });
  s += `<g id="nv1">${[[300, 200], [620, 320], [980, 170], [1300, 300]].map(([x, y], i) => sparkle(x, y, 14 + (i % 2) * 6, i * 17, '#FFFFFF')).join('')}</g>`;
  s += `<g id="nv2">${[[460, 420], [1180, 440], [1560, 250], [820, 470]].map(([x, y], i) => sparkle(x, y, 12 + (i % 2) * 5, i * 11, '#FFF6C8')).join('')}</g>`;
  s += estrela ? `<g id="sol">${G('translate(1640,90) scale(0.2)', withOutline(o(1 / 0.2), objetos.estrela))}</g>` : '<g id="sol"></g>';
  s += P('M-20 800 Q360 700 760 790 Q1160 880 1520 770 Q1740 710 1940 780 L1940 1100 L-20 1100Z', AREIA_ESC);
  s += P('M-20 900 Q480 830 960 880 Q1480 930 1940 860 L1940 1100 L-20 1100Z', AREIA);
  s += L('M300 960 Q360 940 420 960 M1100 1000 Q1160 980 1220 1000 M1560 950 Q1620 930 1680 950', { color: AREIA_ESC, sw: o(1.2) });
  return s;
}
/** Fundo das cenas de cards: o deserto sem a estrela grande (ela ficaria atrás do relógio e dos cards). */
const fundoNeve = () => withOutline(TRACO, () => deserto({ estrela: false }) + '<g id="neveF"></g>');
const flocos = () => '';

/** Onde a coroa se esconde (desafio "achar"): atrás da moita, ao pé da palmeira (`arvoreEsc`). */
const ESCONDERIJO = { x: 1300, dx: 190, chao: 960, s: 0.22, arvore: { x: 1300, y: 980 } };
function cenaAchar() {
  return withOutline(TRACO, () => {
    const E_ = ESCONDERIJO;
    let s = deserto();
    s += palmeira(E_.arvore.x - 60, E_.arvore.y - 20, 1.1);
    // uma ponta da coroa fica de fora, à direita da moita: é a pista
    s += `<g id="oculta">${sobre(coroa, E_.x + E_.dx, E_.chao, E_.s)}</g>`;
    s += `<g id="arvoreEsc">${moita(E_.arvore.x, E_.arvore.y)}</g>`;
    return s;
  });
}

/** Contar: cinco camelos em fila nas dunas (ids p1 a p5). */
const RENAS_X = [760, 960, 1160, 1360, 1560];
function cenaRenas() {
  return withOutline(TRACO, () => {
    let s = deserto({ estrela: false });
    s += palmeira(1800, 900, 0.8);
    RENAS_X.forEach((x, i) => {
      s += `<g id="p${i + 1}">${sobre(animais.camelo, x, 960 + (i % 2 ? 20 : 0), 0.21)}</g>`;
    });
    return s;
  });
}

/**
 * Comparar — "qual é o menor?": a resposta (`ca`, GRANDE no código das cenas)
 * é o presente pequeno, à esquerda; o grande (`ov`, PEQUENO) fica à direita.
 */
const CHAO = 1000;
const GRANDE = { x: 900, s: 0.3 };
const PEQUENO = { x: 1430, s: 0.7 };
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = deserto({ estrela: false });
    s += `<g id="ov">${sobre(PRES.azul, PEQUENO.x, CHAO + 60, PEQUENO.s)}</g>`;
    s += `<g id="ca">${sobre(PRES.vermelho, GRANDE.x, CHAO + 26, GRANDE.s)}</g>`;
    return s;
  });
}

/** Encerramento: os três reis e os camelos (`o1`), o menino Jesus (`o2`) e a estrela brilhando. */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = deserto();
    s += palmeira(1840, 900, 0.9);
    s += `<g id="o2">${sobre(meninoJesus, 1620, 1010, 0.3)}</g>`;
    s += `<g id="o1">${sobre(animais.camelo, 760, 960, 0.26)}${sobre(reiMago('roxo'), 980, 1010, 0.34)}${sobre(reiMago('verde'), 1170, 1010, 0.34)}${sobre(reiMago('vermelho'), 1360, 1010, 0.34)}</g>`;
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau', { gorro: true }));
    return s;
  });
}
const cenaAbertura = cenaEncerramento;

module.exports = { coroa, coroaCor, coroaAzul, presenteCor, PRES, reiMago, palmeira, noiteSemEstrela, estrelaCai, meninoJesus, deserto, fundoNeve, flocos, cenaAbertura, cenaAchar, cenaRenas, cenaComparar, cenaEncerramento, ESCONDERIJO, RENAS_X, CHAO, GRANDE, PEQUENO };
