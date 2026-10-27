//Se hace un constante de la ruta de la api
const urlCompleta = window.apiSettings.baseUrl + window.apiSettings.endpointCita;
const urlClientes = window.apiSettings.baseUrl + window.apiSettings.endpointCliente;
const urlEstilistas = window.apiSettings.baseUrl + window.apiSettings.endpointEstilista;

// Nombre de cada estado según su id
const nombreEstado = { 1: "Pendiente", 2: "Confirmada", 3: "Cancelada" };

// Datos en memoria para poder filtrar sin volver a llamar la API
let todasLasCitas = [];
let nombreCliente = {};
let nombreEstilista = {};

// Instancias de flatpickr
let fpFiltro, fpFecha, fpHora;

$(document).ready(function () {
    // Opciones del select de estado 
    $("#selEstado").html(`
        <option value="1" selected>Pendiente</option>
        <option value="2">Confirmada</option>
        <option value="3">Cancelada</option>
    `);

    // Filtro de búsqueda 
    fpFiltro = flatpickr("#filtroFecha", {
        locale: "es",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "d/m/Y",
        allowInput: false
        // , onChange: aplicarFiltro   
    });

    // Campo de FECHA
    fpFecha = flatpickr("#Fecha", {
        locale: "es",
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "d/m/Y",
        minDate: "today",
        allowInput: false
    });

    // Campo de HORA
    fpHora = flatpickr("#Hora", {
        locale: "es",
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        minuteIncrement: 5,
        allowInput: false
    });

    // Botones del filtro
    $("#btnFiltrar").on("click", aplicarFiltro);

    $("#btnLimpiar").on("click", function () {
        fpFiltro.clear();
        renderCitas(todasLasCitas);
    });

    getCitas();

    $("#formCita").on("submit", function (e) {
        e.preventDefault();

        if (!$("#selCliente").val() || !$("#selEstilista").val()) {
            alert("Selecciona un cliente y un estilista.");
            return;
        }

        const cita = {
            clienteId: Number($("#selCliente").val()),
            estilistaId: Number($("#selEstilista").val()),
            fechaCita: $("#Fecha").val(),
            horaCita: $("#Hora").val(),
            estado: Number($("#selEstado").val()),
            notas: $("#txtNotas").val(),
        };

        $.ajax({
            url: urlCompleta,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(cita),
            success: function () {
                $("#formCita")[0].reset();
                fpFecha.clear();
                fpHora.clear();
                bootstrap.Offcanvas.getOrCreateInstance($("#offcanvasCita")[0]).hide();
                getCitas();
            },
            error: function (error) {
                console.error("Error al crear:", error);
            }
        });
    });
});

//Carga los datos de la API y los guarda en memoria
function getCitas() {
    $.when($.get(urlCompleta), $.get(urlClientes), $.get(urlEstilistas))
        .done(function (resCitas, resClientes, resEstilistas) {
            todasLasCitas = resCitas[0];
            const clientes = resClientes[0];
            const estilistas = resEstilistas[0];

            // Diccionarios con TODOS (para mostrar nombres en la tabla de citas)
            nombreCliente = {};
            clientes.forEach(c => nombreCliente[c.clienteId] = c.nombre);

            nombreEstilista = {};
            estilistas.forEach(e => nombreEstilista[e.estilistaId] = e.nombre);

            // Solo los activos para los selects
            const clientesActivos = clientes.filter(c => c.activo === true);
            const estilistasActivos = estilistas.filter(e => e.activo === true);

            $("#selCliente").html(
                `<option value="" selected disabled>Selecciona un cliente</option>` +
                clientesActivos.map(c => `<option value="${c.clienteId}">${c.nombre}</option>`).join("")
            );
            $("#selEstilista").html(
                `<option value="" selected disabled>Selecciona un estilista</option>` +
                estilistasActivos.map(e => `<option value="${e.estilistaId}">${e.nombre}</option>`).join("")
            );

            aplicarFiltro();
        })
        .fail(function (error) {
            console.error("Error al cargar los datos:", error);
            $("#tablaCitas").html(`<tr><td colspan="6" class="text-center text-danger py-4">Error al cargar los datos.</td></tr>`);
        });
}

//Dibuja las filas de la tabla
function renderCitas(citas) {
    let filas = "";

    if (citas && citas.length > 0) {
        $.each(citas, function (index, item) {
            filas += `<tr>
                <td>${nombreCliente[item.clienteId] ?? 'Desconocido'}</td>
                <td>${nombreEstilista[item.estilistaId] ?? 'Desconocido'}</td>
                <td><span class="badge bg-info">${nombreEstado[item.estado] ?? 'Desconocido'}</span></td>
                <td>${item.fechaCita}</td>
                <td>${item.horaCita}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editarCita(${item.citaId})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarCita(${item.citaId})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>`;
        });
    } else {
        filas = `<tr><td colspan="6" class="text-center text-muted py-4">No hay citas registradas.</td></tr>`;
    }

    $("#tablaCitas").html(filas);
    $("#contadorCitas").text(citas ? citas.length : 0);
}

//Filtra las citas por la fecha seleccionada
function aplicarFiltro() {
    const fecha = $("#filtroFecha").val(); 

    if (!fecha) {
        renderCitas(todasLasCitas);
        return;
    }

    
    const filtradas = todasLasCitas.filter(c => (c.fechaCita || "").substring(0, 10) === fecha);
    renderCitas(filtradas);
}

//Redirije a la pagina de editar
function editarCita(id) {
    window.location.href = "/Citas/Editar/" + id;
}

//Elimina la cita
function eliminarCita(id) {
    if (!confirm("¿Seguro que desea eliminar esta cita?")) return;

    $.ajax({
        url: urlCompleta + "/" + id,
        type: "DELETE",
        success: function () {
            console.log("Cita eliminada correctamente.");
            getCitas();
        },
        error: function (error) {
            const msg = error.responseJSON?.mensaje || "Error al eliminar.";
            alert(msg);
            console.error("Error al eliminar la cita:", msg);
        }
    });
}