'use strict';
/**
 * Vídeo 7 — O Arco-Íris Sumiu (cores em inglês): texto exato da locução, como
 * aprovado em v7-ingles-cores/01-narrativa.md.
 *
 * Marcas no texto: {en: ...} é a Tuti falando inglês; {leo: ...} é o camaleão Leo.
 */
const LEDA_PT = { nome: 'pt-BR-Chirp3-HD-Leda', lang: 'pt-BR', velocidade: 0.94 };
const TRES = { tipo: 'pergunta', partes: 4, pausas: [0.9, 1.0, 1.0] };

/** As seis cores, na ordem em que são ensinadas: nome em inglês, cor da tinta e a frase da Tuti. */
const CORES = [
  { en: 'red', hex: '#E25A52', frase: 'A maçã é vermelha. Em inglês, vermelho é {en: red}! Sua vez: {en: red}!' },
  { en: 'yellow', hex: '#FFD23F', frase: 'O sol é amarelo. Em inglês, amarelo é {en: yellow}! Sua vez: {en: yellow}!' },
  { en: 'blue', hex: '#4DA3FF', frase: 'O céu é azul. Em inglês, azul é {en: blue}! Sua vez: {en: blue}!' },
  { en: 'green', hex: '#5DBB7A', frase: 'A grama é verde. Em inglês, verde é {en: green}! Sua vez: {en: green}!' },
  { en: 'orange', hex: '#FF9838', frase: 'A laranja é laranja! Em inglês, laranja é {en: orange}! Sua vez: {en: orange}!' },
  { en: 'purple', hex: '#9B7EDE', frase: 'A uva é roxa. Em inglês, roxo é {en: purple}! Sua vez: {en: purple}!' },
];
const cap = (s) => s[0].toUpperCase() + s.slice(1);

const falas = [
  { id: 'v7_ab_1', texto: '{en: Hello!} Oi, amiguinho! Olha só: as cores sumiram! Ficou tudo cinza! Este é o meu amigo, o camaleão Leo.' },
  { id: 'v7_ab_leo', texto: '{leo: Hello! I am Leo!}', bicho: true },
  { id: 'v7_ab_2', texto: 'Para as cores voltarem, a gente precisa dizer o nome delas em inglês. Você me ajuda? Pegue o seu pincel!' },
];
for (const c of CORES) {
  falas.push({ id: `v7_c_${c.en}`, texto: c.frase });
  falas.push({ id: `v7_leo_${c.en}`, texto: `{leo: ${cap(c.en)}!}`, bicho: true });
}
falas.push(
  { id: 'v7_muito_bem', texto: '{en: Very good!}' },
  { id: 'v7_j1_intro', texto: 'O Leo vai mudar de cor. Diga a cor em inglês bem rápido!' },
  { id: 'v7_j1_blue', texto: '{en: Blue!}' },
  { id: 'v7_j1_red', texto: '{en: Red!}' },
  { id: 'v7_j1_yellow', texto: '{en: Yellow!}' },
  Object.assign({ id: 'v7_j2_pergunta', texto: 'Qual é o {en: green}? O vermelho... o verde... ou o roxo?' }, TRES),
  { id: 'v7_j2_resposta', texto: 'O verde! {en: Green!} Muito bem!' },
  // sem ponto no meio da pergunta: assim as pausas maiores são as que separam as opções
  Object.assign({ id: 'v7_j3_pergunta', texto: 'Mistura mágica: {en: yellow} e {en: blue} viram qual cor? Verde... laranja... ou roxo?' }, TRES),
  { id: 'v7_j3_resposta', texto: 'Viram verde! {en: Green!} Que mágica!' },
  Object.assign({ id: 'v7_j4_pergunta', texto: 'Qual não é {en: red}? A maçã... o morango... ou a banana?' }, TRES),
  { id: 'v7_j4_resposta', texto: 'A banana! Ela é {en: yellow}!' },
  { id: 'v7_j5_mostrar', texto: 'Olhe bem onde o {en: blue} está.' },
  { id: 'v7_j5_pergunta', texto: 'As cartas trocaram de lugar! Onde está o azul? No um... no dois... ou no três?', tipo: 'pergunta', partes: 5, pausas: [0.5, 0.8, 0.9, 0.9] },
  { id: 'v7_j5_resposta', texto: 'No número um! {en: Blue!} Você tem olho bom!' },
  { id: 'v7_f_intro', texto: 'As cores voltaram! Agora o arco-íris! Diga comigo!' },
  { id: 'v7_conta_cores', texto: '{en: Red... orange... yellow... green... blue... purple!}', partes: 6, pausas: [0.7, 0.7, 0.7, 0.7, 0.7], minParte: 0.15 },
  { id: 'v7_f_leo', texto: '{leo: Rainbow!}', bicho: true },
  { id: 'v7_f_fim', texto: 'Que lindo! Você pintou o mundo em inglês!' },
  { id: 'v7_tchau', texto: '{en: Bye-bye!} Tchau, amiguinho!' }
);

module.exports = {
  voz: {
    nome: LEDA_PT.nome,
    velocidade: 0.94,
    estilo: 'animada',
    vozes: {
      pt: LEDA_PT,
      en: { nome: 'en-US-Chirp3-HD-Leda', lang: 'en-US', velocidade: 0.88 },
      leo: { nome: 'en-US-Chirp3-HD-Umbriel', lang: 'en-US', velocidade: 0.9 },
    },
  },
  contagem: 10,
  CORES,
  falas,
};
