// Se define la constante de la ruta de la API
const urlCompleta = window.apiSettings.baseUrl + window.apiSettings.endpointCliente;

$(document).ready(function () {
    getClientes();

    $("#formCliente").on("submit", function (e) {
        e.preventDefault();

        const cliente = {
            nombre: $("#inpNombre").val(),
            telefono: $("#inpTelefono").val(),
            email: $("#inpEmail").val(),
            activo: $("#chkActivo").is(":checked")
        };

        $.ajax({
            url: urlCompleta,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(cliente),
            success: function () {
                // 1. Limpiar formulario
                $("#formCliente")[0].reset();

                // 2. Cerrar el Offcanvas de Bootstrap de forma segura
                const offcanvasEl = document.getElementById("offcanvasCliente");
                const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasEl);
                if (offcanvasInstance) {
                    offcanvasInstance.hide();
                }

                // 3. Recargar la tabla usando el nombre correcto
                getClientes();
            },
            error: function (error) {
                console.error("Error al crear:", error);
                alert("Ocurrió un error al guardar el cliente.");
            }
        });
    });
});

// Función renombrada lógicamente a getClientes (anteriormente getCitas)
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
            console.log("Cliente eliminado correctamente.");
            getClientes();
        },
        error: function (error) {
            const msg = error.responseJSON?.mensaje || "Error al eliminar.";
            alert(msg);
            console.error("Error al eliminar el cliente:", msg);
        }
    });
}