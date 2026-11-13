# Requisitos levantados nas atas e e-mails — Tatu Marchesan · Fluig

**Fonte:** e-mails e anotações de reunião (Gemini/Read AI) de 26/08 a 12/11/2026. **[E]** = escrito na fonte. **[I]** = inferência.
**Atas completas não lidas** (o conector do Google sem permissão):
- Levantamento Reembolso, 16/10: https://docs.google.com/document/d/1JlY4GI-TcJTuEGJyhOryxElqslKs0S8ZlJYGDUfQjCc
- Levantamento Manutenção, 15/10: https://docs.google.com/document/d/1dch5WwiD4TuCOLaNvWVHZHxHNzZq6AcuYlMb-idKE_8

## 1. Reembolso de despesas (levantamento 16/10)
- [E] Hoje: "Operação utiliza o sistema **Paytrack** para despesas e integração com o **Glóveia**" ([I] Glovia).
- [E] "Proposta de formulário no Fluig centraliza anexos e automatiza aprovações por alçadas."
- [E] **Duas etapas de aprovação** "configuráveis conforme a hierarquia da empresa".
- [E] **Câmbio:** "processe despesas em dólares, mantendo o título original e convertendo apenas para fins de contabilização".
- [E] **Distância:** o cliente enviaria o print do sistema atual "com a funcionalidade de cálculo automático de distância para reembolso" ([I] quilometragem).
- [E] **Campos:** "Remover campos de dados fiscais e de fornecedores mantendo apenas as categorias, centro de custo e projeto como opcional." Também "padroniza categorias".
- [E] Ação pendente: nova reunião para demonstrar o processo atualizado. Em 04/11 ainda estava pendente ("Finalizar a estrutura dos fluxos de serviços e reembolso da Tatu para agendar uma reunião com o cliente").
- **Não está nas fontes:** valores de alçada, aprovadores, forma de pagamento, destino da integração (Protheus ou Glovia), fonte do câmbio.
- ⚠️ As atas citam reembolsos de **outros clientes** (CMA/RM, Gol). Não misturar.

## 2. Manutenção / Serviços (levantamento 15/10)
- [E] "Solicitações de manutenção **dispensam níveis de aprovação**, direcionando o fluxo diretamente para **execução ou integração**."
- [E] "Definido o **direcionamento automatizado por regras parametrizadas no Protheus** e a validação de cadastros ativos."
- [E] Ações:
  - Gabriel + Pedro (TOTVS/WeTrust): "Desenvolver a **API de integração entre o Fluig e o Protheus**".
  - Gabriel: "Levantar as integrações necessárias com o sistema Protheus junto à equipe da Totvs".
  - Gabriel: "remover etapas de aprovação".
  - Gabriel: "Investigar a aplicação de uma regra que **consulte os usuários do Protheus para validar o acesso** no Fluig".
  - Grupo: "carga de regras de configuração **em massa**" com o consultor TOTVS.
- [I] As "regras parametrizadas no Protheus" devem vir do módulo de Manutenção de Ativos (SIGAMNT, solicitação de serviço/OS). A confirmar.
- **Não está nas fontes:** catálogo, SLA, prioridade, agendamento, patrimônio, avaliação.

## 3. Solicitação de Compra
**Regras definidas com a TOTVS (01/09)** [E]:
1. "Regras de aprovação da SC **não serão feitas no Protheus**. Será direto no Fluig com base no Centro de Custo do Solicitante e valores."
2. Bloquear a criação de SC se a **validade RIAI** (`A5_VALRIAI`, tabela SA5 Produto × Fornecedor) estiver vencida.
3. `C1_OBS` com até 120 caracteres.
4. Centro de custo: sugerir o do solicitante (`DBK_CC`) ou informar manualmente.
5. **Obrigatórios:** `C1_CODCOMP`, `C1_CC`, `C1_FORNECE`, `C1_LOJA`. Fornecedor/loja vazios → usar o **último fornecedor com NF (SD1)** do produto.

**Alçada (capacitação 15/09)** [E]: supervisor imediato → aprovador do centro de custo → **diretor da filial acima do limite** (exemplo de R$ 20 mil; [I] não confirmado como regra). Sem CC cadastrado, vai do supervisor direto ao diretor.

**Integração (17/09)** [E]: a SC é gravada no Protheus **na criação, bloqueada até a aprovação**. A aprovação final é registrada no Protheus depois de todos os níveis do Fluig. O cancelamento é feito no Fluig. Alterações relevantes são feitas no Fluig e podem exigir nova aprovação. Volume: 10 a 50 SC/dia. O Glovia captura a SC do Protheus.

**Conferência com o código atual (v28):**
| Regra | No código Fluig? |
|---|---|
| Aprovação no Fluig por CC e valor | ✅ (`beforeTaskSave` + amarração) |
| SC bloqueada na criação (`C1_APROV = B`) | ✅ |
| `C1_CODCOMP` e `C1_CC` obrigatórios | ✅ |
| **`C1_FORNECE` / `C1_LOJA`** (obrigatórios ou último fornecedor da SD1) | ❌ não enviados no payload. [I] Pode estar no endpoint do Protheus; confirmar com o Pedro |
| **Validade RIAI (SA5)** | ❌ não está no Fluig. [I] Pode estar no endpoint; confirmar |
| `DBK_CC` como sugestão | ❌ não encontrado |
| Cancelamento no Fluig com reflexo no Protheus | 🟡 campos `hd_cancelamento_sc_*` existem; o fluxo não foi testado |

**⚠️ Ligação com o erro da SCR:** como foi decidido que a aprovação **não** usa a alçada do Protheus, **não existe registro na SCR**. Então o `POST /APROVCOM`, que procura a SCR para liberar ou reprovar, falha por desenho. A liberação precisa **liberar a SC direto** (`C1_APROV` B → L), sem depender da SCR, ou o endpoint precisa ser ajustado para esse cenário.

**Problemas relatados pelo cliente:**
| Data | Problema | Situação |
|---|---|---|
| 15/09 | Erro 403 no CC, 404 no vínculo de aprovador, aprovador por filial não exibido | CC corrigido em 17/09; demais sem registro de fechamento |
| 15/09 | Itens sem valor impedem o total | Tratado em 24/09 (último preço editável) |
| 17/09 | SC bloqueada por dados de integração; contas contábeis ausentes | Tratado com dados de teste; conta contábil pendente (Leite/Marcela) |
| 06/10 | Filtro de produtos sem alguns itens; SC chegando ao Protheus **sem valor e já liberada** | Valor e bloqueio corrigidos no código atual (C1_PRECO, C1_APROV=B) |
| 06/10 | Inscrição estadual de fornecedor PF | Com Jeremias (fiscal) |
| 04/11 | "Erros em produção da Marquezan relatados" | Em aberto |

## 4. Cronograma e pessoas
- [E] Desenvolvimento dos fluxos do Portal "programado para começar em **22/10**", após o **Termo de Aceite MIT010** (19–21/10). Não encontrei evidência de assinatura.
- [E] Produção da Compra: processo no ambiente de produção em 28/10, faltando o REST do Protheus. Ambiente fora do ar em 04/11. Senha do ADM resolvida em 10/11 ("pode agendar o Gabriel amanhã para terminar as configurações e deixar pronto para testes integrados").
- [E] 12/11: a Mayara ficou de agendar **um dia exclusivo do Gabriel** para a Tatu e pedir que ele comunique formalmente as entregas ao cliente.
- **Marchesan:** Vagner Gaspar (TI, ponto focal), Willian Kavahara (TI/acessos), Marcos Leite (líder Protheus), Héber Silva (TI/testes), Paulo Ferreira (aprovador CC), Marcela (contas contábeis).
- **TOTVS:** Albert Cometti (coordenação), Jeremias Lameze (Compras), Pedro Lages/WeTrust (APIs Protheus).
- **Jynx:** Lucas Ananias, Mayara Centeno, Gabriel Izidoro.
