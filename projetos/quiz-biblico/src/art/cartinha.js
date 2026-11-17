'use strict';
/**
 * Desenhos e cenários do Vídeo 15: a cartinha para o Papai Noel. A sala de
 * casa (a mesma do Vídeo 9) para as perguntas e o encerramento, e a rua com
 * neve e a caixa do correio para achar e contar. As cenas têm os mesmos nomes
 * e `id` das do Vídeo 4 (art/noel.js).
 */
const { n, o, withOutline, P, E, Ci, R, L, G, tube, sparkle, shadow } = require('../kit');
const { place, TRACO } = require('./cenario');
const sala = require('./sala');
const noel = require('./noel');
const pessoas = require('./pessoas');
const { tuti } = require('../tuti');

// ------------------------------------------------------------ desenhos de card (prancheta 1000 x 1000)
/** Selo de carta: borda picotada e uma arvorezinha. Centro em (cx, cy), lado `w`. */
function seloEm(cx, cy, w) {
  const h = w * 1.2;
  let picote = '';
  for (let i = 0; i <= 6; i++) picote += Ci(cx - w / 2 + (i * w) / 6, cy - h / 2, w * 0.05, '#FFFFFF', { sw: 0 }) + Ci(cx - w / 2 + (i * w) / 6, cy + h / 2, w * 0.05, '#FFFFFF', { sw: 0 });
  return (
    R(cx - w / 2, cy - h / 2, w, h, w * 0.06, '#FFF7E0') +
    R(cx - w * 0.38, cy - h * 0.4, w * 0.76, h * 0.8, w * 0.04, '#5DBB7A', { sw: o(0.6) }) +
    P(`M${n(cx)} ${n(cy - h * 0.3)} L${n(cx + w * 0.22)} ${n(cy + h * 0.2)} L${n(cx - w * 0.22)} ${n(cy + h * 0.2)}Z`, '#2F8F5A', { sw: o(0.5) }) +
    sparkle(cx, cy - h * 0.32, w * 0.08, 0, '#FFD23F') +
    picote
  );
}
/** Envelope; `cor` é a cor do papel, `selo` põe o selo no canto. */
function envelope({ cor = '#FFFFFF', selo = true } = {}) {
  return (
    shadow(500, 860, 380) +
    R(120, 260, 760, 520, 30, cor) +
    L('M140 280 L500 560 L860 280', { sw: o(1.2) }) +
    L('M140 760 L420 500 M860 760 L580 500', { sw: o(0.8), opacity: 0.5 }) +
    Ci(500, 560, 40, '#E25A52', { sw: o(0.8) }) +
    (selo ? seloEm(745, 360, 130) : '')
  );
}
const envelopeCor = (cor) => () => envelope({ cor });
/** A cartinha escrita, com um coração. */
function carta() {
  return (
    shadow(500, 900, 300) +
    P('M240 140 L700 140 L780 220 L780 860 L240 860Z', '#FFFFFF') +
    P('M700 140 L700 220 L780 220Z', '#E3DDF2') +
    L('M310 300 L690 300 M310 380 L700 380 M310 460 L650 460 M310 540 L690 540 M310 620 L560 620', { color: '#9BB7E0', sw: o(1.4) }) +
    P('M600 760 C560 700 640 680 650 720 C660 680 740 700 700 760 L650 810Z', '#E25A52', { sw: o(0.8) })
  );
}
const selo = () => shadow(500, 900, 220) + seloEm(500, 480, 460);
function lapis() {
  return (
    shadow(500, 880, 330) +
    G('rotate(-35 500 500)', R(200, 420, 520, 160, 20, '#FFD23F') + R(200, 420, 520, 50, 0, '#F4B824', { sw: 0 }) + R(140, 420, 90, 160, 20, '#FF8FB1') + R(200, 420, 40, 160, 0, '#C9CCD6') + P('M720 420 L860 500 L720 580Z', '#F6D9A8') + P('M815 474 L860 500 L815 526Z', '#3D2C4E'))
  );
}
function garfo() {
  return shadow(500, 900, 200) + R(470, 430, 60, 440, 30, '#C9CCD6') + P('M380 130 L380 380 Q380 460 500 460 Q620 460 620 380 L620 130 L580 130 L580 360 L540 360 L540 130 L460 130 L460 360 L420 360 L420 130Z', '#C9CCD6');
}
function colher() {
  return shadow(500, 900, 200) + R(470, 430, 60, 440, 30, '#C9CCD6') + E(500, 280, 130, 180, '#C9CCD6') + E(470, 240, 40, 80, '#FFFFFF', { sw: 0, opacity: 0.6 });
}
function botao() {
  return shadow(500, 880, 260) + Ci(500, 500, 300, '#4DA3FF') + Ci(500, 500, 230, 'none', { sw: o(1) }) + [[430, 430], [570, 430], [430, 570], [570, 570]].map(([x, y]) => Ci(x, y, 40, '#2E86E6')).join('');
}
function foto() {
  return (
    shadow(500, 880, 330) +
    R(200, 200, 600, 620, 30, '#FFFFFF') +
    R(250, 250, 500, 440, 10, '#BDE5FF') +
    P('M250 690 L400 520 L500 620 L600 500 L750 690Z', '#5DBB7A', { sw: o(0.8) }) +
    Ci(640, 350, 50, '#FFD23F')
  );
}
/** Saco de cartinhas; `s` é a escala dentro da prancheta. */
function sacoCartas() {
  return (
    shadow(500, 900, 330) +
    P('M220 880 C150 700 180 450 320 360 L680 360 C820 450 850 700 780 880Z', '#C98A4B') +
    P('M320 360 Q500 320 680 360 L640 300 Q500 260 360 300Z', '#A66A34') +
    tube('M340 330 Q500 370 660 330', 22, '#E25A52') +
    R(330, 150, 200, 150, 14, '#FFFFFF') + L('M330 150 L430 230 L530 150', { sw: o(0.8) }) +
    R(470, 120, 200, 150, 14, '#FFF1B8') + L('M470 120 L570 200 L670 120', { sw: o(0.8) }) +
    seloEm(500, 620, 150)
  );
}
/** O Polo Norte em card: neve, casinha do Papai Noel e a placa. */
function poloNorte() {
  return (
    R(80, 80, 840, 840, 60, '#CFE6FF', { sw: 0 }) +
    P('M80 700 Q500 620 920 700 L920 920 L80 920Z', '#FFFFFF') +
    R(330, 450, 300, 260, 16, '#E25A52') + P('M300 470 L480 330 L660 470Z', '#FFFFFF') + R(440, 580, 80, 130, 30, '#8F5A2E') + R(360, 500, 60, 60, 8, '#FFE27A') + R(540, 500, 60, 60, 8, '#FFE27A') +
    R(700, 540, 24, 220, 8, '#C9CCD6') + R(640, 520, 150, 60, 12, '#FFFFFF') + `<text x="715" y="562" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="34" fill="#E25A52">P. NORTE</text>` +
    sparkle(200, 230, 30, 0, '#FFFFFF') + sparkle(800, 260, 24, 10, '#FFFFFF')
  );
}
/** Caixa do correio vermelha num pé; (cx, base) é o pé. */
const caixaCorreio = (cx, base, s = 1) =>
  G(
    `translate(${cx},${base}) scale(${s})`,
    withOutline(o(1 / s), () =>
      R(-20, -260, 40, 260, 8, '#8F5A2E') +
      P('M-150 -260 L-150 -420 Q-150 -500 0 -500 Q150 -500 150 -420 L150 -260Z', '#E25A52') +
      R(-90, -420, 180, 30, 14, '#3B3548') +
      R(150, -460, 16, 90, 6, '#FFD23F') + R(160, -470, 60, 40, 6, '#FFD23F') +
      P('M-150 -268 Q0 -300 150 -268 L150 -240 Q0 -270 -150 -240Z', '#FFFFFF', { sw: o(0.6) })
    )
  );

// ------------------------------------------------------------ cenários (1920 x 1080)
const sobre = (fn, cx, base, s) => place(fn, cx - 500 * s, base - 900 * s, s);
/** Fundo das cenas de cards: a sala de casa, sem a janela (ela ficaria atrás do terceiro card). */
const fundoNeve = () => withOutline(TRACO, () => sala.sala() + R(1540, 230, 320, 290, 0, '#DCEFE4', { sw: 0 }) + '<g id="neveF"></g>');
const flocos = noel.flocos;

/** A rua com neve (o fundo de cards do Vídeo 4, sem o grupo da neve). */
const rua = () => noel.fundoNeve().replace('<g id="neveF"></g>', '');

/** Abertura: a sala com a lareira, a mesinha com a folha e o lápis. */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = sala.sala({ lareira: true });
    s += R(1250, 820, 420, 40, 12, '#B97A45') + R(1290, 860, 30, 130, 8, '#8F5A2E') + R(1600, 860, 30, 130, 8, '#8F5A2E');
    s += `<g id="o1">${sobre(carta, 1400, 830, 0.22)}${sobre(lapis, 1550, 830, 0.16)}</g>`;
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau', { gorro: true }));
    return s;
  });
}

/** Onde a cartinha se esconde (desafio 1): atrás da caixa do correio (`arvoreEsc`). */
const ESCONDERIJO = { x: 1300, chao: 840, s: 0.3, arvore: { x: 1300, y: 960 } };
function cenaAchar() {
  return withOutline(TRACO, () => {
    const E_ = ESCONDERIJO;
    let s = rua();
    // só uma pontinha do envelope fica de fora, à direita da caixa: é a pista
    s += `<g id="oculta">${sobre(envelope, E_.x + 70, E_.chao, E_.s)}</g>`;
    s += `<g id="arvoreEsc">${caixaCorreio(E_.arvore.x, E_.arvore.y, 1.05)}</g>`;
    return s;
  });
}

/** Desafio 2 — Contar: quatro cartinhas saindo da caixa do correio (ids p1 a p4). */
const RENAS_X = [760, 1020, 1280, 1540];
function cenaRenas() {
  return withOutline(TRACO, () => {
    let s = rua();
    s += caixaCorreio(1820, 1000, 0.8);
    RENAS_X.forEach((x, i) => {
      s += `<g id="p${i + 1}">${sobre(envelope, x, 900 + (i % 2 ? 16 : 0), 0.26)}</g>`;
    });
    return s;
  });
}

/** Desafio 6 — Comparar: o saco grande (`ca`, à esquerda) e o pequeno (`ov`, à direita). */
const CHAO = 960;
const GRANDE = { x: 980, s: 0.62 };
const PEQUENO = { x: 1520, s: 0.28 };
function cenaComparar() {
  return withOutline(TRACO, () => {
    let s = sala.sala();
    s += `<g id="ca">${sobre(sacoCartas, GRANDE.x, CHAO, GRANDE.s)}</g>`;
    s += `<g id="ov">${sobre(sacoCartas, PEQUENO.x, CHAO, PEQUENO.s)}</g>`;
    return s;
  });
}

/** Encerramento: a cartinha (`o1`) voando pela janela e o Papai Noel (`pa`) lendo, num quadrinho na parede. */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = sala.sala({ lareira: true });
    s += `<g id="o1">${sobre(envelope, 1500, 520, 0.16)}</g>`;
    s += `<g id="pa">${place(() => pessoas.papaiNoel({ armR: [700, 440] }), 1230, 560, 0.48)}</g>`;
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau', { gorro: true }));
    return s;
  });
}

module.exports = { envelope, envelopeCor, carta, selo, seloEm, lapis, garfo, colher, botao, foto, sacoCartas, poloNorte, caixaCorreio, fundoNeve, flocos, cenaAbertura, cenaAchar, cenaRenas, cenaComparar, cenaEncerramento, ESCONDERIJO, RENAS_X, CHAO, GRANDE, PEQUENO };
