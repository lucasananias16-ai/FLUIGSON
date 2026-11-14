'use strict';
/**
 * Vídeo 3 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Uso: node src/v2/pacote-youtube.js
 */
const fs = require('fs');
const path = require('path');
const desafios = require('./desafios');

const ROOT = path.resolve(__dirname, '..', '..');
const V3 = path.join(ROOT, 'v3-nascimento-de-jesus');
const OUT = path.join(V3, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V3, 'mapa-do-video.json'), 'utf8'));

// Mesmo formato do título escolhido para o Vídeo 1: o termo de busca
// ("quiz bíblico") junto com o desafio. "Todas" = todas as respostas.
const TITULO = 'Quiz Bíblico do Natal de Jesus para crianças: você acerta todas?';
// Reservas, caso a taxa de cliques peça um teste depois de publicar
const RESERVAS = [
  'Quiz de Natal para crianças: você vence os 9 desafios?',
  'Quiz Bíblico Infantil: Nascimento de Jesus | 9 desafios com a ovelhinha Tuti',
  'Nascimento de Jesus: quiz bíblico de Natal para crianças de 3 a 7 anos',
];

const TAGS = [
  'quiz bíblico infantil',
  'natal de jesus',
  'nascimento de jesus',
  'quiz de natal',
  'história do natal para crianças',
  'natal para crianças',
  'estrela de belém',
  'reis magos',
  'histórias bíblicas para crianças',
  'bíblia para crianças',
  'quiz para crianças',
  'perguntas bíblicas para crianças',
  'escola dominical',
  'ebd infantil',
  'culto infantil',
  'ministério infantil',
  'educação cristã infantil',
  'desenho bíblico infantil',
  'ovelhinha Tuti',
];

const mmss = (s) => `${Math.floor(Math.round(s) / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`;
const capitulos = mapa.cenas.map((c) => {
  if (c.cena === 'abertura') return `${mmss(c.inicio)} Abertura`;
  if (c.cena === 'encerramento') return `${mmss(c.inicio)} Encerramento`;
  const d = desafios.find((x) => `d${x.n}` === c.cena);
  return `${mmss(c.inicio)} Desafio ${d.n}: ${d.texto}`;
});

const DESCRICAO = `Vamos brincar de quiz com a história do nascimento de Jesus!

A ovelhinha Tuti traz 9 desafios: achar a estrelinha escondida, contar os presentes, descobrir de quem é a sombra, jogo da memória e muito mais. A criança tem 10 segundos para responder bem alto antes de a resposta aparecer e, num dos desafios, conta junto com a Tuti. Não precisa saber ler: tudo é falado e toda opção é um desenho.

Feito para crianças de 3 a 7 anos. Bom para a hora da história em casa, a escola dominical, o culto infantil ou a sala de aula.

O que a criança aprende:
• Maria é a mãe de Jesus
• Jesus dormiu numa manjedoura, uma caminha de palha
• Um anjo deu a boa notícia aos pastores
• Os magos seguiram uma estrela e levaram presentes
• Deus mandou Jesus para mostrar o amor dele

Capítulos:
${capitulos.join('\n')}

Base bíblica: Lucas, capítulo 2, e Mateus, capítulo 2.

#QuizBíblico #NatalDeJesus #BíbliaParaCrianças`;

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
fs.writeFileSync(path.join(OUT, 'v3_titulo_descricao_tags.txt'), texto);
console.log(`título: ${TITULO.length} caracteres: ${TITULO}`);
// O YouTube conta cada tag de mais de uma palavra com 2 caracteres a mais (as aspas)
const contagemTags = TAGS.join(',').length + 2 * TAGS.filter((t) => t.includes(' ')).length;
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: cerca de ${contagemTags} caracteres na conta do YouTube (limite 500)`);
console.log(capitulos.join('\n'));
