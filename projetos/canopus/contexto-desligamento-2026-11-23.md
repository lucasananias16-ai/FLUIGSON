# Canopus — Solicitação de Desligamento no Fluig (contexto consolidado)

> Atualizado em 23/11/2026. Fontes: Drive (RFP do Luciano, proposta 045/2026 V03, kickoff, cronograma), Gmail (threads com Luciano, Carlos Pretti, Carlos Miranda, Edineia) e atas do Gemini (17/09, 28/10, 09/11 e daily de 23/11).

## 1. Identificação

| Item | Valor |
|---|---|
| Cliente | Grupo Canopus (contratante: DISVECO Ltda.) |
| Proposta | 045/2026 V03, escopo fechado, R$ 37.000 (3 parcelas) |
| Prazo contratado | 6 semanas de desenvolvimento após o aceite da documentação, mais 60 dias de garantia |
| Ponto focal Canopus | Luciano Kurudez (de férias, volta em **16/12/2026**) |
| Contato durante as férias | Edineia Cristina |
| Cópia obrigatória | Luciano, Carlos Pretti e Edineia em todas as solicitações (decisão de 09/11) |
| RM / integração | Carlos Miranda (suporte RM, gestaoprojetos.tec.br) e Carlos Pretti (TI Canopus) |
| JYNX | Lucas Ananias (gerente de projetos/sócio), Mayara Centeno (analista de projetos), Weverton Oliveira (desenvolvedor) |
| Fluig homologação | `https://cosmosh.empresascanopus.com.br` (usuário do Weverton; **senha não registrada aqui**) |
| Fluig produção | `https://cosmos.empresascanopus.com.br` |
| RM homologação | servidor 10.110.1.171, alias RMTST, usuário integrador `CanopusAPI` |
| Conexão JDBC no Fluig | `/jdbc/OracleDS_RM` |
| Views RM | `VW_FLUIG_RM_FUNCIONARIOS` (pedido de inclusão da coluna CHAPA), `VW_FLUIG_RM_REQDEMISSAO`; tabela `RM.REQDESLIGAMENTO` |

## 2. Fluxo atual x fluxo novo

- **Atual:** a requisição é aberta no RM, passa pela qualificação no Fluig e volta ao RM. A busca no Fluig é feita pelo número da requisição.
- **Novo (o "pilar" do Luciano, e-mail de 10/11):** tudo começa no Fluig. Durante o processo o RM é **só consultado** pelo CPF. A requisição de desligamento, e a de contratação quando há reposição, **só é aberta no RM no final**, por integração. Em seguida o Fluig dispara o processo atual de Preparação/Rescisão, já com o número da requisição.

## 3. Categorização e regras por tipo

**Iniciativa do colaborador → Pedido de demissão**
- O gerente abre a solicitação. O colaborador nunca abre no Fluig (política interna).
- **Sem nenhuma aprovação** (decisão de 09/11, por causa do prazo de pagamento e das multas): abre a requisição de desligamento no RM automaticamente; abre a requisição de contratação se o gerente informou reposição (é substituição, sem aumento de quadro); depois segue para a Preparação no DP.
- A Gestão de Pessoas só é **notificada por e-mail** e atua fora do Fluig.
- Anexos: **carta de pedido de demissão obrigatória**. Comprovante de novo emprego obrigatório quando o aviso prévio for "Dispensado" (pela política da empresa, o comprovante dispensa o aviso).

**Iniciativa da empresa → Sem justa causa**
- Gerente → DP Central "Analisar Impedimento e Custo" (2h; com impedimento, encerra e notifica o gerente) → Gestão de Pessoas "Analisar Motivo e Reversão" (3h; valida, devolve ao gerente ou cancela) → Diretor regional ou corporativo "Aprovar" (8h; decide também a reposição) → RM.
- Evidências de feedback: anexo recomendado.

**Iniciativa da empresa → Justa causa**
- Mesmo caminho da sem justa causa, mais um **e-mail urgente ao Jurídico** na abertura. O Jurídico não tem atividade no fluxo: os diretores jurídicos não usam o Fluig.
- Evidências do fato: anexo recomendado.

**Desligamento de gerentes e diretores (decisão do Lucas em 23/11)**
- Conduzido **integralmente pela Gestão de Pessoas**, sem as aprovações internas dos outros caminhos.
- Só um **grupo de RH/Gestão de Pessoas** pode abrir e conduzir esse caso.

**Regras gerais**
- Formulário do gerente mínimo: CPF (o RM devolve nome, coligada/filial e função), tipo, motivo, data prevista, aviso prévio (Trabalhado/Indenizado/Dispensado), reposição, bens e anexos.
- **Sem campo de observações.**
- Bens patrimoniais: notebook/tablet, celular, ferramentas/equipamentos, veículo e **chip de celular**. A área de patrimônio só recebe essa informação no processo seguinte.
- A **data prevista** é crítica: um robô (RPA) remove os acessos do colaborador 1h antes do desligamento (normalmente segunda-feira, 9h).
- Reprovação, cancelamento ou impedimento: o gerente é notificado por e-mail.
- Papéis em filas de atendimento (pools) no Fluig; a hierarquia de aprovação é a mesma da produção atual.
- **Impedimentos (lista do Luciano, 13/11):** gestação; acidente de trabalho ou doença ocupacional; CIPA; serviço militar obrigatório; pré-aposentadoria; retorno de afastamento por doença comum; licença médica (auxílio-doença).
- **Prazos (13/11):** Analisar Impedimento (DP) 2h · Analisar Motivo e Reversão (Gestão de Pessoas) 3h · Aprovar (Diretor) 8h. *Pendente:* prazo da etapa "Abrir requisição no RM" do pedido de demissão (provavelmente quer dizer o prazo da Preparação no DP).

## 4. Matriz de motivo × tipo (proposta, aprovada pelo Lucas para implementar; validar com o Luciano)

Os motivos vêm do RM; hoje a simulação mostra os 13 para qualquer tipo.

| Motivo | Pedido de demissão | Sem justa causa | Justa causa |
|---|:-:|:-:|:-:|
| Mudança de cidade | ✅ | | |
| Salário/proposta de outra empresa | ✅ | | |
| Estudar | ✅ | | |
| Casamento | ✅ | | |
| Família | ✅ | | |
| Trabalhar por conta própria | ✅ | | |
| Redução de quadro | | ✅ | |
| Produtividade/desempenho insuficiente | | ✅ | |
| Não adaptou/desempenho/comportamento no período de experiência | | ✅ | |
| Antecipação do contrato de experiência – comportamento | | ✅ | |
| Abandono de emprego | | | ✅ |
| Transferência para outra loja | ⚠️ validar (pode não ser desligamento) | | |
| Término de contrato | ⚠️ validar (não se encaixa nos 3 tipos) | | |

Conferir também os códigos de tipo e de motivo no RM: a Mayara citou que estavam confirmados em 18/11.

## 5. Ajustes no processo atual de Preparação/Rescisão (item 4, aprovado para aplicar)

Pela aba To Be da planilha "Papéis As Is e To Be" (Luciano, 30/10):
- "Aplicar Desligamento (kit demissional)": **exceto no pedido de demissão**.
- "Anexar aviso prévio assinado": **somente na sem justa causa**.
- "Verificação de pendências – bens patrimoniais": **excluir**.
- Seguem como estão: pendências de adiantamentos/empréstimos (Tesouraria) e de benefícios; anexar e validar exame médico (ASO); apuração da rescisão; solicitar e pagar; conferir e enviar documentos; homologação; integração de gravação da data de homologação.

⚠️ Risco de escopo: a proposta cita "Preparação/Rescisão", mas não deixa claro se ajustar esse processo existente está incluído. Registrar como mudança.

## 6. Escopo contratado (proposta 045/2026 V03) x situação

| Entrega | Situação |
|---|---|
| Levantamento e documentação | ✅ (alinhamentos de 17/09, 08/10 e 28/10) |
| Workflow (3 caminhos) | ✅ publicado em homologação; ajustes: gerentes/diretores, item 4, e-mail para a Gestão de Pessoas no pedido de demissão |
| Formulário | ✅ (simulação HTML v3 enviada em 09/11; sem retorno do Luciano) |
| Scripts e validações por tipo | ✅ em grande parte; falta a matriz de motivo × tipo |
| Notificações por e-mail | ❓ sem evidência; textos pendentes (ação do Lucas desde 28/10) |
| RM: consulta | ✅ funcionando em homologação |
| RM: gravação do desligamento | ✅ testes positivos (daily de 23/11); o Weverton vai confirmar ao cliente |
| RM: reposição de vaga | em andamento (26/11–30/11) |
| Widget Central de Desligamento (+ indicadores e parâmetros, segundo o kickoff) | ❓ sem registro de andamento: **maior risco técnico** |
| Testes integrados | 01/12–03/12 |
| Homologação | ❌ suspensa (férias do Luciano) |
| Manual em vídeo, migração, operação assistida | pendentes |
| Jurídico como atividade | virou notificação por e-mail (redução aceita em 28/10; formalizar) |

## 7. Cronograma (enviado em 15/10, emitido em 14/10) x realidade

| # | Etapa | Previsto | Situação |
|---|---|---|---|
| 2 | Usuário integrador RM | até 23/10 | ✅ entregue em 18/11 (atraso do cliente, sem impacto no desenvolvimento) |
| 6 | Aceite da documentação | 27/10–03/11 | aceite informal nas reuniões |
| 7–9 | Workflow, formulário, scripts | 30/10–13/11 | ✅ antecipados |
| 10 | Consulta RM | 16/11–18/11 | ✅ |
| 11 | Gravação do desligamento | 19/11–25/11 | ✅ em teste |
| 12 | Reposição de vaga | 26/11–30/11 | em andamento |
| 13 | Notificações | 16/11–17/11 | ❓ |
| 14 | Widget Central | 18/11–01/12 | ❓ |
| 15 | Testes integrados | 01/12–03/12 | mantido |
| — | Validação visual com o Luciano | **07/12, 14h–16h** | agendada (Edineia como contato); não substitui a homologação |
| 16 | Homologação | 04/12–10/12 | ❌ só depois de 16/12 |
| 18 | Go-live | 16/12 | ❌ inviável como planejado; **reemitir o cronograma** (ação da Mayara) |

**Meta do Lucas:** ter uma **primeira versão navegável** para o Luciano validar quando voltar (16/12).

## 8. Acesso ao ambiente (bloqueio atual)

- O Fluig de homologação abre no navegador da rede do Lucas, mas **não responde fora da rede da Canopus**: o MCP do Fluig dá "fetch failed" e a nuvem do Claude recebe "connection reset". Provavelmente o firewall só aceita VPN ou IPs liberados.
- O host `cosmosh.empresascanopus.com.br` já foi liberado na rede do ambiente "Devinho FLUIG".
- **Para desbloquear:** conectar o computador do Lucas pelo Remote Control (app desktop → Settings → Claude Code → Remote Control → compartilhar uma pasta), ou usar o Cowork local para exportar os fontes, ou pedir ao Carlos Pretti para liberar o acesso externo.
- ⚠️ Trocar a senha do Weverton: ela passou pelo chat e está aberta na planilha "Check-list de Ambiente - Canopus.xlsx" no Drive.

## 9. Próximos passos

1. Liberar o acesso ao ambiente (seção 8).
2. Fazer o inventário do ambiente: processo, formulários, datasets, eventos, widgets e telas de parâmetro. Listar o que falta (Central de Desligamento, indicadores, parâmetros de prazo e escalonamento, formulários).
3. Implementar:
   - matriz de motivo × tipo;
   - caminho de gerentes e diretores (só o grupo de Gestão de Pessoas abre, sem aprovações);
   - e-mail para a Gestão de Pessoas no pedido de demissão;
   - ajustes do item 4 no processo de Preparação/Rescisão.
4. Concluir a integração de reposição de vaga e confirmar ao cliente o sucesso dos testes no RMTST.
5. Definir os textos das notificações.
6. Entregar a versão navegável até 07/12 (prévia) e 16/12 (validação do Luciano).
7. Reemitir o cronograma de homologação e go-live, e formalizar as mudanças de escopo (Jurídico como notificação, gerentes/diretores, item 4).

## 10. Pontos para validar com o Luciano na volta (16/12)

- Matriz de motivo × tipo (seção 4), sobretudo "transferência para outra loja" e "término de contrato".
- Regras do desligamento de gerentes e diretores.
- Prazo pendente do caminho do pedido de demissão.
- Retorno da simulação HTML enviada em 09/11.
