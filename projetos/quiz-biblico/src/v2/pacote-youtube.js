'use strict';
/**
 * Vídeo 2 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Uso: node src/v2/pacote-youtube.js
 */
const fs = require('fs');
const path = require('path');
const desafios = require('./desafios');

const ROOT = path.resolve(__dirname, '..', '..');
const V2 = path.join(ROOT, 'v2-davi-e-golias');
const OUT = path.join(V2, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V2, 'mapa-do-video.json'), 'utf8'));

// Mesmo formato do título escolhido para o Vídeo 1: o termo de busca
// ("quiz bíblico") junto com o desafio. "Todas" = todas as respostas.
const TITULO = 'Quiz Bíblico de Davi e Golias para crianças: você acerta todas?';
// Reservas, caso a taxa de cliques peça um teste depois de publicar
const RESERVAS = [
  'Quiz de Davi e Golias para crianças: você vence os 8 desafios?',
  'Quiz Bíblico Infantil: Davi e Golias | 8 desafios com a ovelhinha Tuti',
  'Davi e Golias: quiz bíblico para crianças de 3 a 7 anos',
];

const TAGS = [
  'quiz bíblico infantil',
  'davi e golias',
  'quiz de davi e golias',
  'davi e golias para crianças',
  'histórias bíblicas para crianças',
  'bíblia para crianças',
  'quiz para crianças',
  'rei davi',
  'perguntas bíblicas para crianças',
  'escola dominical',
  'ebd infantil',
  'culto infantil',
  'ministério infantil',
  'educação cristã infantil',
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

const DESCRICAO = `Vamos brincar de quiz com a história de Davi e Golias!

A ovelhinha Tuti traz 8 desafios: achar a ovelhinha escondida, contar as pedrinhas do riacho, descobrir de quem é a sombra, jogo da memória e muito mais. A criança tem 10 segundos para responder bem alto antes de a resposta aparecer e, num dos desafios, conta junto com a Tuti. Não precisa saber ler: tudo é falado e toda opção é um desenho.

Feito para crianças de 3 a 7 anos. Bom para a hora da história em casa, a escola dominical, o culto infantil ou a sala de aula.

O que a criança aprende:
• Davi era um menino pastor que cuidava bem das ovelhas
• Golias era um gigante, mas Davi tinha Deus com ele
• Davi levou sua funda e confiou em Deus
• Davi tocava harpa e cantava para Deus
• Quando cresceu, Davi virou rei

Capítulos:
${capitulos.join('\n')}

Base bíblica: 1 Samuel, capítulos 16 e 17, e 2 Samuel, capítulo 5.

#QuizBíblico #DaviEGolias #BíbliaParaCrianças`;

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
fs.writeFileSync(path.join(OUT, 'v2_titulo_descricao_tags.txt'), texto);
console.log(`título: ${TITULO.length} caracteres: ${TITULO}`);
// O YouTube conta cada tag de mais de uma palavra com 2 caracteres a mais (as aspas)
const contagemTags = TAGS.join(',').length + 2 * TAGS.filter((t) => t.includes(' ')).length;
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: cerca de ${contagemTags} caracteres na conta do YouTube (limite 500)`);
console.log(capitulos.join('\n'));
