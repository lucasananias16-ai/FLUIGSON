# Operações feitas no Fluig DEV da ODS (odsdo204964)

## 26/11/2026 — Agendador de tarefas
Tarefas de "Sincronização de Dataset", criadas pelo Painel de Controle → Agendador de tarefas → Adicionar.
Frequência diária, a cada 1 dia, no horário indicado.

| Tarefa | Dataset | Expressão (cron) | Primeira execução |
|---|---|---|---|
| Sincroniza Pedidos de Compra 07h | dts_getPedidoCompra_JYNX | `0 00 07 1/1 * ? *` | 27/11/2026 07:00 |
| Sincroniza Pedidos de Compra 12h | dts_getPedidoCompra_JYNX | `0 00 12 1/1 * ? *` | 27/11/2026 12:00 |
| Sincroniza Pedidos de Compra 18h | dts_getPedidoCompra_JYNX | `0 00 18 1/1 * ? *` | 27/11/2026 18:00 |
| Sincroniza Pedidos de Venda 07h | dts_getPedidoVenda_JYNX | `0 00 07 1/1 * ? *` | 27/11/2026 07:00 |
| Sincroniza Pedidos de Venda 12h | dts_getPedidoVenda_JYNX | `0 00 12 1/1 * ? *` | 27/11/2026 12:00 |
| Sincroniza Pedidos de Venda 18h | dts_getPedidoVenda_JYNX | `0 00 18 1/1 * ? *` | 27/11/2026 18:00 |

Antes dessas tarefas, o Agendador tinha só "Sincroniza Usuários" (dts_getColabProtheus_JYNX, diária às 00:00).
Os datasets de PC e PV estavam sem agendamento: a última carga deles foi manual, em 26/11/2026 às 14:28.

Para desfazer: Agendador de tarefas → marcar a tarefa → Deletar.

## 26/11/2026 — dts_getColabProtheus_JYNX
- Publicada a versão 17 (SYS_USR + SRA, prefixo U na matrícula de usuário). A versão anterior era a 16.
- Datasets → Sincronização → "Apagar dados" + "Sincronizar agora": a tabela espelho foi recriada (132 inserts, 0 erros).
- Para desfazer: restaurar a versão 16 e repetir "Apagar dados" + "Sincronizar agora".
