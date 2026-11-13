# Código Fluig — Tatu Marchesan

Ajustes propostos para o processo `solicitacaoDeCompra` (servidor `marchesanimplementos203231`, base: versão 28 exportada em 13/11/2026). **Nada aqui foi publicado no Fluig.**

## `workflow/scripts/solicitacaoDeCompra.beforeStateEntry.js` (evento novo)
Ao entrar em "Tratar Falhas", copia para o formulário a mensagem de erro da atividade de serviço que falhou. Ela é lida do complemento que o Fluig grava em `processTask.taskObservation`.

| Atividade de entrada | Campos gravados |
|---|---|
| 32 — Tratar Falhas (Gerar SC no ERP) | `hd_integracao_sc_status`, `hd_integracao_sc_erro` |
| 83 — Tratar Falhas (Atualiza SC no ERP) | `hd_atualizacao_sc_status`, `hd_atualizacao_sc_erro` |
| 88 — Tratar Falhas (Reprovar SC no ERP) | `hd_reprovacao_sc_status`, `hd_reprovacao_sc_erro` |
| 37 — Tratar Falhas (Libera Aprovação no ERP) | Desativado por enquanto: habilitar quando o formulário tiver `hd_aprovacao_sc_status` e `hd_aprovacao_sc_erro` |

### Antes de publicar
1. O processo não tinha `beforeStateEntry`: confirmar no Fluig Studio que nenhum outro evento foi criado desde a v28.
2. (Opcional) Para cobrir a atividade 37, incluir no formulário `hd_aprovacao_sc_status` e `hd_aprovacao_sc_erro` e reativar o mapeamento.

> Tentativa de publicar pelo MCP em 13/11: recusada, porque a API REST não aceita o login do usuário de consultoria (Fluig Identity). Publicar pelo Fluig Studio ou com um usuário local.
3. Testar em homologação: forçar uma falha (ex.: SC inexistente na liberação) e conferir se o campo é preenchido. É preciso confirmar que o complemento da tentativa já aparece no `processTask` neste momento da transação. Se não aparecer, o evento só registra um log e não atrapalha o fluxo.
4. Lint (`fluig_lint`, workflow-event): sem apontamentos.
