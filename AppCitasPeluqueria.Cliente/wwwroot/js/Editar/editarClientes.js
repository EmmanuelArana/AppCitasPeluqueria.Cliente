const urlCompleta = window.apiSettings.baseUrl + window.apiSettings.endpointCliente;
const clienteId = window.apiSettings.clienteId;

$(document).ready(function () {
    getClienteById(clienteId);

    $("#formCliente").on("submit", function (e) {
        e.preventDefault();

        const cliente = {
            clienteId: clienteId,
            nombre: $("#inpNombre").val(),
            telefono: $("#inpTelefono").val(),
            email: $("#inpEmail").val(),
            activo: $("#chkActivo").is(":checked")
        };

        $.ajax({
            url: `${urlCompleta}/${clienteId}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(cliente),
            success: function () {
                window.location.href = '/Clientes';
            },
            error: function (error) {
                console.error("Error al actualizar:", error);
            }
        });
    });
});

function getClienteById(id) {
    $.ajax({
        url: `${urlCompleta}/${id}`,
        method: "GET",
        success: function (res) {
            $("#inpNombre").val(res.nombre);
            $("#inpTelefono").val(res.telefono);
            $("#inpEmail").val(res.email);
            $("#chkActivo").prop("checked", res.activo);
        },
        error: function (error) {
            console.error("Error al obtener el cliente:", error);
        }
    });
}