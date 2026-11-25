<script setup>
import { computed } from "vue";
import { precioFinal, enPesos, foto } from "../utils/precios.js";

const props = defineProps({
  producto: { type: Object, required: true }
});

// si el producto trae "fotoPromo" en data.json se usa esa foto; si no, la del producto
const imagen = computed(() => foto(props.producto.fotoPromo || props.producto.id + ".jpg"));
</script>

<template>
  <div class="promo-slide">
    <img :src="imagen" :alt="producto.nombre" width="800" height="800" />
    <div class="promo-texto">
      <div class="promo-izq">
        <p class="promo-etiqueta">Promoción -{{ producto.descuento }}%</p>
        <h2>{{ producto.nombre }}</h2>
        <p>{{ producto.promo }}</p>
      </div>
      <div class="promo-der">
        <p class="promo-precio">
          <s class="precio-antes">{{ enPesos(producto.precio) }}</s> {{ enPesos(precioFinal(producto)) }}
        </p>
        <RouterLink class="boton boton-claro" :to="{ name: 'detalle', params: { id: producto.id } }">Ver producto</RouterLink>
      </div>
    </div>
  </div>
</template>
