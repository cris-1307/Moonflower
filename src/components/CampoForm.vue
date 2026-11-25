<script setup>
// Campo de formulario con etiqueta, borde de color y mensaje de error en línea.
// Se usa con v-model. El padre pasa el error ya calculado (vacío si está bien).

import { computed } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  id: { type: String, required: true },
  etiqueta: { type: String, required: true },
  tipo: { type: String, default: "text" }, // text, email, tel, password, date, textarea o select
  error: { type: String, default: "" },
  opciones: { type: Array, default: () => [] }, // para select: [{ valor, texto }]
  placeholder: { type: String, default: "" },
  min: { type: String, default: undefined },
  maxlength: { type: Number, default: undefined },
  filas: { type: Number, default: 4 },
  obligatorio: { type: Boolean, default: true }
});

const emit = defineEmits(["update:modelValue", "tocar"]);

const clase = computed(() => ({
  invalido: props.error !== "",
  valido: props.error === "" && String(props.modelValue) !== ""
}));

function cambiar(evento) {
  emit("update:modelValue", evento.target.value);
  emit("tocar");
}
</script>

<template>
  <div class="campo-form">
    <label :for="id">{{ etiqueta }}<span v-if="obligatorio"> *</span></label>

    <select
      v-if="tipo === 'select'"
      :id="id"
      :class="clase"
      :value="modelValue"
      :aria-invalid="error !== ''"
      :aria-describedby="id + '-error'"
      @change="cambiar"
      @blur="emit('tocar')"
    >
      <option value="">Selecciona una opción</option>
      <option v-for="opcion in opciones" :key="opcion.valor" :value="opcion.valor">{{ opcion.texto }}</option>
    </select>

    <textarea
      v-else-if="tipo === 'textarea'"
      :id="id"
      :class="clase"
      :value="modelValue"
      :rows="filas"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :aria-invalid="error !== ''"
      :aria-describedby="id + '-error'"
      @input="cambiar"
      @blur="emit('tocar')"
    ></textarea>

    <input
      v-else
      :id="id"
      :type="tipo"
      :class="clase"
      :value="modelValue"
      :min="min"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :required="obligatorio"
      :aria-invalid="error !== ''"
      :aria-describedby="id + '-error'"
      @input="cambiar"
      @blur="emit('tocar')"
    />

    <small :id="id + '-error'" class="mensaje-error" role="alert">{{ error }}</small>
  </div>
</template>
