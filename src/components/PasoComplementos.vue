<script setup>
// Paso 3 de Crea tu ramo: complementos opcionales con precio

import { ramo } from "../stores/ramo.js";
import { enPesos } from "../utils/precios.js";

defineProps({
  catalogo: { type: Object, required: true }
});

// este paso no tiene nada obligatorio
function validar() {
  return true;
}

defineExpose({ validar });
</script>

<template>
  <h2>Complementos</h2>
  <fieldset class="complementos">
    <legend>Agrega un detalle (opcional)</legend>
    <label v-for="complemento in catalogo.complementos" :key="complemento.id">
      <input type="checkbox" :value="complemento.id" v-model="ramo.complementos" />
      {{ complemento.nombre }}
      <small class="precio-flor">+ {{ enPesos(complemento.precio) }}</small>
    </label>
  </fieldset>
</template>
