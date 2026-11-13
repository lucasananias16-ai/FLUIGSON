# Quiz Bíblico Infantil

Produção dos vídeos piloto do canal: quiz bíblico para crianças de 3 a 7 anos, apresentado pela mascote Tuti.
Roteiro de origem: documento "Roteiros dos vídeos piloto: Quiz Bíblico Infantil".

## Decisões de produção

| Tema | Decisão |
|---|---|
| Imagens | Desenhadas em vetor por código (estilo flat cartoon), sem IA de imagem |
| Narração | Google Cloud Text-to-Speech, voz Leda em pt-BR, no estilo animado (ênfase na pontuação do texto enviado à voz) |
| Trilha | Composta por código (`src/anim/musica.js`), sem direitos autorais |
| Dinâmica | Cards que viram: chegam virados e numerados, viram quando a Tuti fala cada opção e, na resposta, os errados viram de costas |
| Tempo para pensar | Contagem de 10 segundos entre a pergunta e a resposta |
| Publicação | Pacote pronto (MP4, thumbnail, título, descrição, tags, .srt) para subir manualmente no YouTube Studio |
| Ordem | Vídeo 1 (Arca de Noé) primeiro; ele vira o molde do Vídeo 2 (Davi e Golias) |

## Etapas (cada uma é validada antes da próxima)

### Vídeo 1 — Quiz da Arca de Noé

| Nº | Etapa | Situação |
|---|---|---|
| 1 | Narrativa final do Vídeo 1 | Aprovada |
| 2 | Tuti em 3 poses | Aprovada |
| 3 | Imagens das cenas e das opções | Aprovada |
| 4 | Narração | Aprovada: voz Leda no estilo animado |
| 5 | Animação e edição | Aprovada: vídeo de 4 min 15 s |
| 6 | Legendas | Aprovadas |
| 7 | Pacote do YouTube | Aprovado: thumbnail C e título com "Quiz Bíblico" |
| 8 | Publicação | Com o dono do canal, seguindo `v1-arca-de-noe/youtube/como-publicar.md` |

### Vídeo 2 — Desafios de Davi e Golias

Mascote, voz, trilha e sistema de animação são os do Vídeo 1.

| Nº | Etapa | Situação |
|---|---|---|
| 1 | Narrativa final | Aprovada |
| 2 | Imagens das cenas e das opções | Aprovada |
| 3 | Narração | Aguardando validação |
| 4 | Animação e edição | A fazer |
| 5 | Legendas | A fazer |
| 6 | Pacote do YouTube | A fazer |
| 7 | Publicação | A fazer |

## Pastas

- `v2-davi-e-golias/` — arquivos do Vídeo 2
  - `01-narrativa.md` — texto aprovado da locução
  - `imagens/` — abertura, encerramento, cenas dos desafios, as 15 opções (`v2_pN_opcao`) e as folhas de conferência
  - `narracao/` — os 20 áudios da locução e `narracao.json` com os tempos
- `v1-arca-de-noe/` — arquivos do Vídeo 1
  - `01-narrativa.md` — texto aprovado da locução
  - `imagens/` — abertura, encerramento, as 24 opções (`v1_pN_opcao`, em SVG e PNG transparente) e as folhas de conferência
  - `legendas/` — legendas em pt-BR (.srt); `mapa-do-video.json` — o instante em que cada cena começa
  - `youtube/` — thumbnails, título, descrição com capítulos, tags e o passo a passo de publicação
  - `narracao/` — os 18 áudios aprovados da locução (`v1_abertura`, `v1_pN_pergunta`, `v1_pN_resposta`, `v1_encerramento`) e `narracao.json` com os tempos
- `personagens/tuti/` — poses da Tuti em SVG e PNG transparente, mais a folha de apresentação
- `src/` — código que desenha e renderiza
  - `tuti.js` — a mascote, montada em peças para poder ser animada
  - `kit.js` — peças de desenho compartilhadas (contorno, olhos, nuvens, membros)
  - `art/` — ilustrações: `pessoas.js`, `animais.js`, `objetos.js`, `cenario.js` (a arca) e `pasto.js` (o pasto de Davi)
  - `v2/desafios.js` — os oito desafios do Vídeo 2, com o tipo e as opções de cada um
  - `v1/opcoes.js` — perguntas e opções do Vídeo 1, na ordem da tela
  - `narrar.js` — gerador de narração compartilhado (tomadas, conferência, corte nas pausas)
  - `v1/roteiro.js` e `v2/roteiro.js` — texto exato da locução; `v1/narracao.js` e `v2/narracao.js` — geram os áudios de cada vídeo
  - `tts.js` — cliente do Google Cloud Text-to-Speech; `audio.js` — leitura, corte e mixagem de áudio
  - `render-tuti.js`, `render-v1-imagens.js` — geram os arquivos finais
  - `anim/` — animação: `render.js` (quadro a quadro com Chromium e ffmpeg), `tutiAnim.js` (Tuti animada), `sfx.js` (efeitos sonoros sintetizados), `mix.js` (trilha de áudio), `ease.js`
  - `anim/musica.js` — a trilha de fundo; `anim/fx.js` — confete e véu de transição; `anim/fala.js` — volume da voz e tempo das frases
  - `v1/cenaPergunta.js` — a cena de uma pergunta; `v1/cenasPontas.js` — abertura e encerramento
  - `v1/thumbnail.js` — gera as thumbnails; `v1/pacote-youtube.js` — gera título, descrição e tags
  - `v1/video.js` — monta o vídeo inteiro; `v1/legendas.js` — gera o .srt; `v1/teste-pergunta.js` — renderiza uma pergunta sozinha
  - `preview.js` — prévia rápida de qualquer ilustração
- `assets/fonts/` — fonte Fredoka (licença SIL OFL, incluída)

## Narração

```bash
GOOGLE_APPLICATION_CREDENTIALS=/caminho/da/chave.json node src/v1/narracao.js
```

```bash
GOOGLE_APPLICATION_CREDENTIALS=/caminho/da/chave.json node src/v2/narracao.js
```

A chave da conta de serviço nunca entra no repositório. A voz é generativa, então cada gravação nova sai um pouco diferente; por isso os áudios aprovados ficam guardados na pasta `narracao/` de cada vídeo. Para regravar só uma fala: `node src/v1/narracao.js v1_p4_resposta --nova-tomada`.

## Animação e vídeo completo

```bash
node src/v1/video.js
```

Monta o Vídeo 1 inteiro em `_rascunho/video/v1_quiz_arca_de_noe.mp4` (pasta fora do repositório) e grava as legendas e o mapa do vídeo. Cada cena é um trecho separado; só os trechos que mudaram são renderizados de novo. O vídeo de 4 min 15 s leva alguns minutos.

```bash
node src/v1/teste-pergunta.js 1
```

Renderiza só a pergunta indicada, para testar ajustes. As cenas tiram todos os tempos de `narracao.json`, então acompanham a voz automaticamente.

## Como regenerar as imagens

```bash
node src/render-tuti.js
```

```bash
node src/render-v1-imagens.js
```

```bash
node src/render-v2-imagens.js
```

Todos usam o Playwright (Chromium) para transformar o SVG em PNG.

## Regras de desenho

- Prancheta de 1000 x 1000 por ilustração, contorno de 10 unidades na cor `#3D2C4E`, cantos arredondados.
- Só os seres vivos têm rosto; objetos nunca têm (a pergunta 4 depende disso).
- Nas cenas em 1920 x 1080, tudo é redimensionado mantendo o traço em cerca de 6,5 px.
- Nenhum texto dentro das ilustrações, exceto os números da pergunta 6.
