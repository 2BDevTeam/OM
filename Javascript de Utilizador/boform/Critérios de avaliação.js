var GCriteriosAvaliacao = [];


function initFunctionsCriterios() {

    registerClickIntroduzirRequisicao();
}
function initCriteriosAvaliacao(callback) {


    setTimeout(function () {
        $("#ctl00_conteudo_u_criterio_u_criteriomBox1").hide();
    }, 500);
    var inputSelector = "#ctl00_conteudo_u_criterio_u_criteriomBox1";
    var containerSelector = "#ctl00_conteudo_u_criterio";

    var $container = $(containerSelector);
    var $input = $(inputSelector);

    if ($container.length === 0) {
        console.warn("Container de critérios não encontrado:", containerSelector);
        if (typeof callback === "function") callback();
        return;
    }

    // Carregar Select2 CSS se não existir


    // CSS customizado (layout Mdash)
    if (!$("#criterios-select2-css").length) {
        /*  $("head").append('<style id="criterios-select2-css">' +
              '.select2-selection__rendered { overflow-x: scroll !important; }' +
              '.select2-selection__choice { position: relative !important; padding-right: 25px !important; }' +
              '.select2-selection__choice__remove { position: absolute !important; right: 4px !important; top: 4px !important; transform: none !important; margin: 0 !important; line-height: 1 !important; }' +
          '</style>');*/
    }

    var initSelect2 = function () {
        $.ajax({
            type: "POST",
            url: "../programs/gensel.aspx?cscript=getcriterioavaliacoes",
            async: false,
            success: function (response) {

                var errorMessage = "ao trazer critérios de avaliação";
                try {

                    if (response.cod != "0000") {
                        console.log("Erro " + errorMessage, response);
                        return false;
                    }


                    renderMultiSelect($container, $input, response.data);

                    if (getState() == "consultar") {
                        $("#criterios-multiselect-container").hide();
                    }
                    if (typeof callback === "function") callback();

                } catch (error) {
                    console.log("Erro interno " + errorMessage, error);
                    if (typeof callback === "function") callback();
                }
            }
        });
    };

    if (typeof $.fn.select2 === "undefined") {
        initSelect2();

    } else {
        initSelect2();
    }
}

function renderMultiSelect($container, $input, criterios) {

    var valoresActuais = ($input.val() || "").split(",").map(function (v) {
        return v.trim();
    }).filter(function (v) {
        return v !== "";
    });

    $container.find("#criterios-multiselect").select2("destroy").remove();

    var selectHtml = '<select class="form-control input-sm" id="criterios-multiselect" multiple="multiple" style="width:100%;">';

    for (var i = 0; i < criterios.length; i++) {
        var descricao = criterios[i].descricao;
        var selected = valoresActuais.indexOf(descricao) >= 0 ? ' selected="selected"' : '';
        selectHtml += '<option value="' + descricao + '"' + selected + '>' + descricao + '</option>';
    }

    selectHtml += '</select>';

    $container.append("<div id='criterios-multiselect-container'>" + selectHtml + "</div>");

    $("#criterios-multiselect").select2({
        placeholder: "Seleccione critérios de avaliação",
        allowClear: true,
        width: "100%"
    });

    // Preencher variável global com os critérios já seleccionados
    GCriteriosAvaliacao = valoresActuais.map(function (desc) {
        var criterio = criterios.find(function (c) { return c.descricao === desc; });
        return criterio || { descricao: desc };
    });

    $("#criterios-multiselect").on("change", function () {
        var seleccionados = $(this).val() || [];
        var texto = seleccionados.join(", ");
        $input.val(texto);
        $input.trigger("change");

        // Actualizar variável global
        GCriteriosAvaliacao = seleccionados.map(function (desc) {
            var criterio = criterios.find(function (c) { return c.descricao === desc; });
            return criterio || { descricao: desc };
        });
    });

}

function registerClickIntroduzirRequisicao() {


    if ($("#ctl00_conteudo_TipoDossier").val().toString() != "43") {
        return;
    }

    $("#BUINTRODUZIR").removeAttr("href");

    $(document).off("click", "#BUINTRODUZIR").on("click", "#BUINTRODUZIR", function (e) {
        e.preventDefault();
        if (typeof generateAndOpenModalRequisicao === "function") {
            generateAndOpenModalRequisicao("#maincontent");
            return;
        }

        console.warn("Função global generateAndOpenModalRequisicao não encontrada.");
    });
}
