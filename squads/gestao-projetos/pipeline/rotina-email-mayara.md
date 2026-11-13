# Rotina diária — e-mail de pendências para a Mayara (squad gestao-projetos)

Executada por uma tarefa agendada nos **dias úteis às 9h00 (Brasília)**, numa sessão nova, sem o usuário presente.
Objetivo: enviar à Mayara Centeno (Analista de Projetos) **um e-mail por dia útil** com o que cada dev tem que entregar hoje, para ela cobrar as ações, e pedir o status do que estava combinado para o dia anterior.

**Autorização do usuário (Lucas Ananias, 2026-11-13):** esta rotina **pode enviar 1 e-mail por dia útil**, só para `mayara.centeno@jynx.com.br`, da conta do Lucas, com `mcp__Gmail__send_message`. Fora esse envio, tudo é somente leitura: não criar rascunho no Gmail, não responder outros e-mails, não editar a Agenda nem escrever no GitHub além do push na branch.

Idioma: português do Brasil. Nunca pergunte nada (não há usuário). Se faltar informação, deixe o item de fora, ou peça a confirmação à Mayara dentro do próprio e-mail.

## 0. Preparação
1. Repositório `lucasananias16-ai/FLUIGSON`, branch `claude/ecstatic-wright-1q7zd3` (fetch, checkout e pull). Se a branch tiver sido mesclada, use a branch padrão atualizada.
2. Leia `squads/gestao-projetos/_memory/memories.md` (inclui "Instruções do usuário", ex.: agendas pausadas) e `squads/gestao-projetos/pipeline/rotina-diaria.md` (seções 1, 1b e 4b).
3. **Não envie** se: hoje for sábado, domingo ou feriado nacional; ou se já existir no Gmail (`in:sent to:mayara.centeno@jynx.com.br subject:"Pendências de hoje"` com data de hoje) um e-mail deste dia. Nesses casos, encerre sem notificar.
4. Teste os conectores (Gmail, Agenda, Drive/Docs, Artifact da Esteira). **Se o Gmail estiver indisponível, não há envio: notifique o usuário** com o motivo.

## 1. Fontes (somente leitura)
- **Base:** o painel e os rascunhos mais recentes (`projetos/_painel/painel-*.md`, `projetos/_painel/mensagem-mayara-*.md`, `projetos/*/rascunhos/status-*.md`) e os status aprovados (`projetos/*/status-*.md`), com as tabelas de próximos passos e de vencimentos.
- **Atualização do dia** (desde o último painel até agora): Esteira (`dados.json`, artefato https://claude.ai/artifact/8BVemJ9ebNrCX3q25RB5py); atas do Gemini lidas **pelo Doc completo** (Detalhes), conforme o passo 1b da rotina diária; e-mails de clientes e da TOTVS; Agenda de hoje e do próximo dia útil (com validação de séries canceladas ou alteradas).
- Item que alguma fonte nova mostrar como concluído sai da lista de hoje e vai para "Retorno de ontem" como "concluído? confirmar".

## 2. Conteúdo do e-mail
**Assunto:** `Pendências de hoje ({dia da semana}, {DD/MM})`

**Corpo** (HTML simples + versão texto, assinatura do Gmail ligada):
1. Abertura: "Mayara, bom dia! Seguem as pendências de hoje. Me dá um retorno até as 17h com o que fechou e, se não fechar, o motivo e a nova data."
2. **Retorno de ontem:** os itens do e-mail do dia útil anterior (procure em `in:sent`; ou use `projetos/_painel/mensagem-mayara-{data anterior}.md`) que nenhuma fonte mostrou como concluídos. Peça o status de cada um em 1 linha, agrupados por dev. Itens que as fontes já mostram como feitos aparecem como "vi que X foi concluído, confirma?". No máximo ~6 linhas.
3. **Hoje, por dev:** um bloco por dev (Gabriel, Otávio, Gustavo, Weverton, Kauã e quem mais aparecer), com o nome do cliente e 1 a 3 entregas objetivas: marcos com data de hoje, vencidos que dá para fechar hoje e o que precisa estar pronto para a reunião do próximo dia útil. Gatilho de cor no próximo dia útil entra em 1 linha. Nada de prazos da semana seguinte.
4. **Com você:** o que é da própria Mayara (cobranças a clientes, à TOTVS e de agenda).
5. Fechamento: "Obrigado!"
6. **Rodapé (sempre, em itálico, separado por uma linha):**
   > Esta mensagem foi gerada por IA a partir da Esteira de Projetos, das atas de reunião, da agenda e dos e-mails. Se alguma informação estiver inconsistente ou precisar de correção, responda este e-mail com o ajuste. Antes de agir sobre algo que pareça incorreto, valide sempre com o Lucas Ananias, gerente que delegou o envio desta mensagem.

Regras de texto: frases curtas, sem colchetes de fonte, sem "(proposta)", sem dados pessoais sensíveis (motivos de saúde, por exemplo, viram "afastamento"). Todo item precisa ter uma fonte nos arquivos ou nas fontes do dia. Item sem fonte não entra. Agenda só é citada depois de conferida na Agenda de hoje.

## 3. Envio e registro
1. Envie com `mcp__Gmail__send_message` (to: `mayara.centeno@jynx.com.br`, `includeSignature: true`, `htmlBody` + `body`).
2. Grave a cópia em `projetos/_painel/mensagem-mayara-{AAAA-MM-DD}.md`, com uma linha "Enviado em {hora} · Gmail id {id}" e a lista das fontes usadas por item (para auditoria).
3. Commit "Rotina e-mail Mayara {AAAA-MM-DD}" com as linhas de atribuição da sessão e push na mesma branch (retry 2s/4s/8s/16s só em erro de rede).
4. **Notificação ao usuário** (PushNotification): envie só se algo falhou (Gmail indisponível, envio com erro, push falhou) ou se houver item crítico novo desde o painel (ex.: cliente que virou 🔴). Envio bem-sucedido e sem novidade não precisa de notificação.
