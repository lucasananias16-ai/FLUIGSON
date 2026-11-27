'use strict';
/**
 * Vídeo 23 — Quiz de Natal: os Reis Magos e a Estrela: texto exato da locução,
 * conforme v23-natal-reis-magos/01-narrativa.md (tom leve, de passeio).
 *
 * A ordem dos jogos neste vídeo é outra. Os números daqui são os "de dentro"
 * (os que as cenas usam nos nomes dos áudios); a ordem em que aparecem no
 * vídeo e o número mostrado na tela estão em `ordem` (número de dentro → número na tela).
 */
module.exports = {
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10,
  cortes: {},
  ordem: { 4: 1, 3: 2, 6: 3, 1: 4, 13: 5, 2: 6, 9: 7, 14: 8, 7: 9, 8: 10, 5: 11, 10: 12 },
  abertura: 'Oi, amiguinho! Hoje a gente vai passear com os reis magos!',
  desafios: {
    1: { pergunta: 'A coroa do rei está brincando de esconde-esconde! Cadê ela?', resposta: 'Achou! Estava atrás da moita! Coroa sapeca!' },
    2: { pergunta: 'Quantos camelos vão passear? Conte comigo!', contagem: 'Um... dois... três... quatro... cinco!', resposta: 'Cinco camelos! Que fila comprida!' },
    3: { pergunta: 'Os reis magos olharam para o céu! O que será que eles viram brilhando? A lua... a nuvem... ou a estrela?', perguntaVoz: 'Os reis magos olharam para o céu!!... O que será que eles viram brilhando?!... A lua... a nuvem... ou a estrela?!', resposta: 'A estrela! Que brilho lindo!' },
    4: { pergunta: 'Olha que sombra engraçada! Quem será que vem lá? A ovelha... o camelo... ou o leão?', perguntaVoz: 'Olha que sombra engraçada!!... Quem será que vem lá?!... A ovelha... o camelo... ou o leão?!', resposta: 'É o camelo! Oi, camelo!' },
    5: { pergunta: 'Ué, o céu ficou escurinho! Quem está faltando? O sol... a nuvem... ou a estrela?', perguntaVoz: 'Ué, o céu ficou escurinho!!... Quem está faltando?!... O sol... a nuvem... ou a estrela?!', resposta: 'A estrela! Voltou a brilhar!' },
    6: { pergunta: 'Qual presente é o pequenininho? O da esquerda... ou o da direita?', resposta: 'O da esquerda! Pequenininho e cheio de amor!' },
    7: { pergunta: 'Uma destas coroas quis ser diferente! Qual é?', resposta: 'A azul! Que charmosa!' },
    8: {
      pergunta: 'Olha a filinha! Quem vem agora? O camelo... a estrela... ou o presente?',
      perguntaVoz: 'Olha a filinha!!... Quem vem agora?!... O camelo... a estrela... ou o presente?!',
      resposta: 'O camelo! Ele não perde a fila!',
    },
    9: { pergunta: 'Tem um engraçadinho no deserto! Quem não mora lá? O boneco de neve... a palmeira... ou o camelo?', perguntaVoz: 'Tem um engraçadinho no deserto!!... Quem não mora lá?!... O boneco de neve... a palmeira... ou o camelo?!', resposta: 'O boneco de neve! Ha ha! No calor ele vira sorvete!' },
    10: {
      mostrar: 'Olhe bem onde o menino Jesus está.',
      pergunta: 'As cartas dançaram! Onde ele ficou? No um... no dois... ou no três?',
      perguntaVoz: 'As cartas dançaram!!... Onde ele ficou?!... No um... no dois... ou no três?!',
      resposta: 'No número um! Que olhinho esperto!',
    },
    13: {
      mostrar: 'Olhe bem os presentes!',
      pergunta: 'Ué, um presente foi dar uma voltinha! Qual foi? O azul... o vermelho... ou o amarelo?',
      perguntaVoz: 'Ué, um presente foi dar uma voltinha!!... Qual foi?!... O azul... o vermelho... ou o amarelo?!',
      resposta: 'O vermelho! Já, já ele volta!',
    },
    14: { mostrar: 'Olha os reis chegando, um de cada vez!', pergunta: 'Quem chegou primeiro? O de roxo... o de verde... ou o de vermelho?', resposta: 'O de verde! Chegou todo contente!' },
  },
  encerramento: 'Que passeio gostoso! Até a próxima, amiguinho!',
  v2: {
    gancho: 'Hoje a gente vai passear com os reis magos. São doze brincadeiras, e a última é uma surpresa. Vem comigo?',
    surpresa: 'Olha, a estrela está passeando! Vamos passear também?',
    metade: 'Já passeamos um montão! Está gostoso brincar com você!',
    ultimo: 'Estamos chegando! Agora vem a brincadeira surpresa!',
    encerramento: 'Uhuu! Que passeio gostoso! Os reis magos encontraram o menino Jesus e deram os presentes com muito carinho. Vem brincar comigo de novo!',
  },
};
