---
execution: inline
agent: sergio-status
inputFile: squads/gestao-projetos/output/riscos.md
outputFile: squads/gestao-projetos/output/status-report.md
---

# Step 06: Status Report

### Regra de aplicabilidade (executar primeiro)
Leia `squads/gestao-projetos/output/briefing.md`. Se a entrega escolhida **não** for **status**, grave no outputFile somente:
```
# Não se aplica — entrega escolhida: {entrega}
```
e encerre o step sem aplicar as Veto Conditions abaixo.

## Context Loading

Load these files before executing:
- `squads/gestao-projetos/output/briefing.md` — entrega e período
- `squads/gestao-projetos/output/snapshot-confirmado.md` — fatos confirmados
- `squads/gestao-projetos/output/riscos.md` — registro atualizado pelo Rui
- `squads/gestao-projetos/output/revisao.md` — feedback do revisor, se houver
- `projetos/{slug}/` — status anterior (para tendência)
- `squads/gestao-projetos/pipeline/data/domain-framework.md` — critérios do semáforo

## Instructions

### Process
1. Se houver `revisao.md` REPROVADO, corrigir primeiro os bloqueantes.
2. Calcular % concluído (preferir esforço) e declarar a base.
3. Calcular desvio de cada marco (previsão − linha de base, em d.u.).
4. Aplicar o semáforo do framework; em dúvida, escolher a cor pior e justificar. Sem dados suficientes → ⚪.
5. Escrever resumo executivo (≤ 3 linhas) e separar "Decisões pedidas".
6. Copiar o top 3 de riscos do `riscos.md` (sem alterar severidade) e listar próximos passos com dono/prazo.

## Output Format

```markdown
# Status Report — {Projeto} — {AAAA-MM-DD}
**Semáforo:** {cor} (era {cor anterior}) · **Concluído:** {n}% ({base}) · **Fase:** {fase}
**Justificativa:** {1 linha}
## Resumo executivo
## Decisões pedidas
| # | Decisão | Quem decide | Até |
## Entregas do período ({de} a {até})
## Marcos
| Marco | Linha de base | Previsão atual | Desvio |
## Top 3 riscos
## Próximos passos
| Ação | Dono | Prazo |
```

## Output Example

```markdown
# Status Report — Implantação Fluig RH — 2026-11-10
**Semáforo:** 🟡 Amarelo (era 🟢) · **Concluído:** 46% (esforço: 23/50 dias-pessoa) · **Fase:** Construção
**Justificativa:** M3 com desvio de 8 d.u. e R03 crítico com resposta em andamento.
## Resumo executivo
Formulários de admissão entregues um dia antes. Integração com a folha atrasada 8 d.u. por falta de acesso à homologação. Pedimos decisão sobre o go-live.
## Decisões pedidas
| # | Decisão | Quem decide | Até |
|---|---|---|---|
| 1 | Mover go-live para 2026-12-12 | Marina Lopes | 2026-11-14 |
## Entregas do período (2026-11-03 a 2026-11-10)
- ✅ M2 Formulários de admissão — 2026-11-06
## Marcos
| Marco | Linha de base | Previsão atual | Desvio |
|---|---|---|---|
| M3 Integração folha | 2026-11-11 | 2026-11-21 | +8 d.u. |
| M4 Go-live | 2026-12-01 | 2026-12-12 | +9 d.u. |
## Top 3 riscos
1. R03 (20) Homologação da folha — Júlio Andrade — 2026-11-12
2. R01 (9) Ausência no treinamento — Carla Souza — 2026-11-28
3. R05 (6, oportunidade) Reuso do formulário — Bianca Reis — 2026-12-05
## Próximos passos
| Ação | Dono | Prazo |
|---|---|---|
| Escalar acesso à homologação ao CIO | Lucas (PMO) | 2026-11-11 |
```

## Veto Conditions

Reject and redo if ANY of these are true:
1. Semáforo contrário aos critérios do framework.
2. % concluído sem base declarada.
3. Decisão pedida sem quem decide ou sem prazo.

## Quality Criteria

- [ ] Resumo executivo ≤ 3 linhas.
- [ ] Tendência em relação ao status anterior.
- [ ] Top 3 riscos coerentes com riscos.md.
