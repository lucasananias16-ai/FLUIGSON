// function defineStructure() {
//     addColumn("MATRICULA", DatasetBuilder.STRING);
//     addColumn("NOME", DatasetBuilder.STRING);
//     addColumn("EMAIL", DatasetBuilder.STRING);
//     addColumn("DEPARTAMENTO_COD", DatasetBuilder.STRING);
//     addColumn("DEPARTAMENTO_DESC", DatasetBuilder.STRING);
//     addColumn("FUNCAO_COD", DatasetBuilder.STRING);
//     addColumn("FUNCAO_DESC", DatasetBuilder.STRING);
//     addColumn("FILTER", DatasetBuilder.STRING);
//     addColumn("SITUACAO_COD", DatasetBuilder.STRING);
//     addColumn("SITUACAO_DESC", DatasetBuilder.STRING);
//     addColumn("DATA_DEMISSAO", DatasetBuilder.STRING);
//     addColumn("BLOQUEADO", DatasetBuilder.STRING);

//     setKey(["MATRICULA"]);
//     addIndex(["MATRICULA"]);
//     addIndex(["NOME"]);
// }

// function onSync(lastSyncDate) {
//     var dataset = DatasetBuilder.newDataset();

//     dataset.addColumn("MATRICULA");
//     dataset.addColumn("NOME");
//     dataset.addColumn("EMAIL");
//     dataset.addColumn("DEPARTAMENTO_COD");
//     dataset.addColumn("DEPARTAMENTO_DESC");
//     dataset.addColumn("FUNCAO_COD");
//     dataset.addColumn("FUNCAO_DESC");
//     dataset.addColumn("FILTER");
//     dataset.addColumn("SITUACAO_COD");
//     dataset.addColumn("SITUACAO_DESC");
//     dataset.addColumn("DATA_DEMISSAO");
//     dataset.addColumn("BLOQUEADO");

//     try {
//         // 1. Busca credenciais dinâmicas do dataset connector
//         var dsConnector = DatasetFactory.getDataset("dts_connectorProtheus_JYNX", null, null, null);
//         var ckey = dsConnector.getValue(0, "CKEY");
//         var cuser = dsConnector.getValue(0, "CUSER");
//         var cpassw = dsConnector.getValue(0, "CPASSW");

//         // 2. Instancia o Web Service SOAP do Protheus
//         var servicoProvider = ServiceManager.getService("INTERFACE_JYNX");
//         var serviceLocator = servicoProvider.instantiate("br.com.cloudtotvs.protheus.odsdo175312._4040.INTERFACEMFX");
//         var serviceResult = serviceLocator.getINTERFACEMFXSOAP();

//         var authenticatedService = servicoProvider.getBasicAuthenticatedClient(
//             serviceResult, 
//             "br.com.cloudtotvs.protheus.odsdo175312._4040.INTERFACEMFXSOAP", 
//             cuser, 
//             cpassw
//         );

//         var objLogin = servicoProvider.instantiate("br.com.cloudtotvs.protheus.odsdo175312._4040.USUARIO");
//         objLogin.setCUSER(cuser);
//         objLogin.setCPASSW(cpassw);
//         objLogin.setCKEY(ckey);

//         // 3. Montagem da Query com SELECT explícito
//         var prefixo = '160';
//         var limiteResultados = 50000;

//         var qCampos = " SELECT TOP " + limiteResultados + " SRA.RA_MAT, SRA.RA_NOME, SRA.RA_EMAIL, SRA.RA_DEPTO, ISNULL(SQB.QB_DESCRIC, ''), SRA.RA_CODFUNC, ISNULL(SRJ.RJ_DESC, ''), (SRA.RA_MAT + ' - ' + SRA.RA_NOME), " +
//                       "ISNULL(SRA.RA_SITFOLH, ''), ISNULL(SRA.RA_DEMISSA, ''), ISNULL(SRA.RA_MSBLQL, '2') " +
//                       "FROM SRA" + prefixo + " SRA " +
//                       "LEFT JOIN SRJ" + prefixo + " SRJ ON SRJ.RJ_FUNCAO = SRA.RA_CODFUNC AND SRJ.D_E_L_E_T_ = ' ' " +
//                       "LEFT JOIN SQB" + prefixo + " SQB ON SQB.QB_DEPTO = SRA.RA_DEPTO AND SQB.D_E_L_E_T_ = ' '";

//         var filtroWhere = "WHERE SRA.D_E_L_E_T_ = ' '";
//         var qOrder = "ORDER BY SRA.RA_NOME ASC";

//         var resultado = authenticatedService.execqry(objLogin, "GEN_01", qCampos, filtroWhere, qOrder);

//         if (resultado != null) {
//             var aLinhas = resultado.getSTRING().toArray();

//             for (var j = 1; j < aLinhas.length; j++) {
//                 var linhaCorrente = String(aLinhas[j]);

//                 if (linhaCorrente.indexOf("=>") == -1 && linhaCorrente.indexOf("#ERRO#") == -1) {
//                     var colunas = linhaCorrente.split(";");

//                     var situacaoCod  = colunas.length > 8 ? colunas[8].trim() : "";
//                     var dataDemissao = colunas.length > 9 ? colunas[9].trim() : "";
//                     var msblql       = colunas.length > 10 ? colunas[10].trim() : "2";

//                     var situacaoDesc = "Ativo";
//                     if (situacaoCod == "D") {
//                         situacaoDesc = "Demitido";
//                     } else if (situacaoCod == "F") {
//                         situacaoDesc = "Férias";
//                     } else if (situacaoCod == "A" || situacaoCod == "P" || situacaoCod == "T") {
//                         situacaoDesc = "Afastado";
//                     } else if (situacaoCod != "") {
//                         situacaoDesc = "Outros (" + situacaoCod + ")";
//                     }

//                     var bloqueadoDesc = (msblql == "1") ? "Sim" : "Não";

//                     dataset.addRow([
//                         colunas.length > 0 ? colunas[0].trim() : "", 
//                         colunas.length > 1 ? colunas[1].trim() : "", 
//                         colunas.length > 2 ? colunas[2].trim() : "", 
//                         colunas.length > 3 ? colunas[3].trim() : "", 
//                         colunas.length > 4 ? colunas[4].trim() : "", 
//                         colunas.length > 5 ? colunas[5].trim() : "", 
//                         colunas.length > 6 ? colunas[6].trim() : "", 
//                         colunas.length > 7 ? colunas[7].trim() : "", 
//                         situacaoCod,                                 
//                         situacaoDesc,                                
//                         dataDemissao,                                
//                         bloqueadoDesc                                
//                     ]);
//                 }
//             }
//         }

//     } catch(erro) {
//         log.error("## ERRO JORNALIZACAO PROTHEUS (ONSYNC) - BUSCA DE COLABORADORES: " + erro);
//     }

//     return dataset;
// }

// function createDataset(fields, constraints, sortFields) {
//     return onSync(null);
// }

function defineStructure() {
    addColumn("ID_USUARIO", DatasetBuilder.STRING);
    addColumn("LOGIN", DatasetBuilder.STRING);
    addColumn("NOME", DatasetBuilder.STRING);
    addColumn("EMAIL", DatasetBuilder.STRING);
    addColumn("DEPARTAMENTO", DatasetBuilder.STRING);
    addColumn("CARGO", DatasetBuilder.STRING);
    addColumn("BLOQUEADO", DatasetBuilder.STRING);
    addColumn("FILTER", DatasetBuilder.STRING);

    setKey(["ID_USUARIO"]);
    addIndex(["ID_USUARIO"]);
    addIndex(["LOGIN"]);
    addIndex(["NOME"]);
}

function onSync(lastSyncDate) {
    var dataset = DatasetBuilder.newDataset();

    dataset.addColumn("ID_USUARIO");
    dataset.addColumn("LOGIN");
    dataset.addColumn("NOME");
    dataset.addColumn("EMAIL");
    dataset.addColumn("DEPARTAMENTO");
    dataset.addColumn("CARGO");
    dataset.addColumn("BLOQUEADO");
    dataset.addColumn("FILTER");

    try {
        // 1. Credenciais dinâmicas do dataset connector
        var dsConnector = DatasetFactory.getDataset("dts_connectorProtheus_JYNX", null, null, null);
        var ckey = dsConnector.getValue(0, "CKEY");
        var cuser = dsConnector.getValue(0, "CUSER");
        var cpassw = dsConnector.getValue(0, "CPASSW");

        // 2. Web Service SOAP do Protheus
        var servicoProvider = ServiceManager.getService("INTERFACE_JYNX");
        var serviceLocator = servicoProvider.instantiate("br.com.cloudtotvs.protheus.odsdo175312._4040.INTERFACEMFX");
        var serviceResult = serviceLocator.getINTERFACEMFXSOAP();

        var authenticatedService = servicoProvider.getBasicAuthenticatedClient(
            serviceResult,
            "br.com.cloudtotvs.protheus.odsdo175312._4040.INTERFACEMFXSOAP",
            cuser,
            cpassw
        );

        var objLogin = servicoProvider.instantiate("br.com.cloudtotvs.protheus.odsdo175312._4040.USUARIO");
        objLogin.setCUSER(cuser);
        objLogin.setCPASSW(cpassw);
        objLogin.setCKEY(ckey);

        // 3. Query na SYS_USR (SIGACFG) - tabela de sistema, sem prefixo de empresa
        var limiteResultados = 50000;

        var qCampos = " SELECT TOP " + limiteResultados +
                      " USR.USR_ID, USR.USR_CODIGO, USR.USR_NOME, " +
                      "ISNULL(USR.USR_EMAIL, ''), ISNULL(USR.USR_DEPTO, ''), ISNULL(USR.USR_CARGO, ''), " +
                      "ISNULL(USR.USR_MSBLQL, '2') " +
                      "FROM SYS_USR USR";

        var filtroWhere = "WHERE USR.D_E_L_E_T_ = ' '";
        var qOrder = "ORDER BY USR.USR_NOME ASC";

        var resultado = authenticatedService.execqry(objLogin, "GEN_01", qCampos, filtroWhere, qOrder);

        if (resultado != null) {
            var aLinhas = resultado.getSTRING().toArray();

            for (var j = 1; j < aLinhas.length; j++) {
                var linhaCorrente = String(aLinhas[j]);

                if (linhaCorrente.indexOf("=>") == -1 && linhaCorrente.indexOf("#ERRO#") == -1) {
                    var colunas = linhaCorrente.split(";");

                    var idUsuario = colunas.length > 0 ? colunas[0].trim() : "";
                    var nome      = colunas.length > 2 ? colunas[2].trim() : "";
                    var filtro    = idUsuario + " - " + nome;

                    // USR_MSBLQL: 1 = Bloqueado, 2 = Ativo
                    var msblql = colunas.length > 6 ? colunas[6].trim() : "2";
                    var bloqueadoDesc = (msblql == "1") ? "Sim" : "Não";

                    dataset.addRow([
                        idUsuario,                                    // ID_USUARIO
                        colunas.length > 1 ? colunas[1].trim() : "",  // LOGIN (USR_CODIGO)
                        nome,                                         // NOME
                        colunas.length > 3 ? colunas[3].trim() : "",  // EMAIL
                        colunas.length > 4 ? colunas[4].trim() : "",  // DEPARTAMENTO
                        colunas.length > 5 ? colunas[5].trim() : "",  // CARGO
                        bloqueadoDesc,                                // BLOQUEADO
                        filtro                                        // FILTER
                    ]);
                } else {
                    // Registra o motivo real no server.log em vez de descartar em silêncio
                    log.error("## PROTHEUS SYS_USR - LINHA RETORNADA COM ERRO: " + linhaCorrente);
                }
            }
        }

    } catch(erro) {
        log.error("## ERRO JORNALIZACAO PROTHEUS (ONSYNC) - BUSCA DE USUARIOS SIGACFG: " + erro);
    }

    return dataset;
}

function createDataset(fields, constraints, sortFields) {
    return onSync(null);
}