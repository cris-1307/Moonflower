// Historial de pedidos y mensajes de este navegador (localStorage)

import { reactive, watch } from "vue";
import { leer, guardar } from "../utils/almacen.js";

export const historial = reactive({
  pedidos: leer("pedidos", []),
  mensajes: leer("mensajes", [])
});

watch(() => historial.pedidos, (v) => guardar("pedidos", v), { deep: true });
watch(() => historial.mensajes, (v) => guardar("mensajes", v), { deep: true });

export function registrarPedido(pedido) {
  historial.pedidos.push(pedido);
}

export function registrarMensaje(mensaje) {
  historial.mensajes.push(mensaje);
}
