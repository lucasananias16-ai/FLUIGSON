/*
 * beforeStateEntry — SÓ na cópia de teste (liberacao_faturamento_medicao_test).
 *
 * Antes de a solicitação entrar numa Aprovação (12, 18, 20, 26), confere se existe aprovador
 * ATIVO na alçada (C. Custo + nível + valor + moeda). Se não existir, lança erro: o Fluig
 * desfaz a movimentação e mostra a mensagem a quem enviou.
 *
 * Motivo: o mecanismo atribuicao_centro_custo atribui ao "admin" quando não acha aprovador
 * (e também em qualquer erro), então a solicitação seguia em vez de barrar.
 * Limitação: a atribuição continua com o mecanismo original. Quando houver aprovadores ativos,
 * ele ainda pode incluir cadastros inativos; isso só se corrige com o mecanismo _test.
 */
function beforeStateEntry(sequenceId) {
    var NIVEIS = { "12": "1", "18": "2", "20": "3", "26": "4" };
    var nivel = NIVEIS[String(sequenceId)];
    if (nivel === undefined) {
        return;
    }

    var ccusto = texto(hAPI.getCardValue("hd_codCCusto"));
    var valor = texto(hAPI.getCardValue("txt_valTotalPc"));
    var moeda = texto(hAPI.getCardValue("txt_dadosPc_moeda"));

    if (ccusto === "") {
        throw "Não foi possível definir o aprovador: o Centro de Custo do pedido está vazio.";
    }
    if (valor === "") {
        throw "Não foi possível definir o aprovador: o valor total do pedido está vazio.";
    }
    if (moeda !== "1" && moeda !== "2") {
        throw "Não foi possível definir o aprovador: moeda do pedido inválida ('" + moeda + "'). Esperado 1 (BRL) ou 2 (USD).";
    }

    var constraints = [
        DatasetFactory.createConstraint("COD_CCUSTO", ccusto, ccusto, ConstraintType.MUST),
        DatasetFactory.createConstraint("NIVEL", nivel, nivel, ConstraintType.MUST),
        DatasetFactory.createConstraint("VALOR_LIMITE", valor, valor, ConstraintType.MUST),
        DatasetFactory.createConstraint("MOEDA", moeda, moeda, ConstraintType.MUST),
        DatasetFactory.createConstraint("TIPO_LIMITE", "PROC", "PROC", ConstraintType.MUST),
        DatasetFactory.createConstraint("ATIVO", "Sim", "Sim", ConstraintType.MUST)
    ];

    var ds = DatasetFactory.getDataset("dts_consultUsuariosPosicoes", null, constraints, null);
    var total = (ds == null) ? 0 : ds.rowsCount;
    var comUsuario = 0;
    var semUsuario = [];

    for (var i = 0; i < total; i++) {
        var email = texto(ds.getValue(i, "usrPos_email"));
        if (email === "") {
            continue;
        }
        var cEmail = DatasetFactory.createConstraint("mail", email, email, ConstraintType.MUST);
        var cAtivo = DatasetFactory.createConstraint("active", "true", "true", ConstraintType.MUST);
        var col = DatasetFactory.getDataset("colleague", ["colleaguePK.colleagueId"], [cEmail, cAtivo], null);
        if (col != null && col.rowsCount > 0) {
            comUsuario++;
        } else {
            semUsuario.push(email);
        }
    }

    log.info("[liberacao_faturamento_medicao_test.beforeStateEntry] atividade " + sequenceId +
             " | CC " + ccusto + " | nível " + nivel + " | aprovadores ativos com usuário: " + comUsuario);

    if (String(sequenceId) === "12" && comUsuario > 0) {
        // Níveis 2-4 com aprovador ativo, gravados em hd_nvlPcAprov (campo que o main.js não altera) e lidos
        // pelos gateways 80/84/87. O main.js preenche hd_hasAprov* com C. Custo/valor fixos de teste.
        var niveis = ["1"];
        for (var nv = 2; nv <= 4; nv++) {
            if (bse_temAprovadorAtivo(ccusto, String(nv), valor, moeda)) niveis.push(String(nv));
        }
        hAPI.setCardValue("hd_nvlPcAprov", niveis.join(","));
        log.info("[liberacao_faturamento_medicao_test.beforeStateEntry] níveis com aprovador ativo: " + niveis.join(","));
    }

    if (comUsuario === 0) {
        var simbolo = (moeda === "2") ? "USD" : "BRL";
        throw "Não há aprovador ativo de nível " + nivel + " para o Centro de Custo " + ccusto +
              " com limite para " + simbolo + " " + valor +
              ". Verifique 'Atribuição de Usuários e Posições' e 'Alçada por Posição'." +
              (semUsuario.length > 0 ? " E-mails sem usuário ativo no Fluig: " + semUsuario.join(", ") + "." : "");
    }
}

function texto(valor) {
    return (valor === null || valor === undefined) ? "" : String(valor).replace(/^\s+|\s+$/g, "");
}

function bse_temAprovadorAtivo(ccusto, nivel, valor, moeda) {
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
        var email = texto(ds.getValue(i, "usrPos_email"));
        if (email === "") continue;
        var col = DatasetFactory.getDataset("colleague", ["colleaguePK.colleagueId"], [
            DatasetFactory.createConstraint("mail", email, email, ConstraintType.MUST),
            DatasetFactory.createConstraint("active", "true", "true", ConstraintType.MUST)
        ], null);
        if (col != null && col.rowsCount > 0) return true;
    }
    return false;
}
