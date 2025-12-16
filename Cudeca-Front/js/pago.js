'use strict';

const form = document.getElementById('paymentForm');
const precioEventoEl = document.getElementById('precioEvento');

const precioEvento = 20;
precioEventoEl.textContent = `${precioEvento}€`;

// 1) Guardamos placeholders originales para poder restaurarlos
const originalPH = new Map();
form.querySelectorAll('input').forEach(inp => {
  originalPH.set(inp, inp.getAttribute('placeholder') || '');
});

function getInputByKey(key){
  // Tus inputs tienen name="nombre", name="apellidos", etc.
  return form.querySelector(`[name="${key}"]`);
}

function setFieldError(key, msg) {
  // Mensaje bajo el campo (tu sistema actual)
  const el = document.querySelector(`[data-error-for="${key}"]`);
  if (el) el.textContent = msg ?? '';

  // Input rojo + placeholder "Dato incompleto"
  if (key === 'fecha') {
    // fecha afecta a 3 inputs
    ['dia','mes','anio'].forEach(k => {
      const input = getInputByKey(k);
      if (!input) return;
      if (msg) {
        input.classList.add('has-error');
        input.setAttribute('placeholder', 'Campo incompleto');
      } else {
        input.classList.remove('has-error');
        input.setAttribute('placeholder', originalPH.get(input));
      }
    });
    return;
  }

  const input = getInputByKey(key);
  if (!input) return;

  if (msg) {
    input.classList.add('has-error');
    input.setAttribute('placeholder', 'Campo incompleto');
  } else {
    input.classList.remove('has-error');
    input.setAttribute('placeholder', originalPH.get(input));
  }
}

function onlyDigits(s) {
  return /^[0-9]+$/.test(s);
}

function validate() {
  // Limpia todo
  ['nombre','apellidos','fecha','direccion','cp','email','telefono'].forEach(k => setFieldError(k, ''));

  const nombre = form.nombre.value.trim();
  const apellidos = form.apellidos.value.trim();
  const direccion = form.direccion.value.trim();
  const cp = form.cp.value.trim();
  const email = form.email.value.trim();
  const telefono = form.telefono.value.trim();

  const dia = form.dia.value.trim();
  const mes = form.mes.value.trim();
  const anio = form.anio.value.trim();

  const tickets = Number(document.getElementById('tickets').value);

  let ok = true;

  // Si quieres que el texto sea SIEMPRE "Campo incompleto", usa ese literal:
  // (aquí mantengo tus mensajes actuales, pero puedes cambiarlos)
  if (nombre.length < 2) { setFieldError('nombre', 'Campo incompleto'); ok = false; }
  if (apellidos.length < 2) { setFieldError('apellidos', 'Campo incompleto'); ok = false; }
  if (direccion.length < 5) { setFieldError('direccion', 'Campo incompleto'); ok = false; }

  if (!onlyDigits(cp) || cp.length !== 5) { setFieldError('cp', 'Campo incompleto'); ok = false; }

  if (!email.includes('@') || !email.includes('.')) { setFieldError('email', 'Campo incompleto'); ok = false; }

  if (telefono.length < 8) { setFieldError('telefono', 'Campo incompleto'); ok = false; }

  const d = Number(dia), m = Number(mes), y = Number(anio);
  const nowY = new Date().getFullYear();
  if (!onlyDigits(dia) || !onlyDigits(mes) || !onlyDigits(anio) || y < 1900 || y > nowY || m < 1 || m > 12 || d < 1 || d > 31) {
    setFieldError('fecha', 'Campo incompleto');
    ok = false;
  }

  if (!Number.isInteger(tickets) || tickets < 1) {
    alert('La cantidad de tickets debe ser al menos 1.');
    ok = false;
  }

  return ok;
}

function simulatePayment() {
  return Math.random() < 0.8;
}

// 2) Opcional pero recomendado: al escribir, se quita el rojo si ya está OK
form.addEventListener('input', (e) => {
  const t = e.target;
  if (!(t instanceof HTMLInputElement)) return;

  // si empieza a escribir, quitamos el estado error del propio campo
  if (t.classList.contains('has-error')) {
    t.classList.remove('has-error');
    t.setAttribute('placeholder', originalPH.get(t));
  }

  // si es uno de fecha, y toca uno, limpiamos los 3 placeholders si estaban rojos
  if (['dia','mes','anio'].includes(t.name)) {
    ['dia','mes','anio'].forEach(k => {
      const i = getInputByKey(k);
      if (!i) return;
      i.classList.remove('has-error');
      i.setAttribute('placeholder', originalPH.get(i));
    });
    // también limpia el mensaje de fecha si quieres:
    setFieldError('fecha', '');
  } else {
    // limpia mensaje del campo actual si quieres:
    const key = t.name;
    const msgEl = document.querySelector(`[data-error-for="${key}"]`);
    if (msgEl) msgEl.textContent = '';
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validate()) return;

  const ok = simulatePayment();
  window.location.href = ok ? 'paymentok.html' : '../paymentError.html';
});
