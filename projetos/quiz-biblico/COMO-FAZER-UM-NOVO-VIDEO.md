# Como fazer um novo vídeo (guia para a próxima sessão)

Leia primeiro o `README.md`. Este arquivo é o roteiro de trabalho. Os Vídeos 1 a 5 são o molde; o Vídeo 4 é o mais indicado para um quiz de cards e desafios, e o Vídeo 5 para um vídeo com mais de uma língua ou de uma voz.

## Combinados com o dono do canal

- Responda em português do Brasil. O dono escreve por voz, então frases soltas são normais.
- Cada etapa é validada antes da próxima, mas o dono já autorizou aprovar em bloco quando ele pedir ("pode aprovar todas as etapas"). Sem essa frase, peça aprovação.
- Quem publica no YouTube é o dono. Eu entrego o pacote pronto. Deixar o vídeo Público é o passo 7 do guia de publicação e já está autorizado pelo dono (decisão de 14/11/2026), depois da revisão do vídeo em Privado.
- **Vídeos 1 e 2 estão publicados e não podem mudar.** Depois de mexer em código compartilhado (`src/anim/`, `src/art/`, `src/kit.js`, `src/tuti.js`), rode `node src/v1/video.js`, `node src/v2/video.js`, `node src/v3/video.js` e `node src/v4/video.js`: todas as cenas têm de sair como "sem mudanças".
- A chave do Google Cloud nunca entra no repositório nem no chat. Peça ao dono para anexar a chave de novo e use só via `GOOGLE_APPLICATION_CREDENTIALS`.
- Não crie pull request sem pedido. Commit e push só na branch de trabalho.

## Gostos já definidos pelo dono

- Mascote **Tuti**, voz Leda no estilo "animada", trilha composta por código, calma.
- Cards que chegam virados e numerados, viram quando a Tuti fala cada opção, e na resposta os errados viram de costas e o certo gira e brilha.
- Pelo menos **10 segundos** para pensar antes da resposta.
- Thumbnail no modelo C: Tuti, "QUIZ" grande, cena da história e três cards numerados.
- Título no padrão "Quiz Bíblico ... para crianças: você acerta todas?".
- Efeitos sonoros nunca em cima da voz da Tuti.

## Etapas e onde mexer

1. **Narrativa.** Criar `vN-nome/01-narrativa.md` e `src/vN/roteiro.js` (abertura, perguntas, respostas, encerramento; `contagem: 10`). Modelo: `src/v4/roteiro.js`.
2. **Imagens.** Registrar as perguntas em `src/vN/desafios.js` (ou `opcoes.js`), desenhar o que for novo em `src/art/` e gerar as folhas de conferência com um script como `src/render-v2-imagens.js`. Regras de desenho no README.
3. **Narração.** Criar `src/vN/narracao.js` com `narrar()` de `src/narrar.js` (modelo: `src/v2/narracao.js`, que corta as perguntas em partes nas pausas). Os áudios aprovados ficam em `vN-nome/narracao/` e não devem ser regravados sem motivo: a voz é generativa e cada gravação sai diferente.
4. **Animação e edição.** Para perguntas de três cards use `criarCenaCards` (`src/anim/cenaCards.js`). Tipos especiais ficam em `src/vN/cenas.js` (modelo: `src/v2/cenas.js`: achar, contar, sombra, comparar, memória). Abertura e encerramento em `src/vN/cenasPontas.js`. A montagem é `src/vN/video.js` chamando `montar()` de `src/anim/montar.js`. Conferir com fotos de instantes-chave e, no fim, com o vídeo pronto.
5. **Legendas.** Saem sozinhas da montagem (`.srt` e `mapa-do-video.json` em `vN-nome/`).
6. **Pacote do YouTube.** `src/vN/thumbnail.js` (usa `src/thumb.js`), `src/vN/pacote-youtube.js` e um `como-publicar.md` baseado no do Vídeo 2.
7. **Publicação.** Do dono.

8. **Pasta no Google Drive (sempre, sem esperar o dono pedir).** Ao terminar o vídeo, criar no Drive do dono, dentro de `Meu Drive > Pv > Nova pasta` (id `1nMVgA7kR_uXU1GJPSrJLUYaukucvRMg8`), uma pasta chamada `N. Tema` (ex.: `7. Cores em Inglês`, `8. Natal - Oficina dos Duendes`) e subir a thumbnail, o arquivo de título/descrição/tags, o `.srt` e o `como-publicar.md`. O envio daqui aceita até 10 MB por arquivo, então o MP4 não sobe: avisar o dono para baixar o vídeo da conversa e arrastar para a pasta. Instrução dada pelo dono em 14/11/2026.

9. **Shorts.** Cada vídeo longo rende de 2 a 3 Shorts (rotina em `ROTINA-DE-UPLOAD.md`). Um Short é uma pergunta de cards do vídeo, em pé, no molde `src/shorts/molde.js`: registre em `SHORTS`, em `src/shorts/gerar.js` (vídeo, número da pergunta, fundo de `src/shorts/fundos.js`, selo e textos) e rode `node src/shorts/gerar.js <id>` (`--fotos` para conferir antes). O MP4 sai em `_rascunho/video/shorts/` com uns 6 MB, acima do limite de envio ao Drive daqui (cerca de 3 MB por arquivo, medido em 16/11/2026): ele vai para o dono pela conversa e o dono arrasta. No Drive, criar a subpasta `shorts/` dentro da pasta do vídeo de origem, com os textos e o `como-publicar-shorts.md`. A fala final ("Você acertou? Tem muito mais desafios no quiz completo!") é a mesma para todos e fica em `shorts/narracao/`. O molde serve para perguntas de três cards (`deVideo`: escolher, intruso, sombra sem o painel, sequência sem a fila) e para o jogo da memória (`memoriaDeVideo`, cena genérica em `src/shorts/memoria.js`, que pede as falas `_mostrar`, `_pergunta` e `_resposta` do desafio).
10. **Agenda.** Todo guia de publicação informa a data e a hora de agendamento conforme `ROTINA-DE-UPLOAD.md`: vídeo longo seg, qua e sex às 16h (até 24/12, 2 dos 3 da semana são de Natal); Short 1 por dia às 12h ou 17h, sempre depois do vídeo longo de origem estar no ar; no máximo 3 envios por dia; nunca publicar na hora, sempre programar.

## Conferências automáticas antes de entregar

- Formato: H.264 1080p 30 fps, AAC estéreo 48 kHz; volume perto de −15,5 LUFS e pico abaixo de −0,5 dBFS.
- Nenhum quadro preto ou congelado (`blackdetect`, `freezedetect` do ffmpeg).
- Cada fala no instante previsto (correlação do envelope do áudio final com o de cada WAV).
- Legendas com o mesmo texto da narração aprovada.
- Dizer com honestidade o que foi medido e o que só o ouvido do dono confirma (tom da voz, mixagem).

## Para gastar menos cota

- Sessão nova por vídeo, com este guia e o README como contexto.
- Conferir cenas por folhas de contato, não quadro a quadro, e só o vídeo final no fim.
- Trocar para um modelo maior só para desenhar algo novo ou resolver um bug que travou.

## Armadilhas já encontradas

- A voz às vezes faz uma pausa grande no meio de uma frase (no Vídeo 3, "nascimento | de Jesus"). O corte automático das frases erra nesse caso: confira as legendas e, se preciso, indique as pausas certas em `cortes` no `roteiro.js` do vídeo.
- Cenas com figuras no alto (como a estrela escondida do desafio 1) não podem ficar atrás da faixa da pergunta, que cobre os primeiros 176 px.
- Efeitos sonoros que tocam junto com a fala (sino de acerto, escadinha de notas) ficam abaixo da voz; meça com a comparação de envelopes antes de entregar.
- Ao copiar as cenas de outro vídeo, os nomes dos áudios (`v3_p4_pergunta`...) vêm junto. Se os desafios mudarem de número, confira se cada cena `dN` toca só áudios `_pN_`. No Vídeo 4 a cena da sombra tocou o áudio da pergunta de cores até a conferência das legendas mostrar a diferença; a checagem de sincronia sozinha não pega isso.
- Acessórios na Tuti (o gorro do Vídeo 4) ficam desligados por padrão, para não mudar vídeos antigos. Ligue com `gorro: true` em `tuti()` e em `tutiFrame()`.
- Narração com mais de uma voz ou língua (Vídeo 5): marque no texto `{en: ...}` e o nome do bicho; o gerador grava cada trecho com a voz do `roteiro.js` e emenda. Pontuação logo depois da marca fica junto do trecho, e frases soltas de uma palavra em português (como "e") saem estranhas: reescreva para não haver. A pausa de 3 segundos para a criança repetir fica na cena, não no áudio.
- A conferência do inglês precisa de ouvido humano: avise o dono, com a lista das palavras, para ouvir principalmente as mais difíceis.
- Acessórios da Tuti nas cenas de cards passam por `tutiOpts` de `criarCenaCards`. No Vídeo 4 a Tuti ficou sem gorro nessas cenas até isso ser corrigido: confira a Tuti em todas as cenas, não só na abertura.
- Rode `freezedetect` no vídeo final: um trecho parado de mais de 3 s costuma ser uma fala sem ninguém se mexendo na tela.
- Perguntas com uma lista falada antes das opções ("bola, ursinho, bola...") confundem o corte em partes: a voz faz pausas na lista e engole as das opções. Mostre a lista na tela e deixe a fala curta. Confira sempre a duração de cada parte no `narracao.json` (opções costumam ter de 0,5 a 1 s).
- Para fazer um vídeo com o mesmo formato e outro cenário, crie um módulo de arte com os mesmos nomes de cena e os mesmos `id` (como `art/oficina.js` fez com `art/noel.js`) e troque só o `require`.
