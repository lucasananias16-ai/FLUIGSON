'use strict';
/**
 * Vídeo 6 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Uso: node src/v5/pacote-youtube.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const V6 = path.join(ROOT, 'v6-ingles-numeros');
const OUT = path.join(V6, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V6, 'mapa-do-video.json'), 'utf8'));

const TITULO = 'Números em Inglês para Crianças: conte até 10 e decole com a Tuti';
const RESERVAS = [
  'Aprenda a Contar em Inglês de 1 a 10 | Inglês para Crianças com a Tuti',
  'One, Two, Three! Números em Inglês Brincando: o Foguete da Tuti',
  'Inglês para Crianças de 4 a 6 anos: Números de 1 a 10',
];

const TAGS = [
  'números em inglês',
  'números em inglês para crianças',
  'contar em inglês',
  'inglês para crianças',
  'inglês infantil',
  'aprender inglês brincando',
  'numbers in english',
  'one two three',
  'contar até 10 em inglês',
  'inglês para crianças de 4 a 6 anos',
  'contagem regressiva foguete',
  'educação infantil',
  'desenho educativo infantil',
  'ovelhinha Tuti',
];

const NOMES = {
  abertura: 'Hello! A Tuti e o robô Bip',
  l1: 'Lição 1: one, two, three, four, five',
  j1: 'Jogo 1: Clap three! Jump five!',
  l2: 'Lição 2: six, seven, eight, nine, ten',
  j2: 'Jogo 2: Qual é o four?',
  j3: 'Jogo 3: Quantas estrelas?',
  j4a: 'Jogo 4: O Bip pulou um número',
  j5: 'Jogo 5: Onde está o ten?',
  final: 'Contagem regressiva: ten... one... Blast off!',
};

const mmss = (s) => `${Math.floor(Math.round(s) / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`;
const capitulos = mapa.cenas.filter((c) => NOMES[c.cena]).map((c) => `${mmss(c.inicio)} ${NOMES[c.cena]}`);

const DESCRICAO = `Vamos contar em inglês? A ovelhinha Tuti e o robô Bip vão de foguete até a Lua, mas o foguete só decola com a contagem em inglês!

A criança aprende os números de 1 a 10 vendo cada um acender na tela, repetindo com a Tuti e usando o corpo: bate palmas três vezes, pula cinco vezes. Depois vêm os jogos (qual é o four, quantas estrelas, o número que faltou, jogo da memória) e a contagem regressiva de ten até one. Blast off! Não precisa saber ler nem saber inglês antes.

Feito para crianças de 4 a 6 anos. Dica para quem assiste junto: conte em voz alta com a criança e use as pausas "Sua vez!" para ela repetir.

Palavras do vídeo:
• one, two, three, four, five
• six, seven, eight, nine, ten
• hello, clap, jump, blast off, bye-bye

Capítulos:
${capitulos.join('\n')}

#InglêsParaCrianças #NúmerosEmInglês #AprenderInglês`;

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
fs.writeFileSync(path.join(OUT, 'v6_titulo_descricao_tags.txt'), texto);
console.log(`título: ${TITULO.length} caracteres: ${TITULO}`);
// O YouTube conta cada tag de mais de uma palavra com 2 caracteres a mais (as aspas)
const contagemTags = TAGS.join(',').length + 2 * TAGS.filter((t) => t.includes(' ')).length;
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: cerca de ${contagemTags} caracteres na conta do YouTube (limite 500)`);
console.log(capitulos.join('\n'));
