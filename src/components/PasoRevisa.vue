<script setup>
// Paso 4 de Crea tu ramo: resumen con el precio de cada parte

import { ref, computed } from "vue";
import { ramo, quitarFlor } from "../stores/ramo.js";
import { enPesos } from "../utils/precios.js";

const props = defineProps({
  catalogo: { type: Object, required: true }
});

// pide al padre que cambie de paso (evento personalizado)
defineEmits(["ir-a-paso"]);

const errorFlores = ref("");

const flores = computed(() =>
  ramo.flores.map((flor) => {
    const dato = props.catalogo.flores.find((f) => f.id === flor.id);
    return { ...flor, subtotal: dato ? dato.precio * flor.cantidad : 0 };
  })
);

const complementos = computed(() =>
  ramo.complementos.map((id) => props.catalogo.complementos.find((c) => c.id === id)).filter(Boolean)
);

const envoltura = computed(() => {
  const dato = props.catalogo.envolturas.find((e) => e.id === ramo.envoltura);
  return dato ? dato.nombre : "sin elegir";
});

function validar() {
  errorFlores.value = ramo.flores.length === 0 ? "Primero elige las flores de tu ramo en el paso 1." : "";
  return errorFlores.value === "";
}

defineExpose({ validar });
</script>

<template>
  <h2>Revisa y agrega al carrito</h2>
  <p v-if="errorFlores" class="aviso error" role="alert">{{ errorFlores }}</p>
  <section class="resumen">
    <p v-if="flores.length === 0">
      Todavía no elegiste flores.
      <a href="#" @click.prevent="$emit('ir-a-paso', 1)">Vuelve al paso 1</a>.
    </p>
    <template v-else>
      <ul>
        <li v-for="flor in flores" :key="flor.id">
          {{ flor.cantidad }} × {{ flor.nombre }} ({{ enPesos(flor.subtotal) }})
          <button type="button" class="quitar" @click="quitarFlor(flor.id)">Quitar</button>
        </li>
      </ul>
      <p>Fecha de entrega: {{ ramo.fecha || "sin elegir" }}</p>
      <p>Para: {{ ramo.destinatario || "sin elegir" }}</p>
      <p>Mensaje: {{ ramo.tarjeta || "sin mensaje" }}</p>
      <p>Envoltura: {{ envoltura }}</p>
      <p>
        Complementos:
        <span v-if="complementos.length === 0">ninguno</span>
        <span v-else>{{ complementos.map((c) => c.nombre + " (" + enPesos(c.precio) + ")").join(", ") }}</span>
      </p>
    </template>
  </section>
  <p>Los datos de entrega se piden al final, en el carrito.</p>
</template>
