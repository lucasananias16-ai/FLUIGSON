'use strict';
/**
 * Vídeo 4 — Quiz do Papai Noel: texto exato da locução, como aprovado em
 * v4-papai-noel/01-narrativa.md. As opções são faladas na ordem da tela.
 */
module.exports = {
  // a mesma voz dos outros vídeos, no estilo animado
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10, // segundos para pensar nos desafios de resposta
  // Pausas (contadas a partir da 0) que de fato separam as frases de uma fala, quando o corte
  // automático erra. Fica vazio até a conferência das legendas mostrar algum caso.
  cortes: {},
  abertura: 'Oi, amiguinho! A Tuti voltou! Olha só o meu gorro de Papai Noel! Hoje o Natal chegou com oito desafios para você. Vamos lá!',
  desafios: {
    1: {
      pergunta: 'O Papai Noel está brincando de esconde-esconde! Você consegue encontrar?',
      resposta: 'Achou! Ele estava atrás do pinheiro! Ho ho ho!',
      respostaVoz: 'Achou! Ele estava atrás do pinheiro! Ho ho ho!', // ênfase simples: com a dobrada saía aguda demais
    },
    2: {
      pergunta: 'As renas vão puxar o trenó. Conte comigo!',
      contagem: 'Um... dois... três... quatro!',
      resposta: 'Quatro renas! Muito bem!',
      respostaVoz: 'Quatro renas! Muito bem!', // ênfase simples, como no Vídeo 2
    },
    3: {
      pergunta: 'De que cor é a roupa do Papai Noel? Azul... vermelha... ou verde?',
      resposta: 'Vermelha! A roupa do Papai Noel é vermelha e fofinha!',
    },
    4: {
      pergunta: 'De quem é essa sombra de gorro? Da rena... do boneco de neve... ou do Papai Noel?',
      resposta: 'Do Papai Noel! Olha o gorro e a barba bem grande!',
    },
    5: {
      pergunta: 'Quem é o maior? O duendezinho... ou o Papai Noel?',
      resposta: 'O Papai Noel! Mas o duendezinho ajuda muito!',
    },
    6: {
      pergunta: 'Por onde o Papai Noel entra na casa? Pela chaminé... pela janela... ou pela porta?',
      resposta: 'Pela chaminé! Cuidado, que ela é estreitinha!',
    },
    7: {
      pergunta: 'O que não combina com o Papai Noel? O gorro... o trenó... ou a prancha de surfe?',
      resposta: 'A prancha de surfe! Ha ha! Na neve não tem onda!',
      respostaVoz: 'A prancha de surfe! Ha ha! Na neve não tem onda!',
    },
    8: {
      mostrar: 'Olhe bem onde o presente está.',
      pergunta: 'As cartas trocaram de lugar! Onde está o presente? No um... no dois... ou no três?',
      // reticências a mais só no texto da voz, para as cinco partes ficarem bem separadas
      perguntaVoz: 'As cartas trocaram de lugar!!... Onde está o presente?!... No um... no dois... ou no três?!',
      resposta: 'No número um! Você tem olho bom! O Papai Noel tem presente para todo mundo.',
    },
  },
  encerramento: 'Feliz Natal, amiguinho! Até a próxima!',
};
