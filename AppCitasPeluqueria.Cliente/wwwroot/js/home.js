const urlCitas = window.apiSettings.baseUrl + window.apiSettings.endpointCita;
const urlClientes = window.apiSettings.baseUrl + window.apiSettings.endpointCliente;
const urlEstilistas = window.apiSettings.baseUrl + window.apiSettings.endpointEstilista;
const urlEspecialidades = window.apiSettings.baseUrl + window.apiSettings.endpointEspecialidad;

$(document).ready(function () {
    if ($("#dashFecha").length) {
        $("#dashFecha").text(
            new Date().toLocaleDateString("es-CR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
        );
    }
    cargarResumen();

    $("#btnRefrescar").on("click", cargarResumen);
});

function cargarResumen() {
    $.when($.get(urlCitas), $.get(urlClientes), $.get(urlEstilistas), $.get(urlEspecialidades))
        .done(function (resCitas, resClientes, resEstilistas, resEspecialidades) {
            const citas = resCitas[0];
            const clientes = resClientes[0];
            const estilistas = resEstilistas[0];
            const especialidades = resEspecialidades[0];

            // 1. Estadísticas de Citas 
            const totalCitas = citas.length;
            const pendientesTotales = citas.filter(c => c.estado === 1 || c.pendiente === true).length;

            $("#statCitasTotales").text(totalCitas);
            $("#statCitasTotalesDetalle").text(`${pendientesTotales} pendientes`);

            // 2. Clientes
            $("#statClientes").text(clientes.length);
            $("#statClientesDetalle").text(`${clientes.filter(c => c.activo).length} activos`);

            // 3. Estilistas
            $("#statEstilistas").text(estilistas.length);
            $("#statEstilistasDetalle").text(`${estilistas.filter(e => e.activo).length} activos`);

            // 4. Especialidades
            $("#statEspecialidades").text(especialidades.length);
            $("#statEspecialidadesDetalle").text(`${especialidades.filter(e => e.activo).length} activas`);

        })
        .fail(function (error) {
            console.error("Error al cargar el resumen:", error);
        });
}


