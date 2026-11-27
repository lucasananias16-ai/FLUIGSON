/*
 * dts_getColabProtheus_JYNX — colaboradores do Protheus para a tela "Atribuição de Usuários e Posições".
 * Dataset SINCRONIZADO (defineStructure + onSync), como a versão 16.
 *
 * Histórico:
 *  - até v13: lia SRA (funcionários) e devolvia MATRICULA, DEPARTAMENTO_COD, DEPARTAMENTO_DESC...
 *  - v14–v16 (29/09/2026): passou a ler SYS_USR (usuários) e deixou de devolver essas colunas;
 *    a tela de atribuição passou a recusar: "Faltou preencher: Mat. Colaborador, Departamento,
 *    Cód. Departamento".
 *  - esta versão (validada como dts_getColabProtheus_JYNX_test v2 em 27/11/2026):
 *    parte da SYS_USR (todos os usuários, colunas da v16) e busca o funcionário com o mesmo e-mail
 *    na SRA (o mais recente não demitido). Sem funcionário na SRA — caso dos usuários da ODS na
 *    base DEV —, os campos que a tela exige vêm do próprio usuário do Protheus.
 *
 * Colunas:
 *   v16:     ID_USUARIO, LOGIN, NOME, EMAIL, DEPARTAMENTO, CARGO, BLOQUEADO, FILTER
 *   antigas: MATRICULA, DEPARTAMENTO_COD, DEPARTAMENTO_DESC, FUNCAO_COD, FUNCAO_DESC,
 *            SITUACAO_COD, SITUACAO_DESC, DATA_DEMISSAO
 *   nova:    ORIGEM_MATRICULA = "SRA" | "SYS_USR" | "SYS_USR_SEM_DEPTO"
 *
 * MATRICULA:
 *   - funcionário da SRA: RA_MAT (ex.: 000077)
 *   - só usuário (SYS_USR): "U" + USR_ID (ex.: U000117). O prefixo evita que um ID de usuário seja
 *     confundido com a matrícula de outro funcionário (ex.: usuário 000077 x funcionário 000077).
 * Matrícula e departamento não entram na aprovação (mecanismo/evento acham o aprovador pelo e-mail).
 *
 * Volta: restaurar a versão 16 (fluig_dataset_restore) — o código dela está no histórico do Fluig
 * e no commit "dts_getColabProtheus_JYNX como está publicado no DEV (v16...)".
 */

var PREFIXO = "160";
var PREFIXO_MATRICULA_USUARIO = "U";
var MARCA_INFO = "=" + ">"; // linhas informativas do Protheus vêm com "=" seguido de ">"
var LOG_ID = "[dts_getColabProtheus_JYNX] ";

var COLS = [
    "ID_USUARIO", "LOGIN", "NOME", "EMAIL", "DEPARTAMENTO", "CARGO", "BLOQUEADO", "FILTER",
    "MATRICULA", "DEPARTAMENTO_COD", "DEPARTAMENTO_DESC", "FUNCAO_COD", "FUNCAO_DESC",
    "SITUACAO_COD", "SITUACAO_DESC", "DATA_DEMISSAO", "ORIGEM_MATRICULA"
];

function defineStructure() {
    for (var i = 0; i < COLS.length; i++) {
        addColumn(COLS[i], DatasetBuilder.STRING);
    }
    setKey(["ID_USUARIO"]);
    addIndex(["ID_USUARIO"]);
    addIndex(["LOGIN"]);
    addIndex(["NOME"]);
    addIndex(["MATRICULA"]);
}

function onSync(lastSyncDate) {
    var dataset = DatasetBuilder.newDataset();
    for (var c = 0; c < COLS.length; c++) {
        dataset.addColumn(COLS[c]);
    }

    try {
        var dsConnector = DatasetFactory.getDataset("dts_connectorProtheus_JYNX", null, null, null);
        var ckey = dsConnector.getValue(0, "CKEY");
        var cuser = dsConnector.getValue(0, "CUSER");
        var cpassw = dsConnector.getValue(0, "CPASSW");

        var servicoProvider = ServiceManager.getService("INTERFACE_JYNX");
        var serviceLocator = servicoProvider.instantiate("br.com.cloudtotvs.protheus.odsdo175312._4040.INTERFACEMFX");
        var serviceResult = serviceLocator.getINTERFACEMFXSOAP();
        var authenticatedService = servicoProvider.getBasicAuthenticatedClient(
            serviceResult, "br.com.cloudtotvs.protheus.odsdo175312._4040.INTERFACEMFXSOAP", cuser, cpassw);

        var objLogin = servicoProvider.instantiate("br.com.cloudtotvs.protheus.odsdo175312._4040.USUARIO");
        objLogin.setCUSER(cuser);
        objLogin.setCPASSW(cpassw);
        objLogin.setCKEY(ckey);

        // SYS_USR + funcionário mais recente (não demitido) com o mesmo e-mail na SRA.
        var qCampos =
            " SELECT TOP 50000 USR.USR_ID, USR.USR_CODIGO, USR.USR_NOME, ISNULL(USR.USR_EMAIL, ''), " +
            "ISNULL(USR.USR_DEPTO, ''), ISNULL(USR.USR_CARGO, ''), ISNULL(USR.USR_MSBLQL, '2'), " +
            "ISNULL(F.RA_MAT, ''), ISNULL(F.RA_DEPTO, ''), ISNULL(F.QB_DESCRIC, ''), ISNULL(F.RA_CODFUNC, ''), " +
            "ISNULL(F.RJ_DESC, ''), ISNULL(F.RA_SITFOLH, ''), ISNULL(F.RA_DEMISSA, '') " +
            "FROM SYS_USR USR " +
            "OUTER APPLY (SELECT TOP 1 SRA.RA_MAT, SRA.RA_DEPTO, SQB.QB_DESCRIC, SRA.RA_CODFUNC, SRJ.RJ_DESC, " +
            "SRA.RA_SITFOLH, SRA.RA_DEMISSA " +
            "FROM SRA" + PREFIXO + " SRA " +
            "LEFT JOIN SQB" + PREFIXO + " SQB ON SQB.QB_DEPTO = SRA.RA_DEPTO AND SQB.D_E_L_E_T_ = ' ' " +
            "LEFT JOIN SRJ" + PREFIXO + " SRJ ON SRJ.RJ_FUNCAO = SRA.RA_CODFUNC AND SRJ.D_E_L_E_T_ = ' ' " +
            "WHERE SRA.D_E_L_E_T_ = ' ' AND SRA.RA_SITFOLH <> 'D' " +
            "AND USR.USR_EMAIL <> '' AND UPPER(LTRIM(RTRIM(SRA.RA_EMAIL))) = UPPER(LTRIM(RTRIM(USR.USR_EMAIL))) " +
            "ORDER BY SRA.RA_ADMISSA DESC) F";

        var filtroWhere = "WHERE USR.D_E_L_E_T_ = ' '";
        var qOrder = "ORDER BY USR.USR_NOME ASC";

        var resultado = authenticatedService.execqry(objLogin, "GEN_01", qCampos, filtroWhere, qOrder);
        if (resultado == null) {
            throw "Protheus não respondeu à consulta de colaboradores.";
        }

        var aLinhas = resultado.getSTRING().toArray();
        var semSra = 0;
        for (var j = 1; j < aLinhas.length; j++) {
            var linha = String(aLinhas[j]);
            if (linha.indexOf("#ERRO#") != -1) {
                throw "Erro do Protheus na consulta de colaboradores: " + linha;
            }
            if (linha.indexOf(MARCA_INFO) != -1) {
                continue;
            }
            var col = linha.split(";");

            var idUsuario = valor(col, 0);
            var nome = valor(col, 2);
            var deptoUsr = valor(col, 4);
            var cargoUsr = valor(col, 5);
            var situacaoCod = valor(col, 12);

            var origem = "SRA";
            var matricula = valor(col, 7);
            var deptoCod = valor(col, 8);
            var deptoDesc = valor(col, 9);
            var funcaoDesc = valor(col, 11);
            if (matricula === "") { // sem funcionário na SRA: usa o usuário do Protheus
                semSra++;
                matricula = PREFIXO_MATRICULA_USUARIO + idUsuario;
                deptoCod = deptoUsr;
                deptoDesc = deptoUsr;
                funcaoDesc = cargoUsr;
                origem = (deptoUsr === "") ? "SYS_USR_SEM_DEPTO" : "SYS_USR";
            }

            dataset.addOrUpdateRow([
                idUsuario,                                  // ID_USUARIO
                valor(col, 1),                              // LOGIN
                nome,                                       // NOME
                valor(col, 3),                              // EMAIL
                deptoUsr,                                   // DEPARTAMENTO (SYS_USR, texto)
                cargoUsr,                                   // CARGO
                valor(col, 6) == "1" ? "Sim" : "Não",       // BLOQUEADO
                idUsuario + " - " + nome,                   // FILTER
                matricula,                                  // MATRICULA (RA_MAT ou U+USR_ID)
                deptoCod,                                   // DEPARTAMENTO_COD (SRA ou USR_DEPTO)
                deptoDesc,                                  // DEPARTAMENTO_DESC (SQB ou USR_DEPTO)
                valor(col, 10),                             // FUNCAO_COD (só SRA)
                funcaoDesc,                                 // FUNCAO_DESC (SRJ ou USR_CARGO)
                situacaoCod,                                // SITUACAO_COD
                descricaoSituacao(situacaoCod, origem),     // SITUACAO_DESC
                valor(col, 13),                             // DATA_DEMISSAO
                origem                                      // ORIGEM_MATRICULA
            ]);
        }

        log.info(LOG_ID + (aLinhas.length - 1) + " usuários lidos; " + semSra + " sem funcionário na SRA (dados da SYS_USR).");

    } catch (erro) {
        // Falha na sincronização: lança para o Fluig manter a cópia anterior em vez de gravar parcial.
        log.error(LOG_ID + "erro na sincronização com o Protheus: " + erro);
        throw "Erro na sincronização de colaboradores do Protheus: " + erro;
    }

    return dataset;
}

function createDataset(fields, constraints, sortFields) {
    return onSync(null);
}

function valor(col, i) {
    return col.length > i ? String(col[i]).trim() : "";
}

function descricaoSituacao(cod, origem) {
    if (origem !== "SRA") return "Sem cadastro de funcionário (dados do usuário Protheus)";
    if (cod === "D") return "Demitido";
    if (cod === "F") return "Férias";
    if (cod === "A" || cod === "P" || cod === "T") return "Afastado";
    if (cod !== "") return "Outros (" + cod + ")";
    return "Ativo";
}
