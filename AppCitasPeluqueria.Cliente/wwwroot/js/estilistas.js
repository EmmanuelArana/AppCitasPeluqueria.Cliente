const urlCompleta = window.apiSettings.baseUrl + window.apiSettings.endpointEstilista;
const urlEspecialidades = window.apiSettings.baseUrl + window.apiSettings.endpointEspecialidad;

$(document).ready(function () {
    // Cargar datos iniciales y llenar el select de especialidades
    cargarEspecialidadesSelect();
    getEstilistas();

    $("#formEstilista").on("submit", function (e) {
        e.preventDefault();
        const $form = $(this);
        limpiarErrores($form);

        const nombre = $("#inpNombre").val().trim();
        const especialidadId = parseInt($("#selectEspecialidad").val()) || 0;
        const telefono = $("#inpTelefono").val().trim();
        const email = $("#inpEmail").val().trim();

        if (!nombre) marcarError($("#inpNombre"), "El nombre es obligatorio.");
        if (!especialidadId) marcarError($("#selectEspecialidad"), "Selecciona una especialidad.");
        if (!telefono) marcarError($("#inpTelefono"), "El teléfono es obligatorio.");
        if (!email) {
            marcarError($("#inpEmail"), "El email es obligatorio.");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            marcarError($("#inpEmail"), "El email no tiene un formato válido.");
        }
        if (erroresForm.length) { mostrarErrores($form); return; }

        $.get(urlCompleta).done(function (lista) {
            if (buscarDuplicado(lista, { email }, ["email"], "estilistaId", null))
                marcarError($("#inpEmail"), "Ya existe un estilista con ese email.");
            if (buscarDuplicado(lista, { telefono }, ["telefono"], "estilistaId", null))
                marcarError($("#inpTelefono"), "Ya existe un estilista con ese teléfono.");
            if (erroresForm.length) { mostrarErrores($form); return; }

            const estilista = {
                nombre: nombre,
                especialidadId: especialidadId,
                telefono: telefono,
                email: email,
                activo: $("#chkActivo").is(":checked")
            };

            $.ajax({
                url: urlCompleta,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(estilista),
                success: function () {
                    $("#formEstilista")[0].reset();
                    bootstrap.Offcanvas.getOrCreateInstance($("#offcanvasEstilista")[0]).hide();
                    getEstilistas();
                },
                error: function (error) {
                    console.error("Error al crear:", error);
                    alert("Ocurrió un error al guardar el estilista.");
                }
            });
        });
    });
});

// Función para llenar el desplegable <select> de especialidades en el formulario
function cargarEspecialidadesSelect() {
    $.get(urlEspecialidades)
        .done(function (especialidades) {
            let opciones = '<option value="">Seleccione una especialidad...</option>';

            const activas = (especialidades || []).filter(e => e.activo === true);

            activas.forEach(e => {
                opciones += `<option value="${e.especialidadId}">${e.nombre}</option>`;
            });

            $("#selectEspecialidad").html(opciones);
        })
        .fail(function (error) {
            console.error("Error al cargar las especialidades para el select:", error);
        });
}

function getEstilistas() {
    $.when($.get(urlCompleta), $.get(urlEspecialidades))
        .done(function (resEstilistas, resEspecialidades) {
            const estilistas = resEstilistas[0];
            const especialidades = resEspecialidades[0];

            // Diccionario para mapear especialidadId a nombre de especialidad
            const nombreEsp = {};
            especialidades.forEach(e => nombreEsp[e.especialidadId] = e.nombre);

            let filas = "";

            if (estilistas && estilistas.length > 0) {
                $.each(estilistas, function (index, item) {
                    filas += `<tr>
                        <td>${item.nombre}</td>
                        <td>${nombreEsp[item.especialidadId] ?? 'Sin especialidad'}</td>
                        <td>${item.telefono}</td>
                        <td>${item.email}</td>
                        <td>${item.activo ? 'Sí' : 'No'}</td>
                        <td class="text-truncate">${item.fechaCreacion ? item.fechaCreacion.split('T')[0] : 'N/D'}</td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-primary me-1" onclick="editarEstilista(${item.estilistaId})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="eliminarEstilista(${item.estilistaId})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>`;
                });
            } else {
                filas = `<tr><td colspan="7" class="text-center text-muted py-4">No hay estilistas registrados.</td></tr>`;
            }

            $("#tablaEstilistas").html(filas);
            $("#contadorEstilistas").text(estilistas.length || 0);
        })
        .fail(function (error) {
            console.error("Error al cargar los datos:", error);
            $("#tablaEstilistas").html(`<tr><td colspan="7" class="text-center text-danger py-4">Error al cargar los datos.</td></tr>`);
        });
}

// Redirige a la página de editar
function editarEstilista(id) {
    window.location.href = "/Estilistas/Editar/" + id;
}

// Elimina el estilista
function eliminarEstilista(id) {
    if (!confirm("¿Seguro que desea eliminar este estilista?")) return;

    $.ajax({
        url: urlCompleta + "/" + id,
        type: "DELETE",
        success: function () {
            getEstilistas();
        },
        error: function (error) {
            const msg = error.responseJSON?.mensaje || "Error al eliminar.";
            alert(msg);
            console.error("Error al eliminar el estilista:", msg);
        }
    });
}