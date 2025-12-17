// Configuración de la API
const API_BASE_URL = 'http://localhost:8000/api';

const API_ENDPOINTS = {
    auth: {
        login: `${API_BASE_URL}/auth/login/`,
        register: `${API_BASE_URL}/auth/register/`
    },
    donaciones: {
        create: `${API_BASE_URL}/donaciones/`,
        list: `${API_BASE_URL}/donaciones/`,
        detail: (id) => `${API_BASE_URL}/donaciones/${id}/`
    },
    compras: {
        comprar: `${API_BASE_URL}/compras/comprar/`
    },
    eventos: {
        list: `${API_BASE_URL}/eventos/list/`,
        create: `${API_BASE_URL}/eventos/create/`,
        retrieve: (id) => `${API_BASE_URL}/eventos/retrieve/${id}/`,
        delete: (id) => `${API_BASE_URL}/eventos/delete/${id}/`
    },
    notificaciones: {
        enviar: `${API_BASE_URL}/notificaciones/enviar/`,
        enviadas: (userId) => `${API_BASE_URL}/notificaciones/enviadas/${userId}/`,
        recibidas: (userId) => `${API_BASE_URL}/notificaciones/recibidas/${userId}/`
    }
};

// Función helper para hacer peticiones
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Añadir token si existe
    const token = localStorage.getItem('authToken');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, mergedOptions);
        const data = await response.json();
        
        if (!response.ok) {
            throw { status: response.status, data };
        }
        
        return data;
    } catch (error) {
        if (error.status) {
            throw error;
        }
        throw { status: 0, data: { error: 'Error de conexión con el servidor' } };
    }
}

// Guardar datos de sesión
function saveSession(userData) {
    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('userId', userData.user_id);
    localStorage.setItem('userEmail', userData.email);
}

// Limpiar sesión
function clearSession() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
}

// Verificar si hay sesión activa
function isLoggedIn() {
    return !!localStorage.getItem('authToken');
}

// Obtener datos del usuario actual
function getCurrentUser() {
    return {
        token: localStorage.getItem('authToken'),
        userId: localStorage.getItem('userId'),
        email: localStorage.getItem('userEmail')
    };
}
