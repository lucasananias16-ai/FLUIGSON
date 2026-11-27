'use strict';
/**
 * Vídeo 22 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Versão 2 (padrão novo): título sem número e capítulos do vídeo v2.
 *
 * Uso: node src/v22/pacote-youtube.js
 */
const fs = require('fs');
const path = require('path');
const desafios = require('./desafios');

const ROOT = path.resolve(__dirname, '..', '..');
const V22 = path.join(ROOT, 'v22-natal-vespera');
const OUT = path.join(V22, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V22, 'mapa-do-video.json'), 'utf8'));

// Mesmo formato do título escolhido para o Vídeo 1: o termo de busca
// ("quiz bíblico") junto com o desafio. "Todas" = todas as respostas.
// Padrão novo (19/11/2026): sem numeração, no formato "[Tema] para Crianças [emoji] [Gancho] | Você acerta?"
const TITULO = 'Quiz de Natal para Crianças 🧦 A Véspera de Natal | Você acerta?';
// Reservas, caso a taxa de cliques peça um teste depois de publicar
const RESERVAS = [
  'Véspera de Natal para Crianças 🧦 Quiz com a ovelhinha Tuti | Você acerta?',
  'Quiz de Natal Infantil 🍪 O Leite e os Biscoitos do Papai Noel',
  'A Noite de Natal para Crianças 🌙 12 desafios',
];

const TAGS = [
  'quiz de natal',
  'véspera de natal',
  'noite de natal',
  'meia de natal',
  'papai noel para crianças',
  'natal para crianças',
  'jogos de natal para crianças',
  'desafios de natal',
  'quiz para crianças',
  'quiz infantil',
  'brincadeira de natal',
  'desenho infantil de natal',
  'ovelhinha Tuti',
];

const mmss = (s) => `${Math.floor(Math.round(s) / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`;
const capitulos = mapa.cenas.filter((c) => !['surpresa', 'metade', 'ultimo'].includes(c.cena)).map((c) => {
  if (c.cena === 'abertura') return `${mmss(c.inicio)} Abertura`;
  if (c.cena === 'encerramento') return `${mmss(c.inicio)} Encerramento`;
  const d = desafios.find((x) => `d${x.n}` === c.cena);
  return `${mmss(c.inicio)} Desafio ${d.n}: ${d.texto}`;
});

const DESCRICAO = `Vamos brincar de quiz na véspera de Natal!

A lareira está acesa, as meias estão penduradas e o leite com biscoito já espera o Papai Noel. A ovelhinha Tuti traz 12 desafios: achar o biscoito que fugiu, contar as meias, descobrir o que falta na lareira, de quem é a sombra, qual meia é a maior, a meia diferente, jogo da memória e muito mais. A criança tem 10 segundos para responder bem alto antes de a resposta aparecer. Não precisa saber ler: tudo é falado e toda opção é um desenho.

Feito para crianças de 3 a 7 anos. Mais um quiz de Natal do canal, na playlist Quiz de Natal.

O que a criança treina:
• Observar e achar o que está escondido
• Contar até 5
• Perceber o que está faltando
• Reconhecer um desenho pela sombra
• Comparar tamanhos
• Achar o que é diferente
• Continuar uma sequência
• A memória
• Manhã, tarde e noite

Capítulos:
${capitulos.join('\n')}

#QuizDeNatal #VésperaDeNatal #NatalParaCrianças`;

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
fs.writeFileSync(path.join(OUT, 'v22_titulo_descricao_tags.txt'), texto);
console.log(`título: ${TITULO.length} caracteres: ${TITULO}`);
// O YouTube conta cada tag de mais de uma palavra com 2 caracteres a mais (as aspas)
const contagemTags = TAGS.join(',').length + 2 * TAGS.filter((t) => t.includes(' ')).length;
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: cerca de ${contagemTags} caracteres na conta do YouTube (limite 500)`);
console.log(capitulos.join('\n'));
