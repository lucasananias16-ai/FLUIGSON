---
task: "Coletar Dados do Projeto"
order: 1
input: |
  - briefing: projeto, entrega escolhida, fontes autorizadas, período e anotações (output/briefing.md)
output: |
  - snapshot: resumo consolidado com fatos, conflitos, lacunas e fontes (output/snapshot.md)
---

# Coletar Dados do Projeto

Reúne em um snapshot único os dados do projeto vindos das fontes autorizadas no briefing, com a origem de cada informação. Não interpreta nem julga o status — apenas consolida.

## Process

1. Ler `output/briefing.md`; definir o slug do projeto (regra em `domain-framework.md`).
2. Ler `projetos/{slug}/memoria.md` e a entrega mais recente do projeto, se existirem.
3. Para cada fonte marcada, consultar conforme `pipeline/data/fontes-de-dados.md`, limitado ao período do briefing. Se a ferramenta não existir ou falhar, registrar e seguir.
4. Extrair fatos relevantes para a entrega escolhida: marcos e datas, tarefas e responsáveis, % de avanço, riscos/problemas citados, decisões, pendências, participantes.
5. Comparar valores entre fontes; divergências vão para "Conflitos".
6. Listar o que a entrega precisa e nenhuma fonte trouxe em "Lacunas a confirmar".
7. Gravar `output/snapshot.md` no formato abaixo.

## Output Format

```markdown
# Snapshot — {Projeto} — {AAAA-MM-DD}
**Entrega:** {plano|status|riscos|ata} · **Slug:** {slug} · **Período:** {de} a {até}

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

> Use as quality reference, not as rigid template.

```markdown
# Snapshot — Implantação Fluig RH — 2026-11-10
**Entrega:** status · **Slug:** implantacao-fluig-rh · **Período:** 2026-11-03 a 2026-11-10

## Fontes consultadas
| Fonte | Status | Observação |
|---|---|---|
| Google Sheets | ok | "Cronograma Fluig RH", aba Tarefas |
| Gmail | ok | 6 threads com "Fluig RH" |
| Fluig | indisponível | FLUIG_URL não configurado |
| WhatsApp | ok | Grupo "Projeto Fluig RH", 42 mensagens |

## Fatos
### Marcos e datas
- M2 Formulários de admissão: concluído em 2026-11-06 (linha de base 2026-11-07) [Sheets: Tarefas!E8]
- M3 Integração com folha: previsto 2026-11-21, linha de base 2026-11-11 [Sheets: Tarefas!E12]
### Avanço
- 23 de 50 dias-pessoa concluídos = 46% [Sheets: Resumo!B3]
### Riscos e problemas citados
- Sem acesso à homologação da folha desde 2026-11-04 [WhatsApp 2026-11-04 · Júlio Andrade]

## Conflitos
- Go-live: 2026-12-01 [Sheets] vs 2026-12-12 [Gmail 2026-11-08, Marina Lopes]

## Lacunas a confirmar
- Custo realizado até a data (nenhuma fonte)
```

## Quality Criteria

- [ ] Todo fato com fonte entre colchetes.
- [ ] Todas as fontes do briefing aparecem na tabela de status.
- [ ] Conflitos mostram os dois valores e as duas fontes.

## Veto Conditions

Reject and redo if ANY are true:
1. Algum número, data ou nome aparece sem fonte.
2. Foi consultada uma fonte não autorizada no briefing, ou houve envio/escrita em sistema externo.
3. O arquivo contém credenciais ou dados pessoais sensíveis.
