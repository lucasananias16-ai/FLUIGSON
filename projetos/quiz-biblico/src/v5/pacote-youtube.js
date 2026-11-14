'use strict';
/**
 * Vídeo 5 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Uso: node src/v5/pacote-youtube.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const V5 = path.join(ROOT, 'v5-ingles-animais');
const OUT = path.join(V5, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V5, 'mapa-do-video.json'), 'utf8'));

// Título com o termo de busca ("inglês para crianças") e o que a criança faz
const TITULO = 'Inglês para Crianças Brincando: a Festa dos Animais com a Tuti';
// Reservas, caso a taxa de cliques peça um teste depois de publicar
const RESERVAS = [
  'Aprenda Inglês Brincando: Animais em Inglês para Crianças | Tuti',
  'Inglês para Crianças de 4 a 6 anos: Lion, Elephant, Giraffe e Sheep',
  'Hello! Primeiras Palavras em Inglês para Crianças com a Ovelhinha Tuti',
];

const TAGS = [
  'inglês para crianças',
  'inglês infantil',
  'aprender inglês brincando',
  'inglês para crianças de 4 a 6 anos',
  'animais em inglês',
  'animals in english',
  'lion elephant giraffe sheep',
  'hello em inglês',
  'primeiras palavras em inglês',
  'vocabulário em inglês para crianças',
  'jump clap spin',
  'contar em inglês',
  'jogo para crianças',
  'educação infantil',
  'desenho educativo infantil',
  'ovelhinha Tuti',
];

const NOMES = {
  abertura: 'Hello! A festa começa',
  v1: 'Visita 1: sheep',
  v2: 'Visita 2: lion',
  v3: 'Visita 3: elephant',
  v4: 'Visita 4: giraffe',
  j1: 'Jogo 1: A Tuti diz (jump, clap, spin)',
  j2: 'Jogo 2: Qual é o lion?',
  j3: 'Jogo 3: Ache a giraffe',
  j4: 'Jogo 4: Conte até 5 em inglês',
  j5: 'Jogo 5: Onde está o lion?',
  final: 'A dança dos bichos e Bye-bye!',
};

const mmss = (s) => `${Math.floor(Math.round(s) / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`;
const capitulos = mapa.cenas.map((c) => `${mmss(c.inicio)} ${NOMES[c.cena]}`);

const DESCRICAO = `Vamos brincar de inglês? A ovelhinha Tuti faz uma festa e os animais chegam de surpresa, dentro de caixas de presente!

A criança escuta o som do bicho, tenta adivinhar quem é, ouve a palavra em inglês e faz o gesto junto: ruge como o leão, balança o braço como a tromba do elefante e se estica como a girafa. Depois vêm os jogos: "A Tuti diz", esconde-esconde, contar até 5 em inglês e um jogo da memória. Não precisa saber ler nem saber inglês antes.

Feito para crianças de 4 a 6 anos. Dica para quem assiste junto: dê play, faça os gestos com a criança e use as pausas de 3 segundos para ela repetir em voz alta.

Palavras do vídeo:
• hello e bye-bye
• sheep (ovelha), lion (leão), elephant (elefante), giraffe (girafa)
• jump (pular), clap (bater palmas), spin (girar)
• one, two, three, four, five (de 1 a 5)

Capítulos:
${capitulos.join('\n')}

#InglêsParaCrianças #AprenderInglês #AnimaisEmInglês`;

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
fs.writeFileSync(path.join(OUT, 'v5_titulo_descricao_tags.txt'), texto);
console.log(`título: ${TITULO.length} caracteres: ${TITULO}`);
// O YouTube conta cada tag de mais de uma palavra com 2 caracteres a mais (as aspas)
const contagemTags = TAGS.join(',').length + 2 * TAGS.filter((t) => t.includes(' ')).length;
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: cerca de ${contagemTags} caracteres na conta do YouTube (limite 500)`);
console.log(capitulos.join('\n'));
