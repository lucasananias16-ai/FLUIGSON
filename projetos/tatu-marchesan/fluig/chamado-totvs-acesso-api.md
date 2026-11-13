# Chamado TOTVS — liberar acesso à API REST do Fluig (DEV)

**Assunto:** Fluig DEV Marchesan (marchesanimplementos203231): usuário de integração com acesso à API REST

**Texto:**

Olá,

No ambiente Fluig de **desenvolvimento** da Marchesan (`https://marchesanimplementos203231.fluig.cloudtotvs.com.br`), todas as chamadas às APIs REST (`/process-management/api/v2/...` e importação de processos) recusam o login de usuários, inclusive do `admin`. O ambiente usa login integrado (SAML/Fluig Identity). Os webservices SOAP funcionam para leitura com o usuário de consultoria.

Precisamos publicar e liberar versões de processos e consultar tarefas e solicitações por ferramenta de desenvolvimento (fora do Fluig Studio). Solicitamos uma das opções:

1. Um **usuário local** (fora do Identity) com permissão para publicar processos, formulários e datasets na empresa 1; **ou**
2. Um **aplicativo OAuth** cadastrado no Fluig (consumer key/secret) com acesso às APIs REST de process-management e ECM.

Escopo: apenas o ambiente de desenvolvimento. Produção e qualidade não são afetados.

Obrigado.
