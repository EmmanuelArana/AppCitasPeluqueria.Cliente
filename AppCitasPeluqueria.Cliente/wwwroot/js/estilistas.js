const urlCompleta = window.apiSettings.baseUrl + window.apiSettings.endpointEstilista;
const urlEspecialidades = window.apiSettings.baseUrl + window.apiSettings.endpointEspecialidad;

$(document).ready(function () {
    // Cargar datos iniciales y llenar el select de especialidades
    cargarEspecialidadesSelect();
    getEstilistas();

    $("#formEstilista").on("submit", function (e) {
        e.preventDefault();

        const estilista = {
            nombre: $("#inpNombre").val(),
            especialidadId: parseInt($("#selectEspecialidad").val()) || 0,
            telefono: $("#inpTelefono").val(),
            email: $("#inpEmail").val(),
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

// Función para llenar el desplegable <select> de especialidades en el formulario
function cargarEspecialidadesSelect() {
    $.get(urlEspecialidades)
        .done(function (especialidades) {
            let opciones = '<option value="">Seleccione una especialidad...</option>';
            if (especialidades && especialidades.length > 0) {
                especialidades.forEach(e => {
                    opciones += `<option value="${e.especialidadId}">${e.nombre}</option>`;
                });
            }
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