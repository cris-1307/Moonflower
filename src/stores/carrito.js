// Estado compartido del carrito. Cualquier vista lo importa y todas ven lo mismo.
// Cada cambio se guarda solo en localStorage, así el carrito sigue ahí después de recargar.

import { reactive, computed, watch } from "vue";
import { leer, guardar } from "../utils/almacen.js";

export const carrito = reactive({ items: leer("carrito", []) });

watch(() => carrito.items, (valor) => guardar("carrito", valor), { deep: true });

export const unidades = computed(() =>
  carrito.items.reduce((suma, item) => suma + (item.cantidad || 1), 0)
);

// El carrito guarda solo id y cantidad; el precio se busca en data.json
export function agregarProducto(producto, cantidad = 1) {
  const existente = carrito.items.find((i) => i.tipo !== "ramo" && i.id === producto.id);
  if (existente) {
    existente.cantidad = Math.min(20, existente.cantidad + cantidad);
  } else {
    carrito.items.push({ tipo: "producto", id: producto.id, nombre: producto.nombre, cantidad: cantidad });
  }
}

export function agregarRamo(ramo) {
  carrito.items.push({ tipo: "ramo", ramo: JSON.parse(JSON.stringify(ramo)) });
}

export function cambiarCantidad(indice, cantidad) {
  carrito.items[indice].cantidad = cantidad;
}

export function quitarDelCarrito(indice) {
  carrito.items.splice(indice, 1);
}

export function vaciarCarrito() {
  carrito.items = [];
}

export function cantidadEnCarrito(id) {
  const item = carrito.items.find((i) => i.tipo !== "ramo" && i.id === id);
  return item ? item.cantidad : 0;
}
