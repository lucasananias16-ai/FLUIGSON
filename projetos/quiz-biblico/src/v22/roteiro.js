'use strict';
/**
 * Vídeo 22 — Quiz de Natal: a Véspera de Natal: texto exato da locução (12 desafios),
 * conforme v22-natal-vespera/01-narrativa.md. As opções são faladas na ordem da tela.
 * Já nasce no padrão novo (19/11/2026): as falas `v2` são as que o vídeo usa.
 */
module.exports = {
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10,
  cortes: {},
  abertura: 'Oi, amiguinho! A Tuti voltou! Hoje é véspera de Natal! São doze desafios. Vamos lá!',
  desafios: {
    1: { pergunta: 'O biscoito se escondeu na sala! Você consegue encontrar?', resposta: 'Achou! Ele estava atrás da poltrona! Que biscoito levado!' },
    2: { pergunta: 'Tem meias penduradas na sala. Conte comigo!', contagem: 'Um... dois... três... quatro... cinco!', resposta: 'Cinco meias! Muito bem!' },
    3: { pergunta: 'O Papai Noel chega com fome! O que a gente deixa para ele? O leite com biscoito... o sapato... ou a pedra?', perguntaVoz: 'O Papai Noel chega com fome!!... O que a gente deixa para ele?!... O leite com biscoito... o sapato... ou a pedra?!', resposta: 'O leite com biscoito! Que delícia!' },
    4: { pergunta: 'De quem é essa sombra? Do sino... da meia... ou da vela?', resposta: 'Da meia! A meia de Natal!' },
    5: { pergunta: 'O que está faltando na lareira? A neve... a flor... ou o fogo?', resposta: 'O fogo! Agora a sala fica quentinha!' },
    6: { pergunta: 'Qual meia é a maior? A da esquerda... ou a da direita?', resposta: 'A da esquerda! Que meião!' },
    7: { pergunta: 'Uma destas meias é diferente! Qual é?', resposta: 'A verde! As outras são vermelhas!' },
    8: {
      pergunta: 'Olhe a fila! O que vem depois? A vela... o presente... ou o sino?',
      perguntaVoz: 'Olhe a fila!!... O que vem depois?!... A vela... o presente... ou o sino?!',
      resposta: 'O sino! Vela, sino, vela, sino!',
    },
    9: { pergunta: 'O que não combina com a noite de Natal? A vela... a boia... ou o sino?', resposta: 'A boia! Ha ha! Ninguém vai nadar agora!' },
    10: {
      mostrar: 'Olhe bem onde a meia está.',
      pergunta: 'As cartas trocaram de lugar! Onde está a meia? No um... no dois... ou no três?',
      perguntaVoz: 'As cartas trocaram de lugar!!... Onde está a meia?!... No um... no dois... ou no três?!',
      resposta: 'No número três! Você tem olho bom!',
    },
    11: { pergunta: 'O que a gente veste para dormir? O pijama... o casaco... ou a bermuda?', resposta: 'O pijama! Bem quentinho!' },
    12: { pergunta: 'Quando o Papai Noel chega? De manhã... de tarde... ou de noite?', resposta: 'De noite! Quando todo mundo está dormindo!' },
  },
  encerramento: 'Agora é hora de dormir, que o Papai Noel já vem! Feliz Natal, amiguinho!',
  v2: {
    p1_pergunta: 'Socorro! O biscoito fugiu! Você me ajuda a achar? Rápido, aponta pra ele!',
    gancho: 'Você é demais! São doze desafios, e o último é o mais difícil de todos. Vamos?',
    surpresa: 'Agora vem um desafio surpresa!',
    metade: 'Metade! Você está indo muito bem!',
    ultimo: 'E agora, o último desafio! O mais difícil de todos!',
    encerramento: 'Uhuu! Você completou os doze desafios! Agora é hora de dormir, que o Papai Noel já vem. Vem jogar o próximo quiz comigo!',
  },
};
