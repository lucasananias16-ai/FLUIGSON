# Análise — mecanismo `atribuicao_centro_custo` (Fluig DEV ODS, 26/11/2026)

O código está em `atribuicao_centro_custo.js`, exportado do cadastro do mecanismo (dataset
`attributionMecanism`, campo `attributionMecanismDescription`). O mecanismo é usado nas atividades
Aprovação 1 a 4 (12, 18, 20, 26) do processo `liberacao_faturamento_medicao`.

## Como funciona
1. Traduz a atividade de destino para o nível de alçada: 12→1, 18→2, 20→3, 26→4.
2. Lê do formulário `hd_codCCusto`, `txt_valTotalPc` e `txt_dadosPc_moeda` (vazio vira "1", BRL).
3. Consulta `dts_consultUsuariosPosicoes` com C. Custo, nível, valor, moeda e `TIPO_LIMITE=PROC`.
4. Para cada aprovador, procura o usuário Fluig pelo e-mail (`colleague.mail`) e junta as matrículas.
5. **Se a lista ficar vazia, ou se qualquer erro acontecer, atribui ao `admin`.**

## Problemas
| # | Gravidade | Problema | Efeito |
|---|---|---|---|
| 1 | Alta | Lista vazia ou exceção caem no `admin` (linhas 128–135) | A solicitação nunca barra. Sem aprovador parametrizado, ou com erro no dataset, ela vai para o administrador. Reproduzido no E2E: solicitações 218–221 caíram no `admin`. |
| 2 | Alta (segurança) | `hd_codCCusto` vem do formulário e o dataset concatena esse valor no SQL (`LIKE '%…%'`) contra o banco do Fluig (`/jdbc/AppDS`) | É um campo oculto, mas pode ser alterado no navegador. Isso permite SQL injection no banco do Fluig. |
| 3 | Média | O C. Custo é filtrado por `LIKE '%cc%'` no dataset | "FLU1G" pega FLU1G2026 e FLU1G202, que são centros diferentes, e "2000" pegaria "12000" ou "20001". Aprovadores de outro centro podem receber a tarefa. |
| 4 | Média | Não filtra cadastro ativo (`usrPos_status`) | Cadastros com Ativo = "Não" viram aprovadores. Hoje todos os cadastros estão "Não" e mesmo assim são usados. |
| 5 | Média | Gateways × mecanismo: os campos `hd_hasAprovDois/Tres/Quatro`, que decidem se os níveis 2 a 4 existem, são preenchidos em `main.js` com C. Custo `"FLU1G2026"` e valor `"R$ 37.000,00"` fixos | O mecanismo usa o C. Custo real, mas a decisão de passar ou não pelos níveis usa os valores de teste. Os níveis podem ser pulados ou exigidos indevidamente. |
| 6 | Média | Moeda vem de `txt_dadosPc_moeda`, cujo valor padrão no HTML é "Package Estrutura Metálica" | Se o widget não preencher a moeda, um PC em USD é comparado com o limite em BRL. |
| 7 | Baixa | Lê a coluna `usrPos_email` | Funciona porque o driver devolve o nome original da coluna, e não o apelido `EMAIL` do SELECT. Uma troca de driver quebra a leitura em silêncio, e a tarefa vai para o `admin`. |
| 8 | Baixa | E-mail sem usuário Fluig é ignorado em silêncio | Não há log de "aprovador sem usuário". Hoje os 6 e-mails da ODS existem como usuários ativos. |

## Sugestões de correção
- **Itens 1 e 8:** sem aprovador, lançar erro com mensagem clara. Por exemplo, `throw "Sem aprovador de nível N para o C. Custo X / moeda / valor"`, para que o Fluig impeça o envio. Alternativa: atribuir a um grupo responsável pela parametrização, como `Pool Grupo`, e não ao `admin`. Em erro técnico, registrar o log e lançar o erro, sem cair no `admin`.
- **Itens 2 e 3:** no dataset, comparar o C. Custo com igualdade e usar `PreparedStatement` com parâmetros, ou, no mínimo, validar o valor (`^[A-Za-z0-9]+$`) antes de montar o SQL.
- **Item 4:** filtrar `ATIVO = 'Sim'` no mecanismo, passando a constraint `ATIVO`, ou fixar esse filtro no dataset.
- **Item 5:** em `main.js`, usar `hd_codCCusto`, `txt_valTotalPc` e a moeda do formulário, e não os valores fixos. O ideal é calcular `hd_hasAprov*` no servidor, num `beforeTaskSave`, com a mesma consulta do mecanismo.
- **Item 6:** remover o `value` fixo do campo de moeda no HTML e validar se ele está vazio.
