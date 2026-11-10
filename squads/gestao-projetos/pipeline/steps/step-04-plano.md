---
execution: inline
agent: paula-planejamento
inputFile: squads/gestao-projetos/output/snapshot-confirmado.md
outputFile: squads/gestao-projetos/output/plano-projeto.md
---

# Step 04: Plano do Projeto

### Regra de aplicabilidade (executar primeiro)
Leia `squads/gestao-projetos/output/briefing.md`. Se a entrega escolhida **não** for **plano**, grave no outputFile somente:
```
# Não se aplica — entrega escolhida: {entrega}
```
e encerre o step sem aplicar as Veto Conditions abaixo.

## Context Loading

Load these files before executing:
- `squads/gestao-projetos/output/briefing.md` — entrega e anotações do usuário
- `squads/gestao-projetos/output/snapshot-confirmado.md` — fatos confirmados
- `squads/gestao-projetos/output/revisao.md` — feedback do revisor, se este for um retorno via on_reject
- `squads/gestao-projetos/pipeline/data/domain-framework.md` — marcos, slug, regras
- `squads/gestao-projetos/pipeline/data/quality-criteria.md` — critérios do plano
- `squads/gestao-projetos/pipeline/data/anti-patterns.md` — o que evitar

## Instructions

### Process
1. Se houver `revisao.md` REPROVADO, corrigir primeiro cada bloqueante apontado.
2. Se faltar algo que muda escopo ou go-live, fazer até 3 perguntas objetivas ao usuário; o resto vira premissa.
3. Redigir objetivo, critérios de sucesso, escopo dentro/fora, premissas e restrições.
4. Montar EAP (até 3 níveis) com responsável por pacote.
5. Montar cronograma com dependências, caminho crítico, buffer antes do go-live e ≥ 3 marcos com critério de aceite.
6. Montar RACI (um A por entrega) e listar riscos iniciais em uma linha cada.
7. Se o caminho crítico estourar a data-alvo, abrir o documento com o alerta de inviabilidade e 2 alternativas.

## Output Format

```markdown
# Plano do Projeto — {Projeto} — v{n} ({AAAA-MM-DD})
## Objetivo
## Critérios de sucesso
## Escopo
**Dentro:** … **Fora:** …
## EAP
| ID | Entrega / pacote | Responsável |
## Cronograma e marcos
| Marco | Data | Depende de | Critério de aceite |
## RACI
| Entrega | R | A | C | I |
## Premissas e restrições
## Riscos iniciais (detalhados pelo Rui)
```

## Output Example

```markdown
# Plano do Projeto — Fluig: Aprovação de Compras — v1 (2026-11-10)
## Objetivo
Digitalizar a aprovação de compras até R$ 50 mil no Fluig até 2027-02-27.
## Critérios de sucesso
1. 100% das solicitações pelo Fluig a partir de 2027-03-01.
2. Tempo médio de aprovação ≤ 2 dias úteis (hoje 6).
## Escopo
**Dentro:** formulário, fluxo com alçadas, integração com ERP, painel.
**Fora:** compras acima de R$ 50 mil, contratos de serviço, app mobile.
## EAP
| ID | Entrega / pacote | Responsável |
|---|---|---|
| 1 | Desenho TO-BE | Lucas (PMO) |
| 2 | Formulário e fluxo no Fluig | Bianca Reis |
| 3 | Integração com ERP | Júlio Andrade |
| 4 | Homologação | Carla Souza |
## Cronograma e marcos
| Marco | Data | Depende de | Critério de aceite |
|---|---|---|---|
| M1 TO-BE aprovado | 2026-11-27 | — | Assinado pela diretoria |
| M2 Fluxo em homologação | 2027-01-15 | M1 | Cenários felizes rodando |
| M3 Go-live | 2027-02-26 | M2 + buffer 5 d.u. | 1ª compra real aprovada |
## RACI
| Entrega | R | A | C | I |
|---|---|---|---|---|
| TO-BE | Lucas | Diretora Financeira | Compras | TI |
## Premissas e restrições
- Premissa: homologação do ERP disponível até 2026-12-15.
## Riscos iniciais (detalhados pelo Rui)
- Congelamento de mudanças no fim de ano pode bloquear deploy.
```

## Veto Conditions

Reject and redo if ANY of these are true:
1. Escopo sem "Fora".
2. Menos de 3 marcos, ou marco sem data/critério de aceite.
3. Responsável inventado (não está no snapshot nem marcado "a definir").

## Quality Criteria

- [ ] EAP cobre 100% do escopo.
- [ ] Caminho crítico e buffer visíveis.
- [ ] RACI com um único A por entrega.
