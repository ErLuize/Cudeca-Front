// Seleccionamos el botón y el checkbox
const btnTerminar = document.querySelector('.btn-terminar');
const checkbox = document.getElementById('terms');

// Añadimos el evento al hacer click en "Terminar"
btnTerminar.addEventListener('click', () => {
    if (checkbox.checked) {
        alert('Gracias por enviar tus datos. Nos pondremos en contacto contigo.');
    } else {
        alert('Por favor, acepta las condiciones de uso para continuar.');
    }
});