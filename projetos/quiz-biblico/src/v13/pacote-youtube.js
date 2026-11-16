'use strict';
/**
 * Vídeo 13 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Uso: node src/v13/pacote-youtube.js
 */
const fs = require('fs');
const path = require('path');
const desafios = require('./desafios');

const ROOT = path.resolve(__dirname, '..', '..');
const V13 = path.join(ROOT, 'v13-biblico-jonas');
const OUT = path.join(V13, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V13, 'mapa-do-video.json'), 'utf8'));

// Mesmo formato do título escolhido para o Vídeo 1: o termo de busca
// ("quiz bíblico") junto com o desafio. "Todas" = todas as respostas.
const TITULO = 'Quiz Bíblico de Jonas e o Grande Peixe para crianças: você acerta todas?';
// Reservas, caso a taxa de cliques peça um teste depois de publicar
const RESERVAS = [
  'Quiz de Jonas e o Grande Peixe para crianças: você vence os 12 desafios?',
  'Quiz Bíblico Infantil: Jonas e o Grande Peixe | 12 desafios com a ovelhinha Tuti',
  'Jonas e o grande peixe: quiz bíblico para crianças de 3 a 7 anos',
];

const TAGS = [
  'quiz bíblico infantil',
  'jonas e o grande peixe',
  'jonas e a baleia',
  'história de jonas para crianças',
  'histórias bíblicas para crianças',
  'bíblia para crianças',
  'quiz para crianças',
  'perguntas bíblicas para crianças',
  'escola dominical',
  'ebd infantil',
  'culto infantil',
  'ministério infantil',
  'desenho bíblico infantil',
  'quiz da bíblia',
  'ovelhinha Tuti',
];

const mmss = (s) => `${Math.floor(Math.round(s) / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`;
const capitulos = mapa.cenas.map((c) => {
  if (c.cena === 'abertura') return `${mmss(c.inicio)} Abertura`;
  if (c.cena === 'encerramento') return `${mmss(c.inicio)} Encerramento`;
  const d = desafios.find((x) => `d${x.n}` === c.cena);
  return `${mmss(c.inicio)} Desafio ${d.n}: ${d.texto}`;
});

const DESCRICAO = `Vamos brincar de quiz com a história de Jonas e o grande peixe!

A ovelhinha Tuti traz 12 desafios na praia e no fundo do mar: achar o grande peixe escondido, contar os dias que Jonas ficou na barriga do peixe, dizer para onde Deus mandou Jonas, descobrir de quem é a sombra, achar o peixinho diferente, jogo da memória e muito mais. A criança tem 10 segundos para responder bem alto antes de a resposta aparecer. Não precisa saber ler: tudo é falado e toda opção é um desenho.

Feito para crianças de 3 a 7 anos. Bom para a hora da história em casa, a escola dominical, o culto infantil ou a sala de aula.

O que a criança aprende:
• Deus pediu a Jonas que fosse à cidade de Nínive
• Jonas tentou fugir de barco e veio uma tempestade
• Um grande peixe engoliu Jonas, e ele ficou três dias na barriga do peixe
• Jonas orou, e o peixe o deixou na praia
• Deus sempre cuida de nós e dá uma nova chance

Capítulos:
${capitulos.join('\n')}

Base bíblica: livro de Jonas, capítulos 1 a 3.

#QuizBíblico #Jonas #BíbliaParaCrianças`;

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
fs.writeFileSync(path.join(OUT, 'v13_titulo_descricao_tags.txt'), texto);
console.log(`título: ${TITULO.length} caracteres: ${TITULO}`);
// O YouTube conta cada tag de mais de uma palavra com 2 caracteres a mais (as aspas)
const contagemTags = TAGS.join(',').length + 2 * TAGS.filter((t) => t.includes(' ')).length;
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: cerca de ${contagemTags} caracteres na conta do YouTube (limite 500)`);
console.log(capitulos.join('\n'));
