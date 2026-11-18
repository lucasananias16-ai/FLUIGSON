# Avantia — processos de aprovação (Fluig)

Ambiente: `avantiatecnologia214978.fluig.cloudtotvs.com.br` (empresa 1). Exportado em 2026-11-18 via ECMWorkflowEngineService.

Os arquivos em `export/` estão no formato XML de exportação do servidor (reimportável no Fluig), com os eventos de processo embutidos.
O webservice não devolve o `.process` do Fluig Studio.

| Processo | Versão ativa | Eventos | Formulário (docId / versão) | Últ. edição do formulário | 1ª solicitação na versão ativa |
|---|---|---|---|---|---|
| aprovacaoMedicaoDeContratos | 17 | afterProcessCreate, beforeCancelProcess, beforeTaskSave, calculateAgreement, servicetask16, servicetask40 | 9 / 5000 | 2026-10-27 | 2026-10-27 16:54 (nº 5600) |
| aprovacaoPedidoDeCompra | 7 | afterProcessCreate, beforeCancelProcess, beforeTaskSave, calculateAgreement, servicetask22 | 8 / 3000 | 2026-09-29 | 2026-09-14 15:58 (nº 3700) |
| aprovacaoSolicitacaoDeCompra | 8 | afterProcessCreate, beforeTaskSave, calculateAgreement, servicetask35, servicetask79 | 7 / 4000 | 2026-10-28 | 2026-10-26 11:44 (nº 5491) |

O Fluig não guarda a data de publicação da versão de processo. A 1ª solicitação aberta na versão indica quando ela entrou em uso.
