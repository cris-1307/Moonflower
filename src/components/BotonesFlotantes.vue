<script setup>
function subir() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <aside class="flotantes">
    <a href="https://wa.me/573019876543" aria-label="Escribir por WhatsApp" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i></a>
    <a href="#" aria-label="Volver arriba" @click.prevent="subir"><i class="fa-solid fa-arrow-up"></i></a>
  </aside>
</template>
