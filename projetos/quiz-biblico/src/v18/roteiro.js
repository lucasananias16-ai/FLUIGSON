'use strict';
/**
 * Vídeo 18 — Quiz das Estações do Ano: texto exato da locução (12 desafios),
 * conforme v18-estacoes/01-narrativa.md. As opções são faladas na ordem da tela.
 */
module.exports = {
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10,
  cortes: {},
  abertura: 'Oi, amiguinho! A Tuti voltou! Hoje vamos brincar com as quatro estações do ano: primavera, verão, outono e inverno! São doze desafios. Vamos lá!',
  desafios: {
    1: { pergunta: 'A borboleta da primavera se escondeu! Você consegue encontrar?', resposta: 'Achou! Ela estava atrás da flor! Na primavera, o jardim fica cheio de flores.' },
    2: { pergunta: 'No outono, as folhas caem da árvore. Conte comigo!', contagem: 'Um... dois... três... quatro... cinco!', resposta: 'Cinco folhas! Muito bem!' },
    3: { pergunta: 'No verão faz calor! O que é gostoso no verão? O sorvete... o cachecol... ou a luva?', perguntaVoz: 'No verão faz calor!!... O que é gostoso no verão?!... O sorvete... o cachecol... ou a luva?!', resposta: 'O sorvete! Que delícia geladinha!' },
    4: { pergunta: 'De quem é essa sombra? Do guarda-chuva... do sorvete... ou do cachecol?', resposta: 'Do guarda-chuva! Ele protege a gente da chuva!' },
    5: { pergunta: 'O que está faltando na praia de verão? A lua... o sol... ou a nuvem?', resposta: 'O sol! No verão, o sol brilha forte!' },
    6: { pergunta: 'Qual girassol é o maior? O da esquerda... ou o da direita?', resposta: 'O da direita! Ele é bem alto!' },
    7: { pergunta: 'Uma destas folhas é diferente! Qual é?', resposta: 'A verde! As outras são laranjas, de outono!' },
    8: {
      pergunta: 'Olhe as estações! Qual vem depois? O inverno... o verão... ou o outono?',
      perguntaVoz: 'Olhe as estações!!... Qual vem depois?!... O inverno... o verão... ou o outono?!',
      resposta: 'O verão! Primavera, verão, outono, inverno!',
    },
    9: { pergunta: 'O que não combina com o inverno? O cachecol... a luva... ou a boia?', resposta: 'A boia! Ha ha! No frio ninguém vai nadar!' },
    10: {
      mostrar: 'Olhe bem onde a flor está.',
      pergunta: 'As cartas trocaram de lugar! Onde está a flor? No um... no dois... ou no três?',
      perguntaVoz: 'As cartas trocaram de lugar!!... Onde está a flor?!... No um... no dois... ou no três?!',
      resposta: 'No número dois! Você tem olho bom!',
    },
    11: { pergunta: 'Em qual estação as folhas caem? Na primavera... no outono... ou no verão?', resposta: 'No outono! As folhas ficam laranjas e caem!' },
    12: { pergunta: 'Em qual estação faz mais frio? No verão... no inverno... ou na primavera?', resposta: 'No inverno! Hora de pôr o casaco!' },
  },
  encerramento: 'Primavera, verão, outono e inverno! E sabia que aqui no Brasil o Natal é no verão? Até a próxima, amiguinho!',
};
