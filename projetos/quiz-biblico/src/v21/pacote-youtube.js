'use strict';
/**
 * Vídeo 21 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Versão 2 (padrão novo): título sem número e capítulos do vídeo v2.
 *
 * Uso: node src/v21/pacote-youtube.js
 */
const fs = require('fs');
const path = require('path');
const desafios = require('./desafios');

const ROOT = path.resolve(__dirname, '..', '..');
const V21 = path.join(ROOT, 'v21-biblico-daniel');
const OUT = path.join(V21, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V21, 'mapa-do-video.json'), 'utf8'));

// Mesmo formato do título escolhido para o Vídeo 1: o termo de busca
// ("quiz bíblico") junto com o desafio. "Todas" = todas as respostas.
// Padrão novo (19/11/2026): sem numeração, no formato "[Tema] para Crianças [emoji] [Gancho] | Você acerta?"
const TITULO = 'Quiz Bíblico para Crianças 🦁 Daniel e os Leões | Você acerta?';
// Reservas, caso a taxa de cliques peça um teste depois de publicar
const RESERVAS = [
  'Daniel na Cova dos Leões para Crianças 🦁 Quiz Bíblico | Você acerta?',
  'Quiz Bíblico Infantil 🦁 Daniel e os Leões Mansinhos',
  'História de Daniel para Crianças 🦁 12 desafios com a ovelhinha Tuti',
];

const TAGS = [
  'quiz bíblico infantil',
  'daniel e os leões',
  'daniel na cova dos leões',
  'histórias bíblicas para crianças',
  'bíblia para crianças',
  'quiz para crianças',
  'quiz infantil',
  'escola dominical',
  'ebd infantil',
  'culto infantil',
  'ministério infantil',
  'desenho bíblico infantil',
  'ovelhinha Tuti',
];

const mmss = (s) => `${Math.floor(Math.round(s) / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`;
const capitulos = mapa.cenas.filter((c) => !['surpresa', 'metade', 'ultimo'].includes(c.cena)).map((c) => {
  if (c.cena === 'abertura') return `${mmss(c.inicio)} Abertura`;
  if (c.cena === 'encerramento') return `${mmss(c.inicio)} Encerramento`;
  const d = desafios.find((x) => `d${x.n}` === c.cena);
  return `${mmss(c.inicio)} Desafio ${d.n}: ${d.texto}`;
});

const DESCRICAO = `Vamos brincar de quiz com a história de Daniel e os leões!

Daniel orava a Deus todos os dias, e Deus mandou um anjo para cuidar dele: os leões ficaram mansinhos a noite toda. A ovelhinha Tuti traz 12 desafios: achar o leãozinho que fugiu, contar os leões, descobrir o que falta no rei, de quem é a sombra, qual leão é o maior, o leão diferente, jogo da memória e muito mais. A criança tem 10 segundos para responder bem alto antes de a resposta aparecer. Não precisa saber ler: tudo é falado e toda opção é um desenho.

Feito para crianças de 3 a 7 anos. Bom para a escola dominical, o culto infantil e para brincar em casa. A história está em Daniel 6.

O que a criança aprende:
• Daniel orava a Deus todos os dias
• Deus mandou um anjo para cuidar de Daniel
• Os leões ficaram mansinhos
• Deus cuida de nós

Capítulos:
${capitulos.join('\n')}

#QuizBíblico #DanielEOsLeões #BíbliaParaCrianças`;

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
fs.writeFileSync(path.join(OUT, 'v21_titulo_descricao_tags.txt'), texto);
console.log(`título: ${TITULO.length} caracteres: ${TITULO}`);
// O YouTube conta cada tag de mais de uma palavra com 2 caracteres a mais (as aspas)
const contagemTags = TAGS.join(',').length + 2 * TAGS.filter((t) => t.includes(' ')).length;
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: cerca de ${contagemTags} caracteres na conta do YouTube (limite 500)`);
console.log(capitulos.join('\n'));
