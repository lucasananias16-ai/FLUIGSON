# Como publicar o Vídeo 1 no YouTube (Quiz Bíblico: Arca de Noé)

Canal: **Quizzito** (@QuizzitoKids). Passo a passo testado na publicação real do Vídeo 1. Leva uns 10 minutos.

## Arquivos

Caminhos no projeto:

| Arquivo | Para quê |
|---|---|
| `v1_quiz_arca_de_noe.mp4` | Vídeo final (4 min 15 s, 1080p, ~72 MB) |
| `youtube/v1_thumbnail.png` | Miniatura (1280 x 720). Outras opções em `youtube/opcoes/` |
| `youtube/v1_titulo_descricao_tags.txt` | Título, descrição com capítulos, tags e títulos de reserva |
| `legendas/v1_quiz_arca_de_noe.srt` | Legendas em português (com marcação de tempo) |
| `youtube/como-publicar.md` | Este guia |

Cópia no Google Drive: `G:\Meu Drive\Pv\Nova pasta\Arca de noe\`. Lá os arquivos ficam todos na mesma pasta, sem subpastas.

> Atenção: na cópia do Drive faltava o `v1_thumbnail.png`. Confira se ele foi copiado antes de começar.

## Antes de começar

- O canal precisa estar com **verificação por telefone** concluída. Sem ela, o YouTube não libera miniatura personalizada.
- O canal está com **"Feito para crianças" como padrão**. Isso desativa comentários, sininho, anúncios personalizados, cards e telas finais.
- Abra o YouTube Studio no Chrome, logado no Quizzito: https://studio.youtube.com/channel/UC9U6D0toGKzrXNTrE2PArnQ

## Passo a passo

### 1. Enviar o vídeo
1. No Studio, clique em **Criar** e depois em **Enviar vídeos**.
2. Clique em **Selecionar arquivos** e escolha o `v1_quiz_arca_de_noe.mp4`.
3. Espere o envio chegar a 100%. Pode preencher os campos enquanto ele processa.

### 2. Aba Detalhes
1. **Título:** cole o título do arquivo de textos.
   `Quiz Bíblico da Arca de Noé para crianças: você acerta todas?`
2. **Descrição:** cole o bloco da descrição do arquivo de textos, do "Vamos brincar..." até as hashtags. Os capítulos já estão dentro.
   - Ao terminar de colar as hashtags, o YouTube abre uma lista de sugestões. Aperte **Esc** para fechá-la.
3. **Miniatura:** clique em **Enviar miniatura** e escolha `youtube/v1_thumbnail.png`.
4. **Playlist:** crie ou escolha **Quiz Bíblico Infantil** (a mesma para todos os vídeos da série).
5. **Público:** marque **"Sim, é conteúdo para crianças"**. Já vem marcado pelo padrão do canal, mas confira.
6. Clique em **Mostrar mais** e preencha:
   - **Declaração de uso de IA:** responda **Não**. O vídeo é animação, sem pessoa real, cena realista ou música como foco. Se a voz ou a música foram geradas por IA e soam realistas, revise essa resposta.
   - **Tags:** cole a linha de tags do arquivo de textos. Deve usar cerca de 349 dos 500 caracteres.
   - **Idioma do vídeo:** Português (Brasil). Na lista, procure por "Português (Brasil)", que fica logo depois de "Português".
   - **Categoria:** Educação.
   - Deixe os capítulos automáticos e a incorporação como estão.
7. Clique em **Avançar**.

### 3. Aba Elementos do vídeo
1. Em **Legendas**, clique em **Adicionar**.
2. Escolha **Enviar arquivo**, depois **Com marcação de tempo** e **Continuar**.
3. Selecione o `legendas/v1_quiz_arca_de_noe.srt`.
4. Confira que as falas apareceram com os tempos e clique em **Pronto**. O Studio avisa "Legendas em Português (Brasil) publicadas".
5. Cards e tela final ficam desativados por causa do "Feito para crianças". É esperado.
6. Clique em **Avançar**.

### 4. Aba Verificações
1. Espere a checagem de direitos autorais. A trilha foi composta para este vídeo, então não deve haver reivindicação.
2. Quando aparecer "Nenhum problema foi encontrado", clique em **Avançar**.

### 5. Aba Visibilidade (salvar como Privado)
1. Marque **Privado** e clique em **Salvar**.
2. O Studio avisa "Este vídeo está visível somente para você".
3. O vídeo pode demorar alguns instantes para aparecer na lista de Conteúdo.

### 6. Revisar antes de publicar
1. Abra o link do vídeo (aparece na aba Detalhes) e assista **uma vez inteira**, de preferência no celular e na TV.
2. Confira:
   - áudio e narração da ovelhinha Tuti;
   - as 8 perguntas e o tempo de 10 segundos;
   - legendas no player;
   - capítulos na barra do vídeo (dependem de a descrição começar em `0:00`);
   - miniatura aplicada.

### 7. Publicar
1. Em **Conteúdo**, abra o vídeo, vá em **Visibilidade** e mude de Privado para **Público**. Você também pode agendar.
2. Clique em **Salvar**.

Boa prática: publicar em fim de semana de manhã (8h–11h) ou em dia útil no início da tarde (12h–15h). Depois ajuste pelo Analytics.

## O que muda por ser conteúdo para crianças

O YouTube desativa nesses vídeos: comentários, sininho de notificação, anúncios personalizados, cards e telas finais. Por isso o vídeo não pede inscrição nem comentário. O CPM também costuma ser menor.

## Depois de publicar

- Confira capítulos e legendas no player.
- Em 1 ou 2 semanas, veja no **Analytics** a taxa de cliques das impressões. Se estiver baixa, teste um dos títulos de reserva do arquivo de textos.
- Nas primeiras semanas, veja a **retenção de público**: ela mostra em que pergunta as crianças saem, o que ajuda a ajustar o Vídeo 2.
- Quando houver mais vídeos, organize as playlists na página inicial do canal.

## Dicas para automatizar com o Claude

- O envio do `.mp4` precisa ser feito por você. O navegador do Claude só envia arquivos de até 3,8 MB, e o vídeo tem ~72 MB.
- O `.srt` é pequeno e o Claude consegue enviar sozinho.
- A mudança para **Público** só deve ser feita depois do seu "pode publicar".
