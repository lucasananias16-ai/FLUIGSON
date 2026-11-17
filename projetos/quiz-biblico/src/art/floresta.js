'use strict';
/**
 * Desenhos e cenários do Vídeo 17: o Natal na Floresta. Os bichinhos amigos da
 * Tuti (coelho, esquilo e urso), as pinhas, o toco e a clareira com neve. As
 * cenas têm os mesmos nomes e `id` das do Vídeo 4 (art/noel.js).
 */
const { n, o, withOutline, P, E, Ci, R, L, G, tube, sparkle, shadow, cloud } = require('../kit');
const { place, TRACO } = require('./cenario');
const noel = require('./noel');
const objetos = require('./objetos');
const { tuti } = require('../tuti');

const olho = (x, y, r = 22) => Ci(x, y, r, '#3D2C4E', { sw: 0 }) + Ci(x - r * 0.3, y - r * 0.35, r * 0.32, '#FFFFFF', { sw: 0 });
const bochecha = (x, y) => E(x, y, 26, 16, '#FF9EB0', { sw: 0, opacity: 0.8 });

// ------------------------------------------------------------ os bichinhos (prancheta 1000 x 1000)
/** Coelhinho sentado; `cor` é a cor do pelo. */
function coelho(cor = '#FFFFFF') {
  const dentro = cor === '#FFFFFF' ? '#FFC4D3' : '#E8B98F';
  return (
    shadow(500, 900, 230) +
    Ci(690, 760, 60, '#FFFFFF') +
    E(500, 720, 210, 190, cor) +
    E(500, 760, 110, 110, '#FFFFFF', { sw: 0, opacity: cor === '#FFFFFF' ? 0 : 0.6 }) +
    E(380, 860, 80, 40, cor) + E(620, 860, 80, 40, cor) +
    E(420, 210, 55, 170, cor, { rot: -10 }) + E(420, 220, 25, 120, dentro, { sw: 0, rot: -10 }) +
    E(580, 210, 55, 170, cor, { rot: 10 }) + E(580, 220, 25, 120, dentro, { sw: 0, rot: 10 }) +
    Ci(500, 450, 175, cor) +
    olho(440, 430) + olho(560, 430) +
    P('M480 485 L520 485 L500 505Z', '#FF8FB1', { sw: o(0.6) }) +
    L('M500 505 Q480 530 460 520 M500 505 Q520 530 540 520', { sw: o(0.7) }) +
    bochecha(395, 490) + bochecha(605, 490)
  );
}
const coelhoCor = (cor) => () => coelho(cor);
/** Esquilo com o rabo grande e enrolado. */
function esquilo() {
  const pelo = '#D9824B';
  return (
    shadow(480, 900, 230) +
    P('M600 820 C820 820 900 560 800 380 C720 240 560 260 600 400 C640 520 760 540 700 700 C680 760 640 800 600 820Z', '#E8965A') +
    L('M640 420 C680 500 740 560 720 680', { color: '#F6C08A', sw: o(1.4) }) +
    E(460, 700, 170, 190, pelo) +
    E(460, 740, 90, 120, '#F6D9A8', { sw: 0 }) +
    E(380, 880, 70, 34, pelo) + E(540, 880, 70, 34, pelo) +
    P('M330 330 L360 220 L420 300Z', pelo) + P('M520 300 L580 220 L600 330Z', pelo) +
    Ci(460, 430, 150, pelo) +
    E(460, 490, 90, 60, '#F6D9A8', { sw: 0 }) +
    olho(410, 420) + olho(510, 420) +
    Ci(460, 470, 16, '#3D2C4E', { sw: 0 }) +
    L('M460 486 Q440 510 425 500 M460 486 Q480 510 495 500', { sw: o(0.7) }) +
    bochecha(370, 480) + bochecha(550, 480) +
    E(420, 640, 50, 40, '#C98A4B') + E(500, 640, 50, 40, '#C98A4B')
  );
}
/** Ursinho da floresta sentado (sem a gravatinha do ursinho de brinquedo). */
function urso() {
  const pelo = '#A8693F';
  return (
    shadow(500, 900, 300) +
    E(500, 700, 250, 220, pelo) +
    E(500, 730, 150, 150, '#E0B28A', { sw: 0 }) +
    E(340, 860, 100, 50, pelo) + E(660, 860, 100, 50, pelo) +
    E(290, 640, 60, 110, pelo, { rot: 20 }) + E(710, 640, 60, 110, pelo, { rot: -20 }) +
    Ci(340, 230, 70, pelo) + Ci(340, 230, 35, '#E0B28A', { sw: 0 }) +
    Ci(660, 230, 70, pelo) + Ci(660, 230, 35, '#E0B28A', { sw: 0 }) +
    Ci(500, 380, 200, pelo) +
    E(500, 450, 100, 75, '#E0B28A') +
    olho(430, 350) + olho(570, 350) +
    E(500, 420, 36, 26, '#3D2C4E', { sw: 0 }) +
    L('M500 446 Q475 480 450 465 M500 446 Q525 480 550 465', { sw: o(0.8) }) +
    bochecha(380, 430) + bochecha(620, 430)
  );
}
function pinha() {
  let escamas = '';
  for (let lin = 0; lin < 5; lin++) for (let c = 0; c < 3 + (lin % 2); c++) escamas += E(390 + c * 75 + (lin % 2 ? -36 : 0), 300 + lin * 105, 46, 34, '#C98A4B', { sw: o(0.7) });
  return shadow(500, 900, 200) + E(500, 520, 200, 330, '#A66A34') + escamas + tube('M500 190 L500 120', 22, '#5DBB7A') + E(560, 130, 50, 22, '#5DBB7A', { rot: -20 });
}
function osso() {
  return shadow(500, 880, 330) + G('rotate(-25 500 500)', R(300, 450, 400, 100, 50, '#FFFFFF') + Ci(290, 440, 70, '#FFFFFF') + Ci(290, 560, 70, '#FFFFFF') + Ci(710, 440, 70, '#FFFFFF') + Ci(710, 560, 70, '#FFFFFF') + R(300, 452, 400, 96, 0, '#FFFFFF', { sw: 0 }));
}
function guardaSol() {
  const gomos = ['#E25A52', '#FFFFFF', '#E25A52', '#FFFFFF', '#E25A52'];
  let s = shadow(500, 900, 300) + R(485, 330, 30, 560, 14, '#8F5A2E');
  gomos.forEach((c, i) => {
    const a0 = Math.PI + (i / 5) * Math.PI;
    const a1 = Math.PI + ((i + 1) / 5) * Math.PI;
    s += P(`M500 340 L${n(500 + 380 * Math.cos(a0))} ${n(400 + 260 * Math.sin(a0))} Q${n(500 + 400 * Math.cos((a0 + a1) / 2))} ${n(440 + 280 * Math.sin((a0 + a1) / 2))} ${n(500 + 380 * Math.cos(a1))} ${n(400 + 260 * Math.sin(a1))}Z`, c);
  });
  return s + Ci(500, 140, 22, '#FFD23F');
}
/** Os amigos dando um abraço (coelho e urso), com um coração. */
function abraco() {
  return (
    shadow(500, 900, 330) +
    G('translate(-150,60) scale(0.8)', withOutline(o(1 / 0.8), () => coelho('#FFFFFF'))) +
    G('translate(330,40) scale(0.82)', withOutline(o(1 / 0.82), urso)) +
    tube('M380 640 Q520 600 640 660', 50, '#A8693F') +
    P('M500 160 C450 90 360 130 400 200 L500 290 L600 200 C640 130 550 90 500 160Z', '#FF6F8E')
  );
}
/** Os amigos brigados: de costas um para o outro, com um risco de bravo. */
function brigam() {
  return (
    shadow(500, 900, 330) +
    G('translate(-170,60) scale(0.78)', withOutline(o(1 / 0.78), () => coelho('#FFFFFF'))) +
    G('translate(1170,60) scale(-0.8,0.8)', withOutline(o(1 / 0.8), urso)) +
    L('M470 160 L530 230 M530 160 L470 230', { color: '#E25A52', sw: o(2.4) })
  );
}
/** Um bichinho sozinho, com uma nuvenzinha cinza em cima. */
function sozinho() {
  return (
    G('translate(200,140) scale(0.6)', withOutline(o(1 / 0.6), () => coelho('#FFFFFF'))) +
    G('translate(500,180)', cloud([[-90, 10, 60], [0, -30, 80], [90, 10, 60], [0, 30, 70]], { fill: '#C9CCD6', shade: '#A9AEBC' }))
  );
}

// ------------------------------------------------------------ cenários (1920 x 1080)
const sobre = (fn, cx, base, s) => place(fn, cx - 500 * s, base - 900 * s, s);
/** Toco de árvore; (cx, base) é o pé. */
const toco = (cx, base, s = 1) =>
  G(`translate(${cx},${base}) scale(${s})`, withOutline(o(1 / s), () => P('M-170 0 L-140 -260 L140 -260 L170 0Z', '#A66A34') + E(0, -260, 140, 40, '#E0B28A') + E(0, -260, 80, 22, 'none', { sw: o(0.7) }) + E(0, -260, 30, 8, 'none', { sw: o(0.6) }) + P('M-160 -40 Q0 -70 160 -40 L170 0 L-170 0Z', '#FFFFFF')));

/** A clareira: o dia de neve com pinheiros dos lados. */
const clareira = () => noel.fundoNeve().replace('<g id="neveF"></g>', '') + noel.pinheiro(1840, 860, 0.36) + noel.pinheiro(260, 870, 0.35);
const fundoNeve = noel.fundoNeve;
const flocos = noel.flocos;

/** Pinheiro do "o que falta": com bolas, sem a estrela do topo (prancheta). */
function pinheiroSemEstrela() {
  return R(90, 90, 820, 820, 60, '#CFE6FF', { sw: 0 }) + P('M90 800 Q500 740 910 800 L910 910 L90 910Z', '#FFFFFF', { sw: 0 }) + noel.pinheiro(500, 860, 1.12).replace(/<path[^>]*fill="#FFD23F"[^>]*\/>/g, '') + [[420, 700, '#E25A52'], [590, 640, '#4DA3FF'], [470, 520, '#FFD23F'], [560, 430, '#E25A52'], [450, 340, '#9B7EDE']].map(([x, y, c]) => Ci(x, y, 26, c)).join('');
}
/** A estrela que cai no topo do pinheiro na resposta. */
const estrelaTopo = () => G('translate(390,40) scale(0.22)', withOutline(o(1 / 0.22), objetos.estrela));

/** Abertura: a clareira, o pinheiro ainda sem enfeites e os três bichinhos (`o1`). */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = clareira();
    s += noel.pinheiro(1240, 930, 0.95);
    s += `<g id="o1">${sobre(() => coelho('#FFFFFF'), 900, 990, 0.24)}${sobre(esquilo, 1580, 990, 0.24)}${sobre(urso, 1780, 1000, 0.3)}</g>`;
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau', { gorro: true }));
    return s;
  });
}

/** Onde o esquilo se esconde (desafio 1): atrás do toco (`arvoreEsc`). */
const ESCONDERIJO = { x: 1300, chao: 950, s: 0.26, arvore: { x: 1300, y: 980 } };
function cenaAchar() {
  return withOutline(TRACO, () => {
    const E_ = ESCONDERIJO;
    let s = clareira();
    // a ponta do rabo fica de fora, à direita do toco: é a pista
    s += `<g id="oculta">${sobre(esquilo, E_.x + 190, E_.chao, E_.s)}</g>`;
    s += `<g id="arvoreEsc">${toco(E_.arvore.x, E_.arvore.y, 1.05)}</g>`;
    return s;
  });
}

/** Desafio 2 — Contar: cinco pinhas na neve (ids p1 a p5). */
const RENAS_X = [740, 960, 1180, 1400, 1620];
function cenaRenas() {
  return withOutline(TRACO, () => {
    let s = clareira();
    RENAS_X.forEach((x, i) => {
      s += `<g id="p${i + 1}">${sobre(pinha, x, 930 + (i % 2 ? 16 : 0), 0.24)}</g>`;
    });
    return s;
  });
}

/** Desafio 6 — Comparar: o urso (`ca`, à esquerda) e o esquilo (`ov`, à direita). */
const CHAO = 970;
const GRANDE = { x: 980, s: 0.62 };
const PEQUENO = { x: 1520, s: 0.26 };
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = clareira();
    s += `<g id="ca">${sobre(urso, GRANDE.x, CHAO, GRANDE.s)}</g>`;
    s += `<g id="ov">${sobre(esquilo, PEQUENO.x, CHAO, PEQUENO.s)}</g>`;
    return s;
  });
}

/** Encerramento: o pinheiro enfeitado e os bichinhos em festa (`o1`, `o2`). */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = clareira();
    s += noel.pinheiro(1240, 930, 0.95, true);
    s += `<g id="o1">${sobre(() => coelho('#FFFFFF'), 900, 990, 0.24)}${sobre(() => coelho('#C98A4B'), 1020, 1000, 0.18)}</g>`;
    s += `<g id="o2">${sobre(esquilo, 1580, 990, 0.24)}${sobre(urso, 1780, 1000, 0.3)}</g>`;
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau', { gorro: true }));
    return s;
  });
}

module.exports = { coelho, coelhoCor, esquilo, urso, pinha, osso, guardaSol, abraco, brigam, sozinho, toco, pinheiroSemEstrela, estrelaTopo, fundoNeve, flocos, cenaAbertura, cenaAchar, cenaRenas, cenaComparar, cenaEncerramento, ESCONDERIJO, RENAS_X, CHAO, GRANDE, PEQUENO };
