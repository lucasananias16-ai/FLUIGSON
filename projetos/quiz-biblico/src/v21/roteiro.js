'use strict';
/**
 * Vídeo 21 — Quiz Bíblico: Daniel e os Leões: texto exato da locução (12 desafios),
 * conforme v21-biblico-daniel/01-narrativa.md. As opções são faladas na ordem da tela.
 * Já nasce no padrão novo (19/11/2026): as falas `v2` são as que o vídeo usa
 * (começo no desafio 1, gancho, reganchos e convite no fim).
 */
module.exports = {
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10,
  cortes: {},
  abertura: 'Oi, amiguinho! A Tuti voltou! Hoje a história é de Daniel e os leões! São doze desafios. Vamos lá!',
  desafios: {
    1: { pergunta: 'O leãozinho se escondeu! Você consegue encontrar?', resposta: 'Achou! Ele estava atrás da pedra! Que leãozinho levado!' },
    2: { pergunta: 'Na cova tinha muitos leões. Conte comigo!', contagem: 'Um... dois... três... quatro... cinco!', resposta: 'Cinco leões! Muito bem!' },
    3: { pergunta: 'Daniel falava com Deus todos os dias! O que ele fazia? Orava... pescava... ou dormia?', perguntaVoz: 'Daniel falava com Deus todos os dias!!... O que ele fazia?!... Orava... pescava... ou dormia?!', resposta: 'Orava! Daniel amava conversar com Deus!' },
    4: { pergunta: 'De quem é essa sombra? Da ovelha... do leão... ou do camelo?', resposta: 'Do leão! Olha a juba dele!' },
    5: { pergunta: 'O que está faltando no rei? O chapéu... o gorro... ou a coroa?', resposta: 'A coroa! Todo rei usa coroa!' },
    6: { pergunta: 'Qual leão é o maior? O da esquerda... ou o da direita?', resposta: 'O da direita! Que leãozão!' },
    7: { pergunta: 'Um destes leões é diferente! Qual é?', resposta: 'O que está dormindo! Os outros estão acordados!' },
    8: {
      pergunta: 'Olhe o céu! O que vem depois? A lua... a estrela... ou o sol?',
      perguntaVoz: 'Olhe o céu!!... O que vem depois?!... A lua... a estrela... ou o sol?!',
      resposta: 'A lua! Sol, lua, sol, lua! Daniel passou a noite toda com os leões.',
    },
    9: { pergunta: 'O que não tinha na cova dos leões? A pedra... o leão... ou a televisão?', resposta: 'A televisão! Ha ha! Naquele tempo nem existia!' },
    10: {
      mostrar: 'Olhe bem onde o anjo está.',
      pergunta: 'As cartas trocaram de lugar! Onde está o anjo? No um... no dois... ou no três?',
      perguntaVoz: 'As cartas trocaram de lugar!!... Onde está o anjo?!... No um... no dois... ou no três?!',
      resposta: 'No número dois! Você tem olho bom!',
    },
    11: { pergunta: 'Quem Deus mandou para cuidar de Daniel? O anjo... o pescador... ou o padeiro?', resposta: 'O anjo! Ele fechou a boca dos leões!' },
    12: { pergunta: 'O que os leões fizeram com Daniel? Ficaram bravos... ficaram mansinhos... ou fugiram?', resposta: 'Ficaram mansinhos! Deus cuidou de Daniel!' },
  },
  encerramento: 'Deus cuidou de Daniel, e cuida de você também! Até a próxima, amiguinho!',
  v2: {
    p1_pergunta: 'Socorro! O leãozinho fugiu! Você me ajuda a achar? Rápido, aponta pra ele!',
    gancho: 'Você é demais! São doze desafios, e o último é o mais difícil de todos. Vamos?',
    surpresa: 'Agora vem um desafio surpresa!',
    metade: 'Metade! Você está indo muito bem!',
    ultimo: 'E agora, o último desafio! O mais difícil de todos!',
    encerramento: 'Uhuu! Você completou os doze desafios! Deus cuidou de Daniel, e cuida de você também. Vem jogar o próximo quiz comigo!',
  },
  // Short nativo "3 em 1" (padrão de Shorts v2): de quem é a sombra?
  shorts: {
    sombra_q1: 'De quem é essa sombra? Rápido!',
    sombra_r1: 'Do leão!',
    sombra_q2: 'E essa?',
    sombra_r2: 'Da ovelha!',
    sombra_q3: 'A última é difícil!',
    sombra_r3: 'Do camelo!',
    sombra_fim: 'Acertou as três? Tenta de novo!',
  },
};
