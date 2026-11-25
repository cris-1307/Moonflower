<script setup>
// Campo de cantidad con botones - y +. Funciona con v-model: <CantidadInput v-model="cantidad" />

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 20 },
  id: { type: String, default: undefined },
  etiqueta: { type: String, default: "Cantidad" }
});

const emit = defineEmits(["update:modelValue"]);

function dentroDelRango(valor) {
  return Math.min(props.max, Math.max(props.min, Number(valor) || 0));
}

function poner(valor) {
  emit("update:modelValue", dentroDelRango(valor));
}

// si escriben un número fuera de rango, se corrige también lo que muestra el campo
function corregir(evento) {
  const valor = dentroDelRango(evento.target.value);
  evento.target.value = valor;
  emit("update:modelValue", valor);
}
</script>

<template>
  <span class="cantidad">
    <button
      type="button"
      class="boton-cantidad"
      aria-label="Quitar uno"
      :disabled="modelValue <= min"
      @click="poner(modelValue - 1)"
    >−</button>
    <input
      :id="id"
      type="number"
      :aria-label="etiqueta"
      :min="min"
      :max="max"
      :value="modelValue"
      @change="corregir"
    />
    <button
      type="button"
      class="boton-cantidad"
      aria-label="Agregar uno"
      :disabled="modelValue >= max"
      @click="poner(modelValue + 1)"
    >+</button>
  </span>
</template>
