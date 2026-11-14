'use strict';
/**
 * Vídeo 11 — Quiz de Natal 5: a Ceia e os Doces de Natal: texto exato da locução, como aprovado em
 * v11-natal-ceia/01-narrativa.md. As opções são faladas na ordem da tela.
 */
module.exports = {
  // a mesma voz dos outros vídeos, no estilo animado
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10, // segundos para pensar nos desafios de resposta
  // Pausas (contadas a partir da 0) que de fato separam as frases de uma fala, quando o corte
  // automático erra. Fica vazio até a conferência das legendas mostrar algum caso.
  cortes: {},
  abertura: 'Oi, amiguinho! A Tuti voltou! Hoje é dia de ceia de Natal! Vamos arrumar a mesa juntos? São oito desafios. Vamos lá!',
  desafios: {
    1: {
      pergunta: 'O biscoito de gengibre fugiu! Você consegue encontrar?',
      resposta: 'Achou! Ele estava atrás do panetone! Que biscoito sapeca!',
    },
    2: {
      pergunta: 'Vamos acender as velas. Conte comigo!',
      contagem: 'Um... dois... três... quatro... cinco!',
      resposta: 'Cinco velas! Muito bem!',
    },
    3: {
      pergunta: 'De quem é essa sombra? Da maçã... da banana... ou do panetone?',
      resposta: 'Do panetone! Hum, que cheiro bom!',
    },
    4: {
      pergunta: 'Qual biscoito tem forma de estrela? Este... este... ou este?',
      resposta: 'Este! Ele tem cinco pontas, igual à estrela!',
    },
    5: {
      pergunta: 'Qual panetone é o maior? O da esquerda... ou o da direita?',
      resposta: 'O da esquerda! Dá para a família toda!',
    },
    6: {
      pergunta: 'Olhe a fila de doces! O que vem depois? A maçã... o pirulito... ou o biscoito?',
      // reticências a mais só no texto da voz, para as cinco partes ficarem bem separadas
      perguntaVoz: 'Olhe a fila de doces!!... O que vem depois?!... A maçã... o pirulito... ou o biscoito?!',
      resposta: 'O pirulito! Biscoito, pirulito, biscoito, pirulito!',
    },
    7: {
      pergunta: 'O que não vai na mesa da ceia? A bota... o panetone... ou a maçã?',
      resposta: 'A bota! Ha ha! Bota não é de comer!',
    },
    8: {
      mostrar: 'Olhe bem onde o panetone está.',
      pergunta: 'As cartas trocaram de lugar! Onde está o panetone? No um... no dois... ou no três?',
      perguntaVoz: 'As cartas trocaram de lugar!!... Onde está o panetone?!... No um... no dois... ou no três?!',
      resposta: 'No número três! Você tem olho bom! A mesa está pronta!',
    },
  },
  encerramento: 'A mesa ficou pronta! Que ceia gostosa! Feliz Natal, amiguinho! Até a próxima!',
};
