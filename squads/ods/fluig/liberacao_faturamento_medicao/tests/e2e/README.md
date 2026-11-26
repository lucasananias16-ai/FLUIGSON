# Teste E2E — Liberação de Faturamento Por Medição (ODS)

Reproduz o retorno da homologação de 26/11/2026: o PV **104281** (PRIO TIGRIS S.A.) com o PC
**I82810** (USD 30.000, C. Custo **FLU1G**) não inicia a solicitação. O widget mostra *"Não foram
encontrados aprovadores parametrizados para o C. Custo FLU1G com limite suficiente para o valor de
USD 30000"*.

Sem dependências: usa Node 18+ (`fetch` e `node:test`) e os webservices SOAP padrão do Fluig.

## Etapas

| # | O que verifica | Fonte |
|---|---|---|
| 0a | O PV está na carga sincronizada do Fluig; avisa se o C. Custo do PV for diferente do C. Custo do PC | `dts_getPedidoVenda_JYNX` |
| 0b | Todo PV sincronizado tem o seu PC na carga de PCs (detecta carga incompleta) | `dts_getPedidoVenda_JYNX` × `dts_getPedidoCompra_JYNX` |
| 1 | O PC veio na carga do Protheus com PV, C. Custo, moeda e valor do cenário | `dts_getPedidoCompra_JYNX` |
| 2 | Os itens do PC são lidos do Protheus, sem erro de integração | `dts_getPedidosCompra_JYNX` |
| 3 | Há aprovadores para C. Custo + moeda + valor (a checagem que falhou) | `dts_consultUsuariosPosicoes` |
| 4 | Há aprovador de nível 1 (a Aprovação 1, atividade 12, é obrigatória) | `dts_consultUsuariosPosicoes` |
| 5 | *(opcional)* Inicia a solicitação, confere quem é o responsável na Aprovação 1 e cancela | `ECMWorkflowEngineService` |

Quando a etapa 3 falha, o teste cruza `dsUserPosicao` com `dsConfigAlcadPosic` e explica, cadastro
por cadastro, por que nenhum aprovador foi encontrado: posição sem alçada, subcategoria diferente
ou limite insuficiente.

## Rodar contra o Fluig DEV

Rode numa máquina que acesse `odsdo204964.fluig.cloudtotvs.com.br`. Defina as variáveis no
terminal e nunca grave a senha em arquivo.

```bash
FLUIG_URL=https://odsdo204964.fluig.cloudtotvs.com.br FLUIG_USER=admin FLUIG_PASS='***' \
  node --test --test-reporter=spec tests/e2e/liberacao.e2e.test.js
```

- `E2E_CENARIO=homologacao-26-11-prio-tigris` roda só um cenário (veja `cenarios.js`).
- `E2E_START=1` liga a etapa 5. Ela **cria uma solicitação real** e a cancela no final.
- `E2E_KEEP=1` mantém a solicitação criada pela etapa 5, sem cancelar.

## Rodar sem acesso ao Fluig (servidor simulado)

`mock/` traz uma foto dos dados do DEV em 26/11/2026 e um servidor SOAP que reproduz a lógica do
`dts_consultUsuariosPosicoes`.

```bash
node tests/e2e/mock/servidor-mock.js &
FLUIG_URL=http://127.0.0.1:8089 FLUIG_USER=x FLUIG_PASS=x node --test --test-reporter=spec tests/e2e/liberacao.e2e.test.js
```

Resultado esperado com a foto de 26/11:
- **Nos dois cenários:** falha a etapa 0b. A carga de PCs tem só 5 linhas e o PV 104276 ficou sem o seu PC.
- **Cenário PRIO TIGRIS:** falham também as etapas 3 e 4, reproduzindo o erro da homologação.
- **Cenário de controle (CC 2000):** passa a etapa 3 e falha a 4, porque também não há aprovador de nível 1.

O cenário PRIO TIGRIS só passa quando a parametrização estiver corrigida no Fluig.

## Usar os datasets de teste (`_test`)

`E2E_DATASET_SUFIXO=_test` faz as etapas 0a, 0b e 1 lerem `dts_getPedidoCompra_JYNX_test` e
`dts_getPedidoVenda_JYNX_test`, publicados no DEV em 26/11/2026. Essas cópias não usam
sincronização e só respondem ao usuário `admin`.
- `E2E_PROCESS_ID=liberacao_faturamento_medicao_test` faz a etapa 5 iniciar a solicitação na cópia de teste,
  cujo início é restrito ao `admin`. Sem a variável, a etapa usa o processo original.

Teste completo contra a cópia de teste:

```bash
FLUIG_URL=https://odsdo204964.fluig.cloudtotvs.com.br FLUIG_USER=admin FLUIG_PASS='***' \
E2E_DATASET_SUFIXO=_test E2E_PROCESS_ID=liberacao_faturamento_medicao_test E2E_START=1 \
  node --test --test-reporter=spec tests/e2e/liberacao.e2e.test.js
```
