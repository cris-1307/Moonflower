// Estado del ramo que se está armando en "Crea tu ramo". Se guarda en localStorage con la clave "ramo".

import { reactive, computed, watch } from "vue";
import { leer, guardar } from "../utils/almacen.js";

const vacio = () => ({ flores: [], complementos: [], destinatario: "", tarjeta: "", envoltura: "", fecha: "" });

export const ramo = reactive({ ...vacio(), ...leer("ramo", {}) });

watch(ramo, (valor) => guardar("ramo", valor), { deep: true });

export const totalFlores = computed(() => ramo.flores.reduce((suma, f) => suma + f.cantidad, 0));

export function cantidadDeFlor(id) {
  const flor = ramo.flores.find((f) => f.id === id);
  return flor ? flor.cantidad : 0;
}

export function fijarFlor(flor, cantidad) {
  const posicion = ramo.flores.findIndex((f) => f.id === flor.id);
  if (cantidad <= 0) {
    if (posicion >= 0) ramo.flores.splice(posicion, 1);
  } else if (posicion >= 0) {
    ramo.flores[posicion].cantidad = cantidad;
  } else {
    ramo.flores.push({ id: flor.id, nombre: flor.nombre, cantidad: cantidad });
  }
}

export function quitarFlor(id) {
  ramo.flores = ramo.flores.filter((f) => f.id !== id);
}

// Carga uno de los ramos de ejemplo para seguir editándolo (la fecha elegida se conserva)
export function cargarEjemplo(ejemplo) {
  ramo.flores = ejemplo.flores.map((f) => ({ ...f }));
  ramo.complementos = [...ejemplo.complementos];
  ramo.envoltura = ejemplo.envoltura;
  ramo.destinatario = ejemplo.destinatario;
  ramo.tarjeta = ejemplo.tarjeta;
}

export function reiniciarRamo() {
  Object.assign(ramo, vacio());
}
