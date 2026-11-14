'use strict';
/**
 * Vídeo 7 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Uso: node src/v5/pacote-youtube.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const V7 = path.join(ROOT, 'v7-ingles-cores');
const OUT = path.join(V7, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V7, 'mapa-do-video.json'), 'utf8'));

const TITULO = 'Cores em Inglês para Crianças: pinte o arco-íris com a Tuti';
const RESERVAS = [
  'Aprenda as Cores em Inglês Brincando | Inglês para Crianças com a Tuti',
  'Red, Yellow, Blue! Cores em Inglês para Crianças: o Arco-Íris Sumiu',
  'Inglês para Crianças de 4 a 6 anos: as Cores (Colors)',
];

const TAGS = [
  'cores em inglês',
  'cores em inglês para crianças',
  'colors in english',
  'inglês para crianças',
  'inglês infantil',
  'aprender inglês brincando',
  'red yellow blue',
  'aprender as cores',
  'arco-íris',
  'inglês para crianças de 4 a 6 anos',
  'educação infantil',
  'desenho educativo infantil',
  'ovelhinha Tuti',
];

const NOMES = {
  abertura: 'Hello! As cores sumiram',
  c1: 'Red',
  c2: 'Yellow',
  c3: 'Blue',
  j1: 'Jogo 1: o camaleão muda de cor',
  c4: 'Green',
  c5: 'Orange',
  c6: 'Purple',
  j2: 'Jogo 2: Qual é o green?',
  j3: 'Jogo 3: Mistura mágica (yellow + blue)',
  j4: 'Jogo 4: Qual não é red?',
  j5: 'Jogo 5: Onde está o blue?',
  final: 'O arco-íris voltou! Rainbow!',
};

const mmss = (s) => `${Math.floor(Math.round(s) / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`;
const capitulos = mapa.cenas.filter((c) => NOMES[c.cena]).map((c) => `${mmss(c.inicio)} ${NOMES[c.cena]}`);

const DESCRICAO = `As cores sumiram e o mundo ficou cinza! Para elas voltarem, a ovelhinha Tuti e o camaleão Leo precisam da ajuda da criança: é só dizer o nome de cada cor em inglês.

A cada cor aprendida, uma parte do desenho se pinta: a maçã fica red, o sol yellow, o céu blue, a grama green, a laranja orange e a uva purple. Depois vêm os jogos (o camaleão que muda de cor, a mistura mágica de tintas, o intruso e o jogo da memória) e, no fim, o arco-íris volta faixa por faixa. Não precisa saber ler nem saber inglês antes.

Feito para crianças de 4 a 6 anos. Dica para quem assiste junto: use as pausas "Sua vez!" para a criança dizer a cor em voz alta e veja a tinta aparecer.

Palavras do vídeo:
• red, yellow, blue
• green, orange, purple
• hello, rainbow, bye-bye

Capítulos:
${capitulos.join('\n')}

#InglêsParaCrianças #CoresEmInglês #AprenderInglês`;

const texto = `TÍTULO
${TITULO}

----------------------------------------------------------------------
DESCRIÇÃO (copie daqui até a linha das hashtags)
----------------------------------------------------------------------
${DESCRICAO}

----------------------------------------------------------------------
TAGS (copie a linha inteira e cole no campo "Tags")
----------------------------------------------------------------------
${TAGS.join(', ')}

----------------------------------------------------------------------
TÍTULOS DE RESERVA (para testar depois, se a taxa de cliques ficar baixa)
----------------------------------------------------------------------
${RESERVAS.map((t, i) => `${i + 1}. ${t}`).join('\n')}
`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'v7_titulo_descricao_tags.txt'), texto);
console.log(`título: ${TITULO.length} caracteres: ${TITULO}`);
// O YouTube conta cada tag de mais de uma palavra com 2 caracteres a mais (as aspas)
const contagemTags = TAGS.join(',').length + 2 * TAGS.filter((t) => t.includes(' ')).length;
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: cerca de ${contagemTags} caracteres na conta do YouTube (limite 500)`);
console.log(capitulos.join('\n'));
