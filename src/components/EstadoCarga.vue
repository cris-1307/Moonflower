<script setup>
// Muestra el aviso de carga o de error; cuando todo está bien muestra el contenido (el slot)

defineProps({
  cargando: { type: Boolean, default: false },
  error: { type: String, default: "" },
  mensaje: { type: String, default: "Cargando..." }
});

defineEmits(["reintentar"]);
</script>

<template>
  <div class="estado-carga">
    <p v-if="cargando" class="aviso cargando" role="status">{{ mensaje }}</p>
    <p v-else-if="error" class="aviso error" role="alert">
      {{ error }}
      <button type="button" class="quitar" @click="$emit('reintentar')">Reintentar</button>
    </p>
    <slot v-else />
  </div>
</template>
