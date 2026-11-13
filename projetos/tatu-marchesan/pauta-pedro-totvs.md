# Pauta — Alinhamento Fluig × Protheus (Tatu Marchesan) com Pedro / TOTVS

**Duração sugerida:** 45 min · **Participantes:** Pedro Lages (WeTrust/TOTVS), Albert Cometti (TOTVS), Lucas Ananias e Mayara Centeno (Jynx). Opcional: Jeremias Lameze (Compras) e Marcos Leite (Marchesan)
**Objetivo:** destravar a Compra e definir as integrações dos fluxos de Reembolso e Manutenção.

## 1. Solicitação de Compra: liberação/reprovação (15 min) 🔴 bloqueante
- **Problema:** `POST /APROVCOM` devolve `Registro nao Localizado na Tabela - SCR` (SCs 000401 e 000403, 06/10). As 22 SCs em aprovação (000368 a 000423) vão falhar do mesmo jeito.
- **Causa provável:** pela definição de 01/09, a aprovação é só no Fluig. Sem alçada no Protheus, não há SCR.
- **Decidir:**
  - [ ] O endpoint libera a SC direto (`C1_APROV` B → L) quando o Fluig aprovar? Ou a alçada será ativada no Protheus?
  - [ ] Reprovação: rejeitar, eliminar resíduo ou excluir a SC?
  - [ ] O aprovador fixo `000001` no payload continua necessário?
  - [ ] Quem acerta as SCs inconsistentes 000120, 000285, 000401 e 000403, e quando?
- **Confirmar (definição de 01/09):**
  - [ ] O `gerasc` preenche `C1_FORNECE`/`C1_LOJA` com o último fornecedor da NF (SD1) do produto? O Fluig não envia esses campos.
  - [ ] A validação da RIAI vencida (`A5_VALRIAI`, SA5) está no `gerasc`?
  - [ ] O erro genérico `Erro nao tratado na geracao da Solicitacao de Compra!` (8 casos entre 15/09 e 28/09): causa conhecida e corrigida?
- **Ambiente:** a solicitação 63 (SC 000423, criada às 23h23 de 12/11) ficou travada na atividade automática do Fluig depois de integrar. Pedir a reexecução pela Central de Diagnósticos.

## 2. Manutenção: regras de direcionamento e SS (15 min)
Contexto (levantamento 15/10): sem aprovação; direcionamento por regras parametrizadas no Protheus; API Fluig ↔ Protheus a cargo de Gabriel + Pedro.
- [ ] Onde ficam as regras: SIGAMNT? Qual tabela/rotina? Já existem ou entram por carga em massa?
- [ ] O que a regra devolve: destino (Protheus × Fluig), responsável/equipe, SLA?
- [ ] Endpoints necessários e prazo:
  1. Usuário ativo no Protheus (por e-mail ou matrícula)
  2. Regras de direcionamento
  3. Bens/equipamentos (ST9 ou SN1?), CC e tipos de serviço ativos
  4. Inclusão de Solicitação de Serviço (SS)
  5. Situação da SS/OS (para o Fluig saber que encerrou)
- [ ] O encerramento chega ao Fluig por consulta periódica ou o Protheus avisa?

## 3. Reembolso: destino da integração (10 min)
Contexto (levantamento 16/10): substitui o Paytrack (hoje integra com o Glovia); sem dados fiscais e de fornecedor; câmbio para despesas em dólar; quilometragem automática.
- [ ] Destino: Protheus (título a pagar ao colaborador, SE2), Glovia ou folha?
- [ ] Se for Protheus: o colaborador está cadastrado como fornecedor (SA2)? Endpoint de inclusão do título (contrato proposto na spec) e de consulta de baixa
- [ ] Câmbio: usar a taxa do Protheus (SM2) ou PTAX?
- [ ] Projetos: de qual tabela vem a lista?

## 4. Acessos e ambiente (5 min)
- [ ] A API REST do Fluig DEV recusa todos os logins (SAML). Abrir chamado para um usuário de integração ou aplicativo OAuth (texto pronto em `fluig/chamado-totvs-acesso-api.md`)
- [ ] Produção da Compra: REST do Protheus configurado depois da correção da senha do ADM em 10/11?

## Encaminhamentos (preencher na reunião)
| # | Ação | Responsável | Prazo |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
