/*
 * TESTE DE ISOLAMENTO - dts_getPedidoCompra__JYNX
 * --------------------------------------------------------------------------
 */

var CFG = {
    servico:   "INTERFACE_JYNX",
    pacote:    "br.com.cloudtotvs.protheus.odsdo175312._4040",
    consulta:  "GEN_01",
    tabela:    "SC7160",
    timeoutMs: 120000,
    separador: ";" // TODO: Ajuste para o caractere que separa as colunas na sua string do Protheus (ex: '|', ';', ou ',')
};

// Vá descomentando colunas uma a uma, de cima para baixo, entre testes.
var TEST_COLS = [
    "C7_NUM"
    ,"C7_FORNECE"
    ,"C7_LOJA"
    ,"C7_EMISSAO"
    ,"C7_CC"
    ,"C7_XNUMPV"
    ,"C7_TOTAL"
    ,"C7_MOEDA"
    ,"C7_TXMOEDA"
    ,"C7_QUJE"
    ,"C7_QUANT"
    ,"C7_QTDACLA"
    ,"C7_RESIDUO"
    ,"C7_CONAPRO"
    ,"C7_CONTRA"
    ,"C7_TIPO"
];

var LOG_ID = "[TESTE_getPedidoCompra] ";

function defineStructure() {
    // Define estruturalmente as colunas baseado no array TEST_COLS
    for (var i = 0; i < TEST_COLS.length; i++) {
        addColumn(TEST_COLS[i]);
    }
}

function onSync(lastSyncDate) {
    var dataset = DatasetBuilder.newDataset();
    
    // Adiciona as colunas dinamicamente na criação do dataset também
    for (var c = 0; c < TEST_COLS.length; c++) {
        dataset.addColumn(TEST_COLS[c]);
    }

    var filtroWhere = "WHERE D_E_L_E_T_ = ' ' AND C7_EMISSAO >= '20260101'";
    var qCampos = "SELECT TOP 500 " + TEST_COLS.join(", ") + " FROM " + CFG.tabela;
    var qOrder  = "ORDER BY C7_NUM DESC";

    log.info(LOG_ID + "QCAMPOS: " + qCampos);
    log.info(LOG_ID + "QWHERE : " + filtroWhere);

    try {
        var dtsCredenciais = DatasetFactory.getDataset("dts_connectorProtheus_JYNX", null, null, null);
        if (dtsCredenciais == null || dtsCredenciais.rowsCount == 0) {
            log.error(LOG_ID + "sem credenciais de dts_connectorProtheus_JYNX.");
            dataset.addRow(criarLinhaErro("SEM CREDENCIAIS"));
            return dataset;
        }

        var authUser = texto(dtsCredenciais.getValue(0, "CUSER"));
        var authPass = texto(dtsCredenciais.getValue(0, "CPASSW"));
        var authKey  = texto(dtsCredenciais.getValue(0, "CKEY"));

        var servico = ServiceManager.getService(CFG.servico);
        if (servico === null) {
            log.error(LOG_ID + "servico " + CFG.servico + " nao cadastrado no Fluig.");
            dataset.addRow(criarLinhaErro("SERVICO NAO CADASTRADO"));
            return dataset;
        }

        var helper = servico.getBean();
        var client = helper.instantiate(CFG.pacote + ".INTERFACEMFX");
        var port   = client.getINTERFACEMFXSOAP();

        autenticar(port, authUser, authPass);
        ajustarConexao(port);

        var login = helper.instantiate(CFG.pacote + ".USUARIO");
        login.setCUSER(authUser);
        login.setCPASSW(authPass);
        login.setCKEY(authKey);

        log.info(LOG_ID + "chamando execqry...");
        var retorno = port.execqry(login, CFG.consulta, qCampos, filtroWhere, qOrder);
        log.info(LOG_ID + "execqry retornou sem lançar exceção.");

        var linhas = extrairLinhas(retorno);

        if (linhas.length === 0) {
            log.warn(LOG_ID + "resposta vazia.");
            dataset.addRow(criarLinhaErro("RESPOSTA VAZIA"));
            return dataset;
        }

        log.info(LOG_ID + "HEADER: " + linhas[0]);
        // Ignoramos a inserção do Header como dado, pois as colunas já foram criadas
        
        // Iteramos a partir da linha 1 (dados)
        for (var i = 1; i < linhas.length && i <= 5; i++) {
            log.info(LOG_ID + "LINHA " + i + ": " + linhas[i]);
            
            // Separa a string recebida num Array usando o separador definido
            var valoresQuebrados = linhas[i].split(CFG.separador);
            var rowData = [];
            
            // Associa os valores às colunas, preenchendo vazio caso venha incompleto
            for (var colIndex = 0; colIndex < TEST_COLS.length; colIndex++) {
                rowData.push(valoresQuebrados[colIndex] ? valoresQuebrados[colIndex].trim() : "");
            }
            
            dataset.addRow(rowData);
        }

    } catch (erro) {
        log.error(LOG_ID + "ERRO CAPTURADO (toString): " + erro);
        try { log.error(LOG_ID + "erro.message: " + erro.message); } catch (e1) {}
        try { log.error(LOG_ID + "erro.javaException: " + erro.javaException); } catch (e2) {}
        try { log.error(LOG_ID + "erro.rhinoException: " + erro.rhinoException); } catch (e3) {}
        try {
            if (erro.javaException != null) {
                log.error(LOG_ID + "causa raiz (getCause): " + erro.javaException.getCause());
            }
        } catch (e4) {}

        dataset.addRow(criarLinhaErro("ERRO: " + erro));
    }

    return dataset;
}

// ---- Auxiliares ----

/**
 * Cria um array com o mesmo tamanho de colunas de TEST_COLS. 
 * O primeiro campo conterá a mensagem de erro, e o resto virá vazio.
 * O Fluig obriga que o tamanho do array no addRow() bata com a quantidade de colunas!
 */
function criarLinhaErro(mensagem) {
    var row = [];
    for (var i = 0; i < TEST_COLS.length; i++) {
        if (i === 0) {
            row.push(mensagem);
        } else {
            row.push("");
        }
    }
    return row;
}

function autenticar(port, usuario, senha) {
    var contexto = port.getRequestContext();
    contexto.put("javax.xml.ws.security.auth.username", usuario);
    contexto.put("javax.xml.ws.security.auth.password", senha);
}

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
        log.warn(LOG_ID + "nao foi possivel definir o tempo limite via contexto: " + e2);
    }
}

function extrairLinhas(retorno) {
    var lista  = null;
    var linhas = [];

    if (retorno === null || retorno === undefined) {
        return linhas;
    }
    try { lista = retorno.getSTRING(); } catch (e) {}
    if (lista === null) { try { lista = retorno.getString(); } catch (e2) {} }
    if (lista === null) { lista = retorno; }

    try {
        for (var i = 0; i < lista.size(); i++) {
            linhas.push(texto(lista.get(i)));
        }
    } catch (e3) {
        log.error(LOG_ID + "nao foi possivel ler a lista devolvida: " + e3);
    }
    return linhas;
}

function texto(valor) {
    return (valor === null || valor === undefined)
         ? ""
         : String(valor).replace(/^\s+|\s+$/g, "");
}