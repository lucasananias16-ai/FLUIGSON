---
execution: inline
agent: ana-ata
inputFile: squads/gestao-projetos/output/snapshot-confirmado.md
outputFile: squads/gestao-projetos/output/ata.md
---

# Step 07: Ata e Follow-ups

### Regra de aplicabilidade (executar primeiro)
Leia `squads/gestao-projetos/output/briefing.md`. Se a entrega escolhida **não** for **ata**, grave no outputFile somente:
```
# Não se aplica — entrega escolhida: {entrega}
```
e encerre o step sem aplicar as Veto Conditions abaixo.

## Context Loading

Load these files before executing:
- `squads/gestao-projetos/output/briefing.md` — anotações da reunião coladas pelo usuário
- `squads/gestao-projetos/output/snapshot-confirmado.md` — mensagens, e-mails e eventos coletados
- `squads/gestao-projetos/output/revisao.md` — feedback do revisor, se houver
- `projetos/{slug}/` — ata anterior (para revisar ações abertas)
- `squads/gestao-projetos/pipeline/data/quality-criteria.md` — critérios da ata

## Instructions

### Process
1. Se houver `revisao.md` REPROVADO, corrigir primeiro os bloqueantes.
2. Registrar data, participantes, ausentes e pauta.
3. Extrair decisões (com quem decidiu) e ações explícitas e implícitas (verbo + dono + prazo).
4. Prazo não combinado → data proposta marcada "(proposto)"; dono incerto → "a confirmar".
5. Revisar ações abertas da ata anterior.
6. Redigir rascunhos de follow-up: e-mail (≤ 150 palavras) e WhatsApp (≤ 5 linhas). **Não enviar.**

## Output Format

```markdown
# Ata — {Projeto} — {tipo de reunião} — {AAAA-MM-DD}
**Participantes:** … **Ausentes:** …
## Pauta
## Decisões
## Ações
| # | Ação | Dono | Prazo |
## Ações da reunião anterior
## A confirmar
## Próxima reunião
## Follow-up — e-mail (rascunho)
## Follow-up — WhatsApp (rascunho)
```

## Output Example

```markdown
# Ata — Implantação Fluig RH — Reunião semanal — 2026-11-10
**Participantes:** Lucas (PMO), Marina Lopes, Júlio Andrade, Bianca Reis · **Ausentes:** Carla Souza
## Pauta
1. Integração com a folha 2. Go-live 3. Treinamento
## Decisões
- D1. Go-live movido para 2026-12-12 — Marina Lopes.
- D2. Férias sai da fase 1 — Marina Lopes.
## Ações
| # | Ação | Dono | Prazo |
|---|---|---|---|
| A1 | Liberar acesso à homologação da folha | Júlio Andrade | 2026-11-12 |
| A2 | Rodar testes de integração com mock | Bianca Reis | 2026-11-14 |
| A3 | Enviar agenda de treinamento | Carla Souza | 2026-11-17 (proposto) |
## Ações da reunião anterior
- A4 Aprovação jurídica do formulário — ✅ concluída 2026-11-06
## A confirmar
- A3: prazo não combinado; Carla ausente.
## Próxima reunião
2026-11-17, 10h.
## Follow-up — e-mail (rascunho)
**Assunto:** [Fluig RH] Decisões e ações — 2026-11-10
Go-live passa a 2026-12-12; férias vai para a fase 2. Ações: Júlio (homologação, 12/11), Bianca (testes, 14/11), Carla (agenda de treinamento, 17/11 a confirmar).
## Follow-up — WhatsApp (rascunho)
📌 Fluig RH 10/11: go-live → 12/12; férias → fase 2. Ações: Júlio 12/11, Bianca 14/11, Carla 17/11?
```

## Veto Conditions

Reject and redo if ANY of these are true:
1. Ação sem dono (ou com "todos") ou sem prazo/"proposto"/"a confirmar".
2. Decisão sem quem decidiu.
3. A ata é transcrição da conversa em vez de decisões e ações.

## Quality Criteria

- [ ] Participantes e pauta registrados.
- [ ] Ações numeradas e rastreáveis.
- [ ] Follow-ups curtos e marcados como rascunho.
