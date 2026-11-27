# Para revisão do desenvolvedor — ODS / Liberação de Faturamento por Medição (DEV, 27/11/2026)

Tudo abaixo está **somente nas cópias `_test`** do Fluig DEV (odsdo204964). Os originais, que a ODS usa, **não foram alterados**,
exceto o `dts_getColabProtheus_JYNX` (v17), promovido antes com aprovação (registrado em OPERACOES_DEV.md).
Os testes automatizados estão em `liberacao_faturamento_medicao/tests/e2e/` (README com os comandos).

## 1. Datasets `_test` (sem sincronização, só respondem ao admin)
| Dataset | Versão | Correção | Arquivo |
|---|---|---|---|
| dts_getPedidoCompra_JYNX_test | v2 | sem limite de 5 PCs; chave C7_NUM + addOrUpdateRow; itens consolidados por PC; C7_STATUS / C7_COR_STATUS (regra da v20); erro não grava linha | datasets/dts_getPedidoCompra_JYNX_test.js |
| dts_getPedidoVenda_JYNX_test | v1 | carga completa da janela, em vez de incremental por C5_EMISSAO | datasets/dts_getPedidoVenda_JYNX_test.js |
| dts_cCustoProtheus_JYNX_test | v1 | sem filtro devolve todos os CCs (454, antes 100; FLU1G incluído); ignora CTT_BLOQ = '1' | datasets/dts_cCustoProtheus_JYNX_test.js |

As versões de **promoção** (sincronizadas, sem restrição) de PC e PV estão prontas em `datasets/dts_getPedidoCompra_JYNX.js`
e `datasets/dts_getPedidoVenda_JYNX.js`, mas **não foram publicadas**. A do PC muda a estrutura, então precisa de
"Apagar dados" + "Sincronizar" depois de publicar.

## 2. Processo `liberacao_faturamento_medicao_test` — v6 (v7 preparada) (início restrito ao admin)
| Mudança | Onde |
|---|---|
| Sem aprovador ativo na alçada, **barra** a entrada na Aprovação (o mecanismo original atribui ao admin) | beforeStateEntry |
| Moeda, C. Custo e valor obrigatórios para definir o aprovador | beforeStateEntry |
| Níveis 2–4 calculados com os dados reais do pedido, gravados em `hd_nvlPcAprov`; os gateways 80/84/87 leem esse campo (o main.js usa C. Custo "FLU1G2026" e valor "R$ 37.000,00" fixos em hd_hasAprov*) | beforeStateEntry + condições dos gateways |
| **Campos obrigatórios no servidor**: abertura (PC, PV, CC, valor, moeda, itens); decisão em todas as aprovações; **comentário obrigatório em Revisar, Reprovar e na Revisão**; anexo na Adicionar NF; item medido na Medição | beforeTaskSave |
| **Histórico** em tb_obsHistorico gravado pelo servidor a cada etapa: etapa, data/hora, usuário, decisão e comentário | beforeTaskSave |
| **Reprovação**: novo fim "Reprovado" (100). Aprovações 1–4 com hd_aprovPc = "Reprovar" e Aprovação da NF com hd_aprovValNf = "reprovado" | XML: estado 100, links 101–105, condições |
| Atividades finais com nome: **53 "Aprovado"** (antes "Fim") e **100 "Reprovado"** | XML: nome dos estados finais (v6) |
| **Anexo da NF na Adicionar NF (73)** (v7, preparada, ainda **não publicada**): só vale anexo incluído **nesta passagem pela etapa** e **pelo próprio responsável que envia** (ou substituto). Anexo de etapa anterior, ou de outra pessoa que anexou sem assumir a tarefa, não conta. O nome da NF vai para o histórico. Usa processHistory (movimento de entrada na 73) e processAttachment (quem anexou e em qual movimento) | beforeTaskSave |
| Responsável da **Medição dos Itens** = executor do Início (raia Comprador); da **Aprovação da NF** = grupo ADICIONA.NF.PC (raia Fiscal). Antes não havia mecanismo, e quem enviava escolhia entre 12 usuários | XML: atribuição das atividades 32 e 39 |

Fontes: `workflow/scripts/liberacao_faturamento_medicao_test.{beforeStateEntry,beforeTaskSave}.js` e
`workflow/liberacao_faturamento_medicao_test.v6.export.xml` (v7: `….v7.export.xml`, só muda o beforeTaskSave).

## 3. Resultado dos testes (27/11/2026, com cadastros de teste temporários já excluídos)
- **fluxo-completo.e2e.test.js: 17/17** (solicitação 237). Passou por todas as atividades: Revisão, Aprovações 1–4,
  Adicionar NF, Medição, Aprovação da NF, Liberação e Fim (rodado na v5; a v6 só renomeia o Fim para "Aprovado"). O formulário foi montado como no widget (PV, cliente, PC, itens, solicitante).
  Os 4 envios inválidos foram barrados pelo servidor. O histórico ficou com as 11 etapas e os comentários.
- **fluxo-reprovacao.e2e.test.js: 5/5** (solicitação 238). Reprovar sem comentário foi barrado; com comentário, a solicitação
  terminou no fim "Reprovado" e a reprovação ficou no histórico.
- **cadastro-aprovador.e2e.test.js:** a tela de atribuição salva a Ludmila com matrícula U000117 / Fiscal (dataset original v17).

## 4. Pontos para o desenvolvedor decidir ou fazer
1. **Botão "Reprovar" no formulário:** o processo de teste já aceita reprovação, mas o formulário (compartilhado com o processo
   original) só tem "Aprovar" e "Solicitar Revisão". É preciso acrescentar o botão (hd_aprovPc = "Reprovar"; na Aprovação da NF,
   hd_aprovValNf = "reprovado") e exigir o comentário também no navegador.
2. **Diagrama:** o fim "Reprovado" e as setas novas estão no modelo, mas não na imagem do diagrama. Ajustar no Fluig Studio.
3. **main.js:** remover a consulta com valores fixos ("FLU1G2026" / "R$ 37.000,00") e o valor padrão do campo de moeda no HTML.
4. **Atribuição de inativos:** o mecanismo atribuicao_centro_custo ainda pode atribuir a aprovador com Ativo = "Não". Com o
   beforeStateEntry nenhuma solicitação fica sem aprovador ativo, mas a lista de responsáveis ainda pode incluir inativos.
   Corrigir só com o mecanismo `_test` (mechanisms/atribuicao_centro_custo_test.js), publicado pelo Fluig Studio.
5. **Promoção**, se aprovada: datasets de PC/PV/CC, processo (v5 → original) e widget apontando para os datasets corrigidos.
6. **Responsáveis** da Medição e da Aprovação da NF: confirmados pelo Lucas em 27/11 (Comprador = quem abriu; Fiscal = ADICIONA.NF.PC).
7. **Anexar sem assumir a tarefa (apontado pelo Lucas em 27/11):** o processo está com "Complementar solicitações" ligado
   (complementsLevel 1) e "Segurança anexos" em "Não controlar segurança". Pelo TDN, complemento permite incluir comentários
   **e anexos** "sendo ou não responsável pela tarefa corrente", e a segurança de anexos é do processo inteiro, não por atividade.
   Por isso a v7 resolve no servidor: o anexo de terceiros continua podendo existir, mas **não libera** a etapa.
   Para impedir a inclusão em si, decidir com o cliente: (a) desligar "Complementar solicitações" (também tira os comentários
   avulsos) ou (b) "Controlar segurança" com "Publicar anexos" só para quem deve anexar (vale para todas as etapas).
