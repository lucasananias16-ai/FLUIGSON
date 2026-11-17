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
const fundos = require('./fundos');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, '_rascunho', 'video', 'shorts');

/** Um Short a partir de uma pergunta de cards de um vídeo. */
function deVideo({ v, pasta, n, fundo, selo, corSelo, tutiOpts = {}, primeiraOpcao = 1 }) {
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
    criar: deVideo({ v: 'v15', pasta: 'v15-natal-cartinha', n: 11, fundo: fundos.sala, selo: 'QUIZ DE NATAL', tutiOpts: { gorro: true } }),
    textos: {
      titulo: 'Quem lê as cartinhas no Polo Norte? 🎅 Você acerta? #shorts',
      descricao:
        'O pescador, o Papai Noel ou o padeiro? Você tem 10 segundos para responder bem alto! ✉️\n\nQuiz para crianças de 3 a 7 anos, com a ovelhinha Tuti. O quiz completo, com 12 desafios, é o "Quiz de Natal 7: a Cartinha para o Papai Noel", no canal Quizzito.\n\n#QuizDeNatal #PapaiNoel #QuizInfantil #shorts',
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
  const { mono, voz } = mixar([{ cena, t0: 0 }], path.join(ROOT, item.pasta, 'narracao'), total);
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
