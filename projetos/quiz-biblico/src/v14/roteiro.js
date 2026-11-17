'use strict';
/**
 * Vídeo 14 — Jogo da Memória da Tuti: texto exato da locução (12 desafios de memória de
 * cinco tipos), conforme v14-jogo-da-memoria/01-narrativa.md. As opções são faladas na ordem da tela.
 */
const mem = (onde, resposta, mostrar) => ({
  mostrar,
  pergunta: `As cartas trocaram de lugar! Onde está ${onde}? No um... no dois... ou no três?`,
  perguntaVoz: `As cartas trocaram de lugar!!... Onde está ${onde}?!... No um... no dois... ou no três?!`,
  resposta,
});

module.exports = {
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10,
  cortes: {},
  abertura: 'Oi, amiguinho! A Tuti voltou! Hoje é dia de jogo da memória! Preste bem atenção, que são doze desafios. Vamos lá!',
  desafios: {
    1: mem('o ursinho', 'No número três! Você tem olho bom!', 'Olhe bem onde o ursinho está.'),
    2: {
      mostrar: 'Olhe bem as quatro frutas!',
      pergunta: 'Uma fruta sumiu! Qual foi? O morango... a banana... ou a uva?',
      perguntaVoz: 'Uma fruta sumiu!!... Qual foi?!... O morango... a banana... ou a uva?!',
      resposta: 'A banana! Ela estava aqui, do ladinho da maçã!',
    },
    3: { mostrar: 'Olhe bem o balão!', pergunta: 'De que cor era o balão? Azul... amarelo... ou vermelho?', resposta: 'Vermelho! Que memória boa!' },
    4: { mostrar: 'Olhe bem as estrelas!', pergunta: 'Quantas estrelas tinha? Duas... três... ou quatro?', resposta: 'Três estrelas! Muito bem!' },
    5: mem('a girafa', 'No número um! Você é demais!', 'Olhe bem onde a girafa está.'),
    6: { mostrar: 'Olhe quem vai aparecer!', pergunta: 'Quem apareceu primeiro? O pinguim... a pomba... ou a coruja?', resposta: 'A coruja! Ela chegou primeiro!' },
    7: {
      mostrar: 'Olhe bem os quatro brinquedos!',
      pergunta: 'Um brinquedo sumiu! Qual foi? O trenzinho... o carrinho... ou a boneca?',
      perguntaVoz: 'Um brinquedo sumiu!!... Qual foi?!... O trenzinho... o carrinho... ou a boneca?!',
      resposta: 'O trenzinho! Piuí!',
    },
    8: { mostrar: 'Olhe bem o peixinho!', pergunta: 'De que cor era o peixinho? Azul... amarelo... ou vermelho?', resposta: 'Amarelo! Você lembrou!' },
    9: { mostrar: 'Olhe bem as bolas!', pergunta: 'Quantas bolas tinha? Cinco... seis... ou quatro?', resposta: 'Cinco bolas! Que memória!' },
    10: mem('a lua', 'No número dois! Uau, que olho rápido!', 'Olhe bem onde a lua está. Agora vai ser mais rápido!'),
    11: { mostrar: 'Olhe quem vai aparecer agora!', pergunta: 'Quem apareceu por último? A maçã... a laranja... ou o morango?', resposta: 'A maçã! Ela foi a última!' },
    12: mem('o foguete', 'No número um! Você venceu o jogo da memória!', 'Último desafio! Olhe bem onde o foguete está.'),
  },
  encerramento: 'Parabéns, amiguinho! Você lembrou de tudo! Até a próxima!',
};
