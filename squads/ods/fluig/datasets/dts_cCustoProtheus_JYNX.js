var CFG = {
    servico:      "INTERFACE_JYNX",
    pacote:       "br.com.cloudtotvs.protheus.odsdo175312._4040",
    consulta:     "GEN_01",
    tabela:       "CTT160",
    limitePadrao: 100,
    limiteMaximo: 500,
    timeoutMs:    30000
};

var LOG_ID = "[dts_cCustoProtheus_JYNX] ";

function createDataset(fields, constraints, sortFields) {

    // fields e sortFields nao sao usados: colunas e ordenacao sao fixas.
    var dataset = DatasetBuilder.newDataset();
    dataset.addColumn("CTT_CUSTO");
    dataset.addColumn("CTT_DESC01");
    dataset.addColumn("CUSTO_DESC");

    var filtro  = montarFiltro(constraints);
    var limite  = obterLimite(constraints);
    var qCampos = "SELECT TOP " + limite + " CTT_CUSTO, CTT_DESC01 FROM " + CFG.tabela;
    var qOrder  = "ORDER BY CTT_CUSTO ASC";

    log.info(LOG_ID + "iniciando " + CFG.consulta + " | filtro: " + filtro);

    try {
        // 1. Busca as credenciais centralizadas
        var dtsCredenciais = DatasetFactory.getDataset("dts_connectorProtheus_JYNX", null, null, null);
        
        if (dtsCredenciais == null || dtsCredenciais.rowsCount == 0) {
            log.error(LOG_ID + "Nao foi possivel obter as credenciais do dts_connectorProtheus_JYNX.");
            return dataset;
        }

        var authUser = texto(dtsCredenciais.getValue(0, "CUSER"));
        var authPass = texto(dtsCredenciais.getValue(0, "CPASSW"));
        var authKey  = texto(dtsCredenciais.getValue(0, "CKEY"));

        // 2. Instancia o servico
        var servico = ServiceManager.getService(CFG.servico);

        if (servico === null) {
            log.error(LOG_ID + "o servico " + CFG.servico + " nao esta cadastrado no Fluig.");
            return dataset;
        }

        var helper = servico.getBean();
        var client = helper.instantiate(CFG.pacote + ".INTERFACEMFX");
        var port   = client.getINTERFACEMFXSOAP();

        autenticar(port, authUser, authPass);
        ajustarConexao(port);

        // 3. Prepara os parametros do Protheus
        var login = helper.instantiate(CFG.pacote + ".USUARIO");
        login.setCUSER(authUser);
        login.setCPASSW(authPass);
        login.setCKEY(authKey);

        // 4. Executa a query
        var linhas = extrairLinhas(port.execqry(login, CFG.consulta, qCampos, filtro, qOrder));

        if (linhas.length === 0) {
            log.warn(LOG_ID + "o Protheus respondeu sem nenhuma linha. Filtro: " + filtro);
            return dataset;
        }

        // A primeira linha traz os nomes das colunas ou mensagem de erro
        if (linhas[0].indexOf("CTT_CUSTO") === -1) {
            log.error(LOG_ID + "o Protheus recusou a consulta " + CFG.consulta + ": " + linhas.join(" | "));
            return dataset;
        }

        // 5. Monta o retorno
        for (var i = 1; i < linhas.length; i++) {
            var linha = linhas[i];

            if (linha === "") {
                continue;
            }
            if (linha.indexOf("#ERRO#") > -1) {
                log.error(LOG_ID + linha);
                continue;
            }
            if (linha.indexOf("=>") > -1) {   // linha de log do proprio web service
                continue;
            }

            var partes = linha.split(";");
            var custo  = texto(partes.shift());
            var desc   = texto(partes.join(";"));

            if (custo === "") {
                continue;
            }

            dataset.addRow([custo, desc, custo + " - " + desc]);
        }

    } catch (e) {
        log.error(LOG_ID + "falha na integracao com o Protheus: " + e);
    }

    return dataset;
}

/**
 * Autenticacao HTTP Basic recebendo as credenciais dinamicamente.
 */
function autenticar(port, usuario, senha) {
    var contexto = port.getRequestContext();
    contexto.put("javax.xml.ws.security.auth.username", usuario);
    contexto.put("javax.xml.ws.security.auth.password", senha);
}

/**
 * Tempo limite e chunking.
 */
function ajustarConexao(port) {
    try {
        var conduit = org.apache.cxf.frontend.ClientProxy.getClient(port).getConduit();
        var politica = conduit.getClient();
        politica.setAllowChunking(false);
        politica.setConnectionTimeout(CFG.timeoutMs);
        politica.setReceiveTimeout(CFG.timeoutMs);
        return;
    } catch (e) {
        log.warn(LOG_ID + "nao foi possivel ajustar o conduit do CXF: " + e);
    }

    try {
        var contexto = port.getRequestContext();
        contexto.put("javax.xml.ws.client.connectionTimeout", CFG.timeoutMs);
        contexto.put("javax.xml.ws.client.receiveTimeout", CFG.timeoutMs);
    } catch (e2) {
        log.warn(LOG_ID + "nao foi possivel definir o tempo limite: " + e2);
    }
}

/**
 * Monta o filtro enviado ao web service.
 */
function montarFiltro(constraints) {
    var filtro = "WHERE D_E_L_E_T_ = ' '";

    if (constraints === null) {
        return filtro;
    }

    for (var i = 0; i < constraints.length; i++) {
        var campo = texto(constraints[i].fieldName).toUpperCase();
        var valor = texto(constraints[i].initialValue);

        if (campo === "LIMIT" || valor === "") {
            continue;
        }

        valor = escaparSql(valor);

        if (campo === "CTT_CUSTO") {
            filtro += ehBuscaParcial(constraints[i])
                    ? " AND LTRIM(RTRIM(CTT_CUSTO)) LIKE '" + valor.toUpperCase() + "%'"
                    : " AND LTRIM(RTRIM(CTT_CUSTO)) = '" + valor.toUpperCase() + "'";

        } else if (campo === "CTT_DESC01") {
            filtro += " AND UPPER(CTT_DESC01) LIKE '%" + valor.toUpperCase() + "%'";

        } else {
            filtro += " AND (CTT_CUSTO LIKE '" + valor.toUpperCase() + "%'"
                    + " OR UPPER(CTT_DESC01) LIKE '%" + valor.toUpperCase() + "%')";
        }
    }

    return filtro;
}

function obterLimite(constraints) {
    var limite = CFG.limitePadrao;

    if (constraints !== null) {
        for (var i = 0; i < constraints.length; i++) {
            if (texto(constraints[i].fieldName).toUpperCase() === "LIMIT") {
                var informado = parseInt(texto(constraints[i].initialValue), 10);
                if (!isNaN(informado) && informado > 0) {
                    limite = Math.min(informado, CFG.limiteMaximo);
                }
            }
        }
    }

    return limite;
}

function ehBuscaParcial(constraint) {
    try {
        return constraint.isLikeSearch();
    } catch (e) {
        return false;
    }
}

/**
 * O retorno e um ArrayOfString.
 */
function extrairLinhas(retorno) {
    var lista  = null;
    var linhas = [];

    if (retorno === null || retorno === undefined) {
        return linhas;
    }

    try {
        lista = retorno.getSTRING();
    } catch (e) { /* tenta a outra forma */ }

    if (lista === null) {
        try {
            lista = retorno.getString();
        } catch (e2) { /* pode ja ser a lista */ }
    }

    if (lista === null) {
        lista = retorno;
    }

    try {
        for (var i = 0; i < lista.size(); i++) {
            linhas.push(texto(lista.get(i)));
        }
    } catch (e3) {
        log.error(LOG_ID + "nao foi possivel ler a lista devolvida pelo web service: " + e3);
    }

    return linhas;
}

/**
 * Escapa a aspa simples e remove caracteres invalidos.
 */
function escaparSql(valor) {
    return texto(valor)
        .replace(/'/g, "''")
        .replace(/;/g, " ")
        .replace(/--/g, " ")
        .replace(/\/\*/g, " ");
}

function texto(valor) {
    return (valor === null || valor === undefined)
         ? ""
         : String(valor).replace(/^\s+|\s+$/g, "");
}