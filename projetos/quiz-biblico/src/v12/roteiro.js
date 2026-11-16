'use strict';
/**
 * Vídeo 12 — Quiz de Natal 6: o Boneco de Neve: texto exato da locução (12 desafios),
 * conforme v12-natal-boneco-neve/01-narrativa.md. As opções são faladas na ordem da tela.
 */
module.exports = {
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10,
  cortes: {},
  abertura: 'Oi, amiguinho! A Tuti voltou! Olha quanta neve! Hoje vamos montar um boneco de neve juntos! São doze desafios. Vamos lá!',
  desafios: {
    1: { pergunta: 'A cenoura do boneco de neve sumiu! Você consegue encontrar?', resposta: 'Achou! Ela estava atrás do pinheiro! Vamos guardar para o nariz.' },
    2: { pergunta: 'Vamos fazer bolas de neve. Conte comigo!', contagem: 'Um... dois... três... quatro... cinco... seis!', resposta: 'Seis bolas de neve! Muito bem!' },
    3: { pergunta: 'O que está faltando no boneco de neve? O guarda-chuva... a luva... ou o chapéu?', resposta: 'O chapéu! Agora ele ficou elegante!' },
    4: { pergunta: 'O que a gente veste para ficar quentinho na neve? O cachecol... o pião... ou a prancha?', resposta: 'O cachecol! Ele esquenta o pescoço!' },
    5: { pergunta: 'De quem é essa sombra? Do pinguim... da rena... ou do boneco de neve?', resposta: 'Do boneco de neve! Ele é redondinho!' },
    6: { pergunta: 'Qual boneco de neve é o maior? O da esquerda... ou o da direita?', resposta: 'O da direita! Ele é bem grandão!' },
    7: { pergunta: 'Uma destas luvas é diferente! Qual é?', resposta: 'A vermelha! As outras são azuis!' },
    8: {
      pergunta: 'Olhe a fila na neve! Quem vem depois? A rena... o pinguim... ou o boneco de neve?',
      perguntaVoz: 'Olhe a fila na neve!!... Quem vem depois?!... A rena... o pinguim... ou o boneco de neve?!',
      resposta: 'O pinguim! Boneco, pinguim, boneco, pinguim!',
    },
    9: { pergunta: 'O que não combina com a neve? O chinelo... o trenó... ou o boneco de neve?', resposta: 'O chinelo! Ha ha! Com chinelo, o pé congela!' },
    10: {
      mostrar: 'Olhe bem onde a luva está.',
      pergunta: 'As cartas trocaram de lugar! Onde está a luva? No um... no dois... ou no três?',
      perguntaVoz: 'As cartas trocaram de lugar!!... Onde está a luva?!... No um... no dois... ou no três?!',
      resposta: 'No número três! Você tem olho bom!',
    },
    11: { pergunta: 'Quem adora o frio e mora no gelo? O camelo... o leão... ou o pinguim?', resposta: 'O pinguim! Ele adora escorregar no gelo!' },
    12: { pergunta: 'O que vira o nariz do boneco de neve? A banana... a cenoura... ou o pirulito?', resposta: 'A cenoura! Pronto, o boneco de neve está completo!' },
  },
  encerramento: 'Olha que lindo o nosso boneco de neve! Você me ajudou muito! Feliz Natal, amiguinho! Até a próxima!',
};
