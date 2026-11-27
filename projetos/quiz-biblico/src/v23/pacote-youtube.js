'use strict';
/**
 * Vídeo 23 — textos do pacote do YouTube: título, descrição com capítulos e
 * tags. Os capítulos saem do mapa do vídeo, então acompanham qualquer
 * mudança de duração.
 *
 * Versão 2 (padrão novo): título sem número e capítulos do vídeo v2.
 *
 * Uso: node src/v23/pacote-youtube.js
 */
const fs = require('fs');
const path = require('path');
const desafios = require('./desafios');

const ROOT = path.resolve(__dirname, '..', '..');
const V23 = path.join(ROOT, 'v23-natal-reis-magos');
const OUT = path.join(V23, 'youtube');
const mapa = JSON.parse(fs.readFileSync(path.join(V23, 'mapa-do-video.json'), 'utf8'));

// Mesmo formato do título escolhido para o Vídeo 1: o termo de busca
// ("quiz bíblico") junto com o desafio. "Todas" = todas as respostas.
// Padrão novo (19/11/2026): sem numeração, no formato "[Tema] para Crianças [emoji] [Gancho] | Você acerta?"
const TITULO = 'Quiz de Natal para Crianças ⭐ Os Reis Magos e a Estrela | Você acerta?';
// Reservas, caso a taxa de cliques peça um teste depois de publicar
const RESERVAS = [
  'Os Três Reis Magos para Crianças ⭐ Quiz de Natal com a ovelhinha Tuti',
  'Quiz Bíblico de Natal ⭐ Os Reis Magos, o Camelo e a Estrela',
  'A Estrela de Belém para Crianças ⭐ 12 brincadeiras',
];

const TAGS = [
  'quiz de natal',
  'reis magos',
  'os três reis magos',
  'estrela de belém',
  'natal de jesus',
  'quiz bíblico infantil',
  'histórias bíblicas para crianças',
  'natal para crianças',
  'quiz para crianças',
  'quiz infantil',
  'escola dominical',
  'culto infantil',
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
for (const k of [5, 8]) {
  const a = mapa.cenas.find((c) => c.cena === `d${k}a`);
  const i = capitulos.findIndex((x) => x.includes(`Brincadeira ${k}:`));
  capitulos[i] = `${mmss(a.inicio)} Brincadeira ${k}: ${porTela[k].texto}`;
}

const DESCRICAO = `Vamos passear com os três reis magos e seguir a estrela!

Os reis magos viajaram pelo deserto, de camelo, seguindo uma estrela brilhante, e levaram presentes para o menino Jesus. A ovelhinha Tuti traz 12 brincadeiras: descobrir de quem é a sombra, achar a coroa, contar os camelos, o presente que sumiu, quem chegou primeiro, a coroa diferente, jogo da memória e muito mais. A criança tem 10 segundos para responder bem alto antes de a resposta aparecer. Não precisa saber ler: tudo é falado e toda opção é um desenho.

Feito para crianças de 3 a 7 anos. Bom para o Natal em casa, a escola dominical e o culto infantil. A história está em Mateus 2.

O que a criança aprende:
• Os reis magos seguiram a estrela
• Eles levaram presentes para o menino Jesus
• Contar até 5, comparar tamanhos e treinar a memória

Capítulos:
${capitulos.join('\n')}

#QuizDeNatal #ReisMagos #NatalParaCrianças`;

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
fs.writeFileSync(path.join(OUT, 'v23_titulo_descricao_tags.txt'), texto);
console.log(`título: ${TITULO.length} caracteres: ${TITULO}`);
// O YouTube conta cada tag de mais de uma palavra com 2 caracteres a mais (as aspas)
const contagemTags = TAGS.join(',').length + 2 * TAGS.filter((t) => t.includes(' ')).length;
console.log(`descrição: ${DESCRICAO.length} caracteres (limite 5000) | tags: cerca de ${contagemTags} caracteres na conta do YouTube (limite 500)`);
console.log(capitulos.join('\n'));
