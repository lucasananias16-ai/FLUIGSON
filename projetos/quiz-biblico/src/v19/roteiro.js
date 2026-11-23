'use strict';
/**
 * Vídeo 19 — Quiz de Natal 9: o Natal no Verão: texto exato da locução (12 desafios),
 * conforme v19-natal-verao/01-narrativa.md. As opções são faladas na ordem da tela.
 */
module.exports = {
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10,
  cortes: {},
  abertura: 'Oi, amiguinho! A Tuti voltou! Aqui no Brasil o Natal é no verão, e hoje a festa é na praia! São doze desafios. Vamos lá!',
  desafios: {
    1: { pergunta: 'O Papai Noel se escondeu na praia! Você consegue encontrar?', resposta: 'Achou! Ele estava atrás do guarda-sol! Fugindo do calor!' },
    2: { pergunta: 'Tem conchinhas na areia. Conte comigo!', contagem: 'Um... dois... três... quatro... cinco!', resposta: 'Cinco conchinhas! Muito bem!' },
    3: { pergunta: 'Está calor! O que é bom para se refrescar? A sopa quente... a água de coco... ou o chocolate quente?', perguntaVoz: 'Está calor!!... O que é bom para se refrescar?!... A sopa quente... a água de coco... ou o chocolate quente?!', resposta: 'A água de coco! Geladinha!' },
    4: { pergunta: 'De quem é essa sombra? Do barco... do trenó... ou do castelo de areia?', resposta: 'Do castelo de areia! Que castelo bonito!' },
    5: { pergunta: 'O que está faltando na árvore de Natal da praia? A estrela... o peixe... ou a concha?', resposta: 'A estrela! Agora a árvore brilha!' },
    6: { pergunta: 'Qual castelo de areia é o maior? O da esquerda... ou o da direita?', resposta: 'O da direita! Que castelão!' },
    7: { pergunta: 'Um destes sorvetes é diferente! Qual é?', resposta: 'O de chocolate! Os outros são de morango!' },
    8: {
      pergunta: 'Olhe a fila na areia! O que vem depois? A concha... a estrela-do-mar... ou o peixe?',
      perguntaVoz: 'Olhe a fila na areia!!... O que vem depois?!... A concha... a estrela-do-mar... ou o peixe?!',
      resposta: 'A estrela-do-mar! Concha, estrela, concha, estrela!',
    },
    9: { pergunta: 'O que não combina com a praia no verão? O casaco de frio... o guarda-sol... ou o chinelo?', resposta: 'O casaco de frio! Ha ha! Na praia não precisa!' },
    10: {
      mostrar: 'Olhe bem onde o presente está.',
      pergunta: 'As cartas trocaram de lugar! Onde está o presente? No um... no dois... ou no três?',
      perguntaVoz: 'As cartas trocaram de lugar!!... Onde está o presente?!... No um... no dois... ou no três?!',
      resposta: 'No número três! Você tem olho bom!',
    },
    11: { pergunta: 'O que o Papai Noel veste na praia? O casaco... o cachecol... ou a bermuda?', resposta: 'A bermuda! Fresquinho!' },
    12: { pergunta: 'Em qual estação é o Natal aqui no Brasil? No inverno... no verão... ou no outono?', resposta: 'No verão! Natal com sol e calor!' },
  },
  encerramento: 'Natal no calor também é muito bom! Feliz Natal, amiguinho! Até a próxima!',
  // Versão 2 (padrão novo de 19/11/2026): começa no desafio 1, com gancho, reganchos e convite no fim
  v2: {
    p1_pergunta: 'Socorro! O Papai Noel fugiu! Você me ajuda a achar? Rápido, aponta pra ele!',
    gancho: 'Você é demais! São doze desafios, e o último é o mais difícil de todos. Vamos?',
    surpresa: 'Agora vem um desafio surpresa!',
    metade: 'Metade! Você está indo muito bem!',
    ultimo: 'E agora, o último desafio! O mais difícil de todos!',
    encerramento: 'Uhuu! Você completou os doze desafios! Feliz Natal, amiguinho! Vem jogar o próximo quiz comigo!',
  },
};
