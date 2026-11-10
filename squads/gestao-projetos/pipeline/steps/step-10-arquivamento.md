---
execution: subagent
agent: caio-coleta
inputFile: squads/gestao-projetos/output/aprovacao.md
outputFile: squads/gestao-projetos/output/arquivamento.md
model_tier: fast
---

# Step 10: Arquivamento e Memória

## Context Loading

Load these files before executing:
- `squads/gestao-projetos/output/aprovacao.md` — decisão e follow-ups autorizados
- `squads/gestao-projetos/output/briefing.md` — projeto e entrega
- `squads/gestao-projetos/output/snapshot-confirmado.md` — slug e fatos-chave
- Entrega aprovada (`plano-projeto.md`, `riscos.md`, `status-report.md` ou `ata.md`)
- `squads/gestao-projetos/agents/caio-coleta/tasks/arquivar-entrega.md` — processo detalhado
- `projetos/{slug}/memoria.md` — se existir

## Instructions

### Process
1. Executar a task `arquivar-entrega` do Caio Coleta.
2. Se a decisão não for "aprovado", registrar "Não arquivado" e encerrar.
3. Gravar a entrega em `projetos/{slug}/{tipo}-{AAAA-MM-DD}.md` sem sobrescrever versões existentes (sufixo -2, -3).
4. Criar/atualizar `projetos/{slug}/memoria.md` com o formato abaixo, preservando o histórico.
5. Preparar follow-ups autorizados **como rascunho**; enviar somente com "Enviar agora: sim".

### Formato de `projetos/{slug}/memoria.md`
```markdown
# Memória — {Projeto}
## Estado atual (atualizado em {AAAA-MM-DD})
- Semáforo: … · Próximo marco: … · Go-live: …
- Riscos abertos (alto/crítico): …
- Ações abertas: …
## Pessoas
## Histórico
- {AAAA-MM-DD} · {entrega} · {1–3 fatos-chave}
```

## Output Format

```markdown
# Arquivamento — {Projeto} — {AAAA-MM-DD}
## Arquivos gravados
## Memória atualizada
## Follow-ups
| Canal | Destinatário | Status |
```

## Output Example

```markdown
# Arquivamento — Implantação Fluig RH — 2026-11-10
## Arquivos gravados
- projetos/implantacao-fluig-rh/status-2026-11-10.md
- projetos/implantacao-fluig-rh/followups-2026-11-10.md
## Memória atualizada
- projetos/implantacao-fluig-rh/memoria.md
  - Estado atual: 🟡 · próximo marco M3 2026-11-21 · go-live 2026-12-12
  - Histórico: "2026-11-10 · status 🟡 · integração +8 d.u.; decisão de go-live pedida"
## Follow-ups
| Canal | Destinatário | Status |
|---|---|---|
| Gmail | Marina Lopes | rascunho criado |
| WhatsApp | Grupo "Projeto Fluig RH" | texto salvo |
```

## Veto Conditions

Reject and redo if ANY of these are true:
1. Mensagem enviada sem "Enviar agora: sim".
2. Entrega anterior sobrescrita ou histórico da memória apagado.

## Quality Criteria

- [ ] Nome do arquivo no padrão `{tipo}-{AAAA-MM-DD}.md`.
- [ ] Estado atual da memória coerente com a entrega aprovada.
- [ ] Lista de follow-ups igual ao autorizado.
