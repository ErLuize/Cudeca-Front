document.addEventListener("DOMContentLoaded", () => {
  const moneyButtons = document.querySelectorAll(".btn-money");
  const otherInput = document.querySelector(".other-input");
  const btnSubmit = document.querySelector(".btn-submit");

  // DEBUG rápido (puedes borrar luego)
  // console.log("moneyButtons:", moneyButtons.length, "otherInput:", !!otherInput, "btnSubmit:", !!btnSubmit);

  // --- Botones dinero: marcar activo y escribir cantidad en el input ---
  moneyButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); // por si acaso

      moneyButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const amount = btn.textContent.replace("€", "").trim();
      if (otherInput) {
        otherInput.value = amount;
        otherInput.classList.remove("has-error");
      }
    });
  });

  // Si escribe a mano, desactiva botones y quita error
  if (otherInput) {
    if (!otherInput.dataset.originalPlaceholder) {
      otherInput.dataset.originalPlaceholder = otherInput.placeholder || "";
    }

    otherInput.addEventListener("input", () => {
      moneyButtons.forEach((b) => b.classList.remove("active"));
      otherInput.classList.remove("has-error");
      otherInput.placeholder = otherInput.dataset.originalPlaceholder;
    });
  }

  // --- Validación: placeholders "Campo incompleto" solo en errores ---
  const inputs = document.querySelectorAll(".input-field, .date-mini, .other-input");

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

  if (!btnSubmit) return;

  btnSubmit.addEventListener("click", async (e) => {
    e.preventDefault();

    let ok = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        ok = false;
        input.classList.add("has-error");
        input.placeholder = "Campo incompleto";
      }
    });

    if (!ok) return;

    // Recoger datos del formulario
    const nombre = document.querySelector('[name="nombre"]')?.value.trim();
    const apellidos = document.querySelector('[name="apellidos"]')?.value.trim();
    const dni = document.querySelector('[name="dni"]')?.value.trim();
    const email = document.querySelector('[name="email"]')?.value.trim();
    const telefono = document.querySelector('[name="telefono"]')?.value.trim();
    const direccion = document.querySelector('[name="direccion"]')?.value.trim();
    const importe = parseFloat(otherInput?.value) || 0;

    if (importe <= 0) {
      alert("Por favor, selecciona o introduce una cantidad válida.");
      return;
    }

    const originalText = btnSubmit.textContent;
    btnSubmit.textContent = "Enviando...";
    btnSubmit.disabled = true;

    try {
      const response = await apiRequest(API_ENDPOINTS.donaciones.create, {
        method: "POST",
        body: JSON.stringify({
          importe,
          nombre,
          apellidos,
          dni,
          email,
          telefono,
          direccion,
          certificado: "N"
        })
      });

      alert("¡Gracias! Tu donación ha sido registrada correctamente.");
      window.location.href = "index.html";
    } catch (error) {
      const errorMsg = error.data?.error || "Error al procesar la donación";
      alert(errorMsg);
    } finally {
      btnSubmit.textContent = originalText;
      btnSubmit.disabled = false;
    }
  });
});
