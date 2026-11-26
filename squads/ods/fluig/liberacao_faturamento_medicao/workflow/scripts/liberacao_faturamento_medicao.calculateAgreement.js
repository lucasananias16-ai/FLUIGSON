/****** 
** Enable customization script to change agreement calculation. 
** Input: 
**	stateId -> Current state, whose agreement percentage is being calculated. 
**	agreementData.get("currentPercentage") -> Current percentage, calculated by the workflow engine
**	agreementData.get("currentDestState") -> Current destination state. Zero, if process won't move
**	agreementData.get("currentDestUsers") -> Current destination users. Empty if process won't move
**/
//function calculateAgreement(currentState, agreementData) {
//		var userList = new java.util.ArrayList();
//    	userList.add("otavio.coelho");
//    	userList.add("admin");
//    	
//    	if(currentState == 12 || currentState == 12.0 || currentState == 68){
//    		agreementData.put("currentPercentage", 100);
//            agreementData.put("currentDestState", 18);
//            agreementData.put("currentDestUsers", "otavio.coelho,admin");
//    	}
//    	
//    	if(currentState == 18 || currentState == 18.0){
//    		agreementData.put("currentPercentage", 100);
//            agreementData.put("currentDestState", 20); // Independente ele força para essa posição.
//            agreementData.put("currentDestUsers", "admin");
//    	}
//}

// function calculateAgreement(currentState, agreementData) {
//     var proximaEtapa = 0;

//     var APROV_UM = 12;
//     var APROV_DOIS = 18;
//     var APROV_TRES = 20;
//     var APROV_QUATRO = 26;

//     var GAT_UM = 80;
//     var GAT_DOIS = 84;
//     var GAT_TRES = 87;
//     var GAT_QUATRO = 90;

//     var ccusto = hAPI.getCardValue("hd_codCCusto");
//     var valTotalStr = hAPI.getCardValue("txt_valTotalPc");
//     var matriculas = "";
//     var NIVEL_APROV = "1"

//     if (currentState == "12") { NIVEL_APROV = "1" }
//     if (currentState == "18") { NIVEL_APROV = "2" }
//     if (currentState == "20") { NIVEL_APROV = "3" }
//     if (currentState == "26") { NIVEL_APROV = "4" }

//     var c1 = DatasetFactory.createConstraint('CCUSTO', ccusto, ccusto, ConstraintType.MUST);
//     var c2 = DatasetFactory.createConstraint('NIVEL', NIVEL_APROV, NIVEL_APROV, ConstraintType.MUST);
//     var c3 = DatasetFactory.createConstraint('VALOR_LIMITE', valTotalStr, valTotalStr, ConstraintType.MUST);

//     var dsUsuarios = DatasetFactory.getDataset('dts_consultUsuariosPosicoes', null, [c1, c2, c3], null);

//     if (dsUsuarios != null && dsUsuarios.rowsCount > 0) {
//         for (var i = 0; i < dsUsuarios.rowsCount; i++) {

//             var email = dsUsuarios.getValue(i, "usrPos_email");
//             log.info("Email encontrado: " + email)

//             if (email != null && email != "") {
//                 var cEmail = DatasetFactory.createConstraint('mail', email, email, ConstraintType.MUST);
//                 var dsColleague = DatasetFactory.getDataset('colleague', ["colleaguePK.colleagueId"], [cEmail], null);

//                 if (dsColleague != null && dsColleague.rowsCount > 0) {
//                     matriculas += dsColleague.getValue(0, "colleaguePK.colleagueId") + ",";
//                 }
//             }
//         }
//     }

//     if (currentState == APROV_UM) {
//         proximaEtapa = GAT_UM;
//     }
//     else if (currentState == APROV_DOIS) {
//         proximaEtapa = GAT_DOIS;
//     }

//     else if (currentState == APROV_TRES) {
//         proximaEtapa = GAT_TRES;
//     }

//     else if (currentState == APROV_QUATRO) {
//         proximaEtapa = GAT_QUATRO;
//     }

//     if (proximaEtapa > 0) {
//         agreementData.put("currentPercentage", 100);
//         agreementData.put("currentDestState", proximaEtapa);
//         agreementData.put("currentDestUsers", "System:Auto");
//         //log.info("MAtriculas Atribuidas: " + matriculas)
//         //agreementData.put("currentDestUsers", matriculas);
//     }
// }

function calculateAgreement(currentState, agreementData) {
    var proximaEtapa = 0;

    var APROV_UM = 12;
    var APROV_DOIS = 18;
    var APROV_TRES = 20;
    var APROV_QUATRO = 26;

    var GAT_UM = 80;
    var GAT_DOIS = 84;
    var GAT_TRES = 87;
    var GAT_QUATRO = 90;

    var ccusto = hAPI.getCardValue("hd_codCCusto");
    var valTotalStr = hAPI.getCardValue("txt_valTotalPc");
    var moeda = hAPI.getCardValue("txt_dadosPc_moeda");
    var matriculas = "";
    var NIVEL_APROV = "1";

    if (valTotalStr == null || valTotalStr == "") {
        valTotalStr = "0,00";
    }

    if (moeda == null || moeda == "") {
        moeda = "1";
    }

    if (currentState == "12") { NIVEL_APROV = "1"; }
    if (currentState == "18") { NIVEL_APROV = "2"; }
    if (currentState == "20") { NIVEL_APROV = "3"; }
    if (currentState == "26") { NIVEL_APROV = "4"; }

    // Constraints ajustadas para passar Moeda e Tipo de Limite
    var c1 = DatasetFactory.createConstraint('COD_CCUSTO', ccusto, ccusto, ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint('NIVEL', NIVEL_APROV, NIVEL_APROV, ConstraintType.MUST);
    var c3 = DatasetFactory.createConstraint('VALOR_LIMITE', valTotalStr, valTotalStr, ConstraintType.MUST);
    var c4 = DatasetFactory.createConstraint('MOEDA', moeda, moeda, ConstraintType.MUST); // <-- Moeda (1 ou 2)
    var c5 = DatasetFactory.createConstraint('TIPO_LIMITE', 'PROC', 'PROC', ConstraintType.MUST); // <-- Procurement/Compras

    var dsUsuarios = DatasetFactory.getDataset('dts_consultUsuariosPosicoes', null, [c1, c2, c3, c4, c5], null);

    if (dsUsuarios != null && dsUsuarios.rowsCount > 0) {
        for (var i = 0; i < dsUsuarios.rowsCount; i++) {

            var email = dsUsuarios.getValue(i, "usrPos_email");
            log.info("Email encontrado: " + email);

            if (email != null && email != "") {
                var cEmail = DatasetFactory.createConstraint('mail', email, email, ConstraintType.MUST);
                var dsColleague = DatasetFactory.getDataset('colleague', ["colleaguePK.colleagueId"], [cEmail], null);

                if (dsColleague != null && dsColleague.rowsCount > 0) {
                    matriculas += dsColleague.getValue(0, "colleaguePK.colleagueId") + ",";
                }
            }
        }
    }

    if (currentState == APROV_UM) {
        proximaEtapa = GAT_UM;
    }
    else if (currentState == APROV_DOIS) {
        proximaEtapa = GAT_DOIS;
    }
    else if (currentState == APROV_TRES) {
        proximaEtapa = GAT_TRES;
    }
    else if (currentState == APROV_QUATRO) {
        proximaEtapa = GAT_QUATRO;
    }

    if (proximaEtapa > 0) {
        agreementData.put("currentPercentage", 100);
        agreementData.put("currentDestState", proximaEtapa);
        agreementData.put("currentDestUsers", "System:Auto");
        //log.info("Matriculas Atribuidas: " + matriculas);
        //agreementData.put("currentDestUsers", matriculas);
    }
}