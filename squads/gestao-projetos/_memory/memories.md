# Squad Memory: Gestão de Projetos

## Estilo de Escrita
- Português do Brasil, direto, frases curtas, datas no formato AAAA-MM-DD.
- Sempre dono + prazo em toda ação; nada de "alguém vai ver".

## Design Visual
- Markdown simples: títulos, tabelas e listas. Semáforo com 🟢 🟡 🔴.

## Estrutura de Conteúdo
- Plano: objetivo, escopo (dentro/fora), EAP, cronograma, responsáveis (RACI), marcos, riscos iniciais.
- Status: resumo executivo em 3 linhas, semáforo, % concluído, entregas da semana, desvios, riscos top 3, próximos passos, decisões pedidas.
- Riscos: tabela com ID, descrição, causa, impacto, probabilidade, severidade, dono, resposta, prazo, status.
- Ata: participantes, pauta, decisões, ações (dono + prazo), pendências, próxima reunião.

## Proibições Explícitas
- Nunca enviar e-mail ou WhatsApp sem aprovação explícita no checkpoint final; criar apenas rascunhos.
- Nunca inventar dados (datas, %, nomes). Lacuna vira pergunta ou "a confirmar".
- Nunca colocar senhas ou tokens em arquivos do repositório.

## Técnico (específico do squad)
- Entregas aprovadas vão para `projetos/{slug-do-projeto}/` (versionado no git).
- Histórico de cada projeto em `projetos/{slug-do-projeto}/memoria.md`.
- Fluig: só usar se FLUIG_URL estiver configurado e o token estiver salvo como segredo do ambiente.
