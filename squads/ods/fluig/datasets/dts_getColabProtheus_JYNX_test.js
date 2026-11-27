/*
 * dts_getColabProtheus_JYNX_test — CÓPIA DE TESTE do dts_getColabProtheus_JYNX.
 * Não substitui o dataset publicado; serve para validar a correção antes de promover.
 *
 * Problema: a versão 14+ (29/09/2026) passou a ler SYS_USR (usuários do Protheus) e deixou de
 * devolver MATRICULA, DEPARTAMENTO_COD e DEPARTAMENTO_DESC, que a tela "Atribuição de Usuários e
 * Posições" exige ("Faltou preencher: Mat. Colaborador, Departamento, Cód. Departamento").
 * Até a versão 13 o dataset lia SRA (funcionários) e devolvia essas colunas.
 *
 * Correção: parte da SYS_USR (mantém todos os usuários e as colunas atuais) e busca o funcionário
 * correspondente na SRA pelo e-mail (o mais recente não demitido). Devolve as colunas das duas
 * versões, para servir tanto a tela antiga quanto quem já usa as colunas novas:
 *   atuais:  ID_USUARIO, LOGIN, NOME, EMAIL, DEPARTAMENTO, CARGO, BLOQUEADO, FILTER
 *   antigas: MATRICULA, DEPARTAMENTO_COD, DEPARTAMENTO_DESC, FUNCAO_COD, FUNCAO_DESC,
 *            SITUACAO_COD, SITUACAO_DESC, DATA_DEMISSAO
 *   nova:    ORIGEM_MATRICULA = "SRA" (achou funcionário) ou "SEM_SRA" (usuário sem funcionário)
 * Versão 2 (caminho 1): na base DEV a SRA não tem os funcionários da ODS (13 de 132 usuários
 * casam, quase todos @kloeckner.com). Quando o usuário não tem funcionário na SRA, os campos que a
 * tela exige vêm do próprio usuário do Protheus:
 *   MATRICULA         = USR_ID (ex.: 000117)
 *   DEPARTAMENTO_COD  = USR_DEPTO (texto, ex.: "Fiscal")
 *   DEPARTAMENTO_DESC = USR_DEPTO
 *   FUNCAO_DESC       = USR_CARGO
 *   ORIGEM_MATRICULA  = "SYS_USR"
 * Matrícula e departamento não entram na aprovação (mecanismo e evento acham o aprovador pelo
 * e-mail); servem para a tela "Atribuição de Usuários e Posições" conseguir salvar.
 * Se o usuário não tiver departamento na SYS_USR, DEPARTAMENTO_COD/DESC ficam vazios e a tela
 * continua recusando (ORIGEM_MATRICULA = "SYS_USR_SEM_DEPTO").
 *
 * Modo teste: sem sincronização e restrito aos usuários de USUARIOS_PERMITIDOS (como os demais _test).
 */

var PREFIXO = "160";
var MARCA_INFO = "=" + ">"; // linhas informativas do Protheus vêm com "=" seguido de ">"
var LOG_ID = "[dts_getColabProtheus_JYNX_test] ";
var USUARIOS_PERMITIDOS = ["admin"];

var COLS = [
    "ID_USUARIO", "LOGIN", "NOME", "EMAIL", "DEPARTAMENTO", "CARGO", "BLOQUEADO", "FILTER",
    "MATRICULA", "DEPARTAMENTO_COD", "DEPARTAMENTO_DESC", "FUNCAO_COD", "FUNCAO_DESC",
    "SITUACAO_COD", "SITUACAO_DESC", "DATA_DEMISSAO", "ORIGEM_MATRICULA"
];

function createDataset(fields, constraints, sortFields) {
    var dataset = DatasetBuilder.newDataset();
    for (var c = 0; c < COLS.length; c++) {
        dataset.addColumn(COLS[c]);
    }
    if (!usuarioPermitido()) {
        return dataset;
    }

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
            log.error(LOG_ID + "linha com erro do Protheus: " + linha);
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
        if (matricula === "") { // caminho 1: sem funcionário na SRA, usa o usuário do Protheus
            semSra++;
            matricula = idUsuario;
            deptoCod = deptoUsr;
            deptoDesc = deptoUsr;
            funcaoDesc = cargoUsr;
            origem = (deptoUsr === "") ? "SYS_USR_SEM_DEPTO" : "SYS_USR";
        }

        dataset.addRow([
            idUsuario,                                  // ID_USUARIO
            valor(col, 1),                                       // LOGIN
            nome,                                       // NOME
            valor(col, 3),                                       // EMAIL
            valor(col, 4),                                       // DEPARTAMENTO (SYS_USR, texto)
            valor(col, 5),                                       // CARGO
            valor(col, 6) == "1" ? "Sim" : "Não",                // BLOQUEADO
            idUsuario + " - " + nome,                   // FILTER
            matricula,                                  // MATRICULA (SRA ou USR_ID)
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

    log.info(LOG_ID + (aLinhas.length - 1) + " usuários lidos; " + semSra + " sem funcionário na SRA (usaram os dados da SYS_USR).");
    return dataset;
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

function usuarioPermitido() {
    var usuario = "";
    try { usuario = String(getValue("WKUser") || ""); } catch (e) {}
    if (USUARIOS_PERMITIDOS.indexOf(usuario) == -1) {
        log.warn(LOG_ID + "acesso negado ao usuário '" + usuario + "'");
        return false;
    }
    return true;
}
