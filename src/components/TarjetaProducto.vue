<script setup>
import { computed } from "vue";
import EtiquetaPrecio from "./EtiquetaPrecio.vue";
import { foto } from "../utils/precios.js";

const props = defineProps({
  producto: { type: Object, required: true },
  conBoton: { type: Boolean, default: false }
});

// el botón avisa al padre con un evento personalizado; el padre decide qué hacer
defineEmits(["agregar"]);

const imagen = computed(() => foto(props.producto.id + ".jpg"));
</script>

<template>
  <article class="tarjeta">
    <RouterLink class="enlace-foto" :to="{ name: 'detalle', params: { id: producto.id } }">
      <img :src="imagen" :alt="producto.nombre" loading="lazy" width="400" height="400" />
      <span v-if="producto.descuento" class="insignia-promo">-{{ producto.descuento }}%</span>
    </RouterLink>
    <h3>
      <RouterLink :to="{ name: 'detalle', params: { id: producto.id } }">{{ producto.nombre }}</RouterLink>
    </h3>
    <p class="precio"><EtiquetaPrecio :producto="producto" /></p>
    <button v-if="conBoton" type="button" class="boton" @click="$emit('agregar', producto)">
      Agregar al carrito
    </button>
  </article>
</template>
