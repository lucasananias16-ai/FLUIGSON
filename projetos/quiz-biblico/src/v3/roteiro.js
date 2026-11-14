'use strict';
/**
 * Vídeo 3 — Desafios do Natal de Jesus: texto exato da locução, como aprovado
 * em v3-nascimento-de-jesus/01-narrativa.md. As opções são faladas na ordem da tela.
 */
module.exports = {
  // a mesma voz dos Vídeos 1 e 2, no estilo animado
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10, // segundos para pensar nos desafios de resposta
  // Na abertura a voz faz uma pausa grande no meio de "nascimento | de Jesus". Estas são as pausas
  // (contadas a partir da 0) que de fato separam as frases, para gestos e legendas caírem certo.
  cortes: { v3_abertura: [0, 1, 3, 4] },
  abertura: 'Oi, amiguinho! A Tuti voltou! Hoje vamos conhecer a história do nascimento de Jesus. Tenho nove desafios para você. Vamos lá!',
  desafios: {
    1: {
      pergunta: 'Uma estrelinha se escondeu no céu! Você consegue encontrar?',
      resposta: 'Achou! Ela estava atrás da nuvem! Uma estrela brilhante mostrou o caminho até Jesus.',
    },
    2: {
      pergunta: 'Os magos levaram presentes para Jesus. Conte comigo!',
      contagem: 'Um... dois... três!',
      resposta: 'Três presentes! Muito bem!',
      respostaVoz: 'Três presentes! Muito bem!',
    },
    3: {
      pergunta: 'De quem é essa sombra com asas? Do pastor... da ovelhinha... ou do anjo?',
      resposta: 'Do anjo! Um anjo deu a boa notícia aos pastores.',
    },
    4: {
      pergunta: 'Quem é o maior? A ovelhinha... ou o camelo?',
      resposta: 'O camelo! Os magos viajaram de longe para visitar Jesus.',
    },
    5: {
      pergunta: 'Quem é a mãe do menino Jesus? A Maria... a Marta... ou a Ana?',
      resposta: 'A Maria! Maria cuidou do bebê Jesus com muito amor.',
    },
    6: {
      pergunta: 'Onde o bebê Jesus dormiu? Num castelo... num barco... ou numa manjedoura?',
      resposta: 'Numa manjedoura! Era uma caminha de palha para os animais.',
    },
    7: {
      pergunta: 'O que não combina com o Natal de Jesus? A estrela... o foguete... ou a ovelhinha?',
      resposta: 'O foguete! Ha ha! Não tinha foguete naquele tempo!',
      respostaVoz: 'O foguete! Ha ha! Não tinha foguete naquele tempo!',
    },
    8: {
      mostrar: 'Olhe bem onde a estrela está.',
      pergunta: 'As cartas trocaram de lugar! Onde está a estrela? No um... no dois... ou no três?',
      // reticências a mais só no texto da voz, para as cinco partes ficarem bem separadas
      perguntaVoz: 'As cartas trocaram de lugar!!... Onde está a estrela?!... No um... no dois... ou no três?!',
      resposta: 'No número dois! Você tem olho bom! A estrela guiou os magos até Jesus.',
    },
    9: {
      pergunta: 'Os anjos deram a boa notícia a quem? Aos pastores... aos pescadores... ou aos padeiros?',
      resposta: 'Aos pastores! Eles correram para ver o bebê Jesus.',
    },
  },
  encerramento: 'Você viu? Jesus nasceu para mostrar o amor de Deus. Deus ama você! Tchau, amiguinho, até a próxima!',
};
