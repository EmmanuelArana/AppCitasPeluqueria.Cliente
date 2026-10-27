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

        const estilista = {
            estilistaId: estilistaId,
            nombre: $("#inpNombre").val(),
            especialidadId: Number($("#selEspecialidad").val()),
            telefono: $("#inpTelefono").val(),
            email: $("#inpEmail").val(),
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

// Llena el select y luego ejecuta el callback
function cargarEspecialidades(callback) {
    $.get(urlEspecialidades, function (res) {
        const opciones = res.map(e => `<option value="${e.especialidadId}">${e.nombre}</option>`);
        $("#selEspecialidad").html(opciones.join(""));
        callback();
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