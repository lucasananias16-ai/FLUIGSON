# Diagnóstico — Falhas de integração Fluig → Protheus · Tatu Marchesan — 2026-11-13

**Fonte:** dados do formulário (`dts_solicitacao_compras_JYNX`), cruzados com a atividade atual de cada solicitação. Só leitura.
**Limite:** o serviço de histórico (`getHistories`) recusou o usuário (usa o e-mail no lugar da matrícula), então não vi os comentários das movimentações.

## Conclusões
1. **A criação de SC no Protheus voltou a funcionar desde 06/10.** As 17 solicitações enviadas de 06/10 a 16/10 (nº 44 a 62, fora as canceladas 46 e 51) têm `hd_integracao_sc_status = OK` e um número de SC no Protheus (000388 a 000421).
2. **As 15 paradas em "Gerar SC no ERP" são legado.** Todas são de 14/09 a 28/09 (nº 11, 12, 15–20, 27, 28, 39–43), abertas em versões antigas do processo (até a v20), e nenhuma tem número de SC no Protheus. Em princípio, o problema que as travou já foi corrigido.
3. **A mensagem de erro não fica gravada.** Nas 19 solicitações em falha, os campos `hd_*_sc_erro`, `hd_*_sc_payload` e `hd_*_sc_raw` estão **vazios**. Quem cai em "Tratar Falhas" não tem como saber o que deu errado sem olhar o log do servidor. **Esta é a correção mais importante a fazer agora.**
4. **As outras 4 falhas são nas etapas seguintes à criação da SC:**
   | Nº | Falha em | SC no Protheus | Data |
   |---|---|---|---|
   | 21 | Libera Aprovação no ERP | 000120 | 15/09 |
   | 30 | Atualiza SC no ERP | 000285 | 24/09 |
   | 54 | Reprovar SC no ERP | 000401 | 06/10 |
   | 55 | Libera Aprovação no ERP | 000403 | 06/10 |
   Os nº 54 e 55 são os casos mais recentes (06/10), em versões atuais do processo. **Liberação e reprovação no ERP ainda não estão comprovadas.** Atenção: essas SCs **existem no Protheus**, em estado inconsistente com o Fluig.
5. **Quase tudo é massa de teste.** 14 das 19 solicitações em falha têm observação "asd" ou "teste". As de aparência mais real são o nº 27 ("Material para Torno CNC") e o nº 28 (sem observação), ambas abertas pelo Héber Silva em 22/09.

## Situação das 43 solicitações em andamento
| Grupo | Nº | Leitura |
|---|---|---|
| Falha antiga em Gerar SC (sem SC no ERP) | 11, 12, 15–20, 27, 28, 39–43 | Legado. Cancelar as de teste; reabrir 27/28 se forem reais |
| Falha em liberar/atualizar/reprovar (SC já existe no ERP) | 21, 30, 54, 55 | Investigar o erro no log; acertar a SC no Protheus |
| Aguardando aprovação (SC já criada no ERP) | 13, 14, 26, 32–34, 36–38, 45, 47–49, 52, 53, 56–62 | A integração está OK; falta o aprovador agir. **É aqui que se testa a etapa "Libera Aprovação no ERP"** |
| Revisão (devolvida ao solicitante) | 29, 44 | Gabriel Izidoro |

## Recomendações
| # | Ação | Dono | Prazo |
|---|---|---|---|
| 1 | Nos eventos das atividades de serviço, gravar a mensagem de erro, o payload e a resposta do Protheus nos campos `hd_*_sc_erro/payload/raw` antes de desviar para "Tratar Falhas" | Jynx (dev) | 20/11 |
| 2 | Puxar o log do servidor de 06/10 para os nº 54 e 55 e corrigir liberar/reprovar no ERP | Jynx (dev) | 20/11 |
| 3 | Aprovar 2 ou 3 solicitações já com SC criada (ex.: nº 58, 59, 60) para validar a liberação de ponta a ponta | Paulo Ferreira + Jynx | 20/11 |
| 4 | Com o aval do cliente, cancelar as solicitações de teste em falha e reabrir 27/28 na versão atual, se forem reais | Gestão do projeto | 25/11 |
| 5 | Conferir no Protheus as SCs 000120, 000285, 000401 e 000403 (estado inconsistente com o Fluig) | TI Marchesan | 25/11 |
