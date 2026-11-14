'use strict';
/**
 * Vídeo 10 — Quiz de Natal 4: as Renas e o Trenó: texto exato da locução, como aprovado em
 * v10-natal-renas/01-narrativa.md. As opções são faladas na ordem da tela.
 */
module.exports = {
  // a mesma voz dos outros vídeos, no estilo animado
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10, // segundos para pensar nos desafios de resposta
  // Pausas (contadas a partir da 0) que de fato separam as frases de uma fala, quando o corte
  // automático erra. Fica vazio até a conferência das legendas mostrar algum caso.
  cortes: {},
  abertura: 'Oi, amiguinho! A Tuti voltou! Hoje é a noite de Natal, e o trenó vai sair voando! Vamos ajudar as renas? São oito desafios. Vamos lá!',
  desafios: {
    1: {
      pergunta: 'A rena do nariz vermelho se escondeu no céu! Você consegue encontrar?',
      resposta: 'Achou! Ela estava atrás da nuvem! O nariz dela brilha no escuro!',
    },
    2: {
      pergunta: 'O trenó vai passar por cima das casinhas. Conte comigo!',
      contagem: 'Um... dois... três... quatro... cinco!',
      resposta: 'Cinco casinhas! Muito bem!',
    },
    3: {
      pergunta: 'De quem é essa sombra? Do carrinho... do barco... ou do trenó?',
      resposta: 'Do trenó! É nele que vão os presentes!',
    },
    4: {
      pergunta: 'Quem puxa o trenó pelo céu? A rena... o elefante... ou a girafa?',
      resposta: 'A rena! As renas voam bem alto na noite de Natal!',
    },
    5: {
      pergunta: 'Uma destas renas é diferente! Qual é?',
      resposta: 'A do nariz vermelho! Ele acende como uma luzinha!',
    },
    6: {
      pergunta: 'Olhe o céu! O que vem depois? A lua... a estrela... ou o sol?',
      // reticências a mais só no texto da voz, para as cinco partes ficarem bem separadas
      perguntaVoz: 'Olhe o céu!!... O que vem depois?!... A lua... a estrela... ou o sol?!',
      resposta: 'A lua! Estrela, lua, estrela, lua!',
    },
    7: {
      pergunta: 'O que não cabe no trenó? O ursinho... a bola... ou o elefante?',
      resposta: 'O elefante! Ha ha! Ele é grande demais!',
    },
    8: {
      mostrar: 'Olhe bem onde o trenó está.',
      pergunta: 'As cartas trocaram de lugar! Onde está o trenó? No um... no dois... ou no três?',
      perguntaVoz: 'As cartas trocaram de lugar!!... Onde está o trenó?!... No um... no dois... ou no três?!',
      resposta: 'No número um! Você tem olho bom! O trenó já pode voar!',
    },
  },
  encerramento: 'Lá vai o trenó, voando pelo céu! As renas conseguiram! Feliz Natal, amiguinho! Até a próxima!',
};
