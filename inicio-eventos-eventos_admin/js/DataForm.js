document.addEventListener("DOMContentLoaded", () => {
  const btnTerminar = document.querySelector(".btn-terminar");
  const checkbox = document.getElementById("terms");

  // Inputs del formulario de datos
  const inputs = document.querySelectorAll(".form-input, .date-box");

  if (!btnTerminar || !checkbox) return;

  // Guardar placeholder original + quitar error al escribir
  inputs.forEach((input) => {
    if (!input.dataset.originalPlaceholder) {
      input.dataset.originalPlaceholder = input.placeholder || "";
    }

    input.addEventListener("input", () => {
      if (input.classList.contains("has-error")) {
        input.classList.remove("has-error");
        input.placeholder = input.dataset.originalPlaceholder;
      }
    });
  });

  btnTerminar.addEventListener("click", (e) => {
    e.preventDefault();

    let formIsValid = true;

    // Validar campos vacíos
    inputs.forEach((input) => {
      if (!input.value.trim()) {
        formIsValid = false;
        input.classList.add("has-error");
        input.placeholder = "Campo incompleto";
      }
    });

    if (!formIsValid) return;

    // Validar checkbox
    if (!checkbox.checked) {
      alert("Por favor, acepta las condiciones de uso para continuar.");
      return;
    }

    alert("Gracias por enviar tus datos. Nos pondremos en contacto contigo.");
  });
});
