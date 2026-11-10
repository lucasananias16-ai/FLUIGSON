---
execution: subagent
agent: caio-coleta
inputFile: squads/gestao-projetos/output/briefing.md
outputFile: squads/gestao-projetos/output/snapshot.md
model_tier: powerful
---

# Step 02: Coleta de Dados

## Context Loading

Load these files before executing:
- `squads/gestao-projetos/output/briefing.md` — projeto, entrega, fontes autorizadas, período, anotações
- `squads/gestao-projetos/pipeline/data/fontes-de-dados.md` — como acessar cada fonte e regras de coleta
- `squads/gestao-projetos/pipeline/data/domain-framework.md` — regra de slug e o que cada entrega precisa
- `squads/gestao-projetos/agents/caio-coleta/tasks/coletar-dados.md` — processo detalhado e formato
- `projetos/{slug}/memoria.md` e a entrega mais recente do projeto — se existirem

## Instructions

### Process
1. Executar a task `coletar-dados` do Caio Coleta.
2. Consultar **somente** as fontes do briefing; usar as ferramentas de conector disponíveis na sessão (Google Sheets/Drive/Docs/Calendar, Gmail, LetsBot, Artifact). Se uma ferramenta não existir, registrar "indisponível".
3. Fluig: usar apenas se a variável `FLUIG_URL` existir; caso contrário, "Fluig não configurado".
4. Focar nos fatos que a entrega escolhida precisa (ver tabela do framework).
5. Gravar o snapshot com fontes, fatos, conflitos e lacunas.

## Output Format

```markdown
# Snapshot — {Projeto} — {AAAA-MM-DD}
**Entrega:** {entrega} · **Slug:** {slug} · **Período:** {de} a {até}
## Fontes consultadas
| Fonte | Status | Observação |
## Fatos
### Marcos e datas
### Tarefas e responsáveis
### Avanço
### Riscos e problemas citados
### Decisões e pendências
### Pessoas envolvidas
## Conflitos
## Lacunas a confirmar
```

## Output Example

```markdown
# Snapshot — Implantação Fluig RH — 2026-11-10
**Entrega:** status · **Slug:** implantacao-fluig-rh · **Período:** 2026-11-03 a 2026-11-10
## Fontes consultadas
| Fonte | Status | Observação |
|---|---|---|
| Google Sheets | ok | "Cronograma Fluig RH" |
| Gmail | ok | 6 threads |
| WhatsApp | ok | 42 mensagens no grupo |
| Repositório | ok | status-2026-11-03.md, memoria.md |
## Fatos
### Marcos e datas
- M2 Formulários: concluído 2026-11-06 (base 2026-11-07) [Sheets: Tarefas!E8]
- M3 Integração folha: previsão 2026-11-21 (base 2026-11-11) [Sheets: Tarefas!E12]
### Tarefas e responsáveis
- Testes de integração — Bianca Reis [Sheets: Tarefas!C14]
### Avanço
- 23/50 dias-pessoa = 46% [Sheets: Resumo!B3]
### Riscos e problemas citados
- Sem acesso à homologação da folha desde 2026-11-04 [WhatsApp 2026-11-04 · Júlio Andrade]
### Decisões e pendências
- Status anterior pediu decisão sobre treinamento gravado — sem resposta [status-2026-11-03.md]
### Pessoas envolvidas
- Marina Lopes (patrocinadora), Júlio Andrade (TI), Bianca Reis (Dev Fluig), Carla Souza (RH)
## Conflitos
- Go-live: 2026-12-01 [Sheets] vs 2026-12-12 [Gmail 2026-11-08 · Marina Lopes]
## Lacunas a confirmar
- Custo realizado (nenhuma fonte)
```

## Veto Conditions

Reject and redo if ANY of these are true:
1. Algum fato sem fonte entre colchetes.
2. Consulta a fonte não autorizada, ou qualquer envio/escrita em sistema externo.
3. Credenciais ou dados pessoais sensíveis no arquivo.

## Quality Criteria

- [ ] Todas as fontes do briefing aparecem com status.
- [ ] Conflitos com os dois valores e as duas fontes.
- [ ] Lacunas relevantes para a entrega listadas.
