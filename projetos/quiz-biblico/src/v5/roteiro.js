'use strict';
/**
 * Vídeo 5 — A Festa dos Animais (inglês para crianças de 4 a 6 anos): texto
 * exato da locução, como aprovado em v5-ingles-animais/01-narrativa.md.
 *
 * Marcas no texto: {en: ...} é a Tuti falando inglês; {leao: ...},
 * {elefante: ...} e {girafa: ...} são os bichos, cada um com a sua voz.
 */
const LEDA_PT = { nome: 'pt-BR-Chirp3-HD-Leda', lang: 'pt-BR', velocidade: 0.94 };

module.exports = {
  // a Tuti em português é a voz de sempre; o inglês é mais devagar, para a criança entender cada palavra
  voz: {
    nome: LEDA_PT.nome,
    velocidade: 0.94,
    estilo: 'animada',
    vozes: {
      pt: LEDA_PT,
      en: { nome: 'en-US-Chirp3-HD-Leda', lang: 'en-US', velocidade: 0.88 },
      leao: { nome: 'en-US-Chirp3-HD-Orus', lang: 'en-US', velocidade: 0.9 }, // grave
      elefante: { nome: 'en-US-Chirp3-HD-Iapetus', lang: 'en-US', velocidade: 0.82 }, // média e calma
      girafa: { nome: 'en-US-Chirp3-HD-Zephyr', lang: 'en-US', velocidade: 0.92 }, // aguda
    },
  },
  contagem: 10, // segundos para pensar nos desafios de resposta
  pausaSuaVez: 3, // segundos para a criança repetir ou fazer o gesto
  cortes: {},
  // `bicho`: a fala é só de um bicho (a altura da Tuti não serve de alvo)
  falas: [
    { id: 'v5_abertura', texto: '{en: Hello!} Oi, amiguinho! Eu sou a Tuti! Hoje tem festa e a gente vai brincar de inglês! {en: Hello} quer dizer oi, e a gente acena assim. Acene comigo! {en: Hello! Hello!}' },
    { id: 'v5_v1_fala', texto: 'Eu sou uma ovelhinha. Em inglês, ovelha é {en: sheep}! Faça o som comigo: béééé! {en: Sheep!}' },
    { id: 'v5_v1_elogio', texto: '{en: Very good!} Muito bem!' },

    { id: 'v5_v2_antes', texto: 'Shhh... escute! Tem alguém na caixa! Rrrawr! Quem será?' },
    { id: 'v5_v2_bicho', texto: '{leao: Hello! I am a lion! Rrrawr!}', bicho: true },
    { id: 'v5_v2_convite', texto: 'O leão! Em inglês, leão é {en: lion}! Faça garras e ruja comigo: rrrawr!' },
    { id: 'v5_v2_elogio', texto: '{en: Very good!} Muito bem!' },

    { id: 'v5_v3_antes', texto: 'Shhh... outra caixa! Pawooo! Quem será?' },
    { id: 'v5_v3_bicho', texto: '{elefante: Hello! I am an elephant! Pawooo!}', bicho: true },
    { id: 'v5_v3_convite', texto: 'O elefante! Em inglês, elefante é {en: elephant}! Balance o braço, que é a tromba!' },
    { id: 'v5_v3_elogio', texto: '{en: Very good!} Muito bem!' },

    { id: 'v5_v4_antes', texto: 'Uau, essa caixa é altíssima! Quem será?' },
    { id: 'v5_v4_bicho', texto: '{girafa: Hello! I am a giraffe! Hello up there!}', bicho: true },
    { id: 'v5_v4_convite', texto: 'A girafa! Em inglês, girafa é {en: giraffe}! Fique na ponta dos pés, bem alto!' },
    { id: 'v5_v4_elogio', texto: '{en: Very good!} Muito bem!' },

    { id: 'v5_j1_intro', texto: 'Agora é a vez do jogo "A Tuti diz"! Quando eu disser em inglês, você faz.' },
    { id: 'v5_j1_c1', texto: '{en: Jump!} Pule!' },
    { id: 'v5_j1_c2', texto: '{en: Clap!} Bata palmas!' },
    { id: 'v5_j1_c3', texto: '{en: Spin!} Gire!' },
    { id: 'v5_j1_s0', texto: 'Agora sem eu mostrar! A Tuti diz:' },
    { id: 'v5_j1_s1', texto: '{en: Jump!}' },
    { id: 'v5_j1_s2', texto: '{en: Clap!}' },
    { id: 'v5_j1_s3', texto: '{en: Spin!}' },
    { id: 'v5_j1_fim', texto: '{en: Very good!} Você é demais!' },

    { id: 'v5_j2_pergunta', texto: 'Qual é o {en: lion}? O elefante... o leão... ou a girafa?', tipo: 'pergunta', partes: 4, pausas: [0.9, 1.0, 1.0] },
    { id: 'v5_j2_resposta', texto: 'O leão! {en: Lion!} Você sabe inglês!' },

    { id: 'v5_j3_pergunta', texto: 'A {en: giraffe} se escondeu! Você consegue encontrar?', tipo: 'pergunta' },
    { id: 'v5_j3_resposta', texto: 'Achou! A {en: giraffe} estava atrás da árvore!' },

    { id: 'v5_j4_pergunta', texto: 'Vamos contar os elefantes em inglês! Bata palmas comigo!' },
    { id: 'v5_j4_contagem', texto: '{en: One... two... three... four... five!}', partes: 5, pausas: [0.85, 0.85, 0.85, 0.85], minParte: 0.15 },
    { id: 'v5_j4_resposta', texto: '{en: Five elephants!} Cinco elefantes! {en: Very good!}' },

    { id: 'v5_j5_mostrar', texto: 'Olhe bem onde o {en: lion} está.' },
    {
      id: 'v5_j5_pergunta',
      texto: 'As cartas trocaram de lugar! Onde está o leão? No um... no dois... ou no três?',
      tipo: 'pergunta',
      partes: 5,
      pausas: [0.5, 0.8, 0.9, 0.9],
      vozTexto: 'As cartas trocaram de lugar!!... Onde está o leão?!... No um... no dois... ou no três?!',
    },
    { id: 'v5_j5_resposta', texto: 'No número dois! {en: Lion!} Você tem olho bom!' },

    { id: 'v5_encerramento', texto: 'Que festa linda! Hoje você aprendeu {en: hello}, {en: sheep}, {en: lion}, {en: elephant}, {en: giraffe}! Vamos dançar? Dance com os bichos!' },
    { id: 'v5_tchau', texto: '{en: Bye-bye!} Tchau, amiguinho!' },
  ],
};
