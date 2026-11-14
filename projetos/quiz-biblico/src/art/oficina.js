'use strict';
/**
 * Brinquedos e cenários do Vídeo 8: a oficina dos duendes. As cenas têm os
 * mesmos nomes e os mesmos `id` das do Vídeo 4 (art/noel.js), para as cenas
 * animadas serem as mesmas com outro cenário.
 */
const { n, o, withOutline, P, E, Ci, R, L, G, tube, cloud, sparkle, eye, cheek, shadow } = require('../kit');
const { place, TRACO } = require('./cenario');
const pessoas = require('./pessoas');
const objetos = require('./objetos');
const { tuti } = require('../tuti');

// ------------------------------------------------------------ brinquedos (prancheta 1000 x 1000)
function ursinho() {
  const pelo = '#C98A4B';
  const claro = '#F2D9B0';
  return (
    shadow(500, 890, 250) +
    Ci(330, 250, 80, pelo) + Ci(330, 250, 40, claro, { sw: 0 }) + Ci(670, 250, 80, pelo) + Ci(670, 250, 40, claro, { sw: 0 }) +
    E(360, 820, 90, 60, pelo) + E(640, 820, 90, 60, pelo) +
    E(260, 620, 70, 110, pelo, { rot: 25 }) + E(740, 620, 70, 110, pelo, { rot: -25 }) +
    E(500, 660, 210, 220, pelo) + E(500, 690, 120, 130, claro, { sw: 0 }) +
    Ci(500, 370, 200, pelo) + E(500, 440, 90, 70, claro) +
    eye(420, 340, 0.5) + eye(580, 340, 0.5) + cheek(360, 430, 22) + cheek(640, 430, 22) +
    E(500, 410, 26, 18, '#3D2C4E', { sw: 0 }) + L('M470 456 Q500 480 530 456', { sw: o(0.8) }) +
    P('M430 540 L500 570 L570 540 L570 600 L500 574 L430 600Z', '#E25A52')
  );
}
function piao() {
  return (
    shadow(520, 890, 220) +
    R(476, 130, 48, 150, 18, '#8F5A2E') +
    P('M240 300 L760 300 C760 520 620 760 500 870 C380 760 240 520 240 300Z', '#E25A52') +
    P('M240 300 L760 300 L744 400 L256 400Z', '#FFD23F') +
    P('M290 500 L710 500 L670 580 L330 580Z', '#4DA3FF') +
    E(500, 300, 260, 50, '#FFE680') + sparkle(190, 220, 30, 0, '#FFD23F') + sparkle(830, 620, 26, 12, '#FFD23F')
  );
}
function trenzinho() {
  const roda = (x) => Ci(x, 780, 76, '#3B3548') + Ci(x, 780, 34, '#FFD23F', { sw: o(0.7) });
  return (
    shadow(500, 870, 400) +
    R(560, 330, 290, 400, 30, '#E25A52') + R(610, 390, 190, 150, 20, '#CFE6FF') + R(530, 290, 350, 60, 22, '#FFD23F') +
    R(140, 480, 460, 250, 60, '#4DA3FF') + R(230, 320, 90, 180, 16, '#3B3548') + R(200, 290, 150, 50, 18, '#FFD23F') +
    cloud([[300, 200, 40], [370, 150, 52], [450, 190, 38]], { fill: '#FFFFFF', shade: '#DCE4F2', sx: -4, sy: -6 }) +
    P('M140 700 L90 760 L160 760Z', '#FFD23F') + R(120, 700, 760, 50, 20, '#3B3548') +
    roda(260) + roda(500) + roda(740)
  );
}
function bola() {
  return shadow(500, 880, 260) + Ci(500, 540, 320, '#FFFFFF') + P('M500 220 C380 360 380 720 500 860 C620 720 620 360 500 220Z', '#E25A52') + P('M186 480 C320 420 420 420 500 480 C420 600 300 640 190 600Z', '#4DA3FF') + P('M814 480 C680 420 580 420 500 480 C580 600 700 640 810 600Z', '#FFD23F') + Ci(500, 540, 320, 'none') + E(380, 360, 50, 80, '#FFFFFF', { sw: 0, opacity: 0.5, rot: 30 });
}
const boneca = () => pessoas.person({ skin: '#F8D2AE', skinShade: '#EDB58A', robe: '#FF8FB1', robeDark: '#E86F95', sash: '#FFFFFF', hem: 790, hair: 'cachos', hairColor: '#F2CF72', hairShade: '#D9AE45', shoe: '#E25A52', hat: P('M-40 -190 L-120 -240 L-110 -150Z', '#E25A52') + P('M40 -190 L120 -240 L110 -150Z', '#E25A52') + Ci(0, -190, 26, '#E25A52') });
function carrinho() {
  const roda = (x) => Ci(x, 730, 96, '#3B3548') + Ci(x, 730, 42, '#DCE4F2', { sw: o(0.7) });
  return (
    shadow(500, 840, 400) +
    P('M120 700 L120 560 C120 520 150 500 200 496 L330 480 L420 330 C440 300 470 290 510 290 L680 290 C730 290 760 310 790 350 L860 480 C900 490 900 520 900 560 L900 700Z', '#5DBB7A') +
    P('M450 350 L560 350 L560 480 L370 480Z', '#CFE6FF') + P('M600 350 L700 350 C720 350 730 360 740 376 L800 480 L600 480Z', '#CFE6FF') +
    R(100, 660, 820, 60, 24, '#3B3548') + Ci(880, 580, 22, '#FFD23F', { sw: o(0.6) }) + roda(280) + roda(730)
  );
}
function vassoura() {
  return (
    shadow(520, 900, 240) +
    G('rotate(14 500 500)', tube('M500 110 L500 620', 34, '#C98A4B'), R(380, 600, 240, 70, 20, '#E25A52'), P('M370 660 L630 660 L690 900 L310 900Z', '#F2D06B'), L('M430 680 L400 890 M500 680 L500 896 M570 680 L600 890', { color: '#D9A93A', sw: o(0.8) }))
  );
}
/** Laço de presente de uma cor. */
function laco(cor) {
  return (
    shadow(500, 860, 260) +
    P('M500 520 L360 860 L460 800 L500 880 Z', cor) + P('M500 520 L640 860 L540 800 L500 880Z', cor) +
    P('M500 500 C360 300 140 280 130 480 C130 660 360 660 500 500Z', cor) + P('M500 500 C640 300 860 280 870 480 C870 660 640 660 500 500Z', cor) +
    L('M210 470 Q300 400 400 470 M790 470 Q700 400 600 470', { color: 'rgba(61,44,78,.25)', sw: o(1) }) +
    R(420, 420, 160, 160, 50, cor) + E(470, 470, 30, 20, '#FFFFFF', { sw: 0, opacity: 0.4 })
  );
}

// ------------------------------------------------------------ a oficina (1920 x 1080)
const PRESENTES = [
  ['#FFD23F', '#F4B824', '#E25A52'],
  ['#4DA3FF', '#2E86E6', '#FFFFFF'],
  ['#5DBB7A', '#3F9E60', '#FFD23F'],
  ['#9B7EDE', '#7F62C6', '#FFD23F'],
  ['#FF8FB1', '#E86F95', '#FFFFFF'],
];
const caixa = (cx, base, w, h, i) => objetos.caixa(cx, base, w, h, PRESENTES[i % 5][0], PRESENTES[i % 5][1], PRESENTES[i % 5][2]);
const mini = (fn, x, base, s) => place(fn, x - 500 * s, base - 890 * s, s);

/** A sala da oficina: parede de madeira, janela com neve, luzinhas, prateleira de brinquedos e o chão. */
function sala({ prateleira = true } = {}) {
  let s = R(0, 0, 1920, 1080, 0, '#F5E3C3', { sw: 0 });
  s += L('M0 260 L1920 260 M0 520 L1920 520', { color: '#E7CFA3', sw: o(0.8) });
  // janela
  s += R(1500, 250, 300, 250, 26, '#27386E') + E(1650, 470, 150, 40, '#E4EFFB', { sw: 0 }) + [[1560, 320], [1700, 300], [1640, 390], [1750, 400], [1580, 420]].map(([x, y]) => Ci(x, y, 7, '#FFFFFF', { sw: 0 })).join('') + R(1500, 250, 300, 250, 26, 'none') + L('M1650 250 L1650 500 M1500 375 L1800 375', { sw: o(1.1) });
  // luzinhas
  s += L('M-20 200 Q480 250 960 205 Q1440 165 1940 215', { sw: o(0.6) });
  for (let i = 0; i < 16; i++) {
    const x = 60 + i * 120;
    const y = 214 + 22 * Math.sin((i / 15) * Math.PI * 2) * (i < 8 ? 1 : -1) + (i < 8 ? 10 : -14);
    s += E(x, y + 18, 15, 21, ['#E25A52', '#FFD23F', '#5DBB7A', '#4DA3FF'][i % 4], { sw: o(0.6) });
  }
  if (prateleira) {
    s += R(560, 560, 820, 30, 10, '#B97A45');
    s += mini(bola, 660, 560, 0.15) + mini(piao, 820, 560, 0.16) + mini(trenzinho, 1010, 562, 0.2) + mini(carrinho, 1240, 566, 0.18);
  }
  s += P('M-20 860 L1940 860 L1940 1100 L-20 1100Z', '#C98A4B');
  s += L('M-20 940 L1940 940 M-20 1020 L1940 1020 M300 860 L260 1100 M900 860 L900 1100 M1500 860 L1560 1100', { color: '#A66A34', sw: o(0.7) });
  return s;
}

/** Fundo das cenas de cards: a sala sem a prateleira, para os cards não brigarem com os brinquedos. */
const fundoNeve = () => withOutline(TRACO, () => sala({ prateleira: false }));
/** Dentro da oficina não neva: fica aqui só para as cenas terem a mesma forma das do Vídeo 4. */
const flocos = () => '';

const pessoaEm = (id, fn, x, chao, s, cfg) => `<g id="${id}">${place(() => fn(cfg), x - 500 * s, chao - 905 * s, s)}</g>`;

/** Abertura: a oficina com o duende (`pa`), dois presentes (`o1`, `o2`) e o ursinho (`o3`). */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = sala();
    s += `<g id="o1">${caixa(1560, 960, 240, 210, 0)}</g><g id="o2">${caixa(1320, 980, 180, 150, 1)}</g>`;
    s += `<g id="o3">${mini(ursinho, 880, 980, 0.3)}</g>`;
    s += pessoaEm('pa', pessoas.duende, 1120, 990, 0.5, { armR: [756, 470] });
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau', { gorro: true }));
    return s;
  });
}

/** Onde o ursinho se esconde (desafio 1): atrás da caixa grande (`arvoreEsc`). */
const ESCONDERIJO = { x: 1240, chao: 960, s: 0.54, arvore: { x: 1240 } };
function cenaAchar() {
  return withOutline(TRACO, () => {
    const E_ = ESCONDERIJO;
    let s = sala();
    s += caixa(820, 960, 170, 140, 2) + caixa(1640, 960, 200, 230, 3) + mini(bola, 1000, 990, 0.16);
    s += `<g id="oculta">${mini(ursinho, E_.x, E_.chao, E_.s)}</g>`;
    s += `<g id="arvoreEsc">${caixa(E_.x, E_.chao, 380, 290, 0)}</g>`;
    return s;
  });
}

/** Desafio 2 — Contar: cinco presentes na esteira (ids p1 a p5). */
const RENAS_X = [700, 940, 1180, 1420, 1660];
const ALTURAS = [170, 220, 150, 200, 180];
function cenaRenas() {
  return withOutline(TRACO, () => {
    let s = sala({ prateleira: false });
    s += R(560, 800, 1400, 70, 30, '#6C7693') + R(560, 800, 1400, 22, 10, '#8A93AD', { sw: 0 }) + R(560, 800, 1400, 70, 30, 'none');
    for (let x = 620; x < 1920; x += 160) s += Ci(x, 846, 16, '#3B3548', { sw: o(0.6) });
    s += R(640, 870, 50, 150, 12, '#565F7A') + R(1700, 870, 50, 150, 12, '#565F7A');
    RENAS_X.forEach((x, i) => (s += `<g id="p${i + 1}">${caixa(x, 800, 170, ALTURAS[i], i)}</g>`));
    return s;
  });
}

/** Desafio 4 — Comparar: a caixa amarela pequena (`ov`) e a azul grandona (`ca`). */
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = sala({ prateleira: false });
    s += `<g id="ov">${caixa(800, 970, 170, 140, 0)}</g>`;
    s += `<g id="ca">${caixa(1330, 975, 460, 400, 1)}</g>`;
    return s;
  });
}

/** Encerramento: os presentes empilhados, o duende (`o1`), o ursinho (`o2`) e o Papai Noel (`pa`). */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = sala();
    s += caixa(820, 990, 260, 220, 1) + caixa(1040, 990, 190, 150, 3) + caixa(880, 770, 170, 130, 4) + caixa(1210, 990, 150, 190, 2);
    s += `<g id="o2">${mini(ursinho, 1010, 842, 0.2)}</g>`;
    s += `<g id="o1">${place(() => pessoas.duende({ armR: [756, 470] }), 1440 - 500 * 0.42, 995 - 905 * 0.42, 0.42)}</g>`;
    s += pessoaEm('pa', pessoas.papaiNoel, 1720, 1000, 0.56, { armR: [756, 470] });
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau', { gorro: true }));
    return s;
  });
}

module.exports = { ursinho, piao, trenzinho, bola, boneca, carrinho, vassoura, laco, caixa, sala, fundoNeve, flocos, cenaAbertura, cenaAchar, cenaRenas, cenaComparar, cenaEncerramento, ESCONDERIJO, RENAS_X, ALTURAS };
