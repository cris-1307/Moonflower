<script setup>
// Buscador: filtra los productos del catálogo mientras se escribe.
// El texto queda en la dirección (/#/buscar?q=rosas) para poder recargar o compartir la búsqueda.

import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import TarjetaProducto from "../components/TarjetaProducto.vue";
import EstadoCarga from "../components/EstadoCarga.vue";
import { catalogo, cargarCatalogo, reintentarCatalogo } from "../stores/catalogo.js";

const route = useRoute();
const router = useRouter();
const texto = ref(typeof route.query.q === "string" ? route.query.q : "");
const campo = ref(null);

// quita tildes y mayúsculas para que "cielo", "Cielo" y "CIÉLO" encuentren lo mismo
function limpiar(valor) {
  return valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

const resultados = computed(() => {
  const palabras = limpiar(texto.value).split(/\s+/).filter(Boolean);
  if (!catalogo.datos || palabras.length === 0) return [];
  return catalogo.datos.productos.filter((p) => {
    const nombre = limpiar(p.nombre);
    return palabras.every((palabra) => nombre.includes(palabra));
  });
});

const hayBusqueda = computed(() => limpiar(texto.value) !== "");

watch(texto, (valor) => {
  router.replace({ query: valor.trim() ? { q: valor } : {} });
});

function limpiarCampo() {
  texto.value = "";
  campo.value?.focus();
}

onMounted(() => {
  cargarCatalogo();
  campo.value?.focus();
});
</script>

<template>
  <main class="busqueda">
    <h1>Buscar productos</h1>
    <form class="buscador" role="search" @submit.prevent>
      <label for="texto-busqueda" class="solo-lectores">Nombre del producto</label>
      <input
        id="texto-busqueda"
        ref="campo"
        v-model="texto"
        type="search"
        placeholder="Escribe el nombre de un ramo o combo"
        autocomplete="off"
      />
      <button v-if="texto" type="button" class="boton-secundario" @click="limpiarCampo">Borrar</button>
    </form>

    <EstadoCarga
      :cargando="catalogo.cargando"
      :error="catalogo.error"
      mensaje="Cargando productos..."
      @reintentar="reintentarCatalogo"
    >
      <p v-if="!hayBusqueda" class="sin-resultados">Escribe una palabra para ver los productos que coinciden.</p>
      <template v-else>
        <p class="conteo-resultados" role="status">
          {{ resultados.length === 0 ? "Sin resultados" : resultados.length === 1 ? "1 resultado" : resultados.length + " resultados" }}
        </p>
        <div v-if="resultados.length > 0" class="rejilla">
          <TarjetaProducto v-for="producto in resultados" :key="producto.id" :producto="producto" />
        </div>
        <p v-else class="sin-resultados">
          No hay productos con ese nombre. Prueba con otra palabra o mira todos los
          <RouterLink class="enlace-carrito" to="/productos">productos</RouterLink>.
        </p>
      </template>
    </EstadoCarga>
  </main>
</template>
