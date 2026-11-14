'use strict';
/**
 * Vídeo 6 — O Foguete da Tuti (números em inglês, de one a ten): texto exato
 * da locução, como aprovado em v6-ingles-numeros/01-narrativa.md.
 *
 * Marcas no texto: {en: ...} é a Tuti falando inglês; {bip: ...} é o robô Bip.
 * As contagens são falas separadas, cortadas em partes (um número por parte),
 * para cada número acender na tela junto com a voz.
 */
const LEDA_PT = { nome: 'pt-BR-Chirp3-HD-Leda', lang: 'pt-BR', velocidade: 0.94 };
const CINCO = { partes: 5, pausas: [0.8, 0.8, 0.8, 0.8], minParte: 0.15 };

module.exports = {
  voz: {
    nome: LEDA_PT.nome,
    velocidade: 0.94,
    estilo: 'animada',
    vozes: {
      pt: LEDA_PT,
      en: { nome: 'en-US-Chirp3-HD-Leda', lang: 'en-US', velocidade: 0.88 },
      bip: { nome: 'en-US-Chirp3-HD-Puck', lang: 'en-US', velocidade: 0.95 },
    },
  },
  contagem: 10, // segundos para pensar nos jogos de resposta
  palavras: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
  falas: [
    { id: 'v6_ab_1', texto: '{en: Hello!} Oi, amiguinho! Hoje a Tuti vai de foguete até a Lua! Este é o meu amigo, o robô Bip.' },
    { id: 'v6_ab_bip', texto: '{bip: Hello! I am Bip!}', bicho: true },
    { id: 'v6_ab_2', texto: 'O foguete só decola se a gente contar até dez em inglês. Você me ajuda? Vamos treinar!' },

    { id: 'v6_l1_intro', texto: 'Primeiro, de um a cinco. Olhe as estrelas!' },
    Object.assign({ id: 'v6_conta_1a5', texto: '{en: One... two... three... four... five!}' }, CINCO),
    { id: 'v6_repita', texto: 'Agora você! Repita comigo:' },
    { id: 'v6_muito_bem', texto: '{en: Very good!}' },

    { id: 'v6_j1_palmas', texto: 'Agora com o corpo! Bata palmas três vezes: {en: clap three!}' },
    { id: 'v6_conta_1a3', texto: '{en: One... two... three!}', partes: 3, pausas: [0.7, 0.7], minParte: 0.15 },
    { id: 'v6_j1_pulos', texto: 'Agora pule cinco vezes: {en: jump five!}' },
    { id: 'v6_j1_vez', texto: 'Sua vez!' },
    { id: 'v6_j1_c1', texto: '{en: Clap three!}' },
    { id: 'v6_j1_c2', texto: '{en: Jump five!}' },

    { id: 'v6_l2_intro', texto: 'Agora os números grandes, de seis a dez!' },
    Object.assign({ id: 'v6_conta_6a10', texto: '{en: Six... seven... eight... nine... ten!}' }, CINCO),
    { id: 'v6_l2_fim', texto: 'Você já sabe contar até dez!' },

    { id: 'v6_j2_pergunta', texto: 'Qual é o {en: number four}? O dois... o quatro... ou o sete?', tipo: 'pergunta', partes: 4, pausas: [0.9, 1.0, 1.0] },
    { id: 'v6_j2_resposta', texto: 'O quatro! {en: Four!} Muito bem!' },

    { id: 'v6_j3_pergunta', texto: 'Quantas estrelas tem no céu? Conte com calma!', tipo: 'pergunta' },
    { id: 'v6_j3_vamos', texto: 'Vamos contar!' },
    { id: 'v6_conta_1a7', texto: '{en: One... two... three... four... five... six... seven!}', partes: 7, pausas: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7], minParte: 0.15 },
    { id: 'v6_j3_fim', texto: '{en: Seven} estrelas!' },

    { id: 'v6_j4_intro', texto: 'O Bip vai contar, mas vai pular um número. Escute!' },
    { id: 'v6_j4_bip', texto: '{bip: One... two... four!}', partes: 3, pausas: [0.8, 0.8], minParte: 0.15, bicho: true },
    { id: 'v6_j4_pergunta', texto: 'Qual número faltou? O três... o cinco... ou o seis?', tipo: 'pergunta', partes: 4, pausas: [0.9, 1.0, 1.0] },
    { id: 'v6_j4_resposta', texto: 'O três! {en: Three!} {bip: Oops! Three!}' },

    { id: 'v6_j5_mostrar', texto: 'Olhe bem onde o {en: ten} está.' },
    {
      id: 'v6_j5_pergunta',
      texto: 'As cartas trocaram de lugar! Onde está o dez? No um... no dois... ou no três?',
      tipo: 'pergunta',
      partes: 5,
      pausas: [0.5, 0.8, 0.9, 0.9],
      vozTexto: 'As cartas trocaram de lugar!!... Onde está o dez?!... No um... no dois... ou no três?!',
    },
    { id: 'v6_j5_resposta', texto: 'No número três! {en: Ten!} Você tem olho bom!' },

    { id: 'v6_f_intro', texto: 'Chegou a hora! Todos a bordo! Conte comigo, de trás para a frente!' },
    Object.assign({ id: 'v6_conta_10a6', texto: '{en: Ten... nine... eight... seven... six...}' }, CINCO),
    Object.assign({ id: 'v6_conta_5a1', texto: '{en: Five... four... three... two... one!}' }, CINCO),
    { id: 'v6_f_bip', texto: '{bip: Blast off!}', bicho: true },
    { id: 'v6_f_lua', texto: 'Uhuuu! Chegamos à Lua! Você contou até dez em inglês!' },
    { id: 'v6_tchau', texto: '{en: Bye-bye!} Tchau, amiguinho!' },
  ],
};
