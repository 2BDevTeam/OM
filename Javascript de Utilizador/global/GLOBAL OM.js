var GRequisicoesModalGlobal = [];

function generateAndOpenModalRequisicao(containerToRenderModal) {
    initGlobalModalRequisicao(containerToRenderModal);
    refreshGlobalRequisicoesModal();
    $("#modalRequisicao").modal("show");
}

function initGlobalModalRequisicao(containerToRenderModal) {
    if ($("#modalRequisicao").length) {
        return;
    }

    var selectHtml = "";
    selectHtml += "<span class='control-label'>Requisição:</span>";
    selectHtml += "<select id='selectRequisicaoModal' class='form-control'><option value='' selected></option></select>";

    var modalData = {
        title: "Selecionar Requisição",
        id: "modalRequisicao",
        customData: "",
        otherclassess: "",
        body: selectHtml,
        footerContent: "<button type='button' onClick='confirmarRequisicaoModalGlobal()' class='btn btn-primary'>Confirmar</button>"
    };

    var modalHTML = generateModalHTML(modalData);
    var targetContainer = containerToRenderModal || "#maincontent";
    var $main = $(targetContainer);

    if ($main.length) {
        $main.append(modalHTML);
    } else {
        $(document.body).append(modalHTML);
    }

    if (typeof $.fn.select2 !== "undefined") {
        $("#selectRequisicaoModal").select2({
            width: "100%",
            allowClear: true,
            placeholder: "Selecione a requisição"
        });
    }
}

function refreshGlobalRequisicoesModal() {
    var requisicoes = getGlobalRequisicoesModal();
    var $select = $("#selectRequisicaoModal");

    if (!$select.length) {
        return;
    }

    $select.empty();
    $select.append("<option value='' selected></option>");

    requisicoes.forEach(function (item) {
        if (!item || !item.requisicao) {
            return;
        }

        $select.append("<option value='" + item.requisicao + "'>" + item.requisicao + "</option>");
    });

    if (typeof $.fn.select2 !== "undefined") {
        $select.trigger("change.select2");
    }
}

function getGlobalRequisicoesModal() {
    var result = [];

    $.ajax({
        type: "POST",
        url: "../programs/gensel.aspx?cscript=getrequisicoes",
        async: false,
        success: function (response) {
            var errorMessage = "ao trazer requisições";
            try {
                if (response.cod !== "0000") {
                    console.log("Erro " + errorMessage, response);
                    return;
                }

                result = response.data || [];
            } catch (error) {
                console.log("Erro interno " + errorMessage, error);
            }
        },
        error: function (xhr) {
            console.log("Erro ao obter requisições", xhr);
        }
    });

    GRequisicoesModalGlobal = result;
    return result;
}

function confirmarRequisicaoModalGlobal() {
    var requisicao = $("#selectRequisicaoModal").val();

    if (!requisicao) {
        if (typeof alertify !== "undefined") {
            alertify.alert("Selecione uma requisição");
        }
        return false;
    }

    window.location.href = "../dos/boform.aspx?fazer=introduzir&doctype=43&u_requis=" + encodeURIComponent(requisicao);
    return true;
}
