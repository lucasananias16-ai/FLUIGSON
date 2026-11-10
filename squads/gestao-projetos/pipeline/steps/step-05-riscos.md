---
execution: inline
agent: rui-risco
inputFile: squads/gestao-projetos/output/snapshot-confirmado.md
outputFile: squads/gestao-projetos/output/riscos.md
---

# Step 05: Riscos e Pendências

### Regra de aplicabilidade (executar primeiro)
Leia `squads/gestao-projetos/output/briefing.md`. Se a entrega escolhida **não** for **plano**, **status** ou **riscos** (ou seja, se a entrega for **ata**), grave no outputFile somente:
```
# Não se aplica — entrega escolhida: {entrega}
```
e encerre o step sem aplicar as Veto Conditions abaixo.

## Context Loading

Load these files before executing:
- `squads/gestao-projetos/output/briefing.md` — entrega escolhida
- `squads/gestao-projetos/output/snapshot-confirmado.md` — fatos confirmados
- `squads/gestao-projetos/output/plano-projeto.md` — plano (quando a entrega é plano)
- `squads/gestao-projetos/output/revisao.md` — feedback do revisor, se houver
- `projetos/{slug}/` — registro de riscos anterior (riscos-*.md ou seção de riscos do último status)
- `squads/gestao-projetos/pipeline/data/domain-framework.md` — matriz de risco

## Instructions

### Process
1. Se houver `revisao.md` REPROVADO, corrigir os bloqueantes que tocam riscos.
2. Partir do registro anterior: atualizar P, I e status; indicar tendência (↑ ↓ =).
3. Identificar novos riscos e oportunidades a partir dos fatos; escrever causa → evento → efeito.
4. Separar problemas/pendências já ocorridos.
5. Calcular severidade (P × I), ordenar, e definir resposta, gatilho, dono e prazo para alto/crítico.
6. Escrever "Atenção do patrocinador" (máx. 3) e listar encerrados nesta revisão.

## Output Format

```markdown
# Riscos e Pendências — {Projeto} — {AAAA-MM-DD}
## Atenção do patrocinador
## Riscos
| ID | Descrição (causa → evento → efeito) | P | I | Sev. | Resposta | Gatilho | Dono | Prazo | Status |
## Problemas e pendências
| ID | Descrição | Desde | Dono | Prazo | Status |
## Encerrados nesta revisão
```

## Output Example

```markdown
# Riscos e Pendências — Implantação Fluig RH — 2026-11-10
## Atenção do patrocinador
1. R03 (crítico, 20): go-live inviável sem homologação da folha até 2026-11-12.
## Riscos
| ID | Descrição | P | I | Sev. | Resposta | Gatilho | Dono | Prazo | Status |
|---|---|---|---|---|---|---|---|---|---|
| R03 | Devido à fila da TI, a homologação da folha pode não sair, atrasando integração e go-live | 4 | 5 | 20 | Mitigar: escalar ao CIO; testes com mock | Sem acesso em 2026-11-12 | Júlio Andrade | 2026-11-12 | Aberto ↑ |
| R01 | Devido a férias de dezembro, usuários-chave podem faltar ao treinamento, reduzindo adesão | 3 | 3 | 9 | Mitigar: gravar treinamento | Presença < 70% | Carla Souza | 2026-11-28 | Aberto = |
| R05 | Oportunidade: reuso do formulário de admissão em transferências | 3 | 2 | 6 | Explorar | — | Bianca Reis | 2026-12-05 | Novo |
## Problemas e pendências
| ID | Descrição | Desde | Dono | Prazo | Status |
|---|---|---|---|---|---|
| P02 | Sem acesso à homologação da folha | 2026-11-04 | Júlio Andrade | 2026-11-12 | Aberto |
## Encerrados nesta revisão
- R02 — Aprovação jurídica do formulário: encerrado 2026-11-06 (aprovado).
```

## Veto Conditions

Reject and redo if ANY of these are true:
1. Severidade diferente de P × I em qualquer linha.
2. Risco alto ou crítico sem resposta, dono ou prazo.
3. Evento já ocorrido listado como risco.

## Quality Criteria

- [ ] Descrições no formato causa → evento → efeito.
- [ ] Tabela ordenada por severidade.
- [ ] Encerrados preservados com data e motivo.
