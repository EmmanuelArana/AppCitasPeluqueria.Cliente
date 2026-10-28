const urlCompleta = window.apiSettings.baseUrl + window.apiSettings.endpointCliente;
const clienteId = window.apiSettings.clienteId;

$(document).ready(function () {
    getClienteById(clienteId);

    $("#formCliente").on("submit", function (e) {
        e.preventDefault();
        const $form = $(this);
        limpiarErrores($form);

        const nombre = $("#inpNombre").val().trim();
        const telefono = $("#inpTelefono").val().trim();
        const email = $("#inpEmail").val().trim();

        if (!nombre) marcarError($("#inpNombre"), "El nombre es obligatorio.");
        if (!telefono) marcarError($("#inpTelefono"), "El teléfono es obligatorio.");
        if (!email) {
            marcarError($("#inpEmail"), "El email es obligatorio.");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            marcarError($("#inpEmail"), "El email no tiene un formato válido.");
        }
        if (erroresForm.length) { mostrarErrores($form); return; }

        $.get(urlCompleta).done(function (lista) {
            if (buscarDuplicado(lista, { email }, ["email"], "clienteId", clienteId))
                marcarError($("#inpEmail"), "Ya existe otro cliente con ese email.");
            if (buscarDuplicado(lista, { telefono }, ["telefono"], "clienteId", clienteId))
                marcarError($("#inpTelefono"), "Ya existe otro cliente con ese teléfono.");
            if (erroresForm.length) { mostrarErrores($form); return; }

            const cliente = {
                clienteId: clienteId,
                nombre: nombre,
                telefono: telefono,
                email: email,
                activo: $("#chkActivo").is(":checked")
            };

            $.ajax({
                url: `${urlCompleta}/${clienteId}`,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(cliente),
                beforeSend: function () { limpiarErrores($("#formCliente")); },
                success: function () {
                    window.location.href = '/Clientes';
                },
                error: function (error) {
                    console.error("Error al actualizar:", error);
                    mostrarErrorAPI(error);
                }
            });
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
function mostrarErrorAPI(error) {
    const r = error.responseJSON;
    let mensajes = [];

    if (error.status === 0) {                                 // Error de red
        mensajes = ['No se pudo conectar con el servidor.'];
    } else if (r?.errors) {                                   // validaciones de modelo
        mensajes = Object.values(r.errors).flat();
    } else if (r?.mensaje) {                                  // Reglas de negocio de la api
        mensajes = [r.mensaje];
    } else {
        mensajes = ['Ocurrió un error inesperado.'];
    }

    $('#errorForm')
        .empty()
        .append(mensajes.map(m => $('<div>').text(m)))
        .removeClass('d-none');
}