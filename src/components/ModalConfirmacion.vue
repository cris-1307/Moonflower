<script setup>
import { ref, watch, nextTick } from "vue";

const props = defineProps({
  abierto: { type: Boolean, default: false },
  titulo: { type: String, required: true }
});

const emit = defineEmits(["cerrar"]);
const cuadro = ref(null);

// al abrirse, el foco pasa al cuadro para que el teclado y los lectores de pantalla lo noten
watch(
  () => props.abierto,
  async (valor) => {
    if (valor) {
      await nextTick();
      if (cuadro.value) cuadro.value.focus();
    }
  }
);
</script>

<template>
  <div v-if="abierto" class="modal-fondo" @click.self="emit('cerrar')" @keydown.esc="emit('cerrar')">
    <div ref="cuadro" class="modal" role="dialog" aria-modal="true" :aria-label="titulo" tabindex="-1">
      <h2>{{ titulo }}</h2>
      <slot />
      <button type="button" class="boton" @click="emit('cerrar')">Cerrar</button>
    </div>
  </div>
</template>
