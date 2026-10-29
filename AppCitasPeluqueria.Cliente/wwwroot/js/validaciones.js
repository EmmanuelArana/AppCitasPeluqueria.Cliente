let erroresForm = [];
let timerError;

function marcarError($campo, mensaje) {
    clearTimeout(timerError);

    const $form = $campo.closest("form");

    $campo.addClass("is-invalid");
    erroresForm.push(mensaje);

    $form.find("#errorForm")
        .removeClass("d-none")
        .html(erroresForm.map(m => `<div>${m}</div>`).join(""));

    timerError = setTimeout(() => limpiarErrores($form), 4000);
}

function limpiarErrores($form) {
    clearTimeout(timerError);
    erroresForm = [];
    $form.find(".is-invalid").removeClass("is-invalid");
    $form.find("#errorForm").addClass("d-none").empty();
}

function mostrarErrores($form) {
    if (erroresForm.length === 0) return;
    $form.find("#errorForm")
        .removeClass("d-none")
        .html(erroresForm.map(m => `<div>${m}</div>`).join(""));
}
function normalizar(texto) {
    return String(texto ?? "")
        .trim()
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Busca un duplicado en la lista según los campos indicados.
function buscarDuplicado(lista, valores, campos, idCampo, idActual) {
    return (lista || []).find(x =>
        campos.every(c => normalizar(x[c]) === normalizar(valores[c])) &&
        String(x[idCampo]) !== String(idActual ?? "")
    );
}

// Limpia el error apenas el usuario escribe o cambia el campo
$(document).on("input change", ".is-invalid", function () {
    $(this).removeClass("is-invalid");
});