'use strict';
/**
 * Vídeo 16 — Quiz Bíblico: a Criação do Mundo: texto exato da locução (12 desafios),
 * conforme v16-biblico-criacao/01-narrativa.md. As opções são faladas na ordem da tela.
 */
module.exports = {
  voz: { nome: 'pt-BR-Chirp3-HD-Leda', velocidade: 0.94, estilo: 'animada' },
  contagem: 10,
  cortes: {},
  abertura: 'Oi, amiguinho! A Tuti voltou! Hoje a história é de como Deus criou o mundo! São doze desafios. Vamos lá!',
  desafios: {
    1: { pergunta: 'Um passarinho se escondeu no jardim! Você consegue encontrar?', resposta: 'Achou! Ele estava atrás da árvore! Deus fez os passarinhos.' },
    2: { pergunta: 'Deus fez as estrelas no céu. Conte comigo!', contagem: 'Um... dois... três... quatro... cinco!', resposta: 'Cinco estrelas! Muito bem!' },
    3: { pergunta: 'O que Deus fez primeiro? A luz... o carro... ou a casa?', resposta: 'A luz! Deus disse: haja luz! E a luz apareceu!' },
    4: { pergunta: 'De quem é essa sombra? Do leão... da girafa... ou do elefante?', resposta: 'Do elefante! Deus fez os bichos grandes e pequenos!' },
    5: { pergunta: 'O que está faltando no céu da noite? O sol... a lua... ou o guarda-chuva?', resposta: 'A lua! Deus fez a lua para brilhar de noite!' },
    6: { pergunta: 'Quem é o maior? A ovelhinha... ou o elefante?', resposta: 'O elefante! Ele é enorme!' },
    7: { pergunta: 'Uma destas flores é diferente! Qual é?', resposta: 'A cor-de-rosa! As outras são amarelas!' },
    8: {
      pergunta: 'Olhe o céu! O que vem depois? A lua... a estrela... ou o sol?',
      perguntaVoz: 'Olhe o céu!!... O que vem depois?!... A lua... a estrela... ou o sol?!',
      resposta: 'A lua! Sol, lua, sol, lua! O dia e a noite!',
    },
    9: { pergunta: 'O que Deus não criou? A árvore... o peixe... ou o foguete?', resposta: 'O foguete! As pessoas é que fizeram o foguete!' },
    10: {
      mostrar: 'Olhe bem onde o sol está.',
      pergunta: 'As cartas trocaram de lugar! Onde está o sol? No um... no dois... ou no três?',
      perguntaVoz: 'As cartas trocaram de lugar!!... Onde está o sol?!... No um... no dois... ou no três?!',
      resposta: 'No número três! Você tem olho bom!',
    },
    11: { pergunta: 'Quem mora na água? O leão... o peixe... ou o passarinho?', resposta: 'O peixe! Deus encheu o mar de peixinhos!' },
    12: { pergunta: 'No sétimo dia, o que Deus fez? Descansou... correu... ou nadou?', resposta: 'Descansou! Deus viu que tudo era muito bom!' },
  },
  encerramento: 'Deus fez tudo com muito amor, e tudo era muito bom! Até a próxima, amiguinho!',
};
