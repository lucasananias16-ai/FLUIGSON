/*
 * beforeTaskSave — SÓ na cópia de teste (liberacao_faturamento_medicao_test).
 *
 * Roda no SERVIDOR a cada envio (depois do beforeSendValidate do formulário), então vale também para
 * envios que não passam pela tela (API, integrações) e não pode ser burlado pelo navegador.
 *
 * 1. Campos obrigatórios por atividade:
 *    - Início (0/10): dados do pedido (PC, PV, C. Custo, valor, moeda) e pelo menos 1 item do PC.
 *    - Aprovações 1–4 (12/18/20/26), Medição (32) e Aprovação da NF (39): decisão obrigatória;
 *      "Solicitar Revisão" e "Reprovar" exigem comentário (txt_obsGeral).
 *      Reprovar (Aprovações 1–4: hd_aprovPc = "Reprovar"; Aprovação da NF: hd_aprovValNf = "reprovado")
 *      encerra a solicitação no fim "Reprovado" (atividade 100).
 *    - Revisão (28): comentário obrigatório (o que foi corrigido).
 *    - Adicionar NF (73): pelo menos 1 anexo incluído NESTA etapa pelo próprio responsável que está enviando.
 *      Anexos de etapas anteriores, ou incluídos por outra pessoa sem assumir a tarefa (complemento), não valem.
 *    - Medição dos Itens (32): pelo menos 1 item medido.
 * 2. Histórico: toda movimentação grava uma linha em tb_obsHistorico (etapa, data/hora,
 *    usuário, decisão e comentário) e limpa txt_obsGeral.
 * (Os níveis de aprovação existentes são calculados no beforeStateEntry, ao entrar na Aprovação 1.)
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
    if (BTS_ETAPAS[atual] === undefined) {
        return; // passagem por gateway automático: não é uma etapa do usuário
    }
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
        decisao = bts_decisao("hd_aprovPc", "Aprovado", "Revisar", obs, erros, "Reprovar");
    } else if (atual === "28") {
        if (obs === "") erros.push("comentário com o que foi corrigido na Revisão");
        decisao = "Reenviado após revisão";
    } else if (atual === "73") {
        var nf = bts_anexosDaEtapa("73");
        if (nf.length === 0) {
            erros.push("anexo da Nota Fiscal incluído por você nesta etapa (anexos de etapas anteriores ou de outros usuários não valem)");
        }
        decisao = "NF anexada" + (nf.length > 0 ? " (" + nf.join(", ") + ")" : "");
    } else if (atual === "32") {
        if (bts_contarFilhos("hd_itemMedido", "true") === 0) erros.push("pelo menos um item medido");
        decisao = bts_decisao("hd_valNfOk", "aprovado", "revisao", obs, erros, null);
    } else if (atual === "39") {
        decisao = bts_decisao("hd_aprovValNf", "aprovado", "revisao", obs, erros, "reprovado");
    } else if (atual === "46") {
        decisao = "Pagamento liberado";
    }

    if (erros.length > 0) {
        throw "Preencha antes de enviar: " + erros.join("; ") + ".";
    }

    bts_registrarHistorico(atual, decisao, obs);
}

// Decisão obrigatória; "revisão" e "reprovação" exigem comentário.
function bts_decisao(campo, aprovar, revisar, obs, erros, reprovar) {
    var v = bts_texto(hAPI.getCardValue(campo));
    if (v.toLowerCase() === aprovar.toLowerCase()) return "Aprovado";
    if (reprovar !== null && v.toLowerCase() === reprovar.toLowerCase()) {
        if (obs === "") erros.push("comentário explicando o motivo da reprovação");
        return "Reprovado";
    }
    if (v.toLowerCase() === revisar.toLowerCase()) {
        if (obs === "") erros.push("comentário explicando o motivo da revisão");
        return "Revisão solicitada";
    }
    erros.push("decisão (" + (reprovar !== null ? "Aprovar, Solicitar Revisão ou Reprovar" : "Aprovar ou Solicitar Revisão") + ")");
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


// Anexos (sem o registro de formulário) incluídos na passagem ATUAL pela etapa, pelo usuário que está enviando
// (ou pelo substituto dele). Devolve as descrições.
// - Movimento de entrada na etapa: maior movimento de processHistory com essa atividade.
// - processAttachment guarda, por anexo, quem anexou (colleagueId) e em qual movimento (originalMovementSequence).
// - Anexo enviado junto com este envio ainda pode não estar em processAttachment: vale se o documento foi
//   criado pelo próprio usuário.
function bts_anexosDaEtapa(etapa) {
    var num = String(getValue("WKNumProces"));
    var usuarios = {};
    usuarios[String(getValue("WKUser"))] = true;
    var substituto = getValue("WKReplacement");
    if (substituto != null && String(substituto) !== "") usuarios[String(substituto)] = true;

    var cNum = DatasetFactory.createConstraint("processHistoryPK.processInstanceId", num, num, ConstraintType.MUST);
    var hist = DatasetFactory.getDataset("processHistory", null, [cNum], null);
    var movEntrada = -1;
    for (var h = 0; hist != null && h < hist.rowsCount; h++) {
        if (String(hist.getValue(h, "stateSequence")) !== etapa) continue;
        var mov = parseInt(String(hist.getValue(h, "processHistoryPK.movementSequence")), 10);
        if (mov > movEntrada) movEntrada = mov;
    }

    var cAnexo = DatasetFactory.createConstraint("processAttachmentPK.processInstanceId", num, num, ConstraintType.MUST);
    var reg = DatasetFactory.getDataset("processAttachment", null, [cAnexo], null);
    var gravados = {};
    for (var r = 0; reg != null && r < reg.rowsCount; r++) {
        gravados[String(reg.getValue(r, "documentId"))] = {
            usuario: String(reg.getValue(r, "colleagueId")),
            mov: parseInt(String(reg.getValue(r, "originalMovementSequence")), 10)
        };
    }

    var cardId = String(getValue("WKCardId"));
    var lista = hAPI.listAttachments();
    var nomes = [];
    var ignorados = [];
    for (var i = 0; lista != null && i < lista.size(); i++) {
        var doc = lista.get(i);
        var id = String(doc.getDocumentId());
        if (id === cardId) continue;
        var g = gravados[id];
        var autor = g ? g.usuario : String(doc.getColleagueId());
        var nestaEtapa = g ? (movEntrada < 0 || g.mov >= movEntrada) : true;
        var nome = String(doc.getDocumentDescription());
        if (usuarios[autor] === true && nestaEtapa) {
            nomes.push(nome);
        } else {
            ignorados.push(nome + " [por " + autor + (g ? ", mov. " + g.mov : "") + "]");
        }
    }
    log.info("[liberacao_faturamento_medicao_test.beforeTaskSave] solicitação " + num + " etapa " + etapa +
             " (entrada no mov. " + movEntrada + "): anexos válidos " + nomes.length +
             (ignorados.length > 0 ? " | não valem: " + ignorados.join("; ") : ""));
    return nomes;
}

function bts_texto(valor) {
    return (valor === null || valor === undefined) ? "" : String(valor).replace(/^\s+|\s+$/g, "");
}
