# Análise — Processos em desenvolvimento (Manutenção e Reembolso) · Tatu Marchesan — 2026-11-13

**Ambiente:** Fluig DEV `marchesanimplementos203231`. Só leitura.
**Limite da análise:** o usuário de consultoria não tem permissão para baixar o HTML/JS desses formulários (`Usuário sem permissão para visualizar este documento`). A exportação também falhou (`getActiveCardIndex`). A análise abaixo se baseia na **estrutura de campos** publicada (colunas dos datasets de formulário). Regras, validações e layout não foram vistos.

## Situação no servidor
| | Manutenção | Reembolso |
|---|---|---|
| Formulário | documento 102 · "manutenção" · dataset **`teste1`** | documento 104 · "reembolso" · dataset **`teste2`** |
| Publicado por / quando | Gabriel Izidoro · 15/10/2026 | Gabriel Izidoro · 16/10/2026 |
| Processo (workflow) publicado | ❌ Nenhum | ❌ Nenhum |
| Registros | 0 | 0 |
| Datasets de apoio | ❌ Nenhum | ❌ Nenhum |
| Campos | 86 | 148 |

**Leitura:** são esqueletos de formulário publicados um dia antes da última movimentação do ambiente (16/10). Nenhum dos dois roda ponta a ponta hoje. O avanço real nesse ambiente é só o `solicitacaoDeCompra`.

---

## 1. Manutenção (`teste1`): chamado de manutenção/serviço com SLA

**O que o formulário já prevê (pelos campos):**
- **Solicitante:** nome, e-mail, filial, local, login e data.
- **Catálogo de serviços:** departamento → categoria → subcategoria → serviço (`ztxt_servico_*`, `hd_servico_cod*`), com **SLA por serviço** (`hd_servico_tempoSLA`, em horas e decimal).
- **Equipamento:** patrimônio, número de série, descrição e localização.
- **Prioridade:** matriz **impacto × urgência** (`rdo_impacto`, `rdo_urgencia`, descrições).
- **Aprovação configurável por serviço:** até **3 aprovadores** (`hd_servico_realizaAprov1..3`, `hd_servico_idAprovador1..3`, `hd_servico_aprovado1..3`).
- **Agendamento opcional** (`hd_servico_realizaAgenda`, `dt_preferencia`).
- **Execução:** executor, descrição do serviço executado, tempo de execução, SLA gasto, **pausa de SLA** (`hd_form_slaPausado`) e **feriados** (`hd_listaDataFeriados`), o que indica cálculo de prazo no próprio formulário.
- **Validação pelo solicitante** (`hd_validacao_procRealizado`, `chk_revisao`) e **avaliação de atendimento nos dois sentidos** (notas e comentários do solicitante e do atendente).
- Documentos e anexos obrigatórios.

**O que falta para funcionar:**
| # | Lacuna | Impacto |
|---|---|---|
| M1 | Processo (diagrama, atividades, mecanismos de atribuição) não publicado | Bloqueante |
| M2 | **Cadastro do catálogo de serviços** (departamento/categoria/subcategoria/serviço/SLA/aprovadores): os campos `ztxt_*` são zooms, mas não existe formulário nem dataset de cadastro no servidor | Bloqueante |
| M3 | Origem do **patrimônio**: Protheus (Ativo Fixo) ou cadastro no Fluig? Não há dataset | Alto |
| M4 | Feriados: há o dataset nativo `holiday`/`globalCalendar`; o expediente da Marchesan precisa estar cadastrado no Fluig para o SLA bater | Médio |
| M5 | Nome do dataset `teste1` (fora do padrão `dts_<nome>_JYNX` usado no projeto); trocar antes de ter registros, depois fica caro | Médio |

---

## 2. Reembolso (`teste2`): solicitação de pagamento/reembolso com alçada e integração financeira

**O que o formulário já prevê (pelos campos):**
- **Tipos de solicitação** (`tipoSolicitacao`, `hd_tipo_solicitacao`, `tipo_documento`): reembolso, pagamento a fornecedor (nota/boleto) e cartão (`ultimos_digitos_cartao`).
- **Fornecedor:** CNPJ/CPF, razão social, nome fantasia e **código/loja do Protheus**.
- **Pagamento:** forma de pagamento, dados bancários, **PIX** e transferência, **parcelamento** (`parcelamento_json`).
- **Itens:** da nota (`itens_nota_json`) e do reembolso (`reembolso_itens_json`), mais anexos (documento fiscal, boleto).
- **Alçada multinível:** validador → gerente → head → diretor 1 → diretor 2 → CEO (`hd_temAprov*`, `hd_users*`, `hd_cod*`), com **matriz de aprovadores e alçada por valor em JSON** (`hd_matriz_aprov_json`, `hd_alcada_valores_json`).
- **Controladoria:** espécie, série, **chave de acesso da NF**, natureza, condição de pagamento, desconto, seguro e **frete/CT-e** (UF de origem e destino, tipo de CT-e).
- **Financeiro:** TES, natureza, espécie, condição e vencimento.
- **Integração Protheus:** payload, retorno, status, **ID do título**, **baixa** (`hd_protheus_baixado`, `hd_protheus_dt_baixa`) e fluxo pós-integração.
- Histórico de etapas e observações em buffer.

**Pontos de atenção na estrutura:**
| # | Achado | Recomendação |
|---|---|---|
| R1 | Campo chamado **`WKNumState`** no formulário. É o nome de uma variável reservada do workflow (`getValue("WKNumState")`) | Renomear (ex.: `hd_atividade_atual`) para evitar confusão e bugs em eventos |
| R2 | **Três campos para erro de integração:** `msg_erro_integracao`, `erro_integracao_msg`, `hd_integracao_protheus_msg` | Manter um só (seguindo o padrão `hd_integracao_protheus_*`) |
| R3 | **Quatro campos para etapa atual:** `current_step`, `hd_etapa_atual`, `hd_etapa_codigo`, `hd_form_atividade` | Manter um código e uma descrição |
| R4 | Erro de digitação: `hd_codAvaliador` **e** `hd_codAvalidador` | Remover o duplicado |
| R5 | Três chaves PIX (`chave_pix`, `chave_pix_aceite`, `chave_pix_reembolso`) e pares de dados bancários (`*_reembolso` × `*_transf`) | Validar se são cenários diferentes de verdade |
| R6 | Papéis **Head** e **CEO** e campos de **CT-e/frete** parecem herdados de outro cliente/modelo | Validar com a Marchesan a alçada real e se frete/CT-e entra no escopo |
| R7 | Mistura de nomes em inglês e português, com e sem prefixo `hd_` | Padronizar antes de escrever os eventos |

**O que falta para funcionar:**
| # | Lacuna | Impacto |
|---|---|---|
| G1 | Processo não publicado | Bloqueante |
| G2 | **Datasets Protheus** de fornecedores (SA2), naturezas (SED), condições de pagamento (SE4), TES (SF4) e espécies: nenhum existe | Bloqueante |
| G3 | **Endpoint Protheus** para gerar o título a pagar (FINA050) ou o documento de entrada (MATA103), e para consultar a baixa: não há dataset/serviço | Bloqueante |
| G4 | Origem da **matriz de alçada**: dá para reaproveitar o `dts_amarracaoAprovadores_JYNX` da compra ou é preciso um cadastro novo? | Alto |
| G5 | Nome do dataset `teste2` fora do padrão | Médio |

---

## Reaproveitamento da Solicitação de Compra
Os dois processos podem reaproveitar o que já existe para compras:
- `dts_consultaRestProtheus_MFX` + `dts_getTokenProtheus_MFX` (chamada REST autenticada ao Protheus) → base para as integrações do Reembolso.
- `dts_getFilial_MFX`, `dts_cCusto`, `dts_funcionarios_MFX` → filial, centro de custo e solicitante nos dois formulários.
- `dts_amarracaoAprovadores_JYNX` / `dts_getAmarracaoAprovadores_MFX` → candidato a matriz de alçada do Reembolso.
- Padrão de integração do `servicetask30` (status/payload/raw + captura de erro), já com a lição aprendida: **o erro deve ser lido do complemento**, porque o rollback apaga o `setCardValue` (ver `diagnostico-falhas-2026-11-13.md`).

## Próximos passos sugeridos
| # | Ação | Dono |
|---|---|---|
| 1 | Pedir ao Gabriel o projeto Fluig Studio dos dois processos (ou acesso de leitura aos documentos 102 e 104) para revisar código e diagrama | Gestão do projeto |
| 2 | Validar escopo com a Marchesan: alçada real (Head/CEO?), frete/CT-e, origem do patrimônio, catálogo de serviços | Gestão + key users |
| 3 | Renomear `teste1`/`teste2` e limpar campos duplicados enquanto não há registros | Jynx (dev) |
| 4 | Especificar com o time Protheus os endpoints de título a pagar e consulta de baixa | Jynx + TI Marchesan |
| 5 | Incluir os dois processos no plano/cronograma com estimativa (hoje estão a ~0% de execução no servidor) | Gestão do projeto |
