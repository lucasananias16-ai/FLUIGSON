# Quiz Bíblico Infantil

Produção dos vídeos piloto do canal: quiz bíblico para crianças de 3 a 7 anos, apresentado pela mascote Tuti.
Roteiro de origem: documento "Roteiros dos vídeos piloto: Quiz Bíblico Infantil".

## Decisões de produção

| Tema | Decisão |
|---|---|
| Imagens | Desenhadas em vetor por código (estilo flat cartoon), sem IA de imagem |
| Narração | Google Cloud Text-to-Speech, voz feminina em pt-BR |
| Publicação | Pacote pronto (MP4, thumbnail, título, descrição, tags, .srt) para subir manualmente no YouTube Studio |
| Ordem | Vídeo 1 (Arca de Noé) primeiro; ele vira o molde do Vídeo 2 (Davi e Golias) |

## Etapas (cada uma é validada antes da próxima)

| Nº | Etapa | Situação |
|---|---|---|
| 1 | Narrativa final do Vídeo 1 | Aprovada |
| 2 | Tuti em 3 poses | Aprovada |
| 3 | Imagens das cenas e das opções | Aprovada |
| 4 | Narração | Aguardando validação (voz escolhida: Leda, tom natural) |
| 5 | Animação e edição | Pergunta 1 de teste entregue, aguardando validação; falta montar o vídeo inteiro |
| 6 | Legendas | A fazer |
| 7 | Pacote do YouTube | A fazer |
| 8 | Publicação | A fazer |

## Pastas

- `v1-arca-de-noe/` — arquivos do Vídeo 1
  - `01-narrativa.md` — texto aprovado da locução
  - `imagens/` — abertura, encerramento, as 24 opções (`v1_pN_opcao`, em SVG e PNG transparente) e as folhas de conferência
  - `narracao/` — os 18 áudios aprovados da locução (`v1_abertura`, `v1_pN_pergunta`, `v1_pN_resposta`, `v1_encerramento`) e `narracao.json` com os tempos
- `personagens/tuti/` — poses da Tuti em SVG e PNG transparente, mais a folha de apresentação
- `src/` — código que desenha e renderiza
  - `tuti.js` — a mascote, montada em peças para poder ser animada
  - `kit.js` — peças de desenho compartilhadas (contorno, olhos, nuvens, membros)
  - `art/` — ilustrações: `pessoas.js`, `animais.js`, `objetos.js`, `cenario.js`
  - `v1/opcoes.js` — perguntas e opções do Vídeo 1, na ordem da tela
  - `v1/roteiro.js` — texto exato da locução; `v1/narracao.js` — gera os áudios
  - `tts.js` — cliente do Google Cloud Text-to-Speech; `audio.js` — leitura, corte e mixagem de áudio
  - `render-tuti.js`, `render-v1-imagens.js` — geram os arquivos finais
  - `anim/` — animação: `render.js` (quadro a quadro com Chromium e ffmpeg), `tutiAnim.js` (Tuti animada), `sfx.js` (efeitos sonoros sintetizados), `mix.js` (trilha de áudio), `ease.js`
  - `v1/cenaPergunta.js` — a cena de uma pergunta; `v1/teste-pergunta.js` — renderiza uma pergunta sozinha
  - `preview.js` — prévia rápida de qualquer ilustração
- `assets/fonts/` — fonte Fredoka (licença SIL OFL, incluída)

## Narração

```bash
GOOGLE_APPLICATION_CREDENTIALS=/caminho/da/chave.json node src/v1/narracao.js
```

A chave da conta de serviço nunca entra no repositório. A voz é generativa, então cada gravação nova sai um pouco diferente; por isso os áudios aprovados ficam guardados em `v1-arca-de-noe/narracao/`. Para regravar só uma fala: `node src/v1/narracao.js v1_p4_resposta --nova-tomada`.

## Animação

```bash
node src/v1/teste-pergunta.js 1
```

Renderiza a pergunta indicada em `_rascunho/video/` (pasta fora do repositório). A cena tira todos os tempos de `narracao.json`, então acompanha a voz automaticamente. Cada pergunta de ~28 s leva cerca de 70 s para renderizar.

## Como regenerar as imagens

```bash
node src/render-tuti.js
```

```bash
node src/render-v1-imagens.js
```

Os dois usam o Playwright (Chromium) para transformar o SVG em PNG.

## Regras de desenho

- Prancheta de 1000 x 1000 por ilustração, contorno de 10 unidades na cor `#3D2C4E`, cantos arredondados.
- Só os seres vivos têm rosto; objetos nunca têm (a pergunta 4 depende disso).
- Nas cenas em 1920 x 1080, tudo é redimensionado mantendo o traço em cerca de 6,5 px.
- Nenhum texto dentro das ilustrações, exceto os números da pergunta 6.
