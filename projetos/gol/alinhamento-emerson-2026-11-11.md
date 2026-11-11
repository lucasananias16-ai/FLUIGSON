# GOL — Alinhamento TOTVS <> JYNX com Emerson Natali — 2026-11-11

**Base:** status de 09/11 do Emerson (plano de novembro e alocação), status executivo da JYNX de 06/11, plano de 26/10 e Esteira JYNX (10/11).
**Contrato:** TOTVS LE · Business Agility (PSA) · coordenação do Emerson Natali.
**Agenda formalizada em 09/11:** Gabriel seg/ter (integral) e sex de manhã; Otávio qua/qui (integral) e sex à tarde.

> ⚠️ As estimativas de horas são uma **prévia da JYNX** e precisam ser validadas com o Otávio e o Gabriel antes de virarem compromisso. O consumo até 10/11 foi calculado pela agenda e precisa ser conferido no PSA.

---

## 1. Mensagens-chave para a reunião
1. **Movimentação em 13/11 não é viável.** O item da rescisão na troca de filial (#2 do backlog, "Não iniciado" em 09/11) sozinho é estimado em 24h. Proposta: desenvolvimento concluído em **19/11** com um 3º recurso pontual (16h), homologação pela GOL de 23 a 27/11 e produção **junto com a Abertura de Vagas em 30/11**, se a GOL validar a tempo.
2. **Desligamento em 12/11 é viável no limite.** São 7 itens de estabilidade (todos "Não iniciado" em 09/11), estimados em 14h, dentro das 16h do Otávio em 11 e 12/11. O fluxo completo vai para validação em 13/11.
3. **As 168h de novembro não cabem na agenda.** Com os feriados de 02/11 e 20/11, a agenda formalizada rende **152h**. A diferença de **16h** pode ser usada no 3º recurso da Movimentação (rescisão + testes integrados no RM).
4. **A demanda passa da capacidade.** O trabalho restante soma cerca de **149h**, para **120h** disponíveis de 11 a 30/11. Seguindo a diretriz do Emerson ("homologar os processos já disponíveis e deixar as melhorias para depois"), **29h ficam para dezembro**.
5. **O que precisamos da GOL e da TOTVS:** validação das homologações, retorno ao relatório do incidente, solução do limite de 2 acessos no RM e do erro no Fluig Identity, e definição sobre o Reembolso de Visto (ver seção 6).

---

## 2. Status atualizado por projeto
| Projeto | Situação | Pendência | Resp. | Prazo |
|---|---|---|---|---|
| **Movimentação** | 🟡 Em andamento | Rescisão na troca de filial (salário, cargo, seção e filial); confirmar a origem da 3ª regra; erro de acesso no Fluig Identity (chamado na TOTVS) | Otávio | 13/11 → **proposta 19/11 (dev) / 30/11 (produção)** |
| **Abertura de Vagas** | 🟢 Concluído, em homologação | Validação pela GOL; vai para produção junto com a Movimentação; teste ponta a ponta da pré-admissão (Digit) | Otávio | Junto com a Movimentação |
| **Desligamento / Pedido de Demissão** | 🟡 Em andamento | 7 itens de estabilidade; retorno da Carolina e da Adriana sobre separar as planilhas; depois o fluxo do colaborador | Otávio | 12/11 |
| **Alteração de Seção** | 🟢 Concluído, em homologação | Ajustes reportados por Henrique e Karol | Otávio → Gabriel | Novembro |
| **2ª Via de Crachá** | 🟢 Concluído, em homologação | Ajuste no formato do Excel exportado | Otávio → Gabriel | Novembro |
| **Reembolso CMA** | 🔴 Atrasado (prazo 23/10) | Gerar a planilha de importação no RM | Gabriel | **Proposta 17/11** |
| **Medida Disciplinar** | 🟡 Em finalização | Regra de classificação, tela de consulta, integração com o RM | Gabriel | Parte em nov; conclusão em dez |
| **Vale Transporte** | 🟡 Em produção, com ajustes | 3 ajustes (coluna no relatório, mensagem de cancelamento, tarifa ausente) | Gabriel | Novembro |
| **Alteração Cadastral / incidente** | 🟡 Em produção | Retorno da Karol ao relatório de 05/11; revisão dos datasets que manipulam o XML completo | Gabriel | 17/11 (revisão) |
| **Carta de Oposição** | 🟡 Em produção | Divulgação aos colaboradores depende da TOTVS e da GOL/Identity; GED tratado pela Digte | GOL / TOTVS | — |
| **Gestão de Dependentes** | 🟡 Em homologação | Validação do ajuste do nome; duplicidade no código da solicitação | GOL / Gabriel | Dezembro |
| **Melhorias da Atualização Cadastral** | 🟢 Em produção | Nova demanda: aprovação na alteração de estado civil | Gabriel | Dezembro (melhoria) |
| **Reembolso de Visto** | ⚪ Não iniciado | Aguarda definições da GOL (mudanças internas) | GOL | A definir |

---

## 3. Capacidade de novembro (168h)
| | Horas |
|---|---|
| Alocação contratada no mês | **168h** |
| Agenda formalizada (19 dias úteis × 8h, 1 FTE dividido entre Gabriel e Otávio) | 152h |
| Diferença a alocar (proposta: 3º recurso na Movimentação, 16 a 19/11) | 16h |
| Consumido de 03 a 10/11 (pela agenda; **conferir no PSA**) | 48h (Gabriel 28h · Otávio 20h) |
| **Disponível de 11 a 30/11** | **120h** (Otávio 56h · Gabriel 48h · 3º recurso 16h) |

---

## 4. Estimativa — projetos de remuneração (Movimentação + Abertura de Vagas)
| # | Atividade | Estimativa | Observação |
|---|---|---|---|
| M1 | Rescisão na troca de filial: atualização de salário, cargo, seção e filial com rescisão no RM (dataset e script RM, ajustes no fluxo) | 24h | Item mais complexo; o fluxo já foi estruturado para o Gabriel continuar |
| M2 | Confirmar a origem e implementar a 3ª regra (salário + cargo + seção) | 4h | Hoje está como "[CONFIRMAR ORIGEM]" |
| M3 | Testes integrados ponta a ponta com o RM | 8h | Depende de janela no RM (limite de 2 acessos) |
| M4 | Suporte à homologação da GOL e correções | 10h | 23 a 27/11 |
| M5 | Deploy em produção + operação assistida | 6h | 4h em 30/11 + 2h em dezembro |
| V1 | Abertura de Vagas: suporte à homologação e ajustes | 6h | Desenvolvimento 100% concluído |
| V2 | Teste ponta a ponta da pré-admissão (Digit) | 8h | Dezembro; confirmar se está no escopo e a agenda com o Luiz |
| V3 | Deploy conjunto com a Movimentação | 2h | 30/11 |
| | **Total remuneração** | **68h** (faixa de 55h a 82h, ±20%) | **58h em novembro + 10h em dezembro** |

Fora da estimativa: alocação do Otávio no Fluig Identity (chamado na TOTVS) e tempo parado por bloqueio do RM.

---

## 5. Planejamento de execução — 11 a 30/11 (120h)
| Semana | Otávio | Gabriel | 3º recurso | Total |
|---|---|---|---|---|
| **11–13/11** | Desligamento, estabilidade (14h) · Movimentação 3ª regra (4h) · início da rescisão (2h) = **20h** | Reembolso CMA, planilha RM (4h) = **4h** | — | 24h |
| **16–19/11** (20/11 é feriado) | Movimentação, rescisão (14h) · Desligamento, validação do fluxo (2h) = **16h** | Reembolso CMA, conclusão (6h) · revisão dos datasets XML (8h) · VT (2h) = **16h** | Movimentação, rescisão (8h) · testes integrados RM (8h) = **16h** | 48h |
| **23–27/11** | Movimentação, homologação e correções (10h) · Abertura de Vagas, homologação (6h) · Desligamento, fluxo do colaborador (4h) = **20h** | Alteração de Seção, ajustes (6h) · 2ª Via de Crachá, Excel (3h) · VT, conclusão (4h) · Medida Disciplinar (7h) = **20h** | — | 40h |
| **30/11** | — | Deploy Movimentação + Abertura de Vagas (6h) · status/backlog (2h) = **8h** | — | 8h |
| **Total** | **56h** | **48h** | **16h** | **120h** |

**Marcos propostos**
- 12/11: Desligamento, itens de estabilidade entregues
- 13/11: Desligamento, fluxo completo liberado para validação
- 17/11: Reembolso CMA entregue
- 19/11: Movimentação, desenvolvimento concluído (com rescisão)
- 23 a 27/11: homologação da Movimentação e da Abertura de Vagas pela GOL
- 30/11: Movimentação + Abertura de Vagas em produção (se a GOL validar até 27/11)

**Para dezembro (29h):** operação assistida da Movimentação (2h), teste da pré-admissão Digit (8h), conclusão da Medida Disciplinar (9h), aprovação de estado civil (6h, melhoria), duplicidade do código em Dependentes (4h).

---

## 6. Pedidos à GOL e à TOTVS
| # | Pedido | Para quem | Até |
|---|---|---|---|
| 1 | Aprovar a nova data da Movimentação (19/11 dev / 30/11 produção) e o uso das 16h no 3º recurso | Emerson | 11/11 |
| 2 | Validar em homologação: Abertura de Vagas, Alteração de Seção, 2ª Via de Crachá e Gestão de Dependentes | GOL (Flávia, Karol) | 20/11 |
| 3 | Reservar janela para homologação da Movimentação de 23 a 27/11 | GOL | 19/11 |
| 4 | Retorno ao relatório do incidente de alteração salarial (05/11) e aceite de que o GED é tratado pela Digte | GOL (Karol) | 14/11 |
| 5 | Retorno da Carolina e da Adriana sobre separar as planilhas de Desligamento e Pedido de Demissão | GOL | 12/11 |
| 6 | Ampliar o limite de 2 acessos simultâneos no RM ou reservar janelas para os testes de 16 a 19/11 | Emerson / TI GOL | 14/11 |
| 7 | Andamento do chamado do erro de acesso no Fluig Identity | Emerson / TOTVS | 13/11 |
| 8 | Definir a data de início do Reembolso de Visto (o escopo de 246h é compartilhado com o CMA) | GOL | 27/11 |
| 9 | Confirmar que as melhorias novas (estado civil e outras) entram como backlog de dezembro, conforme a diretriz de 26/10 | Emerson | 11/11 |

---

## 7. Pontos de atenção
- **O RM com 2 acessos simultâneos** continua bloqueando desenvolvimento e homologação, principalmente CMA e Movimentação.
- **A Abertura de Vagas depende da Movimentação:** qualquer desvio em uma afeta a outra.
- **Itens em produção seguem gerando ajustes** (VT, Dependentes, Atualização Cadastral). O que for novo entra no BACKLOG-Consolidado com prioridade e prazo, para proteger as 168h.
- **Passagem de Otávio para Gabriel:** Alteração de Seção e 2ª Via de Crachá passam para o Gabriel na semana de 23/11. Combinar a passagem com o Otávio.
- **A atualização das atividades do Gabriel** prometida pelo Emerson para 10/11 não foi encontrada no e-mail.
