<script setup>
// Paso 2 de Crea tu ramo: para quién es, el mensaje de la tarjeta y la envoltura

import { computed } from "vue";
import CampoForm from "./CampoForm.vue";
import { ramo } from "../stores/ramo.js";
import { useFormulario } from "../utils/formulario.js";
import { reglas } from "../utils/validar.js";

const props = defineProps({
  catalogo: { type: Object, required: true }
});

// el formulario trabaja directo sobre el ramo del store, así lo escrito queda guardado
const f = useFormulario({ destinatario: reglas.destinatario, envoltura: reglas.envoltura }, ramo);

const opcionesEnvoltura = computed(() =>
  props.catalogo.envolturas.map((e) => ({ valor: e.id, texto: e.nombre }))
);

function validar() {
  return f.validarTodo();
}

defineExpose({ validar });
</script>

<template>
  <h2>Personaliza</h2>
  <CampoForm
    id="destinatario"
    etiqueta="Nombre de quien recibe"
    v-model="ramo.destinatario"
    :error="f.visibles.destinatario"
    @tocar="f.tocar('destinatario')"
  />
  <CampoForm
    id="tarjeta"
    etiqueta="Mensaje de la tarjeta"
    tipo="textarea"
    placeholder="Escribe tu mensaje..."
    :maxlength="200"
    :obligatorio="false"
    v-model="ramo.tarjeta"
  />
  <CampoForm
    id="envoltura"
    etiqueta="Envoltura"
    tipo="select"
    :opciones="opcionesEnvoltura"
    v-model="ramo.envoltura"
    :error="f.visibles.envoltura"
    @tocar="f.tocar('envoltura')"
  />
</template>
