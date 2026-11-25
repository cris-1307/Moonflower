// Rutas de la app (Vue Router). Se usa el modo "hash" (/#/ruta) para que recargar la página
// funcione igual en GitHub Pages, Netlify y Vercel sin configurar redirecciones.

import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CatalogoView from "../views/CatalogoView.vue";
import DetalleView from "../views/DetalleView.vue";
import CrearRamoView from "../views/CrearRamoView.vue";
import CarritoView from "../views/CarritoView.vue";
import ContactoView from "../views/ContactoView.vue";
import BusquedaView from "../views/BusquedaView.vue";
import InformacionView from "../views/InformacionView.vue";
import NoEncontradaView from "../views/NoEncontradaView.vue";

const routes = [
  { path: "/", name: "inicio", component: HomeView, meta: { titulo: "Inicio" } },
  {
    path: "/productos/:categoria?",
    name: "productos",
    component: CatalogoView,
    props: (route) => ({ tipo: "productos", categoria: route.params.categoria || "" }),
    meta: { titulo: "Productos" }
  },
  {
    path: "/combos/:categoria?",
    name: "combos",
    component: CatalogoView,
    props: (route) => ({ tipo: "combos", categoria: route.params.categoria || "" }),
    meta: { titulo: "Combos" }
  },
  { path: "/producto/:id", name: "detalle", component: DetalleView, props: true, meta: { titulo: "Producto" } },
  { path: "/crea-tu-ramo", name: "crear-ramo", component: CrearRamoView, meta: { titulo: "Crea tu ramo" } },
  { path: "/carrito", name: "carrito", component: CarritoView, meta: { titulo: "Carrito" } },
  { path: "/contacto", name: "contacto", component: ContactoView, meta: { titulo: "Contacto" } },
  { path: "/buscar", name: "buscar", component: BusquedaView, meta: { titulo: "Buscar" } },
  { path: "/informacion", name: "informacion", component: InformacionView, meta: { titulo: "Información" } },
  { path: "/:pathMatch(.*)*", name: "no-encontrada", component: NoEncontradaView, meta: { titulo: "No encontrada" } }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: "smooth" };
    return { top: 0 };
  }
});

// el título de la pestaña cambia con la ruta
router.afterEach((to) => {
  document.title = (to.meta.titulo || "Moonflower") + " | Moonflower";
});

export default router;
