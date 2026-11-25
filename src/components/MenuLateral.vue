<script setup>
// Menú de categorías de las páginas de productos y combos

defineProps({
  titulo: { type: String, default: "Categorías" },
  items: { type: Array, required: true } // [{ id, nombre, ruta, cantidad? }]
});
</script>

<template>
  <aside class="lateral">
    <nav :aria-label="titulo">
      <h2>{{ titulo }}</h2>
      <ul>
        <li v-for="item in items" :key="item.id">
          <RouterLink :to="item.ruta" exact-active-class="activo">
            <span>{{ item.nombre }}</span>
            <span v-if="item.cantidad !== undefined" class="cantidad">{{ item.cantidad }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>
