document.addEventListener('DOMContentLoaded', () => {
    const btnSubmit = document.querySelector('.btn-submit');
    const inputTitle = document.querySelector('.input-title');
    const inputBody = document.querySelector('.input-body');
    const inputEvento = document.querySelector('.input-small');
    
    if (!btnSubmit) return;

    btnSubmit.addEventListener('click', async (e) => {
        e.preventDefault();

        const asunto = inputTitle?.value.trim();
        const cuerpo = inputBody?.value.trim();

        // Validación básica
        if (!asunto) {
            alert('Por favor, introduce el asunto de la notificación');
            return;
        }
        if (!cuerpo) {
            alert('Por favor, introduce el cuerpo de la notificación');
            return;
        }

        // Obtener el usuario actual (emisor)
        const currentUser = getCurrentUser();
        if (!currentUser.userId) {
            alert('Debes iniciar sesión para enviar notificaciones');
            window.location.href = 'login.html';
            return;
        }

        const originalText = btnSubmit.innerHTML;
        btnSubmit.innerHTML = 'Enviando...';
        btnSubmit.disabled = true;

        try {
            const response = await apiRequest(API_ENDPOINTS.notificaciones.enviar, {
                method: 'POST',
                body: JSON.stringify({
                    asunto: asunto,
                    cuerpo: cuerpo,
                    usuario_emisor_id: currentUser.userId,
                    usuarios_receptores_ids: [currentUser.userId],
                    tipo: 'general'
                })
            });

            if (response.success) {
                alert('¡Notificación enviada correctamente!');
                window.location.href = 'adminEventsPage.html';
            }
        } catch (error) {
            const errorMsg = error.data?.error || 'Error al enviar la notificación';
            alert(errorMsg);
        } finally {
            btnSubmit.innerHTML = originalText;
            btnSubmit.disabled = false;
        }
    });
});
