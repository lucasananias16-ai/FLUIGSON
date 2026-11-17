'use strict';
/**
 * Vídeo 17 — Quiz de Natal 8: o Natal na Floresta: texto exato da locução (12 desafios),
 * conforme v17-natal-floresta/01-narrativa.md. As opções são faladas na ordem da tela.
 */
module.exports = {
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10,
  cortes: {},
  abertura: 'Oi, amiguinho! A Tuti voltou! Hoje tem festa de Natal na floresta! Os bichinhos precisam da nossa ajuda. São doze desafios. Vamos lá!',
  desafios: {
    1: { pergunta: 'O esquilo se escondeu na floresta! Você consegue encontrar?', resposta: 'Achou! Ele estava atrás do toco! Que esquilo brincalhão!' },
    2: { pergunta: 'O esquilo juntou pinhas para a festa. Conte comigo!', contagem: 'Um... dois... três... quatro... cinco!', resposta: 'Cinco pinhas! Muito bem!' },
    3: { pergunta: 'O que o coelhinho gosta de comer? A cenoura... o peixe... ou o osso?', resposta: 'A cenoura! Nhac, nhac, nhac!' },
    4: { pergunta: 'De quem é essa sombra? Do coelho... do esquilo... ou do urso?', resposta: 'Do urso! Ele é grandão e fofinho!' },
    5: { pergunta: 'O que está faltando no pinheiro? A estrela... a meia... ou a bola?', resposta: 'A estrela! Agora o pinheiro ficou completo!' },
    6: { pergunta: 'Quem é o maior? O ursinho... ou o esquilo?', resposta: 'O ursinho! Ele é bem maior!' },
    7: { pergunta: 'Um destes coelhinhos é diferente! Qual é?', resposta: 'O marrom! Os outros são branquinhos!' },
    8: {
      pergunta: 'Olhe a fila de enfeites! O que vem depois? A pinha... a bola... ou a estrela?',
      perguntaVoz: 'Olhe a fila de enfeites!!... O que vem depois?!... A pinha... a bola... ou a estrela?!',
      resposta: 'A bola! Pinha, bola, pinha, bola!',
    },
    9: { pergunta: 'O que não combina com a festa na neve? O gorro... o cachecol... ou o guarda-sol?', resposta: 'O guarda-sol! Ha ha! Na neve não tem praia!' },
    10: {
      mostrar: 'Olhe bem onde o esquilo está.',
      pergunta: 'As cartas trocaram de lugar! Onde está o esquilo? No um... no dois... ou no três?',
      perguntaVoz: 'As cartas trocaram de lugar!!... Onde está o esquilo?!... No um... no dois... ou no três?!',
      resposta: 'No número um! Você tem olho bom!',
    },
    11: { pergunta: 'Onde o esquilo mora? Na árvore... no mar... ou na nuvem?', resposta: 'Na árvore! Lá no alto, bem quentinho!' },
    12: { pergunta: 'O que os amigos fazem no Natal? Dão um abraço... brigam... ou ficam sozinhos?', resposta: 'Dão um abraço! Que abraço gostoso!' },
  },
  encerramento: 'O pinheiro ficou lindo, e a festa começou! No Natal, a gente fica junto de quem a gente ama. Feliz Natal, amiguinho! Até a próxima!',
};
