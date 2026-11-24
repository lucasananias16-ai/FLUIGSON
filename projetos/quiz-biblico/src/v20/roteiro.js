'use strict';
/**
 * Vídeo 20 — Quiz de Natal 10: o Natal no Polo Norte: texto exato da locução (12 desafios),
 * conforme v20-natal-polo-norte/01-narrativa.md. As opções são faladas na ordem da tela.
 */
module.exports = {
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10,
  cortes: {},
  abertura: 'Oi, amiguinho! A Tuti voltou! Hoje vamos visitar o Polo Norte, a casa do Papai Noel! Brrr, que frio! São doze desafios. Vamos lá!',
  desafios: {
    1: { pergunta: 'O pinguim se escondeu no gelo! Você consegue encontrar?', resposta: 'Achou! Ele estava atrás do iglu! Que esconderijo gelado!' },
    2: { pergunta: 'O pinguim pescou uns peixinhos. Conte comigo!', contagem: 'Um... dois... três... quatro... cinco!', resposta: 'Cinco peixinhos! Muito bem!' },
    3: { pergunta: 'Faz muito frio no Polo Norte! O que a gente veste? O maiô... o casaco... ou o chinelo?', perguntaVoz: 'Faz muito frio no Polo Norte!!... O que a gente veste?!... O maiô... o casaco... ou o chinelo?!', resposta: 'O casaco! Quentinho!' },
    4: { pergunta: 'De quem é essa sombra? Da foca... do urso-polar... ou do pinguim?', resposta: 'Do urso-polar! Ele é branquinho como a neve!' },
    5: { pergunta: 'O que está faltando na casinha do Papai Noel? A chaminé... a janela... ou a porta?', resposta: 'A chaminé! É por ela que sai a fumacinha!' },
    6: { pergunta: 'Qual urso-polar é o maior? O da esquerda... ou o da direita?', resposta: 'O da esquerda! Que ursão!' },
    7: { pergunta: 'Um destes pinguins é diferente! Qual é?', resposta: 'O de cachecol vermelho! Os outros têm cachecol azul!' },
    8: {
      pergunta: 'Olhe a fila no céu! O que vem depois? O floco... o presente... ou a estrela?',
      perguntaVoz: 'Olhe a fila no céu!!... O que vem depois?!... O floco... o presente... ou a estrela?!',
      resposta: 'A estrela! Floco, estrela, floco, estrela!',
    },
    9: { pergunta: 'Quem não mora no Polo Norte? O pinguim... o camelo... ou a foca?', resposta: 'O camelo! Ha ha! Ele gosta do deserto quentinho!' },
    10: {
      mostrar: 'Olhe bem onde o pinguim está.',
      pergunta: 'As cartas trocaram de lugar! Onde está o pinguim? No um... no dois... ou no três?',
      perguntaVoz: 'As cartas trocaram de lugar!!... Onde está o pinguim?!... No um... no dois... ou no três?!',
      resposta: 'No número um! Você tem olho bom!',
    },
    11: { pergunta: 'Onde o Papai Noel guarda os presentes? No saco vermelho... no balde... ou no aquário?', resposta: 'No saco vermelho! Cheinho de presentes!' },
    12: { pergunta: 'O que deixa o céu do Polo Norte colorido? O arco-íris... a aurora... ou os fogos?', resposta: 'A aurora! Verde e roxa, que lindo!' },
  },
  encerramento: 'Que passeio gelado e gostoso! Feliz Natal, amiguinho! Até a próxima!',
  // Shorts nativos (padrão de Shorts v2, 23/11/2026): "3 em 1" das sombras do Polo Norte
  shorts: {
    sombra_q1: 'De quem é essa sombra? Rápido!',
    sombra_r1: 'Do urso-polar!',
    sombra_q2: 'E essa?',
    sombra_r2: 'Do pinguim!',
    sombra_q3: 'A última é difícil!',
    sombra_r3: 'Da foca!',
    sombra_fim: 'Acertou as três? Tenta de novo!',
  },
  // Versão 2 (padrão novo de 19/11/2026): começa no desafio 1, com gancho, reganchos e convite no fim
  v2: {
    p1_pergunta: 'Socorro! O pinguim fugiu! Você me ajuda a achar? Rápido, aponta pra ele!',
    gancho: 'Você é demais! São doze desafios, e o último é o mais difícil de todos. Vamos?',
    surpresa: 'Agora vem um desafio surpresa!',
    metade: 'Metade! Você está indo muito bem!',
    ultimo: 'E agora, o último desafio! O mais difícil de todos!',
    encerramento: 'Uhuu! Você completou os doze desafios! Feliz Natal, amiguinho! Vem jogar o próximo quiz comigo!',
  },
};
