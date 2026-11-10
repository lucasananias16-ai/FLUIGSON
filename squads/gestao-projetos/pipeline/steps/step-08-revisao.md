---
execution: inline
agent: vitor-validacao
inputFile: squads/gestao-projetos/output/snapshot-confirmado.md
outputFile: squads/gestao-projetos/output/revisao.md
---

# Step 08: Revisão de Qualidade

## Context Loading

Load these files before executing:
- `squads/gestao-projetos/output/briefing.md` — entrega escolhida
- `squads/gestao-projetos/output/snapshot-confirmado.md` — fonte da verdade para conferência
- Entrega aplicável: `output/plano-projeto.md` + `output/riscos.md` (plano), `output/status-report.md` + `output/riscos.md` (status), `output/riscos.md` (riscos), `output/ata.md` (ata)
- `squads/gestao-projetos/pipeline/data/quality-criteria.md` — critérios
- `squads/gestao-projetos/pipeline/data/anti-patterns.md` — anti-padrões
- `squads/gestao-projetos/pipeline/data/domain-framework.md` — semáforo e matriz de risco

## Instructions

### Process
1. Identificar a entrega e ignorar arquivos com "# Não se aplica".
2. Conferir cada número, data e nome da entrega com o snapshot confirmado.
3. Aplicar critérios gerais e específicos; marcar ✅/❌.
4. Checar coerência entre arquivos (status × riscos; plano × riscos iniciais).
5. Classificar cada ❌ como bloqueante ou sugestão; parecer REPROVADO se houver ≥ 1 bloqueante.
6. Indicar o ciclo (n/3). No 3º REPROVADO, não voltar: apresentar os bloqueantes ao usuário no step 09 para decisão manual.

## Output Format

```markdown
# Revisão — {Entrega} — {Projeto} — {AAAA-MM-DD}
**Parecer:** {✅ APROVADO | ❌ REPROVADO ({n} bloqueantes)} · Ciclo {n}/3
## Bloqueantes
1. ❌ {problema}. *Local:* {seção}. *Evidência:* {snapshot}. *Correção:* {o que fazer}.
## Sugestões
## Conferido ✅
```

## Output Example

```markdown
# Revisão — Status Report — Implantação Fluig RH — 2026-11-10
**Parecer:** ❌ REPROVADO (2 bloqueantes) · Ciclo 1/3
## Bloqueantes
1. ❌ Semáforo 🟢 com M3 em +8 d.u. e R03 crítico. *Local:* topo. *Evidência:* Sheets Tarefas!E12; riscos.md R03. *Correção:* 🟡 com justificativa.
2. ❌ Ação "testar integração" sem dono. *Local:* Próximos passos. *Evidência:* Sheets Tarefas!C14 (Bianca Reis). *Correção:* atribuir a Bianca Reis.
## Sugestões
- Resumo executivo com 4 linhas; reduzir para 3.
## Conferido ✅
- 46% concluído confere com Resumo!B3.
- Top 3 riscos coerentes com riscos.md.
- Datas dos marcos conferem com o snapshot.
```

## Veto Conditions

Reject and redo if ANY of these are true:
1. Parecer ausente ou ambíguo.
2. Bloqueante sem local ou sem correção sugerida.

## Quality Criteria

- [ ] Conferência contra o snapshot registrada em "Conferido".
- [ ] Ciclo indicado.
- [ ] Nenhuma reprovação apenas por estilo.
