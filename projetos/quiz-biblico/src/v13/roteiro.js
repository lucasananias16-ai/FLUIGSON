'use strict';
/**
 * Vídeo 13 — Quiz Bíblico: Jonas e o Grande Peixe: texto exato da locução (12 desafios),
 * conforme v13-biblico-jonas/01-narrativa.md. As opções são faladas na ordem da tela.
 */
module.exports = {
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10,
  cortes: {},
  abertura: 'Oi, amiguinho! A Tuti voltou! Hoje a história é de Jonas e o grande peixe! São doze desafios. Vamos lá!',
  desafios: {
    1: { pergunta: 'O grande peixe se escondeu no fundo do mar! Você consegue encontrar?', resposta: 'Achou! Ele estava atrás da pedra! Que peixe grandão!' },
    2: { pergunta: 'Jonas ficou três dias na barriga do peixe. Conte comigo!', contagem: 'Um... dois... três!', resposta: 'Três dias! Muito bem!' },
    3: { pergunta: 'Para onde Deus mandou Jonas? Para a cidade... para a floresta... ou para a lua?', resposta: 'Para a cidade! A grande cidade de Nínive!' },
    4: { pergunta: 'Jonas tentou fugir. Ele entrou em quê? No foguete... no barco... ou no trem?', perguntaVoz: 'Jonas tentou fugir!!... Ele entrou em quê?!... No foguete... no barco... ou no trem?!', resposta: 'No barco! Jonas foi para o mar.' },
    5: { pergunta: 'O que aconteceu no mar? Veio a tempestade... a neve... ou o arco-íris?', resposta: 'A tempestade! O vento soprou forte e as ondas ficaram enormes!' },
    6: { pergunta: 'De quem é essa sombra grandona? Do barco... do grande peixe... ou do castelo?', resposta: 'Do grande peixe! Ele engoliu Jonas inteirinho!' },
    7: { pergunta: 'Quem é o maior? O peixinho... ou o grande peixe?', resposta: 'O grande peixe! Ele era enorme!' },
    8: { pergunta: 'Um destes peixinhos é diferente! Qual é?', resposta: 'O amarelo! Os outros são azuis!' },
    9: {
      pergunta: 'Olhe a fila no mar! O que vem depois? A concha... a estrela-do-mar... ou o peixe?',
      perguntaVoz: 'Olhe a fila no mar!!... O que vem depois?!... A concha... a estrela-do-mar... ou o peixe?!',
      resposta: 'A estrela-do-mar! Peixe, estrela, peixe, estrela!',
    },
    10: { pergunta: 'O que não combina com o mar? O peixe... o barco... ou o boneco de neve?', resposta: 'O boneco de neve! Ha ha! No mar quentinho, ele derretia!' },
    11: {
      mostrar: 'Olhe bem onde o grande peixe está.',
      pergunta: 'As cartas trocaram de lugar! Onde está o grande peixe? No um... no dois... ou no três?',
      perguntaVoz: 'As cartas trocaram de lugar!!... Onde está o grande peixe?!... No um... no dois... ou no três?!',
      resposta: 'No número um! Você tem olho bom!',
    },
    12: { pergunta: 'Onde o grande peixe deixou Jonas? Na montanha... na praia... ou na nuvem?', resposta: 'Na praia! Jonas orou, e Deus cuidou dele!' },
  },
  encerramento: 'Jonas foi até Nínive e contou a todos sobre Deus! Deus sempre cuida de nós. Até a próxima, amiguinho!',
};
