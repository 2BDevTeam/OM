

var GMRENDREPORTC = null;
var GObjectivos = [];

var GPCS = []

function initGrelhaRelatorio() {

    console.log("inicializar grelha relatório");

    var divExtraConfig = "<div id='mrend-report-container'></div>";
    $("#campos > .row:last").after("<div style='margin-top:2.5em' class='row table-responsive  sourceTabletableContainer'>" + divExtraConfig + "</div>");


    inicializarMrendBycodigo({
        codigo: $("#ctl00_conteudo_nota1_mLabel1").text(),
        relatorioTable: "u_nota",
        relatorioTableKey: "u_notastamp",
        relatorioTableFilterField: "nota",
        containerToRender: "#mrend-report-container",
        onSuccess: function (mrend) {
            //console.log("Mrend inicializado", mrend);
            GMRENDREPORTC = mrend;
            handleColunasAno($("#ctl00_conteudo_nota1_mLabel1").text());
            handleMatrizDesempenho();
            registerClickGravarRelatorio()

            try {
                $(document).off("click", "#BUCANCELARBottom").on("click", "#BUCANCELARBottom", function (e) {

                    clearAllSourcesByInstance(GMRENDREPORTC);

                    __doPostBack('ctl00$conteudo$options5$BUCANCELARBottom', '');
                });
            } catch (error) {

            }
        }
    });




}


function handleColunasAno(relatorio) {
    var relatorios = ["Demonstração de fluxo de caixa previsional", "Balanço previsional", "Demonstração de resultados previsional"];
    if (relatorios.indexOf(relatorio) == -1) {
        console.warn("Relatório não necessita de colunas de anos", relatorio);
        return;
    };

    var relatorioAssociado = $("#ctl00_conteudo_relatorioassoc_mLabel1").text();
    if (!relatorioAssociado) {
        console.warn("Relatório associado não encontrado para relatório que necessita de colunas de anos", relatorio);
        return;
    }

    var relatoriosAssociadosData = [{
        relatorio: "Plano de negócio",
        anos: 5
    },
    {
        relatorio: "Plano de actividades",
        anos: 1
    }];

    var configRelatorioAssociado = relatoriosAssociadosData.find(function (r) {
        return r.relatorio.trim() == relatorioAssociado.trim();
    });

    if (!configRelatorioAssociado) {
        console.warn("Relatório associado não tem configuração de colunas de anos", relatorioAssociado);
        return;
    }

    var maxOrdemColuna = GMRENDREPORTC.GRenderedColunas.reduce(function (max, col) {
        return Math.max(max, col.ordem || 0);
    }, 0) + 1;

    var colunaConfig = GMRENDREPORTC.reportConfig.config.colunas.find(function (col) {
        return col.codigocoluna == "valorperiodo";
    });

    if (!colunaConfig) {
        console.warn("Configuração de coluna 'valorperiodo' não encontrada para relatório que necessita de colunas de anos", relatorio);
        return;
    }
    var colunasToRender = [];

    for (var i = 0; i < configRelatorioAssociado.anos; i++) {

        var incAno = i ;
        var codigocoluna = "ano_" + getAnoCriterio(incAno, { desccoluna: "" });

        var desccoluna = getAnoCriterio(incAno, { desccoluna: "Ano " + incAno });
        var colToRender = GMRENDREPORTC.setNewRenderedColuna({
            codigocoluna: codigocoluna,
            desccoluna: desccoluna,
            config: colunaConfig,
            ordem: maxOrdemColuna,
        });

        var anoExistente = GMRENDREPORTC.GRenderedColunas.find(function (col) {
            return col.codigocoluna == colToRender.codigocoluna;
        });

        if (!anoExistente) {
            colunasToRender.push(colToRender);
        }
        maxOrdemColuna++;



    }
    GMRENDREPORTC.addColunasByModelo(colunasToRender);

}

function handleMatrizDesempenho() {

    try {
        if ($("#ctl00_conteudo_nota1_mLabel1").text() != "Matriz de indicadores de desempenho") {
            return;
        }

        var maxOrdemColuna = GMRENDREPORTC.GRenderedColunas.reduce(function (max, col) {
            return Math.max(max, col.ordem || 0);
        }, 0) + 1;

        //console.log("end", end);
        var colunaConfig = GMRENDREPORTC.reportConfig.config.colunas.find(function (col) {
            return col.codigocoluna == "anos";
        });


        if (!colunaConfig) {
            return { valid: false, message: "Erro gerar anos para matriz de desempenho" }
        }

        var data = $("#ctl00_conteudo_data_mLabel1").text();
        var ano = Number(data.split(".")[2]);
        var colunasToRender = [];
        //Loop para criar colunas dos proximos 5 anos
        for (var i = 0; i < 5; i++) {

            //console.log("The loop and the loop")
            var codigocoluna = "ano_" + (ano + i);
            var desccoluna = ano + i;
            var colToRender = GMRENDREPORTC.setNewRenderedColuna({
                codigocoluna: codigocoluna,
                desccoluna: desccoluna,
                config: colunaConfig,
                ordem: maxOrdemColuna,
            });

            var anoExistente = GMRENDREPORTC.GRenderedColunas.find(function (col) {
                return col.codigocoluna == colToRender.codigocoluna;
            });

            if (!anoExistente) {
                colunasToRender.push(colToRender);
            }

            maxOrdemColuna++;

        }

        GMRENDREPORTC.addColunasByModelo(colunasToRender);

        popularLinhasPeloPlanoEstratégico();







    } catch (error) {

        console.log("Erro ao calcular cria colunas de anos", error);

    }



}

function popularLinhasPeloPlanoEstratégico() {


    GMRENDREPORTC.hasRows().then(function (has) {
        if (has) {
            return;
        }
        var dados = getNotasByPeriodo("Plano estratégico", $("#ctl00_conteudo_periodo_mLabel1").text());

        GMRENDREPORTC.addLinhaComCelulas("u_reportl", dados, { resetIds: true });


    });


}


function getAnoCriterio(criterio, coluna) {

    try {
        var data = $("#ctl00_conteudo_data_mLabel1").text();
        var ano = Number(data.split(".")[2]);
        if (isNaN(ano)) return coluna.desccoluna;

        return ano + Number(criterio);

    } catch (error) {

        return coluna.desccoluna;
    }




}



function clearAllSourcesByInstance(instance) {

    instance.clearSourceStamp();
}

function persistRecord(records) {

    $("#registoJson").val(JSON.stringify(records))
    $("#registoJson").trigger("change");
    __doPostBack('ctl00$conteudo$options5$BUGRAVARBottom', '');
}

$(document).off("click", "#BUCANCELARBottom").on("click", "#BUCANCELARBottom", function (e) {

    clearAllSourcesByInstance(GMRENDREPORTC);

    __doPostBack('ctl00$conteudo$options5$BUCANCELARBottom', '');
});




function getObjectivosPlanoEstrategico() {


    $.ajax({
        type: "POST",
        url: "../programs/gensel.aspx?cscript=getobjectivosplanoestrategico",
        async: false,
        data: {
            '__EVENTARGUMENT': JSON.stringify([{ periodo: $("#ctl00_conteudo_periodo_mLabel1").text() }]),
        },
        success: function (response) {

            var errorMessage = "ao trazer resultados dos objectivos estratégicos "
            try {
                console.log(response)
                if (response.cod != "0000") {

                    console.log("Erro " + errorMessage, response)
                    return false
                }

                GObjectivos = response.data || [];
            } catch (error) {
                console.log("Erro interno " + errorMessage, response)
                //alertify.error("Erro interno " + errorMessage, 10000)
            }

            //  javascript:__doPostBack('','')
        }
    });


    return GObjectivos;





}

function getPerspectivasPeriodo() {


    $.ajax({
        type: "POST",
        url: "../programs/gensel.aspx?cscript=getperspectivasperiodo",
        async: false,
        data: {
            '__EVENTARGUMENT': JSON.stringify([{ periodo: $("#ctl00_conteudo_periodo_mLabel1").text() }]),
        },
        success: function (response) {

            var errorMessage = "ao trazer resultados das perspectivas do período "
            try {
                console.log(response)
                if (response.cod != "0000") {

                    console.log("Erro " + errorMessage, response)
                    return false
                }

                GObjectivos = response.data || [];
            } catch (error) {
                console.log("Erro interno " + errorMessage, response)
                //alertify.error("Erro interno " + errorMessage, 10000)
            }

            //  javascript:__doPostBack('','')
        }
    });


    return GObjectivos;





}


function getPonderador(rowData, renderedColuna) {

    var ponderador = 0;
    var perspectivas = GObjectivos.length > 0 ? getPerspectivasPeriodo() : [];
    var perspectiva = rowData.perspectiva || "";
    var perspectivaData = perspectivas.find(function (p) {
        return p.tipo == perspectiva;
    });

    if (perspectivaData) {
        return perspectivaData.ponderador || 0;
    }

    return ponderador;

}




function registerClickGravarRelatorio() {
    $("#BUGRAVARBottom").removeAttr("href")

    $(document).off("click", "#BUGRAVARBottom").on("click", "#BUGRAVARBottom", function (e) {
        var record = [];

        GMRENDREPORTC.getDbData().then(function (reportData) {

            reportData.map(function (row) {

                row.records.map(function (record) {
                    delete record[""];
                    record["u_reportcstamp"] = "1";
                    return record;

                });

                return row;

            });


            record.push({
                instance: "u_reportl",
                data: reportData,
            });

            //console.log("Record a persistir", record);

            //delete novoObjeto[""];
            persistRecord(record);


        })


    })
}


function getPcs() {

    $.ajax({
        async: false,
        type: "POST",
        url: "../programs/gensel.aspx?cscript=getplanoanoactual",
        success: function (response) {

            var errorMessage = "ao trazer resultados do plano e ano atual "
            try {
                //console.log(response)
                if (response.cod != "0000") {
                    console.log("Erro " + errorMessage, response)
                    return false
                }
                var data = response.data || [];
                GPCS = data;
            } catch (error) {
                console.log("Erro interno " + errorMessage, response)
            }
        }
    });

    return GPCS;

}


function inicializarMrendBycodigo(config) {

    var cfg = config || {};

    var codigo = cfg.codigo;
    var relatorioTable = cfg.relatorioTable || "u_mrendrel";
    var relatorioTableKey = cfg.relatorioTableKey || "u_mrendrelstamp";
    var relatorioTableFilterField = cfg.relatorioTableFilterField || "codigo";
    var containerToRender = cfg.containerToRender || "#mrend-report-container";
    var mrendOptions = cfg.mrendOptions || {};
    var onSuccess = typeof cfg.onSuccess === "function" ? cfg.onSuccess : null;
    var onError = typeof cfg.onError === "function" ? cfg.onError : null;

    if (!codigo) {
        console.error("inicializarMrendBycodigo: 'codigo' é obrigatório");
        return;
    }

    $.ajax({
        type: "POST",
        url: "../programs/gensel.aspx?cscript=getmrendconfig",
        data: {
            '__EVENTARGUMENT': JSON.stringify([{
                codigo: codigo,
                relatorioTable: relatorioTable,
                relatorioTableKey: relatorioTableKey,
                relatorioTableFilterField: relatorioTableFilterField
            }])
        },
        success: function (response) {

            if (!response || response.cod !== "0000") {
                console.error("inicializarMrendBycodigo: erro ao carregar configuração", response);
                if (onError) onError(response);
                return;
            }

            var configData = response.data || {};

            var relatorioRecord = Array.isArray(configData.relatorio)
                ? (configData.relatorio[0] || {})
                : (configData.relatorio || {});

            var initConfig = {};
            try {
                initConfig = JSON.parse(relatorioRecord.rendopt || "{}");
            } catch (e) {
                console.warn("inicializarMrendBycodigo: rendopt inválido", e);
            }

            // --- Normalizar schemas (migração de formatos anteriores) ---
            // schemas deve chegar a InitDB como [{tableSourceName, tableSourceSchema}]
            if (typeof initConfig.schemas === 'string') {
                try {
                    var parsed = JSON.parse(initConfig.schemas);
                    initConfig.schemas = Array.isArray(parsed) ? parsed : [];
                } catch (e) { initConfig.schemas = []; }
            }

            // --- Avaliar expressões JS guardadas como string ---
            if (typeof initConfig.enableEdit === "string") { try { initConfig.enableEdit = eval(initConfig.enableEdit); } catch (e) { initConfig.enableEdit = false; } }
            if (typeof initConfig.resetSourceStamp === "string") { try { initConfig.resetSourceStamp = eval(initConfig.resetSourceStamp); } catch (e) { initConfig.resetSourceStamp = false; } }
            if (typeof initConfig.remoteFetch === "string") { try { initConfig.remoteFetch = eval(initConfig.remoteFetch); } catch (e) { initConfig.remoteFetch = false; } }
            /* if (initConfig.remoteFetchData && initConfig.remoteFetchData.data && typeof initConfig.remoteFetchData.data.__EVENTARGUMENT === "string") {
                 try { initConfig.remoteFetchData.data.__EVENTARGUMENT = eval(initConfig.remoteFetchData.data.__EVENTARGUMENT); } catch (e) { }
             }*/

            if (initConfig.remoteFetchData && initConfig.remoteFetchData.data && typeof initConfig.remoteFetchData.data.__EVENTARGUMENT === "string") {
                try {
                    initConfig.remoteFetchData.data.__EVENTARGUMENT = eval(initConfig.remoteFetchData.data.__EVENTARGUMENT);
                } catch (e) {
                    console.error("inicializarMrendBycodigo: erro ao avaliar remoteFetchData.__EVENTARGUMENT:", initConfig.remoteFetchData.data.__EVENTARGUMENT, e);
                    delete initConfig.remoteFetchData.data.__EVENTARGUMENT;
                }
            }

            if (initConfig.recordData && typeof initConfig.recordData.stamp === "string" && initConfig.recordData.stamp) {
                try {
                    initConfig.recordData.stamp = String(eval(initConfig.recordData.stamp) || "");
                } catch (e) {
                    initConfig.recordData.stamp = "";
                }
            }

            console.log("initConfig.remoteFetchData", initConfig.remoteFetchData);

            var finalOptions = $.extend(true, {}, initConfig, {
                containerToRender: containerToRender,
                reportConfig: {
                    config: {
                        linhas: configData.linhas || [],
                        colunas: configData.colunas || [],
                        celulas: configData.celulas || [],
                        relatorio: relatorioRecord,
                        ligacoes: configData.ligacoes || [],
                        grupocolunas: configData.grupocolunas || [],
                        grupocolunaItems: configData.grupocolunaItems || []
                    }
                }
            }, mrendOptions);

            // schemas chega aqui como array de strings → InitDB passa-o directamente ao configureDataBase
            GMRENDREPORTC = new Mrend(finalOptions);
            GMRENDREPORTC.render().then(function () {
                if (onSuccess) onSuccess(GMRENDREPORTC);
            });
        },
        error: function (err) {
            console.error("inicializarMrendBycodigo: erro AJAX", err);
            if (onError) onError(err);
        }
    });
}