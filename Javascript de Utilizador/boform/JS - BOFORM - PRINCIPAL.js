var selectedActividadeRow = 0;
var selectedCategoriaRow = 0;
var modalCEDHtml = ""
var modalConsultorHtml = "";
var modalActividadeHtml = ""

function pageLoad() {
    init();
}

function init() {

    try {
        initFunctionsCriterios();
    } catch (error) {
        console.error("Erro ao inicializar funções de critérios de avaliação:", error);
    }

    try {
        initCriteriosAvaliacao(function () {
            initGrelhaAvaliacaoCotacoes();
        });
    } catch (error) {
        console.error("Erro ao inicializar critérios/grelha de avaliação de cotações:", error);
    }


    $("#nextActions").remove()
    if ($("#mainPage").attr("data-doctype") == '38') {
        LayoutContrato()
    }
    if ($("#mainPage").attr("data-doctype") == '29') {
        LayoutOrcamento()
        opcaoCarregarExcelOrcamento()
    }
    if ($("#mainPage").attr("data-doctype") == '20') {
        LayoutPedidoPagamento()
    }
    if ($("#mainPage").attr("data-doctype") == '40') {
        LayoutRequisicao()
        //LayoutPedidoPagamento()
    }
    if ($("#mainPage").attr("data-doctype") == '42') {
        LayoutPlanoActividades()
    }

    registerShowModalBoxesClickListener();
    registerGetValuebtnClickListener();
    registerFilterActividadeOnKeyUpListener();
    registerSelectActividadeButtonClickListener();
    registerDeleteModalidadeClickListener();
    registerEditarModalidadeClickListener();
    registerSelectCEDButtonClickListener();
    registerFilterCEDOnKeyUpListener();
    registerRequisitarModalidadeClickListener();
    registerFilterMatrizOnKeyUpListener();
    registerFilterNomeOnKeyUpListener();
    registerSelectConsultorButtonClickListener();
    registerReadOnlyFields();
    registerImagesOnSpansInsideButtons();
    registerRemoveNativeButtons();
    registerSelectCategoriaButtonClickListener();
    registerSelectContratoButtonClickListener();
    registerHideControls();
    registerGetBIPorComprarClickListener();
    registerGetBIPorComprarDirectoClickListener();
    registerCheckTodosOnChange();
    registerDatePickers();
    registerCheckDirOnChange();
    registerChangeObjectPositions();

    registerDatePickersByClass();
    registerActualizarComprasClickListener();
    registerOnComprasParaActualizarChangeListener();
    preencherOpcoesDoCampoProjecto();
    preencherOpcoesDoCampoDelegacao();
    registerExportarClickListener();
    registerEmitirAdiantamento_RequisicaoExternaClickListener()
    registerBtnEmitirAdiantamentoClickListener()
    registerGetCheckboxClickListener()
    registerSelectCompraButtonClickListener()
    ocultarBotoesPorCircuito()
    handleChangeCircuito()
    importarDespesasListeners()
}


function importarDespesasListeners() {
    $("#importar-despesas").on("click", function () {
        var stamps = [];
        $(".checkbox-despesa:checked").each(function () {
            var fostamp = $(this).data("fostamp");
            var ccusto = $(this).data("ccusto");
            var fref = $(this).data("fref");
            stamps.push(fostamp);
        });
        var $form = $(document.body).find("form[name='aspnetForm']");
        $form.find("input[name='despesasFostamp[]']").remove();
        stamps.forEach(function (stamp) {
            $form.append(
                "<input type='hidden' name='despesasFostamp[]' value='" + stamp + "' />"
            );
        });
        console.log("Stamps a importar: ", stamps);
        __doPostBack("ctl00$conteudo$options3$userOption60", "");
    });
}


function LayoutContrato() {
    $("#campos").prepend("<div class='row' id='sec1'></div><div class='row' id='sec2'></div><div class='row' id='sec3'></div><div class='row' id='sec4'></div><div class='row' id='sec5'></div>")
    $("#dataArea").prepend("<div class='row' id='secdata1'></div><div class='row' id='secdata2'></div>")
    $("#sec1").append($("#ctl00_conteudo_nmdosro_mLabel1").closest(".destaque").closest(".row"))
    $("#sec2").append($("#ctl00_conteudo_nome").closest(".row"))
    $("#sec3").append($("#ctl00_conteudo_moeda").closest(".row"))
    $("#sec4").append($("#ctl00_conteudo_U_TIPO38").closest(".col"))
    $("#sec5").append($("#ctl00_conteudo_u_usr638").closest(".col"))

    $("#ctl00_conteudo_dataobra").closest(".col").removeClass().addClass("col col-md-2 col-lg-2 col-sm-2")
    $("#ctl00_conteudo_nmdosro").closest(".destaque").closest(".row").append($("#ctl00_conteudo_dataobra").closest(".col"))
    $("#ctl00_conteudo_dataobra").closest(".col").attr("style", "float:right")

    $("#ctl00_conteudo_U_TIPOCONT38").closest(".col").insertBefore($("#ctl00_conteudo_moeda").closest(".col"))
    $("#ctl00_conteudo_U_TIPOCONT38").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")
    $("#ctl00_conteudo_U_NUM381").closest(".col").insertAfter($("#ctl00_conteudo_U_TIPOCONT38").closest(".col"))
    $("#ctl00_conteudo_U_NUM381").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")
    $("#ctl00_conteudo_fref2").closest(".col").insertAfter($("#ctl00_conteudo_U_NUM381").closest(".col"))
    $("#ctl00_conteudo_fref2").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_U_TIPO38").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")
    $("#ctl00_conteudo_U_NUMERO38").closest(".col").insertAfter($("#ctl00_conteudo_U_TIPO38").closest(".col"))
    $("#ctl00_conteudo_U_NUMERO38").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_U_ANOCONC38").closest(".col").insertAfter($("#ctl00_conteudo_U_NUMERO38").closest(".col"))
    $("#ctl00_conteudo_U_ANOCONC38").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_ccusto90").closest(".col").insertBefore($("#ctl00_conteudo_fref2").closest(".col"))
    $("#ctl00_conteudo_ccusto90").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_moeda").closest(".col").insertAfter($("#ctl00_conteudo_U_ANOCONC38").closest(".col"))

    $("#ctl00_conteudo_u_usr638").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")
    $("#ctl00_conteudo_tpdescFornecedor").closest(".col").insertAfter($("#ctl00_conteudo_u_usr638").closest(".col"))
    $("#ctl00_conteudo_tpdescFornecedor").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_pags").hide()
    $("#ctl00_conteudo_U_USR6COD38").hide()
    $("#ctl00_conteudo_fref34").hide()
    $("#ctl00_conteudo_tpdescFornecedor").hide()
    $("#ctl00_conteudo_cambiofixo").hide()

    addClassOnEmptyCols()
    addClassOnEmptyRows()
    $(".empty-row").remove()

    ocultarColunaBI("Dsc 1")
    ocultarColunaBI("Dsc 2")

    ocultarColunaBI("Beneficiário")
    ocultarColunaBI("Nº do Contrato")
    ocultarColunaBI("NIB")
    ocultarColunaBI("Banco")

    ocultarColunaBI("Componente")
    ocultarColunaBI("Desc. Componente")
    ocultarColunaBI("Sub. Componente")
    ocultarColunaBI("Desc. SubComponente")
    ocultarColunaBI("Especificações")
    ocultarColunaBI("P.Actividade")
    ocultarColunaBI("Desc. P.Actividade")
    ocultarColunaBI("bistamp")
    ocultarColunaBI("bidata")
    ocultarColunaBI("Stamp do contrato")
}


function LayoutOrcamento() {
    $("#campos").prepend("<div class='row' id='sec1'></div><div class='row' id='sec2'></div><div class='row' id='sec3'></div><div class='row' id='sec4'></div><div class='row' id='sec5'></div>")
    $("#dataArea").prepend("<div class='row' id='secdata1'></div><div class='row' id='secdata2'></div>")
    $("#sec1").append($("#ctl00_conteudo_nmdosro_mLabel1").closest(".destaque").closest(".row"))
    $("#sec2").append($("#ctl00_conteudo_nome").closest(".row"))
    $("#sec3").append($("#ctl00_conteudo_moeda").closest(".col"))
    //$("#sec4").append($("#ctl00_conteudo_ccusto90").closest(".col"))
    $("#sec5").append($("#ctl00_conteudo_u_orcgeral34").closest(".col"))

    $("#ctl00_conteudo_dataobra").closest(".col").removeClass().addClass("col col-md-2 col-lg-2 col-sm-2")
    $("#ctl00_conteudo_nmdosro").closest(".destaque").closest(".row").append($("#ctl00_conteudo_dataobra").closest(".col"))
    $("#ctl00_conteudo_dataobra").closest(".col").attr("style", "float:right")

    $("#ctl00_conteudo_tabela129").closest(".col").insertBefore($("#ctl00_conteudo_moeda").closest(".col"))
    $("#ctl00_conteudo_tabela129").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_ccusto90").closest(".col").insertAfter($("#ctl00_conteudo_tabela129").closest(".col"))
    $("#ctl00_conteudo_ccusto90").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    //$("#ctl00_conteudo_U_TIPOCONT38").closest(".col").insertBefore($("#ctl00_conteudo_moeda").closest(".col"))
    //$("#ctl00_conteudo_U_TIPOCONT38").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_u_usr638").closest(".col").insertAfter($("#ctl00_conteudo_fref2").closest(".col"))
    $("#ctl00_conteudo_u_usr638").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_fref2").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")
    $("#ctl00_conteudo_fref2").closest(".col").insertAfter($("#ctl00_conteudo_ccusto90").closest(".col"))

    $("#ctl00_conteudo_U_CAMBIO29").closest(".col").insertAfter($("#ctl00_conteudo_fref2").closest(".col"))
    $("#ctl00_conteudo_U_CAMBIO29").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_U_BOCAMPRJ29").closest(".col").insertAfter($("#ctl00_conteudo_U_CAMBIO29").closest(".col"))
    $("#ctl00_conteudo_U_BOCAMPRJ29").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_u_orcgeral34").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_cambiofixo").closest(".col").insertAfter($("#ctl00_conteudo_u_orcgeral34").closest(".col"))
    $("#ctl00_conteudo_cambiofixo").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_ccusto34").hide()
    $(".input-group .checkbox.margintopgrande").removeClass("margintopgrande")
    $("#ctl00_conteudo_pags").hide()
    $("#ctl00_conteudo_U_TIPOCONT38").hide()
    $("#ctl00_conteudo_u_orcgeral34").hide()
    $("#ctl00_conteudo_U_CAMBIO29").hide()
    $("#ctl00_conteudo_U_BOCAMPRJ29").hide()

    addClassOnEmptyCols()
    addClassOnEmptyRows()
    $(".empty-row").remove()

    ocultarColunaBI("Dsc 1")
    ocultarColunaBI("Dsc 2")
    ocultarColunaBI("Beneficiário")
    ocultarColunaBI("Nº do Contrato")
    ocultarColunaBI("NIB")
    ocultarColunaBI("Banco")
    ocultarColunaBI("Especificações")
    ocultarColunaBI("bistamp")
    ocultarColunaBI("Stamp do contrato")
    ocultarColunaBI("bidata")
    ocultarColunaBI("P.Actividade")
    ocultarColunaBI("Desc. P.Actividade")

    $("#ctl00_conteudo_fref34").hide()
}



function LayoutPlanoActividades() {
    $("#campos").prepend("<div class='row' id='sec1'></div><div class='row' id='sec2'></div><div class='row' id='sec3'></div><div class='row' id='sec4'></div><div class='row' id='sec5'></div>")
    $("#dataArea").prepend("<div class='row' id='secdata1'></div><div class='row' id='secdata2'></div>")
    $("#sec1").append($("#ctl00_conteudo_nmdosro_mLabel1").closest(".destaque").closest(".row"))
    $("#sec2").append($("#ctl00_conteudo_nome").closest(".row"))
    $("#sec3").append($("#ctl00_conteudo_moeda").closest(".col"))
    //$("#sec4").append($("#ctl00_conteudo_ccusto90").closest(".col"))
    $("#sec5").append($("#ctl00_conteudo_u_orcgeral34").closest(".col"))

    $("#ctl00_conteudo_dataobra").closest(".col").removeClass().addClass("col col-md-2 col-lg-2 col-sm-2")
    $("#ctl00_conteudo_nmdosro").closest(".destaque").closest(".row").append($("#ctl00_conteudo_dataobra").closest(".col"))
    $("#ctl00_conteudo_dataobra").closest(".col").attr("style", "float:right")

    $("#ctl00_conteudo_tabela129").closest(".col").insertBefore($("#ctl00_conteudo_moeda").closest(".col"))
    $("#ctl00_conteudo_tabela129").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_ccusto90").closest(".col").insertAfter($("#ctl00_conteudo_tabela129").closest(".col"))
    $("#ctl00_conteudo_ccusto90").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    //$("#ctl00_conteudo_U_TIPOCONT38").closest(".col").insertBefore($("#ctl00_conteudo_moeda").closest(".col"))
    //$("#ctl00_conteudo_U_TIPOCONT38").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_u_usr638").closest(".col").insertAfter($("#ctl00_conteudo_fref2").closest(".col"))
    $("#ctl00_conteudo_u_usr638").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_fref2").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")
    $("#ctl00_conteudo_fref2").closest(".col").insertAfter($("#ctl00_conteudo_ccusto90").closest(".col"))

    $("#ctl00_conteudo_U_CAMBIO29").closest(".col").insertAfter($("#ctl00_conteudo_fref2").closest(".col"))
    $("#ctl00_conteudo_U_CAMBIO29").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_U_BOCAMPRJ29").closest(".col").insertAfter($("#ctl00_conteudo_U_CAMBIO29").closest(".col"))
    $("#ctl00_conteudo_U_BOCAMPRJ29").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_u_orcgeral34").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_cambiofixo").closest(".col").insertAfter($("#ctl00_conteudo_u_orcgeral34").closest(".col"))
    $("#ctl00_conteudo_cambiofixo").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_ccusto34").hide()
    $(".input-group .checkbox.margintopgrande").removeClass("margintopgrande")
    $("#ctl00_conteudo_pags").hide()
    $("#ctl00_conteudo_U_TIPOCONT38").hide()
    $("#ctl00_conteudo_u_orcgeral34").hide()
    $("#ctl00_conteudo_U_CAMBIO29").hide()
    $("#ctl00_conteudo_U_BOCAMPRJ29").hide()

    addClassOnEmptyCols()
    addClassOnEmptyRows()
    $(".empty-row").remove()

    ocultarColunaBI("Dsc 1")
    ocultarColunaBI("Dsc 2")
    ocultarColunaBI("Beneficiário")
    ocultarColunaBI("Nº do Contrato")
    ocultarColunaBI("NIB")
    ocultarColunaBI("Banco")
    ocultarColunaBI("Especificações")
    ocultarColunaBI("bistamp")
    ocultarColunaBI("Pr.Unit.")
    ocultarColunaBI("Quant.")
    ocultarColunaBI("Referência")
    ocultarColunaBI("Designação")
    ocultarColunaBI("Total")
    ocultarColunaBI("Pr.Unit.Moeda")
    ocultarColunaBI("Total Moeda")

    ocultarColunaBI("Componente")
    ocultarColunaBI("Desc. Componente")
    ocultarColunaBI("Sub. Componente")
    ocultarColunaBI("Desc. SubComponente")

    ocultarColunaBI("bistamp")
    ocultarColunaBI("Stamp do contrato")
    //ocultarColunaBI("bidata")
    renomearNomeColunaBI("Actividade", "Cod. Actividade (Orçamento)")
    renomearNomeColunaBI("Desc. Actividade", "Descrição da Actividade (Orçamento)")

    renomearNomeColunaBI("P.Actividade", "Cod. Actividade")
    renomearNomeColunaBI("Desc. P.Actividade", "Descrição da Actividade")

    $("#ctl00_conteudo_fref34").hide()

    if ($(".boform.Consultar").length > 0) {
        if ($("#ctl00_conteudo_Gridbi tr td span[id^='ctl00_conteudo_Gridbi_'][id$='_bistampLabel']").length > 0) {
            $("#ctl00_conteudo_Gridbi tr td span[id^='ctl00_conteudo_Gridbi_'][id$='_bistampLabel']").each(function () {
                var span = $(this);
                span.hide();
                var button = $("<button type='button' class='btn btn-link btn-sm btn-ver'>Ver</button>");
                button.on("click", function () {
                    var bistamp = span.text().trim();
                    var stamp = $("input[data-bistamp='" + bistamp + "']").attr("data-bistamp-encrypted");
                    window.open("../programs/genform.aspx?codigo=actividade&stamp=" + stamp, "_blank")
                });
                span.after(button);
            })
        }
        renomearNomeColunaBI("bidata", "Acção")
    } else {
        ocultarColunaBI("bidata")
    }
}

function LayoutPedidoPagamento() {
    $("#campos").prepend("<div class='row' id='sec1'></div><div class='row' id='sec2'></div><div class='row' id='sec3'></div><div class='row' id='sec4'></div><div class='row' id='sec5'></div>")
    $("#dataArea").prepend("<div class='row' id='secdata1'></div><div class='row' id='secdata2'></div>")
    $("#sec1").append($("#ctl00_conteudo_nmdosro_mLabel1").closest(".destaque").closest(".row"))
    $("#sec2").append($("#ctl00_conteudo_nome").closest(".row"))
    $("#sec3").append($("#ctl00_conteudo_moeda").closest(".row"))
    $("#sec4").append($("#ctl00_conteudo_u_FOllocal").closest(".col"))
    $("#sec5").append($("#ctl00_conteudo_u_usr638").closest(".col"))

    $("#ctl00_conteudo_dataobra").closest(".col").removeClass().addClass("col col-md-2 col-lg-2 col-sm-2")
    $("#ctl00_conteudo_nmdosro").closest(".destaque").closest(".row").append($("#ctl00_conteudo_dataobra").closest(".col"))
    $("#ctl00_conteudo_dataobra").closest(".col").attr("style", "float:right")

    $("#ctl00_conteudo_U_TIPOCONT38").closest(".col").insertBefore($("#ctl00_conteudo_moeda").closest(".col"))
    $("#ctl00_conteudo_U_TIPOCONT38").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")
    $("#ctl00_conteudo_U_NUM38").closest(".col").insertAfter($("#ctl00_conteudo_U_TIPOCONT38").closest(".col"))
    $("#ctl00_conteudo_U_NUM38").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_U_TIPO38").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")
    $("#ctl00_conteudo_U_NUMERO38").closest(".col").insertAfter($("#ctl00_conteudo_U_TIPO38").closest(".col"))
    $("#ctl00_conteudo_U_NUMERO38").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_U_ANOCONC38").closest(".col").insertAfter($("#ctl00_conteudo_U_NUMERO38").closest(".col"))
    $("#ctl00_conteudo_U_ANOCONC38").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_ccusto90").closest(".col").insertBefore($("#ctl00_conteudo_moeda").closest(".col"))
    $("#ctl00_conteudo_ccusto90").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_fref2").closest(".col").insertAfter($("#ctl00_conteudo_ccusto90").closest(".col"))
    $("#ctl00_conteudo_fref2").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_u_nomdescr").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")
    $("#ctl00_conteudo_u_nomdescr").closest(".col").insertAfter($("#ctl00_conteudo_moeda").closest(".col"))
    $("#ctl00_conteudo_tpdescFornecedor").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    //$("#ctl00_conteudo_pags").hide()
    $("#ctl00_conteudo_U_USR6COD38").hide()
    $("#ctl00_conteudo_fref34").hide()

    $("#ctl00_conteudo_u_bostamp").hide()
    $("#ctl00_conteudo_u_contrato").hide()
    $("#ctl00_conteudo_U_NUM382").hide()
    $("#ctl00_conteudo_modstamp").hide()
    $("#ctl00_conteudo_u_fdata20").hide()

    $("#ctl00_conteudo_tpdescFornecedor").hide()

    $("#ctl00_conteudo_cambiofixo").hide()

    //$("#ctl00_conteudo_U_TIPOCONT38").closest(".col").hide()
    $("#ctl00_conteudo_U_NUM38").closest(".col").hide()
    $("#ctl00_conteudo_ccusto90").closest(".col").insertBefore($("#ctl00_conteudo_fref2").closest(".col"))

    $("#ctl00_conteudo_U_NUMPG").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")
    $("#ctl00_conteudo_U_NUMPG_U_NUMPGmBox1").prop("readonly", true)
    $("#ctl00_conteudo_nome").closest(".col").removeClass().addClass("col col-md-7 col-lg-7 col-sm-7")
    $("#ctl00_conteudo_nome").closest(".row").append($("#ctl00_conteudo_U_NUMPG").closest(".col"))

    addClassOnEmptyCols()
    addClassOnEmptyRows()
    $(".empty-row").remove()

    ocultarColunaBI("Dsc 1")
    ocultarColunaBI("Dsc 2")

    ocultarColunaBI("Componente")
    ocultarColunaBI("Desc. Componente")
    ocultarColunaBI("Sub. Componente")
    ocultarColunaBI("Desc. SubComponente")
    ocultarColunaBI("Especificações")

    ocultarColunaBI("P.Actividade")
    ocultarColunaBI("Desc. P.Actividade")
    ocultarColunaBI("bistamp")
    ocultarColunaBI("bidata")
    ocultarColunaBI("Stamp do contrato")

    hidePageTab("Cabimentação")
    hidePageTab("Dados da Factura")
    hidePageTab("Modalidades")

    $("#ctl00_conteudo_pags").insertAfter($("#sec3"))
    // $("#ctl00_conteudo_TRAB138").closest(".row").insertAfter($("#ctl00_conteudo_pags"))

    $("#BUPRINTIDU").attr("href", "#")
    $("#BUPRINTIDU").on("click", function () {
        var stamp = $("#spbostamp_").text()
        window.location.href = "../programs/gensel.aspx?eusql=61&bostamp=" + stamp + " "
    })
}


function LayoutRequisicao() {
    $("#campos").prepend("<div class='row' id='sec1'></div><div class='row' id='sec2'></div><div class='row' id='sec3'></div><div class='row' id='sec4'></div><div class='row' id='sec5'></div>")
    $("#dataArea").prepend("<div class='row' id='secdata1'></div><div class='row' id='secdata2'></div>")
    $("#sec1").append($("#ctl00_conteudo_nmdosro_mLabel1").closest(".destaque").closest(".row"))
    $("#sec2").append($("#ctl00_conteudo_nome").closest(".row"))
    $("#sec3").append($("#ctl00_conteudo_obranome").closest(".col"))
    $("#sec4").append($("#ctl00_conteudo_U_TIPO38").closest(".col"))
    $("#sec5").append($("#ctl00_conteudo_u_usr638").closest(".col"))

    $("#ctl00_conteudo_dataobra").closest(".col").removeClass().addClass("col col-md-2 col-lg-2 col-sm-2")
    $("#ctl00_conteudo_nmdosro").closest(".destaque").closest(".row").append($("#ctl00_conteudo_dataobra").closest(".col"))
    $("#ctl00_conteudo_dataobra").closest(".col").attr("style", "float:right")

    $("#ctl00_conteudo_U_TIPOCONT38").closest(".col").insertBefore($("#ctl00_conteudo_moeda").closest(".col"))
    $("#ctl00_conteudo_U_TIPOCONT38").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")
    $("#ctl00_conteudo_fref2").closest(".col").insertAfter($("#ctl00_conteudo_U_TIPOCONT38").closest(".col"))
    $("#ctl00_conteudo_fref2").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_obranome").closest(".col").removeClass().addClass("col col-md-6 col-lg-6 col-sm-6")

    $("#ctl00_conteudo_U_TIPO38").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")
    $("#ctl00_conteudo_U_NUMERO38").closest(".col").insertAfter($("#ctl00_conteudo_U_TIPO38").closest(".col"))
    $("#ctl00_conteudo_U_NUMERO38").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_U_ANOCONC38").closest(".col").insertAfter($("#ctl00_conteudo_U_NUMERO38").closest(".col"))
    $("#ctl00_conteudo_U_ANOCONC38").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_ccusto90").closest(".col").insertBefore($("#ctl00_conteudo_moeda").closest(".col"))
    $("#ctl00_conteudo_ccusto90").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_u_usr638").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")
    $("#ctl00_conteudo_tpdescFornecedor").closest(".col").insertAfter($("#ctl00_conteudo_u_usr638").closest(".col"))
    $("#ctl00_conteudo_tpdescFornecedor").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_u_prazoent").closest(".col").insertAfter($("#ctl00_conteudo_obranome").closest(".col"))
    $("#ctl00_conteudo_u_prazoent").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_carga2").closest(".col").insertAfter($("#ctl00_conteudo_u_prazoent").closest(".col"))
    $("#ctl00_conteudo_carga2").closest(".col").removeClass().addClass("col col-md-3 col-lg-3 col-sm-3")

    $("#ctl00_conteudo_pags").hide()
    $("#ctl00_conteudo_U_USR6COD38").hide()
    //$("#ctl00_conteudo_fref34").hide()

    $("#ctl00_conteudo_u_bostamp").hide()
    $("#ctl00_conteudo_u_contrato").hide()
    $("#ctl00_conteudo_U_NUM382").hide()
    $("#ctl00_conteudo_modstamp").hide()
    $("#ctl00_conteudo_u_fdata20").hide()
    $("#ctl00_conteudo_tpdescFornecedor").hide()

    $("#ctl00_conteudo_U_TIPOCONT38").closest(".col").hide()
    $("#ctl00_conteudo_U_NUM38").closest(".col").hide()
    $("#ctl00_conteudo_ccusto90").closest(".col").insertBefore($("#ctl00_conteudo_fref2").closest(".col"))

    //$("#ctl00_conteudo_etotaldeb").closest(".col").hide()
    //$("#ctl00_conteudo_moeda").closest(".col").hide()

    var $req = $('#ctl00_conteudo_obranome').closest('.col');
    var $prazo = $('#ctl00_conteudo_u_prazoent').closest('.col');
    var $local = $('#ctl00_conteudo_carga2').closest('.col');
    var $moeda = $('#ctl00_conteudo_moeda');

    $req.attr('class', 'col col-md-3 col-lg-3 col-sm-3');
    $prazo.attr('class', 'col col-md-3 col-lg-3 col-sm-3');
    $local.attr('class', 'col col-md-3 col-lg-3 col-sm-3');

    var $colMoeda = $('<div class="col col-md-3 col-lg-3 col-sm-3"></div>');
    $moeda.appendTo($colMoeda);

    $local.after($colMoeda);


    addClassOnEmptyCols()
    addClassOnEmptyRows()
    $(".empty-row").remove()

    ocultarColunaBI("Dsc 1")
    ocultarColunaBI("Dsc 2")

    ocultarColunaBI("Componente")
    ocultarColunaBI("Desc. Componente")
    ocultarColunaBI("Sub. Componente")
    ocultarColunaBI("Desc. SubComponente")

    ocultarColunaBI("Beneficiário")
    ocultarColunaBI("Nº do Contrato")
    ocultarColunaBI("NIB")
    ocultarColunaBI("Banco")

    //ocultarColunaBI("Actividade")
    //ocultarColunaBI("Desc. Actividade")
    //ocultarColunaBI("Pr.Unit.")
    //ocultarColunaBI("Referência")
    //ocultarColunaBI("Total")

    ocultarColunaBI("bistamp")
    ocultarColunaBI("bidata")
    ocultarColunaBI("Stamp do contrato")

    ocultarColunaBI("P.Actividade")
    ocultarColunaBI("Desc. P.Actividade")

    $("#ctl00_conteudo_iemail").hide()
}


function ocultarColunaBI(nomeColuna) {
    var indexColuna = -1;
    var tabela = "#ctl00_conteudo_Gridbi"
    $(tabela + ' tr.defgridheader td').each(function (index) {
        if ($(this).text().trim() === nomeColuna) {
            indexColuna = index;
            return false;
        }
    });
    if (indexColuna === -1) {
        console.warn('Coluna não encontrada:', nomeColuna);
        return;
    }
    $(tabela + ' thead th').eq(indexColuna).hide();
    $(tabela + ' tbody tr').each(function () {
        $(this).find('td').eq(indexColuna).hide();
    });
}


function renomearNomeColunaBI(oldName, newName) {
    var tabela = "#ctl00_conteudo_Gridbi"
    $(tabela + " tr.defgridheader td").each(function () {
        if ($.trim($(this).text()) === oldName) {
            $(this).text(newName);
        }
    });
}

function addClassOnEmptyCols() {
    var emptyColDivs = $('#campos div.col').filter(function () {
        return $.trim($(this).text()) === '';
    });
    emptyColDivs.addClass('empty-col');
}

function addClassOnEmptyRows() {
    var emptyColDivs = $('#campos div.row').filter(function () {
        return $.trim($(this).text()) === '';
    });
    emptyColDivs.addClass('empty-row');
}


function opcaoCarregarExcelOrcamento() {
    $("#userOption50").attr("href", "#");
    $("#userOption50").on("click", function () {
        $("#modalCarregarExcel").modal("show");
        $("#submeter-excel").on("click", function () {
            __doPostBack("ctl00$conteudo$options3$userOption50", "");
        })
    });
}



/*--------------------- COPY - PAST FUNÇÕES MAEFP  -------------------------------*/

function showModalCED() {
    if ($("#modalCEDs").length > 0) {
        $("#modalCEDs").modal("show");
        return
    } else {
        if (modalCEDHtml !== "") {
            $(document.body).append(modalCEDHtml);
            $("#modalCEDs").modal("show");
            return
        } else {
            $.ajax({
                url: "../programs/gensel.aspx?cscript=fo_ced",
                cache: false,
                timeout: 0,
                data: {},
                beforeSend: function () {
                    initLoader()
                },
                success: function (data) {
                    console.log(data);
                    if (data.success) {
                        modalCEDHtml = data.modal;
                        $(document.body).append(modalCEDHtml);
                        $("#modalCEDs").modal("show");
                    } else {
                        alertify.log(data.message, "error")
                        console.log(data)
                    }
                    closeLoader();
                },
                error: function (data) {
                    closeLoader();
                    alertify.log("Ocorreu um erro ao tentar se conectar ao servidor!", "error")
                    console.log(data)
                }
            });
        }
    }
}


function showModalActividade() {

    $("#modalAssociarActividadeDoOrcamento").modal("hide");
    $("#modalAssociarActividadeDoOrcamento").remove()
    modalActividadeHtml = ""

    if ($("#modalAssociarActividadeDoOrcamento").length > 0) {
        $("#modalAssociarActividadeDoOrcamento").modal("show");
        return
    } else {
        if (modalActividadeHtml !== "") {
            $(document.body).append(modalActividadeHtml);
            $("#modalAssociarActividadeDoOrcamento").modal("show");
            return
        } else {
            $.ajax({
                url: "../programs/gensel.aspx?cscript=bo_orcamento",
                cache: false,
                timeout: 0,
                data: { ccusto: $("#ctl00_conteudo_ccusto90_ccusto90mBox1").val(), dataobra: $("#ctl00_conteudo_dataobra_dataobramBox1").val(), usr6: $("#ctl00_conteudo_u_usr638_u_usr638mBox1").val() },
                beforeSend: function () {
                    initLoader()
                },
                success: function (data) {
                    console.log(data);
                    if (data.success) {
                        modalActividadeHtml = data.modal;
                        $(document.body).append(modalActividadeHtml);
                        $("#modalAssociarActividadeDoOrcamento").modal("show");
                    } else {
                        alertify.log(data.message, "error")
                        console.log(data)
                    }
                    closeLoader();
                },
                error: function (data) {
                    closeLoader();
                    alertify.log("Ocorreu um erro ao tentar se conectar ao servidor!", "error")
                    console.log(data)
                }
            });
        }
    }
}


function showModalConsultor() {

    $("#modalfl").modal("hide");
    $("#modalfl").remove()
    modalConsultorHtml = ""

    if ($("#modalfl").length > 0) {
        $("#modalfl").modal("show");
        return
    } else {
        if (modalConsultorHtml !== "") {
            $(document.body).append(modalConsultorHtml);
            $("#modalfl").modal("show");
            return
        } else {
            var no = 0
            if ($("#ctl00_conteudo_no_nomBox1").length) {
                no = $("#ctl00_conteudo_no_nomBox1").val()
            } else {
                no = $("#ctl00_conteudo_no_mLabel1").text()
            }
            $.ajax({
                url: "../programs/gensel.aspx?cscript=bo_escolher_consultor",
                cache: false,
                timeout: 0,
                data: { no: no, tipoCont: $("#ctl00_conteudo_U_TIPOCONT38_U_TIPOCONT38mBox1").val() },
                beforeSend: function () {
                    initLoader()
                },
                success: function (data) {
                    console.log(data);
                    if (data.success) {
                        modalConsultorHtml = data.modal;
                        $(document.body).append(modalConsultorHtml);
                        $("#modalfl").modal("show");
                    } else {
                        alertify.log(data.message, "error")
                        console.log(data)
                    }
                    closeLoader();
                },
                error: function (data) {
                    closeLoader();
                    alertify.log("Ocorreu um erro ao tentar se conectar ao servidor!", "error")
                    console.log(data)
                }
            });
        }
    }
}


function registerShowModalBoxesClickListener() {
    /*$("#userOption1").removeAttr("href");
       $("#userOption1").on("click", function(){
        $("#modalmatriz").modal('show');
      }); */
    $("#userOption2").removeAttr("href");
    $("#userOption2").on("click", function () {
        $("#modalOrcamento").modal('show');
    });
    $("#userOption4").removeAttr("href");
    $("#userOption4").on("click", function () {
        $("#modal_modalidades").modal('show');
    });
    $("#userOption5").removeAttr("href");
    $("#userOption5").on("click", function () {
        $("#modalCriarRequisicao").modal('show');
    });
    $("#userOption13").removeAttr("href");
    $("#userOption13").on("click", function () {
        $("#modalAssociarActividadeDoOrcamentoGeral").modal('show');
    });
    $("#userOption25").removeAttr("href");
    $("#userOption25").on("click", function () {
        $("#modalAssociarContrato").modal('show');
    });
    $("#userOption57").removeAttr("href");
    $("#userOption57").on("click", function () {
        $("#modalAssociarFactura").modal('show');
    });
    $("#userOption60").removeAttr("href");
    $("#userOption60").on("click", function () {
        $("#modalAssociarDespesas").modal('show');
    });

    $("#userOption35").removeAttr("href");
    $("#userOption35").on("click", function () {
        $("#modalCambio").modal('show');
    });
    $("#ctl00_conteudo_U_NUM38_U_NUM38mBox1").on("focus", function () {
        $("#modalAssociarContrato").modal('show');
    });
    $("#BUACTUALIZAR").removeAttr("href");
    $("#BUACTUALIZAR").on("click", function () {
        $("#editarContrato").modal('show');
    });
    //Arrancar workflow
    /*$("#STARTWWFBUTTON").removeAttr("href");
    $("#STARTWWFBUTTON").on("click", function () {
          __doPostBack('ctl00$conteudo$options2$userOption24','')
    });*/
    // Show modalbox Classificador da actividade
    //$("#ctl00_conteudo_Gridbi tr td:last-child a").removeAttr("href");
    //$("#ctl00_conteudo_Gridbi tr td:last-child a").on("click", function () {
    $("#ctl00_conteudo_Gridbi tr td input[name*='U_NIVEL5'], #ctl00_conteudo_Gridbi tr td input[name*='U_CODNIVL5']").on("focus", function () {
        selectedActividadeRow = $("#ctl00_conteudo_Gridbi tr").index($(this).parents("tr"));
        var selectedActRow = $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_CODNIVL5").val();
        $('input:radio[name="orcamento_bo"]').filter('[value="' + selectedActRow + '"]').prop('checked', true);
        showModalActividade()
    });

    // Show modalbox Classificador da categoria
    /*$("#ctl00_conteudo_Gridbi tr td input[name*='U_NIVEL3'], #ctl00_conteudo_Gridbi tr td input[name*='U_CODNIVL3']").on("focus", function () {
        selectedCategoriaRow = $("#ctl00_conteudo_Gridbi tr").index($(this).parents("tr"));
        var selectedCatRow = $("#ctl00_conteudo_Gridbi_ctl0" + (selectedCategoriaRow + 1) + "_U_CODNIVL5").val();
        $("#modalAssociarCategoria").modal("show");
    });*/

    //Show modalbox Classificador ced
    /*$("#ctl00_conteudo_Gridbi tr td input[name*='U_CED1']").on("focus", function () {
        selectedCedRow = $("#ctl00_conteudo_Gridbi tr").index($(this).parents("tr"));
        //var selectedActRow = $("#ctl00_conteudo_Gridbi_ctl0" + (selectedCedRow + 1) + "_U_CODNIVL5").val();
        showModalCED()
    });*/

    //Show modalbox escolher consultor
    $("#ctl00_conteudo_Gridbi tr td input[name*='u_funciona']").on("focus", function () {
        selectedNomeRow = $("#ctl00_conteudo_Gridbi tr").index($(this).parents("tr"));
        showModalConsultor()
    });

    //limpar linhas após mudar delegação
    $('#ctl00_conteudo_u_usr638_u_usr638mBox1').on('change', function () {
        $('#ctl00_conteudo_Gridbi tbody tr').each(function () {
            $(this).find('input[name*="U_"]').val('');
        });
    })

}

function registerRemoveNativeButtons() {
    $("#CopyBoTo").remove();
    $("#CloseBo").remove();
    $("#BENVIAREMAIL").remove();
    $("#BENVIARMENSAGEM").remove();
}
function registerHideControls() {
    $("#ctl00_conteudo_u_bostamp").hide();
    $("#ctl00_conteudo_u_contrato").hide();
    $('#ctl00_conteudo_U_NUM382_U_NUM382mBox1').hide();
    $("#ctl00_conteudo_Gridbi tbody tr td:last-child").hide();
    $("#ctl00_conteudo_modstamp").hide();
}
function registerImagesOnSpansInsideButtons() {
    $("#userOption2 span").addClass('glyphicon glyphicon-plus');
    $("#userOption4 span").addClass('glyphicon glyphicon-list-alt');
    $("#userOption5 span").addClass('glyphicon glyphicon-plus');
    $("#userOption43 span").addClass('glyphicon glyphicon-plus');
    $("#userOption6 span").addClass('glyphicon glyphicon-plus');
    $("#userOption11 span").addClass('glyphicon glyphicon-share');
    $("#userOption10 span").addClass('glyphicon glyphicon-dashboard');
    $("#userOption43 span").addClass('glyphicon glyphicon-plus');
}
function registerChangeObjectPositions() {
    var main = $('#mainRecsZone')
    $('#campos').prepend(main)
}

function registerReadOnlyFields() {
    $("#ctl00_conteudo_U_NUM38_U_NUM38mBox1").prop('readonly', true);
    $("#ctl00_conteudo_Gridbi tr td input[name*='u_'], #ctl00_conteudo_Gridbi tr td input[name*='U_']").prop('readonly', true);
    var circuito = $.trim($("#ctl00_conteudo_u_nomdescr_mLabel1").text()).substring(0, 1)
    if (circuito == "7") {
        $("#userOption51").removeAttr("href");
        $("#userOption51").on("click", function () {
            $("#modalBIs").modal('show');
        });
    } else if (circuito == "2") {
        //$("#userOption51").removeAttr("href");
        //$("#userOption51").on("click", function () {
        //$("#modalBIsParaCompra").modal("show")
        //});

        if ($("#NaoEfectuarCompra").length > 0) { $("#userOption51").hide(); }
    }
    var wtwid = $("#wtwid").val();
    if (wtwid == "13") {
        $("#STARTWWFBUTTON").html("<span class='fa fa-sitemap'></span> Pedido de Alteração");
    } else if (wtwid == "0") {
        $("#STARTWWFBUTTON").remove();
    }
    $("#BUACTUALIZAR").html("<span class='glyphicon glyphicon-share'></span>Renovar Contracto");

    //$("#ctl00_conteudo_Gridbi tr td:nth-child(7)").prop('readonly', true);
    //$("#ctl00_conteudo_Gridbi tr td input[name*='u_funciona']").nextAll().prop('readonly', true);
    //$("li.start").nextAll().css({"color": "red", "border": "2px solid red"});
    //$("#ctl00_conteudo_Gridbi tr td").slice(8).prop('readonly', true);

    $("#ctl00_conteudo_Gridbi tr td input[name*='u_especif']").prop("readonly", false)

    if ($("#mainPage").attr("data-doctype") == '42') {
        $("#ctl00_conteudo_Gridbi tr td input[name*='u_'], #ctl00_conteudo_Gridbi tr td input[name*='U_']").prop('readonly', false);
        $("#ctl00_conteudo_Gridbi tr td input[name*='U_CODNIVL5'], #ctl00_conteudo_Gridbi tr td input[name*='U_NIVEL5']").prop('readonly', true);
    }


}

function registerCheckTodosOnChange() {
    $('#check-todos').change(function () {
        if ($(this).prop('checked')) {
            $('tbody tr td input[type="checkbox"]').each(function () {
                $(this).prop('checked', true);
                $(this).parents('tr').find('td').eq(0).find('input').attr('value', $(this).val());
            });
        } else {
            $('tbody tr td input[type="checkbox"]').each(function () {
                $(this).prop('checked', false);
                $(this).parents('tr').find('td').eq(0).find('input').attr('value', '0');
            });
        }
    });
}
function registerCheckDirOnChange() {
    var oldNoconta = $('#bl-conta').find(":selected").val();
    var conta = "DP         Direct Payments"
    var noconta = 25
    $('#check-dir').change(function () {
        if ($(this).prop('checked')) {
            $(".bl-conta").val(noconta).change();
            //$("#bl-conta > option").each(function() {
            //$(this).attr('value', noconta);
            //$(this).text(conta);
            //});
        } else {
            $(".bl-conta").val(oldNoconta).change();
            //$("#bl-conta > option").each(function() {
            //$(this).attr('value', "");
            //$(this).text("");
            //});
        }
    });
}

function GravarBo() {
    __doPostBack('ctl00$conteudo$options3$userOption1', '');
}
function criarOrcamento() {
    __doPostBack('ctl00$conteudo$options3$userOption2', '');
}
function criarModalidade() {
    //$("#modal_modalidades").modal('hide');
    //showProgressBar();
    __doPostBack('ctl00$conteudo$options3$userOption4', '')
}
function criarRequisicao() {
    __doPostBack('ctl00$conteudo$options3$userOption5', '');
}


function ComprarHonorarios() {
    //Para Lançar compras ao invés de adiantamentos, descomente a linha abaixo e comente a linha seguinte
    //__doPostBack('ctl00$conteudo$options3$userOption52', '');
    __doPostBack('ctl00$conteudo$options3$userOption72', '');
}


function ComprarRequisicao() {
    __doPostBack('ctl00$conteudo$options3$userOption53', '');
}
function alterarCambio() {
    __doPostBack('ctl00$conteudo$options3$userOption35', '');
}
//Filtro na classificação de actividade
function registerFilterActividadeOnKeyUpListener() {
    $(document).on("keyup", "#filter-actividade", function () {
        var keyword = $(this).val().toLowerCase();
        console.log(keyword);
        console.log($("#grid_linhasdeorcamento tbody tr:not(:first-child)").length);
        $("#grid_linhasdeorcamento tbody tr").each(function () {
            var codActividadeValue = $(this).children(".codactividade").html().toLowerCase();
            var descActividadeValue = $(this).children(".actividade").html().toLowerCase();
            console.log(codActividadeValue);
            var hideRow = false;
            if (codActividadeValue.indexOf(keyword) == -1 && descActividadeValue.indexOf(keyword) == -1) {
                hideRow = true;
            }
            if (hideRow) {
                $(this).css("display", "none")
            } else {
                $(this).css("display", "table-row")
            }
        });
    });
}

// Filtro de registos na matriz de orçamento
function registerFilterMatrizOnKeyUpListener() {
    $("#filter-matriz").on("keyup", function () {
        var keyword = $(this).val().toLowerCase();
        console.log(keyword);
        console.log($("#tableOrcamento tbody tr:not(:first-child)").length);
        $("#tableOrcamento tbody tr").each(function () {
            var codActividadeValue = $(this).children(".codactividade").html().toLowerCase();
            var descActividadeValue = $(this).children(".actividade").html().toLowerCase();
            console.log(codActividadeValue);
            var hideRow = false;
            if (codActividadeValue.indexOf(keyword) == -1 && descActividadeValue.indexOf(keyword) == -1) {
                hideRow = true;
            }
            if (hideRow) {
                $(this).css("display", "none")
            } else {
                $(this).css("display", "table-row")
            }
        });
    });
}
//Filtro de registos de CED
function registerFilterCEDOnKeyUpListener() {
    $(document).on("keyup", "#filter-ced", function () {
        var keyword = $(this).val().toLowerCase();
        console.log(keyword);
        console.log($("#gridCeds tbody tr:not(:first-child)").length);
        $("#gridCeds tbody tr").each(function () {
            var ced = $(this).children(".ced").html().toLowerCase();
            var descCed = $(this).children(".descced").html().toLowerCase();
            console.log(ced);
            var hideRow = false;
            if (ced.indexOf(keyword) == -1 && descCed.indexOf(keyword) == -1) {
                hideRow = true;
            }
            if (hideRow) {
                $(this).css("display", "none")
            } else {
                $(this).css("display", "table-row")
            }
        });
    });
}
//Filtro de registos de Consultores
function registerFilterNomeOnKeyUpListener() {
    $(document).on("keyup", "#filter-nome", function () {
        var keyword = $(this).val().toLowerCase();
        $("#gridfl tbody tr").each(function () {
            var nome = $(this).children(".nome").html().toLowerCase();
            var nib = $(this).children(".nib").html().toLowerCase();
            var banco = $(this).children(".banco").html().toLowerCase();
            var hideRow = false;
            if (nome.indexOf(keyword) == -1 && nib.indexOf(keyword) == -1 && banco.indexOf(keyword) == -1) {
                hideRow = true;
            }
            if (hideRow) {
                $(this).css("display", "none")
            } else {
                $(this).css("display", "table-row")
            }
        });
    });
}

//Butão Classificação de actividade
function registerSelectActividadeButtonClickListener() {
    $(document).off("click", ".select-actividade-button").on('click', '.select-actividade-button', function () {
        console.log("DFGYHUJKL")
        var selectedActividadeElement = $(this);
        var selectedActividade = selectedActividadeElement.parent("td").siblings(".codactividade").html();
        var selectedCodComponente = selectedActividadeElement.parent("td").siblings(".codcomponente").html();
        var selectedCodSubcomponente = selectedActividadeElement.parent("td").siblings(".codsubcomponente").html();
        var selectedComponente = selectedActividadeElement.parent("td").siblings(".componente").html();
        var selectedSubcomponente = selectedActividadeElement.parent("td").siblings(".subcomponente").html();
        var selectedAct = selectedActividadeElement.parent("td").siblings(".actividade").html();
        var selectedCiclo = selectedActividadeElement.parent("td").siblings(".ciclo").html();
        var selectedProvincia = selectedActividadeElement.parent("td").siblings(".provincia").html();
        var selectedMunicipio = selectedActividadeElement.parent("td").siblings(".municipio").html();
        var selectedCoddelegacao = selectedActividadeElement.parent("td").siblings(".coddelegacao").html();
        var isChecked = $("#check-actividade-todos").is(":checked")
        if (isChecked) {

            $("#ctl00_conteudo_Gridbi tr td input[id*='_U_CODNIVL5']").val(selectedActividade)
            $("#ctl00_conteudo_Gridbi tr td input[id*='U_CODNIVL2']").val(selectedCodSubcomponente)
            $("#ctl00_conteudo_Gridbi tr td input[id*='U_CODNIVL1']").val(selectedCodComponente)
            $("#ctl00_conteudo_Gridbi tr td input[id*='U_NIVEL1']").val(selectedComponente)
            $("#ctl00_conteudo_Gridbi tr td input[id*='U_NIVEL2']").val(selectedSubcomponente)
            $("#ctl00_conteudo_Gridbi tr td input[id*='U_NIVEL5']").val(selectedAct)
            $("#ctl00_conteudo_Gridbi tr td input[id*='U_CICLO']").val(selectedCiclo)
            $("#ctl00_conteudo_Gridbi tr td input[id*='u_provinc']").val(selectedProvincia)
            $("#ctl00_conteudo_Gridbi tr td input[id*='u_municip']").val(selectedMunicipio)
            $("#ctl00_conteudo_Gridbi tr td input[id*='u_usr6cod']").val(selectedCoddelegacao)
            $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_CODNIVL5").trigger("change");
        } else {
            console.log("GHJ")
            console.log("ROW", selectedActividadeRow)
            if (selectedActividadeRow + 1 >= 10) {
                $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_CODNIVL5").val(selectedActividade);
                $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_CODNIVL2").val(selectedCodSubcomponente);
                $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_CODNIVL1").val(selectedCodComponente);
                $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_NIVEL1").val(selectedComponente);
                $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_NIVEL2").val(selectedSubcomponente);
                $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_NIVEL5").val(selectedAct);
                $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_CICLO").val(selectedCiclo);
                $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_u_provinc").val(selectedProvincia);
                $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_u_municip").val(selectedMunicipio);
                $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_u_usr6cod").val(selectedCoddelegacao);
                //$("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_u_moedaprj").val(selectedActividade);
                //$("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_u_moedaref").val(selectedActividade);
                //$("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_bifref").val(selectedActividade);
                $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_CODNIVL5").trigger("change");
            } else {
                console.log("2222")
                $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_CODNIVL5").val(selectedActividade);
                $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_CODNIVL2").val(selectedCodSubcomponente);
                $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_CODNIVL1").val(selectedCodComponente);
                $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_NIVEL1").val(selectedComponente);
                $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_NIVEL2").val(selectedSubcomponente);
                $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_NIVEL5").val(selectedAct);
                $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_CICLO").val(selectedCiclo);
                $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_u_provinc").val(selectedProvincia);
                $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_u_municip").val(selectedMunicipio);
                $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_u_usr6cod").val(selectedCoddelegacao);
                //$("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_u_moedaprj").val(selectedActividade);
                //$("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_u_moedaref").val(selectedActividade);
                //$("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_bifref").val(selectedActividade);
                $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_CODNIVL5").trigger("change");
            }
        }
        $("#modalAssociarActividadeDoOrcamento").modal("hide")
        $("#check-actividade-todos").prop("checked", false)

    })
}
//Butão Classificação de categoria
function registerSelectCategoriaButtonClickListener() {
    $('.select-categoria-button').on('click', function () {
        var selectedCategoriaElement = $(this);
        var selectedCodCategoria = selectedCategoriaElement.parent("td").siblings(".codcategoria").html();
        var selectedCategoria = selectedCategoriaElement.parent("td").siblings(".categoria").html();
        var isChecked = $("#check-categoria-todos").is(":checked")
        if (isChecked) {
            $("#ctl00_conteudo_Gridbi tr td input[name*='U_CODNIVL3']").val(selectedCodCategoria)
            $("#ctl00_conteudo_Gridbi tr td input[name*='U_NIVEL3']").val(selectedCategoria)
            $("#ctl00_conteudo_Gridbi_ctl0" + (selectedCategoriaRow + 1) + "_U_CODNIVL3").trigger("change");
        } else {
            if (selectedCategoriaRow + 1 >= 10) {
                $("#ctl00_conteudo_Gridbi_ctl" + (selectedCategoriaRow + 1) + "_U_CODNIVL3").val(selectedCodCategoria);
                $("#ctl00_conteudo_Gridbi_ctl" + (selectedCategoriaRow + 1) + "_U_NIVEL3").val(selectedCategoria);
                $("#ctl00_conteudo_Gridbi_ctl" + (selectedCategoriaRow + 1) + "_U_CODNIVL3").trigger("change");
            } else {
                $("#ctl00_conteudo_Gridbi_ctl0" + (selectedCategoriaRow + 1) + "_U_CODNIVL3").val(selectedCodCategoria);
                $("#ctl00_conteudo_Gridbi_ctl0" + (selectedCategoriaRow + 1) + "_U_NIVEL3").val(selectedCategoria);
                $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_CODNIVL3").trigger("change");
            }
        }
    })
}
// Butão Classificador CED
function registerSelectCEDButtonClickListener() {
    $(document).on('click', '.select-ced-button', function () {
        var selectedCEDElement = $(this);
        var selectedCED = selectedCEDElement.parent("td").siblings(".ced").html();
        var selectedDESCCED = selectedCEDElement.parent("td").siblings(".descced").html();
        var isChecked = $("#modalCEDs #check-todos").is(":checked")
        //console.log(isChecked);
        if (isChecked) {
            $("#ctl00_conteudo_Gridbi tr td input[name*='U_CED1']").val(selectedCED)
            $("#ctl00_conteudo_Gridbi tr td input[name*='U_DESCCED1']").val(selectedDESCCED)
            $("#ctl00_conteudo_Gridbi_ctl0" + (selectedCedRow + 1) + "_U_CED1").trigger("change");
        } else {
            if (selectedCedRow + 1 >= 10) {
                $("#ctl00_conteudo_Gridbi_ctl" + (selectedCedRow + 1) + "_U_CED1").val(selectedCED);
                $("#ctl00_conteudo_Gridbi_ctl" + (selectedCedRow + 1) + "_U_DESCCED1").val(selectedDESCCED);
                $("#ctl00_conteudo_Gridbi_ctl" + (selectedCedRow + 1) + "_U_CED1").trigger("change");
            } else {
                $("#ctl00_conteudo_Gridbi_ctl0" + (selectedCedRow + 1) + "_U_CED1").val(selectedCED);
                $("#ctl00_conteudo_Gridbi_ctl0" + (selectedCedRow + 1) + "_U_DESCCED1").val(selectedDESCCED);
                $("#ctl00_conteudo_Gridbi_ctl0" + (selectedCedRow + 1) + "_U_CED1").trigger("change");
            }
        }
    })
}



function handleChangeCircuito() {
    $("#ctl00_conteudo_u_nomdescr_u_nomdescrmBox1").on("change", function () {
        ocultarBotoesPorCircuito()
    })
}


function ocultarBotoesPorCircuito() {
    $("#userOption51").hide()
    $("#userOption54").hide()
    $("#userOption58").hide()
    $("#userOption59").hide()
    $("#userOption65").hide()

    $("#userOption25").hide()
    $("#userOption57").hide()
    $("#userOption60").hide()

    hidePageTab("Documento de Tesouraria")
    hidePageTab("Transferência")

    var circuito = $("#ctl00_conteudo_u_nomdescr_u_nomdescrmBox1").length ? $.trim($("#ctl00_conteudo_u_nomdescr_u_nomdescrmBox1").val()).substring(0, 1) : $.trim($("#ctl00_conteudo_u_nomdescr_mLabel1").text()).substring(0, 1)
    if (circuito == "7" || circuito == "2" || circuito == "3") {
        $("#userOption51").show()
    };
    if (circuito == "2") {
        $("#userOption25").show()
    }
    if (circuito == "3") {
        $("#userOption54").show()
    };
    if (circuito == "1") {
        $("#userOption58").show()
        $("#userOption57").show()
    };

    if (circuito == "4") {
        $("#userOption59").show()
        showPageTab("Documento de Tesouraria")
    }

    if (circuito == "5") {
        $("#userOption65").show()
        showPageTab("Transferência")
    };

    if (circuito == "6") {
        $("#userOption60").show()
        $("#userOption65").show()
        showPageTab("Transferência")
    }
}

// Butão Escolher consultor
function registerSelectConsultorButtonClickListener() {
    $(document).on('click', '.select-fl-button', function () {
        var selectedNomeElement = $(this);
        var tipo = $(this).attr('data-tipo')
        var selectedNome = selectedNomeElement.parent("td").siblings(".nome").html();
        var selectedNIB = selectedNomeElement.parent("td").siblings(".nib").html();
        var selectedBanco = selectedNomeElement.parent("td").siblings(".banco").html();
        if (tipo == "Honorarios") {
            var selectedContrato = selectedNomeElement.parent("td").siblings(".u_num").html();
            var selectedStamp = selectedNomeElement.parent("td").siblings(".u_contrato").html();
            var selectedCodComponente = selectedNomeElement.parent("td").siblings(".u_codnivl1").html();
            var selectedCodSubcomponente = selectedNomeElement.parent("td").siblings(".u_codnivl2").html();
            var selectedCodCategoria = selectedNomeElement.parent("td").siblings(".u_codnivl3").html();
            var selectedCodActividade = selectedNomeElement.parent("td").siblings(".u_codnivl5").html();
            var selectedComponente = selectedNomeElement.parent("td").siblings(".u_nivel1").html();
            var selectedSubcomponente = selectedNomeElement.parent("td").siblings(".u_nivel2").html();
            var selectedCategoria = selectedNomeElement.parent("td").siblings(".u_nivel3").html();
            var selectedAct = selectedNomeElement.parent("td").siblings(".u_nivel4").html();
            var selectedCed = selectedNomeElement.parent("td").siblings(".u_ced1").html();
            var selectedDescCed = selectedNomeElement.parent("td").siblings(".u_descced1").html();
            var selectedMensal = selectedNomeElement.parent("td").siblings(".mensal").html();
            var selectedDesign = selectedNomeElement.parent("td").siblings(".design").html();
            var selectedCiclo = selectedNomeElement.parent("td").siblings(".ciclo").html();
            var ref = "D63225"
            var qtt = 1
        }

        if (selectedNomeRow + 1 >= 10) {
            $("#ctl00_conteudo_Gridbi_ctl" + (selectedNomeRow + 1) + "_u_funciona").val(selectedNome);
            $("#ctl00_conteudo_Gridbi_ctl" + (selectedNomeRow + 1) + "_u_flnib").val(selectedNIB);
            $("#ctl00_conteudo_Gridbi_ctl" + (selectedNomeRow + 1) + "_u_flbanco").val(selectedBanco);
            $("#ctl00_conteudo_Gridbi_ctl" + (selectedNomeRow + 1) + "_u_funciona").trigger("change");

        } else {
            $("#ctl00_conteudo_Gridbi_ctl0" + (selectedNomeRow + 1) + "_u_funciona").val(selectedNome);
            $("#ctl00_conteudo_Gridbi_ctl0" + (selectedNomeRow + 1) + "_u_flnib").val(selectedNIB);
            $("#ctl00_conteudo_Gridbi_ctl0" + (selectedNomeRow + 1) + "_u_flbanco").val(selectedBanco);
            $("#ctl00_conteudo_Gridbi_ctl0" + (selectedNomeRow + 1) + "_u_funciona").trigger("change");
        }
        //$("#ctl00_conteudo_Gridbi tr td input[name*='u_funciona']").val(selectedNome)
        //$("#ctl00_conteudo_Gridbi_ctl0" + (selectedNomeRow + 1) + "_u_funciona").trigger("change");
        //$("td[name*='u_funciona']").val(selectedNome);
        //$("#u_funciona").val(selectedNome);
        //$("#u_funciona").trigger("change");
        //$("#ctl00_conteudo_Gridbi tr td input[name*='u_']").val()
    })
}

function registerSelectContratoButtonClickListener() {
    $('.select-contrato-button').on('click', function () {
        var contratoBostamp = $(this).attr('data-bostamp')
        var num = $(this).attr('data-u_num')
        $('#contrato-bostamp').val(contratoBostamp)
        $("#ctl00_conteudo_U_NUMPG_U_NUMPGmBox1").val(num).trigger("change")
        if (num != "" && num != null && num != undefined && num != "N/A") {
            $("#ctl00_conteudo_ccusto90_ccusto90mBox1").val($(this).attr('data-ccusto')).trigger("change")
            $("#ctl00_conteudo_fref2_fref2mBox1").val($(this).attr('data-fref')).trigger("change")
            $("#ctl00_conteudo_moeda_moedamBox1").val($(this).attr('data-moeda')).trigger("change")
            $("#ctl00_conteudo_TRAB138_TRAB138mBox1").val($(this).attr('data-u_trab1')).trigger("change")
        }
        $("#ctl00_conteudo_u_nomdescr_u_nomdescrmBox1").val("2 - Pronto Pagamento").trigger("change")
        $('#ctl00_conteudo_U_NUM38_U_NUM38mBox1').val($(this).attr('data-u_num')).trigger("change")
        $('#ctl00_conteudo_U_NUM382_U_NUM382mBox1').val($(this).attr('data-u_num')).trigger("change")
        $('#ctl00_conteudo_u_bostamp_u_bostampmBox1').val(contratoBostamp).trigger("change")
        $('#ctl00_conteudo_u_contrato_u_contratomBox1').val(contratoBostamp).trigger("change")
        $('#ctl00_conteudo_modstamp_modstampmBox1').val($(this).attr('data-modstamp'))
        __doPostBack('ctl00$conteudo$options3$userOption25', '');
    })
}

function registerSelectCompraButtonClickListener() {
    $('.select-compra-button').on('click', function () {
        var contratoFostamp = $(this).attr('data-fostamp')
        var contratoBostamp = $(this).attr('data-bostamp')
        var fcstamp = $(this).attr('data-fcstamp')
        var nome = $(this).attr('data-nome')
        var cmdesc = $(this).attr('data-cmdesc')
        var saldo = $(this).attr('data-saldo')
        $('#data_fc_fcstamp').val(fcstamp)
        $('#data_fc_cmdesc').val(cmdesc)
        $('#data_fc_saldo').val(saldo)
        $('#data_fc_nome').val(nome)
        // $("#ctl00_conteudo_ccusto90_ccusto90mBox1").val($(this).attr('data-ccusto')).trigger("change")
        // $("#ctl00_conteudo_fref2_fref2mBox1").val($(this).attr('data-fref')).trigger("change")
        // $("#ctl00_conteudo_moeda_moedamBox1").val($(this).attr('data-moeda')).trigger("change")
        // $("#ctl00_conteudo_TRAB138_TRAB138mBox1").val($(this).attr('data-u_trab1')).trigger("change")
        // $("#ctl00_conteudo_u_nomdescr_u_nomdescrmBox1").val("1 - Normal").trigger("change")

        //  $('#ctl00_conteudo_U_NUM38_U_NUM38mBox1').val($(this).attr('data-u_num')).trigger("change")
        //  $('#ctl00_conteudo_U_NUM382_U_NUM382mBox1').val($(this).attr('data-u_num')).trigger("change")

        // $('#ctl00_conteudo_u_bostamp_u_bostampmBox1').val(contratoBostamp).trigger("change")
        // $('#ctl00_conteudo_u_contrato_u_contratomBox1').val(contratoBostamp).trigger("change")

        __doPostBack('ctl00$conteudo$options3$userOption57', '');
    })
}
// Checkbox do consultor a emitir compra
function registerGetBIPorComprarClickListener() {
    $('.check-comprar').on('click', function () {
        //var isChecked = $(this).parents('tr').find('td').eq(1).find('input[type=checkbox]').prop('checked');
        //var stamp = $(this).parents('tr').find('td').eq(1).find('input[type=checkbox]').val();
        var isChecked = $(this).prop("checked");
        var stamp = $(this).val()
        if (isChecked == false) {
            $(this).parents('tr').find('td').eq(0).find('input').attr('value', '0');
        } else {
            $(this).parents('tr').find('td').eq(0).find('input').attr('value', stamp);
        }
    })
}
// Checkbox do consultor a emitir compra (Pagamento directo)
function registerGetBIPorComprarDirectoClickListener() {
    $('.check-directo').on('click', function () {
        var isChecked2 = $(this).prop("checked");
        if (isChecked2 == false) {
            $(this).attr('value', '0');
        } else {
            $(this).attr('value', '1');
        }
    })
}

function registerGetValuebtnClickListener() {
    $('.edit-checkbox').on('click', function () {
        var isChecked = $(this).parents('tr').find('td').eq(1).find('input[type=checkbox]').prop('checked');
        var stamp = $(this).parents('tr').find('td').eq(1).find('input[type=checkbox]').val();
        if (isChecked == false) {
            $(this).parents('tr').find('td').eq(0).find('input').attr('value', '0');
        } else {
            $(this).parents('tr').find('td').eq(0).find('input').attr('value', stamp);
        }
    })
}

function apagarLinha() {
    // __doPostBack('ctl00$conteudo$options3$userOption15', '');
    __doPostBack('ctl00$conteudo$options3$userOption15', '');
    //alert($('#stampActual').val())
    $('#stampActual').attr('value', '0')
}
$('td').click(function () {
    var row_index = $(this).parent().index();
    //alert(row_index );
});
function AlterarModalidade() {
    if ($('#RazaoEdicao').val() == '') {
        alert('PF. Preenche a razão da alteração desta modalidade');
    } else {
        __doPostBack('ctl00$conteudo$options3$userOption14', '');
        $('#stampActual').attr('value', '0')
    }
}
function registerDeleteModalidadeClickListener() {
    $('.delete-modalidade').on('click', function () {
        var stamp = $(this).parents('tr').find('td').eq(0).find('input').attr('value');
        $('#stampActual').attr('value', stamp)
        $("#modalConfirmarRelatorioIT").modal('show');
    })
}
function registerEditarModalidadeClickListener() {
    $('.edit-modalidade').on('click', function () {
        var stamp = $(this).parents('tr').find('td').eq(0).find('input').attr('value');
        $('#stampActual').attr('value', stamp);
        var data = $(this).parents('tr').find('td').eq(1).find('input').attr('value');
        $('#alt_data').attr('value', data);
        var descricao = $(this).parents('tr').find('td').eq(2).find('input').attr('value');
        $('#alt_Desc').attr('value', descricao);
        var valor = $(this).parents('tr').find('td').eq(3).find('input').attr('value');
        $('#alt_Val').attr('value', valor);
        $('#RazaoEdicao').attr('value', '');
        $('#RazaoEdicao').prop('required', true);
        //$("input").prop('required',true);
        $("#EditarModalidades").modal('show');
    })
}

function registerRequisitarModalidadeClickListener() {
    $('.req-modalidade').on('click', function () {
        var stamp = $(this).parents('tr').find('td').eq(0).find('input').attr('value');
        $('#stampActual').attr('value', stamp);
        //alert(stamp)
        $("#modalConfirmarProc").modal('show');
    })
}
function AlterarModalidade() {
    if ($('#RazaoEdicao').val() == '') {
        alert('PF. Preenche a razão da alteração desta modalidade');
    } else {
        __doPostBack('ctl00$conteudo$options3$userOption14', '');
        $('#stampActual').attr('value', '0')
    }
}

function ProcessarModalidade() {
    __doPostBack('ctl00$conteudo$options3$userOption16', '');
}
function confirmar() {
    if ($('#motivo').val() == '') {
        alert('PF. Preencha o motivo da alteração deste contracto');
    } else {
        $("#modalConfirmarProc2").modal('show');
    }
}
function alterarContrato() {
    __doPostBack('ctl00$conteudo$options3$userOption33', '');
}
function setLinhaDeActividade() {
    var selectedActividadeElement = $("input[name='orcamento_bo']:checked");
    var selectedActividade = selectedActividadeElement.val();
    var selectedCodComponente = selectedActividadeElement.parent("td").siblings(".codcomponente").html();
    var selectedCodSubcomponente = selectedActividadeElement.parent("td").siblings(".codsubcomponente").html();
    var selectedComponente = selectedActividadeElement.parent("td").siblings(".componente").html();
    var selectedSubcomponente = selectedActividadeElement.parent("td").siblings(".subcomponente").html();
    var selectedAct = selectedActividadeElement.parent("td").siblings(".actividade").html();
    var selectedCiclo = selectedActividadeElement.parent("td").siblings(".ciclo").html();
    var selectedCED = $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_ref").val()
    var selectedDESCCED = $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_design").val()
    if (selectedActividadeRow + 1 >= 10) {
        $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_CODNIVL5").val(selectedActividade);
        $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_CODNIVL2").val(selectedCodSubcomponente);
        $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_CODNIVL1").val(selectedCodComponente);
        $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_NIVEL1").val(selectedComponente);
        $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_NIVEL2").val(selectedSubcomponente);
        $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_NIVEL4").val(selectedAct);
        $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_CED1").val(selectedCED);
        $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_DESCCED1").val(selectedDESCCED);
        $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_CICLO").val(selectedCiclo);
        //$("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_u_moedaprj").val(selectedActividade);
        //$("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_u_moedaref").val(selectedActividade);
        //$("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_bifref").val(selectedActividade);
        $("#ctl00_conteudo_Gridbi_ctl" + (selectedActividadeRow + 1) + "_U_CODNIVL5").trigger("change");
    } else {
        $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_CODNIVL5").val(selectedActividade);
        $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_CODNIVL2").val(selectedCodSubcomponente);
        $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_CODNIVL1").val(selectedCodComponente);
        $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_NIVEL1").val(selectedComponente);
        $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_NIVEL2").val(selectedSubcomponente);
        $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_NIVEL4").val(selectedAct);
        $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_CED1").val(selectedCED);
        $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_DESCCED1").val(selectedDESCCED);
        $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_CICLO").val(selectedCiclo);
        //$("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_u_moedaprj").val(selectedActividade);
        //$("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_u_moedaref").val(selectedActividade);
        //$("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_bifref").val(selectedActividade);
        $("#ctl00_conteudo_Gridbi_ctl0" + (selectedActividadeRow + 1) + "_U_CODNIVL5").trigger("change");
    }

}
// #inicio de Modal Modalidades#
function valueChangeActividades_metas() {
    $('.edit-atmetas').on('change', function () {
        var stamp = $(this).parents('tr').find('td').eq(0).find('input').val();
        //alert(stamp);
        var x = document.getElementById('atmetas' + stamp);
        var text = x.options[x.selectedIndex].text;
        var nota = x.options[x.selectedIndex].value;
        //alert(text);
        $(this).parents('tr').find('td').eq(5).find('input').attr('value', nota);
    })
}
function valueChangeActividades_prazos() {
    $('.edit-atprazo').on('change', function () {
        var stamp = $(this).parents('tr').find('td').eq(0).find('input').val();
        var x = document.getElementById('atprazo' + stamp);
        var text = x.options[x.selectedIndex].text;
        var nota = x.options[x.selectedIndex].value;
        //alert(text);
        $(this).parents('tr').find('td').eq(6).find('input').attr('value', nota);
    })
}
function valueChangeActividades_qualidade() {
    $('.edit-atqualidade').on('change', function () {
        var stamp = $(this).parents('tr').find('td').eq(0).find('input').val();
        var x = document.getElementById('atqualidade' + stamp);
        var text = x.options[x.selectedIndex].text;
        var nota = x.options[x.selectedIndex].value;
        //alert(text);
        $(this).parents('tr').find('td').eq(7).find('input').attr('value', nota);
    })
}
function addRowsModalidades() {
    var table = document.getElementById('Table_modalidade');
    var newRow = table.insertRow(table.rows.length);
    var cel1 = newRow.insertCell(0);
    var cel2 = newRow.insertCell(1);
    var cel3 = newRow.insertCell(2);
    var cel4 = newRow.insertCell(3);
    var cel5 = newRow.insertCell(4);
    var cel6 = newRow.insertCell(5);
    var cel7 = newRow.insertCell(6);
    var cel8 = newRow.insertCell(7);
    var cel9 = newRow.insertCell(8);
    var cel10 = newRow.insertCell(9);
    var cel11 = newRow.insertCell(10);
    var cel12 = newRow.insertCell(11);

    // add values to the cells
    //cel1.innerHTML = "<input class='column_filter form-control'  type='text' id='stamp' name='stamp_modalidade[]' value='' style='display:none'  readonly >";
    cel1.innerHTML = "<input class='column_filter form-control'  type='text' id='status' name='status[]' value='INSERINDO'  readonly >";
    cel2.innerHTML = "<input  class='column_filter form-control' type='text' id='design' name='design_mod[]' value=''>";
    cel3.innerHTML = "<input  class='column_filter form-control' type='numeric' id='vpercent' name='vpercent_mod[]' value='0'>";
    cel4.innerHTML = "<input  class='column_filter form-control' type='number' id='valor' name='valor[]' value='0' onKeyDown='Mascara(this,Data);' onKeyUp='Mascara(this,Data);' onKeyPress='Mascara(this,Data);'readonly>"
    cel5.innerHTML = "<input  class='column_filter form-control' type='number' id='totreq' name='totreq[]' value='' onKeyDown='Mascara(this,Data);' onKeyUp='Mascara(this,Data);' onKeyPress='Mascara(this,Data);'readonly>"
    cel6.innerHTML = "<input  class='column_filter form-control' type='number' id='preq' name='preq[]' value='0' onKeyDown='Mascara(this,Data);' onKeyUp='Mascara(this,Data);' onKeyPress='Mascara(this,Data);'readonly>"
    cel7.innerHTML = "<input  class='column_filter form-control' type='number' id='tpago' name='tpago[]' value='0' onKeyDown='Mascara(this,Data);' onKeyUp='Mascara(this,Data);' onKeyPress='Mascara(this,Data);'readonly>"
    cel8.innerHTML = "<input  class='column_filter form-control' type='number' id='ppagar' name='ppagar[]' value='0' onKeyDown='Mascara(this,Data);' onKeyUp='Mascara(this,Data);' onKeyPress='Mascara(this,Data);'readonly>"
    cel9.innerHTML = "<input  class='column_filter form-control' type='number' id='adiantado' name='adiantado[]' value='0' onKeyDown='Mascara(this,Data);' onKeyUp='Mascara(this,Data);' onKeyPress='Mascara(this,Data);'readonly>"
    cel10.innerHTML = "<input  class='column_filter form-control' type='text' id='data' name='data[]' value='31/12/2020' onKeyDown='Mascara(this,Data);' onKeyUp='Mascara(this,Data);' onKeyPress='Mascara(this,Data);'>";
    cel11.innerHTML = "<button class='column_filter form-control' type='button' onclick='$(this).parent().parent().remove();'><span class='glyphicon glyphicon-trash'> </span></button>";
    cel12.innerHTML = "<button class='column_filter form-control delete-modalidade' type='button' ><span class='glyphicon glyphicon-trash'> </span></button> </td>";

    //var linha=table.rows.length;
    //var stamp= document.getElementById('stamp');
    //stamp.id ='stamp'+linha;
    //stamp.value =linha;
    //var metas= document.getElementById('atmetas');
    //metas.id ='atmetas'+linha;
    //var prazo= document.getElementById('atprazo');
    // prazo.id ='atprazo'+linha;
    //var qualidade= document.getElementById('atqualidade');
    // qualidade.id ='atqualidade'+linha;
}
// #Fim Modal Actividades#
// Datepickers
function registerDatePickers() {
    $("#datafim").datepicker({
        onSelect: function (date) {
            from = date;
            //filtrarMovimentos();
        },
        dateFormat: 'dd/mm/yyyy',
        language: "pt",
        autoClose: true
    })
}
//Mascaras
function Mascara(o, f) {
    v_obj = o
    v_fun = f
    setTimeout("execmascara()", 1)
}
/*Função que Executa os objetos*/
function execmascara() {
    v_obj.value = v_fun(v_obj.value)
}
/*Função que Determina as expressões regulares dos objetos*/
function leech(v) {
    v = v.replace(/o/gi, "0")
    v = v.replace(/i/gi, "1")
    v = v.replace(/z/gi, "2")
    v = v.replace(/e/gi, "3")
    v = v.replace(/a/gi, "4")
    v = v.replace(/s/gi, "5")
    v = v.replace(/t/gi, "7")
    return v
}
/*Função que padroniza telefone (11) 4184-1241*/
function Telefone(v) {
    v = v.replace(/\D/g, "")
    v = v.replace(/^(\d\d)(\d)/g, "($1) $2")
    v = v.replace(/(\d{4})(\d)/, "$1-$2")
    return v
}
/*Função que padroniza CPF*/
function Cpf(v) {
    v = v.replace(/\D/g, "")
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    return v
}
/*Função que padroniza CEP*/
function Cep(v) {
    v = v.replace(/D/g, "")
    v = v.replace(/^(\d{5})(\d)/, "$1-$2")
    return v
}
/*Função que padroniza DATA*/
function Data(v) {
    v = v.replace(/\D/g, "")
    v = v.replace(/(\d{2})(\d)/, "$1/$2")
    v = v.replace(/(\d{2})(\d)/, "$1/$2")
    return v
}
/*Função que padroniza VALOR MONETARIO - R$*/
function MaskMonetario(v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d{2})$/, ".$1");
    v = v.replace(/(\d+)(\d{3},\d{2})$/g, "$1.$2");
    var qtdLoop = (v.length - 3) / 3;
    var count = 0;
    while (qtdLoop > count) {
        count++;
        v = v.replace(/(\d+)(\d{3}.*)/, "$1 $2");
    }
    v = v.replace(/^(0)(\d)/g, "$2");
    return v
}




function registerActualizarComprasClickListener() {
    $("#userOption37").removeAttr("href");
    $("#userOption37").on("click", function () {
        $("#modal-actualizar-compras").modal("show");
    })
}
function actualizarCompras() {
    __doPostBack('ctl00$conteudo$options3$userOption37', '');
}
function registerOnComprasParaActualizarChangeListener() {
    $("input[name='fo_alterar[]']").on("change", function () {
        $(this).parents("tr").find("input[name='fo_fostamp[]'], input[name='fo_cambio[]'], input[name='fo_docdata[]'], select[name='fo_contado[]']").prop("disabled", !$(this).prop("checked"));
    });
}
function preencherOpcoesDoCampoProjecto() {
    selectedProjecto = $("#selected-projecto").val();
    $("#ctl00_conteudo_ccusto34_ccusto34mBox1").empty();
    var projectosJSON = $("#projectos").val();
    if (projectosJSON !== undefined) {
        var projectos = JSON.parse(projectosJSON);
        projectos.forEach(function (projecto) {
            $("#ctl00_conteudo_ccusto34_ccusto34mBox1").append(new Option(projecto.cct, projecto.cct, false, projecto.cct == selectedProjecto));
        });
    }
}

function preencherOpcoesDoCampoDelegacao() {
    selectedDelegacao = $("#selected-delegacoes").val();
    $("#ctl00_conteudo_u_usr638_u_usr638mBox1").empty();
    var delegacoesJson = $("#delegacoes").val();
    if (delegacoesJson !== undefined) {
        var delegacoes = JSON.parse(delegacoesJson);
        delegacoes.forEach(function (delegacao) {
            $("#ctl00_conteudo_u_usr638_u_usr638mBox1").append(new Option(delegacao.cct, delegacao.cct, false, delegacao.cct == selectedDelegacao));
        });
    }
}



function preencherOpcoesDoCampoMunicpio() {
    municipCopy = $("#municipCopy").val();
    $("#ctl00_conteudo_u_usr638_u_usr638mBox1").empty()
    var dataJson = JSON.parse($("#municipData").text())

    alert(municipCopy);
    dataJson.forEach(function (projecto) {
        $("#ctl00_conteudo_u_usr638_u_usr638mBox1").append(new Option(projecto.Codigo + "_" + projecto.Delegacao, projecto.Codigo + "_" + projecto.Delegacao, false, projecto.Codigo + "_" + projecto.Delegacao == municipCopy));
    });

}

function organizarEcra() {
    eliminarColunasSemConteudo();
    eliminarLinhasSemConteudo();
    arranjarObjectos();
}
function arranjarObjectos() {

}

function registerExportarClickListener() {
    $("#userOption38").removeAttr("href");
    $("#userOption38").on("click", function () {
        exportTableToExcel();
    })
}


function exportTableToExcel() {
    var table;
    var filename;

    var elements = document.querySelectorAll('span.avatitulo');
    elements.forEach(function (element) {
        console.log(element.textContent);
        filename = element.textContent;
    });

    var elements = document.querySelectorAll('[id^="ctl00_conteudo_ctl"][id$="_mgrid1"]');
    elements.forEach(function (element) {

        if (element.id) {
            console.log(element.id);
            table = document.getElementById(element.id);
        }
    });

    // Create a new Workbook object
    var wb = XLSX.utils.book_new();

    // Convert the table to a worksheet
    var ws = XLSX.utils.table_to_sheet(table, { cellDates: true, cellStyles: true });

    // Add the worksheet to the Workbook object
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate the Excel file binary data
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // Convert the binary data to a Blob object
    var blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

    // Download the Excel file
    saveAs(blob, filename + '.xlsx');

    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
}


function Show_modaladicionaradiantamento() {
    $("#modal-adiantamento-requiscao-interna").modal('show');
}


function registerEmitirAdiantamento_RequisicaoExternaClickListener() {
    $("#userOption54").removeAttr("href");
    $("#userOption54").on("click", function () {
        $("#modal-requisicao-externa-emitir-adiantamento").modal('show');
    });
}

function registerBtnEmitirAdiantamentoClickListener() {
    $(".btn-emitir-adiantamento").on("click", function () {
        $(this).parents("tr").find("input").prop("disabled", false);
        EmitirAdiantamento_RequisicaoExterna();
    });
}
function EmitirAdiantamento_RequisicaoExterna() {
    __doPostBack('ctl00$conteudo$options3$userOption55', '');
}

function Show_modaladicionaradiantamento() {
    $("#modal-adiantamento-requiscao-interna").modal('show');
}


function RegistarAdiantamento_RequisicaoInterana() {
    __doPostBack('ctl00$conteudo$options3$userOption54', '');
}

function registerGetCheckboxClickListener() {
    $(document).off("click", ".edit-checkbox-guia-saida, .edit-checkbox-requisicao-externa, .edit-checkbox-requisicao-interna-adiantamento, .edit-checkbox-entrada-stock").on("click", ".edit-checkbox-guia-saida, .edit-checkbox-requisicao-externa, .edit-checkbox-requisicao-interna-adiantamento, .edit-checkbox-entrada-stock", function () {
        $(this).parents('tr').find("input:not(input[type='checkbox']), select").prop("disabled", !$(this).prop('checked'));
    });
}



function hidePageTab(tab_title) {
    var spansToHide = $("span:contains('" + tab_title + "')");
    var header = spansToHide.closest(".collapse-header")
    header.hide()
    var body = header.next(".collapse-body")
    body.find("input").attr("disabled", true)
    body.find("select").attr("disabled", true)
    body.find("input").hide()
    body.find("select").hide()
    body.hide()
}
function hideControl($controlId) {
    $($controlId).find("input").attr("disabled", true)
    $($controlId).find("input").hide()
    $($controlId).find("select").attr("disabled", true)
    $($controlId).find("select").hide()
    $($controlId).hide();
    $($controlId).closest(".col").hide();
}
function showControl($controlId) {
    $($controlId).find("input").attr("disabled", false)
    $($controlId).find("input").show()
    $($controlId).find("select").attr("disabled", false)
    $($controlId).find("select").show()
    $($controlId).find("select").prev("div").attr("style", "z-index:10000")
    $($controlId).show();
    $($controlId).closest(".col").show();
}

function showPageTab(tab_title) {
    var spansToHide = $("span:contains('" + tab_title + "')");
    var header = spansToHide.closest(".collapse-header")
    header.show()
    var body = header.next(".collapse-body")
    body.find("input").attr("disabled", false)
    body.find("select").attr("disabled", false)
    body.find("select").prev("div").attr("style", "z-index:10000")
    body.find("input").show()
    body.show()
}