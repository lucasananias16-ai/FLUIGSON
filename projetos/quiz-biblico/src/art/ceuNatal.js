'use strict';
/**
 * Cenários do Vídeo 10: a noite de Natal vista do céu, com a lua grande, as
 * nuvens, a cidade de casinhas nevadas e o trenó voando. As cenas têm os mesmos
 * nomes e os mesmos `id` das do Vídeo 4 (art/noel.js), para as cenas animadas
 * serem as mesmas com outro cenário.
 */
const { n, o, withOutline, P, E, Ci, R, L, G, cloud, sparkle } = require('../kit');
const { place, sun, TRACO } = require('./cenario');
const { ceuNoite, nuvemNoite } = require('./natal');
const noel = require('./noel');
const pessoas = require('./pessoas');
const animais = require('./animais');
const objetos = require('./objetos');
const { tuti } = require('../tuti');

const NEVE_LONGE = '#8FA9D6';
const NEVE = '#C9DDF2';
const NEVE_PERTO = '#FFFFFF';
const JANELA_APAGADA = '#3B4A7A';
const JANELA_ACESA = '#FFE27A';
const PAREDES = ['#E8A66B', '#7FB7E6', '#F2C879', '#E58B8B', '#9BCB9A'];

/** Tira a sombra do chão de um desenho, para quem está no céu. */
const semSombra = (svg) => svg.replace(/<ellipse[^>]*opacity="0\.14"[^>]*\/>/g, '');
const renaPreta = () => animais.rena({ nariz: '#3B3548', brilho: '#8A8496' });
/** Rena de nariz bem grande, para o desafio do "diferente": a criança precisa ver a cor de longe. */
const renaNarigao = (vermelho) => () =>
  (vermelho ? `<circle cx="830" cy="386" r="92" fill="#FF7A6E" opacity="0.4"/>` : '') +
  animais.rena(vermelho ? {} : { nariz: '#3B3548', brilho: '#8A8496' }) +
  Ci(830, 386, 44, vermelho ? '#E25A52' : '#3B3548') +
  E(816, 370, 14, 11, vermelho ? '#FFB0A8' : '#8A8496', { sw: 0 });
/** Sol para o card (prancheta 1000 x 1000). */
const solCard = () => sun(500, 500, 230) + Ci(420, 470, 20, '#3D2C4E', { sw: 0 }) + Ci(580, 470, 20, '#3D2C4E', { sw: 0 }) + L('M430 560 Q500 620 570 560', { sw: o(1.1) }) + E(360, 540, 34, 22, '#FFB26B', { sw: 0, opacity: 0.8 }) + E(640, 540, 34, 22, '#FFB26B', { sw: 0, opacity: 0.8 });

/** Lua cheia com brilho em volta. */
function luaCheia(cx, cy, r) {
  return (
    `<defs><radialGradient id="brilhoLua" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${n(r * 1.9)}">` +
    `<stop offset="0.45" stop-color="#FFF3B0" stop-opacity="0.55"/><stop offset="1" stop-color="#FFF3B0" stop-opacity="0"/></radialGradient></defs>` +
    `<circle cx="${cx}" cy="${cy}" r="${n(r * 1.9)}" fill="url(#brilhoLua)"/>` +
    Ci(cx, cy, r, '#FFF1B8') +
    Ci(cx - r * 0.35, cy - r * 0.2, r * 0.16, '#F3DC8C', { sw: 0 }) +
    Ci(cx + r * 0.3, cy + r * 0.32, r * 0.22, '#F3DC8C', { sw: 0 }) +
    Ci(cx + r * 0.18, cy - r * 0.45, r * 0.1, '#F3DC8C', { sw: 0 })
  );
}

/**
 * Casinha com telhado nevado e chaminé; (cx, base) é o meio do pé e `w` a largura.
 * `id` dá um grupo à janela acesa (para a animação acender), `acesa` já a deixa acesa.
 */
function casinha(cx, base, w, cor, { id = null, acesa = true } = {}) {
  const h = w * 0.72;
  const x0 = cx - w / 2;
  const topo = base - h;
  const cume = topo - w * 0.48;
  const jw = w * 0.34;
  const jx = cx - jw / 2;
  const jy = topo + h * 0.22;
  const jh = h * 0.46;
  const cruz = L(`M${n(cx)} ${n(jy)} L${n(cx)} ${n(jy + jh)} M${n(jx)} ${n(jy + jh / 2)} L${n(jx + jw)} ${n(jy + jh / 2)}`, { sw: o(0.7) }) + R(jx, jy, jw, jh, 8, 'none');
  const luz = `<circle cx="${n(cx)}" cy="${n(jy + jh / 2)}" r="${n(jw * 1.1)}" fill="#FFE27A" opacity="0.35"/>` + R(jx, jy, jw, jh, 8, JANELA_ACESA) + cruz;
  let s = R(cx + w * 0.18, cume + w * 0.1, w * 0.16, w * 0.4, 5, '#C2543F') + R(cx + w * 0.15, cume + w * 0.05, w * 0.22, w * 0.09, 6, '#FFFFFF');
  s += R(x0, topo, w, h, 10, cor);
  s += P(`M${n(x0 - w * 0.1)} ${n(topo + 6)} L${n(cx)} ${n(cume)} L${n(x0 + w * 1.1)} ${n(topo + 6)}Z`, '#E25A52');
  s += P(`M${n(x0 - w * 0.1)} ${n(topo + 6)} L${n(cx)} ${n(cume)} L${n(x0 + w * 1.1)} ${n(topo + 6)} Q${n(cx + w * 0.3)} ${n(topo - w * 0.12)} ${n(cx)} ${n(topo - w * 0.02)} Q${n(cx - w * 0.3)} ${n(topo - w * 0.12)} ${n(x0 - w * 0.1)} ${n(topo + 6)}Z`, '#FFFFFF');
  s += R(jx, jy, jw, jh, 8, acesa && !id ? JANELA_ACESA : JANELA_APAGADA) + cruz;
  if (id) s += `<g id="${id}" style="opacity:0">${luz}</g>`;
  return s;
}

const colinas = (topo) =>
  P(`M-20 ${topo + 120} Q300 ${topo - 60} 700 ${topo + 70} Q1100 ${topo - 40} 1500 ${topo + 60} Q1750 ${topo - 20} 1940 ${topo + 40} L1940 1100 L-20 1100Z`, NEVE_LONGE);

/** Fileira de casinhas pequenas ao longe, sobre a neve. */
const cidadeLonge = (base, xs, w = 110) => xs.map((x, i) => casinha(x, base + (i % 2 ? 10 : 0), w * (i % 3 === 1 ? 1.15 : 1), PAREDES[(i * 2 + 1) % 5])).join('');

/** O trenó voando: o Papai Noel dentro e duas renas na frente. Origem no canto de cima, à esquerda; cerca de 1040 x 420. */
function trenoVoando() {
  let s = L('M330 250 Q520 210 640 250 Q760 200 880 230', { color: '#8F5A2E', sw: o(0.8) });
  s += place(() => pessoas.papaiNoel({ armR: [756, 470], shadow: false }), 30, -20, 0.34);
  s += place(objetos.treno, 0, 40, 0.42);
  s += place(renaPreta, 470, 60, 0.34);
  s += place(animais.rena, 710, 30, 0.34);
  return semSombra(s);
}

/** Céu de noite com a lua e as duas nuvens que se mexem. */
const ceuLua = (lx, ly, lr, nuvens = true) =>
  ceuNoite() + luaCheia(lx, ly, lr) + (nuvens ? `<g id="nv1">${nuvemNoite(520, 300, 0.7)}</g><g id="nv2">${nuvemNoite(1760, 560, 0.6)}</g>` : '');

/** Fundo das cenas de cards: o céu de noite, a cidade lá embaixo e a neve do morro. */
function fundoNeve() {
  return withOutline(TRACO, () => {
    let s = ceuNoite() + luaCheia(1740, 250, 120);
    s += colinas(820);
    s += cidadeLonge(950, [700, 860, 1010, 1420, 1570, 1720], 96);
    s += P('M-20 950 Q480 900 960 932 Q1480 966 1940 916 L1940 1100 L-20 1100Z', NEVE);
    s += P('M-20 1040 Q520 1000 1040 1036 Q1500 1066 1940 1026 L1940 1100 L-20 1100Z', NEVE_PERTO);
    s += '<g id="neveF"></g>';
    return s;
  });
}

/** Abertura: o morro da Tuti, a cidade e o trenó (`voo`) esperando no céu. */
function cenaAbertura({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = ceuLua(1500, 420, 200);
    s += colinas(700);
    s += cidadeLonge(850, [760, 900, 1050, 1200, 1350, 1500, 1650, 1800], 104);
    s += P('M-20 860 Q480 800 960 840 Q1480 884 1940 830 L1940 1100 L-20 1100Z', NEVE);
    s += `<g id="voo">${G('translate(690,250) scale(1.02)', trenoVoando())}</g>`;
    s += P('M-20 980 Q520 910 1040 978 Q1500 1026 1940 960 L1940 1100 L-20 1100Z', NEVE_PERTO);
    s += sparkle(830, 1020, 14, 0, '#B9D0EA') + sparkle(1560, 1040, 12, 14, '#B9D0EA');
    if (comTuti) s += G('translate(110,322) scale(0.68)', tuti('tchau', { gorro: true }));
    return s;
  });
}

/**
 * Onde a rena do nariz vermelho se esconde (desafio 1): atrás da nuvem (`arvoreEsc`).
 * (x, chao) são o meio e os pés da rena; `arvore` é o centro da nuvem.
 */
const ESCONDERIJO = { x: 1250, chao: 670, s: 0.5, arvore: { x: 1250, y: 500 } };
function cenaAchar() {
  return withOutline(TRACO, () => {
    const E_ = ESCONDERIJO;
    let s = ceuNoite() + luaCheia(1720, 330, 110);
    s += `<g id="nv1">${nuvemNoite(700, 330, 0.75)}</g><g id="nv2">${nuvemNoite(1700, 640, 0.7)}</g>`;
    s += colinas(820);
    s += cidadeLonge(950, [700, 860, 1010, 1160, 1420, 1570, 1720], 96);
    s += P('M-20 950 Q480 900 960 932 Q1480 966 1940 916 L1940 1100 L-20 1100Z', NEVE);
    const ox = E_.x - 520 * E_.s;
    const oy = E_.chao - 886 * E_.s;
    // o nariz vermelho tem um brilho em volta: é a pista para achar a rena
    s += `<g id="oculta"><circle cx="${n(ox + 830 * E_.s)}" cy="${n(oy + 386 * E_.s)}" r="34" fill="#FF7A6E" opacity="0.4"/>${semSombra(place(animais.rena, ox, oy, E_.s))}</g>`;
    const nuvem = cloud(
      [[-190, 20, 96], [-90, -50, 120], [40, -30, 116], [130, 40, 92], [0, 60, 124], [-110, 80, 100], [90, 90, 96]],
      { fill: '#E6EEFF', shade: '#AEBDE3', sx: -5, sy: -9 }
    );
    s += `<g id="arvoreEsc">${G(`translate(${E_.arvore.x},${E_.arvore.y})`, nuvem)}</g>`;
    s += P('M-20 1040 Q520 1000 1040 1036 Q1500 1066 1940 1026 L1940 1100 L-20 1100Z', NEVE_PERTO);
    return s;
  });
}

/** Desafio 2 — Contar: cinco casinhas na neve (ids p1 a p5); a janela de cada uma acende (j1 a j5). */
const RENAS_X = [730, 960, 1190, 1420, 1650];
const CASA = { base: 930, w: 170 };
function cenaRenas() {
  return withOutline(TRACO, () => {
    let s = ceuLua(1680, 330, 120, false);
    s += `<g id="nv1">${nuvemNoite(760, 300, 0.7)}</g>`;
    s += colinas(760);
    s += P('M-20 900 Q480 850 960 882 Q1480 916 1940 866 L1940 1100 L-20 1100Z', NEVE);
    RENAS_X.forEach((x, i) => {
      s += `<g id="p${i + 1}">${casinha(x, CASA.base + (i % 2 ? 16 : 0), CASA.w, PAREDES[i], { id: `j${i + 1}` })}</g>`;
    });
    s += P('M-20 1030 Q520 990 1040 1026 Q1500 1056 1940 1016 L1940 1100 L-20 1100Z', NEVE_PERTO);
    return s;
  });
}

/** Encerramento: a cidade, a lua grande e o trenó (`voo`), que a animação faz cruzar o céu. */
function cenaEncerramento({ comTuti = true } = {}) {
  return withOutline(TRACO, () => {
    let s = ceuLua(1180, 400, 230);
    s += colinas(720);
    s += cidadeLonge(870, [640, 790, 940, 1090, 1240, 1390, 1540, 1690, 1840], 110);
    s += P('M-20 880 Q480 820 960 860 Q1480 904 1940 850 L1940 1100 L-20 1100Z', NEVE);
    s += `<g id="voo">${G('translate(0,200) scale(0.9)', trenoVoando())}</g>`;
    s += P('M-20 990 Q520 930 1040 990 Q1500 1036 1940 976 L1940 1100 L-20 1100Z', NEVE_PERTO);
    s += sparkle(470, 1040, 12, 0, '#B9D0EA') + sparkle(1130, 1050, 12, 14, '#B9D0EA');
    if (comTuti) s += G('translate(-52,424) scale(0.6)', tuti('tchau', { gorro: true }));
    return s;
  });
}

module.exports = { renaPreta, renaNarigao, solCard, luaCheia, casinha, trenoVoando, fundoNeve, flocos: noel.flocos, cenaAbertura, cenaAchar, cenaRenas, cenaEncerramento, ESCONDERIJO, RENAS_X, CASA };
