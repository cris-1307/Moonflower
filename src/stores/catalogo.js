// Catálogo compartido: se pide una sola vez y todas las vistas leen el mismo objeto reactivo

import { reactive } from "vue";
import { pedirCatalogo, mensajeDeError } from "../services/api.js";

export const catalogo = reactive({ datos: null, cargando: false, error: "" });

export async function cargarCatalogo() {
  if (catalogo.datos || catalogo.cargando) return;
  catalogo.cargando = true;
  catalogo.error = "";
  try {
    catalogo.datos = await pedirCatalogo();
  } catch (error) {
    catalogo.error = mensajeDeError(error);
  } finally {
    catalogo.cargando = false;
  }
}

export function reintentarCatalogo() {
  catalogo.error = "";
  cargarCatalogo();
}
