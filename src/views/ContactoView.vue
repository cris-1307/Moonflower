<script setup>
// Contacto: formulario con validación en tiempo real. Lo escrito se guarda como borrador
// y el mensaje se manda a la API.

import { ref, watch } from "vue";
import CampoForm from "../components/CampoForm.vue";
import { useFormulario } from "../utils/formulario.js";
import { reglas } from "../utils/validar.js";
import { leer, guardar, borrar } from "../utils/almacen.js";
import { enviarMensaje } from "../services/api.js";
import { registrarMensaje } from "../stores/pedidos.js";

const asuntos = [
  { valor: "duda", texto: "Duda" },
  { valor: "sugerencia", texto: "Sugerencia" },
  { valor: "pedido", texto: "Pedido especial" }
];

const borrador = leer("borrador-contacto", {});
const f = useFormulario(
  { nombre: reglas.nombreCompleto, correo: reglas.correo, asunto: reglas.asunto, mensaje: reglas.mensaje },
  { nombre: borrador.nombre || "", correo: borrador.correo || "", asunto: borrador.asunto || "", mensaje: borrador.mensaje || "" }
);

// el borrador se guarda mientras se escribe, así sigue ahí si se recarga la página
watch(f.valores, (valores) => guardar("borrador-contacto", { ...valores }), { deep: true });

const enviando = ref(false);
const respuesta = ref({ tipo: "", texto: "" });

async function enviar() {
  respuesta.value = { tipo: "", texto: "" };
  if (!f.validarTodo()) return;
  enviando.value = true;

  const mensaje = {
    nombre: f.valores.nombre.trim(),
    correo: f.valores.correo.trim(),
    asunto: f.valores.asunto,
    mensaje: f.valores.mensaje.trim(),
    creado: new Date().toISOString()
  };
  const resultado = await enviarMensaje(mensaje);
  enviando.value = false;

  registrarMensaje({ ...mensaje, enviado: resultado.enviado });
  borrar("borrador-contacto");
  f.reiniciar();

  if (resultado.enviado) {
    respuesta.value = { tipo: "confirmacion", texto: "¡Gracias, " + mensaje.nombre + "! Tu mensaje llegó a la tienda." };
  } else {
    respuesta.value = {
      tipo: "aviso error",
      texto: "Tu mensaje quedó guardado solo en este navegador y la tienda no lo ha recibido. " + (resultado.motivo || "")
    };
  }
}
</script>

<template>
  <main class="contacto">
    <section class="formulario">
      <h1><i class="fa-regular fa-envelope"></i> Envíanos un mensaje</h1>
      <p>¿Tienes alguna duda, sugerencia o quieres hacer un pedido especial? Escríbenos, estaremos felices de ayudarte.</p>
      <form novalidate @submit.prevent="enviar">
        <CampoForm id="nombre" etiqueta="Nombre" placeholder="Tu nombre completo" v-model="f.valores.nombre" :error="f.visibles.nombre" @tocar="f.tocar('nombre')" />
        <CampoForm id="correo" etiqueta="Correo electrónico" tipo="email" placeholder="ejemplo@correo.com" v-model="f.valores.correo" :error="f.visibles.correo" @tocar="f.tocar('correo')" />
        <CampoForm id="asunto" etiqueta="Asunto" tipo="select" :opciones="asuntos" v-model="f.valores.asunto" :error="f.visibles.asunto" @tocar="f.tocar('asunto')" />
        <CampoForm id="mensaje" etiqueta="Mensaje" tipo="textarea" placeholder="Escribe tu mensaje aquí..." :maxlength="500" v-model="f.valores.mensaje" :error="f.visibles.mensaje" @tocar="f.tocar('mensaje')" />
        <button type="submit" class="boton" :disabled="enviando">
          {{ enviando ? "Enviando..." : "Enviar mensaje" }} <i class="fa-regular fa-paper-plane"></i>
        </button>
      </form>
      <p v-if="respuesta.texto" :class="respuesta.tipo" role="status">{{ respuesta.texto }}</p>
    </section>

    <aside class="datos">
      <h2>Información de contacto</h2>
      <ul>
        <li><i class="fa-solid fa-phone"></i> <span>Teléfono<br />+57 301 987 6543</span></li>
        <li><i class="fa-regular fa-envelope"></i> <span>Correo electrónico<br />info@example.com</span></li>
        <li><i class="fa-solid fa-location-dot"></i> <span>Ubicación<br />Córdoba, Colombia</span></li>
        <li><i class="fa-regular fa-clock"></i> <span>Horario de atención<br />Lunes a Sábado, 8:00 a.m. - 6:00 p.m.</span></li>
      </ul>
      <h2>Síguenos</h2>
      <ul class="redes">
        <li><a class="ig" href="#" aria-label="Instagram" @click.prevent><i class="fa-brands fa-instagram"></i></a></li>
        <li><a class="tt" href="#" aria-label="TikTok" @click.prevent><i class="fa-brands fa-tiktok"></i></a></li>
        <li><a class="fb" href="#" aria-label="Facebook" @click.prevent><i class="fa-brands fa-facebook-f"></i></a></li>
        <li><a class="yt" href="#" aria-label="YouTube" @click.prevent><i class="fa-brands fa-youtube"></i></a></li>
        <li><a class="xx" href="#" aria-label="X" @click.prevent><i class="fa-brands fa-x-twitter"></i></a></li>
      </ul>
    </aside>
  </main>
</template>
