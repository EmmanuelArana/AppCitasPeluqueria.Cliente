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
                success: function () {
                    window.location.href = '/Especialidades';
                },
                error: function (error) {
                    console.error("Error al actualizar:", error);
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