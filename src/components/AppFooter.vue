<script setup>
const enlacesRapidos = [
  { texto: "Inicio", ruta: "/" },
  { texto: "Productos", ruta: "/productos" },
  { texto: "Catálogo", ruta: "/combos" },
  { texto: "Crea tu ramo", ruta: "/crea-tu-ramo" },
  { texto: "Contacto", ruta: "/contacto" }
];

const informacion = [
  { texto: "Quiénes somos", hash: "#quienes-somos" },
  { texto: "Términos y condiciones", hash: "#terminos" },
  { texto: "Políticas de privacidad", hash: "#privacidad" },
  { texto: "Preguntas", hash: "#preguntas" }
];

const redes = [
  { clase: "fb", nombre: "Facebook", icono: "fa-brands fa-facebook-f" },
  { clase: "ig", nombre: "Instagram", icono: "fa-brands fa-instagram" },
  { clase: "in", nombre: "LinkedIn", icono: "fa-brands fa-linkedin-in" },
  { clase: "yt", nombre: "YouTube", icono: "fa-brands fa-youtube" }
];
</script>

<template>
  <footer class="pie">
    <div class="pie-contenido">
      <section class="pie-marca">
        <p class="logo"><i class="fa-solid fa-spa"></i> MOONFLOWER</p>
        <p>Flores frescas para cada momento especial.</p>
        <ul class="redes">
          <li v-for="red in redes" :key="red.clase">
            <a :class="red.clase" href="#" :aria-label="red.nombre" @click.prevent><i :class="red.icono"></i></a>
          </li>
        </ul>
      </section>
      <nav aria-label="Enlaces rápidos">
        <h2>Enlaces rápidos</h2>
        <ul>
          <li v-for="enlace in enlacesRapidos" :key="enlace.ruta">
            <RouterLink :to="enlace.ruta">{{ enlace.texto }}</RouterLink>
          </li>
        </ul>
      </nav>
      <nav aria-label="Información">
        <h2>Información</h2>
        <ul>
          <li v-for="enlace in informacion" :key="enlace.hash">
            <RouterLink :to="{ path: '/informacion', hash: enlace.hash }">{{ enlace.texto }}</RouterLink>
          </li>
        </ul>
      </nav>
      <address>
        <h2>Contáctanos</h2>
        <p><i class="fa-solid fa-phone i-tel"></i> +57 301 987 6543</p>
        <p><i class="fa-regular fa-envelope i-correo"></i> info@example.com</p>
        <p><i class="fa-solid fa-location-dot i-lugar"></i> Córdoba, Colombia</p>
      </address>
    </div>
    <p class="derechos">© 2026 Moonflower. Todos los derechos reservados.</p>
  </footer>
</template>
