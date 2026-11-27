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

## 27/11/2026 — Teste de mesa antes do reteste da ODS
Cadastros temporários de TESTE, todos excluídos ao final:

| Formulário | cardId | Conteúdo |
|---|---|---|
| Alçada por Posição (8) | 692 | posição TST "[TESTE] APROVADOR E2E", nível 1, Expense sheets, BRL 500 mil / USD 100 mil |
| Atribuição de Usuários e Posições (7) | 693 | "[TESTE] Admin Fluig", FLU1G, Ativo = Sim (gravado pela API) |
| Atribuição de Usuários e Posições (7) | 694 | Ludmila Oliveira, posição TST, CC 2000, Ativo = Não (gravado **pela tela**) |

Resultados:
- **Tela de atribuição:** salvou a Ludmila com matrícula U000117 e departamento Fiscal. Não apareceu mais "Faltou preencher".
- **Fim a fim** (datasets _test e processo _test): PRIO TIGRIS 7/7; a solicitação 227 chegou à Aprovação 1 com o aprovador da alçada e foi cancelada.
  O controle (CC 2000) foi barrado corretamente, porque o único aprovador de nível 1 (a Ludmila) estava com Ativo = Não.
- **Cadastro** (dataset de colaboradores original): A e B passam; C falha só pela parametrização do print.
- **Problema novo:** a tela de atribuição oferece só 100 centros de custo (dts_cCustoProtheus_JYNX sem filtro = TOP 100), e o FLU1G não está entre eles.
- **Limpeza:** os cards 692, 693 e 694 foram excluídos. A busca de aprovadores para FLU1G voltou a 0, e não há solicitação ativa na cópia de teste.
