document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Iniciando sesión...';
    submitBtn.disabled = true;
    
    try {
        const response = await apiRequest(API_ENDPOINTS.auth.login, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (response.success) {
            saveSession(response);
            
            if (remember) {
                localStorage.setItem('rememberUser', 'true');
            }
            
            alert('¡Inicio de sesión exitoso!');
            
            // Redirigir a admin si es el usuario administrador
            if (email === 'rober.garcia.roman@uma.es') {
                window.location.href = 'adminEventsPage.html';
            } else {
                window.location.href = 'eventsPage.html';
            }
        }
    } catch (error) {
        const errorMsg = error.data?.error || 'Error al iniciar sesión';
        alert(errorMsg);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});