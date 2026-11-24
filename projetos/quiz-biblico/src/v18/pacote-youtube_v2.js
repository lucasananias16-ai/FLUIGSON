'use strict';
/**
 * Vídeo 18 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Versão 2 (padrão novo): título sem número e capítulos do vídeo v2.
 *
 * Uso: node src/v18/pacote-youtube_v2.js
 */
const fs = require('fs');
const path = require('path');
const desafios = require('./desafios');

const ROOT = path.resolve(__dirname, '..', '..');
const V18 = path.join(ROOT, 'v18-estacoes');
const OUT = path.join(V18, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V18, 'mapa-do-video_v2.json'), 'utf8'));

// Mesmo formato do título escolhido para o Vídeo 1: o termo de busca
// ("quiz bíblico") junto com o desafio. "Todas" = todas as respostas.
// Padrão novo (19/11/2026): sem numeração, no formato "[Tema] para Crianças [emoji] [Gancho] | Você acerta?"
const TITULO = 'Quiz das Estações do Ano para Crianças 🌸 Primavera, Verão, Outono e Inverno | Você acerta?';
// Reservas, caso a taxa de cliques peça um teste depois de publicar
const RESERVAS = [
  'Primavera, verão, outono e inverno: quiz para crianças com a ovelhinha Tuti',
  'As 4 estações do ano para crianças: 12 desafios',
  'Quiz das Estações para crianças de 3 a 7 anos',
];

const TAGS = [
  'estações do ano',
  'estações do ano para crianças',
  'primavera verão outono inverno',
  'as quatro estações',
  'quiz para crianças',
  'quiz infantil',
  'educação infantil',
  'atividade educativa infantil',
  'jogos educativos infantis',
  'desenho educativo',
  'aprender brincando',
  'ovelhinha Tuti',
];

const mmss = (s) => `${Math.floor(Math.round(s) / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`;
const capitulos = mapa.cenas.filter((c) => !['surpresa', 'metade', 'ultimo'].includes(c.cena)).map((c) => {
  if (c.cena === 'abertura') return `${mmss(c.inicio)} Abertura`;
  if (c.cena === 'encerramento') return `${mmss(c.inicio)} Encerramento`;
  const d = desafios.find((x) => `d${x.n}` === c.cena);
  return `${mmss(c.inicio)} Desafio ${d.n}: ${d.texto}`;
});

const DESCRICAO = `Vamos aprender as quatro estações do ano brincando de quiz!

A ovelhinha Tuti traz 12 desafios no parque: achar a borboleta da primavera, contar as folhas do outono, descobrir o que é gostoso no verão, o que falta na praia, de quem é a sombra, qual girassol é o maior, a folha diferente, a ordem das estações, jogo da memória e muito mais. A criança tem 10 segundos para responder bem alto antes de a resposta aparecer. Não precisa saber ler: tudo é falado e toda opção é um desenho.

Feito para crianças de 3 a 7 anos. Bom para a escola, a educação infantil e para brincar em casa.

O que a criança aprende:
• As quatro estações: primavera, verão, outono e inverno
• A ordem das estações
• O que acontece em cada uma (flores, calor, folhas caindo, frio)
• Que aqui no Brasil o Natal é no verão

Capítulos:
${capitulos.join('\n')}

#EstaçõesDoAno #EducaçãoInfantil #ParaCrianças`;

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
fs.writeFileSync(path.join(OUT, 'v18_v2_titulo_descricao_tags.txt'), texto);
console.log(`título: ${TITULO.length} caracteres: ${TITULO}`);
// O YouTube conta cada tag de mais de uma palavra com 2 caracteres a mais (as aspas)
const contagemTags = TAGS.join(',').length + 2 * TAGS.filter((t) => t.includes(' ')).length;
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: cerca de ${contagemTags} caracteres na conta do YouTube (limite 500)`);
console.log(capitulos.join('\n'));
