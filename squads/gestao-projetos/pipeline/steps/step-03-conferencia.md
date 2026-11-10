---
type: checkpoint
inputFile: squads/gestao-projetos/output/snapshot.md
outputFile: squads/gestao-projetos/output/snapshot-confirmado.md
---

# Step 03: Conferência dos Dados

## Para o Pipeline Runner

1. Mostre ao usuário um resumo curto do `snapshot.md`: fontes (ok/indisponível), 5–8 fatos principais, **todos os conflitos** e **todas as lacunas**.
2. Pergunte, uma coisa por vez:
   - Para cada conflito: "Qual valor vale?" (liste os dois valores com as fontes, mais "outro").
   - Para as lacunas: "Sabe algum desses dados? Pode responder só os que souber; o resto fica 'a confirmar'."
   - Por fim: "Algo errado ou faltando no resumo?"
3. Grave em `outputFile` o snapshot completo com as correções aplicadas: conflitos resolvidos (marcar `[confirmado pelo usuário]`), lacunas preenchidas ou mantidas como "a confirmar".

## Output Format

Mesmo formato do snapshot, com a seção extra:
```markdown
## Confirmações do usuário ({AAAA-MM-DD})
- {item}: {valor} [confirmado pelo usuário]
```

## Output Example

```markdown
## Confirmações do usuário (2026-11-10)
- Go-live vigente: 2026-12-12 [confirmado pelo usuário] (Sheets ainda desatualizado)
- Custo realizado: a confirmar
```

## Veto Conditions

1. Conflito sem resolução e sem marcação "a confirmar".
