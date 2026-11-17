'use strict';
/**
 * Vídeo 15 — Quiz de Natal 7: a Cartinha para o Papai Noel: texto exato da locução (12 desafios),
 * conforme v15-natal-cartinha/01-narrativa.md. As opções são faladas na ordem da tela.
 */
module.exports = {
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10,
  cortes: {},
  abertura: 'Oi, amiguinho! A Tuti voltou! Hoje eu vou escrever uma cartinha para o Papai Noel! Você me ajuda? São doze desafios. Vamos lá!',
  desafios: {
    1: { pergunta: 'A cartinha voou! Você consegue encontrar?', resposta: 'Achou! Ela estava atrás da caixa do correio! Ufa!' },
    2: { pergunta: 'Vamos contar as cartinhas na caixa do correio. Conte comigo!', contagem: 'Um... dois... três... quatro!', resposta: 'Quatro cartinhas! Muito bem!' },
    3: { pergunta: 'Com o que a gente escreve a cartinha? O lápis... o garfo... ou a colher?', resposta: 'O lápis! Agora dá para escrever!' },
    4: { pergunta: 'De quem é essa sombra? Da bola... do ursinho... ou do carrinho?', resposta: 'Do ursinho! Foi o presente que a Tuti pediu!' },
    5: { pergunta: 'O que está faltando no envelope? O laço... o botão... ou o selo?', resposta: 'O selo! Sem selo, a cartinha não viaja!' },
    6: { pergunta: 'Qual saco de cartinhas é o maior? O da esquerda... ou o da direita?', resposta: 'O da esquerda! Quanta cartinha!' },
    7: { pergunta: 'Um destes envelopes é diferente! Qual é?', resposta: 'O vermelho! Os outros são brancos!' },
    8: {
      pergunta: 'Olhe a fila! O que vem depois? O selo... o presente... ou o lápis?',
      perguntaVoz: 'Olhe a fila!!... O que vem depois?!... O selo... o presente... ou o lápis?!',
      resposta: 'O presente! Envelope, presente, envelope, presente!',
    },
    9: { pergunta: 'O que não cabe no envelope? A cartinha... a foto... ou o castelo?', resposta: 'O castelo! Ha ha! Ele não cabe no envelope!' },
    10: {
      mostrar: 'Olhe bem onde a cartinha está.',
      pergunta: 'As cartas trocaram de lugar! Onde está a cartinha? No um... no dois... ou no três?',
      perguntaVoz: 'As cartas trocaram de lugar!!... Onde está a cartinha?!... No um... no dois... ou no três?!',
      resposta: 'No número dois! Você tem olho bom!',
    },
    11: { pergunta: 'Quem lê as cartinhas no Polo Norte? O pescador... o Papai Noel... ou o padeiro?', resposta: 'O Papai Noel! Ele lê todas com carinho!' },
    12: { pergunta: 'Para onde vai a cartinha? Para o Polo Norte... para a praia... ou para a floresta?', resposta: 'Para o Polo Norte! Lá vai ela!' },
  },
  encerramento: 'A cartinha foi voando para o Polo Norte! O Papai Noel já está lendo! Feliz Natal, amiguinho! Até a próxima!',
};
