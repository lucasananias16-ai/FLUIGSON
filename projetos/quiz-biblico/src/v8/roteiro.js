'use strict';
/**
 * Vídeo 8 — Quiz de Natal 2: a Oficina dos Duendes: texto exato da locução, como aprovado em
 * v8-natal-oficina/01-narrativa.md. As opções são faladas na ordem da tela.
 */
module.exports = {
  // a mesma voz dos outros vídeos, no estilo animado
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10, // segundos para pensar nos desafios de resposta
  // Pausas (contadas a partir da 0) que de fato separam as frases de uma fala, quando o corte
  // automático erra. Fica vazio até a conferência das legendas mostrar algum caso.
  cortes: {},
  abertura: 'Oi, amiguinho! A Tuti voltou! Hoje eu estou na oficina do Papai Noel! Os duendes precisam de ajuda com os brinquedos. São oito desafios. Vamos lá!',
  desafios: {
    1: {
      pergunta: 'O ursinho se escondeu na prateleira! Você consegue encontrar?',
      resposta: 'Achou! Ele estava atrás da caixa! Que ursinho sapeca!',
    },
    2: {
      pergunta: 'Os presentes estão passando na esteira. Conte comigo!',
      contagem: 'Um... dois... três... quatro... cinco!',
      resposta: 'Cinco presentes! Muito bem!',
      respostaVoz: 'Cinco presentes! Muito bem!',
    },
    3: {
      pergunta: 'De qual brinquedo é essa sombra? Da bola... do pião... ou do trenzinho?',
      resposta: 'Do trenzinho! Piuí! Olha as rodinhas!',
    },
    4: {
      pergunta: 'Qual presente é o maior? O amarelo... ou o azul?',
      resposta: 'O azul! É uma caixa grandona!',
    },
    5: {
      // a fila aparece na tela; falar a lista inteira embaralhava as pausas que separam as opções
      pergunta: 'Olhe a fila de brinquedos! O que vem depois? O ursinho... o pião... ou a boneca?',
      perguntaVoz: 'Olhe a fila de brinquedos, o que vem depois?!... O ursinho... o pião... ou a boneca?!',
      resposta: 'O ursinho! Bola, ursinho, bola, ursinho!',
    },
    6: {
      pergunta: 'O que não é brinquedo? A boneca... o carrinho... ou a vassoura?',
      resposta: 'A vassoura! Ha ha! Ela é para varrer a oficina!',
      respostaVoz: 'A vassoura! Ha ha! Ela é para varrer a oficina!',
    },
    7: {
      pergunta: 'Esta caixa vermelha está sem laço! Qual laço é da mesma cor? O azul... o vermelho... ou o verde?',
      perguntaVoz: 'Esta caixa vermelha está sem laço!!... Qual laço é da mesma cor?!... O azul... o vermelho... ou o verde?!',
      resposta: 'O vermelho! Caixa vermelha, laço vermelho!',
    },
    8: {
      mostrar: 'Olhe bem onde o ursinho está.',
      pergunta: 'As cartas trocaram de lugar! Onde está o ursinho? No um... no dois... ou no três?',
      perguntaVoz: 'As cartas trocaram de lugar!!... Onde está o ursinho?!... No um... no dois... ou no três?!',
      resposta: 'No número três! Você tem olho bom! Os presentes estão prontos!',
    },
  },
  encerramento: 'Você ajudou os duendes! Os presentes já podem ir para o trenó. Feliz Natal, amiguinho! Até a próxima!',
};
