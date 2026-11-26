/*
 * atribuicao_centro_custo_test — CÓPIA DE TESTE do mecanismo atribuicao_centro_custo.
 * Usada só pela cópia do processo (liberacao_faturamento_medicao_test). O mecanismo original
 * continua como está.
 *
 * Correções em relação ao original:
 *  1. Sem aprovador: em vez de atribuir ao "admin", lança erro com mensagem clara. O Fluig
 *     impede a movimentação, e quem envia vê qual alçada falta parametrizar.
 *     Erro técnico (dataset fora do ar, campo vazio etc.) também lança erro, em vez de cair
 *     em silêncio no "admin".
 *  3. Considera só cadastros ativos em "Atribuição de Usuários e Posições" (Ativo = "Sim").
 * Também registra no log quando um e-mail da alçada não tem usuário no Fluig.
 */

var MAPA_NIVEIS = { "12": "1", "18": "2", "20": "3", "26": "4" };
var LOG_ID = "[atribuicao_centro_custo_test] ";

function resolve(process, colleague) {
    var proxEtapa = String(process.chosenState.processStatePK.sequence);
    var nivel = MAPA_NIVEIS[proxEtapa];
    if (nivel === undefined) {
        throw "Mecanismo atribuicao_centro_custo_test usado na atividade " + proxEtapa +
              ", que não é uma aprovação (12, 18, 20 ou 26).";
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

    log.info(LOG_ID + "CC: " + ccusto + " | nível: " + nivel + " | valor: " + valor + " | moeda: " + moeda);

    var constraints = [
        DatasetFactory.createConstraint("COD_CCUSTO", ccusto, ccusto, ConstraintType.MUST),
        DatasetFactory.createConstraint("NIVEL", nivel, nivel, ConstraintType.MUST),
        DatasetFactory.createConstraint("VALOR_LIMITE", valor, valor, ConstraintType.MUST),
        DatasetFactory.createConstraint("MOEDA", moeda, moeda, ConstraintType.MUST),
        DatasetFactory.createConstraint("TIPO_LIMITE", "PROC", "PROC", ConstraintType.MUST),
        DatasetFactory.createConstraint("ATIVO", "Sim", "Sim", ConstraintType.MUST) // correção 3
    ];

    var dsUsuarios;
    try {
        dsUsuarios = DatasetFactory.getDataset("dts_consultUsuariosPosicoes", null, constraints, null);
    } catch (e) {
        log.error(LOG_ID + "erro ao consultar dts_consultUsuariosPosicoes: " + e);
        throw "Erro ao consultar a alçada de aprovação: " + e;
    }

    var userList = new java.util.ArrayList();
    var semUsuario = [];
    var total = (dsUsuarios == null) ? 0 : dsUsuarios.rowsCount;

    for (var i = 0; i < total; i++) {
        var email = texto(dsUsuarios.getValue(i, "usrPos_email"));
        if (email === "") {
            continue;
        }
        var cEmail = DatasetFactory.createConstraint("mail", email, email, ConstraintType.MUST);
        var cAtivo = DatasetFactory.createConstraint("active", "true", "true", ConstraintType.MUST);
        var dsColleague = DatasetFactory.getDataset("colleague", ["colleaguePK.colleagueId"], [cEmail, cAtivo], null);

        if (dsColleague != null && dsColleague.rowsCount > 0) {
            var matricula = String(dsColleague.getValue(0, "colleaguePK.colleagueId"));
            if (!userList.contains(matricula)) {
                userList.add(matricula);
            }
        } else {
            semUsuario.push(email);
        }
    }

    if (semUsuario.length > 0) {
        log.warn(LOG_ID + "aprovadores sem usuário ativo no Fluig: " + semUsuario.join(", "));
    }

    if (userList.isEmpty()) { // correção 1
        var simbolo = (moeda === "2") ? "USD" : "BRL";
        throw "Não há aprovador ativo de nível " + nivel + " para o Centro de Custo " + ccusto +
              " com limite para " + simbolo + " " + valor +
              ". Verifique 'Atribuição de Usuários e Posições' e 'Alçada por Posição'." +
              (semUsuario.length > 0 ? " E-mails sem usuário ativo no Fluig: " + semUsuario.join(", ") + "." : "");
    }

    log.info(LOG_ID + "aprovadores: " + userList);
    return userList;
}

function texto(valor) {
    return (valor === null || valor === undefined) ? "" : String(valor).replace(/^\s+|\s+$/g, "");
}
