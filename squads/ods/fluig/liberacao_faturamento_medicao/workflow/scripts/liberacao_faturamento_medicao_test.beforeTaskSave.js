/*
 * beforeTaskSave — SÓ na cópia de teste (liberacao_faturamento_medicao_test).
 *
 * Roda no SERVIDOR a cada envio (depois do beforeSendValidate do formulário), então vale também para
 * envios que não passam pela tela (API, integrações) e não pode ser burlado pelo navegador.
 *
 * 1. Campos obrigatórios por atividade:
 *    - Início (0/10): dados do pedido (PC, PV, C. Custo, valor, moeda) e pelo menos 1 item do PC.
 *    - Aprovações 1–4 (12/18/20/26), Medição (32) e Aprovação da NF (39): decisão obrigatória;
 *      "Solicitar Revisão" exige comentário (txt_obsGeral).
 *    - Revisão (28): comentário obrigatório (o que foi corrigido).
 *    - Adicionar NF (73): pelo menos 1 anexo.
 *    - Medição dos Itens (32): pelo menos 1 item medido.
 * 2. Histórico: toda movimentação grava uma linha em tb_obsHistorico (etapa, data/hora,
 *    usuário, decisão e comentário) e limpa txt_obsGeral.
 * 3. Ao enviar a Aprovação 1, recalcula hd_hasAprovDois/Tres/Quatro com os dados do pedido
 *    (o main.js usa C. Custo "FLU1G2026" e valor "R$ 37.000,00" fixos).
 */
var BTS_ETAPAS = {
    "0": "Abertura", "10": "Abertura", "12": "Aprovação 1", "18": "Aprovação 2", "20": "Aprovação 3",
    "26": "Aprovação 4", "28": "Revisão", "32": "Medição dos Itens", "39": "Aprovação da NF",
    "46": "Liberação de Pagamento", "73": "Adicionar NF"
};

function beforeTaskSave(colleagueId, nextSequenceId, userList) {
    if (String(getValue("WKCompletTask")) === "false") {
        return; // só salvou, não enviou
    }
    var atual = String(parseInt(getValue("WKNumState"), 10));
    var obs = bts_texto(hAPI.getCardValue("txt_obsGeral"));
    var erros = [];
    var decisao = "Enviado";

    if (atual === "0" || atual === "10") {
        var obrig = {
            num_dadosPc_numPc: "Nº do Pedido de Compra", txt_idPv_numPv: "Nº do Pedido de Venda",
            hd_codCCusto: "Centro de Custo", txt_valTotalPc: "Valor total do PC", txt_dadosPc_moeda: "Moeda"
        };
        for (var campo in obrig) {
            if (bts_texto(hAPI.getCardValue(campo)) === "") erros.push(obrig[campo]);
        }
        if (bts_contarFilhos("txt_pedido_codItem", null) === 0) erros.push("itens do Pedido de Compra");
        decisao = "Solicitação aberta";
    } else if (atual === "12" || atual === "18" || atual === "20" || atual === "26") {
        decisao = bts_decisao("hd_aprovPc", "Aprovado", "Revisar", obs, erros);
    } else if (atual === "28") {
        if (obs === "") erros.push("comentário com o que foi corrigido na Revisão");
        decisao = "Reenviado após revisão";
    } else if (atual === "73") {
        var anexos = hAPI.listAttachments();
        if (anexos == null || anexos.size() === 0) erros.push("anexo da Nota Fiscal");
        decisao = "NF anexada";
    } else if (atual === "32") {
        if (bts_contarFilhos("hd_itemMedido", "true") === 0) erros.push("pelo menos um item medido");
        decisao = bts_decisao("hd_valNfOk", "aprovado", "revisao", obs, erros);
    } else if (atual === "39") {
        decisao = bts_decisao("hd_aprovValNf", "aprovado", "revisao", obs, erros);
    } else if (atual === "46") {
        decisao = "Pagamento liberado";
    }

    if (erros.length > 0) {
        throw "Preencha antes de enviar: " + erros.join("; ") + ".";
    }

    if (atual === "12" && String(hAPI.getCardValue("hd_aprovPc")) === "Aprovado") {
        bts_recalcularNiveis();
    }

    bts_registrarHistorico(atual, decisao, obs);
}

// Decisão obrigatória; "revisão" exige comentário.
function bts_decisao(campo, aprovar, revisar, obs, erros) {
    var v = bts_texto(hAPI.getCardValue(campo));
    if (v.toLowerCase() === aprovar.toLowerCase()) return "Aprovado";
    if (v.toLowerCase() === revisar.toLowerCase()) {
        if (obs === "") erros.push("comentário explicando o motivo da revisão");
        return "Revisão solicitada";
    }
    erros.push("decisão (Aprovar ou Solicitar Revisão)");
    return "";
}

// Conta linhas pai x filho cujo campo existe (valorEsperado null) ou é igual ao valor.
function bts_contarFilhos(campo, valorEsperado) {
    var dados = hAPI.getCardData(parseInt(getValue("WKNumProces"), 10));
    var it = dados.keySet().iterator();
    var n = 0;
    while (it.hasNext()) {
        var k = String(it.next());
        if (k.indexOf(campo + "___") === 0) {
            var v = bts_texto(dados.get(k));
            if (valorEsperado === null ? v !== "" : v === valorEsperado) n++;
        }
    }
    return n;
}

function bts_registrarHistorico(atual, decisao, obs) {
    var usuario = String(getValue("WKUser"));
    var nome = usuario;
    var col = DatasetFactory.getDataset("colleague", ["colleagueName"], [
        DatasetFactory.createConstraint("colleaguePK.colleagueId", usuario, usuario, ConstraintType.MUST)], null);
    if (col != null && col.rowsCount > 0) nome = String(col.getValue(0, "colleagueName"));

    var agora = new java.text.SimpleDateFormat("dd/MM/yyyy HH:mm").format(new java.util.Date());
    var linha = new java.util.HashMap();
    linha.put("txt_obs_etapa", BTS_ETAPAS[atual] || ("Atividade " + atual));
    linha.put("txt_obs_dtHr", agora);
    linha.put("txt_obs_comment", nome + " — " + decisao + (obs !== "" ? ": " + obs : ""));
    hAPI.addCardChild("tb_obsHistorico", linha);
    hAPI.setCardValue("txt_obsGeral", "");
}

function bts_recalcularNiveis() {
    var ccusto = bts_texto(hAPI.getCardValue("hd_codCCusto"));
    var valor = bts_texto(hAPI.getCardValue("txt_valTotalPc"));
    var moeda = bts_texto(hAPI.getCardValue("txt_dadosPc_moeda"));
    var campos = { "2": "hd_hasAprovDois", "3": "hd_hasAprovTres", "4": "hd_hasAprovQuatro" };
    var resumo = [];
    for (var nivel in campos) {
        var existe = bts_temAprovadorAtivo(ccusto, nivel, valor, moeda);
        hAPI.setCardValue(campos[nivel], existe ? "true" : "false");
        resumo.push("nível " + nivel + "=" + existe);
    }
    log.info("[liberacao_faturamento_medicao_test.beforeTaskSave] CC " + ccusto + " | " + valor + " | moeda " + moeda + " | " + resumo.join(", "));
}

function bts_temAprovadorAtivo(ccusto, nivel, valor, moeda) {
    var c = [
        DatasetFactory.createConstraint("COD_CCUSTO", ccusto, ccusto, ConstraintType.MUST),
        DatasetFactory.createConstraint("NIVEL", nivel, nivel, ConstraintType.MUST),
        DatasetFactory.createConstraint("VALOR_LIMITE", valor, valor, ConstraintType.MUST),
        DatasetFactory.createConstraint("MOEDA", moeda, moeda, ConstraintType.MUST),
        DatasetFactory.createConstraint("TIPO_LIMITE", "PROC", "PROC", ConstraintType.MUST),
        DatasetFactory.createConstraint("ATIVO", "Sim", "Sim", ConstraintType.MUST)
    ];
    var ds = DatasetFactory.getDataset("dts_consultUsuariosPosicoes", null, c, null);
    var total = (ds == null) ? 0 : ds.rowsCount;
    for (var i = 0; i < total; i++) {
        var email = bts_texto(ds.getValue(i, "usrPos_email"));
        if (email === "") continue;
        var col = DatasetFactory.getDataset("colleague", ["colleaguePK.colleagueId"], [
            DatasetFactory.createConstraint("mail", email, email, ConstraintType.MUST),
            DatasetFactory.createConstraint("active", "true", "true", ConstraintType.MUST)
        ], null);
        if (col != null && col.rowsCount > 0) return true;
    }
    return false;
}

function bts_texto(valor) {
    return (valor === null || valor === undefined) ? "" : String(valor).replace(/^\s+|\s+$/g, "");
}
