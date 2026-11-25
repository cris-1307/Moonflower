// Reglas de validación de los formularios. Cada regla devuelve el mensaje de error, o "" si el valor está bien.

import { fechaDeHoy } from "./precios.js";

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const obligatorio = (valor) => (String(valor).trim() === "" ? "Este campo es obligatorio." : "");

export function nombre(min, max) {
  return (valor) => {
    const texto = String(valor).trim();
    if (texto === "") return "Este campo es obligatorio.";
    if (!SOLO_LETRAS.test(texto) || texto.length < min || texto.length > max) {
      return "Solo letras, entre " + min + " y " + max + " caracteres.";
    }
    return "";
  };
}

export function correo(valor) {
  const texto = String(valor).trim();
  if (texto === "") return "Este campo es obligatorio.";
  return CORREO.test(texto) ? "" : "Escribe un correo válido, por ejemplo nombre@correo.com.";
}

export function telefono(valor) {
  const texto = String(valor).trim();
  if (texto === "") return "Este campo es obligatorio.";
  return /^[0-9]{10}$/.test(texto) ? "" : "10 números, sin espacios.";
}

export function largoMinimo(min, max) {
  return (valor) => {
    const texto = String(valor).trim();
    if (texto === "") return "Este campo es obligatorio.";
    if (texto.length < min) return "Escribe al menos " + min + " caracteres.";
    if (max && texto.length > max) return "El máximo es de " + max + " caracteres.";
    return "";
  };
}

export function fechaDesdeHoy(valor) {
  if (!valor) return "Este campo es obligatorio.";
  return valor < fechaDeHoy() ? "Elige una fecha desde hoy." : "";
}

// Mismas reglas que usa el formulario de la tienda
export const reglas = {
  nombreCompleto: nombre(3, 60),
  destinatario: nombre(2, 40),
  telefono,
  correo,
  direccion: largoMinimo(5, 100),
  fecha: fechaDesdeHoy,
  asunto: obligatorio,
  mensaje: largoMinimo(10, 500),
  clave: largoMinimo(8, 60),
  envoltura: obligatorio
};
