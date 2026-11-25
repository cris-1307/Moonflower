<script setup>
import { computed, onMounted } from "vue";
import CarruselBase from "../components/CarruselBase.vue";
import DiapositivaPromo from "../components/DiapositivaPromo.vue";
import TarjetaProducto from "../components/TarjetaProducto.vue";
import { catalogo, cargarCatalogo } from "../stores/catalogo.js";
import { foto } from "../utils/precios.js";

onMounted(cargarCatalogo);

// productos de data.json que tienen descuento
const promos = computed(() =>
  catalogo.datos ? catalogo.datos.productos.filter((p) => p.descuento > 0) : []
);

// diapositivas: el banner de siempre, una por promoción y una que invita a armar un ramo
const diapositivas = computed(() => {
  const lista = [{ tipo: "banner" }];
  promos.value.forEach((producto) => lista.push({ tipo: "promo", producto }));
  if (catalogo.datos) lista.push({ tipo: "ramo" });
  return lista;
});

const ocasiones = [
  { nombre: "Aniversarios", foto: "ocasion-aniversarios.jpg", alt: "Ramos para aniversarios" },
  { nombre: "Grados", foto: "ocasion-grados.jpg", alt: "Ramos para grados" },
  { nombre: "Cumpleaños", foto: "ocasion-cumpleanos.jpg", alt: "Ramos para cumpleaños" },
  { nombre: "Amor y amistad", foto: "ocasion-amor.jpg", alt: "Ramos para amor y amistad" },
  { nombre: "Nacimientos y bebés", foto: "ocasion-nacimientos.jpg", alt: "Ramos para nacimientos y bebés" }
];
</script>

<template>
  <main class="inicio">
    <CarruselBase :items="diapositivas" etiqueta="Destacados de Moonflower">
      <template #default="{ item }">
        <div v-if="item.tipo === 'banner'" class="hero">
          <picture>
            <source media="(min-width: 700px)" :srcset="foto('hero-grande.jpg')" />
            <img :src="foto('hero-pequeno.jpg')" alt="Ramo de flores moradas" width="800" height="600" />
          </picture>
          <div class="hero-texto">
            <h1>Ven y llévate tu flor de luna</h1>
            <p>Que tus emociones brillen en un ramo de moonflowers</p>
          </div>
        </div>

        <DiapositivaPromo v-else-if="item.tipo === 'promo'" :producto="item.producto" />

        <div v-else class="promo-slide">
          <img :src="foto('tu-ramo.jpg')" alt="Un ramo armado a tu gusto" width="800" height="800" />
          <div class="promo-texto">
            <div class="promo-izq">
              <p class="promo-etiqueta">Hecho a tu gusto</p>
              <h2>Arma tu propio ramo</h2>
              <p>Elige las flores, escribe la tarjeta y agrega un detalle.</p>
            </div>
            <div class="promo-der">
              <p class="promo-precio">Ves el precio mientras lo armas</p>
              <RouterLink class="boton boton-claro" to="/crea-tu-ramo">Crear mi ramo</RouterLink>
            </div>
          </div>
        </div>
      </template>
    </CarruselBase>

    <section v-if="promos.length > 0" class="promociones" aria-labelledby="titulo-promos">
      <h2 id="titulo-promos">Promociones</h2>
      <div class="rejilla-promos">
        <TarjetaProducto v-for="producto in promos" :key="producto.id" :producto="producto" />
      </div>
    </section>

    <section class="ocasiones">
      <h2>Ocasiones especiales</h2>
      <div class="lista-ocasiones">
        <article v-for="ocasion in ocasiones" :key="ocasion.nombre" class="ocasion">
          <RouterLink to="/productos">
            <img :src="foto(ocasion.foto)" :alt="ocasion.alt" width="300" height="300" />
            <h3>{{ ocasion.nombre }}</h3>
          </RouterLink>
        </article>
      </div>
    </section>
  </main>
</template>
