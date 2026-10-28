// Se define la constante de la ruta de la API
const urlCompleta = window.apiSettings.baseUrl + window.apiSettings.endpointCliente;

$(document).ready(function () {
    getClientes();

    $("#formCliente").on("submit", function (e) {
        e.preventDefault();
        limpiarErrores($(this));

        const nombre = $("#inpNombre").val().trim();
        const telefono = $("#inpTelefono").val().trim();
        const email = $("#inpEmail").val().trim();
        let valido = true;

        if (!nombre) { marcarError($("#inpNombre"), "El nombre es obligatorio."); valido = false; }
        if (!telefono) { marcarError($("#inpTelefono"), "El teléfono es obligatorio."); valido = false; }
        if (!email) {
            marcarError($("#inpEmail"), "El email es obligatorio.");
            valido = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            marcarError($("#inpEmail"), "El email no tiene un formato válido.");
            valido = false;
        }
        if (!valido) return;

        $.get(urlCompleta).done(function (lista) {
            let hayDuplicado = false;

            if (buscarDuplicado(lista, { email }, ["email"], "clienteId", null)) {
                marcarError($("#inpEmail"), "Ya existe un cliente con ese email.");
                hayDuplicado = true;
            }
            if (buscarDuplicado(lista, { telefono }, ["telefono"], "clienteId", null)) {
                marcarError($("#inpTelefono"), "Ya existe un cliente con ese teléfono.");
                hayDuplicado = true;
            }
            if (hayDuplicado) return;

            const cliente = {
                nombre: nombre,
                telefono: telefono,
                email: email,
                activo: $("#chkActivo").is(":checked")
            };

            $.ajax({
                url: urlCompleta,
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(cliente),
                beforeSend: function () { limpiarErrores($("#formCliente")); },
                success: function () {
                    $("#formCliente")[0].reset();
                    bootstrap.Offcanvas.getOrCreateInstance($("#offcanvasCliente")[0]).hide();
                    getClientes();
                },
                error: function (error) {
                    console.error("Error al crear:", error);
                    mostrarErrorAPI(error);
                }
            });
        });
    });
});

// Carga la lista de clientes y actualiza la tabla
function getClientes() {
    $.ajax({
        url: urlCompleta,
        method: "GET",
        success: function (res) {
            let filas = "";

            if (res && res.length > 0) {
                $.each(res, function (index, item) {
                    filas += `<tr>
                        <td class="text-truncate">${item.nombre}</td>
                        <td class="text-truncate">${item.telefono}</td>
                        <td class="text-truncate">${item.email}</td>
                        <td>${item.activo ? 'Sí' : 'No'}</td>
                        <td class="text-truncate">${item.fechaCreacion || 'N/D'}</td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-primary me-1" onclick="editarCliente(${item.clienteId})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="eliminarCliente(${item.clienteId})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    </tr>`;
                });
            } else {
                filas = `<tr><td colspan="6" class="text-center text-muted py-4">No hay clientes registrados.</td></tr>`;
            }

            $("#tablaClientes").html(filas);
            $("#contadorClientes").text(res.length || 0);
        },
        error: function (error) {
            console.error("Error al obtener los clientes:", error);
            $("#tablaClientes").html(`<tr><td colspan="6" class="text-center text-danger py-4">Error al cargar los datos.</td></tr>`);
        }
    });
}

// Redirige a la página de editar
function editarCliente(id) {
    window.location.href = "/Clientes/Editar/" + id;
}

// Elimina el cliente
function eliminarCliente(id) {
    if (!confirm("¿Seguro que desea eliminar este cliente?")) return;

    $.ajax({
        url: urlCompleta + "/" + id,
        type: "DELETE",
        success: function () {
            limpiarErrorServer();
            getClientes();
        },
        error: function (error) {
            const msg = error.responseJSON?.mensaje || "Error al eliminar.";
            console.error("Error al eliminar el cliente:", msg);
            mostrarErrorAPI(error);
        }
    });
}

//Mostrar errores que envia el servidor via API
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

    $('#errorServer')
        .empty()
        .append(mensajes.map(m => $('<div>').text(m)))
        .removeClass('d-none');
}