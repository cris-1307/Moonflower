<script setup>
// Lista de productos o de combos, con menú lateral de categorías.
// Las rutas /productos/:categoria y /combos/:categoria usan esta misma vista.

import { computed, onMounted, ref } from "vue";
import MenuLateral from "../components/MenuLateral.vue";
import TarjetaProducto from "../components/TarjetaProducto.vue";
import EstadoCarga from "../components/EstadoCarga.vue";
import { catalogo, cargarCatalogo, reintentarCatalogo } from "../stores/catalogo.js";
import { agregarProducto } from "../stores/carrito.js";

const props = defineProps({
  tipo: { type: String, required: true }, // "productos" o "combos"
  categoria: { type: String, default: "" }
});

const menus = {
  productos: {
    titulo: "Nuestros productos",
    porDefecto: "todos",
    items: [
      { id: "todos", nombre: "Todas las categorías" },
      { id: "ramos", nombre: "Ramos" },
      { id: "cajas", nombre: "Caja de flores" },
      { id: "arreglos", nombre: "Arreglos" },
      { id: "detalles", nombre: "Detalles especiales" }
    ]
  },
  combos: {
    titulo: "Combos que enamoran",
    porDefecto: "combos",
    items: [
      { id: "combos", nombre: "Todos los combos" },
      { id: "chocolates", nombre: "Flores + chocolates" },
      { id: "vino", nombre: "Flores + Vino" },
      { id: "romanticos", nombre: "Combos románticos" }
    ]
  }
};

const menu = computed(() => menus[props.tipo]);
const categoriaActual = computed(() => props.categoria || menu.value.porDefecto);

// la ruta de cada categoría: la principal queda en /productos o /combos
const itemsMenu = computed(() =>
  menu.value.items.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    cantidad: catalogo.datos ? catalogo.datos.productos.filter((p) => p.categorias.includes(item.id)).length : undefined,
    ruta: item.id === menu.value.porDefecto ? "/" + props.tipo : "/" + props.tipo + "/" + item.id
  }))
);

const lista = computed(() =>
  catalogo.datos ? catalogo.datos.productos.filter((p) => p.categorias.includes(categoriaActual.value)) : []
);

const agregado = ref("");
let temporizador = null;

function alAgregar(producto) {
  agregarProducto(producto, 1);
  agregado.value = producto.nombre;
  clearTimeout(temporizador);
  temporizador = setTimeout(() => (agregado.value = ""), 4000);
}

onMounted(cargarCatalogo);
</script>

<template>
  <main class="con-lateral">
    <MenuLateral :items="itemsMenu" />
    <section class="contenido">
      <h1>{{ menu.titulo }}</h1>
      <p v-if="agregado" class="confirmacion" role="status">
        {{ agregado }} se agregó al carrito.
        <RouterLink class="enlace-carrito" to="/carrito">Ver carrito</RouterLink>
      </p>
      <EstadoCarga
        :cargando="catalogo.cargando"
        :error="catalogo.error"
        mensaje="Cargando productos..."
        @reintentar="reintentarCatalogo"
      >
        <div v-if="lista.length > 0" class="rejilla">
          <TarjetaProducto
            v-for="producto in lista"
            :key="producto.id"
            :producto="producto"
            con-boton
            @agregar="alAgregar"
          />
        </div>
        <p v-else-if="catalogo.datos" class="sin-resultados">No hay productos en esta categoría.</p>
      </EstadoCarga>
    </section>
  </main>
</template>
