<script setup>
// Carrusel reutilizable. Recibe la lista de diapositivas (items) y cada vista decide
// cómo se dibuja cada una con el slot:  <CarruselBase :items="lista"> <template #default="{ item }"> ... </template>

import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  items: { type: Array, required: true },
  etiqueta: { type: String, default: "Carrusel" },
  automatico: { type: Boolean, default: true },
  intervalo: { type: Number, default: 6000 },
  clase: { type: String, default: "" }
});

const actual = ref(0);
const pausadoPorPuntero = ref(false);
const sinMovimiento = ref(false); // si el sistema pide menos animación, no avanza solo
let reloj = null;
let inicioX = null;

function ir(indice) {
  const total = props.items.length;
  if (total === 0) return;
  actual.value = (indice + total) % total;
}

function detener() {
  clearInterval(reloj);
  reloj = null;
}

function arrancar() {
  detener();
  if (!props.automatico || sinMovimiento.value || pausadoPorPuntero.value || props.items.length < 2) {
    return;
  }
  reloj = setInterval(() => ir(actual.value + 1), props.intervalo);
}

function mover(paso) {
  ir(actual.value + paso);
  arrancar();
}

// se frena mientras el mouse o el foco están encima
function entrar() {
  pausadoPorPuntero.value = true;
  detener();
}

function salir() {
  pausadoPorPuntero.value = false;
  arrancar();
}

function teclas(evento) {
  if (evento.key === "ArrowLeft") mover(-1);
  if (evento.key === "ArrowRight") mover(1);
}

// deslizar con el dedo en el celular
function empezarToque(evento) {
  inicioX = evento.pointerType === "touch" ? evento.clientX : null;
}

function terminarToque(evento) {
  if (inicioX === null) return;
  const diferencia = evento.clientX - inicioX;
  if (Math.abs(diferencia) > 50) mover(diferencia < 0 ? 1 : -1);
  inicioX = null;
}

// si cambia la cantidad de diapositivas (por ejemplo llegan las promociones), se reinicia
watch(
  () => props.items.length,
  (total) => {
    if (actual.value >= total) actual.value = 0;
    arrancar();
  }
);

onMounted(() => {
  sinMovimiento.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  arrancar();
});

onBeforeUnmount(detener);
</script>

<template>
  <section
    class="carrusel"
    :class="clase"
    aria-roledescription="carrusel"
    :aria-label="etiqueta"
    @mouseenter="entrar"
    @mouseleave="salir"
    @focusin="entrar"
    @focusout="salir"
    @keydown="teclas"
  >
    <div
      class="carrusel-pista"
      :style="{ transform: 'translateX(-' + actual * 100 + '%)', transition: sinMovimiento ? 'none' : '' }"
      aria-live="off"
      @pointerdown="empezarToque"
      @pointerup="terminarToque"
    >
      <div
        v-for="(item, i) in items"
        :key="i"
        class="diapositiva"
        role="group"
        aria-roledescription="diapositiva"
        :aria-label="i + 1 + ' de ' + items.length"
        :aria-hidden="i === actual ? 'false' : 'true'"
        :inert="i === actual ? null : ''"
      >
        <slot :item="item" :index="i" />
      </div>
    </div>

    <template v-if="items.length > 1">
      <button type="button" class="carrusel-flecha anterior" aria-label="Diapositiva anterior" @click="mover(-1)">‹</button>
      <button type="button" class="carrusel-flecha siguiente" aria-label="Diapositiva siguiente" @click="mover(1)">›</button>
      <div class="carrusel-puntos">
        <button
          v-for="(punto, i) in items"
          :key="'punto-' + i"
          type="button"
          class="carrusel-punto"
          :aria-label="'Ir a la diapositiva ' + (i + 1)"
          :aria-current="i === actual ? 'true' : 'false'"
          @click="ir(i); arrancar()"
        ></button>
      </div>
    </template>
  </section>
</template>
