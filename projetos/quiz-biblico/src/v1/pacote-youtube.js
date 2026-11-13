'use strict';
/**
 * Vídeo 1 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Uso: node src/v1/pacote-youtube.js
 */
const fs = require('fs');
const path = require('path');
const perguntas = require('./opcoes');

const ROOT = path.resolve(__dirname, '..', '..');
const V1 = path.join(ROOT, 'v1-arca-de-noe');
const OUT = path.join(V1, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V1, 'mapa-do-video.json'), 'utf8'));

const TITULOS = [
  'Quiz da Arca de Noé para crianças: você consegue acertar todas?',
  'Quiz Bíblico Infantil: Arca de Noé | 8 perguntas com a ovelhinha Tuti',
  'Arca de Noé: quiz bíblico para crianças de 3 a 7 anos',
];

const TAGS = [
  'quiz bíblico infantil',
  'arca de noé',
  'quiz da arca de noé',
  'histórias bíblicas para crianças',
  'bíblia para crianças',
  'quiz para crianças',
  'noé e a arca',
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
  const q = perguntas.find((x) => `p${x.n}` === c.cena);
  return `${mmss(c.inicio)} Pergunta ${q.n}: ${q.texto.replace('NÃO', 'não')}`;
});

const DESCRICAO = `Vamos brincar de quiz com a história da Arca de Noé!

A ovelhinha Tuti faz 8 perguntas, e a criança tem 10 segundos para responder bem alto antes de o card certo aparecer. Não precisa saber ler: toda pergunta é falada e toda opção é um desenho.

Feito para crianças de 3 a 7 anos. Bom para a hora da história em casa, a escola dominical, o culto infantil ou a sala de aula.

O que a criança aprende:
• Quem construiu a arca e de que ela foi feita
• Como os animais entraram
• Por quantos dias choveu
• Qual passarinho trouxe a folhinha para Noé
• O que o arco-íris quer dizer

Capítulos:
${capitulos.join('\n')}

Base bíblica: Gênesis, capítulos 6 a 9.

#QuizBíblico #ArcaDeNoé #BíbliaParaCrianças`;

const texto = `TÍTULO (escolha um)
${TITULOS.map((t, i) => `${i + 1}. ${t}`).join('\n')}

----------------------------------------------------------------------
DESCRIÇÃO (copie daqui até a linha das hashtags)
----------------------------------------------------------------------
${DESCRICAO}

----------------------------------------------------------------------
TAGS (copie a linha inteira e cole no campo "Tags")
----------------------------------------------------------------------
${TAGS.join(', ')}
`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'v1_titulo_descricao_tags.txt'), texto);
console.log(TITULOS.map((t) => `${t.length} caracteres: ${t}`).join('\n'));
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: ${TAGS.join(',').length} caracteres (limite 500)`);
console.log(capitulos.join('\n'));
