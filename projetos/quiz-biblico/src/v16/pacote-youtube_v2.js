'use strict';
/**
 * Vídeo 16 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Versão 2 (padrão novo): título sem número e capítulos do vídeo v2.
 *
 * Uso: node src/v16/pacote-youtube_v2.js
 */
const fs = require('fs');
const path = require('path');
const desafios = require('./desafios');

const ROOT = path.resolve(__dirname, '..', '..');
const V16 = path.join(ROOT, 'v16-biblico-criacao');
const OUT = path.join(V16, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V16, 'mapa-do-video_v2.json'), 'utf8'));

// Mesmo formato do título escolhido para o Vídeo 1: o termo de busca
// ("quiz bíblico") junto com o desafio. "Todas" = todas as respostas.
// Padrão novo (19/11/2026): sem numeração, no formato "[Tema] para Crianças [emoji] [Gancho] | Você acerta?"
const TITULO = 'Quiz Bíblico para Crianças 🌍 A Criação do Mundo | Você acerta?';
// Reservas, caso a taxa de cliques peça um teste depois de publicar
const RESERVAS = [
  'Quiz da Criação para crianças: você vence os 12 desafios?',
  'Quiz Bíblico Infantil: Deus criou o mundo | 12 desafios com a ovelhinha Tuti',
  'A Criação do Mundo: quiz bíblico para crianças de 3 a 7 anos',
];

const TAGS = [
  'quiz bíblico infantil',
  'a criação do mundo',
  'criação do mundo para crianças',
  'deus criou o mundo',
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
const capitulos = mapa.cenas.filter((c) => !['surpresa', 'metade', 'ultimo'].includes(c.cena)).map((c) => {
  if (c.cena === 'abertura') return `${mmss(c.inicio)} Abertura`;
  if (c.cena === 'encerramento') return `${mmss(c.inicio)} Encerramento`;
  const d = desafios.find((x) => `d${x.n}` === c.cena);
  return `${mmss(c.inicio)} Desafio ${d.n}: ${d.texto}`;
});

const DESCRICAO = `Vamos brincar de quiz com a história de como Deus criou o mundo!

A ovelhinha Tuti traz 12 desafios num jardim lindo: achar o passarinho escondido, contar as estrelas, dizer o que Deus fez primeiro, descobrir o que falta no céu da noite, de quem é a sombra, quem é o maior, a flor diferente, jogo da memória e muito mais. A criança tem 10 segundos para responder bem alto antes de a resposta aparecer. Não precisa saber ler: tudo é falado e toda opção é um desenho.

Feito para crianças de 3 a 7 anos. Bom para a hora da história em casa, a escola dominical, o culto infantil ou a sala de aula.

O que a criança aprende:
• Deus fez a luz, o céu, o mar e as plantas
• Deus fez o sol, a lua e as estrelas
• Deus fez os peixes, os passarinhos e todos os bichos
• No sétimo dia, Deus descansou
• Tudo o que Deus fez era muito bom

Capítulos:
${capitulos.join('\n')}

Base bíblica: Gênesis, capítulos 1 e 2.

#QuizBíblico #CriaçãoDoMundo #BíbliaParaCrianças`;

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
fs.writeFileSync(path.join(OUT, 'v16_v2_titulo_descricao_tags.txt'), texto);
console.log(`título: ${TITULO.length} caracteres: ${TITULO}`);
// O YouTube conta cada tag de mais de uma palavra com 2 caracteres a mais (as aspas)
const contagemTags = TAGS.join(',').length + 2 * TAGS.filter((t) => t.includes(' ')).length;
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: cerca de ${contagemTags} caracteres na conta do YouTube (limite 500)`);
console.log(capitulos.join('\n'));
