'use strict';
/**
 * Vídeo 1 — Quiz da Arca de Noé: texto exato da locução, como aprovado em
 * v1-arca-de-noe/01-narrativa.md. As opções são faladas na ordem da tela.
 */
module.exports = {
  // estilo 'animada': a fala vai para a voz com mais ênfase na pontuação (ver narracao.js)
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10, // segundos entre o fim da pergunta e a resposta
  abertura:
    'Oi, amiguinho! Eu sou a Tuti! Hoje vamos brincar de quiz com a história da Arca de Noé. Eu pergunto, e você responde bem alto. Preparado? Vamos lá!',
  perguntas: {
    1: {
      pergunta: 'Quem construiu a arca? Foi o Noé... o Davi... ou o Moisés?',
      resposta: 'Foi o Noé! Muito bem! Deus pediu para Noé construir um barco bem grandão.',
    },
    2: {
      pergunta: 'De que a arca foi feita? De pedra... de madeira... ou de gelo?',
      resposta: 'De madeira! Isso mesmo! Noé usou muita, muita madeira.',
    },
    3: {
      pergunta: 'Como os animais entraram na arca? Um sozinho... cinco de uma vez... ou dois juntinhos?',
      resposta: 'Dois juntinhos! Acertou! Os bichinhos entraram de dois em dois.',
    },
    4: {
      pergunta: 'Qual destes não é um animal? O leão... o guarda-chuva... ou a girafa?',
      resposta: 'O guarda-chuva! Ha ha! Guarda-chuva não é bicho! Mas ia ser útil, né?',
    },
    5: {
      pergunta: 'O que caiu do céu por muitos dias? Neve... folhas... ou chuva?',
      resposta: 'Chuva! Choveu, choveu e choveu! Mas todos na arca estavam seguros.',
      // com a ênfase dobrada esta fala saía empolgada demais; aqui ela vai com ênfase simples
      respostaVoz: 'Chuva! Choveu, choveu e choveu! Mas todos na arca estavam seguros!',
    },
    6: {
      pergunta: 'Por quantos dias choveu? Quarenta... quatro... ou dez?',
      resposta: 'Quarenta! Quarenta dias e quarenta noites! É muita chuva!',
    },
    7: {
      pergunta: 'Qual passarinho trouxe uma folhinha para Noé? A coruja... a pomba... ou o pinguim?',
      resposta: 'A pomba! A pombinha mostrou que a terra já estava sequinha.',
    },
    8: {
      pergunta: 'O que Deus colocou no céu como promessa? A estrela... a lua... ou o arco-íris?',
      resposta: 'O arco-íris! Que lindo! O arco-íris lembra que Deus sempre cumpre o que promete.',
    },
  },
  encerramento:
    'Você foi demais! Deus cuidou de Noé, da família dele e de todos os bichinhos. E Ele cuida de você também! Tchau, amiguinho, até o próximo quiz!',
};
