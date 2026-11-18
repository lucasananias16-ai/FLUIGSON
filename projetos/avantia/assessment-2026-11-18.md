# Assessment: processos de aprovação Avantia (Fluig)

Data: 18/11/2026. Ambiente: `avantiatecnologia214978.fluig.cloudtotvs.com.br`. Escopo: Medição de Contratos (v17), Pedido de Compra (v7) e Solicitação de Compra (v8).
Base: datasets `workflowProcess`, `processTask`, `processHistory`, `processDefinitionVersion`, formulários e eventos exportados (`export/`). Período analisado: solicitações nº 5491 a 6698, de 26/10 a 18/11, com amostra de 1000.

## Resumo

| # | Achado | Severidade | Ação |
|---|---|---|---|
| 1 | 3 medições em loop de reenvio há até 6 dias: o Protheus responde sucesso mas não grava a SCR | Alta | Investigar o APROVCOM no Protheus e destravar as 3 |
| 2 | SC nº 3108 reprovada em 06/11 e travada: o card manda valor por item, o Protheus tem o total | Alta | Reprovar direto no Protheus e encerrar no Fluig |
| 3 | SC nº 6566 vai para Tratar Falhas sem log: quem aprovou não tem alçada no card | Alta (bug) | Corrigir o servicetask35 |
| 4 | 88% dos pedidos (340/388) terminam como **cancelados** porque a decisão sai no Protheus | Média | Rever a adoção e o status de encerramento |
| 5 | Reenvio automático sem limite global: 2 a 4 ciclos por dia, para sempre | Média | Teto de ciclos + escalonamento |
| 6 | Aprovações sem prazo (SLA): fila parada há 9 dias sem alerta | Média | Configurar prazo/notificação nas atividades de aprovação |
| 7 | Exceções engolidas: 3 service tasks apagam o log e só fazem `log.info` no catch | Média | Gravar o erro no card |
| 8 | Dataset `DSSolicitacaoComprasAprov` falha em qualquer consulta | Média | Verificar o formulário/dataset |
| 9 | Higiene: v15 da Medição presa em edição, código morto, getDataset em laço | Baixa | Limpeza |

## Panorama

| Processo | Abertas | Finalizadas | Canceladas | Passaram por Tratar falhas | Duração mediana / p90 / máx. |
|---|---|---|---|---|---|
| Medição v17 | 6 | 435 | 81 | 115 (22%), 39 delas 3+ vezes | 1,2 h / 52 h / 152 h |
| Pedido v7 | 9 | 39 | 340 | 12 (3%) | 3 h / 41 h / 66 h |
| Solicitação v8 | 8* | 82 | 8 | 12 (13%) | 0,1 h / 9 h / 144 h |

\* contando a nº 3108, que ainda está na v7.

Em 18/11 havia 23 solicitações abertas: 5 em tratamento de falha e 18 aguardando aprovador.

## 1. Medições em loop: "Protheus respondeu sucesso, mas não gravou a SCR"

| Solicitação | Medição | Filial | Valor | Alçada / aprovador | Em falha desde |
|---|---|---|---|---|---|
| 6505 | 002377 | SP-Barueri | R$ 1.036,24 | 002377000001001 / 000042 | 12/11 (122 movimentos) |
| 6675 | 002689 | PE-Recife | R$ 2.765,00 | 002689000001002 / 000047 | 17/11 |
| 6684 | 002752 | PE-Recife | R$ 554,46 | 002752000001019 / 000020 | 17/11 |

O log do card é o mesmo nas três: `CR_STATUS 02, esperado 03 (decisao 001)`. O Fluig faz certo em não encerrar: se encerrasse, a medição ficaria aprovada no Fluig e pendente no Protheus. **A causa está no Protheus.** O endpoint `/rest/APROVCOM` responde sucesso sem liberar a alçada. Hipóteses para checar na SCR:
- o aprovador não é o do nível corrente (CR_STATUS 02 = aguardando o nível);
- existe bloqueio de saldo ou de data de competência;
- o usuário do aprovador (CR_USER) é diferente do usado na chamada.

**Ação:** abrir chamado com o time Protheus levando os três números de alçada. Depois de corrigir, cada solicitação sai sozinha no próximo ciclo.

## 2. SC nº 3108 (v7): reprovação que nunca chega ao Protheus

- Mario Tranche reprovou em 06/11 ("Não vamos mais precisar"). Desde então o card ficou cerca de 20 vezes em Tratar Falhas.
- O Protheus responde `Registro nao Localizado na Tabela - SCR`. O próprio log mostra a causa:
  - o card enviou valor 5108.6 e depois 1199 (valor de **cada item**, 2 linhas de alçada);
  - o Protheus tem **uma** alçada para o documento 010523, com valor 6307.6 (o total).
- O card veio da v7, com alçada por item. Ele foi migrado para a v8 em 22/09 ("movimento de conversão"), mas os dados do card continuaram no formato antigo. Na v8 a alçada é por centro de custo e documento.
- **Ação imediata:** reprovar a SC 010523 direto no Protheus. O próximo ciclo cai no `statusAlcadaProtheus`, que considera a alçada já processada e libera o card. Outra saída é cancelar a solicitação no Fluig com justificativa.
- **Ação estrutural:** procurar outras solicitações abertas de versões antigas (hoje só existe esta).

## 3. SC nº 6566: falha silenciosa (bug no `servicetask35`)

- Hamilton Valentim (aprovador 000027, o 3º da tabela de aprovadores) aprovou em 13/11. O card só tem alçada para o aprovador **000011** (David Holanda).
- O `servicetask35` pega como `codAprov` o último aprovador com decisão (l.135-157) e só envia as alçadas desse código (l.194). Com nenhuma alçada casando, `totalAlcadas = 0`: nada é enviado, nada é gravado no log (`txta_observacoes_integracao` vazio) e `integraAlcadas` continua false. O fluxo vai para Tratar Falhas sem mensagem e repete a cada ciclo.
- **Correção sugerida:**
  - quando `totalAlcadas == 0`, gravar no card "aprovador X sem alçada no documento Y" para que a falha seja visível;
  - decidir a regra de negócio: aprovar em nome de quem tem a alçada (substituto/superior) ou exigir que o aprovador da alçada decida.
- **Ação imediata:** David Holanda (000011) aprova a SC 245332 no Protheus, ou o card é ajustado.

## 4. Pedido de Compra: 88% "cancelados"

- 340 de 388 pedidos da v7 terminaram com status **cancelado**. O motivo gravado no card é: `Pedido ... ja foi decidido no Protheus - saiu de C7_CONAPRO = 'B' ... cancelado automaticamente`. A rotina roda todo dia às 08:00, com usuário `admin`.
- Ou seja, os aprovadores decidem no Protheus e o Fluig só replica. Isso traz três efeitos:
  - os relatórios de cancelamento do Fluig ficam poluídos;
  - não fica trilha de quem aprovou;
  - os campos `hd_cancelamento_*` ficam vazios.
- Hoje Meykson Arruda tem 7 pedidos abertos no Fluig e provavelmente decide pelo Protheus.
- **Ação:**
  1. Alinhar com o negócio onde a aprovação deve acontecer.
  2. Se o Protheus for aceito como canal, encerrar a solicitação por **finalização** (mover para Fim) em vez de cancelamento, e gravar quem decidiu e quando (CR_USERLIB / CR_DATALIB).

## 5. Reenvio sem teto

- A conferência (`servicetask40/79`) faz 3 reenvios e, na falha, **zera o contador de propósito** (l.71-73). Somado ao agendamento que devolve Tratar falhas para a integração várias vezes por dia (horários variam: 08, 10, 12, 14, 16, 18h), uma falha permanente vira loop infinito. A nº 6505 já tem 122 movimentos, todos idênticos.
- **Ação:**
  - criar um contador global de ciclos (por exemplo `hd_conferencia_ciclos`);
  - depois de N ciclos (sugestão: 4, cerca de 2 dias), parar o reenvio automático e deixar a tarefa com o grupo `TRATATIVAS.*` com aviso por e-mail;
  - o prazo de Tratar falhas (venceu em 18/11 00:00) também deveria notificar alguém.

## 6. Aprovações sem prazo

Nenhuma tarefa de aprovação tem `deadlineDate`. Exemplos parados:

| Solicitação | Processo | Aprovador | Parada desde |
|---|---|---|---|
| 6215 | Pedido | renato.tenorio | 09/11 |
| 6219 | Solicitação | emerson.coelho | 09/11 |
| 6224, 6239 | Solicitação | renato.tenorio | 09/11 |
| 6402, 6466 | Pedido | meykson.arruda | 11-12/11 |

Todos os usuários estão ativos. **Ação:** configurar prazo nas atividades de aprovação (Medição 5, Pedido 40, Solicitação 10), com aviso ao gestor e eventual escalonamento ou substituto.

## 7. Qualidade de código (lint + leitura)

- **Lint:** nenhum erro nos 16 eventos. Há 3 alertas `DS-GETDATASET-EM-LACO` (servicetask16 l.293, servicetask22 l.162, servicetask35 l.208) e 1 info `DS-LOG-EM-LACO` (servicetask16 l.159). A escrita por documento no laço é inevitável. As leituras da SCR dentro do laço (`totalDaScr`, `statusAlcadaProtheus`, `descreveAlcadaProtheus`) poderiam ser feitas uma vez antes do laço, como o servicetask40 já faz.
- **Exceções engolidas:** `servicetask16` (l.335), `servicetask22` (l.196) e `servicetask35` (l.267) limpam o log do card no início e, no catch, só fazem `log.info`. Qualquer exceção resulta em Tratar falhas sem mensagem. No servicetask35 é pior: um erro depois da l.251 deixa `integraAlcadas = true` com as datas de produto sem preencher. **Ação:** gravar `e.toString()` no campo de log no catch.
- **Código morto:**
  - cerca de 31 linhas comentadas da integração antiga em cada service task (servicetask16 l.206-236, servicetask22 l.113-143, servicetask35 l.159-189);
  - `formatarDataEnAtual` nunca é usada nos `beforeTaskSave`;
  - variáveis não usadas (`codProcess`, `indexesPrd`).
- Não há credenciais fixas no código.

## 8. Dataset do formulário de Solicitação quebrado

`DSSolicitacaoComprasAprov` devolve "Retorno de dataset inválido" até na consulta mais simples (1 linha, 1 filtro). Os datasets de Pedido e de Medição funcionam normalmente. Isso afeta relatórios, painéis e qualquer integração que leia o formulário. **Ação:** reindexar ou republicar o formulário (docId 7, v4000, editado em 28/10) e conferir campos com nome inválido.

## 9. Higiene do ambiente

- `aprovacaoMedicaoDeContratos` **v15 continua "em edição"** (editionMode=true). É um rascunho abandonado entre a v14 e a v16, e convém descartá-lo.
- 24 solicitações recentes ainda rodam na Medição v16 e 1 na v14 (todas encerradas na amostra, sem impacto atual).
- Nenhuma versão de processo tem descrição preenchida. Registrar o que mudou em cada versão ajuda nos próximos assessments.

## Próximos passos sugeridos

1. **Hoje:**
   - reprovar a SC 010523 no Protheus (nº 3108);
   - resolver a alçada da SC 245332 (nº 6566);
   - abrir chamado no Protheus com as 3 alçadas de medição.
2. **Esta semana:**
   - corrigir o servicetask35 (alçada não encontrada + catch);
   - colocar teto de ciclos no reenvio;
   - configurar prazos de aprovação.
3. **Próxima versão:**
   - mudar o encerramento de Pedido para finalização com trilha;
   - limpar código morto e tirar leituras do laço;
   - descartar a v15 em edição;
   - corrigir o dataset da Solicitação.
