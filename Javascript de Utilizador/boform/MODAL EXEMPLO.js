var totData = getTotData(getNotaData().tiponota)
var orderingData = getOrderingDataRubricas(getNotaData().nota)
var datasourceName = "reportcDb"
var reportl = "u_reportl"
var reportlSchema = {
    u_reportlstamp: "",
    saldo: 0,
    nota: "",
    saldoanoant: 0,
    saldoanoact: 0,
    gruponatureza: "",
    u_reportcstamp: " ",
    rubrica: "",
    descrubrica: "",
    natureza: "",
    descnatureza: "",
    gruporowid: "",
    naturezaordem: 0,
    grupolordem: 0,
    naturezasubrowid: "",
    prcntdetida: 0,
    saldofinal: false,
    saldoinicial: false
}
var naturezas = new Array();
var dadosRubricas = new Array();
var grupos = new Array();
naturezasEGrupos = new Array();
var extraChangeFunctions = []

var manualExtraFunctions = []

var db = new Dexie(datasourceName);
//javascript:__doPostBack('ctl00$conteudo$options4$BUAPAGAR','')
var fxData = getFxData(getNotaData().nota)
function pageLoad() {
    //setTimeout(function(){$(".titulobig").css("color","blue")},1000)
    initGlobalFunctions()
    organizarCampos()
    initModalNotas()
    registerClickListenerImprimir()
    registerClickIntroduzir()
    registerBalanceteAnoChange()

    try {

        

        // console.log("Dexie js", )
        configureDataBase(db, reportl, 1, Object.keys(reportlSchema)).then(function (data) {
            var dbConfig = {
                db: db,
                table: "u_reportl"
            }
            var sourceConfig = {
                gruposourceBind: "saldo",
                tableId: "u_reportl",
                cabecalhoKey: "u_reportcstamp",
                dataSource: "u_reportl",
                inputSourceBind: "saldo",
                inputSourceKey: "u_reportlstamp",
                stampKey: "u_reportlstamp",
                saldo: {
                    gruposourceBind: "grupo"
                }

            }
            var registo = {
                stamp: getStamp(),
                coluna: "u_reportcstamp"
            }

            buildReportcTableRouter(dbConfig, sourceConfig, registo)
            //registerGrupoAndNaturezaChange()

        })
    } catch (error) {

        var alertHtml = buildAlert("alert-info", "Sem resultados")
        $(".mainformcampos >  .row").last().after("<div class='row'>" + alertHtml + "</div>")
        console.error('Erro ao configurar base de dados', error);
    }
    //    registerClickListenerTable()
    registerClickGravar()
}



function setMEP($row, selectVal, element) {

    var firstOption = $row.find("td[data-rubrica='MEP'] select option:first").val();

    var optionsArray = $row.find("td[data-rubrica='MEP'] select option").map(function () {
        return $(this).val();
    }).get();

    // console.log("OPTIONS ARRAY",optionsArray)
    $row.find("td[data-rubrica='MEP'] select").val(optionsArray[1]).trigger("change");

    return

}

function preencherPercentagem($row, selectVal, element) {

    //console.log("SELECT VAL", selectVal)
    if (["CP8", "A06_1"].indexOf(getNotaData().nota) < 0) {

        return
    }
    var rowId = $row.attr("id")
    var tableName = element.closest("table").data("source")

    var promise = $.ajax({
        type: "POST",
        url: "../programs/gensel.aspx?cscript=getdadosperfilassociada",
        data: {
            '__EVENTARGUMENT': JSON.stringify([{ nuit: selectVal }]),
        },
        success: function (response) {

            var errorMessage = "ao trazer resultados "
            try {
                //console.log("DADOS PERFIL ASSOCIADA",response)
                if (response.cod != "0000") {

                    // console.log("Erro " + errorMessage, response)
                    return false
                }

                var dados = response.data[0]
                var percentagem = 0
                if (dados) {
                    percentagem = dados.percentagem
                }

                $row.find("td[data-rubrica='%DT'] input").val(formatInputValue(percentagem.toString())).trigger("change")


            } catch (error) {
                console.log("Erro interno " + errorMessage, response)
                //alertify.error("Erro interno " + errorMessage, 10000)
            }

            //  javascript:__doPostBack('','')
        }
    })

    return promise





}




function getGrupoStampByNatureza(codnatureza) {

    var natEGrupos = naturezasEGrupos.find(function (neg) {

        return neg.codnatureza == codnatureza
    })

    if (natEGrupos) {

        return natEGrupos.grupostamp
    }

}



function cruzamentoNatRubHandler($row, selectVal, element) {

    ///Escopo do sinal da natureza 


    var rowId = $row.attr("rowid")
    var tableName = element.closest("table").data("source")
    var naturezaIndex = naturezas.findIndex(function (natureza) {
        return natureza.codnatureza === selectVal;
    });

    if (naturezaIndex >= 0) {

        var dadosNatureza = naturezas[naturezaIndex]
        var sinalnegativo = dadosNatureza.sinalnegativo
        var sinalNegativo = false
        if (sinalnegativo == true) {
            element.closest("tr").attr("sinalnegativo", "true")
            sinalNegativo = true
            $row.find("input").attr("sinalnegativo", "true")

        } else {
            element.closest("tr").removeAttr("sinalnegativo")
        }

        formatAllTablesDigitInputs()


        $("#" + rowId).each(function () {

            var input = $(this).find(".bind-table-control input")
            input.trigger("change")

        })
    }



    var naturezaVal = element.val()
    var tableName = element.closest("table").data("source")
    var naturezasubrowid = element.closest("tr").attr("id")
    var $row = element.closest("tr")

    console.log("changing natureza")

    var naturezaIndex = naturezas.findIndex(function (natureza) {
        return natureza.codnatureza === naturezaVal
    });



    if (naturezaIndex >= 0) {


        var inputsToChange = []
        var promise = $.ajax({
            type: "POST",
            //   async: false,
            url: "../programs/gensel.aspx?cscript=verificacruzanatrub",

            data: {
                '__EVENTARGUMENT': JSON.stringify({
                    periodo: $("#ctl00_conteudo_periodo_mLabel1").text(),
                    codnatureza: naturezas[naturezaIndex].codnatureza,
                    nota: getNotaData().nota,
                    grupostamp: getGrupoStampByNatureza(naturezas[naturezaIndex].codnatureza)
                }),
            },
            success: function (response) {

                //console.log("__EVENTARGUMENT",response)
                console.log("Cruz natureza rubrica", response)
                if (response.cod != "0000") {

                    // alertify.error("Não foi possível actualizar os dados", 10000)
                    console.log(response)
                    return false
                }

                var saldos = new Array()

                saldos = response.data

                saldos.forEach(function (saldo) {

                    $("#" + naturezasubrowid + " td input").each(function () {

                        var element = $(this)
                        var rubrica = element.closest("td").data("rubrica")
                        var tdId = element.closest("td").attr("id")

                        // console.log("rubrica",rubrica)

                        if (saldo.rubrica == rubrica) {


                            var saldoInput = (sinalNegativo == true && saldo.saldo > 0 ? saldo.saldo * -1 : saldo.saldo);


                            $("#" + tdId + " input").val(formatInputValue(saldoInput.toString()))
                            //.trigger("change")
                            // $("#" + record.u_reportlstamp + " input").attr("readonly", true)

                            // $("#" + tdId + " input").trigger("change")7

                            inputsToChange.push(element)


                        }
                    })





                })

                if (saldos.length == 0) {


                    db[tableName]
                        .where({ naturezasubrowid: naturezasubrowid })
                        .modify(function (updateRecord) {
                            updateRecord['saldo'] = 0; // Update the "age" property to 30
                        }).then(function (updatedCount) {
                            // console.log("Reset cruznatrub", updatedCount)

                            if ($row.find("input").data("type") == "digit") {
                                $row.find("input").val("0")
                                //  $row.find("input").attr("readonly", false)
                                $row.find("input").attr("data-cruzanatrub", "true");
                                var rowId = $row.attr("id")

                                $("#" + rowId + " input").each(function () {
                                    var value = element.val();
                                    //  console.log(value);

                                    var toolTip = "<a href='#' data-toggle='tooltip' title='Hooray!'>Hover over me</a>"
                                    element.attr("data-toggle", "tooltip");
                                    //  element.attr("title", element.val());
                                    element.attr("data-original-title", element.val());

                                    // Perform any desired operations with the value here
                                });


                            }



                        }).catch(function (error) {
                            console.error(error);
                        });


                }



                var row = $('input[tot-key="totalReport"]').closest("tr").attr("id")

                // console.log("ROW", row)
                try {

                } catch (error) {

                }

                db[tableName]
                    .filter(function (item) {
                        return item['saldofinal'] == true;
                    })
                    .toArray()
                    .then(function (records) {

                        var sum = _.sumBy(records, function (obj) {

                            return (isNaN(obj['saldo']) ? 0 : Number(obj['saldo']))
                            //return Number(obj.valor);
                        });

                        $('input[tot-key="totalReport"]').val(formatInputValue(sum.toString()));
                        //console.log("Total  saldo final",records,sum);
                    })
                    .catch(function (error) {
                        console.error(error);
                    });



            }
        })


        return promise
    }

    return
}



function actTotais() {


    try {
        //$(".bind-table-control").filter("[source-key]").trigger("keyup");




        $(".sourced-table .grupo-row").each(function () {
            var rubricaArray = [];
            //console.log("GRUPO ROW", $(this).attr("id"))
            $(".header-for-edit-col").each(function () {
                var rubrica = $(this).data("rubrica");
                var item = {
                    codigo: rubrica,
                    total: 0
                };
                rubricaArray.push(item);
            });
            var grupoId = $(this).attr("id");

            $("tr[data-gruporowid='" + grupoId + "'] td input:not([tot-key])").each(function () {
                var rubrica = $(this).closest("td").data("rubrica");
                var value = inputToNumber($(this).val());
                var rubricaData = rubricaArray.find(function (obj) {
                    return obj.codigo == rubrica;
                });

                if (rubricaData) {
                    rubricaData.total += value;
                }
            });

            var tableName = $(".sourced-table").data("source")
            rubricaArray.forEach(function (rubricaItem) {
                db[tableName]
                    .where("rubrica")
                    .equals(rubricaItem.codigo.toString())
                    .and(function (rubricadt) {
                        return rubricadt["gruporowid"] == grupoId && rubricadt["saldofinal"] == true;
                    })
                    .modify({
                        saldo: rubricaItem.total
                    })
                    .then(function (count) {

                        $('input[tot-key="rubrica"][tot-value="' + rubricaItem.codigo + '"][data-gruporowid="' + grupoId + '"]')
                            .val(formatInputValue(rubricaItem.total.toString()))
                        //console.log("Atualizações realizadas para", rubricaItem.codigo, "no grupo", grupoId, ":", count);
                        db[tableName]
                            .filter(function (item) {
                                return item['saldofinal'] == true;
                            })
                            .toArray()
                            .then(function (records) {

                                var sum = _.sumBy(records, function (obj) {

                                    return (isNaN(obj['saldo']) ? 0 : Number(obj['saldo']))
                                    //return Number(obj.valor);
                                });

                                $('input[tot-key="totalReport"]').val(formatInputValue(sum.toString()));
                                //console.log("Total  saldo final",records,sum);
                            })
                            .catch(function (error) {
                                console.error(error);
                            });
                    }).catch(function (error) {

                        console.log("Erro ao atualizar", rubricaItem.codigo, "no grupo", grupoId, ":", error);
                    });
            });

            //console.log("rubricas para o grupo", grupoId, rubricaArray);
            rubricaArray = [];

        })


    } catch (error) {

    }

}

function handleSelectElement(element) {
    var promiseFunctions = [
        cruzamentoNatRubHandler,
        preencherPercentagem,
        setMEP,
        actTotais
    ];
    var selectVal = $(element).val();
    var $row = $(element).closest("tr");

    return promiseFunctions.reduce(function (promiseChain, currentFunction) {
        return promiseChain.then(function () {
            return currentFunction($row, selectVal, element);
        });
    }, Promise.resolve()).then(function () {

        try {
            $("input[source-key]").each(function () {
                try {

                    $(this).trigger("change");
                } catch (error) {

                }
            });
        } catch (error) {

        }
        //$(element).trigger("change");
    });
}

function registerGrupoAndNaturezaChange() {
    $(document).off("change", "select[source-key='naturezasubrowid']").on("change", "select[source-key='naturezasubrowid']", function () {


        var selectVal = $(this).val();
        var $row = $(this).closest("tr");
        var element = $(this)

        var promiseFunctions = [
            cruzamentoNatRubHandler,
            preencherSaldosFinais,
            preencherPercentagem,
            setMEP,
            actTotais
        ];

        // mainSpinner("show")
        promiseFunctions.reduce(function (promiseChain, currentFunction) {
            return promiseChain.then(function () {
                return currentFunction($row, selectVal, element);
            });
        }, Promise.resolve()).then(function () {
            try {

                // $(".bind-table-control").trigger("keyup");
            } catch (error) {

            }
            mainSpinner("hide")
            // All promises have been resolved at this point
        }).catch(function (error) {
            console.error("An error occurred: ", error);
        });;

        // Use Promise.all to execute all promises
        /*  Promise.all(promiseFunctions.map(function (func) {
              return func($row, selectVal,element);
          })).then(function () {
              // All promises have been resolved at this point
          });*/




    })


    function preencherSaldosFinais(row, value, element) {

        var selectVal = value
        if (["SALDOSV2"].indexOf(getNotaData().tiponota) < 0) {

            return;
        }

        var rowId = row.attr("id")
        var tableName = element.closest("table").data("source")

        var promise = $.ajax({
            type: "POST",
            url: "../programs/gensel.aspx?cscript=getsaldonaturezabycodnaturezaperiodoanterior",
            data: {
                '__EVENTARGUMENT': JSON.stringify([{ periodo: $("#ctl00_conteudo_periodo_mLabel1").text(), codnatureza: value, nota: getNotaData().nota }]),
            },
            success: function (response) {

                var errorMessage = "ao trazer resultados "
                try {
                    console.log("response saldo natureza", response)
                    if (response.cod != "0000") {

                        console.log("Erro " + errorMessage, response)
                        return false
                    }
                    var saldo = response.data
                    $("#" + rowId).find("td[data-rubrica='SF'] input").val(formatInputValue(saldo.toString())).trigger("change")
                } catch (error) {
                    console.log("Erro interno " + errorMessage, response)
                    //alertify.error("Erro interno " + errorMessage, 10000)
                }

                //  javascript:__doPostBack('','')
            }
        })

        return promise


    }

    $(document).off("change", "select[source-key='gruporowid']").on("change", "select[source-key='gruporowid']", function () {

        ///

        console.log("changing grupo")



        var selectVal = $(this).val()

        var selectElement = $(this)

        var grupo = grupos.find(function (grupo) {

            return grupo.codgrupnatureza == selectVal
        })

        if (grupo) {

            promise = $.ajax({
                type: "POST",
                //   async: false,
                url: "../programs/gensel.aspx?cscript=verificacruzamentorubgrupo",

                data: {
                    '__EVENTARGUMENT': JSON.stringify({ periodo: $("#ctl00_conteudo_periodo_mLabel1").text(), grupostamp: grupo.grupostamp, nota: getNotaData().nota }),
                },
                success: function (response) {
                    // console.log("GRUPO RESPONSE", response)
                    //console.log("__EVENTARGUMENT",response)
                    if (response.cod != "0000") {

                        // alertify.error("Não foi possível actualizar os dados", 10000)
                        //   console.log("GRUPO RESPONSE", response)
                        return false
                    }


                    var gruporowid = selectElement.closest("tr").attr("id")
                    var saldos = new Array()

                    saldos = response.data

                    //console.log("LENGTH GRUPO","GRUPO ROW ID",gruporowid,$("tr[data-gruporowid='" + gruporowid + "'].saldo-inicial-grupo-row").length)
                    saldos.forEach(function (saldo) {

                        console.log('saldo', saldo)
                        var trSaldoInicial = $("[data-gruporowid='" + gruporowid + "'].saldo-inicial-grupo-row");
                        var input = trSaldoInicial.find("td[data-rubrica='" + saldo.rubrica + "'] input");
                        var valorSaldo = 0;
                        valorSaldo = saldo.sinalnegativo == true ? -1 * saldo.saldo : saldo.saldo;
                        input.val(formatInputValue(valorSaldo.toString())).trigger("change")
                        $("[data-gruporowid='" + gruporowid + "'].saldo-inicial-grupo-row input").each(function () {

                            /*     var element = $(this)
                                 var rubrica = element.closest("td").data("rubrica")
                                 var tdId = element.closest("td").attr("id")
     
                                 //   console.log("ON LLOOP",rubrica)
     
                                 if (saldo.rubrica == rubrica && element.attr("source-bind") != undefined) {
     
     
                                     //      var saldoInput = (sinalNegativo == true && saldo.saldo > 0 ? saldo.saldo * -1 : saldo.saldo);
     
                                     console.log("PATH","#" + tdId + " input")
     
                                     $("#" + tdId + " input").val(formatInputValue(saldo.saldo.toString()))
     
                                     //.trigger("change")
                                     // $("#" + record.u_reportlstamp + " input").attr("readonly", true)
     
                                     //$("#" + tdId + " input").trigger("change")
     
     
                                 }*/
                        })

                    })


                }
            })


            promise.then(function () {

            })

        }
        $row = $(this).closest("tr")

        var rowId = $row.attr("rowid")
        var tableName = $(this).closest("table").data("source")


    })
}
function registerBalanceteAnoChange() {


}
function getTotData(tiponota) {
    var totDataModelos = [
        {
            tipoNota: "SALDOS",
            totData: [{
                totKey: "rubrica",
                totValue: "saldo",
                updateTable: true,
                // updateQuery: { filterKey: "saldofinal", filterValue: false }
                updateQuery: "item['saldofinal']==false"

            }, {
                totKey: "gruponatureza",
                totValue: "saldo",
                updateTable: false,
                updateQuery: { filterKey: "saldofinal", filterValue: false }
            },
            {
                totKey: "gruporowid",
                totValue: "saldo",
                updateTable: false,
                updateQuery: "item['gruporowid']!=-1111111111111111"
            },
            {
                totKey: "naturezasubrowid",
                totValue: "saldo",
                updateTable: false,
                updateQuery: "item['saldofinal']==false && item['saldoinicial']==false"
            }
            ]
        },
        {
            tipoNota: "SALDOSV2",
            totData: [

                {
                    totKey: "rubrica",
                    totValue: "saldo",
                    updateTable: false,
                    isTotalRow: false,
                    htmlFilter: '\'[data-gruporowid="\' + inputChanged.closest("tr").data("gruporowid") + \'"]\'',
                    updateQuery: "item['gruporowid']==inputChanged.closest('tr').data('gruporowid')"
                },
                {
                    totKey: "rubrica",
                    totValue: "valor",
                    updateTable: false,
                    htmlFilter: " '.total-report'",
                    updateQuery: "item['rubrica']!=-1111111111111111"

                },
                {
                    totKey: "naturezasubrowid",
                    totValue: "saldo",
                    updateTable: true,
                    //  totExpression: "totalSaldosV2Handler(total,currentRow)",
                    updateQuery: "item['saldofinal']==false"
                },
                {
                    totKey: "totalReport",
                    totValue: "saldo",
                    updateTable: false,
                    htmlFilter: " '.total-report'",
                    //updateQuery: "item['gruporowid']!=-1111111111111111",
                    updateQuery: "item['saldofinal']==false "
                },
                {
                    totKey: "gruporowid",
                    totValue: "saldo",
                    updateTable: true,
                    isTotalRow: true,
                    htmlFilter: " '.saldo-final-tot'",
                    updateQuery: "item['saldofinal']==false"
                },
            ]
        },
        {
            tipoNota: "STANDARD",
            totData: [

                {
                    totKey: "gruporowid",
                    totValue: "saldo",
                    updateTable: false,
                    isTotalRow: true,
                    updateQuery: "item['gruporowid']!=-3823982323"
                },
                {
                    totKey: "rubrica",
                    totValue: "saldo",
                    updateTable: false,
                    isTotalRow: false,
                    htmlFilter: '\'[data-gruporowid="\' + inputChanged.closest("tr").data("gruporowid") + \'"]\'',
                    updateQuery: "item['gruporowid']==inputChanged.closest('tr').data('gruporowid')"
                },
                {
                    totKey: "rubrica",
                    totValue: "valor",
                    updateTable: false,
                    htmlFilter: " '.total-report'",
                    updateQuery: "item['rubrica']!=-1111111111111111"

                },
                {
                    totKey: "naturezasubrowid",
                    totValue: "saldo",
                    isTotalRow: false,
                    updateTable: false,
                    updateQuery: "item['naturezasubrowid']!=-3823982323"
                }
            ]
        },
        {
            tipoNota: "SALDOSV3",
            totData: [
                {
                    totKey: "rubrica",
                    totValue: "saldo",
                    updateTable: true,
                    isTotalRow: false,
                    htmlFilter: '\'[data-gruporowid="\' + inputChanged.closest("tr").data("gruporowid") + \'"]\'',
                    updateQuery: "item['gruporowid']==inputChanged.closest('tr').data('gruporowid')&&item['saldofinal']==false"
                },

                {
                    totKey: "naturezasubrowid",
                    totValue: "saldo",
                    isTotalRow: true,
                    updateTable: false,
                    updateQuery: "item['naturezasubrowid']!=-3823982323"
                },
                {
                    totKey: "rubrica",
                    totValue: "saldo",
                    updateTable: false,
                    htmlFilter: " '.total-report'",
                    updateQuery: "item['rubrica']!=-1111111111111111 && item['saldofinal']==false "

                },
                {
                    totKey: "totalReport",
                    totValue: "saldo",
                    updateTable: false,
                    htmlFilter: "'.total-report'",
                    updateQuery: "item['saldofinal']==true "

                },
                {
                    totKey: "gruporowid",
                    totValue: "saldo",
                    updateTable: false,
                    isTotalRow: true,
                    htmlFilter: " '.saldo-final-tot'",
                    updateQuery: "item['saldofinal']==false"
                },
            ]
        }

    ]

    var totalDataResult = totDataModelos.filter(function (obj) {
        return obj.tipoNota == tiponota
    })


    // console.log(totalDataResult)

    if (totalDataResult.length > 0) {
        return totalDataResult[0].totData
    }

    return []

}

function totalSaldosV2Handler(total, currentRow) {

    switch (getNotaData().nota) {
        case "A06_2":

            //console.log("A06",getRubricaRowValueByType("SI","input","digit") + getRubricaRowValue("IP","input","digit") - getRubricaRowValue("RAP","input","digit"))
            return getRubricaRowValueByType("SI", "input", "digit") + getRubricaRowValueByType("IP", "input", "digit") - getRubricaRowValueByType("RAP", "input", "digit")
        default:
            return total

    }
}
function getFxData(nota) {

    var fxDataModelos = [
        {
            nota: "A06_1",
            fxData: [
                {
                    targetCol: "CPROP",
                    fx: "[AC],{+},[ANC],{-},[PC],{-},[PNC]",
                    updateTable: true,
                    // updateQuery: { filterKey: "saldofinal", filterValue: false }
                    // updateQuery: "item['saldofinal']==false"

                },
                /*   {
                       targetCol: "PGRLA",
                       fx: "[RL],{*},[%DT],{/},[<100>]",
                       updateTable: true,
                       // updateQuery: { filterKey: "saldofinal", filterValue: false }
                       // updateQuery: "item['saldofinal']==false"
   
                   },*/
                /*   {
                       targetCol: "PGCP",
                       fx: "[CPROP],{*},[%DT],{/},[<100>]",
                       updateTable: true,
                       // updateQuery: { filterKey: "saldofinal", filterValue: false }
                       // updateQuery: "item['saldofinal']==false"
   
                   },*/
                {
                    targetCol: "VIF1",
                    fx: "[GDWLL],{+},[PGCP],{-},[IMPACC]",
                    updateTable: true,
                    // updateQuery: { filterKey: "saldofinal", filterValue: false }
                    // updateQuery: "item['saldofinal']==false"

                }

            ]
        },
        {
            nota: "A10_3",
            fxData: [
                {
                    targetCol: "COMP",
                    fx: "[CIV],{-},[REG]",
                    updateTable: true,
                    // updateQuery: { filterKey: "saldofinal", filterValue: false }
                    // updateQuery: "item['saldofinal']==false"

                }

            ]
        },
        {
            nota: "CP8",
            fxData: [
                {
                    targetCol: "PMRL",
                    fx: "[RLP],{*},[%DT],{/},[<100>]",
                    updateTable: true,
                    // updateQuery: { filterKey: "saldofinal", filterValue: false }
                    // updateQuery: "item['saldofinal']==false"

                },
                {
                    targetCol: "PMCP",
                    fx: "[CPP],{*},[%DT],{/},[<100>]",
                    updateTable: true,
                    // updateQuery: { filterKey: "saldofinal", filterValue: false }
                    // updateQuery: "item['saldofinal']==false"

                }

            ]
        }


    ]

    var fxDataResult = fxDataModelos.filter(function (obj) {
        return obj.nota == nota
    })


    // console.log(totalDataResult)

    if (fxDataResult.length > 0) {
        return fxDataResult[0].fxData
    }

    return []
}



function calculosA06_1() {

    var mep = getRubricaRowValueByType("MEP", "select", "text")
    var percentagemDetida = getRubricaRowValueByType("%DT", "input", "digit")
    var resultadoLiquido = getRubricaRowValueByType("RL", "input", "digit")
    var capitalProprio = getRubricaRowValueByType("CPROP", "input", "digit")

    console.log("MEPP", mep)

    switch (mep) {

        case "MEP":

            setRubricaRowValue("PGRLA", resultadoLiquido * percentagemDetida)
            setRubricaRowValue("PGCP", capitalProprio * percentagemDetida)
            break;
        case "Custo":
            setRubricaRowValue("PGRLA", 0)
            setRubricaRowValue("PGCP", 0)
            break
        default:
            setRubricaRowValue("PGRLA", 0)
            setRubricaRowValue("PGCP", 0)

    }

    //console.log("CALCULOS A06_1")
}



function registerClickIntroduzir() {

    $("#BUINTRODUZIR").removeAttr("href")

    $(document).off("click", "#BUINTRODUZIR").on("click", "#BUINTRODUZIR", function () {

        // WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions("ctl00$conteudo$options2$BUINTRODUZIR", "", true, "", "", false, true))
        $("#modalNotas").modal()

    })
}


function introduzirNota() {

    if (!$("#selectNotas").val()) {
        alertify.alert("Selecione uma Nota")
        return false
    }
    if (!$("#dataNota").val()) {
        alertify.alert("Selecione uma data")
        return false
    }

    // var tipoActivo = $('#tipoActivoAoIntroduzir option:selected').text()
    window.location.href = "../programs/genform.aspx?codigo=reportcform&fazer=introduzir&periodicidade='" + $("#selectPeriodicidade").select2().find(":selected").data("periodicidade") + "'&percod='" + $("#selectPeriodicidade option:selected").text() + "'&periodo='" + $("#selectPeriodicidade").val() + "'&codigonota=" + $("#selectNotas").val() + "&data=" + getPhcDataHtmlFormat("", "#dataNota", true).fullDate
}


function organizarCampos() {
    $("#ctl00_conteudo_u_reportcstamp1").hide()
    setTimeout(function () {

        // $("#u_reportl1").parent().hide()
        $("#u_reportl1").hide()
    }, 1000)
}







function registerClickListenerImprimir() {
    $("#userOption12").removeAttr("href")
    $(document).off("click", "#userOption12").on("click", "#userOption12", function () {


        window.location.href = "../programs/ewpview.aspx?agregado=false&codigo=Impressao&registo=" + getStamp() + "&nota=" + getNotaData().nota + "&tiponota=" + getNotaData().tiponota + "&tabela=u_reportl&coluna=u_reportcstamp&periodo=" + $("#ctl00_conteudo_periodo_mLabel1").text()


    });

    $("#userOption20034").removeAttr("href")
    $(document).off("click", "#userOption20034").on("click", "#userOption20034", function () {

        window.location.href = "../programs/ewpview.aspx?relatorioregisto=" + getNotaData().nota + "&colrelatorio=nota&agregado=true&tabelacab=u_reportc&colunacab=u_reportcstamp&filtercabcol=periodo&filtercabregisto=" + $("#ctl00_conteudo_periodo_mLabel1").text() + "&codigo=Impressao&registo=" + getStamp() + "&nota=" + getNotaData().nota + "&tiponota=" + getNotaData().tiponota + "&tabela=u_reportl&coluna=u_reportcstamp&periodo=" + $("#ctl00_conteudo_periodo_mLabel1").text()


    })

}



function getStamp() {
    return $("#ctl00_conteudo_u_reportcstamp1_mLabel1").text()
}


function storeStamp() {
    window.localStorage.setItem("stampregisto", getStamp())
    return getStamp()
}



function initModalNotas() {

    var inputBalanceteAno = "<span class='control-label  '>Data:</span> <input  data-language='pt' type='text' id='dataNota' class='form-control' /><br><br>"
    var selectPeriodicidadedsHtml = "<span class='control-label  '>Periodicidade:</span>"
    $.ajax({
        type: "POST",
        url: "../programs/gensel.aspx?cscript=getperiodicidadesabertas",
        async: false,
        success: function (response) {

            var errorMessage = "ao trazer resultados "
            try {
                console.log(response)
                if (response.cod != "0000") {

                    alertify.error("Erro " + errorMessage, 10000)
                    return false
                }
                var periodicidades = response.data
                var selectHtml = "<select  id='selectPeriodicidade' class='form-control ' >"
                selectHtml += "<option value='' selected></option>"

                periodicidades.forEach(function (periodicidadeData) {
                    selectHtml += "<option data-periodicidade='" + periodicidadeData.periodicidade + "' value='" + periodicidadeData.periodo.trim() + "'>" + periodicidadeData.periodicidade.trim() + "-" + periodicidadeData.periodo.trim() + "</option>"
                })

                selectHtml += "</select> "
                selectPeriodicidadedsHtml += selectHtml


            } catch (error) {
                console.log("Erro interno " + errorMessage, response)
                alertify.error("Erro interno " + errorMessage, 10000)
            }




            //  javascript:__doPostBack('','')
        }
    })
    var selectHtml = ""
    selectHtml += selectPeriodicidadedsHtml
    selectHtml += "<br><br> <span class='control-label  '>Notas:</span> <select id='selectNotas'></select>"
    selectHtml += inputBalanceteAno
    var modalData = {
        title: "Notas",
        id: "modalNotas",
        customData: "",
        otherclassess: "",
        body: selectHtml,
        footerContent: "<button type='button' onClick='introduzirNota()' class='btn btn-primary'>Introduzir a Nota</button>"
    };

    var modalHTML = generateModalHTML(modalData);
    $("#maincontent").append(modalHTML)
    $('#selectPeriodicidade').select2({
        width: "100%",
        allowClear: false
    })
    $('#selectNotas').select2({
        width: "100%",
        allowClear: false
    })

    $(document).off("change", "#selectPeriodicidade").on("change", "#selectPeriodicidade", function () {
        var periodo = $("#selectPeriodicidade").val();

        getDataByPeriodo($("#dataNota"), periodo, $("#selectPeriodicidade").select2().find(":selected").data("periodicidade"))

        $.ajax({
            type: "POST",
            async: false,
            url: "../programs/gensel.aspx?cscript=getlistadenotas&automatica=0&periodo=" + periodo + "",

            success: function (response) {

                var errorMessage = "ao trazer resultados "
                try {
                    console.log(response)
                    if (response.cod != "0000") {

                        alertify.error("Erro " + errorMessage, 10000)
                        return false
                    }

                    $("#selectNotas").empty()

                    var notas = response.data.notas
                    var selectHtml = "<option value='' selected></option>"
                    notas.forEach(function (notaData) {
                        selectHtml += "<option " + (notaData.totalnota > 0 ? "disabled" : "") + " data-checked='" + notaData.totalnota + "' value='" + notaData.nota.trim() + "'>" + notaData.descnota.trim() + "</option>"
                    })

                    $("#selectNotas").append(selectHtml)
                    $('#selectNotas').select2({
                        width: "100%",
                        templateSelection: formatText,
                        templateResult: formatText
                    });


                } catch (error) {
                    console.log("Erro interno " + errorMessage, response)
                    alertify.error("Erro interno " + errorMessage, 10000)
                }




                //  javascript:__doPostBack('','')
            }
        })

    })




}

function stampExiste() {
    return getStamp() == window.localStorage.getItem("stampregisto")
}

function getOrderingDataRubricas(nota) {

    var orderingDataModelo = [{
        nota: "A06_1",
        orderingData: [
            { fieldKey: "rubrica", fieldValue: "MDV", order: 0 },
            { fieldKey: "rubrica", fieldValue: "VIF", order: 1 },
            { fieldKey: "rubrica", fieldValue: "ANC", order: 2 },
            { fieldKey: "rubrica", fieldValue: "AC", order: 3 },
            { fieldKey: "rubrica", fieldValue: "PNC", order: 4 },
            { fieldKey: "rubrica", fieldValue: "PC", order: 5 },
            { fieldKey: "rubrica", fieldValue: "RL", order: 6 },
            { fieldKey: "rubrica", fieldValue: "CPROP", order: 7 },
            { fieldKey: "rubrica", fieldValue: "%DT", order: 8 },
            { fieldKey: "rubrica", fieldValue: "PGRLA", order: 9 },
            { fieldKey: "rubrica", fieldValue: "PGCP", order: 10 },
            { fieldKey: "rubrica", fieldValue: "IMPACC", order: 11 },
            { fieldKey: "rubrica", fieldValue: "GDWLL", order: 12 },
            { fieldKey: "rubrica", fieldValue: "VIF1", order: 13 },
            //{ fieldKey: "rubrica", fieldValue: "AO", order: 0 }
        ]
    },
    {
        nota: "CP8",
        orderingData: [
            { fieldKey: "rubrica", fieldValue: "%DT", order: 0 },
            { fieldKey: "rubrica", fieldValue: "RLP", order: 1 },
            { fieldKey: "rubrica", fieldValue: "PMRL", order: 2 },
            { fieldKey: "rubrica", fieldValue: "CPP", order: 3 },
            { fieldKey: "rubrica", fieldValue: "PMCP", order: 4 },

        ]
    }]

    var orderingDataResult = orderingDataModelo.filter(function (obj) {
        return obj.nota == nota
    })


    // console.log(totalDataResult)

    if (orderingDataResult.length > 0) {
        return orderingDataResult[0].orderingData
    }

    return []



}

function buildReportcTableRouter(dbConfig, sourceConfig, registo) {
    console.log("Reportc router")

    switch (getNotaData().tiponota) {
        case "SALDOS":
            buildModeloSaldos(getNotaData().nota, dbConfig, sourceConfig, registo)
            return true;

        case "SALDOSV2":
            buildModeloSaldoV2(getNotaData().nota, dbConfig, sourceConfig, registo)

            return true
        case "SALDOSV3":
            buildModeloSaldosV3(getNotaData().nota, dbConfig, sourceConfig, registo);

            return true
        case "STANDARD":
            buildModeloStandard(getNotaData().nota, dbConfig, sourceConfig, registo)
            return true
        case "PERCENTAGEM":
            buildModeloPercentagem(getNotaData().nota, dbConfig, sourceConfig, registo)
        default:

    }

}


function registerClickGravar() {

    $("#BUGRAVARBottom").removeAttr("href")

    //btn btn-sm btn-danger removeNaturezaRow
    $(document).off("click", "#BUGRAVARBottom").on("click", "#BUGRAVARBottom", function () {

        db.u_reportl.toArray().then(function (records) {

            var mapedRecords = records.map(function (obj) {
                if (obj.saldo == "" || obj.saldo == undefined) {
                    obj.saldo = 0
                } else {
                    obj.saldo = Number(parseFloat(obj.saldo).toFixed(2))
                }
                return obj
            })
            console.log("The Records", mapedRecords)
            $("#registoJson").val(JSON.stringify(mapedRecords))
            // return true
            $("#registoJson").trigger("change")

            WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions("ctl00$conteudo$options5$BUGRAVARBottom", "", true, "", "", false, true))
            // __doPostBack('ctl00$conteudo$options5$BUGRAVARBottom', '')
        })

    })


}