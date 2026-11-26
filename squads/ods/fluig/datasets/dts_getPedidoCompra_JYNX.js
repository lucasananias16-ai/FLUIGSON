/*
 * dts_getPedidoCompra_JYNX — Pedidos de Compra do Protheus (SC7) para o Fluig.
 * Dataset sincronizado: o Fluig guarda a cópia e a atualiza na rotina agendada.
 *
 * Correção sobre a versão 23 (versão de depuração "TESTE DE ISOLAMENTO"):
 *  - gravava só as 5 primeiras linhas (loop "i <= 5"); agora grava todos os PCs;
 *  - não tinha setKey nem addOrUpdateRow; agora a chave é C7_NUM e a linha é atualizada;
 *  - o SC7 tem uma linha por ITEM: os itens são consolidados por PC (total e quantidades
 *    somados), em vez de virarem várias linhas do mesmo PC;
 *  - erro de integração gravava uma "linha de erro" na cópia sincronizada; agora lança
 *    exceção, a sincronização falha e a cópia anterior é preservada;
 *  - retira os logs de depuração linha a linha.
 * As colunas são as mesmas da versão 23, para não quebrar quem consome o dataset.
 */

var CFG = {
    servico:   "INTERFACE_JYNX",
    pacote:    "br.com.cloudtotvs.protheus.odsdo175312._4040",
    consulta:  "GEN_01",
    tabela:    "SC7160",
    dataCorte: "20260101",
    timeoutMs: 120000,
    separador: ";"
};

var COLS = [
    "C7_NUM", "C7_FORNECE", "C7_LOJA", "C7_EMISSAO", "C7_CC", "C7_XNUMPV",
    "C7_TOTAL", "C7_MOEDA", "C7_TXMOEDA", "C7_QUJE", "C7_QUANT", "C7_QTDACLA",
    "C7_RESIDUO", "C7_CONAPRO", "C7_CONTRA", "C7_TIPO"
];

// Colunas somadas ao consolidar os itens de um mesmo PC.
var SOMAR = { C7_TOTAL: true, C7_QUJE: true, C7_QUANT: true, C7_QTDACLA: true };

var LOG_ID = "[dts_getPedidoCompra_JYNX] ";

function defineStructure() {
    for (var i = 0; i < COLS.length; i++) {
        addColumn(COLS[i]);
    }
    setKey(["C7_NUM"]);
}

function onSync(lastSyncDate) {
    var dataset = DatasetBuilder.newDataset();

    // Carga completa da janela (não usa lastSyncDate): pega PCs alterados depois da emissão
    // (aprovação, quantidade entregue, resíduo). setKey + addOrUpdateRow não duplicam.
    var filtroWhere = "WHERE D_E_L_E_T_ = ' ' AND C7_EMISSAO >= '" + CFG.dataCorte + "'";
    var qCampos = "SELECT " + COLS.join(", ") + " FROM " + CFG.tabela;
    var qOrder  = "ORDER BY C7_NUM DESC";

    try {
        var dtsCredenciais = DatasetFactory.getDataset("dts_connectorProtheus_JYNX", null, null, null);
        if (dtsCredenciais == null || dtsCredenciais.rowsCount == 0) {
            throw "sem credenciais em dts_connectorProtheus_JYNX";
        }

        var authUser = texto(dtsCredenciais.getValue(0, "CUSER"));
        var authPass = texto(dtsCredenciais.getValue(0, "CPASSW"));
        var authKey  = texto(dtsCredenciais.getValue(0, "CKEY"));

        var servico = ServiceManager.getService(CFG.servico);
        if (servico === null) {
            throw "serviço " + CFG.servico + " não cadastrado no Fluig";
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

        var linhas = extrairLinhas(port.execqry(login, CFG.consulta, qCampos, filtroWhere, qOrder));
        if (linhas.length === 0) {
            throw "resposta vazia do Protheus";
        }

        // linhas[0] é o cabeçalho; consolida os itens por número do PC.
        var pedidos = {};
        var ordem = [];
        for (var i = 1; i < linhas.length; i++) {
            var linha = linhas[i];
            if (linha.indexOf("#ERRO#") != -1) {
                throw "Protheus devolveu erro: " + linha;
            }
            if (linha.indexOf("=>") != -1 || linha === "") {
                continue;
            }

            var valores = linha.split(CFG.separador);
            var item = {};
            for (var c = 0; c < COLS.length; c++) {
                item[COLS[c]] = valores[c] ? valores[c].trim() : "";
            }
            if (item.C7_NUM === "") {
                continue;
            }

            var pc = pedidos[item.C7_NUM];
            if (!pc) {
                pedidos[item.C7_NUM] = item;
                ordem.push(item.C7_NUM);
                continue;
            }
            for (var k in SOMAR) {
                pc[k] = String(numero(pc[k]) + numero(item[k]));
            }
            // Residuo/aprovação: basta um item marcado para o PC aparecer marcado.
            if (pc.C7_RESIDUO === "" && item.C7_RESIDUO !== "") pc.C7_RESIDUO = item.C7_RESIDUO;
            if (pc.C7_CONAPRO === "" && item.C7_CONAPRO !== "") pc.C7_CONAPRO = item.C7_CONAPRO;
        }

        for (var p = 0; p < ordem.length; p++) {
            var registro = pedidos[ordem[p]];
            var row = [];
            for (var r = 0; r < COLS.length; r++) {
                row.push(registro[COLS[r]]);
            }
            dataset.addOrUpdateRow(row);
        }

        log.info(LOG_ID + "sincronizados " + ordem.length + " PCs (" + (linhas.length - 1) + " itens lidos).");

    } catch (erro) {
        log.error(LOG_ID + "erro na integração com o Protheus: " + erro);
        throw "Erro na sincronização dos Pedidos de Compra: " + erro;
    }

    return dataset;
}

function createDataset(fields, constraints, sortFields) {
    return onSync(null);
}

// ---- Auxiliares ----

function numero(valor) {
    var n = parseFloat(String(valor || "0").replace(",", "."));
    return isNaN(n) ? 0 : n;
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
        log.warn(LOG_ID + "não foi possível ajustar o conduit do CXF: " + e);
    }
    try {
        var contexto = port.getRequestContext();
        contexto.put("javax.xml.ws.client.connectionTimeout", CFG.timeoutMs);
        contexto.put("javax.xml.ws.client.receiveTimeout", CFG.timeoutMs);
    } catch (e2) {
        log.warn(LOG_ID + "não foi possível definir o tempo limite via contexto: " + e2);
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

    for (var i = 0; i < lista.size(); i++) {
        linhas.push(texto(lista.get(i)));
    }
    return linhas;
}

function texto(valor) {
    return (valor === null || valor === undefined)
         ? ""
         : String(valor).replace(/^\s+|\s+$/g, "");
}
