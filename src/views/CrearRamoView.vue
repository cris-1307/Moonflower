<script setup>
// Crea tu ramo: 4 pasos (cada uno es un componente) y, en el panel "Tu ramo", un carrusel con ramos de ejemplo.
// Al final el ramo se agrega al carrito y se paga junto con lo demás.

import { ref, computed, onMounted } from "vue";
import CarruselBase from "../components/CarruselBase.vue";
import EjemploRamo from "../components/EjemploRamo.vue";
import EstadoCarga from "../components/EstadoCarga.vue";
import PasoFlores from "../components/PasoFlores.vue";
import PasoPersonaliza from "../components/PasoPersonaliza.vue";
import PasoComplementos from "../components/PasoComplementos.vue";
import PasoRevisa from "../components/PasoRevisa.vue";
import { catalogo, cargarCatalogo, reintentarCatalogo } from "../stores/catalogo.js";
import { ramo, totalFlores, cargarEjemplo, reiniciarRamo } from "../stores/ramo.js";
import { agregarRamo } from "../stores/carrito.js";
import { totalRamo, enPesos } from "../utils/precios.js";

const pasos = [
  { numero: 1, nombre: "Elige tus flores" },
  { numero: 2, nombre: "Personaliza" },
  { numero: 3, nombre: "Complementos" },
  { numero: 4, nombre: "Revisa y agrega" }
];

const paso = ref(1);
const pasoActual = ref(null); // referencia al componente del paso, para llamar a validar()
const ramoAgregado = ref(false);
const ejemploCargado = ref("");

onMounted(cargarCatalogo);

const total = computed(() => (catalogo.datos ? totalRamo(ramo, catalogo.datos) : 0));

// solo se puede volver a pasos anteriores; para avanzar hay que validar con "Continuar"
function irAPaso(numero) {
  if (numero <= paso.value) paso.value = numero;
}

function continuar() {
  if (pasoActual.value && !pasoActual.value.validar()) return;
  if (paso.value < 4) {
    paso.value += 1;
    return;
  }
  agregarRamo(ramo);
  reiniciarRamo();
  ramoAgregado.value = true;
}

function usarEjemplo(ejemplo) {
  cargarEjemplo(ejemplo);
  ejemploCargado.value = ejemplo.nombre;
}

function armarOtro() {
  ramoAgregado.value = false;
  ejemploCargado.value = "";
  paso.value = 1;
}
</script>

<template>
  <main class="crear">
    <aside class="pasos">
      <h1>Crea tu ramo ideal</h1>
      <p>Elige tus flores favoritas y arma tu ramo perfecto</p>
      <ol>
        <li v-for="p in pasos" :key="p.numero" :class="{ actual: p.numero === paso }">
          <a href="#" :aria-current="p.numero === paso ? 'step' : null" @click.prevent="irAPaso(p.numero)">{{ p.nombre }}</a>
        </li>
      </ol>
    </aside>

    <div class="columna-ramo">
      <EstadoCarga
        :cargando="catalogo.cargando"
        :error="catalogo.error"
        mensaje="Cargando flores..."
        @reintentar="reintentarCatalogo"
      >
        <template v-if="catalogo.datos">
          <section v-if="ramoAgregado" class="elegir">
            <p class="confirmacion" role="status">
              ¡Tu ramo se agregó al carrito!
              <RouterLink class="enlace-carrito" to="/carrito">Ir al carrito para pagar</RouterLink> o
              <a class="enlace-carrito" href="#" @click.prevent="armarOtro">armar otro ramo</a>.
            </p>
          </section>

          <form v-else class="armador" novalidate @submit.prevent="continuar">
            <section class="elegir">
              <PasoFlores v-if="paso === 1" ref="pasoActual" :catalogo="catalogo.datos" />
              <PasoPersonaliza v-else-if="paso === 2" ref="pasoActual" :catalogo="catalogo.datos" />
              <PasoComplementos v-else-if="paso === 3" ref="pasoActual" :catalogo="catalogo.datos" />
              <PasoRevisa v-else ref="pasoActual" :catalogo="catalogo.datos" @ir-a-paso="irAPaso" />
            </section>
            <section class="tu-ramo">
              <h2>Tu ramo</h2>
              <p class="nota-ejemplos">Mira cómo puede quedar y usa un ejemplo como punto de partida.</p>
              <CarruselBase :items="catalogo.datos.ejemplos" etiqueta="Ramos de ejemplo" clase="carrusel-ejemplos" :automatico="false">
                <template #default="{ item }">
                  <EjemploRamo :ejemplo="item" :catalogo="catalogo.datos" @usar="usarEjemplo" />
                </template>
              </CarruselBase>
              <p v-if="ejemploCargado" class="confirmacion" role="status">
                Cargaste “{{ ejemploCargado }}”. Puedes cambiar flores y detalles en los pasos.
              </p>
              <p class="total">Flores elegidas: {{ totalFlores }} · Total: {{ enPesos(total) }}</p>
              <button type="submit" class="boton">{{ paso === 4 ? "Agregar al carrito" : "Continuar" }}</button>
              <button v-if="paso > 1" type="button" class="boton-borde" @click="paso -= 1">Atrás</button>
            </section>
          </form>
        </template>
      </EstadoCarga>
    </div>
  </main>
</template>
