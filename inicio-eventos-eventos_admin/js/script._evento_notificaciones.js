/**
 * script.js
 * Lógica compartida para las vistas de Evento y Notificaciones.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Manejo del botón "Volver"
    const btnBack = document.getElementById('btnBack');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            // Intenta volver atrás en el historial
            if (window.history.length > 1) {
                window.history.back();
            } else {
                console.log("No hay historial anterior para volver.");
            }
        });
    }

    // 2. Efecto visual simple en todos los botones primarios
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.95)';
        });
        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'scale(1)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
    });

    // 3. Lógica para el selector de imagen (Solo en la página de Evento)
    const imageSelector = document.getElementById('imageSelector');
    if (imageSelector) {
        imageSelector.addEventListener('click', () => {
            // Aquí iría la lógica real de subida de archivos (input type file oculto, etc.)
            alert('Funcionalidad de selección de imagen: abriría el explorador de archivos.');
            console.log("Selector de imagen clickeado");
        });
    }

    // 4. Lógica de Calendario (Placeholder)
    const calendarDays = document.querySelectorAll('.calendar-grid span');
    calendarDays.forEach(day => {
        // Ignoramos celdas vacías
        if (day.innerText.trim() !== '') {
            day.style.cursor = 'pointer';
            day.addEventListener('click', function() {
                // Remover clase activa de otros días
                document.querySelectorAll('.day-active').forEach(d => d.classList.remove('day-active'));
                // Añadir a este
                this.classList.add('day-active');
            });
        }
    });
});