const urlCompleta = window.apiSettings.baseUrl + window.apiSettings.endpointCita;
const urlClientes = window.apiSettings.baseUrl + window.apiSettings.endpointCliente;
const urlEstilistas = window.apiSettings.baseUrl + window.apiSettings.endpointEstilista;
const citaId = window.apiSettings.citaId;

let fechaCreacion;

// Sin minDate dado que al editar, la cita puede ser de una fecha pasada
const pickerFecha = flatpickr("#Fecha", {
    locale: "es",
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "d/m/Y",
    allowInput: false
});

const pickerHora = flatpickr("#Hora", {
    locale: "es",
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    minuteIncrement: 5,
    allowInput: false
});

$(document).ready(function () {
    $("#selEstado").html(`
        <option value="1">Pendiente</option>
        <option value="2">Confirmada</option>
        <option value="3">Cancelada</option>
    `);

    // Primero se llenan los select del fomulario
    $.when($.get(urlClientes), $.get(urlEstilistas)).done(function (resClientes, resEstilistas) {
        $("#selCliente").html(resClientes[0].map(c => `<option value="${c.clienteId}">${c.nombre}</option>`).join(""));
        $("#selEstilista").html(resEstilistas[0].map(e => `<option value="${e.estilistaId}">${e.nombre}</option>`).join(""));

        getCitaById(citaId);
    });

    $("#formCita").on("submit", function (e) {
        e.preventDefault();

        const cita = {
            citaId: citaId,
            clienteId: Number($("#selCliente").val()),
            estilistaId: Number($("#selEstilista").val()),
            fechaCita: $("#Fecha").val(),
            horaCita: $("#Hora").val(),
            notas: $("#txtNotas").val(),
            estado: Number($("#selEstado").val()),
            fechaCreacion: fechaCreacion
        };

        $.ajax({
            url: `${urlCompleta}/${citaId}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(cita),
            success: function () {
                window.location.href = '/Citas';
            },
            error: function (error) {
                console.error("Error al actualizar:", error);
            }
        });
    });
});

function getCitaById(id) {
    $.ajax({
        url: `${urlCompleta}/${id}`,
        method: "GET",
        success: function (res) {
            fechaCreacion = res.fechaCreacion;

            $("#selCliente").val(res.clienteId);
            $("#selEstilista").val(res.estilistaId);
            $("#selEstado").val(res.estado);
            $("#txtNotas").val(res.notas);
            pickerFecha.setDate(res.fechaCita);
            pickerHora.setDate(res.horaCita);
        },
        error: function (error) {
            console.error("Error al obtener la cita:", error);
        }
    });
}