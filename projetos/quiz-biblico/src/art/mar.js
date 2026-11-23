'use strict';
/**
 * Desenhos e cenários do Vídeo 13: Jonas e o grande peixe. A praia, o mar, o
 * fundo do mar e os bichos do mar, no mesmo traço dos outros vídeos. As cenas
 * têm os mesmos nomes e os mesmos `id` das do Vídeo 4 (art/noel.js), para as
 * cenas animadas serem as mesmas com outro cenário.
 */
const { n, o, withOutline, P, E, Ci, R, L, G, tube, sparkle, shadow, cloud } = require('../kit');
const { place, skyCloud, sun, TRACO } = require('./cenario');
const pessoas = require('./pessoas');
const objetos = require('./objetos');
const noel = require('./noel');
const { tuti } = require('../tuti');

const AZUL = '#4DA3FF';
const MAR = '#3E8FE0';
const MAR_CLARO = '#7DC1F5';
const AREIA = '#F6D99A';
const AREIA_ESC = '#E8C27A';

// ------------------------------------------------------------ desenhos de card (prancheta 1000 x 1000)
/** O grande peixe: azul, enorme e sorridente. */
function grandePeixe() {
  const corpo = 'M140 520 C140 330 330 240 520 250 C700 260 800 380 800 520 C800 660 700 770 520 780 C330 790 140 700 140 520Z';
  return (
    shadow(480, 900, 340) +
    P('M780 520 C850 420 900 360 960 330 C940 440 940 600 960 710 C900 680 850 620 780 520Z', '#2E86E6') +
    P('M450 260 C480 170 560 140 630 160 C600 200 590 240 600 280Z', '#2E86E6') +
    P(corpo, AZUL) +
    P('M170 600 C260 730 420 770 560 760 C680 750 770 680 790 600 C640 660 380 680 170 600Z', '#CFE6FF', { sw: o(0.8) }) +
    P('M480 560 C520 620 600 640 640 600 C600 600 540 590 480 560Z', '#2E86E6', { sw: o(0.8) }) +
    Ci(300, 440, 46, '#FFFFFF') +
    Ci(310, 444, 24, '#3D2C4E', { sw: 0 }) +
    Ci(300, 432, 8, '#FFFFFF', { sw: 0 }) +
    L('M160 560 Q230 600 300 570', { sw: o(1.1) }) +
    E(380, 540, 30, 18, '#FF9E8A', { sw: 0, opacity: 0.8 }) +
    Ci(560, 200, 16, '#CFE6FF', { sw: o(0.6) }) +
    Ci(610, 130, 22, '#CFE6FF', { sw: o(0.6) })
  );
}
/** Peixinho; `cor` é a cor do corpo. */
function peixinho(cor = AZUL) {
  return (
    shadow(500, 880, 230) +
    P('M690 500 L870 360 L870 640Z', cor) +
    P('M200 500 C200 360 340 290 480 290 C620 290 720 380 740 500 C720 620 620 710 480 710 C340 710 200 640 200 500Z', cor) +
    P('M430 300 C460 230 540 220 580 260 C540 290 520 300 500 320Z', cor) +
    L('M520 360 Q560 500 520 640 M600 380 Q640 500 600 620', { color: '#FFFFFF', sw: o(1.2), opacity: 0.6 }) +
    Ci(340, 450, 40, '#FFFFFF') +
    Ci(348, 454, 20, '#3D2C4E', { sw: 0 }) +
    L('M240 540 Q290 580 340 550', { sw: o(1) })
  );
}
function estrelaMar() {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? 150 : 360;
    d += `${i ? 'L' : 'M'}${n(500 + r * Math.cos(a))} ${n(520 + r * Math.sin(a))} `;
  }
  return (
    shadow(500, 900, 300) +
    `<path d="${d}Z" fill="#FF8A6B" stroke="#3D2C4E" stroke-width="${n(o(1))}" stroke-linejoin="round"/>` +
    [[500, 300], [700, 450], [620, 700], [380, 700], [300, 450], [500, 520]].map(([x, y]) => Ci(x, y, 18, '#FFD0BF', { sw: 0 })).join('') +
    Ci(460, 480, 14, '#3D2C4E', { sw: 0 }) + Ci(540, 480, 14, '#3D2C4E', { sw: 0 }) + L('M470 550 Q500 575 530 550', { sw: o(0.9) })
  );
}
function concha() {
  return (
    shadow(500, 880, 300) +
    P('M500 220 C720 220 860 420 820 640 L560 820 L440 820 L180 640 C140 420 280 220 500 220Z', '#FFD0E0') +
    L('M500 230 L500 810 M500 230 L330 790 M500 230 L670 790 M500 230 L230 680 M500 230 L770 680', { color: '#E89AB6', sw: o(1.1) }) +
    P('M420 800 L580 800 L560 880 L440 880Z', '#F7B6CC')
  );
}
/** Nuvem escura com raio e chuva. */
function tempestade() {
  return (
    L('M300 640 L260 760 M420 660 L380 800 M600 660 L560 800 M720 640 L680 760', { color: AZUL, sw: o(2.2) }) +
    P('M520 560 L420 740 L500 740 L440 900 L640 680 L550 680 L620 560Z', '#FFD23F') +
    G('translate(500,420)', cloud([[-220, 40, 120], [-90, -60, 160], [80, -40, 150], [220, 50, 110], [0, 80, 140]], { fill: '#8A93A8', shade: '#6B7489' }))
  );
}
/** Um pedaço de praia: céu, sol, mar e areia, dentro do card. */
function praia() {
  return (
    R(80, 80, 840, 840, 60, '#BDE5FF', { sw: 0 }) +
    sun(760, 250, 80) +
    P('M80 520 Q300 480 500 520 Q700 560 920 510 L920 720 L80 720Z', MAR) +
    L('M140 580 Q190 560 240 580 M480 600 Q530 580 580 600 M720 570 Q770 550 820 570', { color: '#FFFFFF', sw: o(1.2) }) +
    P('M80 700 Q500 640 920 700 L920 920 L80 920Z', AREIA) +
    place(estrelaMar, 220, 680, 0.2) + place(concha, 600, 720, 0.16)
  );
}
function montanha() {
  return (
    R(80, 80, 840, 840, 60, '#CFE6FF', { sw: 0 }) +
    P('M80 860 L380 300 L520 520 L640 380 L920 860Z', '#8E7CC3') +
    P('M380 300 L300 450 Q340 430 380 460 Q420 430 450 450Z', '#FFFFFF', { sw: o(0.8) }) +
    P('M640 380 L590 470 Q620 455 645 475 Q670 455 690 470Z', '#FFFFFF', { sw: o(0.8) }) +
    P('M80 860 Q500 800 920 860 L920 920 L80 920Z', '#8FD18A')
  );
}
function nuvem() {
  return (
    sparkle(200, 230, 30, 0, '#FFD23F') + sparkle(820, 760, 26, 10, '#FFD23F') +
    G('translate(500,500)', cloud([[-240, 40, 130], [-100, -70, 170], [90, -50, 160], [240, 50, 120], [0, 90, 150]]))
  );
}
/** A grande cidade (Nínive): muralha, torres e casinhas. */
function cidade() {
  return (
    shadow(500, 900, 380) +
    R(200, 360, 140, 500, 14, '#F2C879') + R(660, 320, 150, 540, 14, '#F2C879') +
    P('M190 370 L270 260 L350 370Z', '#E25A52') + P('M650 330 L735 210 L820 330Z', '#E25A52') +
    R(330, 500, 340, 360, 14, '#E8A66B') + P('M310 510 L500 380 L690 510Z', '#C2543F') +
    R(450, 700, 100, 160, 50, '#8F5A2E') +
    R(240, 440, 60, 70, 10, '#FFE27A') + R(705, 420, 60, 70, 10, '#FFE27A') + R(380, 560, 60, 60, 10, '#FFE27A') + R(560, 560, 60, 60, 10, '#FFE27A') +
    R(120, 780, 760, 90, 12, '#D9B384') + L('M200 780 L200 870 M320 780 L320 870 M440 780 L440 870 M560 780 L560 870 M680 780 L680 870 M800 780 L800 870', { color: '#B98F5E', sw: o(0.8) })
  );
}
/** Três pinheiros: a floresta. */
const floresta = () => shadow(500, 900, 380) + G('scale(1)', noel.pinheiro(300, 880, 0.75) + noel.pinheiro(700, 880, 0.8) + noel.pinheiro(500, 900, 0.95));
/** Jonas, no mesmo traço do Noé e do Davi. */
const jonas = (over = {}) => pessoas.person(Object.assign({ robe: '#4DA3FF', robeDark: '#2E86E6', sash: '#8F5A2E', hair: 'curto', hairColor: '#5A3A28', hairShade: '#7A5540', beard: 'curta' }, over));

// ------------------------------------------------------------ cenários (1920 x 1080)
/** Praia: céu, sol, mar até `horiz` e a areia a partir de `areia`. */
function praiaCena({ horiz = 560, areia = 860 } = {}) {
  let s = R(0, 0, 1920, 1080, 0, '#BDE5FF', { sw: 0 });
  s += E(960, horiz, 1500, 220, '#DDF1FF', { sw: 0 });
  s += `<g id="sol">${sun(1700, 180, 80)}</g>`;
  s += `<g id="nv1">${skyCloud(480, 160, 0.8)}</g><g id="nv2">${skyCloud(1240, 120, 0.7)}</g>`;
  s += P(`M-20 ${horiz} Q480 ${horiz - 20} 960 ${horiz} Q1440 ${horiz + 20} 1940 ${horiz} L1940 ${areia + 40} L-20 ${areia + 40}Z`, MAR);
  s += P(`M-20 ${horiz + 120} Q480 ${horiz + 90} 960 ${horiz + 120} Q1440 ${horiz + 150} 1940 ${horiz + 120} L1940 ${areia + 40} L-20 ${areia + 40}Z`, MAR_CLARO, { sw: 0, opacity: 0.35 });
  for (let i = 0; i < 9; i++) {
    const x = 120 + i * 220;
    const y = horiz + 50 + (i % 3) * 70;
    s += L(`M${x} ${y} Q${x + 40} ${y - 18} ${x + 80} ${y}`, { color: '#FFFFFF', sw: o(1.1), opacity: 0.8 });
  }
  s += P(`M-20 ${areia} Q500 ${areia - 40} 1000 ${areia} Q1500 ${areia + 30} 1940 ${areia - 20} L1940 1100 L-20 1100Z`, AREIA);
  s += P(`M-20 ${areia + 8} Q500 ${areia - 32} 1000 ${areia + 8}`, 'none', { stroke: '#FFFFFF', sw: o(2) });
  s += place(concha, 1500, 960, 0.08) + place(estrelaMar, 860, 990, 0.08) + E(400, 1010, 60, 12, AREIA_ESC, { sw: 0 }) + E(1300, 1040, 80, 14, AREIA_ESC, { sw: 0 });
  return s;
}
const sobre = (fn, cx, base, s) => place(fn, cx - 500 * s, base - 900 * s, s);

/** Fundo das cenas de cards: a praia. */
const fundoNeve = () => withOutline(TRACO, () => praiaCena() + '<g id="neveF"></g>');
/** Na praia não neva: existe só para as cenas terem a mesma forma das do Vídeo 4. */
const flocos = () => '';

/** Abertura: a praia, o barco no mar no mar. */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = praiaCena();
    s += `<g id="o1">${sobre(objetos.barco, 1180, 720, 0.34)}</g>`;
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau'));
    return s;
  });
}

/** Onde o grande peixe se esconde (desafio 1): atrás da pedra no mar (`arvoreEsc`). */
const ESCONDERIJO = { x: 1240, chao: 780, s: 0.34, arvore: { x: 1250, y: 790 } };
const pedraMar = (cx, base) =>
  P(`M${cx - 260} ${base} C${cx - 250} ${base - 200} ${cx - 130} ${base - 330} ${cx + 10} ${base - 320} C${cx + 160} ${base - 310} ${cx + 260} ${base - 180} ${cx + 270} ${base}Z`, '#9A93A8') +
  P(`M${cx - 120} ${base - 260} C${cx - 60} ${base - 300} ${cx + 20} ${base - 300} ${cx + 60} ${base - 280}`, 'none', { stroke: '#BDB7C9', sw: o(2) }) +
  E(cx - 120, base - 120, 40, 26, '#5DBB7A', { sw: o(0.6) }) + E(cx + 150, base - 60, 50, 30, '#5DBB7A', { sw: o(0.6) }) +
  P(`M${cx - 300} ${base} Q${cx} ${base - 30} ${cx + 310} ${base} Q${cx} ${base + 24} ${cx - 300} ${base}Z`, '#FFFFFF', { sw: 0, opacity: 0.7 });
function cenaAchar() {
  return withOutline(TRACO, () => {
    const E_ = ESCONDERIJO;
    let s = praiaCena();
    s += sobre(objetos.barco, 700, 690, 0.22);
    // o rabo fica de fora, à direita da pedra: é a pista
    s += `<g id="oculta">${sobre(grandePeixe, E_.x + 200, E_.chao, E_.s)}</g>`;
    s += `<g id="arvoreEsc">${pedraMar(E_.arvore.x, E_.arvore.y)}</g>`;
    return s;
  });
}

/** Desafio 2 — Contar: três sóis no céu, um para cada dia (ids p1 a p3). */
const RENAS_X = [640, 1000, 1360];
function cenaRenas() {
  return withOutline(TRACO, () => {
    let s = praiaCena();
    s = s.replace(/<g id="sol">.*?<\/g><g id="nv1">/s, '<g id="nv1">');
    RENAS_X.forEach((x, i) => {
      s += `<g id="p${i + 1}">${sun(x, 380, 90)}${Ci(x - 30, 370, 10, '#3D2C4E', { sw: 0 })}${Ci(x + 30, 370, 10, '#3D2C4E', { sw: 0 })}${L(`M${x - 28} 405 Q${x} 428 ${x + 28} 405`, { sw: o(0.9) })}</g>`;
    });
    s += sobre(peixinho, 1350, 760, 0.12);
    return s;
  });
}

/** Desafio 7 — Comparar: no fundo do mar, o peixinho (`ov`, à esquerda) e o grande peixe (`ca`, à direita). */
const CHAO = 960;
const PEQUENO = { x: 880, s: 0.26 };
const GRANDE = { x: 1400, s: 0.72 };
function fundoMar() {
  let s = R(0, 0, 1920, 1080, 0, '#2F7FD0', { sw: 0 });
  s += E(960, 0, 1400, 500, '#5BA8EE', { sw: 0, opacity: 0.7 });
  s += [[300, 300, 18], [360, 220, 12], [1700, 260, 16], [1660, 180, 10], [1100, 140, 12]].map(([x, y, r]) => Ci(x, y, r, '#CFE6FF', { sw: o(0.6), opacity: 0.9 })).join('');
  s += tube('M160 980 Q130 860 170 760 Q200 680 160 600', 26, '#3F9E60') + tube('M1820 990 Q1850 880 1810 780 Q1780 700 1820 620', 26, '#3F9E60') + tube('M1720 990 Q1700 900 1730 820', 22, '#5DBB7A');
  s += P(`M-20 ${CHAO - 30} Q500 ${CHAO - 60} 1000 ${CHAO - 30} Q1500 ${CHAO} 1940 ${CHAO - 40} L1940 1100 L-20 1100Z`, AREIA);
  s += place(concha, 1150, 1010, 0.07) + place(estrelaMar, 600, 1020, 0.08);
  return s;
}
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = fundoMar();
    s += `<g id="ov">${sobre(() => peixinho('#FF8A3A'), PEQUENO.x, CHAO, PEQUENO.s)}</g>`;
    s += `<g id="ca">${sobre(grandePeixe, GRANDE.x, CHAO, GRANDE.s)}</g>`;
    return s;
  });
}

/** Encerramento: a praia, a cidade de Nínive no alto, Jonas (`pa`) na areia e o grande peixe (`o1`) se despedindo no mar. */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = praiaCena();
    s += sobre(cidade, 1640, 640, 0.34);
    s += `<g id="o1">${sobre(grandePeixe, 1080, 800, 0.36)}</g>`;
    s += `<g id="pa">${place(() => jonas({ armR: [756, 470] }), 1380, 560, 0.42)}</g>`;
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau'));
    return s;
  });
}

module.exports = { praiaCena, grandePeixe, peixinho, estrelaMar, concha, tempestade, praia, montanha, nuvem, cidade, floresta, jonas, fundoNeve, flocos, fundoMar, cenaAbertura, cenaAchar, cenaRenas, cenaComparar, cenaEncerramento, ESCONDERIJO, RENAS_X, CHAO, PEQUENO, GRANDE };
