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
 * Usuário sem funcionário na SRA continua aparecendo, com MATRICULA/DEPARTAMENTO_COD vazios e
 * ORIGEM_MATRICULA = "SEM_SRA": a tela continua recusando, mas agora dá para ver quem é e
 * corrigir o cadastro no Protheus.
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
        var matricula = valor(col, 7);
        var situacaoCod = valor(col, 12);
        if (matricula === "") {
            semSra++;
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
            matricula,                                  // MATRICULA (SRA)
            valor(col, 8),                                       // DEPARTAMENTO_COD (SRA)
            valor(col, 9),                                       // DEPARTAMENTO_DESC (SQB)
            valor(col, 10),                                      // FUNCAO_COD
            valor(col, 11),                                      // FUNCAO_DESC
            situacaoCod,                                // SITUACAO_COD
            descricaoSituacao(situacaoCod, matricula),  // SITUACAO_DESC
            valor(col, 13),                                      // DATA_DEMISSAO
            matricula !== "" ? "SRA" : "SEM_SRA"        // ORIGEM_MATRICULA
        ]);
    }

    log.info(LOG_ID + (aLinhas.length - 1) + " usuários lidos; " + semSra + " sem funcionário correspondente na SRA.");
    return dataset;
}

function valor(col, i) {
    return col.length > i ? String(col[i]).trim() : "";
}

function descricaoSituacao(cod, matricula) {
    if (matricula === "") return "Sem cadastro de funcionário";
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
