<script setup>
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import BotonesFlotantes from "./components/BotonesFlotantes.vue";
</script>

<template>
  <AppHeader />
  <RouterView />
  <AppFooter />
  <BotonesFlotantes />
</template>
