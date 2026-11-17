'use strict';
/**
 * Vídeo 17 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Uso: node src/v17/pacote-youtube.js
 */
const fs = require('fs');
const path = require('path');
const desafios = require('./desafios');

const ROOT = path.resolve(__dirname, '..', '..');
const V17 = path.join(ROOT, 'v17-natal-floresta');
const OUT = path.join(V17, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V17, 'mapa-do-video.json'), 'utf8'));

// Título com o termo de busca ("quiz de natal") e o desafio. "Todas" = todas as respostas.
const TITULO = 'Quiz de Natal 8: o Natal na Floresta | você acerta todas?';
// Reservas, caso a taxa de cliques peça um teste depois de publicar
const RESERVAS = [
  'Natal na Floresta: quiz de Natal para crianças com a ovelhinha Tuti',
  'A festa de Natal dos bichinhos da floresta: quiz infantil',
  'Quiz de Natal dos Bichinhos para crianças de 3 a 7 anos',
];

const TAGS = [
  'quiz de natal',
  'natal na floresta',
  'bichinhos da floresta',
  'animais para crianças',
  'coelho esquilo urso',
  'papai noel para crianças',
  'natal para crianças',
  'jogos de natal para crianças',
  'desafios de natal',
  'perguntas de natal',
  'quiz para crianças',
  'quiz infantil',
  'brincadeira de natal',
  'desenho infantil de natal',
  'ovelhinha Tuti',
  'escola dominical',
  'ebd infantil',
  'culto infantil',
  'ministério infantil',
];

const mmss = (s) => `${Math.floor(Math.round(s) / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`;
const capitulos = mapa.cenas.map((c) => {
  if (c.cena === 'abertura') return `${mmss(c.inicio)} Abertura`;
  if (c.cena === 'encerramento') return `${mmss(c.inicio)} Encerramento`;
  const d = desafios.find((x) => `d${x.n}` === c.cena);
  return `${mmss(c.inicio)} Desafio ${d.n}: ${d.texto}`;
});

const DESCRICAO = `Vamos fazer a festa de Natal dos bichinhos da floresta brincando de quiz!

A ovelhinha Tuti traz 12 desafios numa clareira cheia de neve: achar o esquilo escondido, contar as pinhas, descobrir o que o coelhinho come, o que falta no pinheiro, de quem é a sombra, quem é o maior, o coelhinho diferente, jogo da memória e muito mais. A criança tem 10 segundos para responder bem alto antes de a resposta aparecer. Não precisa saber ler: tudo é falado e toda opção é um desenho.

Feito para crianças de 3 a 7 anos. Mais um quiz de Natal do canal, na playlist Quiz de Natal. No fim, uma mensagem de amizade: no Natal, a gente fica junto de quem a gente ama.

O que a criança treina:
• Observar e achar o que está escondido
• Contar até 5
• Perceber o que está faltando
• Reconhecer um desenho pela sombra
• Comparar tamanhos
• Achar o que é diferente
• Continuar uma sequência
• A memória

Capítulos:
${capitulos.join('\n')}

#QuizDeNatal #NatalNaFloresta #NatalParaCrianças`;

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
fs.writeFileSync(path.join(OUT, 'v17_titulo_descricao_tags.txt'), texto);
console.log(`título: ${TITULO.length} caracteres: ${TITULO}`);
// O YouTube conta cada tag de mais de uma palavra com 2 caracteres a mais (as aspas)
const contagemTags = TAGS.join(',').length + 2 * TAGS.filter((t) => t.includes(' ')).length;
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: cerca de ${contagemTags} caracteres na conta do YouTube (limite 500)`);
console.log(capitulos.join('\n'));
