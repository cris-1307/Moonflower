<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { unidades } from "../stores/carrito.js";

const menuAbierto = ref(false);
const route = useRoute();

// al cambiar de página en el celular, el menú se cierra solo
watch(() => route.fullPath, () => {
  menuAbierto.value = false;
});
</script>

<template>
  <header class="encabezado">
    <RouterLink class="logo" to="/"><i class="fa-solid fa-spa"></i> MOONFLOWER</RouterLink>
    <button
      type="button"
      class="hamburguesa"
      aria-label="Abrir o cerrar el menú"
      aria-controls="menu-principal"
      :aria-expanded="menuAbierto"
      @click="menuAbierto = !menuAbierto"
    >
      <i class="fa-solid fa-bars"></i>
    </button>
    <nav id="menu-principal" :class="{ abierto: menuAbierto }" aria-label="Navegación principal">
      <ul class="menu">
        <li><RouterLink to="/" active-class="" exact-active-class="activo">Inicio</RouterLink></li>
        <li><RouterLink to="/productos" active-class="activo">Productos</RouterLink></li>
        <li><RouterLink to="/combos" active-class="activo">Catálogo</RouterLink></li>
        <li><RouterLink to="/crea-tu-ramo" active-class="activo">Crea tu ramo</RouterLink></li>
        <li><RouterLink to="/contacto" active-class="activo">Contacto</RouterLink></li>
      </ul>
    </nav>
    <div class="herramientas">
      <RouterLink
        class="icono-carrito"
        to="/carrito"
        :aria-label="unidades === 0 ? 'Carrito vacío' : 'Carrito: ' + unidades + ' productos'"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20.5 8H6" />
        </svg>
        <span v-if="unidades > 0" class="contador">{{ unidades }}</span>
      </RouterLink>
      <RouterLink to="/buscar" aria-label="Buscar productos"><i class="fa-solid fa-magnifying-glass"></i></RouterLink>
    </div>
  </header>
</template>
