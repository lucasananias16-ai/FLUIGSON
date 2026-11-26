// function resolve(process, colleague) {

//     var PROX_ETAPA = process.chosenState.processStatePK.sequence;
//     var userList = new java.util.ArrayList();

//     try {
//         var ccusto = hAPI.getCardValue("hd_codCCusto");
//         var valTotalStr = hAPI.getCardValue("txt_valTotalPc");

//         if (valTotalStr == null || valTotalStr == "") {
//             valTotalStr = "0,00";
//         }

//         var mapaNiveis = {
//             "12": "1",
//             "18": "2",
//             "20": "3",
//             "26": "4"
//         };

//         var nivelEsperado = mapaNiveis[String(PROX_ETAPA)];

//         log.info("--- MECANISMO ATRIBUICAO -> ENVIANDO FILTROS - CC: " + ccusto + " | LVL: " + nivelEsperado + " | VALOR: " + valTotalStr);

//         if (ccusto != null && ccusto != "" && nivelEsperado != undefined) {
//             var c1 = DatasetFactory.createConstraint('COD_CCUSTO', ccusto, ccusto, ConstraintType.MUST);
//             var c2 = DatasetFactory.createConstraint('NIVEL', nivelEsperado, nivelEsperado, ConstraintType.MUST);
//             var c3 = DatasetFactory.createConstraint('VALOR_LIMITE', valTotalStr, valTotalStr, ConstraintType.MUST);

//             var dsUsuarios = DatasetFactory.getDataset('dts_consultUsuariosPosicoes', null, [c1, c2, c3], null);

//             if (dsUsuarios != null && dsUsuarios.rowsCount > 0) {
//                 for (var i = 0; i < dsUsuarios.rowsCount; i++) {

//                     var email = dsUsuarios.getValue(i, "usrPos_email"); 
//                     log.info("Email encontrado: " + email)

//                     if (email != null && email != "") {
//                         var cEmail = DatasetFactory.createConstraint('mail', email, email, ConstraintType.MUST);
//                         var dsColleague = DatasetFactory.getDataset('colleague', ["colleaguePK.colleagueId"], [cEmail], null);

//                         if (dsColleague != null && dsColleague.rowsCount > 0) {
//                             var matricula = dsColleague.getValue(0, "colleaguePK.colleagueId");

//                             log.info("Matricula Adicionada: " + matricula)

//                             if (!userList.contains(matricula)) {
//                                 userList.add(matricula);
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     } catch (e) {
//         log.error("--- ERRO NO MECANISMO DE ATRIBUIÃÃO: " + e.toString());
//     }

//     if (userList.isEmpty()) {
//         log.info("--- NENHUM USUARIO ENCONTRADO, ATRIBUINDO PARA ADMIN");
//         userList.add("admin");
//     }

//     return userList;
// }

function resolve(process, colleague) {

    var PROX_ETAPA = process.chosenState.processStatePK.sequence;
    var userList = new java.util.ArrayList();

    try {
        var ccusto = hAPI.getCardValue("hd_codCCusto");
        var valTotalStr = hAPI.getCardValue("txt_valTotalPc");
        var moeda = hAPI.getCardValue("txt_dadosPc_moeda"); // <-- Captura a moeda do formulÃ¡rio

        if (valTotalStr == null || valTotalStr == "") {
            valTotalStr = "0,00";
        }

        if (moeda == null || moeda == "") {
            moeda = "1"; // Default BRL caso esteja vazio
        }

        var mapaNiveis = {
            "12": "1",
            "18": "2",
            "20": "3",
            "26": "4"
        };

        var nivelEsperado = mapaNiveis[String(PROX_ETAPA)];

        log.info("--- MECANISMO ATRIBUICAO -> ENVIANDO FILTROS - CC: " + ccusto + " | LVL: " + nivelEsperado + " | VALOR: " + valTotalStr + " | MOEDA: " + moeda);

        if (ccusto != null && ccusto != "" && nivelEsperado != undefined) {
            var c1 = DatasetFactory.createConstraint('COD_CCUSTO', ccusto, ccusto, ConstraintType.MUST);
            var c2 = DatasetFactory.createConstraint('NIVEL', nivelEsperado, nivelEsperado, ConstraintType.MUST);
            var c3 = DatasetFactory.createConstraint('VALOR_LIMITE', valTotalStr, valTotalStr, ConstraintType.MUST);
            var c4 = DatasetFactory.createConstraint('MOEDA', moeda, moeda, ConstraintType.MUST); // <-- Nova constraint
            var c5 = DatasetFactory.createConstraint('TIPO_LIMITE', 'PROC', 'PROC', ConstraintType.MUST); // <-- Nova constraint (Procurement)

            var dsUsuarios = DatasetFactory.getDataset('dts_consultUsuariosPosicoes', null, [c1, c2, c3, c4, c5], null);

            if (dsUsuarios != null && dsUsuarios.rowsCount > 0) {
                for (var i = 0; i < dsUsuarios.rowsCount; i++) {

                    var email = dsUsuarios.getValue(i, "usrPos_email");
                    log.info("Email encontrado: " + email);

                    if (email != null && email != "") {
                        var cEmail = DatasetFactory.createConstraint('mail', email, email, ConstraintType.MUST);
                        var dsColleague = DatasetFactory.getDataset('colleague', ["colleaguePK.colleagueId"], [cEmail], null);

                        if (dsColleague != null && dsColleague.rowsCount > 0) {
                            var matricula = dsColleague.getValue(0, "colleaguePK.colleagueId");

                            log.info("Matricula Adicionada: " + matricula);

                            if (!userList.contains(matricula)) {
                                userList.add(matricula);
                            }
                        }
                    }
                }
            }
        }
    } catch (e) {
        log.error("--- ERRO NO MECANISMO DE ATRIBUIÃÃO: " + e.toString());
    }

    if (userList.isEmpty()) {
        log.info("--- NENHUM USUARIO ENCONTRADO, ATRIBUINDO PARA ADMIN");
        userList.add("admin");
    }

    return userList;
}
