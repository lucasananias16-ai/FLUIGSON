// solicitacaoDeCompra — beforeStateEntry
//
// Ao entrar numa atividade "Tratar Falhas", copia para o formulário a mensagem de erro
// da atividade de serviço que falhou.
//
// Por que aqui e não no próprio servicetaskN: quando a atividade de serviço lança exceção,
// o Fluig desfaz a transação, e o hAPI.setCardValue feito antes do throw se perde
// (TDN, "Integração assíncrona via processos workflow"). O Fluig, porém, registra o erro
// de cada tentativa como complemento da tarefa automática (processTask.taskObservation).
// Este evento lê esse complemento e o grava nos campos hd_*_sc_erro / hd_*_sc_status.
//
// Este evento nunca bloqueia a movimentação: qualquer falha aqui só gera log.

var ATV_TRATAR_FALHA_GERAR_SC = 32;     // erro de servicetask30 (Gerar SC no ERP)
var ATV_TRATAR_FALHA_LIBERAR_SC = 37;   // erro de servicetask35 (Libera Aprovação no ERP)
var ATV_TRATAR_FALHA_ATUALIZAR_SC = 83; // erro de servicetask81 (Atualiza SC no ERP)
var ATV_TRATAR_FALHA_REPROVAR_SC = 88;  // erro de servicetask87 (Reprovar SC no ERP)

var PREFIXO_COMPLEMENTO_FALHA = "Atividade de servi%o executada com falha%";
var TAMANHO_MAXIMO_ERRO = 4000;

function beforeStateEntry(sequenceId) {
    var prefixoCampo = getPrefixoCampoErro(sequenceId);
    if (prefixoCampo == "") {
        return;
    }

    try {
        var erro = buscarUltimoErroServico();
        if (erro == "") {
            logErro("Nenhum complemento de falha encontrado para a atividade " + sequenceId + ".");
            return;
        }

        hAPI.setCardValue(prefixoCampo + "_status", "ERRO");
        hAPI.setCardValue(prefixoCampo + "_erro", erro.substring(0, TAMANHO_MAXIMO_ERRO));
        logErro("Erro copiado para " + prefixoCampo + "_erro (atividade " + sequenceId + ").");
    } catch (e) {
        logErro("Falha ao copiar o erro da integracao para o formulario: " + e);
    }
}

function getPrefixoCampoErro(sequenceId) {
    var atividade = parseInt(sequenceId, 10);
    if (atividade == ATV_TRATAR_FALHA_GERAR_SC) return "hd_integracao_sc";
    if (atividade == ATV_TRATAR_FALHA_ATUALIZAR_SC) return "hd_atualizacao_sc";
    if (atividade == ATV_TRATAR_FALHA_REPROVAR_SC) return "hd_reprovacao_sc";
    if (atividade == ATV_TRATAR_FALHA_LIBERAR_SC) return "hd_aprovacao_sc"; // exige os campos novos no formulário
    return "";
}

function buscarUltimoErroServico() {
    var numeroSolicitacao = String(getValue("WKNumProces"));
    var constraints = [
        DatasetFactory.createConstraint("processTaskPK.processInstanceId", numeroSolicitacao, numeroSolicitacao, ConstraintType.MUST),
        DatasetFactory.createConstraint("taskObservation", PREFIXO_COMPLEMENTO_FALHA, PREFIXO_COMPLEMENTO_FALHA, ConstraintType.MUST)
    ];
    constraints[1].setLikeSearch(true);

    var campos = ["processTaskPK.movementSequence", "taskObservation"];
    var ds = DatasetFactory.getDataset("processTask", campos, constraints, null);
    if (ds == null || ds.rowsCount == 0) {
        return "";
    }

    var maiorMovimento = -1;
    var erro = "";
    for (var i = 0; i < ds.rowsCount; i++) {
        var movimento = parseInt(ds.getValue(i, "processTaskPK.movementSequence"), 10);
        if (movimento > maiorMovimento) {
            maiorMovimento = movimento;
            erro = String(ds.getValue(i, "taskObservation") || "");
        }
    }
    return erro;
}

function logErro(mensagem) {
    log.warn("[solicitacaoDeCompra] solicitacao " + getValue("WKNumProces") + ": " + mensagem);
}
