<script setup>
import { precioFinal, enPesos } from "../utils/precios.js";

defineProps({
  producto: { type: Object, required: true }
});
</script>

<template>
  <span v-if="producto.descuento">
    <s class="precio-antes">{{ enPesos(producto.precio) }}</s>
    {{ enPesos(precioFinal(producto)) }}
    <span class="etiqueta-descuento">-{{ producto.descuento }}%</span>
  </span>
  <span v-else>{{ enPesos(producto.precio) }}</span>
</template>
