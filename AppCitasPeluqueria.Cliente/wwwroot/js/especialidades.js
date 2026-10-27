const urlCompleta = window.apiSettings.baseUrl + window.apiSettings.endpointEspecialidad;

$(document).ready(function () {
    getEspecialidades();

    //Se hace el post yse valida que no haya duplicados en el nombre de la especialidad
    $("#formEspecialidad").on("submit", function (e) {
        e.preventDefault();
        limpiarErrores($(this));

        const nombre = $("#inpNombre").val().trim();

        if (!nombre) {
            marcarError($("#inpNombre"), "El campo nombre es obligatorio");
            mostrarErrores($(this));
            return;
        }

        $.get(urlCompleta).done(function (lista) {
            const dup = buscarDuplicado(lista, { nombre }, ["nombre"], "especialidadId", null);
            if (dup) {
                marcarError($("#inpNombre"), "Ya existe una especialidad con ese nombre.");
                mostrarErrores($("#formEspecialidad"));
                return;
            }

            const especialidad = {
                nombre: nombre,
                activo: $("#chkActivo").is(":checked")
            };

            $.ajax({
                url: urlCompleta,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(especialidad),
                success: function () {
                    $("#formEspecialidad")[0].reset();
                    bootstrap.Offcanvas.getOrCreateInstance($("#offcanvasEspecialidad")[0]).hide();
                    getEspecialidades();
                },
                error: function (error) {
                    console.error("Error al crear:", error);
                }
            });
        });
    });
});

function getEspecialidades() {
    $.ajax({
        url: urlCompleta,
        method: "GET",
        success: function (res) {
            let filas = "";

            if (res && res.length > 0) {
                $.each(res, function (index, item) {
                    filas += `<tr>
                        <td>${item.nombre}</td>
                        <td>${item.activo ? 'Sí' : 'No'}</td>
                        <td class="text-truncate">${item.fechaCreacion}</td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-primary me-1" onclick="editarEspecialidad(${item.especialidadId})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="eliminarEspecialidad(${item.especialidadId})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>`;
                });
            } else {
                filas = `<tr><td colspan="4" class="text-center text-muted py-4">No hay especialidades registradas.</td></tr>`;
            }

            $("#tablaEspecialidades").html(filas);
            $("#contadorEspecialidades").text(res.length || 0);
        },
        error: function (error) {
            console.error("Error al obtener las especialidades:", error);
            $("#tablaEspecialidades").html(`<tr><td colspan="4" class="text-center text-danger py-4">Error al cargar los datos.</td></tr>`);
        }
    });
}

function editarEspecialidad(id) {
    window.location.href = "/Especialidades/Editar/" + id;
}

function eliminarEspecialidad(id) {
    if (!confirm("¿Seguro que desea eliminar esta especialidad?")) return;

    $.ajax({
        url: urlCompleta + "/" + id,
        type: "DELETE",
        success: function () {
            getEspecialidades();
        },
        error: function (error) {
            const msg = error.responseJSON?.mensaje || "Error al eliminar.";
            alert(msg);
            console.error("Error al eliminar la especialidad:", msg);
        }
    });
}