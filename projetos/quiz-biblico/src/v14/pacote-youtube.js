'use strict';
/**
 * Vídeo 14 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Uso: node src/v14/pacote-youtube.js
 */
const fs = require('fs');
const path = require('path');
const desafios = require('./desafios');

const ROOT = path.resolve(__dirname, '..', '..');
const V14 = path.join(ROOT, 'v14-jogo-da-memoria');
const OUT = path.join(V14, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V14, 'mapa-do-video.json'), 'utf8'));

// Mesmo formato do título escolhido para o Vídeo 1: o termo de busca
// ("quiz bíblico") junto com o desafio. "Todas" = todas as respostas.
const TITULO = 'Jogo da Memória para crianças: você lembra de tudo? | 12 desafios com a Tuti';
// Reservas, caso a taxa de cliques peça um teste depois de publicar
const RESERVAS = [
  'Jogo da Memória Infantil: 12 desafios para treinar a memória',
  'Você lembra? Jogo da memória para crianças de 3 a 7 anos',
  'Teste de memória para crianças com a ovelhinha Tuti',
];

const TAGS = [
  'jogo da memória',
  'jogo da memória infantil',
  'jogo da memória para crianças',
  'teste de memória',
  'atividade de memória para crianças',
  'jogos educativos infantis',
  'quiz para crianças',
  'quiz infantil',
  'atenção e memória',
  'educação infantil',
  'brincadeira educativa',
  'desenho educativo',
  'ovelhinha Tuti',
];

const mmss = (s) => `${Math.floor(Math.round(s) / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`;
// as cenas dNa (os desenhos que aparecem antes da pergunta) abrem o capítulo do desafio N
const capitulos = [];
for (const c of mapa.cenas) {
  if (c.cena === 'abertura') capitulos.push(`${mmss(c.inicio)} Abertura`);
  else if (c.cena === 'encerramento') capitulos.push(`${mmss(c.inicio)} Encerramento`);
  else {
    const m = c.cena.match(/^d(\d+)(a?)$/);
    const jaAberto = !m[2] && mapa.cenas.some((x) => x.cena === `d${m[1]}a`);
    if (jaAberto) continue;
    const d = desafios.find((x) => x.n === +m[1]);
    capitulos.push(`${mmss(c.inicio)} Desafio ${d.n}: ${d.texto}`);
  }
}

const DESCRICAO = `Vamos treinar a memória com a ovelhinha Tuti!

São 12 desafios de 5 jogos diferentes: cartas que trocam de lugar, o que sumiu, de que cor era, quantos tinha e quem apareceu primeiro. Olhe bem, guarde na memória e responda bem alto! A criança tem 10 segundos para pensar antes de a resposta aparecer. Não precisa saber ler: tudo é falado e toda opção é um desenho.

Feito para crianças de 3 a 7 anos. Bom para brincar em casa, na escola ou no carro.

O que a criança treina:
• Memória visual
• Atenção e concentração
• Cores e quantidades
• Ordem (primeiro e último)

Capítulos:
${capitulos.join('\n')}

#JogoDaMemória #JogosEducativos #ParaCrianças`;

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
fs.writeFileSync(path.join(OUT, 'v14_titulo_descricao_tags.txt'), texto);
console.log(`título: ${TITULO.length} caracteres: ${TITULO}`);
// O YouTube conta cada tag de mais de uma palavra com 2 caracteres a mais (as aspas)
const contagemTags = TAGS.join(',').length + 2 * TAGS.filter((t) => t.includes(' ')).length;
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: cerca de ${contagemTags} caracteres na conta do YouTube (limite 500)`);
console.log(capitulos.join('\n'));
