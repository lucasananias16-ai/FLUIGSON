'use strict';
/**
 * Gera os Shorts (1080 x 1920, menos de 60 s). Cada Short é uma pergunta de
 * cards de um vídeo longo, com o mesmo áudio, no molde de src/shorts/molde.js.
 *
 * Uso: node src/shorts/gerar.js [id ...]     (sem id, gera todos)
 *
 * O MP4 vai para _rascunho/video/shorts/ e os textos do YouTube para a pasta
 * `shorts/` do vídeo de origem.
 */
const fs = require('fs');
const path = require('path');
const A = require('../audio');
const sfx = require('../anim/sfx');
const { renderVideo, stills } = require('../anim/render');
const { mixar, comTrilha, ganhoParaAlvo, narr48 } = require('../anim/mix');
const musica = require('../anim/musica');
const { criarShort, criarShortMemoria } = require('./molde');
const { criarTresSombras } = require('./tresEmUm');
const fundos = require('./fundos');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, '_rascunho', 'video', 'shorts');
const NARR_SHORTS = path.join(ROOT, 'shorts', 'narracao'); // falas dos Shorts nativos

/** Um Short a partir de uma pergunta de cards de um vídeo. */
function deVideo({ v, pasta, n, fundo, selo, corSelo, tutiOpts = {}, primeiraOpcao = 1, inicioRapido = false }) {
  const desafios = require(`../${v}/desafios`);
  const q = desafios.find((x) => x.n === n);
  return () =>
    criarShort({
      q,
      narrDir: path.join(ROOT, pasta, 'narracao'),
      idPergunta: `${v}_p${n}_pergunta`,
      idResposta: `${v}_p${n}_resposta`,
      fundo,
      selo,
      corSelo,
      tutiOpts,
      primeiraOpcao,
      inicioRapido,
    });
}

/** Um Short do jogo da memória de um vídeo. */
function memoriaDeVideo({ v, pasta, n, fundo, selo, corSelo, tutiOpts = {} }) {
  const desafios = require(`../${v}/desafios`);
  const d = desafios.find((x) => x.n === n);
  const p = `${v}_p${n}_`;
  return () => criarShortMemoria({ d, narrDir: path.join(ROOT, pasta, 'narracao'), ids: { mostrar: p + 'mostrar', pergunta: p + 'pergunta', resposta: p + 'resposta' }, fundo, selo, corSelo, tutiOpts });
}

/**
 * Lista dos Shorts. `pasta` é a pasta do vídeo de origem; `textos` vira o
 * arquivo de título, descrição e tags.
 */
const SHORTS = [
  {
    // o mais visto do canal (Vídeo 2); a pergunta do skate é a mais engraçada, a que eu apostaria para viralizar
    id: 'v2_short1',
    pasta: 'v2-davi-e-golias',
    criar: deVideo({ v: 'v2', pasta: 'v2-davi-e-golias', n: 6, fundo: fundos.pasto, selo: 'QUIZ BÍBLICO', corSelo: '#FFD23F' }),
    textos: {
      titulo: 'O que não combina com o pastor Davi? 😂 Você acerta? #shorts',
      descricao:
        'Uma dessas coisas não existia no tempo de Davi! Você tem 10 segundos para descobrir. 🐑\n\nQuiz bíblico para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 8 desafios, é o "Quiz Bíblico de Davi e Golias para crianças", no canal Quizzito.\n\n#QuizBíblico #DaviEGolias #BíbliaParaCrianças #shorts',
      tags: ['quiz bíblico infantil', 'davi e golias', 'quiz para crianças', 'bíblia para crianças', 'histórias bíblicas para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    // segundo Short do mais visto: a pergunta central da história
    id: 'v2_short2',
    pasta: 'v2-davi-e-golias',
    criar: deVideo({ v: 'v2', pasta: 'v2-davi-e-golias', n: 5, fundo: fundos.pasto, selo: 'QUIZ BÍBLICO', corSelo: '#FFD23F' }),
    textos: {
      titulo: 'O que Davi levou para enfrentar o gigante Golias? Você acerta? #shorts',
      descricao:
        'Funda, espada ou escudo? Você tem 10 segundos para responder bem alto! 🐑\n\nQuiz bíblico para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 8 desafios, é o "Quiz Bíblico de Davi e Golias para crianças", no canal Quizzito.\n\nBase bíblica: 1 Samuel 17.\n\n#QuizBíblico #DaviEGolias #BíbliaParaCrianças #shorts',
      tags: ['quiz bíblico infantil', 'davi e golias', 'funda de davi', 'quiz para crianças', 'bíblia para crianças', 'escola dominical', 'ovelhinha Tuti'],
    },
  },
  {
    // jogo da memória do vídeo mais visto: segura a criança até o fim, por isso também é aposta para viralizar
    id: 'v2_short3',
    pasta: 'v2-davi-e-golias',
    criar: memoriaDeVideo({ v: 'v2', pasta: 'v2-davi-e-golias', n: 7, fundo: fundos.pasto, selo: 'QUIZ BÍBLICO' }),
    textos: {
      titulo: 'Onde está a harpa do Davi? 👀 Jogo da memória #shorts',
      descricao:
        'Olhe bem onde está a harpa... as cartas vão trocar de lugar! Você consegue acompanhar? 🐑\n\nJogo da memória para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 8 desafios, é o "Quiz Bíblico de Davi e Golias para crianças", no canal Quizzito.\n\n#QuizBíblico #JogoDaMemória #DaviEGolias #shorts',
      tags: ['jogo da memória infantil', 'quiz bíblico infantil', 'davi e golias', 'harpa de davi', 'quiz para crianças', 'bíblia para crianças', 'ovelhinha Tuti'],
    },
  },
  {
    // quarto Short do Davi e Golias: a última pergunta do vídeo, sobre o que Davi virou
    id: 'v2_short4',
    pasta: 'v2-davi-e-golias',
    criar: deVideo({ v: 'v2', pasta: 'v2-davi-e-golias', n: 8, fundo: fundos.pasto, selo: 'QUIZ BÍBLICO', corSelo: '#FFD23F' }),
    textos: {
      titulo: 'Quando cresceu, Davi virou o quê? 👑 Você acerta? #shorts',
      descricao:
        'Padeiro, pescador ou rei? Você tem 10 segundos para responder bem alto! 🐑\n\nQuiz bíblico para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 8 desafios, é o "Quiz Bíblico de Davi e Golias para crianças", no canal Quizzito.\n\nBase bíblica: 2 Samuel 5.\n\n#QuizBíblico #DaviEGolias #BíbliaParaCrianças #shorts',
      tags: ['quiz bíblico infantil', 'davi e golias', 'rei davi', 'quiz para crianças', 'bíblia para crianças', 'escola dominical', 'ovelhinha Tuti'],
    },
  },
  {
    id: 'v12_short1',
    pasta: 'v12-natal-boneco-neve',
    criar: deVideo({ v: 'v12', pasta: 'v12-natal-boneco-neve', n: 9, fundo: fundos.neve, selo: 'QUIZ DE NATAL', tutiOpts: { gorro: true } }),
    textos: {
      titulo: 'O que não combina com a neve? 😂 Você acerta? #shorts',
      descricao:
        'Uma dessas coisas não é nada boa para brincar na neve! Você tem 10 segundos para descobrir. ⛄\n\nQuiz para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz de Natal 6: o Boneco de Neve", no canal Quizzito.\n\n#QuizDeNatal #BonecoDeNeve #QuizInfantil #shorts',
      tags: ['quiz de natal', 'boneco de neve', 'quiz infantil', 'quiz para crianças', 'natal para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v12_short2',
    pasta: 'v12-natal-boneco-neve',
    criar: deVideo({ v: 'v12', pasta: 'v12-natal-boneco-neve', n: 11, fundo: fundos.neve, selo: 'QUIZ DE NATAL', tutiOpts: { gorro: true } }),
    textos: {
      titulo: 'Quem adora o frio e mora no gelo? 🐧 Você acerta? #shorts',
      descricao:
        'Camelo, leão ou pinguim? Você tem 10 segundos para responder bem alto! ⛄\n\nQuiz para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz de Natal 6: o Boneco de Neve", no canal Quizzito.\n\n#QuizDeNatal #QuizDeAnimais #QuizInfantil #shorts',
      tags: ['quiz de natal', 'pinguim', 'quiz de animais', 'quiz infantil', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v12_short3',
    pasta: 'v12-natal-boneco-neve',
    criar: memoriaDeVideo({ v: 'v12', pasta: 'v12-natal-boneco-neve', n: 10, fundo: fundos.neve, selo: 'QUIZ DE NATAL', tutiOpts: { gorro: true } }),
    textos: {
      titulo: 'Onde está a luva? 👀 Jogo da memória de Natal #shorts',
      descricao:
        'Olhe bem onde está a luva... as cartas vão trocar de lugar! Você consegue acompanhar? ⛄\n\nJogo da memória para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz de Natal 6: o Boneco de Neve", no canal Quizzito.\n\n#JogoDaMemória #QuizDeNatal #BonecoDeNeve #shorts',
      tags: ['jogo da memória infantil', 'quiz de natal', 'boneco de neve', 'quiz para crianças', 'natal para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v13_short1',
    pasta: 'v13-biblico-jonas',
    criar: deVideo({ v: 'v13', pasta: 'v13-biblico-jonas', n: 10, fundo: fundos.praia, selo: 'QUIZ BÍBLICO' }),
    textos: {
      titulo: 'O que não combina com o mar? 😂 Você acerta? #shorts',
      descricao:
        'Uma dessas coisas não ia gostar nada do mar quentinho! Você tem 10 segundos para descobrir. 🐟\n\nQuiz bíblico para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz Bíblico de Jonas e o Grande Peixe para crianças", no canal Quizzito.\n\n#QuizBíblico #Jonas #BíbliaParaCrianças #shorts',
      tags: ['quiz bíblico infantil', 'jonas e o grande peixe', 'quiz para crianças', 'bíblia para crianças', 'histórias bíblicas para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v13_short2',
    pasta: 'v13-biblico-jonas',
    criar: deVideo({ v: 'v13', pasta: 'v13-biblico-jonas', n: 5, fundo: fundos.praia, selo: 'QUIZ BÍBLICO' }),
    textos: {
      titulo: 'O que aconteceu no mar quando Jonas fugiu? Você acerta? #shorts',
      descricao:
        'Tempestade, neve ou arco-íris? Você tem 10 segundos para responder bem alto! 🐟\n\nQuiz bíblico para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz Bíblico de Jonas e o Grande Peixe para crianças", no canal Quizzito.\n\nBase bíblica: Jonas 1.\n\n#QuizBíblico #Jonas #BíbliaParaCrianças #shorts',
      tags: ['quiz bíblico infantil', 'jonas e o grande peixe', 'jonas e a baleia', 'quiz para crianças', 'bíblia para crianças', 'escola dominical', 'ovelhinha Tuti'],
    },
  },
  {
    id: 'v13_short3',
    pasta: 'v13-biblico-jonas',
    criar: memoriaDeVideo({ v: 'v13', pasta: 'v13-biblico-jonas', n: 11, fundo: fundos.praia, selo: 'QUIZ BÍBLICO' }),
    textos: {
      titulo: 'Onde está o grande peixe de Jonas? 👀 Jogo da memória #shorts',
      descricao:
        'Olhe bem onde está o grande peixe... as cartas vão trocar de lugar! Você consegue acompanhar? 🐟\n\nJogo da memória para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz Bíblico de Jonas e o Grande Peixe para crianças", no canal Quizzito.\n\n#QuizBíblico #JogoDaMemória #Jonas #shorts',
      tags: ['jogo da memória infantil', 'quiz bíblico infantil', 'jonas e o grande peixe', 'quiz para crianças', 'bíblia para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v14_short1',
    pasta: 'v14-jogo-da-memoria',
    criar: memoriaDeVideo({ v: 'v14', pasta: 'v14-jogo-da-memoria', n: 5, fundo: fundos.pasto, selo: 'JOGO DA MEMÓRIA' }),
    textos: {
      titulo: 'Onde está a girafa? 🦒 Jogo da memória #shorts',
      descricao:
        'Olhe bem onde está a girafa... as cartas vão trocar de lugar! Você consegue acompanhar? 🐑\n\nJogo da memória para crianças de 3 a 7 anos, com a ovelhinha Tuti. O jogo completo, com 12 desafios, é o "Jogo da Memória para crianças", no canal Quizzito.\n\n#JogoDaMemória #JogosEducativos #shorts',
      tags: ['jogo da memória', 'jogo da memória infantil', 'teste de memória', 'jogos educativos infantis', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v14_short2',
    pasta: 'v14-jogo-da-memoria',
    criar: memoriaDeVideo({ v: 'v14', pasta: 'v14-jogo-da-memoria', n: 10, fundo: fundos.pasto, selo: 'JOGO DA MEMÓRIA' }),
    textos: {
      titulo: 'Onde está a lua? 🌙 Jogo da memória #shorts',
      descricao:
        'Olhe bem onde está a lua... as cartas vão trocar de lugar três vezes! Você consegue acompanhar? 🐑\n\nJogo da memória para crianças de 3 a 7 anos, com a ovelhinha Tuti. O jogo completo, com 12 desafios, é o "Jogo da Memória para crianças", no canal Quizzito.\n\n#JogoDaMemória #JogosEducativos #shorts',
      tags: ['jogo da memória', 'jogo da memória infantil', 'teste de memória', 'jogos educativos infantis', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v14_short3',
    pasta: 'v14-jogo-da-memoria',
    criar: memoriaDeVideo({ v: 'v14', pasta: 'v14-jogo-da-memoria', n: 12, fundo: fundos.pasto, selo: 'JOGO DA MEMÓRIA' }),
    textos: {
      titulo: 'Onde está o foguete? 🚀 Jogo da memória #shorts',
      descricao:
        'Olhe bem onde está o foguete... as cartas vão trocar de lugar! Você consegue acompanhar? 🐑\n\nJogo da memória para crianças de 3 a 7 anos, com a ovelhinha Tuti. O jogo completo, com 12 desafios, é o "Jogo da Memória para crianças", no canal Quizzito.\n\n#JogoDaMemória #JogosEducativos #shorts',
      tags: ['jogo da memória', 'jogo da memória infantil', 'teste de memória', 'jogos educativos infantis', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v15_short1',
    pasta: 'v15-natal-cartinha',
    criar: deVideo({ v: 'v15', pasta: 'v15-natal-cartinha', n: 9, fundo: fundos.sala, selo: 'QUIZ DE NATAL', tutiOpts: { gorro: true } }),
    textos: {
      titulo: 'O que não cabe no envelope? 😂 Você acerta? #shorts',
      descricao:
        'A Tuti vai mandar a cartinha para o Papai Noel, mas uma dessas coisas não cabe no envelope! Você tem 10 segundos para descobrir. ✉️\n\nQuiz para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz de Natal 7: a Cartinha para o Papai Noel", no canal Quizzito.\n\n#QuizDeNatal #PapaiNoel #QuizInfantil #shorts',
      tags: ['quiz de natal', 'cartinha para o papai noel', 'quiz infantil', 'quiz para crianças', 'natal para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v15_short2',
    pasta: 'v15-natal-cartinha',
    // refeito em 23/11 no padrão novo: começa já com os cards caindo e a pergunta em 0,3 s
    criar: deVideo({ v: 'v15', pasta: 'v15-natal-cartinha', n: 11, fundo: fundos.sala, selo: 'QUIZ DE NATAL', tutiOpts: { gorro: true }, inicioRapido: true }),
    textos: {
      titulo: 'Quem lê as cartinhas no Polo Norte? 🎅 Você acerta? #shorts',
      descricao:
        'O pescador, o Papai Noel ou o padeiro? Você tem 10 segundos para responder bem alto! ✉️\n\nQuiz para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz de Natal para Crianças: a Cartinha para o Papai Noel", no canal Quizzito.\n\n#QuizDeNatal #PapaiNoel #QuizInfantil #shorts',
      tags: ['quiz de natal', 'papai noel', 'polo norte', 'quiz infantil', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v15_short3',
    pasta: 'v15-natal-cartinha',
    criar: memoriaDeVideo({ v: 'v15', pasta: 'v15-natal-cartinha', n: 10, fundo: fundos.sala, selo: 'QUIZ DE NATAL', tutiOpts: { gorro: true } }),
    textos: {
      titulo: 'Onde está a cartinha do Papai Noel? 👀 Jogo da memória #shorts',
      descricao:
        'Olhe bem onde está a cartinha... as cartas vão trocar de lugar! Você consegue acompanhar? ✉️\n\nJogo da memória para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz de Natal 7: a Cartinha para o Papai Noel", no canal Quizzito.\n\n#JogoDaMemória #QuizDeNatal #PapaiNoel #shorts',
      tags: ['jogo da memória infantil', 'quiz de natal', 'cartinha para o papai noel', 'quiz para crianças', 'natal para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v16_short1',
    pasta: 'v16-biblico-criacao',
    criar: deVideo({ v: 'v16', pasta: 'v16-biblico-criacao', n: 9, fundo: fundos.pasto, selo: 'QUIZ BÍBLICO' }),
    textos: {
      titulo: 'O que Deus não criou? 🚀 Você acerta? #shorts',
      descricao:
        'A árvore, o peixe ou o foguete? Uma dessas coisas foram as pessoas que fizeram! Você tem 10 segundos para descobrir. 🌍\n\nQuiz bíblico para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz Bíblico da Criação do Mundo para crianças", no canal Quizzito.\n\n#QuizBíblico #CriaçãoDoMundo #BíbliaParaCrianças #shorts',
      tags: ['quiz bíblico infantil', 'a criação do mundo', 'deus criou o mundo', 'quiz para crianças', 'bíblia para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v16_short2',
    pasta: 'v16-biblico-criacao',
    criar: deVideo({ v: 'v16', pasta: 'v16-biblico-criacao', n: 3, fundo: fundos.pasto, selo: 'QUIZ BÍBLICO' }),
    textos: {
      titulo: 'O que Deus fez primeiro? ✨ Você acerta? #shorts',
      descricao:
        'A luz, o carro ou a casa? Você tem 10 segundos para responder bem alto! 🌍\n\nQuiz bíblico para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz Bíblico da Criação do Mundo para crianças", no canal Quizzito.\n\nBase bíblica: Gênesis 1.\n\n#QuizBíblico #CriaçãoDoMundo #BíbliaParaCrianças #shorts',
      tags: ['quiz bíblico infantil', 'a criação do mundo', 'haja luz', 'quiz para crianças', 'bíblia para crianças', 'escola dominical', 'ovelhinha Tuti'],
    },
  },
  {
    id: 'v16_short3',
    pasta: 'v16-biblico-criacao',
    criar: memoriaDeVideo({ v: 'v16', pasta: 'v16-biblico-criacao', n: 10, fundo: fundos.pasto, selo: 'QUIZ BÍBLICO' }),
    textos: {
      titulo: 'Onde está o sol? 👀 Jogo da memória #shorts',
      descricao:
        'Olhe bem onde está o sol... as cartas vão trocar de lugar! Você consegue acompanhar? 🌍\n\nJogo da memória para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz Bíblico da Criação do Mundo para crianças", no canal Quizzito.\n\n#QuizBíblico #JogoDaMemória #CriaçãoDoMundo #shorts',
      tags: ['jogo da memória infantil', 'quiz bíblico infantil', 'a criação do mundo', 'quiz para crianças', 'bíblia para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v17_short1',
    pasta: 'v17-natal-floresta',
    criar: deVideo({ v: 'v17', pasta: 'v17-natal-floresta', n: 9, fundo: fundos.neve, selo: 'QUIZ DE NATAL', tutiOpts: { gorro: true } }),
    textos: {
      titulo: 'O que não combina com a festa na neve? 😂 Você acerta? #shorts',
      descricao:
        'O gorro, o cachecol ou o guarda-sol? Você tem 10 segundos para descobrir! ❄️\n\nQuiz para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz de Natal 8: o Natal na Floresta", no canal Quizzito.\n\n#QuizDeNatal #NatalNaFloresta #QuizInfantil #shorts',
      tags: ['quiz de natal', 'natal na floresta', 'quiz infantil', 'quiz para crianças', 'natal para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v17_short2',
    pasta: 'v17-natal-floresta',
    criar: deVideo({ v: 'v17', pasta: 'v17-natal-floresta', n: 3, fundo: fundos.neve, selo: 'QUIZ DE NATAL', tutiOpts: { gorro: true } }),
    textos: {
      titulo: 'O que o coelhinho gosta de comer? 🐰 Você acerta? #shorts',
      descricao:
        'A cenoura, o peixe ou o osso? Você tem 10 segundos para responder bem alto! ❄️\n\nQuiz para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz de Natal 8: o Natal na Floresta", no canal Quizzito.\n\n#QuizDeAnimais #QuizDeNatal #QuizInfantil #shorts',
      tags: ['quiz de animais', 'coelho', 'quiz de natal', 'quiz infantil', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v17_short3',
    pasta: 'v17-natal-floresta',
    criar: memoriaDeVideo({ v: 'v17', pasta: 'v17-natal-floresta', n: 10, fundo: fundos.neve, selo: 'QUIZ DE NATAL', tutiOpts: { gorro: true } }),
    textos: {
      titulo: 'Onde está o esquilo? 👀 Jogo da memória de Natal #shorts',
      descricao:
        'Olhe bem onde está o esquilo... as cartas vão trocar de lugar! Você consegue acompanhar? ❄️\n\nJogo da memória para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz de Natal 8: o Natal na Floresta", no canal Quizzito.\n\n#JogoDaMemória #QuizDeNatal #NatalNaFloresta #shorts',
      tags: ['jogo da memória infantil', 'quiz de natal', 'natal na floresta', 'quiz para crianças', 'natal para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v18_short1',
    pasta: 'v18-estacoes',
    criar: deVideo({ v: 'v18', pasta: 'v18-estacoes', n: 9, fundo: fundos.pasto, selo: 'ESTAÇÕES DO ANO' }),
    textos: {
      titulo: 'O que não combina com o inverno? 😂 Você acerta? #shorts',
      descricao:
        'O cachecol, a luva ou a boia? Você tem 10 segundos para descobrir! ❄️\n\nQuiz para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz das Estações do Ano para crianças", no canal Quizzito.\n\n#EstaçõesDoAno #QuizInfantil #shorts',
      tags: ['estações do ano', 'inverno', 'quiz infantil', 'quiz para crianças', 'educação infantil', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v18_short2',
    pasta: 'v18-estacoes',
    criar: deVideo({ v: 'v18', pasta: 'v18-estacoes', n: 11, fundo: fundos.pasto, selo: 'ESTAÇÕES DO ANO' }),
    textos: {
      titulo: 'Em qual estação as folhas caem? 🍂 Você acerta? #shorts',
      descricao:
        'Primavera, outono ou verão? Você tem 10 segundos para responder bem alto! 🍂\n\nQuiz para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz das Estações do Ano para crianças", no canal Quizzito.\n\n#EstaçõesDoAno #QuizInfantil #shorts',
      tags: ['estações do ano', 'outono', 'quiz infantil', 'quiz para crianças', 'educação infantil', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v18_short3',
    pasta: 'v18-estacoes',
    criar: memoriaDeVideo({ v: 'v18', pasta: 'v18-estacoes', n: 10, fundo: fundos.pasto, selo: 'ESTAÇÕES DO ANO' }),
    textos: {
      titulo: 'Onde está a flor? 👀 Jogo da memória #shorts',
      descricao:
        'Olhe bem onde está a flor... as cartas vão trocar de lugar! Você consegue acompanhar? 🌸\n\nQuiz para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz das Estações do Ano para crianças", no canal Quizzito.\n\n#EstaçõesDoAno #QuizInfantil #shorts',
      tags: ['jogo da memória infantil', 'estações do ano', 'quiz para crianças', 'educação infantil', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v19_short1',
    pasta: 'v19-natal-verao',
    criar: deVideo({ v: 'v19', pasta: 'v19-natal-verao', n: 9, fundo: fundos.praia, selo: 'QUIZ DE NATAL', tutiOpts: { gorro: true } }),
    textos: {
      titulo: 'O que não combina com a praia? 😂 Você acerta? #shorts',
      descricao:
        'O casaco de frio, o guarda-sol ou o chinelo? Você tem 10 segundos para descobrir! ☀️\n\nQuiz para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz de Natal 9: o Natal no Verão", no canal Quizzito.\n\n#QuizDeNatal #NatalNoVerão #QuizInfantil #shorts',
      tags: ['quiz de natal', 'natal no verão', 'natal na praia', 'quiz infantil', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v19_short2',
    pasta: 'v19-natal-verao',
    criar: deVideo({ v: 'v19', pasta: 'v19-natal-verao', n: 11, fundo: fundos.praia, selo: 'QUIZ DE NATAL', tutiOpts: { gorro: true } }),
    textos: {
      titulo: 'O que o Papai Noel veste na praia? 🎅 Você acerta? #shorts',
      descricao:
        'O casaco, o cachecol ou a bermuda? Você tem 10 segundos para responder bem alto! ☀️\n\nQuiz para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz de Natal 9: o Natal no Verão", no canal Quizzito.\n\n#QuizDeNatal #PapaiNoel #QuizInfantil #shorts',
      tags: ['quiz de natal', 'papai noel', 'natal no verão', 'quiz infantil', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v19_short3',
    pasta: 'v19-natal-verao',
    criar: memoriaDeVideo({ v: 'v19', pasta: 'v19-natal-verao', n: 10, fundo: fundos.praia, selo: 'QUIZ DE NATAL', tutiOpts: { gorro: true } }),
    textos: {
      titulo: 'Onde está o presente? 👀 Jogo da memória de Natal #shorts',
      descricao:
        'Olhe bem onde está o presente... as cartas vão trocar de lugar! Você consegue acompanhar? 🎁\n\nJogo da memória para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz de Natal 9: o Natal no Verão", no canal Quizzito.\n\n#JogoDaMemória #QuizDeNatal #NatalNoVerão #shorts',
      tags: ['jogo da memória infantil', 'quiz de natal', 'natal no verão', 'quiz para crianças', 'natal para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v20_short1',
    pasta: 'v20-natal-polo-norte',
    criar: deVideo({ v: 'v20', pasta: 'v20-natal-polo-norte', n: 9, fundo: fundos.neve, selo: 'QUIZ DE NATAL', tutiOpts: { gorro: true } }),
    textos: {
      titulo: 'Quem não mora no Polo Norte? 😂 Você acerta? #shorts',
      descricao:
        'O pinguim, o camelo ou a foca? Você tem 10 segundos para descobrir! ❄️\n\nQuiz para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz de Natal 10: o Natal no Polo Norte", no canal Quizzito.\n\n#QuizDeNatal #PoloNorte #QuizInfantil #shorts',
      tags: ['quiz de natal', 'polo norte', 'animais do frio', 'quiz infantil', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v20_short2',
    pasta: 'v20-natal-polo-norte',
    criar: deVideo({ v: 'v20', pasta: 'v20-natal-polo-norte', n: 3, fundo: fundos.neve, selo: 'QUIZ DE NATAL', tutiOpts: { gorro: true }, primeiraOpcao: 2 }),
    textos: {
      titulo: 'O que a gente veste no frio? 🥶 Você acerta? #shorts',
      descricao:
        'O maiô, o casaco ou o chinelo? Você tem 10 segundos para responder bem alto! ❄️\n\nQuiz para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz de Natal 10: o Natal no Polo Norte", no canal Quizzito.\n\n#QuizDeNatal #PoloNorte #QuizInfantil #shorts',
      tags: ['quiz de natal', 'polo norte', 'roupa de frio', 'quiz infantil', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v20_short3',
    pasta: 'v20-natal-polo-norte',
    criar: memoriaDeVideo({ v: 'v20', pasta: 'v20-natal-polo-norte', n: 10, fundo: fundos.neve, selo: 'QUIZ DE NATAL', tutiOpts: { gorro: true } }),
    textos: {
      titulo: 'Onde está o pinguim? 👀 Jogo da memória de Natal #shorts',
      descricao:
        'Olhe bem onde está o pinguim... as cartas vão trocar de lugar! Você consegue acompanhar? 🐧\n\nJogo da memória para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz de Natal 10: o Natal no Polo Norte", no canal Quizzito.\n\n#JogoDaMemória #QuizDeNatal #PoloNorte #shorts',
      tags: ['jogo da memória infantil', 'quiz de natal', 'polo norte', 'pinguim', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    // padrão de Shorts v2 (23/11/2026): Short nativo "3 em 1", ~20 s, cronômetro de 3 s, em loop
    id: 'v20_sombras3',
    pasta: 'v20-natal-polo-norte',
    criar: () => {
      const pl = require('../art/polo');
      const animais = require('../art/animais');
      const s = (k) => `v20_s_sombra_${k}`;
      return criarTresSombras({
        narrDir: path.join(ROOT, 'v20-natal-polo-norte', 'narracao'),
        ids: { q: [s('q1'), s('q2'), s('q3')], r: [s('r1'), s('r2'), s('r3')], fim: s('fim') },
        fundo: fundos.neve,
        tutiOpts: { gorro: true },
        perguntas: [
          { arte: pl.ursoPolar, fundo: '#E4DAFB', opcoes: [{ arte: pl.foca, fundo: '#CFE6FF' }, { arte: pl.ursoPolar, fundo: '#FFF1B8', certa: true }, { arte: pl.pinguim, fundo: '#CFF1E0' }] },
          { arte: pl.pinguim, fundo: '#CFE6FF', opcoes: [{ arte: pl.pinguim, fundo: '#FFD9E4', certa: true }, { arte: animais.camelo, fundo: '#FFF1B8' }, { arte: pl.ursoPolar, fundo: '#E4DAFB' }] },
          { arte: pl.foca, fundo: '#FFE0C7', opcoes: [{ arte: animais.camelo, fundo: '#CFF1E0' }, { arte: pl.ursoPolar, fundo: '#CFE6FF' }, { arte: pl.foca, fundo: '#FFD9E4', certa: true }] },
        ],
      });
    },
    textos: {
      titulo: 'De quem é a sombra? 🐻‍❄️ Acerta as 3? #shorts',
      descricao: 'Três sombras do Polo Norte: você acerta todas em 3 segundos? 🐧\n\nQuiz completo: Quiz de Natal para Crianças 🎄 o Natal no Polo Norte (link do vídeo longo)\n\n#shorts #quizinfantil #paracriancas',
      tags: ['quiz infantil', 'de quem é a sombra', 'polo norte', 'animais do frio', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  // ---- Shorts nativos "3 em 1" (padrão de Shorts v2, 23/11/2026): um formato por dia, em rodízio ----
  {
    // S1 · qual é o diferente?
    id: 'natal_diferente3',
    pasta: 'v17-natal-floresta',
    narrDir: NARR_SHORTS,
    criar: () => {
      const fl = require('../art/floresta');
      const vr = require('../art/verao');
      const pl = require('../art/polo');
      const q = (arte, fundo) => ({ painel: 'texto', texto: '?', fundo, arte });
      return criarTresSombras({
        narrDir: NARR_SHORTS,
        ids: { q: ['s1_q1', 's3_e_agora', 's3_ultima'], r: ['s1_r1', 's1_r2', 's1_r3'], fim: 's3_fim' },
        fundo: fundos.neve,
        tutiOpts: { gorro: true },
        perguntas: [
          Object.assign(q(null, '#FFE0C7'), { opcoes: [{ arte: fl.coelhoCor('#FFFFFF'), fundo: '#CFF1E0' }, { arte: fl.coelhoCor('#FFFFFF'), fundo: '#CFF1E0' }, { arte: fl.coelhoCor('#B9845A'), fundo: '#CFF1E0', certa: true }] }),
          Object.assign(q(null, '#CFE6FF'), { opcoes: [{ arte: vr.sorveteCor('#8F5A2E'), fundo: '#FFD9E4', certa: true }, { arte: vr.sorveteCor('#FF8FB1'), fundo: '#FFD9E4' }, { arte: vr.sorveteCor('#FF8FB1'), fundo: '#FFD9E4' }] }),
          Object.assign(q(null, '#E4DAFB'), { opcoes: [{ arte: pl.pinguimCachecol('#4DA3FF'), fundo: '#CFE6FF' }, { arte: pl.pinguimCachecol('#E25A52'), fundo: '#CFE6FF', certa: true }, { arte: pl.pinguimCachecol('#4DA3FF'), fundo: '#CFE6FF' }] }),
        ],
      });
    },
    textos: {
      titulo: 'Qual é o diferente? 👀 Acerta as 3? #shorts',
      descricao: 'Três desafios rápidos: ache o diferente em 3 segundos! 🐰\n\nQuiz completo: Quiz de Natal para Crianças 🎄 o Natal na Floresta (link do vídeo longo)\n\n#shorts #quizinfantil #paracriancas',
      tags: ['quiz infantil', 'qual é o diferente', 'jogo de atenção', 'quiz de natal', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    // S3 · qual é o maior?
    id: 'criacao_maior3',
    pasta: 'v16-biblico-criacao',
    narrDir: NARR_SHORTS,
    criar: () => {
      const animais = require('../art/animais');
      const es = require('../art/estacoes');
      const cr = require('../art/criacao');
      const tres = (arte, escalas, certa, fundo, fundoOpc) => ({ painel: 'texto', texto: '?', fundo, opcoes: escalas.map((e, i) => ({ arte, escala: e, fundo: fundoOpc, certa: i === certa })) });
      return criarTresSombras({
        narrDir: NARR_SHORTS,
        ids: { q: ['s3m_q1', 's3_e_agora', 's3_ultima'], r: ['s3m_r1', 's3m_r2', 's3m_r3'], fim: 's3_fim' },
        fundo: fundos.pasto,
        perguntas: [tres(animais.elefante, [0.55, 0.75, 1], 2, '#FFF1B8', '#CFE6FF'), tres(es.girassol, [1, 0.6, 0.78], 0, '#CFE6FF', '#FFF1B8'), tres(cr.arvore, [0.62, 1, 0.8], 1, '#FFD9E4', '#CFF1E0')],
      });
    },
    textos: {
      titulo: 'Qual é o maior? 🐘 Acerta as 3? #shorts',
      descricao: 'Três desafios rápidos: qual é o maior? Você tem 3 segundos! 🐘\n\nQuiz completo: Quiz Bíblico para Crianças 🌍 A Criação do Mundo (link do vídeo longo)\n\n#shorts #quizinfantil #paracriancas',
      tags: ['quiz infantil', 'qual é o maior', 'grande e pequeno', 'quiz bíblico infantil', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    // S4 · o que não combina? (o engraçado)
    id: 'natal_intruso3',
    pasta: 'v19-natal-verao',
    narrDir: NARR_SHORTS,
    criar: () => {
      const mar = require('../art/mar');
      const vr = require('../art/verao');
      const pl = require('../art/polo');
      const fl = require('../art/floresta');
      const neve = require('../art/neve');
      const es = require('../art/estacoes');
      const animais = require('../art/animais');
      return criarTresSombras({
        narrDir: NARR_SHORTS,
        ids: { q: ['s4_q1', 's4_q2', 's4_q3'], r: ['s4_r1', 's4_r2', 's4_r3'], fim: 's3_fim' },
        fundo: fundos.neve,
        tutiOpts: { gorro: true },
        perguntas: [
          { painel: 'figura', arte: mar.praia, fundo: '#BDE5FF', opcoes: [{ arte: neve.chinelo, fundo: '#CFF1E0' }, { arte: vr.casaco, fundo: '#FFD9E4', certa: true }, { arte: fl.guardaSol, fundo: '#FFF1B8' }] },
          { painel: 'figura', arte: pl.iglu, fundo: '#CFE6FF', opcoes: [{ arte: pl.pinguim, fundo: '#E4DAFB' }, { arte: pl.foca, fundo: '#CFF1E0' }, { arte: animais.camelo, fundo: '#FFF1B8', certa: true }] },
          { painel: 'figura', arte: () => es.arvoreEstacao('inverno'), fundo: '#E4DAFB', opcoes: [{ arte: es.boia, fundo: '#FFF1B8', certa: true }, { arte: neve.cachecol, fundo: '#CFE6FF' }, { arte: () => neve.luva('#E25A52'), fundo: '#FFD9E4' }] },
        ],
      });
    },
    textos: {
      titulo: 'O que não combina? 😂 Acerta as 3? #shorts',
      descricao: 'Casaco na praia? Camelo no gelo? Ache o que não combina em 3 segundos! 😂\n\nQuiz completo: Quiz de Natal para Crianças ☀️ o Natal no Verão (link do vídeo longo)\n\n#shorts #quizinfantil #paracriancas',
      tags: ['quiz infantil', 'o que não combina', 'quiz engraçado', 'quiz de natal', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    // S5 · conte rápido!
    id: 'criacao_contar3',
    pasta: 'v16-biblico-criacao',
    narrDir: NARR_SHORTS,
    criar: () => {
      const objetos = require('../art/objetos');
      const mar = require('../art/mar');
      const cr = require('../art/criacao');
      const nums = (lista, certo, fundo) => lista.map((x) => ({ texto: String(x), fundo, certa: x === certo }));
      return criarTresSombras({
        narrDir: NARR_SHORTS,
        ids: { q: ['s5_q1', 's5_q2', 's5_q3'], r: ['s5_r1', 's5_r2', 's5_r3'], fim: 's3_fim' },
        fundo: fundos.pasto,
        perguntas: [
          { painel: 'contar', arte: objetos.estrela, n: 3, fundo: '#34498F', opcoes: nums([2, 3, 4], 3, '#FFF1B8') },
          { painel: 'contar', arte: () => mar.peixinho('#FFA53A'), n: 4, fundo: '#BDE5FF', opcoes: nums([4, 5, 3], 4, '#CFF1E0') },
          { painel: 'contar', arte: () => cr.flor('#FF8FB1'), n: 5, fundo: '#CFF1E0', opcoes: nums([3, 4, 5], 5, '#FFD9E4') },
        ],
      });
    },
    textos: {
      titulo: 'Conte rápido! ⭐ Acerta as 3? #shorts',
      descricao: 'Estrelas, peixinhos e flores: conte rápido em 3 segundos! ⭐\n\nQuiz completo: Quiz Bíblico para Crianças 🌍 A Criação do Mundo (link do vídeo longo)\n\n#shorts #quizinfantil #paracriancas',
      tags: ['quiz infantil', 'contar até 5', 'números para crianças', 'quiz bíblico infantil', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    // S2 · de quem é a sombra? (Daniel e os Leões)
    id: 'v21_sombras3',
    pasta: 'v21-biblico-daniel',
    criar: () => {
      const dn = require('../art/daniel');
      const animais = require('../art/animais');
      const s = (k) => `v21_s_sombra_${k}`;
      const ovelha = () => animais.ovelha();
      return criarTresSombras({
        narrDir: path.join(ROOT, 'v21-biblico-daniel', 'narracao'),
        ids: { q: [s('q1'), s('q2'), s('q3')], r: [s('r1'), s('r2'), s('r3')], fim: s('fim') },
        fundo: fundos.pasto,
        perguntas: [
          { arte: dn.leao('feliz'), fundo: '#E4DAFB', opcoes: [{ arte: ovelha, fundo: '#CFF1E0' }, { arte: dn.leao('feliz'), fundo: '#FFF1B8', certa: true }, { arte: animais.camelo, fundo: '#FFE0C7' }] },
          { arte: ovelha, fundo: '#CFE6FF', opcoes: [{ arte: ovelha, fundo: '#FFD9E4', certa: true }, { arte: animais.elefante, fundo: '#CFE6FF' }, { arte: dn.leao('feliz'), fundo: '#FFF1B8' }] },
          { arte: animais.camelo, fundo: '#FFE0C7', opcoes: [{ arte: animais.girafa, fundo: '#CFF1E0' }, { arte: animais.elefante, fundo: '#CFE6FF' }, { arte: animais.camelo, fundo: '#FFD9E4', certa: true }] },
        ],
      });
    },
    textos: {
      titulo: 'De quem é a sombra? 🦁 Acerta as 3? #shorts',
      descricao: 'Três sombras de bichos: você acerta todas em 3 segundos? 🦁\n\nQuiz completo: Quiz Bíblico para Crianças 🦁 Daniel e os Leões (link do vídeo longo)\n\n#shorts #quizinfantil #paracriancas',
      tags: ['quiz infantil', 'de quem é a sombra', 'animais para crianças', 'quiz bíblico infantil', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    // S1 · qual é o diferente? (a Véspera de Natal)
    id: 'v22_diferente3',
    pasta: 'v22-natal-vespera',
    narrDir: NARR_SHORTS,
    criar: () => {
      const vp = require('../art/vespera');
      const ceia = require('../art/ceia');
      const objetos = require('../art/objetos');
      const sala = require('../art/sala');
      const q = (fundo, opcoes) => ({ painel: 'texto', texto: '?', fundo, opcoes });
      const verde = vp.meiaCor('#3CA567', '#2F8F5A');
      return criarTresSombras({
        narrDir: NARR_SHORTS,
        ids: { q: ['s1_q1', 's3_e_agora', 's3_ultima'], r: ['s1b_r1', 's1b_r2', 's1b_r3'], fim: 's3_fim' },
        fundo: fundos.sala,
        tutiOpts: { gorro: true },
        perguntas: [
          q('#FFE0C7', [{ arte: vp.meia, fundo: '#CFF1E0' }, { arte: verde, fundo: '#CFF1E0', certa: true }, { arte: vp.meia, fundo: '#CFF1E0' }]),
          q('#CFE6FF', [{ arte: sala.sino, fundo: '#E4DAFB', certa: true }, { arte: () => ceia.vela(), fundo: '#E4DAFB' }, { arte: () => ceia.vela(), fundo: '#E4DAFB' }]),
          q('#E4DAFB', [{ arte: objetos.presente, fundo: '#FFD9E4' }, { arte: objetos.presente, fundo: '#FFD9E4' }, { arte: ceia.gengibre, fundo: '#FFD9E4', certa: true }]),
        ],
      });
    },
    textos: {
      titulo: 'Qual é o diferente? 🧦 Acerta as 3? #shorts',
      descricao: 'Três desafios de Natal: ache o diferente em 3 segundos! 🧦\n\nQuiz completo: Quiz de Natal para Crianças 🧦 A Véspera de Natal (link do vídeo longo)\n\n#shorts #quizinfantil #paracriancas',
      tags: ['quiz infantil', 'qual é o diferente', 'jogo de atenção', 'quiz de natal', 'quiz para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
  {
    id: 'v11_short1',
    pasta: 'v11-natal-ceia',
    criar: deVideo({ v: 'v11', pasta: 'v11-natal-ceia', n: 7, fundo: fundos.cozinha, selo: 'QUIZ DE NATAL', tutiOpts: { gorro: true } }),
    textos: {
      titulo: 'O que não vai na ceia de Natal? 🎄 Você acerta? #shorts',
      descricao:
        'A ovelhinha Tuti arrumou a mesa da ceia, mas uma coisa ali não é de comer! Você tem 10 segundos para descobrir. 🎄\n\nQuiz para crianças de 3 a 7 anos. O quiz completo, com 8 desafios, é o "Quiz de Natal 5: a Ceia e os Doces", no canal Quizzito.\n\n#QuizDeNatal #NatalParaCrianças #QuizInfantil #shorts',
      tags: ['quiz de natal', 'ceia de natal', 'quiz infantil', 'quiz para crianças', 'natal para crianças', 'ovelhinha Tuti', 'shorts infantil'],
    },
  },
];

async function gerar(item) {
  const cena = item.criar();
  const total = Math.ceil(cena.dur * 30) / 30;
  cena.dur = total;
  // som: efeitos e falas da cena (pasta do vídeo) + a fala final dos Shorts
  const { mono, voz } = mixar([{ cena, t0: 0 }], item.narrDir || path.join(ROOT, item.pasta, 'narracao'), total);
  for (const fe of cena.falasExtras) {
    const d = narr48(fe.arquivo);
    A.mixInto(voz, d, sfx.RATE, fe.t, 1);
    A.mixInto(mono, d, sfx.RATE, fe.t, 1);
  }
  const st = comTrilha(mono, voz, musica.compor(total));
  fs.mkdirSync(OUT, { recursive: true });
  const wav = path.join(OUT, `${item.id}.wav`);
  musica.writeStereo(wav, st.L, st.R);
  const g = ganhoParaAlvo(wav, -15.5);
  const mp4 = path.join(OUT, `${item.id}.mp4`);
  const r = await renderVideo(cena, { out: mp4, name: item.id, audio: wav, audioFilter: `volume=${g.ganho.toFixed(2)}dB,alimiter=limit=0.84:level=false`, crf: 21 });
  const mb = fs.statSync(mp4).size / 1e6;
  console.log(`${item.id}: ${total.toFixed(1)} s, ${r.frames} quadros em ${r.seconds.toFixed(0)} s, ${mb.toFixed(1)} MB → ${mp4}`);

  // textos do YouTube na pasta do vídeo de origem
  const dir = path.join(ROOT, item.pasta, 'shorts');
  fs.mkdirSync(dir, { recursive: true });
  const t = item.textos;
  fs.writeFileSync(
    path.join(dir, `${item.id}_titulo_descricao_tags.txt`),
    `TÍTULO\n${t.titulo}\n\n----------------------------------------------------------------------\nDESCRIÇÃO\n----------------------------------------------------------------------\n${t.descricao}\n\n----------------------------------------------------------------------\nTAGS\n----------------------------------------------------------------------\n${t.tags.join(', ')}\n`
  );
  return { mp4, total, mb };
}

module.exports = { SHORTS, gerar };

if (require.main === module) {
  (async () => {
    const ids = process.argv.slice(2).filter((a) => !a.startsWith('--'));
    const lista = ids.length ? SHORTS.filter((s) => ids.includes(s.id)) : SHORTS;
    if (process.argv.includes('--fotos')) {
      for (const item of lista) {
        const c = item.criar();
        const ts = c.T.troca ? [c.T.mostrar + 1.5, c.T.troca + 0.6, c.T.contagem + 4, c.T.revela + 1.8, c.T.fim + 1.2, c.dur - 0.3] : [1.0, c.T.viradas[2] + 0.6, c.T.contagem + 4, c.T.revela + 1.6, c.T.fim + 1.2, c.dur - 0.3];
        const fs_ = await stills(c, ts, path.join(OUT, 'fotos_' + item.id), item.id);
        console.log(fs_.join('\n'));
      }
      return;
    }
    for (const item of lista) await gerar(item);
  })().catch((e) => {
    console.error('ERRO:', e.stack);
    process.exit(1);
  });
}
