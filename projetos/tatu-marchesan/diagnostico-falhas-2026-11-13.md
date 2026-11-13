# Diagnóstico — Falhas de integração Fluig → Protheus · Tatu Marchesan — 2026-11-13

**Fontes (só leitura):**
- Complementos das tarefas automáticas (`processTask.taskObservation`), onde o Fluig grava o erro de cada atividade de serviço.
- Formulário (`dts_solicitacao_compras_JYNX`).
- Eventos do processo `solicitacaoDeCompra` v28, exportados do servidor.

## Conclusão em uma linha
A criação de SC no Protheus funciona. **O bloqueio atual é a aprovação:** liberar ou reprovar a SC no Protheus devolve `Registro nao Localizado na Tabela - SCR`. Isso deve se repetir nas **22 solicitações que hoje esperam aprovação**, assim que forem aprovadas.

## Causa de cada uma das 19 falhas
| Causa (mensagem real) | Solicitações | Período | Situação hoje |
|---|---|---|---|
| **Protheus não encontra o registro de alçada (SCR)** ao liberar/reprovar: `Registro nao Localizado na Tabela - SCR` | 54 (reprovar), 55 (liberar) | 06/10 | 🔴 **Aberto.** São os casos mais recentes, na versão atual |
| Protheus devolve erro genérico: `Erro nao tratado na geracao da Solicitacao de Compra!` | 15, 18, 27, 28, 40, 41, 42, 43 | 15/09–28/09 (repetiu na 51, em 06/10, depois cancelada) | 🟡 Do lado do Protheus (endpoint `/aprovcom/gerasc`). Parou de ocorrer nas solicitações seguintes, mas não há registro de correção |
| Item sem unidade de medida: `Campo obrigatorio nao informado: C1_UM` | 16, 17, 19, 20, 39 | 15/09–28/09 | 🟢 Resolvido: o `beforeTaskSave` atual já valida a unidade |
| Bug no script Fluig: `ClassCastException String → Map` | 11, 12 | 14–15/09 | 🟢 Resolvido nas versões seguintes |
| Autenticação no APROVCOM: `The request requires authentication` | 21 | 15/09 | 🟢 Hoje a liberação já autentica (a 55 chegou ao Protheus) |
| Integração de atualização ainda não implementada | 30 | 23–24/09 | 🟢 Implementada no `servicetask81` da v28 |

Também houve uma falha transitória de SSL ao obter o token do Protheus (nº 49, em 06/10). Ela se recuperou: a 49 hoje tem a SC 000397 e está em aprovação.

## O ponto crítico: tabela SCR
- A SC é criada bloqueada (`C1_APROV = "B"`, regra do `servicetask30`), e a liberação e a reprovação são feitas pelo `POST /APROVCOM`, que procura o documento de alçada na **SCR**.
- Nos casos 54 e 55, a SC existia no Protheus (000401, 000403), mas **sem registro na SCR**. Ou seja, o Protheus não gerou o documento de alçada quando a SC foi incluída pelo `gerasc`.
- **Hipóteses a validar com o time Protheus:**
  1. A rotina `/aprovcom/gerasc` inclui a SC sem acionar o controle de alçada que gera a SCR.
  2. Não há grupo de aprovação configurado para a filial 0101 ou para os centros de custo usados (1010, 101100, 640000, 640800).
- **Impacto:** as 22 solicitações em aprovação (SCs 000368 a 000421) devem falhar do mesmo jeito ao serem aprovadas.

## Observabilidade: o erro existe, mas fica fora do formulário
- O Fluig **desfaz** o `hAPI.setCardValue` quando a atividade de serviço lança exceção (TDN: "qualquer exceção [...] irá efetuar Rollback da transação [...] campos de formulário alterados com hAPI.setCardValue"). Por isso os campos `hd_*_sc_erro` ficam vazios, mesmo com o código da v28 tentando gravá-los.
- O erro fica no **histórico da solicitação** (complemento da tarefa automática). Quem trata a falha consegue vê-lo, mas ele não aparece no formulário nem em relatórios.
- **Correção proposta:** um evento novo, `beforeStateEntry`, que ao entrar em "Tratar Falhas" lê o último complemento de falha e o copia para `hd_*_sc_erro`. O código está em `fluig/workflow/scripts/solicitacaoDeCompra.beforeStateEntry.js`. Passou no lint e ainda **não foi publicado**.

## Recomendações
| # | Ação | Dono | Prazo |
|---|---|---|---|
| 1 | **Levar o erro da SCR ao time Protheus**: conferir se o `gerasc` gera a alçada e se há grupo de aprovação para filial 0101 e CCs 1010/101100/640000/640800 | Jynx + TI Marchesan (Protheus) | 18/11 |
| 2 | Depois do ajuste, aprovar uma solicitação de teste (ex.: nº 60, SC 000419) e conferir a liberação no Protheus | Paulo Ferreira + Jynx | 20/11 |
| 3 | Investigar no Protheus o `Erro nao tratado na geracao da Solicitacao de Compra!` (log do `gerasc` dos dias 22/09 e 28/09) | TI Marchesan (Protheus) | 25/11 |
| 4 | Testar em homologação e publicar o `beforeStateEntry` (erro no formulário) | Jynx (dev) | 25/11 |
| 5 | Com o aval do cliente, cancelar as 17 falhas antigas que são teste e reabrir a 27/28 se forem reais | Gestão do projeto | 25/11 |
| 6 | Acertar no Protheus as SCs 000120, 000285, 000401 e 000403 (estado inconsistente com o Fluig) | TI Marchesan | 25/11 |
