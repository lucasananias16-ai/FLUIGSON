//const attachment = new Attachments;
let ETAPA_ATUAL = 0;

const APROV_PC_UM = 12;
const APROV_PC_DOIS = 18;
const APROV_PC_TRES = 20;
const APROV_PC_QUATRO = 26;
const REVISAO = 28;
const ADICIONAR_NF = 73;
const MEDICAO_ITEMS = 32;
const APROVACAO = 39;
const LIBERACAO_PAGAMENTO = 46;

$(document).ready(function () {
    ETAPA_ATUAL = getWKNumState();

    const config = [
        { id: 'step_aprovPc', states: [0, APROV_PC_UM, APROV_PC_DOIS, APROV_PC_TRES, APROV_PC_QUATRO] },
        { id: 'step_adicionarNF', states: ADICIONAR_NF },
        { id: 'step_medItens', states: MEDICAO_ITEMS },
        { id: 'step_aprovPagamento', states: APROVACAO },
        { id: 'step_liberacaoPag', states: LIBERACAO_PAGAMENTO }
    ];

    ProgressBar.step(ETAPA_ATUAL, config);
    ElementUtils.listAttachments("#arquivos_anexados");

    if (ETAPA_ATUAL == APROV_PC_UM || ETAPA_ATUAL == APROV_PC_DOIS || ETAPA_ATUAL == APROV_PC_TRES || ETAPA_ATUAL == APROV_PC_QUATRO || ETAPA_ATUAL == MEDICAO_ITEMS) {
        window.parent.$("#workflowActions").hide(); // Esconde o botão de enviar no formulário.
    }

    // if (ETAPA_ATUAL != 73 || ETAPA_ATUAL != 46 && (ETAPA_ATUAL == 12 || ETAPA_ATUAL == 18 || ETAPA_ATUAL == 20 || ETAPA_ATUAL == 26 || ETAPA_ATUAL == 32 || ETAPA_ATUAL != REVISAO))

    if (ETAPA_ATUAL != ADICIONAR_NF) $("#box_addAnexo").removeClass("fs-display-flex")

    FLUIGC.switcher.init("[id^='chk_pedido_medicao___']");
    FLUIGC.switcher.init("[id^='chk_pedido_faturamento___']");

    FLUIGC.switcher.onChange("[id^='chk_pedido_medicao___']", function (event, state) {
        const LINE_ID = this.id.split("___")[1];

        ElementUtils.setValue("#hd_itemMedido___" + LINE_ID, state)

        state ? ElementUtils.setValue("#txt_pedido_status___" + LINE_ID, "Medido") : ElementUtils.setValue("#txt_pedido_status___" + LINE_ID, "Pendente");

    });

    FLUIGC.switcher.onChange("[id^='chk_pedido_faturamento___']", function (event, state) {
        const LINE_ID = this.id.split("___")[1];
        const ITEM_VAL = ElementUtils.formatCashInt(ElementUtils.getValue("#num_pedido_vlTot___" + LINE_ID) || "0");
        const PC_VAL_TOTAL = ElementUtils.formatCashInt(ElementUtils.getValue("#txt_valTotalPc") || "0");
        const PC_VAL_FATURADO = ElementUtils.formatCashInt(ElementUtils.getValue("#txt_valFaturadoPc") || "0");

        let novoFaturado = PC_VAL_FATURADO;

        ElementUtils.setValue("#hd_itemFaturado___" + LINE_ID, state);

        if (state) {
            ElementUtils.setValue("#txt_pedido_status___" + LINE_ID, "Liberado P/ Pagar");
            novoFaturado += ITEM_VAL;
        } else {
            let item_medido = ElementUtils.getValue("#hd_itemMedido___" + LINE_ID)
            ElementUtils.setValue("#txt_pedido_status___" + LINE_ID, item_medido == 'true' ? "Medido" : "Pendente");
            novoFaturado -= ITEM_VAL;
        }
        novoFaturado = Math.max(0, novoFaturado);
        const novoSaldo = Math.max(0, PC_VAL_TOTAL - novoFaturado);

        ElementUtils.setValue("#txt_valFaturadoPc", ElementUtils.formatIntCash(novoFaturado));
        ElementUtils.setValue("#txt_valFaturarPc", ElementUtils.formatIntCash(novoSaldo));
    });

    setTimeout(function () {
        if (ETAPA_ATUAL == LIBERACAO_PAGAMENTO) {
            $("[id^='hd_itemMedido___']").each(function () {
                const LINE_ID = this.id.split("___")[1];

                if (this.value === "true") {
                    FLUIGC.switcher.setTrue('#chk_pedido_medicao___' + LINE_ID);
                    FLUIGC.switcher.isReadOnly('#chk_pedido_medicao___' + LINE_ID, true);
                    ElementUtils.setReadonly("#txt_pedido_obs___" + LINE_ID, true)
                } else {
                    const PN_MEDICAO = $("#txt_pedido_obs___" + LINE_ID).closest("#pn_pedido_medicao");
                    const PN_FATURAMENTO = $("#txt_pedido_obsFatu___" + LINE_ID).closest("#pn_pedido_faturamento");

                    console.log(LINE_ID, PN_MEDICAO.length, PN_FATURAMENTO.length);

                    PN_MEDICAO.hide();
                    PN_FATURAMENTO.hide();
                }
            });
        }

    }, 500);

    if (ETAPA_ATUAL == 12) {
        $("[id^='txt_pedido_status___']").map((item, index) => {
            index.value = "Pendente";
        });

        ElementUtils.setValue("#txt_valFaturarPc", ElementUtils.getValue("#txt_valTotalPc"));
        ElementUtils.setValue("#txt_valFaturadoPc", "R$ 0,00");
    }

    if (ETAPA_ATUAL != 73) $(".attachment-btn-delete").hide()

    ETAPA_ATUAL == 32 ? $("[id^='pn_pedido_medicao']").show() : $("[id^='pn_pedido_medicao']").hide();

    if (ETAPA_ATUAL == 46) {
        $("[id^='pn_pedido_medicao']").show();
        $("[id^='pn_pedido_faturamento']").show();
    }

});

var beforeSendValidate = function (numState, nextState) {
    const anexos = parent.ECM.attachmentTable.getData();
    const OBS_GERAL = ElementUtils.getValue("#txt_obsGeral");

    let error_msg = ""
    if (numState == 73) {
        if (anexos.length == 0) {
            error_msg += 'Necessário Anexar Pelo Menos Uma Nota Fiscal.'
        }
    }

    if (numState == 12) {
        let cons_ccusto = DatasetFactory.createConstraint('COD_CCUSTO', "FLU1G2026", "", ConstraintType.MUST);
        let cons_valLimite = DatasetFactory.createConstraint('VALOR_LIMITE', "R$ 37.000,00", "", ConstraintType.MUST);

        let ds_niveis = DatasetFactory.getDataset('dts_consultUsuariosPosicoes', null, [cons_ccusto, cons_valLimite], null);

        ds_niveis['values'].map(nivel => {
            if (nivel['txt_sequenceLvl'] == '2') ElementUtils.setValue("#hd_hasAprovDois", "true");;
            if (nivel['txt_sequenceLvl'] == '3') ElementUtils.setValue("#hd_hasAprovTres", "true");;
            if (nivel['txt_sequenceLvl'] == '4') ElementUtils.setValue("#hd_hasAprovQuatro", "true");;
        });
    }

    if (numState == 32) {
        let avanca = false;

        $("[id^='hd_itemMedido___']").map((item, index) => {
            if (index.value == "true") avanca = true;
        });

        if (!avanca) error_msg = "Necessário Medir Pelo Menos Um Item."
    }

    if (error_msg != "") {
        throw error_msg
    }

    if (OBS_GERAL != "") {
        const line = wdkAddChild("tb_obsHistorico")

        const ETAPAS = {
            '12': 'Aprovação Um',
            '18': 'Aprovação Dois',
            '20': 'Aprovação Três',
            '26': 'Aprovação Quatro',
            '28': 'Revisão',
            '73': 'Adicionar Nota Fiscal',
            '32': 'Medição dos Itens',
            '39': 'Aprovação do Orçamento NF',
            '46': 'Liberação de Pagamento'
        }

        ElementUtils.setValue("#txt_obs_etapa___" + line, ETAPAS[ETAPA_ATUAL]);
        ElementUtils.setValue("#txt_obs_dtHr___" + line, ElementUtils.getDateCurrent(true));
        ElementUtils.setValue("#txt_obs_comment___" + line, parent.WCMAPI.user + " - " + OBS_GERAL);

        ElementUtils.setValue("#txt_obsGeral", "");
    }

    if (numState == 46) {
        saveNfForm()
    }
}

async function saveNfForm() {
    const anexos = parent.ECM.attachmentTable.getData();

    if (anexos.length == 0) return;

    const NUM_SOLIC = ElementUtils.getValue("#txt_numSolic");
    const NUM_PV = ElementUtils.getValue("#txt_idPv_numPv");
    const NUM_PC = ElementUtils.getValue("#num_dadosPc_numPc");

    let cons_solic = DatasetFactory.createConstraint(
        'NUM_SOLIC',
        NUM_SOLIC,
        NUM_SOLIC,
        ConstraintType.MUST
    );

    let ds_form = DatasetFactory.getDataset(
        'dts_consultNfsPc_JYNX',
        null,
        [cons_solic],
        null
    ).values;

    // Não existe formulário
    if (ds_form.length == 0) {

        const ATTACHMEN_LIST = [];

        anexos.forEach((anexo, index) => {
            ATTACHMEN_LIST.push(
                { fieldId: `txt_idDocumento___${index + 1}`, value: anexo.documentId },
                { fieldId: `txt_dtInclusaoNf___${index + 1}`, value: ElementUtils.getDateCurrent(true) },
                { fieldId: `txt_nomeNf___${index + 1}`, value: anexo.description },
                { fieldId: `txt_statusNf___${index + 1}`, value: "Não" }
            );
        });

        const dadosCampos = [
            { fieldId: "txt_numSolic", value: NUM_SOLIC },
            { fieldId: "txt_numPv", value: NUM_PV },
            { fieldId: "txt_numPc", value: NUM_PC },
            ...ATTACHMEN_LIST
        ];

        criarRegistroFormulario(403, dadosCampos);

    } else {

        const idsJaSalvos = new Set(
            ds_form.map(item => String(item.txt_idDocumento))
        );

        const anexosNovos = anexos.filter(anexo =>
            !anexo.deleted &&
            anexo.documentId > 0 &&
            !idsJaSalvos.has(String(anexo.documentId))
        );

        if (anexosNovos.length == 0) return;

        const CARD_INDEX_ID = 403;
        const DOCUMENT_ID = ds_form[0].documentid;

        for (const anexo of anexosNovos) {

            const values = [
                { fieldId: "txt_idDocumento", value: anexo.documentId },
                { fieldId: "txt_dtInclusaoNf", value: ElementUtils.getDateCurrent(true) },
                { fieldId: "txt_nomeNf", value: anexo.description },
                { fieldId: "txt_statusNf", value: "Não" }
            ];

            await adicionarLinhaFormulario(CARD_INDEX_ID, DOCUMENT_ID, values);
        }
    }
}

function criarRegistroFormulario(cardIndexId, valuesArray) {
    const endpoint = `/ecm-forms/api/v2/cardindex/${cardIndexId}/cards`;

    const payload = {
        values: valuesArray
    };

    return $.ajax({
        url: endpoint,
        type: 'POST',
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json',
        headers: {
            'Accept': 'application/json; charset=UTF-8'
        },
        data: JSON.stringify(payload),
        success: function (response) {
            console.log('Registro cadastrado com sucesso!', response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Erro ao cadastrar registro:', textStatus, errorThrown);
            console.error('Resposta do servidor:', jqXHR.responseText);
        }
    });
}

function adicionarLinhaFormulario(cardIndexId, documentId, valuesArray) {
    const endpoint = `/ecm-forms/api/v2/cardindex/${cardIndexId}/cards/${documentId}/children`;

    const payload = {
        values: valuesArray
    };

    return $.ajax({
        url: endpoint,
        type: 'POST',
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json',
        headers: {
            'Accept': 'application/json; charset=UTF-8'
        },
        data: JSON.stringify(payload),
        success: function (response) {
            console.log('Linha adicionada com sucesso!', response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Erro ao adicionar linha:', textStatus, errorThrown);
            console.error('Resposta do servidor:', jqXHR.responseText);
        }
    });
}
