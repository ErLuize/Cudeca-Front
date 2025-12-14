const form = document.getElementById('registerForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmError = document.getElementById('confirmError');

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function hideError(input, errorElement) {
    input.classList.remove('error');
    errorElement.classList.remove('show');
}

emailInput.addEventListener('blur', function() {
    if (this.value && !validateEmail(this.value)) {
        showError(this, emailError, 'Por favor, introduce un correo válido');
    } else {
        hideError(this, emailError);
    }
});

passwordInput.addEventListener('blur', function() {
    if (this.value && this.value.length < 6) {
        showError(this, passwordError, 'La contraseña debe tener al menos 6 caracteres');
    } else {
        hideError(this, passwordError);
    }
});

confirmPasswordInput.addEventListener('input', function() {
    if (this.value && this.value !== passwordInput.value) {
        showError(this, confirmError, 'Las contraseñas no coinciden');
    } else {
        hideError(this, confirmError);
    }
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;

    if (!validateEmail(emailInput.value)) {
        showError(emailInput, emailError, 'Por favor, introduce un correo válido');
        isValid = false;
    } else {
        hideError(emailInput, emailError);
    }

    if (passwordInput.value.length < 6) {
        showError(passwordInput, passwordError, 'La contraseña debe tener al menos 6 caracteres');
        isValid = false;
    } else {
        hideError(passwordInput, passwordError);
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
        showError(confirmPasswordInput, confirmError, 'Las contraseñas no coinciden');
        isValid = false;
    } else {
        hideError(confirmPasswordInput, confirmError);
    }

    if (isValid) {
        const email = emailInput.value;
        const remember = document.getElementById('remember').checked;
        
        console.log('Registro exitoso:', { email, remember });
        alert('¡Registro completado con éxito! (Esta es una demo sin backend)');
        
        form.reset();
    }
});