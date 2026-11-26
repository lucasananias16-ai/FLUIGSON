'use strict';
// Cenários do teste E2E do processo liberacao_faturamento_medicao (ODS).
//
// "homologacao-26-11-prio-tigris" reproduz o retorno dos testes de 26/11/2026:
//   - Widget "Consulta | Pedidos de Venda" mostra o PV 104281 (PRIO TIGRIS S.A., moeda 2-USD)
//     com o PC I82810 (USD 30.000,00, C. Custo FLU1G, etapa "Não Iniciada", status "undefined").
//   - Ao iniciar a solicitação: "Não foram encontrados aprovadores parametrizados para o
//     C. Custo FLU1G com limite suficiente para o valor de USD 30000."
//
// "controle-cc-2000" é um PC do C. Custo 2000 (FINANCEIRO), que tem aprovadores
// parametrizados; serve para provar que o teste passa quando a parametrização existe.

module.exports = {
  'homologacao-26-11-prio-tigris': {
    descricao: 'PV 104281 / PC I82810 — USD 30.000 — C. Custo FLU1G (retorno da homologação 26/11)',
    pc: { numero: 'I82810', pv: '104281', cc: 'FLU1G', moeda: '2', total: 30000 },
  },
  'controle-cc-2000': {
    descricao: 'PV 104279 / PC I82809 — BRL 30.000 — C. Custo 2000 (controle)',
    pc: { numero: 'I82809', pv: '104279', cc: '2000', moeda: '1', total: 30000 },
  },
};
