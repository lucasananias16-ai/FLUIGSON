'use strict';
/**
 * Desenhos e cenários do Vídeo 20: o Natal no Polo Norte. O gelo com a aurora
 * no céu, o iglu, o urso-polar, a foca, o pinguim de cachecol, a casinha do
 * Papai Noel (com e sem chaminé), o saco de presentes, o balde, o aquário, o
 * maiô, o floco de neve e os cards do céu (aurora, arco-íris e fogos).
 * As cenas têm os mesmos nomes e `id` das do Vídeo 4 (art/noel.js).
 */
const { n, o, withOutline, P, E, Ci, R, L, G, tube, sparkle, shadow } = require('../kit');
const { place, TRACO } = require('./cenario');
const animais = require('./animais');
const objetos = require('./objetos');
const ceuNatal = require('./ceuNatal');
const noel = require('./noel');
const { tuti } = require('../tuti');

const NEVE = '#FFFFFF';
const NEVE_SOMBRA = '#DCE8F7';
const GELO = '#BFE3F5';
const GELO_ESC = '#8CC8E8';
const AGUA = '#4E8FD6';

// ------------------------------------------------------------ desenhos de card (prancheta 1000 x 1000)
/** Floco de neve grande (branco com contorno, sobre o card). */
function floco() {
  const segs = [];
  for (let k = 0; k < 6; k++) {
    const t = ((k * 60 - 90) * Math.PI) / 180;
    const ux = Math.cos(t);
    const uy = Math.sin(t);
    segs.push(`M500 500 L${n(500 + ux * 330)} ${n(500 + uy * 330)}`);
    const bx = 500 + ux * 190;
    const by = 500 + uy * 190;
    for (const s of [-1, 1]) {
      const tt = t + (s * Math.PI) / 3.4;
      segs.push(`M${n(bx)} ${n(by)} L${n(bx + Math.cos(tt) * 120)} ${n(by + Math.sin(tt) * 120)}`);
    }
  }
  const d = segs.join(' ');
  return tube(d, o(5), '#3D2C4E') + tube(d, o(3), '#7CC4F2') + Ci(500, 500, 40, '#FFFFFF');
}
/** Iglu de blocos de gelo com a entrada escura; (500, 860) é o chão. */
function iglu() {
  const cupula = 'M150 860 Q150 330 500 320 Q850 330 850 860Z';
  const blocos = [460, 560, 660, 760].map((y) => `M150 ${y} L850 ${y}`).join(' ') +
    ' M500 330 L500 460 M330 460 L330 560 M670 460 L670 560 M240 560 L240 660 M440 560 L440 660 M600 560 L600 660 M780 560 L780 660 M330 660 L330 760 M520 660 L520 760 M700 660 L700 760';
  return (
    shadow(500, 870, 400) +
    P(cupula, '#FFFFFF') +
    `<clipPath id="igluC"><path d="${cupula}"/></clipPath><g clip-path="url(#igluC)">${L(blocos, { color: '#B9D3EE', sw: o(1.1) })}${P('M600 320 Q850 330 850 860 L720 860 Q720 420 560 330Z', NEVE_SOMBRA, { sw: 0, opacity: 0.8 })}</g>` +
    P(cupula, 'none') +
    P('M600 860 L600 700 Q700 600 800 700 L800 860Z', '#FFFFFF') +
    P('M630 860 L630 720 Q700 650 770 720 L770 860Z', '#3E5A86')
  );
}
/** Urso-polar de quatro patas, de lado, olhando para a frente. */
function ursoPolar() {
  return (
    shadow(500, 860, 380) +
    [290, 420, 630, 750].map((x) => R(x - 46, 620, 92, 230, 40, '#F4F4F8')).join('') +
    E(520, 560, 300, 180, '#F7F7FB') +
    E(600, 520, 160, 90, '#FFFFFF', { sw: 0, opacity: 0.7 }) +
    Ci(240, 470, 120, '#FFFFFF') +
    Ci(170, 370, 38, '#FFFFFF') + Ci(300, 362, 38, '#FFFFFF') + Ci(170, 370, 18, '#E6DDEB', { sw: 0 }) + Ci(300, 362, 18, '#E6DDEB', { sw: 0 }) +
    E(190, 520, 70, 50, '#FFFFFF') + E(160, 500, 22, 16, '#3D2C4E') +
    Ci(210, 450, 14, '#3D2C4E', { sw: 0 }) + Ci(280, 445, 14, '#3D2C4E', { sw: 0 }) +
    Ci(265, 500, 18, '#FFC2D1', { sw: 0, opacity: 0.8 }) +
    L('M160 540 Q190 560 215 545', { sw: o(1) })
  );
}
/** Foca cinzenta deitada, com bigodes e nadadeiras. */
function foca() {
  return (
    shadow(500, 860, 360) +
    P('M760 760 L900 680 L880 780 L930 860 L770 820Z', '#8A93A8') +
    P('M200 600 C200 470 300 400 400 420 C520 450 600 560 780 700 C820 760 800 840 700 850 L320 850 C250 850 200 760 200 600Z', '#A7B0C4') +
    P('M300 840 C300 760 360 730 420 760 C440 800 420 840 400 850Z', '#8A93A8') +
    E(470, 760, 180, 60, '#C7CEDC', { sw: 0, opacity: 0.8 }) +
    Ci(285, 520, 16, '#3D2C4E', { sw: 0 }) + Ci(365, 515, 16, '#3D2C4E', { sw: 0 }) + Ci(280, 514, 5, '#FFFFFF', { sw: 0 }) + Ci(360, 509, 5, '#FFFFFF', { sw: 0 }) +
    E(320, 572, 50, 34, '#C7CEDC') + E(320, 556, 18, 12, '#3D2C4E') +
    L('M290 580 L200 560 M290 592 L200 600 M350 580 L440 560 M350 592 L440 600', { sw: o(0.8) }) +
    Ci(250, 560, 16, '#FFC2D1', { sw: 0, opacity: 0.7 }) + Ci(400, 556, 16, '#FFC2D1', { sw: 0, opacity: 0.7 })
  );
}
/** Pinguim de cachecol; `cor` é a cor do cachecol. */
const pinguimCachecol = (cor = '#4DA3FF') => () =>
  animais.pinguim() +
  P('M300 520 Q500 590 700 520 L690 590 Q500 650 310 590Z', cor) +
  P('M560 590 L620 600 L640 760 L560 740Z', cor) +
  L('M580 640 L630 650 M585 690 L635 700', { color: '#FFFFFF', sw: o(1.2) });
/** O pinguim do canal com cachecol azul. */
const pinguim = pinguimCachecol('#4DA3FF');

/** Casinha do Papai Noel no gelo; `chamine` põe a chaminé no telhado. (500, 880) é o chão. */
function casinhaNoel({ chamine = true } = {}) {
  let s = shadow(500, 885, 380);
  if (chamine) s += chamineTopo();
  s += R(220, 520, 560, 360, 12, '#C2543F');
  s += L('M220 600 L780 600 M220 680 L780 680 M220 760 L780 760 M220 840 L780 840', { color: '#A3412F', sw: o(0.8) });
  s += P('M160 540 L500 260 L840 540Z', '#7A4A2B');
  s += P('M160 540 L500 260 L840 540 Q700 500 500 520 Q300 500 160 540Z', '#FFFFFF');
  s += R(420, 680, 160, 200, 14, '#7A4A2B') + Ci(550, 790, 10, '#FFD23F', { sw: o(0.5) });
  s += R(260, 620, 120, 100, 10, '#FFE27A') + L('M320 620 L320 720 M260 670 L380 670', { sw: o(0.7) });
  s += R(620, 620, 120, 100, 10, '#FFE27A') + L('M680 620 L680 720 M620 670 L740 670', { sw: o(0.7) });
  s += Ci(500, 420, 40, '#2F8F5A') + Ci(500, 420, 18, '#C2543F', { sw: 0 });
  s += P('M140 880 Q500 840 860 880 L860 900 L140 900Z', '#FFFFFF');
  return s;
}
/** A chaminé do telhado da casinha, com a fumacinha (mesmas coordenadas da casinha). */
const chamineTopo = () =>
  R(610, 290, 90, 190, 6, '#8F5A5A') + R(595, 280, 120, 40, 8, '#FFFFFF') +
  P('M650 250 C620 230 640 190 670 200 C680 160 740 170 740 210 C780 210 780 260 740 262Z', '#F2F0F8', { sw: o(0.7) });
/** O painel do "o que falta": a casinha na neve, sem a chaminé, com a aurora no céu. */
function casinhaSemChamine() {
  return (
    R(90, 90, 820, 820, 60, '#5B5FA8', { sw: 0 }) +
    auroraFaixas(120, 140, 760, 0.6) +
    P('M90 760 Q500 720 910 760 L910 910 L90 910Z', '#FFFFFF') +
    G('translate(100,90) scale(0.8)', withOutline(o(1 / 0.8), () => casinhaNoel({ chamine: false })))
  );
}
/** A chaminé que entra no telhado na resposta (mesma escala do painel). */
const chamineCai = () => G('translate(100,90) scale(0.8)', withOutline(o(1 / 0.8), chamineTopo));

/** Saco vermelho de presentes, cheio, com um laço. */
function sacoPresentes() {
  return (
    shadow(500, 880, 330) +
    R(330, 230, 140, 140, 10, '#4DA3FF') + R(520, 210, 150, 150, 10, '#FFD23F') + L('M400 230 L400 370 M595 210 L595 360', { color: '#E25A52', sw: o(3) }) +
    P('M300 380 Q500 330 700 380 C820 520 820 820 700 870 Q500 900 300 870 C180 820 180 520 300 380Z', '#E25A52') +
    P('M330 380 Q500 420 670 380 L650 440 Q500 470 350 440Z', '#C2443D') +
    tube('M430 440 Q500 480 570 440', 26, '#FFD23F') + Ci(500, 460, 30, '#FFD23F') +
    E(420, 620, 50, 120, '#F07B73', { sw: 0, opacity: 0.6, rot: 15 })
  );
}
/** Balde de praia azul com alça. */
function balde() {
  return (
    shadow(500, 870, 260) +
    P('M330 360 Q500 120 670 360', 'none', { stroke: '#3D2C4E', sw: o(4) }) +
    P('M330 360 Q500 120 670 360', 'none', { stroke: '#FFD23F', sw: o(2.2) }) +
    P('M280 380 L720 380 L660 860 L340 860Z', '#4DA3FF') +
    E(500, 380, 220, 50, '#2E86E6') +
    R(300, 520, 400, 60, 6, '#FFD23F', { sw: o(0.8) })
  );
}
/** Aquário redondo com um peixinho. */
function aquario() {
  return (
    shadow(500, 880, 280) +
    Ci(500, 540, 320, '#CFEAFF') +
    P('M200 600 Q500 560 800 600 Q780 820 500 860 Q220 820 200 600Z', '#7CC4F2', { sw: 0, opacity: 0.8 }) +
    E(500, 250, 170, 40, '#E8F5FF') +
    G('translate(390,560) scale(0.24)', withOutline(o(1 / 0.24), () => require('./mar').peixinho('#FFA53A'))) +
    Ci(640, 520, 18, '#FFFFFF', { sw: o(0.6) }) + Ci(670, 460, 12, '#FFFFFF', { sw: o(0.6) }) +
    P('M330 840 Q500 870 670 840 L640 880 L360 880Z', '#F6D99A', { sw: o(0.8) }) +
    E(380, 420, 40, 90, '#FFFFFF', { sw: 0, opacity: 0.6, rot: 25 })
  );
}
/** Maiô listrado. */
function maio() {
  const d = 'M350 180 L410 180 Q430 330 500 330 Q570 330 590 180 L650 180 Q660 420 720 560 Q640 800 560 840 L440 840 Q360 800 280 560 Q340 420 350 180Z';
  return (
    shadow(500, 870, 260) +
    P(d, '#FF8FB1') +
    `<clipPath id="maioC"><path d="${d}"/></clipPath><g clip-path="url(#maioC)">${[460, 560, 660, 760].map((y) => R(200, y, 600, 40, 0, '#FFFFFF', { sw: 0 })).join('')}</g>` +
    P(d, 'none') +
    Ci(500, 400, 34, '#FFD23F')
  );
}
/** Faixas da aurora (verde e roxa), de `x` a `x + w`, a partir de `y`. `a` é a opacidade. */
function auroraFaixas(x, y, w, a = 0.7) {
  // cada faixa afina nas duas pontas (sem cantos retos)
  const faixa = (dy, cor, alt) =>
    `<path d="M${x} ${y + dy} C${n(x + w * 0.25)} ${y + dy - 40} ${n(x + w * 0.5)} ${y + dy + 90} ${n(x + w)} ${y + dy + 40} C${n(x + w * 0.75)} ${y + dy + 10 + alt * 1.6} ${n(x + w * 0.3)} ${y + dy - 40 + alt * 1.6} ${x} ${y + dy}Z" fill="${cor}" opacity="${a}"/>`;
  return faixa(0, '#7CF0B4', 70) + faixa(60, '#B48CF2', 60) + faixa(120, '#5FD6C8', 40);
}
/** Card da aurora: o céu da noite com as faixas coloridas. */
function aurora() {
  return (
    R(130, 150, 740, 680, 60, '#34498F') +
    auroraFaixas(130, 220, 740, 0.9) + auroraFaixas(130, 400, 740, 0.75) +
    [[230, 220], [700, 200], [400, 640], [780, 600], [560, 300]].map(([x, y], i) => sparkle(x, y, 16, i * 15, '#FFF6C8')).join('') +
    P('M130 760 Q500 700 870 760 L870 830 L130 830Z', '#FFFFFF')
  );
}
/** Card dos fogos de artifício no céu da noite. */
function fogos() {
  const estouro = (cx, cy, r, cor) => {
    let d = '';
    for (let k = 0; k < 12; k++) {
      const t = (k / 12) * Math.PI * 2;
      d += `M${n(cx + Math.cos(t) * r * 0.3)} ${n(cy + Math.sin(t) * r * 0.3)} L${n(cx + Math.cos(t) * r)} ${n(cy + Math.sin(t) * r)} `;
    }
    return tube(d, o(3.6), cor) + Ci(cx, cy, r * 0.16, '#FFFFFF', { sw: 0 });
  };
  return R(130, 150, 740, 680, 60, '#34498F') + estouro(360, 380, 150, '#FFD23F') + estouro(650, 330, 120, '#FF8FB1') + estouro(560, 620, 130, '#7CF0B4');
}
const arcoIris = objetos.arcoIris;
const gorro = objetos.gorroNoel;

// ------------------------------------------------------------ cenários (1920 x 1080)
const sobre = (fn, cx, base, s) => place(fn, cx - 500 * s, base - 900 * s, s);
/** O gelo do Polo Norte: céu do fim de tarde com a aurora, o mar gelado com icebergs e a neve. */
function polo() {
  let s = R(0, 0, 1920, 1080, 0, '#8EA6E6', { sw: 0 });
  s += E(960, 640, 1700, 360, '#C9D3F5', { sw: 0 });
  s += `<g id="nv1">${auroraFaixas(-200, 50, 1300, 0.55)}</g><g id="nv2">${auroraFaixas(700, 120, 1400, 0.45)}</g>`;
  // sem lua: ela aparecia por trás dos cards transparentes; o grupo `sol` fica vazio para as cenas animarem igual
  s += '<g id="sol"></g>';
  s += P('M-20 640 L1940 640 L1940 900 L-20 900Z', AGUA);
  s += P('M200 640 L260 540 L330 560 L400 640Z', GELO) + P('M1180 640 L1250 500 L1300 520 L1380 470 L1460 640Z', GELO) + P('M1250 500 L1300 520 L1290 640 L1230 640Z', GELO_ESC, { sw: 0 });
  s += L('M100 700 Q140 690 180 700 M600 720 Q640 710 680 720 M1500 700 Q1540 690 1580 700', { color: '#CFE6FF', sw: o(1.1) });
  s += P('M-20 860 Q480 800 960 836 Q1480 870 1940 820 L1940 1100 L-20 1100Z', NEVE);
  s += P('M-20 1030 Q520 990 1040 1026 Q1500 1056 1940 1016 L1940 1100 L-20 1100Z', NEVE_SOMBRA);
  s += sparkle(560, 1040, 12, 0, '#FFFFFF') + sparkle(1420, 1050, 10, 14, '#B9D0EA') + sparkle(980, 760, 10, 30, '#FFFFFF');
  return s;
}
/** Fundo das cenas de cards: o gelo com a aurora, com a neve caindo de leve. */
const fundoNeve = () => withOutline(TRACO, () => polo() + '<g id="neveF"></g>');
const flocos = (t) => noel.flocos(t, 24);

/** Abertura: o gelo, a casinha do Papai Noel, o iglu e os bichinhos (`o1`). */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = polo();
    s += `<g id="o1">${sobre(() => casinhaNoel(), 1250, 960, 0.6)}${sobre(iglu, 1720, 990, 0.42)}${sobre(pinguim, 880, 1010, 0.22)}${sobre(ursoPolar, 1600, 1060, 0.3)}</g>`;
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau', { gorro: true }));
    return s;
  });
}

/** Onde o pinguim se esconde (desafio 1): atrás do iglu (`arvoreEsc`). */
const ESCONDERIJO = { x: 1300, dx: 245, chao: 1000, s: 0.3, arvore: { x: 1300, y: 1010 } };
function cenaAchar() {
  return withOutline(TRACO, () => {
    const E_ = ESCONDERIJO;
    let s = polo();
    s += sobre(() => casinhaNoel(), 1790, 960, 0.36);
    // a ponta da asinha fica de fora, à direita do iglu: é a pista
    s += `<g id="oculta">${sobre(pinguim, E_.x + E_.dx, E_.chao, E_.s)}</g>`;
    s += `<g id="arvoreEsc">${sobre(iglu, E_.arvore.x, E_.arvore.y, 0.78)}</g>`;
    return s;
  });
}

/** Desafio 2 — Contar: o pinguim e cinco peixinhos no gelo (ids p1 a p5). */
const RENAS_X = [760, 960, 1160, 1360, 1560];
function cenaRenas() {
  const mar = require('./mar');
  return withOutline(TRACO, () => {
    let s = polo();
    s += sobre(pinguim, 1780, 1000, 0.3);
    RENAS_X.forEach((x, i) => {
      s += `<g id="p${i + 1}">${sobre(() => mar.peixinho('#FFA53A'), x, 970 + (i % 2 ? 20 : 0), 0.17)}</g>`;
    });
    return s;
  });
}

/** Desafio 6 — Comparar: o urso grande (`ca`, à esquerda) e o pequeno (`ov`, à direita). */
const CHAO = 1000;
const GRANDE = { x: 900, s: 0.62 };
const PEQUENO = { x: 1450, s: 0.28 };
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = polo();
    s += `<g id="ov">${sobre(ursoPolar, PEQUENO.x, CHAO, PEQUENO.s)}</g>`;
    s += `<g id="ca">${sobre(ursoPolar, GRANDE.x, CHAO, GRANDE.s)}</g>`;
    return s;
  });
}

/** Encerramento: a casinha e os bichinhos (`o1`) e o trenó do Papai Noel (`o2`) voando sob a aurora. */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = polo();
    s += `<g id="o2">${G('translate(1080,250) scale(0.32)', withOutline(o(1 / 0.32), ceuNatal.trenoVoando))}</g>`;
    s += `<g id="o1">${sobre(() => casinhaNoel(), 1250, 960, 0.6)}${sobre(iglu, 1720, 990, 0.42)}${sobre(pinguim, 880, 1010, 0.22)}${sobre(ursoPolar, 1600, 1060, 0.3)}</g>`;
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau', { gorro: true }));
    return s;
  });
}

module.exports = { floco, iglu, ursoPolar, foca, pinguim, pinguimCachecol, casinhaNoel, casinhaSemChamine, chamineCai, sacoPresentes, balde, aquario, maio, aurora, fogos, arcoIris, gorro, fundoNeve, flocos, cenaAbertura, cenaAchar, cenaRenas, cenaComparar, cenaEncerramento, ESCONDERIJO, RENAS_X, CHAO, GRANDE, PEQUENO };
