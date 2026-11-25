// Peticiones HTTP con fetch y async/await.
// - El catálogo se lee de data.json (archivo local, parte de la app publicada).
// - Los pedidos y mensajes se mandan a una API REST (MockAPI) si VITE_API_URL tiene valor.

import { enPesos } from "../utils/precios.js";

const RUTA_DATOS = import.meta.env.BASE_URL + "data.json";
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
// Dirección de un servicio de formularios (Formspree) que reenvía cada pedido y mensaje a un correo
const CORREO_URL = import.meta.env.VITE_CORREO_URL || "";

export const hayApi = API_URL !== "";
export const hayCorreo = CORREO_URL !== "";

// Convierte los códigos de estado HTTP en errores con un mensaje claro
function revisarEstado(respuesta) {
  if (respuesta.status === 404) {
    throw new Error("No se encontró el recurso (error 404).");
  }
  if (respuesta.status === 500) {
    throw new Error("El servidor tuvo un problema (error 500). Intenta más tarde.");
  }
  if (!respuesta.ok) {
    throw new Error("No se pudo completar la petición (error " + respuesta.status + ").");
  }
}

export function mensajeDeError(error) {
  if (error instanceof TypeError) {
    return "No se pudo conectar. Revisa tu conexión a internet.";
  }
  if (error instanceof SyntaxError) {
    return "El archivo de datos tiene un error y no se puede leer.";
  }
  return error.message;
}

export async function pedirCatalogo() {
  const respuesta = await fetch(RUTA_DATOS);
  revisarEstado(respuesta);
  return await respuesta.json();
}

// Manda un POST con JSON. Nunca lanza error: devuelve { enviado, datos, motivo }
async function enviar(recurso, cuerpo) {
  if (!hayApi) {
    return { enviado: false, motivo: "No hay una API configurada." };
  }
  try {
    const respuesta = await fetch(API_URL + "/" + recurso, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo)
    });
    revisarEstado(respuesta);
    const datos = await respuesta.json().catch(() => ({}));
    return { enviado: true, datos: datos };
  } catch (error) {
    return { enviado: false, motivo: mensajeDeError(error) };
  }
}

// Manda un aviso por correo. Devuelve true si el servicio lo recibió; nunca lanza error
async function avisarPorCorreo(asunto, resumen) {
  if (!hayCorreo) return false;
  try {
    const respuesta = await fetch(CORREO_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ _subject: asunto, resumen: resumen })
    });
    return respuesta.ok;
  } catch (error) {
    return false;
  }
}

function textoPedido(pedido) {
  const lineas = pedido.items.map((item) => {
    if (item.tipo === "ramo") {
      const r = item.ramo;
      const flores = r.flores.map((f) => f.cantidad + " " + f.nombre.toLowerCase()).join(", ");
      const extras = r.complementos.length > 0 ? " + " + r.complementos.join(", ") : "";
      return "- Ramo personalizado: " + flores + extras + ". Envoltura: " + (r.envoltura || "sin elegir") +
        ". Para: " + (r.destinatario || "sin nombre") + ". Tarjeta: " + (r.tarjeta || "sin mensaje") +
        ". " + enPesos(item.precio);
    }
    return "- " + item.cantidad + " x " + item.nombre + " (" + enPesos(item.precioUnitario) + " c/u)";
  });
  return [
    "Cliente: " + pedido.cliente.nombre,
    "Teléfono: " + pedido.cliente.telefono,
    "Correo: " + pedido.cliente.correo,
    "Dirección: " + pedido.cliente.direccion,
    "Fecha de entrega: " + pedido.fecha,
    "Notas: " + (pedido.notas || "ninguna"),
    "",
    ...lineas,
    "",
    "Total: " + enPesos(pedido.total)
  ].join("\n");
}

function textoMensaje(mensaje) {
  return "De: " + mensaje.nombre + " (" + mensaje.correo + ")\nAsunto: " + mensaje.asunto + "\n\n" + mensaje.mensaje;
}

// Junta la API y el correo: el envío cuenta como hecho si llegó a alguno de los dos
async function enviarAmbos(recurso, cuerpo, asunto, hacerResumen) {
  const [api, correo] = await Promise.all([
    enviar(recurso, cuerpo),
    hayCorreo ? avisarPorCorreo(asunto, hacerResumen(cuerpo)) : false
  ]);
  if (api.enviado || correo) {
    return { enviado: true, datos: api.datos || {}, correo: correo };
  }
  return {
    enviado: false,
    motivo: hayApi ? api.motivo : hayCorreo ? "No se pudo enviar el aviso por correo." : "No hay una API ni un correo configurados."
  };
}

export const enviarPedido = (pedido) =>
  enviarAmbos("pedidos", pedido, "Nuevo pedido en Moonflower", textoPedido);
export const enviarMensaje = (mensaje) =>
  enviarAmbos("mensajes", mensaje, "Nuevo mensaje de contacto en Moonflower", textoMensaje);
