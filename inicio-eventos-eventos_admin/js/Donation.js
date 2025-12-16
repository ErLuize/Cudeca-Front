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

  btnSubmit.addEventListener("click", (e) => {
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

    alert("¡Gracias! Donación preparada correctamente.");
  });
});
