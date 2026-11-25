<script setup>
// Paso 1 de Crea tu ramo: elegir las flores y la fecha de entrega

import { ref, computed } from "vue";
import CantidadInput from "./CantidadInput.vue";
import CampoForm from "./CampoForm.vue";
import { ramo, cantidadDeFlor, fijarFlor } from "../stores/ramo.js";
import { enPesos, foto, fechaDeHoy } from "../utils/precios.js";
import { fechaDesdeHoy } from "../utils/validar.js";

defineProps({
  catalogo: { type: Object, required: true }
});

const errorFlores = ref("");
const fechaTocada = ref(false);
const errorFecha = computed(() => (fechaTocada.value ? fechaDesdeHoy(ramo.fecha) : ""));

function cambiarFlor(flor, cantidad) {
  fijarFlor(flor, cantidad);
  errorFlores.value = "";
}

// el padre la llama al pulsar "Continuar"
function validar() {
  fechaTocada.value = true;
  errorFlores.value = ramo.flores.length === 0 ? "Elige al menos una flor con el botón +." : "";
  return errorFlores.value === "" && fechaDesdeHoy(ramo.fecha) === "";
}

defineExpose({ validar });
</script>

<template>
  <h2>Elige tus flores</h2>
  <p v-if="errorFlores" class="aviso error" role="alert">{{ errorFlores }}</p>
  <div class="lista-flores">
    <article v-for="flor in catalogo.flores" :key="flor.id" class="flor">
      <img :src="foto('flor-' + flor.id + '.jpg')" :alt="flor.nombre" width="300" height="300" loading="lazy" />
      <label :for="'flor-' + flor.id">
        {{ flor.nombre }} <small class="precio-flor">{{ enPesos(flor.precio) }} c/u</small>
      </label>
      <CantidadInput
        :id="'flor-' + flor.id"
        :etiqueta="'Cantidad de ' + flor.nombre"
        :modelValue="cantidadDeFlor(flor.id)"
        @update:modelValue="(cantidad) => cambiarFlor(flor, cantidad)"
      />
    </article>
  </div>
  <CampoForm
    id="fecha"
    etiqueta="Fecha de entrega"
    tipo="date"
    :min="fechaDeHoy()"
    v-model="ramo.fecha"
    :error="errorFecha"
    @tocar="fechaTocada = true"
  />
</template>
