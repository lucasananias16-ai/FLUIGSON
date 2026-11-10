# Framework de Domínio — Gestão de Projetos

## Ciclo de uma execução
1. **Briefing** → projeto, entrega, fontes, período, anotações.
2. **Coleta** → resumo único do projeto (snapshot) com fonte de cada dado.
3. **Conferência** → usuário corrige o snapshot.
4. **Especialista** → produz a entrega escolhida.
5. **Revisão** → checagem objetiva; reprova volta ao especialista.
6. **Aprovação** → usuário aprova e decide follow-ups.
7. **Arquivamento** → `projetos/{slug}/` + memória.

## Quem trabalha em cada entrega
| Entrega escolhida | Paula (plano) | Rui (riscos) | Sergio (status) | Ana (ata) |
|---|---|---|---|---|
| Plano de projeto novo | ✅ | ✅ riscos iniciais | — | — |
| Status report | — | ✅ atualização | ✅ | — |
| Riscos e pendências | — | ✅ | — | — |
| Ata e follow-ups | — | — | — | ✅ |

"—" = o agente grava apenas `# Não se aplica` no arquivo de saída e passa a vez.

## Semáforo (status)
- 🟢 **Verde**: marcos no prazo (desvio ≤ 5 dias úteis), sem risco de severidade ≥ 15 aberto sem resposta.
- 🟡 **Amarelo**: algum marco com desvio de 6 a 15 dias úteis, ou risco alto com resposta em andamento.
- 🔴 **Vermelho**: marco do caminho crítico com desvio > 15 dias úteis, risco crítico materializado ou bloqueio sem dono.

## Matriz de risco
Severidade = Probabilidade (1–5) × Impacto (1–5).
- 1–6 baixo · 8–12 médio · 15–19 alto · 20–25 crítico.

## Slug do projeto
Minúsculas, sem acento, hífens: "Implantação Fluig RH" → `implantacao-fluig-rh`.
