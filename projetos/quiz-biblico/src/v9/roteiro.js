'use strict';
/**
 * Vídeo 9 — Quiz de Natal 3: a Árvore de Natal: texto exato da locução, como aprovado em
 * v9-natal-arvore/01-narrativa.md. As opções são faladas na ordem da tela.
 */
module.exports = {
  // a mesma voz dos outros vídeos, no estilo animado
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10, // segundos para pensar nos desafios de resposta
  // Pausas (contadas a partir da 0) que de fato separam as frases de uma fala, quando o corte
  // automático erra. Fica vazio até a conferência das legendas mostrar algum caso.
  cortes: {},
  abertura: 'Oi, amiguinho! A Tuti voltou! Hoje vamos montar a árvore de Natal! Cada desafio põe um enfeite nela. São oito desafios. Vamos lá!',
  desafios: {
    1: {
      pergunta: 'A estrela da árvore sumiu! Você consegue encontrar?',
      resposta: 'Achou! Ela estava atrás do sofá! Vamos guardar para o final.',
    },
    2: {
      pergunta: 'Vamos pendurar as bolas. Conte comigo!',
      contagem: 'Um... dois... três... quatro... cinco!',
      resposta: 'Cinco bolas! Muito bem!',
      respostaVoz: 'Cinco bolas! Muito bem!',
    },
    3: {
      pergunta: 'O que vai no topo da árvore? A meia... a estrela... ou a bota?',
      resposta: 'A estrela! Ela fica lá no alto, brilhando!',
    },
    4: {
      pergunta: 'Olhe as luzinhas piscando! Qual cor vem depois? A amarela... a azul... ou a verde?',
      // reticências a mais só no texto da voz, para as cinco partes ficarem bem separadas
      perguntaVoz: 'Olhe as luzinhas piscando!!... Qual cor vem depois?!... A amarela... a azul... ou a verde?!',
      resposta: 'A amarela! Vermelha, amarela, vermelha, amarela!',
    },
    5: {
      pergunta: 'Um destes enfeites é diferente! Qual é?',
      resposta: 'O sino! Os outros são bolas. Blim, blém!',
    },
    6: {
      pergunta: 'Qual pinheiro é o maior? O da esquerda... ou o da direita?',
      resposta: 'O da direita! Ele é bem alto!',
    },
    7: {
      pergunta: 'O que não vai na árvore de Natal? A bola... o sino... ou o guarda-chuva?',
      resposta: 'O guarda-chuva! Ha ha! Não chove dentro de casa!',
      respostaVoz: 'O guarda-chuva! Ha ha! Não chove dentro de casa!',
    },
    8: {
      mostrar: 'Olhe bem onde a estrela está.',
      pergunta: 'As cartas trocaram de lugar! Onde está a estrela? No um... no dois... ou no três?',
      perguntaVoz: 'As cartas trocaram de lugar!!... Onde está a estrela?!... No um... no dois... ou no três?!',
      resposta: 'No número dois! Você tem olho bom! Agora ela vai para o topo!',
    },
  },
  encerramento: 'A árvore ficou pronta! Olha que linda, toda iluminada! Feliz Natal, amiguinho! Até a próxima!',
};
