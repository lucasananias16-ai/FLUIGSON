// dts_getPedidoVenda_JYNX_test — CÓPIA DE TESTE do dts_getPedidoVenda_JYNX (carga completa da janela).
// Não substitui o dataset publicado; serve para validar a correção antes de promover.

function defineStructure() {
    addColumn("C5_NUM");
    addColumn("C5_TIPO");
    addColumn("C5_CLIENTE");
    addColumn("C5_LOJACLI");
    addColumn("C5_EMISSAO");
    addColumn("C5_VEND1");
    addColumn("A1_NOME");
    addColumn("CNPJ_CLIENTE");
    addColumn("C5_VEND2");
    addColumn("NOME_VEND2");
    addColumn("VLR_TOTAL");
    addColumn("C_CUSTO");
    addColumn("NOME_CUSTO");
    addColumn("C5_MOEDA");
    addColumn("C5_TXMOEDA");

    setKey(["C5_NUM"]);
}

function onSync(lastSyncDate) {
    var dataset = DatasetBuilder.newDataset();
    var prefixo = '160';

    var filtroWhere = "WHERE D_E_L_E_T_ = ' ' AND C5_VEND2 != '' " +
                      "AND EXISTS ( " +
                      "    SELECT 1 FROM SC7" + prefixo + " SC7 " +
                      "    WHERE SC7.C7_XNUMPV = SC5" + prefixo + ".C5_NUM " +
                      "      AND SC7.D_E_L_E_T_ = ' ' " +
                      ")";

    // Carga completa da janela a cada sincronização (não usa lastSyncDate).
    // O filtro incremental por C5_EMISSAO perdia: (a) PV cujo PC foi criado depois de uma
    // sincronização, porque o EXISTS em SC7 falhava naquela carga e a emissão já ficava
    // para trás nas seguintes; (b) alterações em PVs já sincronizados.
    // setKey(C5_NUM) + addOrUpdateRow atualizam as linhas existentes, sem duplicar.
    filtroWhere += " AND C5_EMISSAO >= '20260101'";

    try {
        // 1. Busca credenciais dinâmicas do dataset connector
        var dsConnector = DatasetFactory.getDataset("dts_connectorProtheus_JYNX", null, null, null);
        var ckey = dsConnector.getValue(0, "CKEY");
        var cuser = dsConnector.getValue(0, "CUSER");
        var cpassw = dsConnector.getValue(0, "CPASSW");

        // 2. Instancia o Web Service SOAP do Protheus
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

        // 3. Montagem da Query com SELECT explícito e prefixo parametrizado
        var qCampos = " SELECT C5_NUM, C5_TIPO, C5_CLIENTE, C5_LOJACLI, C5_EMISSAO, C5_VEND1, " +
            "(SELECT TOP 1 A1_NOME FROM SA1" + prefixo + " SA1 WHERE SA1.A1_COD = C5_CLIENTE AND SA1.A1_LOJA = C5_LOJACLI AND SA1.D_E_L_E_T_ = ' ') AS A1_NOME, " +
            "(SELECT TOP 1 A1_CGC FROM SA1" + prefixo + " SA1 WHERE SA1.A1_COD = C5_CLIENTE AND SA1.A1_LOJA = C5_LOJACLI AND SA1.D_E_L_E_T_ = ' ') AS CNPJ_CLIENTE, " +
            "C5_VEND2, " +
            "(SELECT TOP 1 A3_NOME FROM SA3" + prefixo + " SA3 WHERE SA3.A3_COD = C5_VEND2 AND SA3.D_E_L_E_T_ = ' ') AS NOME_VEND2, " +
            "(SELECT ISNULL(SUM(C6_VALOR), 0) FROM SC6" + prefixo + " SC6 WHERE SC6.C6_NUM = C5_NUM AND SC6.D_E_L_E_T_ = ' ') AS VLR_TOTAL, " +
            "(SELECT TOP 1 C6_CC FROM SC6" + prefixo + " SC6 WHERE SC6.C6_NUM = C5_NUM AND SC6.D_E_L_E_T_ = ' ') AS C_CUSTO, " +
            "(SELECT TOP 1 CTT_DESC01 FROM CTT" + prefixo + " CTT WHERE CTT.CTT_CUSTO = (SELECT TOP 1 C6_CC FROM SC6" + prefixo + " SC6 WHERE SC6.C6_NUM = C5_NUM AND SC6.D_E_L_E_T_ = ' ') AND CTT.D_E_L_E_T_ = ' ') AS NOME_CUSTO, " +
            "C5_MOEDA, C5_TXMOEDA " +
            "FROM SC5" + prefixo + " ";

        var qOrder = "ORDER BY C5_NUM DESC";

        var resultado = authenticatedService.execqry(objLogin, "GEN_01", qCampos, filtroWhere, qOrder);

        if (resultado != null) {
            var aLinhas = resultado.getSTRING().toArray();

            for (var j = 1; j < aLinhas.length; j++) {
                var linhaCorrente = String(aLinhas[j]);

                if (linhaCorrente.indexOf("=>") == -1 && linhaCorrente.indexOf("#ERRO#") == -1) {
                    var colunas = linhaCorrente.split(";");

                    dataset.addOrUpdateRow([
                        colunas.length > 0 ? colunas[0].trim() : "",
                        colunas.length > 1 ? colunas[1].trim() : "",
                        colunas.length > 2 ? colunas[2].trim() : "",
                        colunas.length > 3 ? colunas[3].trim() : "",
                        colunas.length > 4 ? colunas[4].trim() : "",
                        colunas.length > 5 ? colunas[5].trim() : "",
                        colunas.length > 6 ? colunas[6].trim() : "",
                        colunas.length > 7 ? colunas[7].trim() : "",
                        colunas.length > 8 ? colunas[8].trim() : "",
                        colunas.length > 9 ? colunas[9].trim() : "",
                        colunas.length > 10 ? colunas[10].trim() : "",
                        colunas.length > 11 ? colunas[11].trim() : "",
                        colunas.length > 12 ? colunas[12].trim() : "",
                        colunas.length > 13 ? colunas[13].trim() : "1",
                        colunas.length > 14 ? colunas[14].trim() : "0"
                    ]);
                }
            }
        }

    } catch (erro) {
        log.error("## ERRO INTEGRACAO PROTHEUS PEDIDO: " + erro);
        throw "Erro na sincronização do Protheus: " + erro.toString();
    }

    return dataset;
}

function milissegundosParaDataProtheus(ms) {
    var date = new Date(ms);
    var ano = date.getFullYear();
    var mes = ("0" + (date.getMonth() + 1)).slice(-2);
    var dia = ("0" + date.getDate()).slice(-2);
    return ano + mes + dia;
}

function createDataset(fields, constraints, sortFields) {
    return onSync(null);
}
