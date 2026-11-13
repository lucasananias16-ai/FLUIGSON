# Memória do Projeto — Tatu Marchesan · Fluig

## Estado atual
- **Escopo visível no Fluig:** processo `solicitacaoDeCompra` (versão 22) integrado ao Protheus (gerar, liberar, atualizar e reprovar SC).
- **Servidor:** `https://marchesanimplementos203231.fluig.cloudtotvs.com.br` (11 usuários).
- **Riscos abertos:** R1 (integração com o ERP, exposição 25), R2 (projeto parado há 4 semanas), R3 (aprovações sem SLA).
- **Ações abertas:** diagnosticar a falha de integração, confirmar se as solicitações são reais ou testes, configurar SLA.

## Pessoas (Fluig)
- Marchesan: Willian Kavahara, Vagner Gaspar, Marcos Leite, Fabiano Vidoto, Helio Zeferino, Héber Silva, Paulo Ferreira, Andressa Griscio
- Jynx/TOTVS: Gabriel Izidoro, Otavio Coelho

## Como coletar (notas técnicas)
- A API REST (`/process-management`) recusa o login do usuário de consultoria. O SOAP funciona (`ECMDatasetService`, `ECMDashBoardService`).
- O `colleagueId` do Gabriel é `66b2c396421d4baa82f31e6a09d9be1d`, não o e-mail. Por isso a central de tarefas por e-mail volta vazia.
- Datasets usados: `workflowProcess` (active/status), `processHistory` (active=true → `stateSequence`), `processTask` (active=true → responsável), `processState` (nomes das atividades), `colleague`.

## Histórico
- 2026-11-13 · Status + riscos · 🔴 · 43 solicitações em andamento; 19 em falha de integração com o ERP; nenhuma movimentação desde 16/10.
