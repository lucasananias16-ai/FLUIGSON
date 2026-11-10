---
type: checkpoint
outputFile: squads/gestao-projetos/output/aprovacao.md
---

# Step 09: Aprovação Final

## Para o Pipeline Runner

1. Mostre ao usuário a entrega final completa (o arquivo aplicável) e o parecer do Vitor em uma linha (com sugestões não aplicadas, se houver). Se o revisor esgotou 3 ciclos, mostre os bloqueantes pendentes.
2. Pergunte: "Aprova esta versão?"
   1. Aprovar e arquivar
   2. Ajustar — diga o que mudar (volte ao especialista com o pedido e depois ao Vitor)
   3. Descartar esta execução
3. Se aprovado e houver destinatários ou follow-ups (ata, status com decisões pedidas), pergunte: "Quer que eu prepare follow-ups?"
   1. Rascunho no Gmail
   2. Texto pronto para WhatsApp (salvo no projeto)
   3. Os dois
   4. Nenhum
   Envio real só acontece se o usuário disser explicitamente **"enviar agora"**, indicando canal e destinatários.

## Output Format

```markdown
# Aprovação — {AAAA-MM-DD}
- **Decisão:** {aprovado | ajustar | descartado}
- **Ajustes pedidos:** {texto ou "nenhum"}
- **Follow-ups:** {gmail-rascunho | whatsapp-texto | ambos | nenhum}
- **Destinatários:** {nomes/e-mails/grupo ou "n/a"}
- **Enviar agora:** {sim — canal e destinatários | não}
```

## Output Example

```markdown
# Aprovação — 2026-11-10
- **Decisão:** aprovado
- **Ajustes pedidos:** nenhum
- **Follow-ups:** ambos
- **Destinatários:** Marina Lopes (e-mail); grupo "Projeto Fluig RH"
- **Enviar agora:** não
```

## Veto Conditions

1. "Enviar agora: sim" sem canal e destinatários explícitos do usuário.
