'use strict';
/**
 * Vídeo 24 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Versão 2 (padrão novo): título sem número e capítulos do vídeo v2.
 *
 * Uso: node src/v24/pacote-youtube.js
 */
const fs = require('fs');
const path = require('path');
const desafios = require('./desafios');

const ROOT = path.resolve(__dirname, '..', '..');
const V24 = path.join(ROOT, 'v24-biblico-ovelha-perdida');
const OUT = path.join(V24, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V24, 'mapa-do-video.json'), 'utf8'));

// Mesmo formato do título escolhido para o Vídeo 1: o termo de busca
// ("quiz bíblico") junto com o desafio. "Todas" = todas as respostas.
// Padrão novo (19/11/2026): sem numeração, no formato "[Tema] para Crianças [emoji] [Gancho] | Você acerta?"
const TITULO = 'Quiz Bíblico para Crianças 🐑 A Ovelhinha Perdida | Você acerta?';
// Reservas, caso a taxa de cliques peça um teste depois de publicar
const RESERVAS = [
  'A Ovelha Perdida para Crianças 🐑 Quiz Bíblico com a ovelhinha Tuti',
  'Parábola da Ovelha Perdida 🐑 12 brincadeiras para crianças',
  'O Bom Pastor e a Ovelhinha 🐑 Quiz Bíblico Infantil',
];

const TAGS = [
  'quiz bíblico infantil',
  'a ovelha perdida',
  'parábola da ovelha perdida',
  'o bom pastor',
  'parábolas de jesus para crianças',
  'histórias bíblicas para crianças',
  'bíblia para crianças',
  'quiz para crianças',
  'quiz infantil',
  'escola dominical',
  'culto infantil',
  'ministério infantil',
  'ovelhinha Tuti',
];

const roteiro = require('./roteiro');
const mmss = (s) => `${Math.floor(Math.round(s) / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`;
// neste vídeo a ordem dos jogos é outra: o nome da cena (d1 a d12) é o número da tela, e `roteiro.ordem` diz qual jogo é
const porTela = Object.fromEntries(Object.entries(roteiro.ordem).map(([dentro, tela]) => [tela, desafios.find((x) => x.n === Number(dentro))]));
const capitulos = mapa.cenas
  .filter((c) => /^d\d+$/.test(c.cena) || c.cena === 'encerramento')
  .map((c) => (c.cena === 'encerramento' ? `${mmss(c.inicio)} Encerramento` : `${mmss(c.inicio)} Brincadeira ${c.cena.slice(1)}: ${porTela[c.cena.slice(1)].texto}`));
// o "olhe bem" (d5a, d8a) faz parte da brincadeira: o capítulo começa nele
for (const k of [2, 8]) {
  const a = mapa.cenas.find((c) => c.cena === `d${k}a`);
  const i = capitulos.findIndex((x) => x.includes(`Brincadeira ${k}:`));
  capitulos[i] = `${mmss(a.inicio)} Brincadeira ${k}: ${porTela[k].texto}`;
}

const DESCRICAO = `Vamos brincar com o pastor e as ovelhinhas!

O pastor tinha muitas ovelhinhas. Uma saiu para passear e não voltou; ele procurou, achou e voltou feliz, com ela no colo. A ovelhinha Tuti traz 12 brincadeiras: achar a ovelhinha, quem chegou primeiro, o engraçadinho no meio das ovelhas, de quem é a sombra, contar as ovelhinhas, quem foi dar uma voltinha, jogo da memória e muito mais. A criança tem 10 segundos para responder bem alto antes de a resposta aparecer. Não precisa saber ler: tudo é falado e toda opção é um desenho.

Feito para crianças de 3 a 7 anos. Bom para a escola dominical, o culto infantil e para brincar em casa. A parábola está em Lucas 15.

O que a criança aprende:
• O pastor ama cada ovelhinha
• Ele procurou a ovelhinha até achar
• Jesus cuida da gente com carinho
• Contar até 5, comparar tamanhos e treinar a memória

Capítulos:
${capitulos.join('\n')}

#QuizBíblico #OvelhaPerdida #BíbliaParaCrianças`;

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
fs.writeFileSync(path.join(OUT, 'v24_titulo_descricao_tags.txt'), texto);
console.log(`título: ${TITULO.length} caracteres: ${TITULO}`);
// O YouTube conta cada tag de mais de uma palavra com 2 caracteres a mais (as aspas)
const contagemTags = TAGS.join(',').length + 2 * TAGS.filter((t) => t.includes(' ')).length;
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: cerca de ${contagemTags} caracteres na conta do YouTube (limite 500)`);
console.log(capitulos.join('\n'));
