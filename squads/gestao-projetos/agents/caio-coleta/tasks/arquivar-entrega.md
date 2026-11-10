---
task: "Arquivar Entrega e Atualizar Memória"
order: 2
input: |
  - aprovacao: decisão do usuário e follow-ups autorizados (output/aprovacao.md)
  - entrega: arquivo aprovado (plano-projeto.md, riscos.md, status-report.md ou ata.md)
  - revisao: parecer do revisor (output/revisao.md)
output: |
  - arquivo_final: projetos/{slug}/{tipo}-{AAAA-MM-DD}.md
  - memoria: projetos/{slug}/memoria.md atualizado
  - relatorio: output/arquivamento.md
---

# Arquivar Entrega e Atualizar Memória

Copia a entrega aprovada para a pasta versionada do projeto, registra o histórico em `memoria.md` e prepara os rascunhos de follow-up que o usuário autorizou.

## Process

1. Ler `output/aprovacao.md`. Se não estiver aprovado, gravar em `output/arquivamento.md` "Não arquivado — entrega não aprovada" e encerrar.
2. Identificar a(s) entrega(s) aplicável(is) (arquivo cujo conteúdo não é "# Não se aplica"). Para plano, arquivar também `riscos.md` como `riscos-{data}.md`.
3. Gravar `projetos/{slug}/{tipo}-{AAAA-MM-DD}.md` (tipo: plano, status, riscos, ata). Se já existir, sufixar `-2`, `-3`.
4. Atualizar `projetos/{slug}/memoria.md` (criar se não existir): acrescentar no topo do "Histórico" uma linha com data, entrega, semáforo (se houver) e 1–3 fatos-chave; atualizar "Estado atual" (marcos, riscos abertos, ações abertas).
5. Follow-ups: somente os autorizados no step 09 e somente como **rascunho** (Gmail `create_draft`; para WhatsApp, gravar o texto pronto em `projetos/{slug}/followups-{data}.md`). Envio real apenas se `aprovacao.md` disser explicitamente "enviar agora".
6. Gravar `output/arquivamento.md` com a lista de arquivos e rascunhos criados.

## Output Format

```markdown
# Arquivamento — {Projeto} — {AAAA-MM-DD}
## Arquivos gravados
## Memória atualizada
## Follow-ups
| Canal | Destinatário | Status (rascunho/enviado/não autorizado) |
```

## Output Example

> Use as quality reference, not as rigid template.

```markdown
# Arquivamento — Implantação Fluig RH — 2026-11-10
## Arquivos gravados
- projetos/implantacao-fluig-rh/status-2026-11-10.md
## Memória atualizada
- projetos/implantacao-fluig-rh/memoria.md
  - Histórico: "2026-11-10 · status 🟡 · integração folha +8 d.u.; pedido de novo go-live 2026-12-12"
  - Ações abertas: 4 (1 nova)
## Follow-ups
| Canal | Destinatário | Status |
|---|---|---|
| Gmail | Marina Lopes (patrocinadora) | rascunho criado |
| WhatsApp | Grupo "Projeto Fluig RH" | texto salvo em followups-2026-11-10.md |
| Gmail | Júlio Andrade | não autorizado |
```

## Quality Criteria

- [ ] Entrega arquivada com nome no padrão e sem sobrescrever versões anteriores.
- [ ] `memoria.md` preserva o histórico anterior.
- [ ] Follow-ups refletem exatamente o que foi autorizado.

## Veto Conditions

Reject and redo if ANY are true:
1. Alguma mensagem foi enviada sem "enviar agora" explícito em `aprovacao.md`.
2. Histórico anterior de `memoria.md` foi apagado ou uma entrega anterior foi sobrescrita.
