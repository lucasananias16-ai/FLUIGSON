function displayFields(form, customHTML) {
    var ETAPA_ATUAL = getValue("WKNumState")
    var APROV_PC_UM = 12;
    var APROV_PC_DOIS = 18;
    var APROV_PC_TRES = 20;
    var APROV_PC_QUATRO = 26;
    var REVISAO = 28;
    var MEDICAO_ITEMS = 32;
    var APROVACAO = 39;
    var LIBERACAO_PAGAMENTO = 46;
    var ADD_NF = 73;

    var dataForm = {
        processId: getValue("WKNumProces"),
        user: getValue("WKUser"),
        state: getValue("WKNumState")
    };

    if (ETAPA_ATUAL != ADD_NF && ETAPA_ATUAL != MEDICAO_ITEMS && ETAPA_ATUAL != APROVACAO) {
        form.setVisibleById("painel-anexos", false)
    }

    if(ETAPA_ATUAL != ADD_NF){
        form.setVisibleById("box_addAnexo", false)
    }

    if (ETAPA_ATUAL == ADD_NF || ETAPA_ATUAL == MEDICAO_ITEMS || ETAPA_ATUAL == LIBERACAO_PAGAMENTO || ETAPA_ATUAL == APROVACAO) {
        form.setVisibleById("pn_btnDecisions", false)
    }

    if(ETAPA_ATUAL == REVISAO){
        form.setVisibleById("pn_btnDecisions", false)
    }

    if(ETAPA_ATUAL != MEDICAO_ITEMS){
        form.setVisibleById("pn_btnDecisionsMedicao", false)
    }

    if(ETAPA_ATUAL != APROVACAO){
        form.setVisibleById("pn_btnDecisionsNfOk", false)
    }

    customHTML.append("<script>function getUsuario(){ return '" + dataForm.user + "'; }</script>");
    customHTML.append("<script>function getWKNumState(){ return " + dataForm.state + "; }</script>");
    customHTML.append("<script>function getWKNumProces(){ return " + dataForm.processId + "; }</script>");
}
