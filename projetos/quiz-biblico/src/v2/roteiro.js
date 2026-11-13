'use strict';
/**
 * Vídeo 2 — Desafios de Davi e Golias: texto exato da locução, como aprovado
 * em v2-davi-e-golias/01-narrativa.md. As opções são faladas na ordem da tela.
 */
module.exports = {
  // a mesma voz do Vídeo 1, no estilo animado
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10, // segundos para pensar nos desafios de resposta
  abertura:
    'Oi, amiguinho! A Tuti voltou! Hoje vamos conhecer o Davi, um menino pastor muito corajoso. Tenho oito desafios para você. Vamos lá!',
  desafios: {
    1: {
      pergunta: 'Uma ovelhinha se escondeu! Você consegue encontrar?',
      resposta: 'Achou! Ela estava atrás da moita! Davi cuidava muito bem das suas ovelhinhas.',
    },
    2: {
      pergunta: 'Davi pegou pedrinhas no riacho. Conte comigo!',
      contagem: 'Um... dois... três... quatro... cinco!',
      resposta: 'Cinco pedrinhas! Muito bem!',
      respostaVoz: 'Cinco pedrinhas! Muito bem!', // ênfase simples: com a dobrada saía empolgada demais
    },
    3: {
      pergunta: 'De quem é essa sombra grandona? Do Davi... da ovelhinha... ou do Golias?',
      resposta: 'Do Golias! É o gigante Golias! Ele era muito, muito alto.',
      respostaVoz: 'Do Golias! É o gigante Golias! Ele era muito, muito alto!',
    },
    4: {
      pergunta: 'Quem é o maior? O Davi... ou o Golias?',
      resposta: 'O Golias! Golias era o maior, mas Davi tinha Deus com ele!',
    },
    5: {
      pergunta: 'O que Davi levou para enfrentar o gigante? A funda... a espada... ou o escudo?',
      resposta: 'A funda! Davi levou sua funda e confiou em Deus.',
    },
    6: {
      pergunta: 'O que não combina com o pastor Davi? O cajado... o skate... ou a ovelha?',
      resposta: 'O skate! Ha ha! Não tinha skate naquele tempo!',
      respostaVoz: 'O skate! Ha ha! Não tinha skate naquele tempo!',
    },
    7: {
      mostrar: 'Davi tocava harpa! Olhe bem onde a harpa está.',
      pergunta: 'As cartas trocaram de lugar! Onde está a harpa? No um... no dois... ou no três?',
      // reticências a mais só no texto da voz, para as cinco partes ficarem bem separadas
      perguntaVoz: 'As cartas trocaram de lugar!!... Onde está a harpa?!... No um... no dois... ou no três?!',
      resposta: 'No número um! Você tem olho bom! Davi tocava harpa e cantava para Deus.',
    },
    8: {
      pergunta: 'Quando cresceu, Davi virou o quê? Um padeiro... um pescador... ou um rei?',
      resposta: 'Um rei! Davi virou rei! Um rei que amava a Deus.',
    },
  },
  encerramento:
    'Você viu? Davi era pequeno, mas confiava em um Deus bem grande. Você também pode confiar! Tchau, amiguinho, até a próxima!',
};
