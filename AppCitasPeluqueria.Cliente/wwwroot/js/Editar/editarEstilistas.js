//Se optiene las urls de la API y el ID del estilista desde el archivo apiSettings.js
const urlCompleta = window.apiSettings.baseUrl + window.apiSettings.endpointEstilista;
const urlEspecialidades = window.apiSettings.baseUrl + window.apiSettings.endpointEspecialidad;
const estilistaId = window.apiSettings.estilistaId;

$(document).ready(function () {
    cargarEspecialidades(function () {
        getEstilistaById(estilistaId);
    });

    $("#formEstilista").on("submit", function (e) {
        e.preventDefault();
        const $form = $(this);
        limpiarErrores($form);

        const nombre = $("#inpNombre").val().trim();
        const especialidadId = Number($("#selEspecialidad").val()) || 0;
        const telefono = $("#inpTelefono").val().trim();
        const email = $("#inpEmail").val().trim();

        if (!nombre) marcarError($("#inpNombre"), "El nombre es obligatorio.");
        if (!especialidadId) marcarError($("#selEspecialidad"), "Selecciona una especialidad.");
        if (!telefono) marcarError($("#inpTelefono"), "El teléfono es obligatorio.");
        if (!email) {
            marcarError($("#inpEmail"), "El email es obligatorio.");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            marcarError($("#inpEmail"), "El email no tiene un formato válido.");
        }
        if (erroresForm.length) { mostrarErrores($form); return; }

        $.get(urlCompleta).done(function (lista) {
            if (buscarDuplicado(lista, { email }, ["email"], "estilistaId", estilistaId))
                marcarError($("#inpEmail"), "Ya existe otro estilista con ese email.");
            if (buscarDuplicado(lista, { telefono }, ["telefono"], "estilistaId", estilistaId))
                marcarError($("#inpTelefono"), "Ya existe otro estilista con ese teléfono.");
            if (erroresForm.length) { mostrarErrores($form); return; }

            const estilista = {
                estilistaId: estilistaId,
                nombre: nombre,
                especialidadId: especialidadId,
                telefono: telefono,
                email: email,
                activo: $("#chkActivo").is(":checked")
            };

            $.ajax({
                url: `${urlCompleta}/${estilistaId}`,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(estilista),
                success: function () {
                    window.location.href = '/Estilistas';
                },
                error: function (error) {
                    console.error("Error al actualizar:", error);
                }
            });
        });
    });
});

// Llena el select y luego ejecuta el callback
function cargarEspecialidades(callback) {
    $.get(urlEspecialidades, function (res) {
        const activas = (res || []).filter(e => e.activo === true);
        const opciones = activas.map(e => `<option value="${e.especialidadId}">${e.nombre}</option>`);
        $("#selEspecialidad").html(opciones.join(""));
        if (callback) callback();
    });
}

// Obtiene el estilista por ID y llena los campos del formulario
function getEstilistaById(id) {
    $.ajax({
        url: `${urlCompleta}/${id}`,
        method: "GET",
        success: function (res) {
            $("#inpNombre").val(res.nombre);
            $("#selEspecialidad").val(res.especialidadId);
            $("#inpTelefono").val(res.telefono);
            $("#inpEmail").val(res.email);
            $("#chkActivo").prop("checked", res.activo);
        },
        error: function (error) {
            console.error("Error al obtener el estilista:", error);
        }
    });
}