# Pauta interna — Tatu Marchesan · Fluig (Lucas, Mayara, Gabriel)

**Quando:** no dia que a Mayara reservar para o Gabriel dedicar à Tatu (ação da daily de 12/11). **Duração sugerida:** 1h, no início do dia, para o resto do dia já render.
**Objetivo:** tirar do Gabriel o que só ele sabe, fechar decisões e sair com o dia dele planejado. O que depender da TOTVS vira pergunta que ele leva ao Pedro.
**Material de apoio (pasta `projetos/tatu-marchesan/`):** `diagnostico-falhas-2026-11-13.md`, `requisitos-atas-2026-11-13.md`, `analise-processos-dev-2026-11-13.md`, `fluig/specs/*.md`.

## 1. Compras: destravar a aprovação (20 min) 🔴
- **Contexto:** liberar ou reprovar a SC no Protheus falha com `Registro nao Localizado na Tabela - SCR` (SCs 000401 e 000403). Pela definição de 01/09, a aprovação é só no Fluig, então não há SCR. As 22 SCs em aprovação vão falhar do mesmo jeito.
- **Para o Gabriel responder:**
  - [ ] Já sabia do erro da SCR? Combinou algo com o Pedro sobre liberar direto (`C1_APROV` B → L)?
  - [ ] Por que o aprovador vai fixo como `000001`?
  - [ ] Fornecedor/loja (`C1_FORNECE`/`C1_LOJA`) e a validação da RIAI vencida: estão no `gerasc` (lado Protheus)? No Fluig não estão.
  - [ ] O erro genérico `Erro nao tratado na geracao da Solicitacao de Compra!` (15–28/09): causa conhecida?
  - [ ] Quais são os "erros em produção" citados em 04/11? O que falta para os testes integrados em produção (senha do ADM resolvida em 10/11)?
  - [ ] Solicitação de teste nº 63 (SC 000423) travada na atividade automática: reexecutar pela Central de Diagnósticos.
- **Decidir:** quem fala com o Pedro e até quando. O rascunho do e-mail ao Protheus já está no Gmail do Lucas.

## 2. Evento novo da Compra: erro no formulário (5 min)
- [ ] Revisar `fluig/workflow/scripts/solicitacaoDeCompra.beforeStateEntry.js` (copia o erro da integração para o formulário).
- [ ] O Gabriel publica pelo Studio no DEV e testa com uma falha forçada.

## 3. Reembolso e Manutenção: passagem do trabalho (20 min)
- **Situação no DEV:** só os formulários estão publicados (`teste1` = manutenção, `teste2` = reembolso), sem processo, sem datasets e sem registros. O código não está acessível com o usuário de consultoria.
- **Para o Gabriel:**
  - [ ] Onde está o projeto do Fluig Studio desses dois fluxos (repositório, máquina dele)? Subir para o repositório.
  - [ ] Ele tem as atas completas de 15 e 16/10 e o print do cálculo de distância do Paytrack?
  - [ ] O que já foi combinado com o Pedro sobre a API da Manutenção (regras de direcionamento, SS/OS)?
  - [ ] O termo de aceite MIT010 foi assinado?
- **Validar as specs v0.2:** `fluig/specs/SolicitacaoReembolso.md` e `fluig/specs/ChamadoManutencao.md`. Riscar as perguntas que o Gabriel souber responder; as demais vão para o cliente ou para o Pedro.

## 4. Divisão do trabalho e próximos passos (15 min)
- [ ] Definir o que o Gabriel faz no dia e o que fica comigo (Claude): specs, datasets, formulários, eventos, revisão de código, relatórios de status.
- [ ] Publicação: o Gabriel publica pelo Studio até a TOTVS liberar um usuário para a API do Fluig DEV (chamado em `fluig/chamado-totvs-acesso-api.md`; quem abre?).
- [ ] Agendar com o cliente a demonstração do Reembolso e da Manutenção (pendente desde 16/10).
- [ ] O Gabriel comunica formalmente ao cliente as entregas da Compra (ação da daily de 12/11).

## Perguntas para levar ao Pedro / TOTVS (consolidar no fim)
1. Liberação/reprovação da SC sem SCR: o endpoint libera direto?
2. `gerasc`: fornecedor/loja e RIAI estão implementados?
3. Manutenção: onde ficam as regras de direcionamento? Endpoints de usuário ativo, regras, bens, inclusão de SS e situação da SS/OS.
4. Reembolso: destino (Protheus/Glovia/folha) e endpoint do título, se for Protheus.

## Encaminhamentos (preencher na reunião)
| # | Ação | Responsável | Prazo |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
