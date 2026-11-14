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
| 8 | Publicação | Publicado no canal Quizzito. O passo a passo testado está em `v1-arca-de-noe/youtube/como-publicar.md` |

### Vídeo 2 — Desafios de Davi e Golias

Mascote, voz, trilha e sistema de animação são os do Vídeo 1.

| Nº | Etapa | Situação |
|---|---|---|
| 1 | Narrativa final | Aprovada |
| 2 | Imagens das cenas e das opções | Aprovada |
| 3 | Narração | Aprovada: a mesma voz do Vídeo 1 |
| 4 | Animação e edição | Aprovada: vídeo de 4 min 03 s |
| 5 | Legendas | Aprovadas |
| 6 | Pacote do YouTube | Aprovado: thumbnail no modelo C e título no formato do Vídeo 1 |
| 7 | Publicação | Pronto para subir. O passo a passo está em `v2-davi-e-golias/youtube/como-publicar.md` |

As etapas 3 a 6 do Vídeo 2 foram conferidas e aprovadas pelo Claude, por decisão do dono do canal. A publicação continua manual.

### Vídeo 3 — Desafios do Natal de Jesus

Mascote, voz, trilha e sistema de animação são os dos Vídeos 1 e 2. Nove desafios, de tipos variados.

| Nº | Etapa | Situação |
|---|---|---|
| 1 | Narrativa final | Aprovada |
| 2 | Imagens das cenas e das opções | Aprovada |
| 3 | Narração | Aprovada: a mesma voz dos outros vídeos |
| 4 | Animação e edição | Aprovada: vídeo de 4 min 21 s |
| 5 | Legendas | Aprovadas |
| 6 | Pacote do YouTube | Aprovado: thumbnail no modelo C (noite de Natal) e título no formato dos outros |
| 7 | Publicação | Pronto para subir. O passo a passo está em `v3-nascimento-de-jesus/youtube/como-publicar.md` |

### Vídeo 4 — Quiz do Papai Noel

Mascote, voz, trilha e sistema de animação são os dos outros vídeos; a Tuti aparece de gorro de Papai Noel. Oito desafios, de tipos variados.

| Nº | Etapa | Situação |
|---|---|---|
| 1 | Narrativa final | Aprovada (encerramento só de brincadeira, sombra do Papai Noel) |
| 2 | Imagens das cenas e das opções | Aprovada |
| 3 | Narração | Aprovada |
| 4 | Animação e edição | Aprovada: vídeo de 3 min 47 s |
| 5 | Legendas | Aprovadas |
| 6 | Pacote do YouTube | Aprovado: thumbnail no modelo C (dia de neve) e título "Quiz de Natal do Papai Noel…" |
| 7 | Publicação | Pronto para subir. O passo a passo está em `v4-papai-noel/youtube/como-publicar.md` |

As etapas 2 a 7 do Vídeo 4 foram conferidas e aprovadas pelo Claude, por decisão do dono do canal.

### Vídeo 5 — Inglês com a Tuti: a Festa dos Animais

Vídeo educativo de inglês para crianças de 4 a 6 anos, no estilo de brincadeira: bichos que saem de caixas surpresa, gestos, o jogo "A Tuti diz" e jogos com cards. A narração mistura português e inglês, com vozes diferentes para a Tuti em cada língua e para cada bicho.

| Nº | Etapa | Situação |
|---|---|---|
| 1 | Narrativa final | Aprovada |
| 2 | Imagens das cenas e das opções | Aprovada |
| 3 | Narração | Aprovada (a pronúncia do inglês depende da conferência de quem ouvir) |
| 4 | Animação e edição | Aprovada: vídeo de 4 min 31 s |
| 5 | Legendas | Aprovadas |
| 6 | Pacote do YouTube | Aprovado: thumbnail no modelo C ("INGLÊS com a Tuti") e playlist nova "Inglês para Crianças" |
| 7 | Publicação | Pronto para subir. O passo a passo está em `v5-ingles-animais/youtube/como-publicar.md` |

As etapas 2 a 7 do Vídeo 5 foram conferidas e aprovadas pelo Claude, por decisão do dono do canal.

## Pastas

- `v5-ingles-animais/` — arquivos do Vídeo 5, na mesma organização do Vídeo 4
- `v4-papai-noel/` — arquivos do Vídeo 4, na mesma organização do Vídeo 3
- `v3-nascimento-de-jesus/` — arquivos do Vídeo 3, na mesma organização do Vídeo 2 (`01-narrativa.md`, `imagens/`, `narracao/`, `legendas/`, `youtube/`)
- `v2-davi-e-golias/` — arquivos do Vídeo 2
  - `01-narrativa.md` — texto aprovado da locução
  - `imagens/` — abertura, encerramento, cenas dos desafios, as 15 opções (`v2_pN_opcao`) e as folhas de conferência
  - `narracao/` — os 20 áudios da locução e `narracao.json` com os tempos
  - `legendas/` — legendas em pt-BR (.srt); `mapa-do-video.json` — o instante em que cada cena começa
  - `youtube/` — thumbnail, título, descrição com capítulos, tags e o passo a passo de publicação
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
  - `anim/palco.js` — peças do palco usadas pelos dois vídeos (poses da Tuti, faixa da pergunta, relógio, verso dos cards); `anim/cenaCards.js` — a cena dos três cards que viram
  - `anim/montar.js` — monta um vídeo inteiro a partir das cenas (imagem, som, legendas e mapa); `anim/legendas.js` — gera o .srt
  - `thumb.js` — peças das thumbnails (letreiro, céu com raios, card numerado)
  - `v1/cenaPergunta.js` — a cena de uma pergunta do Vídeo 1; `v1/cenasPontas.js` — abertura e encerramento
  - `v1/thumbnail.js` — gera as thumbnails; `v1/pacote-youtube.js` — gera título, descrição e tags
  - `v1/video.js` — monta o Vídeo 1; `v1/teste-pergunta.js` — renderiza uma pergunta sozinha
  - `v2/cenas.js` — os oito desafios do Vídeo 2 (achar, contar, sombra, comparar, cards e memória); `v2/cenasPontas.js` — abertura e encerramento
  - `v2/video.js` — monta o Vídeo 2; `v2/thumbnail.js` e `v2/pacote-youtube.js` — thumbnail e textos do YouTube
  - `v3/` — o Vídeo 3, com os mesmos arquivos do `v2/` (`roteiro`, `desafios`, `narracao`, `cenas`, `cenasPontas`, `video`, `thumbnail`, `pacote-youtube`); `art/natal.js` — os cenários do Natal de Jesus e `render-v3-imagens.js` — gera as imagens
  - `v4/` — o Vídeo 4, com os mesmos arquivos do `v3/`; `art/noel.js` — os cenários de neve e `render-v4-imagens.js` — gera as imagens. A Tuti de gorro é a opção `gorro` de `tuti.js` e de `tutiFrame`
  - `v5/` — o Vídeo 5; `art/festa.js` — o campo em festa e a caixa surpresa e `render-v5-imagens.js` — gera as imagens. O texto da locução em `v5/roteiro.js` traz marcas `{en: ...}` (inglês) e `{leao: ...}` (voz de um bicho), que `v5/narracao.js` transforma em segmentos gravados com a voz certa
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

```bash
node src/v2/video.js
```

```bash
node src/v3/video.js
```

```bash
node src/v4/video.js
```

```bash
node src/v5/video.js
```

Cada comando monta um vídeo inteiro em `_rascunho/video/` (pasta fora do repositório): `v1_quiz_arca_de_noe.mp4`, `v2_desafios_de_davi_e_golias.mp4` e `v3_desafios_do_natal_de_jesus.mp4` e `v4_quiz_do_papai_noel.mp4` e `v5_festa_dos_animais.mp4`. Também grava as legendas e o mapa do vídeo na pasta de cada um. Cada cena é um trecho separado; só os trechos que mudaram são renderizados de novo. Um vídeo de 4 minutos leva cerca de 5 minutos para renderizar do zero.

Os Vídeos 1 e 2 já estão publicados. Depois de mexer em código compartilhado (`src/anim/`, `src/art/`, `src/kit.js`, `src/tuti.js`), rode `node src/v1/video.js`, `node src/v2/video.js`, `node src/v3/video.js` e `node src/v4/video.js`: todas as cenas têm de sair como "sem mudanças".

```bash
node src/v1/teste-pergunta.js 1
```

Renderiza só a pergunta indicada do Vídeo 1, para testar ajustes. As cenas tiram todos os tempos de `narracao.json`, então acompanham a voz automaticamente.

## Thumbnail e textos do YouTube

```bash
node src/v2/thumbnail.js
```

```bash
node src/v2/pacote-youtube.js
```

O primeiro grava a thumbnail em `youtube/`; o segundo grava título, descrição com capítulos e tags, lendo os tempos do mapa do vídeo. Os do Vídeo 1 são `src/v1/thumbnail.js` e `src/v1/pacote-youtube.js`.

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
