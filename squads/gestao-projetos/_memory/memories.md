# Squad Memory: Gestão de Projetos

## Estilo de Escrita
- Português do Brasil, direto, frases curtas, datas no formato AAAA-MM-DD.
- Sempre dono + prazo em toda ação; nada de "alguém vai ver".

- Semáforo do status: usar o critério da Esteira — 🔴 com prazo/marco vencido, trava, >20 dias parado ou horas fora do PSA; 🟡 com 8–20 dias parado, pendência do cliente ou consumo >80%; 🟢 com avanço em 7 dias. Projeto pausado formalmente não entra na cor.

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

## Instruções do usuário (rotina)
- 2026-11-13: o usuário informou que a ICM pediu para pausar a agenda Fluig de quarta. Não há ata da reunião de 11/11 (só a gravação, sem transcrição). Indício: a série recorrente foi editada pela Mayara em 11/11 14h39 e não há ocorrência depois de 11/11. Considerar a agenda pausada até a Mayara confirmar com o Vitor Kodama até quando vale.
- 2026-11-13: e-mail diário para a Mayara às 9h (pipeline/rotina-email-mayara.md), autorizado pelo usuário: 1 e-mail por dia útil, só para ela, curto, por dev, pedindo também o status de ontem, com rodapé de IA e validação com o Lucas.
