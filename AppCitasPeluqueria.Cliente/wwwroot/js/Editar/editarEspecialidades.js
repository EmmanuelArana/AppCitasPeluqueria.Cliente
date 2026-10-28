//Se obtiene la URL base y el endpoint de la especialidad desde la configuración global
const urlCompleta = window.apiSettings.baseUrl + window.apiSettings.endpointEspecialidad;
const especialidadId = window.apiSettings.especialidadId;

$(document).ready(function () {
    getEspecialidadById(especialidadId);

    $("#formEspecialidad").on("submit", function (e) {
        e.preventDefault();
        const $form = $(this);
        limpiarErrores($form);

        const nombre = $("#inpNombre").val().trim();

        if (!nombre) {
            marcarError($("#inpNombre"), "El nombre es obligatorio.");
            mostrarErrores($form);
            return;
        }

        $.get(urlCompleta).done(function (lista) {
            if (buscarDuplicado(lista, { nombre }, ["nombre"], "especialidadId", especialidadId)) {
                marcarError($("#inpNombre"), "Ya existe otra especialidad con ese nombre.");
                mostrarErrores($form);
                return;
            }

            const especialidad = {
                especialidadId: especialidadId,
                nombre: nombre,
                activo: $("#chkActivo").is(":checked")
            };

            $.ajax({
                url: `${urlCompleta}/${especialidadId}`,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(especialidad),
                beforeSend: function () { limpiarErrores($("#formEstilista")); },
                success: function () {
                    window.location.href = '/Especialidades';
                },
                error: function (error) {
                    console.error("Error al actualizar:", error);
                    mostrarErrorAPI(error);
                }
            });
        });
    });
});

// Función para obtener la especialidad por ID y llenar el formulario
function getEspecialidadById(id) {
    $.ajax({
        url: `${urlCompleta}/${id}`,
        method: "GET",
        success: function (res) {
            console.log("Especialidad obtenida:", res);
            $("#inpNombre").val(res.nombre);
            $("#chkActivo").prop("checked", res.activo);
        },
        error: function (error) {
            console.error("Error al obtener la especialidad:", error);
        }
    });
}

// Función para mostrar errores de la API en el formulario
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