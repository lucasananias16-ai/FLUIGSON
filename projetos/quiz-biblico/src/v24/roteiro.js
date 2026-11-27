'use strict';
/**
 * Vídeo 24 — Quiz Bíblico: a Ovelhinha Perdida: texto exato da locução,
 * conforme v24-biblico-ovelha-perdida/01-narrativa.md (tom leve, de brincadeira).
 *
 * Os números daqui são os "de dentro" (os que as cenas usam nos nomes dos
 * áudios); a ordem no vídeo e o número mostrado na tela estão em `ordem`
 * (número de dentro → número na tela).
 */
module.exports = {
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10,
  cortes: {},
  ordem: { 1: 1, 14: 2, 3: 3, 7: 4, 4: 5, 2: 6, 6: 7, 13: 8, 8: 9, 9: 10, 5: 11, 10: 12 },
  abertura: 'Oi, amiguinho! Hoje a gente vai brincar com o pastor e as ovelhinhas!',
  desafios: {
    1: { pergunta: 'A ovelhinha saiu para passear! Cadê ela?', resposta: 'Achou! Estava atrás do arbusto! Oi, ovelhinha!' },
    2: { pergunta: 'Quantas ovelhinhas estão no pasto? Conte comigo!', contagem: 'Um... dois... três... quatro... cinco!', resposta: 'Cinco ovelhinhas! Que fofura!' },
    3: { pergunta: 'Quem cuida das ovelhinhas com carinho? O pescador... o pastor... ou o padeiro?', resposta: 'O pastor! Ele ama as ovelhinhas!' },
    4: { pergunta: 'Olha uma sombra atrás do morro! Quem será? O camelo... o leão... ou a ovelha?', perguntaVoz: 'Olha uma sombra atrás do morro!!... Quem será?!... O camelo... o leão... ou a ovelha?!', resposta: 'A ovelha! Quase achamos!' },
    5: { pergunta: 'O pastor está sem uma coisa! O que será? O guarda-chuva... o cajado... ou a coroa?', perguntaVoz: 'O pastor está sem uma coisa!!... O que será?!... O guarda-chuva... o cajado... ou a coroa?!', resposta: 'O cajado! Agora ele pode procurar!' },
    6: { pergunta: 'Qual ovelha é a grandona? A da esquerda... ou a da direita?', resposta: 'A da direita! Que ovelhona!' },
    7: { pergunta: 'Tem um engraçadinho no meio das ovelhas! Quem é?', resposta: 'O leãozinho! Ha ha! Ele quis brincar também!' },
    8: {
      pergunta: 'Olha a filinha! Quem vem agora? A ovelha... a flor... ou a pedra?',
      perguntaVoz: 'Olha a filinha!!... Quem vem agora?!... A ovelha... a flor... ou a pedra?!',
      resposta: 'A flor! Que fila cheirosa!',
    },
    9: { pergunta: 'O que não tem no pasto? A grama... a flor... ou o foguete?', resposta: 'O foguete! Ha ha! Ovelha não vai para a lua!' },
    10: {
      mostrar: 'Olhe bem onde a ovelhinha está.',
      pergunta: 'As cartas dançaram! Onde ela ficou? No um... no dois... ou no três?',
      perguntaVoz: 'As cartas dançaram!!... Onde ela ficou?!... No um... no dois... ou no três?!',
      resposta: 'No número três! Achamos a ovelhinha!',
    },
    13: {
      mostrar: 'Olhe bem os três amigos!',
      pergunta: 'Um amigo foi dar uma voltinha! Quem foi? A ovelha... o passarinho... ou o camelo?',
      perguntaVoz: 'Um amigo foi dar uma voltinha!!... Quem foi?!... A ovelha... o passarinho... ou o camelo?!',
      resposta: 'A ovelha! Sempre ela!',
    },
    14: { mostrar: 'Olha quem vem chegando ao pasto, um de cada vez!', pergunta: 'Quem chegou primeiro? A ovelha... o pastor... ou o passarinho?', resposta: 'O passarinho! Chegou voando!' },
  },
  encerramento: 'O pastor achou a ovelhinha! Até a próxima, amiguinho!',
  v2: {
    p1_pergunta: 'Ih! A ovelhinha saiu para passear! Cadê ela?',
    gancho: 'Hoje a gente vai brincar com o pastor e as ovelhinhas. São doze brincadeiras, e a última é uma surpresa. Vem comigo?',
    surpresa: 'Uma ovelhinha foi passear longe! Vamos procurar com o pastor?',
    metade: 'Já procuramos um montão! Está gostoso brincar com você!',
    ultimo: 'Estamos quase achando! Agora vem a brincadeira surpresa!',
    encerramento: 'Uhuu! O pastor achou a ovelhinha e voltou todo feliz, com ela no colo! Jesus cuida da gente assim, com muito carinho. Vem brincar comigo de novo!',
  },
};
