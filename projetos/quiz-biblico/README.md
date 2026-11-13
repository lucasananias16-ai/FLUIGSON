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
| 2 | Tuti em 3 poses | Aguardando validação |
| 3 | Imagens das cenas e das opções | A fazer |
| 4 | Narração | A fazer (depende da chave do Google Cloud) |
| 5 | Animação e edição | A fazer |
| 6 | Legendas | A fazer |
| 7 | Pacote do YouTube | A fazer |
| 8 | Publicação | A fazer |

## Pastas

- `v1-arca-de-noe/` — arquivos do Vídeo 1 (`01-narrativa.md` é o texto aprovado da locução)
- `personagens/tuti/` — poses da Tuti em SVG e PNG transparente, mais a folha de apresentação
- `src/` — código que desenha e renderiza (`tuti.js` é a mascote; `render-tuti.js` gera as poses)
- `assets/fonts/` — fonte Fredoka (licença SIL OFL, incluída)

## Como regenerar as poses da Tuti

```bash
node src/render-tuti.js
```

Usa o Playwright (Chromium) para transformar o SVG em PNG. As poses são definidas por números em `POSES`, dentro de `src/tuti.js`.
