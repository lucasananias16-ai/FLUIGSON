'use strict';
/**
 * Vídeo 20 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Versão 2 (padrão novo): título sem número e capítulos do vídeo v2.
 *
 * Uso: node src/v20/pacote-youtube_v2.js
 */
const fs = require('fs');
const path = require('path');
const desafios = require('./desafios');

const ROOT = path.resolve(__dirname, '..', '..');
const V20 = path.join(ROOT, 'v20-natal-polo-norte');
const OUT = path.join(V20, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V20, 'mapa-do-video_v2.json'), 'utf8'));

// Título com o termo de busca ("quiz de natal") e o desafio. "Todas" = todas as respostas.
// Padrão novo (19/11/2026): sem numeração, no formato "[Tema] para Crianças [emoji] [Gancho] | Você acerta?"
const TITULO = 'Quiz de Natal para Crianças 🐧 O Natal no Polo Norte | Você acerta?';
// Reservas, caso a taxa de cliques peça um teste depois de publicar
const RESERVAS = [
  'A casa do Papai Noel no Polo Norte: quiz de Natal com a ovelhinha Tuti',
  'Pinguim, urso-polar e aurora: quiz de Natal para crianças',
  'Quiz de Natal no Polo Norte para crianças de 3 a 7 anos',
];

const TAGS = [
  'quiz de natal',
  'polo norte',
  'casa do papai noel',
  'pinguim',
  'urso polar',
  'animais do frio',
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

const DESCRICAO = `Vamos brincar de quiz no Polo Norte, a casa do Papai Noel!

A ovelhinha Tuti visita o gelo, com a aurora colorida no céu, e traz 12 desafios: achar o pinguim escondido, contar os peixinhos, descobrir a roupa do frio, o que falta na casinha do Papai Noel, de quem é a sombra, qual urso-polar é o maior, o pinguim diferente, quem não mora no Polo Norte, jogo da memória e muito mais. A criança tem 10 segundos para responder bem alto antes de a resposta aparecer. Não precisa saber ler: tudo é falado e toda opção é um desenho.

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
• E conhece os bichinhos do frio: pinguim, urso-polar e foca

Capítulos:
${capitulos.join('\n')}

#QuizDeNatal #PoloNorte #NatalParaCrianças`;

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
fs.writeFileSync(path.join(OUT, 'v20_v2_titulo_descricao_tags.txt'), texto);
console.log(`título: ${TITULO.length} caracteres: ${TITULO}`);
// O YouTube conta cada tag de mais de uma palavra com 2 caracteres a mais (as aspas)
const contagemTags = TAGS.join(',').length + 2 * TAGS.filter((t) => t.includes(' ')).length;
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: cerca de ${contagemTags} caracteres na conta do YouTube (limite 500)`);
console.log(capitulos.join('\n'));
