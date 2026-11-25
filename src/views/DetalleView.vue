<script setup>
// Detalle de un producto: foto, precio, descripción y selector de cantidad

import { computed, onMounted, ref } from "vue";
import CantidadInput from "../components/CantidadInput.vue";
import EstadoCarga from "../components/EstadoCarga.vue";
import EtiquetaPrecio from "../components/EtiquetaPrecio.vue";
import { catalogo, cargarCatalogo, reintentarCatalogo } from "../stores/catalogo.js";
import { agregarProducto, cantidadEnCarrito } from "../stores/carrito.js";
import { foto } from "../utils/precios.js";

const props = defineProps({
  id: { type: String, required: true }
});

onMounted(cargarCatalogo);

const producto = computed(() =>
  catalogo.datos ? catalogo.datos.productos.find((p) => p.id === props.id) || null : null
);
const esCombo = computed(() => (producto.value ? producto.value.categorias.includes("combos") : false));
const enCarrito = computed(() => cantidadEnCarrito(props.id));

const cantidad = ref(0);
const aviso = ref("");
const haAgregado = ref(false);

function agregar() {
  if (cantidad.value < 1) {
    aviso.value = "Elige al menos 1 unidad con el botón +.";
    return;
  }
  aviso.value = "";
  agregarProducto(producto.value, cantidad.value);
  cantidad.value = 0;
  haAgregado.value = true;
}
</script>

<template>
  <main>
    <nav class="migas" aria-label="Ruta de navegación">
      <RouterLink to="/">inicio</RouterLink> &gt;
      <RouterLink :to="esCombo ? '/combos' : '/productos'">{{ esCombo ? "catálogo" : "productos" }}</RouterLink> &gt;
      <span>{{ producto ? producto.nombre : "..." }}</span>
    </nav>

    <EstadoCarga
      :cargando="catalogo.cargando"
      :error="catalogo.error"
      mensaje="Cargando el producto..."
      @reintentar="reintentarCatalogo"
    >
      <article v-if="producto" class="detalle">
        <section class="galeria">
          <img class="principal" :src="foto(producto.id + '.jpg')" :alt="producto.nombre" width="800" height="800" />
        </section>
        <section class="info">
          <h1>{{ producto.nombre }}</h1>
          <p class="precio-grande"><EtiquetaPrecio :producto="producto" /></p>
          <p>{{ producto.nombre }}: flores frescas y seleccionadas, listas para regalar en un momento especial.</p>
          <ul class="caracteristicas">
            <li>Flores frescas y seleccionadas</li>
            <li>Incluye tarjeta personalizada</li>
            <li>Arreglo premium</li>
            <li>Envoltura elegante</li>
            <li>Envíos rápidos</li>
          </ul>
          <form class="compra" novalidate @submit.prevent="agregar">
            <label for="cantidad">Cantidad</label>
            <CantidadInput id="cantidad" v-model="cantidad" />
            <button type="submit" class="boton">Agregar al carrito</button>
          </form>
          <p v-if="aviso" class="aviso error" role="alert">{{ aviso }}</p>
          <p v-if="haAgregado || enCarrito > 0" class="confirmacion" role="status">
            <span v-if="haAgregado">Agregado al carrito. </span>En tu carrito: {{ enCarrito }} × {{ producto.nombre }}.
            <RouterLink class="enlace-carrito" to="/carrito">Ver carrito</RouterLink>
          </p>
        </section>
      </article>
      <p v-else-if="catalogo.datos" class="aviso error">
        No encontramos ese producto. <RouterLink to="/productos">Ver todos los productos</RouterLink>
      </p>
    </EstadoCarga>
  </main>
</template>
