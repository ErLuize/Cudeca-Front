let dateFilterActive = false;
let startDateFilter = null;
let endDateFilter = null;
let selectedEventId = null;

function openModal() {
    document.getElementById('dateModal').style.display = 'block';

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedToday = `${year}-${month}-${day}`;

    const future = new Date(today);
    future.setMonth(future.getMonth() + 2);
    const futureYear = future.getFullYear();
    const futureMonth = String(future.getMonth() + 1).padStart(2, '0');
    const futureDay = String(future.getDate()).padStart(2, '0');
    const formattedFuture = `${futureYear}-${futureMonth}-${futureDay}`;

    document.getElementById('startDate').value = formattedToday;
    document.getElementById('endDate').value = formattedFuture;
}

function closeModal() {
    document.getElementById('dateModal').style.display = 'none';
}

function buyTickets() {
    if (selectedEventId) {
        sessionStorage.setItem('selectedEventId', selectedEventId);
        window.location.href = `payment.html?evento=${selectedEventId}`;
    } else {
        window.location.href = 'payment.html';
    }
}

window.onclick = function(event) {
    const dateModal = document.getElementById('dateModal');
    const movieModal = document.getElementById('movieModal');
    if (event.target == dateModal) closeModal();
    if (event.target == movieModal) closeMovieModal();
}

function applyDateFilter() {
    const startDateInput = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate').value;

    if (!startDateInput || !endDateInput) {
        alert('Por favor selecciona ambas fechas');
        return;
    }

    const [sy, sm, sd] = startDateInput.split('-');
    const [ey, em, ed] = endDateInput.split('-');
    startDateFilter = new Date(sy, sm - 1, sd);
    endDateFilter = new Date(ey, em - 1, ed);

    if (startDateFilter > endDateFilter) {
        alert('La fecha de inicio debe ser anterior a la fecha de fin');
        return;
    }

    dateFilterActive = true;

    const cards = document.getElementsByClassName('event-card');
    let visibleCount = 0;

    Array.from(cards).forEach(card => {
        const [ey, em, ed] = card.dataset.date.split('-');
        const eventDate = new Date(ey, em - 1, ed);

        if (eventDate.getTime() >= startDateFilter.getTime() &&
            eventDate.getTime() <= endDateFilter.getTime()) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    const filterText = document.getElementById('filterText');
    const activeFilter = document.getElementById('activeFilter');
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    filterText.textContent = `Mostrando ${visibleCount} eventos desde ${startDateFilter.toLocaleDateString('es-ES', options)} hasta ${endDateFilter.toLocaleDateString('es-ES', options)}`;
    activeFilter.style.display = 'flex';

    closeModal();
    filterByTitle();
}

function clearDateFilter() {
    dateFilterActive = false;
    startDateFilter = null;
    endDateFilter = null;

    const cards = document.getElementsByClassName('event-card');
    Array.from(cards).forEach(card => card.style.display = '');
    document.getElementById('activeFilter').style.display = 'none';

    filterByTitle();
}

function filterByTitle() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.getElementsByClassName('event-card');

    Array.from(cards).forEach(card => {
        const title = card.dataset.title.toLowerCase();
        const [ey, em, ed] = card.dataset.date.split('-');
        const eventDate = new Date(ey, em - 1, ed);

        const matchesTitle = title.includes(input);
        let matchesDate = true;

        if (dateFilterActive) {
            matchesDate = eventDate.getTime() >= startDateFilter.getTime() &&
                          eventDate.getTime() <= endDateFilter.getTime();
        }

        card.style.display = (matchesTitle && matchesDate) ? '' : 'none';
    });
}

function openMovieModal(card) {
    const title = card.dataset.title;
    const date = card.dataset.date;
    const time = card.dataset.time;
    const description = card.dataset.description;
    const trailer = card.dataset.trailer;
    const genre = card.dataset.genre;
    const duration = card.dataset.duration;
    const director = card.dataset.director;
    
    // Guardar el id del evento seleccionado
    selectedEventId = card.dataset.id || null;

    const [year, month, day] = date.split('-');
    const eventDate = new Date(year, month - 1, day);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = eventDate.toLocaleDateString('es-ES', options);

    document.getElementById('modalMovieTitle').textContent = title;
    document.getElementById('modalMovieDateTime').textContent = `${formattedDate} - ${time}`;
    document.getElementById('modalDescription').textContent = description;
    document.getElementById('modalGenre').textContent = genre;
    document.getElementById('modalDuration').textContent = duration;
    document.getElementById('modalDirector').textContent = director;
    
    // Solo mostrar trailer si existe y no está vacío
    const trailerContainer = document.getElementById('modalTrailer');
    if (trailer && trailer.trim() !== '') {
        const embedUrl = `${trailer}?autoplay=0&rel=0&modestbranding=1`;
        trailerContainer.innerHTML = `<iframe src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        trailerContainer.style.display = 'block';
    } else {
        trailerContainer.innerHTML = '';
        trailerContainer.style.display = 'none';
    }
    
    document.getElementById('movieModal').style.display = 'block';
}

function closeMovieModal() {
    document.getElementById('movieModal').style.display = 'none';
    document.getElementById('modalTrailer').innerHTML = '';
}

// Función para cargar eventos desde el backend en sección separada
async function loadEventsFromAPI() {
    try {
        const response = await apiRequest(API_ENDPOINTS.eventos.list, { method: 'GET' });
        
        if (response && response.data && response.data.length > 0) {
            const apiSection = document.getElementById('apiEventsSection');
            const apiEventsGrid = document.getElementById('apiEventsGrid');
            
            apiSection.style.display = 'block';
            apiEventsGrid.innerHTML = '';
            
            response.data.forEach(evento => {
                // Parsear fecha y hora del formato "2025-12-31 21:00:00"
                let fechaStr = '';
                let horaStr = '19:00';
                if (evento.fecha) {
                    const partes = evento.fecha.split(' ');
                    fechaStr = partes[0] || '';
                    if (partes[1]) {
                        horaStr = partes[1].substring(0, 5); // "21:00:00" -> "21:00"
                    }
                }
                
                const card = document.createElement('div');
                card.className = 'event-card';
                card.dataset.id = evento.id_evento || '';
                card.dataset.title = evento.nombre || '';
                card.dataset.date = fechaStr;
                card.dataset.time = horaStr;
                card.dataset.description = evento.descripcion || '';
                card.dataset.trailer = evento.trailer || '';
                card.dataset.genre = evento.tipo_evento || '';
                card.dataset.duration = evento.duracion || '';
                card.dataset.director = evento.director || '';
                card.dataset.location = evento.ubicacion || '';
                
                card.innerHTML = `
                    <img src="${evento.imagen || 'img/eventos/default.jpg'}" alt="${evento.nombre}" class="event-image">
                    <div class="event-info">
                        <div class="event-title">${evento.nombre}</div>
                        <div class="event-date">${formatEventDate(fechaStr, horaStr)}</div>
                    </div>
                `;
                
                card.addEventListener('click', () => openMovieModal(card));
                apiEventsGrid.appendChild(card);
            });
        }
    } catch (error) {
        console.log('Backend no disponible, mostrando solo eventos estáticos');
    }
}

function formatEventDate(dateStr, timeStr) {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    const options = { day: 'numeric', month: 'long' };
    return `${date.toLocaleDateString('es-ES', options)}, ${timeStr || ''}`;
}

// Event listeners
document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('click', () => {
        openMovieModal(card);
    });
});

// Intentar cargar eventos del backend al iniciar (si falla, usa los estáticos del HTML)
document.addEventListener('DOMContentLoaded', () => {
    if (typeof apiRequest !== 'undefined' && typeof API_ENDPOINTS !== 'undefined') {
        loadEventsFromAPI();
    }
});