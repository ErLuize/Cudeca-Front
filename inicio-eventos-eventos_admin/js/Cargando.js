// Simulación de carga que redirige después de 3 segundos
setTimeout(function() {
    console.log('Carga completada - Aquí se redirigiría a la página principal');
    // window.location.href = '/dashboard'; // Descomenta para redirección real
}, 3000);

// Función opcional para cambiar entre spinners
function toggleSpinner() {
    const spinner = document.querySelector('.spinner');
    const spinnerDots = document.querySelector('.spinner-dots');
    
    if (spinner.style.display === 'none') {
        spinner.style.display = 'block';
        spinnerDots.style.display = 'none';
    } else {
        spinner.style.display = 'none';
        spinnerDots.style.display = 'block';
    }
}