function pageLoad() {
     $(document).on('click', '.home-collapse-header', function () {
        $(this).find(".glyphicon").toggleClass("glyphicon-triangle-bottom");
        //$(this).next("div").css("hidden");
        $(this).next("div").toggleClass("hidden");

    });
    organizarEcra();
    registerListeners();
}
function organizarEcra() {
    var codigo = $("#mainPage").data("state") == "consultar" ? $("#ctl00_conteudo_codigo_mLabel1").text() : $("#ctl00_conteudo_codigo_codigomBox1").val();
    var divExtraConfig = "<div id='mrend-init-config-container'></div>";
    $("#campos > .row:last").after("<div style='margin-top:2.5em' class='row table-responsive  sourceTabletableContainer'>" + divExtraConfig + "</div>");
    setTimeout(function () {
        $("#ctl00_conteudo_rendopt").hide();
        //$("#ctl00_conteudo_rendopt_rendoptmBox1").hide();
    }, 500)

    initTabelaConfiguracaoMrender({
        codigo: codigo,
        extraConfigContainer: "#mrend-init-config-container",
        relatorioTable: "",
        relatorioTableKey: "",
        relatorioTableFilterField: "",
        defaultInitConfig: {
            enableEdit: "$(\"#mainPage\").data(\"state\") == \"editar\"",
            resetSourceStamp: "$(\"#mainPage\").data(\"state\") != \"editar\"",
            remoteFetch: "true",
            codigo: codigo,
            remoteFetchData: {
                type: "POST",
                url: "../programs/gensel.aspx?cscript=getdatafromphc",
                data: {
                    '__EVENTARGUMENT': "JSON.stringify([{ codigo: '" + codigo + "', filtroval: getRecordStamp() }])"
                }
            },
            datasourceName: "bi",
            tableSourceName: "bi",
            table: "bi",
            dbTableToMrendObject: {
                defaultColumnName: "",
                chunkMapping: true,
                table: "bi",
                dbName: "",
                tableKey: "bistamp",
                extras: {
                    ordemField: "lordem",
                    linkField: "",
                    cellIdField: "",
                    linhaField: "u_codlinha",
                    colunaField: ""
                }
            },
            schemas: [
                "bistamp",
                "ref",
                "design",
                "qtt",
                "debito",
                "nome",
                "no",
                "lordem",
                "u_bistamp",
                "u_codlinha"
            ]
        }
    });
}
function registerListeners() {
    $(document).on('click', '.home-collapse-header', function () {
        $(this).find(".glyphicon").toggleClass("glyphicon-triangle-bottom");
        //$(this).next("div").css("hidden");
        $(this).next("div").toggleClass("hidden");
    });
}