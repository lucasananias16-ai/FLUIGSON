# MindLab · Validação do Fluig de homologação · 13/11/2026

> Só consulta (datasets e histórico). Nada foi criado, movimentado ou alterado.
> Ambiente: Fluig de **homologação** (`mindlabdo160213`), ligado ao Protheus de teste (`JD5TU6_TESTE`). Credenciais no "CHECK-LIST DE AMBIENTE - Mindlab.xlsx" (Drive); não copiadas aqui. A aba de **produção** do checklist está em branco.

## Processo
- Processo novo: **`Solicitação de Pagamento`**, versão **89**, formulário 953, categoria Financeiro. Trata pagamento e reembolso no mesmo fluxo.
- Processos antigos ainda publicados no mesmo ambiente: `WKDespesas` (v48) e `WKReembolso` (v37).
- O fluxo confere com a documentação de 05/06: Validador → Gerente → Head → Diretor 1 → Diretor 2 → CEO → Análise e Qualificação (Controladoria) → Validação da Solicitação (Financeiro) → Integração (serviço) → Fim. Tem captura de erro levando a "Erro de integração" (grupo TI), fim "Entrada manual", fim "Recusado" e espera condicional pela baixa no Protheus.

## Solicitações de teste (31, nº 688 a 788)
| Situação | Qtde | Detalhe |
|---|---|---|
| Finalizadas com título gerado no Protheus | 13 | 21/09 a 21/10, versão 82. Retorno "Documento inserido com sucesso" (ex.: 708, pagamento de R$ 20.000 por transferência) |
| Cancelada | 1 | 695 |
| Reembolso integrado, aguardando baixa no Protheus | 2 | 691 e 694. Comportamento esperado para reembolso |
| **Erro de integração** | 1 | **704** (pagamento, boleto, R$ 2.321,36): Protheus respondeu "Erro ao Inserir Documento, Fornecedor não encontrado". Reprocessada em 12/11 e continua em erro |
| Paradas em aprovação (Gerente/Head) | 9 | 699 (Head, desde 15/10), 773, 774, 775, 783 a 788 |
| Paradas na Controladoria | 5 | 701, 703, 707 (desde 21/10), 776 |

## O que a validação mostra
1. **O caminho completo funciona:** 13 solicitações percorreram aprovação, Controladoria, Financeiro e geraram título no Protheus de teste.
2. **O cliente voltou a testar:** a Isadora abriu 6 solicitações em 11 e 12/11, já na **versão 89**. Todas aguardam aprovação do lado da MindLab (Bárbara, Luiz).
3. **Ponto de 13/08 corrigido, ao que indica:** pagamento encerra após integrar (`finalizar`) e reembolso fica aguardando baixa (`aguardar_baixa`). Na 670 de agosto o pagamento ficava preso.
4. **Pendência aberta:** solicitação 704 em erro de integração (fornecedor CNPJ 46.893.334/0001-32 não encontrado no Protheus de teste). Provável cadastro ausente na base de teste, a confirmar com o Luiz.
5. **Nenhuma solicitação da versão 89 chegou à integração ainda.** As 13 finalizadas são da versão 82. A v89 precisa de ao menos um pagamento e um reembolso de ponta a ponta antes do aceite.

## Não verificado nesta rodada
- Itens visuais e de regra da ata de 13/08 (descrição da conta contábil, filtro de CC por empresa, valor por CC para o validador, bloqueio de autoaprovação por CPF/CNPJ): exigem abrir o formulário ou criar solicitação de teste.
- Widget de consulta/aprovação em massa, parâmetros e e-mails de lembrete.
- Planilha de testes da MindLab (com o Gabriel).

## Teste de ponta a ponta na versão 89 (13/11, autorizado pelo Lucas)
- **Solicitação 789** (pagamento de teste, R$ 0,01, CC 002400 Logística, aberta com o usuário `admin`). Justificativa: "TESTE JYNX 13/11 ... (pode cancelar)".
- Caminho percorrido na v89: Início → Gerente → Análise e Qualificação → Validação da Solicitação → **Integração**. Todos os desvios automáticos resolveram como esperado.
- **Resultado: falhou na integração** com `The request requires authentication` (resposta de autenticação do REST do Protheus de teste). Está em "Erro de integração" (grupo TI). Não reprocessei.
- Em 12/11 a mesma chamada ainda chegava ao Protheus (704 recebeu erro de negócio). Hipótese: senha do usuário REST alterada, expirada ou bloqueada, ou credencial desatualizada no dataset `ds_protheus_documento_entrada_JYNX`. A confirmar com o Luiz e o Gabriel.
- O teste de **reembolso não foi aberto**: cairia na mesma falha de autenticação.
- Ressalvas do método: a solicitação foi aberta e movimentada por webservice, sem passar pela tela do formulário. Por isso o teste valida fluxo, eventos e integração, mas **não** valida as regras de tela. Item trocado na Controladoria para DE000051/TES 012 (mesmos dados da 708, que integrou em outubro).
- Observação técnica: na v89 o script de integração grava `aguardar_processamento` e espera a confirmação do Protheus (CONSULTADOC) antes de finalizar. Na v82 finalizava direto.

## Rascunhos no Gmail (não enviados)
1. Para o Luiz: fornecedor da 704 e falha de autenticação da 789.
2. Para o grupo MindLab: conclusão das aprovações pendentes até 20/11 e reunião de aceite na semana de 23/11.
