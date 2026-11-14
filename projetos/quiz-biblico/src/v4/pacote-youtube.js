'use strict';
/**
 * Vídeo 4 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Uso: node src/v2/pacote-youtube.js
 */
const fs = require('fs');
const path = require('path');
const desafios = require('./desafios');

const ROOT = path.resolve(__dirname, '..', '..');
const V4 = path.join(ROOT, 'v4-papai-noel');
const OUT = path.join(V4, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V4, 'mapa-do-video.json'), 'utf8'));

// Título com o termo de busca ("quiz de natal") e o desafio. "Todas" = todas as respostas.
const TITULO = 'Quiz de Natal do Papai Noel para crianças: você acerta todas?';
// Reservas, caso a taxa de cliques peça um teste depois de publicar
const RESERVAS = [
  'Quiz do Papai Noel para crianças: você vence os 8 desafios?',
  'Quiz de Natal Infantil: 8 desafios com o Papai Noel e a ovelhinha Tuti',
  'Papai Noel: quiz de Natal para crianças de 3 a 7 anos',
];

const TAGS = [
  'quiz de natal',
  'quiz do papai noel',
  'papai noel para crianças',
  'natal para crianças',
  'jogos de natal para crianças',
  'desafios de natal',
  'perguntas de natal',
  'quiz para crianças',
  'quiz infantil',
  'renas do papai noel',
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

const DESCRICAO = `Vamos brincar de quiz de Natal com o Papai Noel!

A ovelhinha Tuti, de gorro vermelho, traz 8 desafios: achar o Papai Noel no esconde-esconde, contar as renas, descobrir de que cor é a roupa dele, adivinhar uma sombra, jogo da memória e muito mais. A criança tem 10 segundos para responder bem alto antes de a resposta aparecer e, num dos desafios, conta junto com a Tuti. Não precisa saber ler: tudo é falado e toda opção é um desenho.

Feito para crianças de 3 a 7 anos. Bom para a hora da história em casa, a escola dominical, o culto infantil ou a sala de aula, na época do Natal.

O que a criança treina:
• As cores (a roupa do Papai Noel)
• Contar até 4 com as renas
• Observar e achar o que está escondido
• Comparar tamanhos: quem é o maior
• A memória, acompanhando um presente que troca de lugar

Capítulos:
${capitulos.join('\n')}

#QuizDeNatal #PapaiNoel #NatalParaCrianças`;

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
fs.writeFileSync(path.join(OUT, 'v4_titulo_descricao_tags.txt'), texto);
console.log(`título: ${TITULO.length} caracteres: ${TITULO}`);
// O YouTube conta cada tag de mais de uma palavra com 2 caracteres a mais (as aspas)
const contagemTags = TAGS.join(',').length + 2 * TAGS.filter((t) => t.includes(' ')).length;
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: cerca de ${contagemTags} caracteres na conta do YouTube (limite 500)`);
console.log(capitulos.join('\n'));
