//Variable global para limpiar el error del servidor
let timerErrorServer;

//Mostrar errores que envia el servidor via API
function mostrarErrorAPI(error) {
    const r = error.responseJSON;
    let mensajes = [];

    if (error.status === 0) {                       // Error de red
        mensajes = ['No se pudo conectar con el servidor.'];
    } else if (error.status === 404) {              // No existe el registro
        mensajes = [r?.mensaje || 'El registro no existe.'];
    } else if (r?.errors) {                         // Validaciones de modelo
        mensajes = Object.values(r.errors).flat();
    } else if (r?.mensaje) {                        // Reglas de negocio de la API
        mensajes = [r.mensaje];
    } else {
        mensajes = ['Ocurrió un error inesperado.'];
    }

    clearTimeout(timerErrorServer);
    $('#errorServer')
        .empty()
        .append(mensajes.map(m => $('<div>').text(m)))
        .addClass('alert alert-danger')
        .removeClass('d-none');

    timerErrorServer = setTimeout(limpiarErrorServer, 3000);
}

// Limpia el error del servidor
function limpiarErrorServer() {
    clearTimeout(timerErrorServer);
    $("#errorServer")
        .addClass("d-none")
        .removeClass("alert alert-danger")
        .empty();
}

// Botón cancelar global 
$(document).on('click', '#btnFormCancelar', function () {
    const $form = $(this).closest('form');
    $form[0].reset();
    $form.find("input[type='hidden']:not([name='__RequestVerificationToken'])").val('');
    limpiarErrores($form);
    limpiarErrorServer();
});