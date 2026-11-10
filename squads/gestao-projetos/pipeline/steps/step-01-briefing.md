---
type: checkpoint
outputFile: squads/gestao-projetos/output/briefing.md
---

# Step 01: Briefing da Execução

## Para o Pipeline Runner

Mostre o contexto da squad (Gestão de Projetos + nome da empresa de `company.md`, se existir) e colete as respostas abaixo, **uma pergunta por vez**, em linguagem natural. Se o usuário já trouxe alguma resposta na mensagem inicial, não pergunte de novo. Liste projetos existentes lendo as pastas de `projetos/`.

### 1. Projeto
"Qual projeto vamos trabalhar hoje?"
- Liste os projetos de `projetos/` (ex.: `1. Implantação Fluig RH`) e a opção **Novo projeto** (pedir o nome).

### 2. Entrega
"O que você precisa agora?"
1. **Plano de projeto novo** — escopo, EAP, cronograma, responsáveis, marcos e riscos iniciais
2. **Status report** — semáforo, % concluído, desvios, top riscos e decisões pedidas
3. **Riscos e pendências** — registro atualizado com severidade, dono e plano de ação
4. **Ata e follow-ups** — decisões e ações com dono e prazo, mais rascunhos de e-mail/WhatsApp

### 3. Fontes
"De onde eu busco as informações? Pode marcar várias."
1. O que você me mandar aqui no chat
2. Google Sheets — informe o link da planilha
3. Google Drive / Docs — informe pasta ou nome do documento
4. Gmail — busco e-mails do período pelo nome do projeto
5. Google Agenda — reuniões e marcos do período
6. WhatsApp (LetsBot) — informe o grupo ou contato
7. Fluig — só funciona se o acesso ao Fluig estiver configurado no ambiente
8. Arquivos do repositório / entregas anteriores em `projetos/`
9. Artefato do Claude — cole o link

### 4. Período
"Qual período considerar?" 1. Última semana · 2. Últimas 2 semanas · 3. Último mês · 4. Desde o início do projeto

### 5. Anotações (opcional; obrigatório para ata)
"Quer colar anotações, briefing ou transcrição? (Para ata, cole aqui as anotações da reunião, com data e participantes.)"

## Output Format

Grave em `outputFile`:
```markdown
# Briefing — {AAAA-MM-DD}
- **Projeto:** {nome} (novo: sim/não)
- **Entrega:** {plano | status | riscos | ata}
- **Fontes:** {lista, com links/identificadores}
- **Período:** {de} a {até}
## Anotações do usuário
{texto colado ou "nenhuma"}
```

## Output Example

```markdown
# Briefing — 2026-11-10
- **Projeto:** Implantação Fluig RH (novo: não)
- **Entrega:** status
- **Fontes:**
  - Google Sheets: https://docs.google.com/spreadsheets/d/EXEMPLO
  - Gmail: busca "Fluig RH"
  - WhatsApp: grupo "Projeto Fluig RH"
  - Repositório: projetos/implantacao-fluig-rh/
- **Período:** 2026-11-03 a 2026-11-10
## Anotações do usuário
Júlio disse ontem que a homologação deve sair até quarta.
```

## Veto Conditions

1. Entrega não definida entre as 4 opções.
2. Entrega "ata" sem anotações e sem nenhuma fonte de onde extrair a reunião.
