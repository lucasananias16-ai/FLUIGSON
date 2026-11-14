'use strict';
/**
 * Vídeo 11 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Uso: node src/v11/pacote-youtube.js
 */
const fs = require('fs');
const path = require('path');
const desafios = require('./desafios');

const ROOT = path.resolve(__dirname, '..', '..');
const V11 = path.join(ROOT, 'v11-natal-ceia');
const OUT = path.join(V11, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V11, 'mapa-do-video.json'), 'utf8'));

// Título com o termo de busca ("quiz de natal") e o desafio. "Todas" = todas as respostas.
const TITULO = 'Quiz de Natal 5: a Ceia e os Doces | você acerta todas?';
// Reservas, caso a taxa de cliques peça um teste depois de publicar
const RESERVAS = [
  'Quiz da Ceia de Natal para crianças: 8 desafios com a ovelhinha Tuti',
  'Ache o biscoito de gengibre! Quiz de Natal infantil',
  'Quiz dos Doces de Natal para crianças de 3 a 7 anos',
];

const TAGS = [
  'quiz de natal',
  'ceia de natal',
  'doces de natal',
  'biscoito de gengibre',
  'panetone',
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

const DESCRICAO = `Vamos arrumar a mesa da ceia de Natal brincando de quiz!

A ovelhinha Tuti traz 8 desafios na cozinha: achar o biscoito de gengibre que fugiu, contar as velas, descobrir de quem é a sombra, achar o biscoito em forma de estrela, dizer qual panetone é o maior, continuar a fila de doces, jogo da memória e muito mais. A criança tem 10 segundos para responder bem alto antes de a resposta aparecer. Não precisa saber ler: tudo é falado e toda opção é um desenho.

Feito para crianças de 3 a 7 anos. Este é o quinto quiz de Natal do canal e fecha a série, depois do Quiz do Papai Noel, da Oficina dos Duendes, da Árvore de Natal e das Renas e o Trenó.

O que a criança treina:
• Observar e achar o que está escondido
• Contar até 5
• Reconhecer um desenho pela sombra
• Reconhecer formas (estrela, coração e círculo)
• Comparar tamanhos
• Continuar uma sequência
• A memória

Capítulos:
${capitulos.join('\n')}

#QuizDeNatal #CeiaDeNatal #NatalParaCrianças`;

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
fs.writeFileSync(path.join(OUT, 'v11_titulo_descricao_tags.txt'), texto);
console.log(`título: ${TITULO.length} caracteres: ${TITULO}`);
// O YouTube conta cada tag de mais de uma palavra com 2 caracteres a mais (as aspas)
const contagemTags = TAGS.join(',').length + 2 * TAGS.filter((t) => t.includes(' ')).length;
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: cerca de ${contagemTags} caracteres na conta do YouTube (limite 500)`);
console.log(capitulos.join('\n'));
