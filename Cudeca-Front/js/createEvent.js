document.addEventListener('DOMContentLoaded', () => {
    const btnSubmit = document.querySelector('.btn-submit');
    const inputTitle = document.querySelector('.input-title');
    const inputBody = document.querySelector('.input-body');
    const inputLocation = document.querySelector('.input-location');
    const inputsSmall = document.querySelectorAll('.input-small');
    
    let selectedDate = null;
    
    // Capturar fecha seleccionada del calendario
    const calendarDays = document.querySelectorAll('.calendar-grid span');
    calendarDays.forEach(day => {
        if (day.innerText.trim() !== '' && !isNaN(day.innerText.trim())) {
            day.addEventListener('click', function() {
                const dayNum = this.innerText.trim().padStart(2, '0');
                const now = new Date();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                selectedDate = `${year}-${month}-${dayNum} 19:00:00`;
            });
        }
    });

    if (!btnSubmit) return;

    btnSubmit.addEventListener('click', async (e) => {
        e.preventDefault();

        const nombre = inputTitle?.value.trim();
        const descripcion = inputBody?.value.trim();
        const ubicacion = inputLocation?.value.trim();
        const precio = inputsSmall[0]?.value.trim();
        const aforo = inputsSmall[1]?.value.trim();

        // Validación básica
        if (!nombre) {
            alert('Por favor, introduce el nombre del evento');
            return;
        }
        if (!ubicacion) {
            alert('Por favor, introduce la ubicación del evento');
            return;
        }
        if (!selectedDate) {
            alert('Por favor, selecciona una fecha en el calendario');
            return;
        }

        const originalText = btnSubmit.innerHTML;
        btnSubmit.innerHTML = 'Publicando...';
        btnSubmit.disabled = true;

        try {
            const response = await apiRequest(API_ENDPOINTS.eventos.create, {
                method: 'POST',
                body: JSON.stringify({
                    nombre: nombre,
                    tipo_evento: 'Concierto',
                    fecha: selectedDate,
                    ubicacion: ubicacion,
                    descripcion: descripcion || '',
                    aforo: parseInt(aforo) || 100,
                    estado: 'Activo',
                    objetivo_recaudacion: parseFloat(precio) || 0
                })
            });

            if (response.success) {
                alert('¡Evento creado correctamente!');
                window.location.href = 'adminEventsPage.html';
            }
        } catch (error) {
            const errorMsg = error.data?.error || 'Error al crear el evento';
            alert(errorMsg);
        } finally {
            btnSubmit.innerHTML = originalText;
            btnSubmit.disabled = false;
        }
    });
});
