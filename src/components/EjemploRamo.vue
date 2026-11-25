<script setup>
// Un ramo de ejemplo del carrusel de "Crea tu ramo": muestra cómo se vería una personalización completa

import { computed } from "vue";
import { totalRamo, enPesos, foto } from "../utils/precios.js";

const props = defineProps({
  ejemplo: { type: Object, required: true },
  catalogo: { type: Object, required: true }
});

// el botón avisa al padre, que carga el ejemplo en el ramo
defineEmits(["usar"]);

const total = computed(() => totalRamo(props.ejemplo, props.catalogo));

const complementos = computed(() =>
  props.ejemplo.complementos.map((id) => {
    const dato = props.catalogo.complementos.find((c) => c.id === id);
    return dato ? dato.nombre : id;
  })
);

const envoltura = computed(() => {
  const dato = props.catalogo.envolturas.find((e) => e.id === props.ejemplo.envoltura);
  return dato ? dato.nombre : props.ejemplo.envoltura;
});
</script>

<template>
  <div class="ejemplo">
    <img :src="foto(ejemplo.foto)" :alt="'Ramo de ejemplo: ' + ejemplo.nombre" width="600" height="450" loading="lazy" />
    <div class="ejemplo-info">
      <h4>{{ ejemplo.nombre }}</h4>
      <p>Ideal para: {{ ejemplo.ocasion }}</p>
      <ul>
        <li v-for="flor in ejemplo.flores" :key="flor.id">{{ flor.cantidad }} × {{ flor.nombre }}</li>
        <li v-for="nombre in complementos" :key="nombre">{{ nombre }}</li>
      </ul>
      <p>{{ envoltura }}</p>
      <p class="tarjeta-texto">Tarjeta: “{{ ejemplo.tarjeta }}”</p>
      <p class="precio">{{ enPesos(total) }}</p>
      <button type="button" class="boton" @click="$emit('usar', ejemplo)">Usar este ejemplo</button>
    </div>
  </div>
</template>
