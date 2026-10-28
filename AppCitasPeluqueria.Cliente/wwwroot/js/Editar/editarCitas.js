const urlCompleta = window.apiSettings.baseUrl + window.apiSettings.endpointCita;
const urlClientes = window.apiSettings.baseUrl + window.apiSettings.endpointCliente;
const urlEstilistas = window.apiSettings.baseUrl + window.apiSettings.endpointEstilista;
const citaId = window.apiSettings.citaId;

let fechaCreacion;

// Flatpickr para el campo de fecha y hora
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
    getCitaById(citaId);

    $("#formCita").on("submit", function (e) {
        e.preventDefault();
        const $form = $(this);
        limpiarErrores($form);

        const clienteId = Number($("#selCliente").val());
        const estilistaId = Number($("#selEstilista").val());
        const fecha = $("#Fecha").val();
        const hora = $("#Hora").val();
        const estado = Number($("#selEstado").val());

        if (!clienteId) marcarError($("#selCliente"), "Selecciona un cliente.");
        if (!estilistaId) marcarError($("#selEstilista"), "Selecciona un estilista.");
        if (!fecha) marcarError($(pickerFecha.altInput), "La fecha es obligatoria.");
        if (!hora) marcarError($("#Hora"), "La hora es obligatoria.");
        if (erroresForm.length) { mostrarErrores($form); return; }

        $.get(urlCompleta).done(function (citas) {
            const conflicto = (citas || []).find(c =>
                String(c.citaId) !== String(citaId) &&
                c.estilistaId === estilistaId &&
                String(c.fechaCita).slice(0, 10) === fecha &&
                String(c.horaCita).slice(0, 5) === hora.slice(0, 5) &&
                c.estado !== 3
            );

            if (conflicto && estado !== 3) {
                marcarError($("#selEstilista"), "Ese estilista ya tiene una cita en esa fecha y hora.");
                mostrarErrores($form);
                return;
            }

            const cita = {
                citaId: citaId,
                clienteId: clienteId,
                estilistaId: estilistaId,
                fechaCita: fecha,
                horaCita: hora,
                notas: $("#txtNotas").val(),
                estado: estado,
                fechaCreacion: fechaCreacion
            };

            $.ajax({
                url: `${urlCompleta}/${citaId}`,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(cita),
                beforeSend: function () { limpiarErrores($("#formEstilista")); },
                success: function () {
                    window.location.href = '/Citas';
                },
                error: function (error) {
                    console.error("Error al actualizar:", error);
                    mostrarErrorAPI(error);
                }
            });
        });
    });
});

function getCitaById(id) {
    $.ajax({
        url: `${urlCompleta}/${id}`,
        method: "GET",
        success: function (res) {
            fechaCreacion = res.fechaCreacion;

            cargarSelects(res);

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

function cargarSelects(cita) {
    $.when($.get(urlClientes), $.get(urlEstilistas)).done(function (resClientes, resEstilistas) {
        const clientes = resClientes[0];
        const estilistas = resEstilistas[0];

        // Activos, más el que ya tiene asignada la cita 
        const clientesVisibles = clientes.filter(c =>
            c.activo === true || c.clienteId === cita.clienteId
        );
        const estilistasVisibles = estilistas.filter(e =>
            e.activo === true || e.estilistaId === cita.estilistaId
        );

        $("#selCliente").html(
            clientesVisibles.map(c =>
                `<option value="${c.clienteId}">${c.nombre}${c.activo ? '' : ' (inactivo)'}</option>`
            ).join("")
        );
        $("#selEstilista").html(
            estilistasVisibles.map(e =>
                `<option value="${e.estilistaId}">${e.nombre}${e.activo ? '' : ' (inactivo)'}</option>`
            ).join("")
        );

        // Ahora sí existen las opciones, se marca la seleccionada
        $("#selCliente").val(cita.clienteId);
        $("#selEstilista").val(cita.estilistaId);
    });
}

// Función para mostrar errores de la API en el formulario
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

    $('#errorForm')
        .empty()
        .append(mensajes.map(m => $('<div>').text(m)))
        .removeClass('d-none');
}