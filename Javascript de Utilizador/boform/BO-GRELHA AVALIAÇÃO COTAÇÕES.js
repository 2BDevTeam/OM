

var GMRENDAVALIACOESCOT = null;
var GREQUISICOES = [];

function getRecordStamp() {
    var stamp = "";

    return $("#bodata").data("bostamp") || "";
}
function initGrelhaAvaliacaoCotacoes() {

    if (!isDocType(43)) {
        return;
    }

    var divExtraConfig = "<div id='mrend-report-container'></div>";
    $("#campos > .row:last").after("<div style='margin-top:2.5em' class='row table-responsive  sourceTabletableContainer'>" + divExtraConfig + "</div>");


    inicializarMrendBycodigo({
        codigo: "Avaliação da cotação",
        relatorioTable: "",
        relatorioTableKey: "",
        relatorioTableFilterField: "",
        containerToRender: "#mrend-report-container",
        onSuccess: function (mrend) {
            //console.log("Mrend inicializado", mrend);
            GMRENDAVALIACOESCOT = mrend;

            try {

                var cotacoes = getRequisicoesByCotacao($("#ctl00_conteudo_u_requis_u_requismBox1").val());
                handleColunasFornecedores(cotacoes);
                handleLinhasCotacoes(cotacoes);
                handleColunasCriterios();
                registerClickGravarRelatorio();

                // Forçar redraw após todas as colunas/linhas estarem registadas
                GMRENDAVALIACOESCOT.whenReady(function () {
                    GMRENDAVALIACOESCOT.GTable.redraw(true);
                });

            } catch (error) {
                console.log("Erro ao processar cotações e critérios", error);
            }

            try {
                $(document).off("click", "#BUCANCELARBottom").on("click", "#BUCANCELARBottom", function (e) {
                    clearAllSourcesByInstance(GMRENDAVALIACOESCOT);
                    __doPostBack('ctl00$conteudo$options5$BUCANCELARBottom', '');
                });
            } catch (error) { }
        }
    });




}

function getRequisicoesByCotacao(requisicao) {
    var requisicoes = [];
    $.ajax({
        type: "POST",
        url: "../programs/gensel.aspx?cscript=getdossiercotacoes",
        async: false,
        data: {
            '__EVENTARGUMENT': JSON.stringify([{ requisicao: requisicao }]),
        },
        success: function (response) {

            var errorMessage = "ao trazer resultados  das cotações da requisição " + requisicao;
            try {
                 console.log("COTAÇÕES",response)
                if (response.cod != "0000") {

                    console.log("Erro " + errorMessage, response)
                    return false
                }
                requisicoes = response.data || [];
                GREQUISICOES = requisicoes;
            } catch (error) {
                console.log("Erro interno " + errorMessage, response)
                //alertify.error("Erro interno " + errorMessage, 10000)
            }

            //  javascript:__doPostBack('','')
        }
    });

    return requisicoes;

}

function getFornecedoresRequisicoes() {
    var resultado = [{nome:""}];
    var nomesVistos = {};
    GREQUISICOES.forEach(function (r) {
        var nome = (r.nome || "").trim();
        if (nome && !nomesVistos[nome]) {
            nomesVistos[nome] = true;
            resultado.push({ nome: nome });
        }
    });
    return resultado;
}


function handleColunasCriterios() {
    //console.log("handleColunasCriterios: GCriteriosAvaliacao");
    // return true
    if (!GCriteriosAvaliacao || GCriteriosAvaliacao.length === 0) {
        console.warn("handleColunasCriterios: sem critérios seleccionados");
        return;
    }

    var colunaConfig = GMRENDAVALIACOESCOT.reportConfig.config.colunas.find(function (col) {
        return col.codigocoluna == "criterio";
    });

    if (!colunaConfig) {
        console.warn("handleColunasCriterios: coluna modelo 'criterio' não encontrada na configuração");
        return;
    }

    var maxOrdemColuna = GMRENDAVALIACOESCOT.GRenderedColunas.reduce(function (max, col) {
        return Math.max(max, col.ordem || 0);
    }, 0) + 1;

    var colunasToRender = [];

    for (var i = 0; i < GCriteriosAvaliacao.length; i++) {
        var criterio = GCriteriosAvaliacao[i];
        var codigocoluna = "criterio_" + (criterio.codigo || criterio.descricao);
        var desccoluna = criterio.descricao;

        var colToRender = GMRENDAVALIACOESCOT.setNewRenderedColuna({
            codigocoluna: codigocoluna,
            desccoluna: desccoluna,
            config: colunaConfig,
            ordem: maxOrdemColuna
        });

        var existente = GMRENDAVALIACOESCOT.GRenderedColunas.find(function (col) {
            return col.codigocoluna == colToRender.codigocoluna;
        });

        if (!existente) {
            colunasToRender.push(colToRender);
        }

        maxOrdemColuna++;
    }

    GMRENDAVALIACOESCOT.addColunasByModelo(colunasToRender);
}


function handleColunasFornecedores(cotacoes) {
    if (!cotacoes || cotacoes.length === 0) {
        console.warn("handleColunasFornecedores: sem cotações");
        return;
    }

    var fornecedores = _.uniqBy(cotacoes, "no");

    var colunaDebitoConfig = GMRENDAVALIACOESCOT.reportConfig.config.colunas.find(function (col) {
        return col.codigocoluna == "debito";
    });

    var colunaNomeConfig = GMRENDAVALIACOESCOT.reportConfig.config.colunas.find(function (col) {
        return col.codigocoluna == "nome";
    });

    if (!colunaDebitoConfig) {
        console.warn("handleColunasFornecedores: coluna modelo 'debito' não encontrada na configuração");
        return;
    }

    if (!colunaNomeConfig) {
        console.warn("handleColunasFornecedores: coluna modelo 'nome' não encontrada na configuração");
        return;
    }

    var maxOrdemColuna = GMRENDAVALIACOESCOT.GRenderedColunas.reduce(function (max, col) {
        return Math.max(max, col.ordem || 0);
    }, 0) + 1;

    var todasColunasFornecedores = [];

    for (var i = 0; i < fornecedores.length; i++) {
        var fornecedor = fornecedores[i];
        var no = fornecedor.no;
        var nomeFornecedor = (fornecedor.nome || "").trim();

        // Coluna preço unitário (debito) — vem primeiro
        var codigoDebito = no + "debito";
        var colDebito = GMRENDAVALIACOESCOT.setNewRenderedColuna({
            codigocoluna: codigoDebito,
            desccoluna: "Preço Unitário",
            config: colunaDebitoConfig,
            ordem: maxOrdemColuna
        });

        if (!GMRENDAVALIACOESCOT.GRenderedColunas.find(function (col) { return col.codigocoluna == colDebito.codigocoluna; })) {
            todasColunasFornecedores.push(colDebito);
        }
        maxOrdemColuna++;

        // Coluna com nome do fornecedor — vem ao lado do preço
        var codigoNome = no + "nome";
        var colNome = GMRENDAVALIACOESCOT.setNewRenderedColuna({
            codigocoluna: codigoNome,
            desccoluna: nomeFornecedor,
            config: colunaNomeConfig,
            ordem: maxOrdemColuna
        });

        if (!GMRENDAVALIACOESCOT.GRenderedColunas.find(function (col) { return col.codigocoluna == colNome.codigocoluna; })) {
            todasColunasFornecedores.push(colNome);
        }
        maxOrdemColuna++;
    }

    // Adicionar todas as colunas de fornecedores numa só chamada (evita múltiplos setColumns)
    if (todasColunasFornecedores.length > 0) {
        GMRENDAVALIACOESCOT.addColunasByModelo(todasColunasFornecedores);
    }

    // Reordenar: mover cada coluna nome para ao lado do seu debito correspondente
    GMRENDAVALIACOESCOT.whenReady(function () {
        for (var j = 0; j < fornecedores.length; j++) {
            var fNo = fornecedores[j].no;
            var debitoField = "debito___" + fNo + "debito";
            var nomeField = "nome___" + fNo + "nome";
            if (GMRENDAVALIACOESCOT.GTable.getColumn(nomeField) && GMRENDAVALIACOESCOT.GTable.getColumn(debitoField)) {
                GMRENDAVALIACOESCOT.GTable.moveColumn(nomeField, debitoField, true);
            }
        }
    });
}


function handleLinhasCotacoes(cotacoes) {
    if (!cotacoes || cotacoes.length === 0) {
        console.warn("handleLinhasCotacoes: sem cotações");
        return;
    }

    var linhaModeloConfig = GMRENDAVALIACOESCOT.reportConfig.config.linhas.find(function (l) {
        return l.modelo == true;
    });

    if (!linhaModeloConfig) {
        console.warn("handleLinhasCotacoes: linha modelo não encontrada na configuração");
        return;
    }

    // Agrupar cotações por ref (cada ref = uma linha)
    var gruposPorRef = _.groupBy(cotacoes, function (c) { return String(c && c.ref != null ? c.ref : "").trim(); });
    var refKeys = Object.keys(gruposPorRef).filter(function (ref) { return ref !== ""; });

    function atualizarCellObject(rowid, codigo, valor) {
        var rowidStr = String(rowid || "").trim();
        var cell = GMRENDAVALIACOESCOT.GCellObjectsConfig.find(function (c) {
            return String(c.rowid || "").trim() == rowidStr && c.codigocoluna == codigo;
        });
        if (cell) {
            cell.valor = valor;
        }
    }

    function aplicarDadosLinha(tabulatorRow, ref, items) {
        if (!items || items.length === 0) return;

        var rowData = tabulatorRow.getData();
        var rowid = rowData.rowid;
        var firstItem = items[0] || {};

        rowData.ref = ref;
        rowData.design = String(firstItem.design || "").trim();
        rowData.qtt = firstItem.qtt;

        atualizarCellObject(rowid, "ref", rowData.ref);
        atualizarCellObject(rowid, "design", rowData.design);
        atualizarCellObject(rowid, "qtt", rowData.qtt);

        items.forEach(function (cot) {
            var totalFornecedor = (cot.qtt || 0) * (cot.edebito || 0);
            var debitoKey = "debito___" + cot.no + "debito";
            var nomeKey = "nome___" + cot.no + "nome";

            rowData[debitoKey] = cot.edebito;
            rowData[nomeKey] = totalFornecedor;

            atualizarCellObject(rowid, debitoKey, cot.edebito);
            atualizarCellObject(rowid, nomeKey, totalFornecedor);
        });

        var linha = GMRENDAVALIACOESCOT.GRenderedLinhas.find(function (l) {
            return l.rowid == rowid;
        });

        if (linha && linha.UIObject) {
            linha.UIObject.ref = rowData.ref;
            linha.UIObject.design = rowData.design;
            linha.UIObject.qtt = rowData.qtt;
        }

        tabulatorRow.update(rowData);
    }

    function addLinhaPersistente(modeloCodigo, uiObject) {
        GMRENDAVALIACOESCOT.addLinhaComRegistos(modeloCodigo, uiObject);
    }

    function construirUIObject(ref, items) {
        var firstItem = items[0] || {};
        var uid = generateUUID();
        var UIObject = {
            rowid: uid,
            id: uid,
            ref: ref,
            design: String(firstItem.design || "").trim(),
            qtt: firstItem.qtt
        };

        items.forEach(function (cot) {
            var totalFornecedor = (cot.qtt || 0) * (cot.edebito || 0);
            UIObject["debito___" + cot.no + "debito"] = cot.edebito;
            UIObject["nome___" + cot.no + "nome"] = totalFornecedor;
        });

        return UIObject;
    }

    // CRUD: comparar estado do IndexedDB com cotações frescas do servidor
    GMRENDAVALIACOESCOT.getDbData().then(function (sources) {

        // Extrair registos existentes (wide rows para chunkMapping=true)
        var existingRecords = [];
        (sources || []).forEach(function (src) {
            existingRecords = existingRecords.concat(src.records || []);
        });

        // Indexar registos existentes por ref
        var existentesPorRef = {};
        existingRecords.forEach(function (rec) {
            var ref = String(rec.ref != null ? rec.ref : "").trim();
            if (ref) {
                existentesPorRef[ref] = rec;
            }
        });

        // Categorizar: novas, removidas, mantidas
        var novasRefs = refKeys.filter(function (r) { return !existentesPorRef[r]; });
        var removidasRefs = Object.keys(existentesPorRef).filter(function (r) { return !gruposPorRef[r]; });

        // 1. Criar linhas para refs novas (antes de whenReady, para ficarem na fila de rendering)
        novasRefs.forEach(function (ref) {
            var items = gruposPorRef[ref] || [];
            if (items.length === 0) return;
            addLinhaPersistente(linhaModeloConfig.codigo, construirUIObject(ref, items));
        });

        // 2. Quando a tabela estiver pronta: remover obsoletas + hidratar todas
        GMRENDAVALIACOESCOT.whenReady(function () {

            // Remover linhas cujo ref já não existe nas cotações
            if (removidasRefs.length > 0) {
                var rows = GMRENDAVALIACOESCOT.GTable.getRows();
                var deletePromises = [];

                rows.forEach(function (tabulatorRow) {
                    var rowData = tabulatorRow.getData();
                    var ref = String(rowData && rowData.ref != null ? rowData.ref : "").trim();

                    if (ref && removidasRefs.indexOf(ref) !== -1) {
                        var renderedLinha = GMRENDAVALIACOESCOT.GRenderedLinhas.find(function (l) {
                            return l.rowid == rowData.rowid;
                        });
                        if (renderedLinha) {
                            deletePromises.push(renderedLinha.deleteRow());
                        }
                        tabulatorRow.delete();
                    }
                });

                Promise.all(deletePromises).then(function () {
                    hidratarLinhas();
                });
            }
            else {
                hidratarLinhas();
            }

            function hidratarLinhas() {
                var currentRows = GMRENDAVALIACOESCOT.GTable.getRows();
                currentRows.forEach(function (tabulatorRow, idx) {
                    var rowData = tabulatorRow.getData();
                    var refAtual = String(rowData && rowData.ref != null ? rowData.ref : "").trim();
                    var refTarget = (refAtual && gruposPorRef[refAtual]) ? refAtual : (refKeys[idx] || "");
                    if (refTarget && gruposPorRef[refTarget]) {
                        aplicarDadosLinha(tabulatorRow, refTarget, gruposPorRef[refTarget]);
                    }
                });
            }
        });

    }).catch(function (err) {
        console.error("handleLinhasCotacoes: erro ao obter dados do DB", err);
    });
}


function registerClickGravarRelatorio() {
    $("#BUGRAVARBottom").removeAttr("href");

    $(document).off("click", "#BUGRAVARBottom").on("click", "#BUGRAVARBottom", function (e) {
        var record = [];
        

        GMRENDAVALIACOESCOT.getDbData().then(function (reportData) {

            console.log("Dados atuais do relatório para gravar:", reportData);
            /*reportData.map(function (row) {
                row.records.map(function (record) {
                    delete record[""];
                    return record;
                });
                return row;
            });

            record.push({
                instance: "u_reportl",
                data: reportData,
            });*/

           persistRecord(record);
        });
    });
}

function persistRecord(records) {
    $("#registoJson").val(JSON.stringify(records));
    $("#registoJson").trigger("change");
    __doPostBack('ctl00$conteudo$options5$BUGRAVARBottom', '');
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

           // console.log("initConfig.remoteFetchData", initConfig.remoteFetchData);

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