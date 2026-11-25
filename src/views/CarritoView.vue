<script setup>
// Carrito: tabla con los productos, total y datos de entrega. El pedido se manda a la API.

import { ref, computed, watch, onMounted } from "vue";
import CantidadInput from "../components/CantidadInput.vue";
import CampoForm from "../components/CampoForm.vue";
import EstadoCarga from "../components/EstadoCarga.vue";
import ModalConfirmacion from "../components/ModalConfirmacion.vue";
import { catalogo, cargarCatalogo, reintentarCatalogo } from "../stores/catalogo.js";
import { carrito, cambiarCantidad, quitarDelCarrito, vaciarCarrito } from "../stores/carrito.js";
import { registrarPedido } from "../stores/pedidos.js";
import { enviarPedido } from "../services/api.js";
import { precioFinal, enPesos, totalRamo, fechaDeHoy } from "../utils/precios.js";
import { useFormulario } from "../utils/formulario.js";
import { reglas } from "../utils/validar.js";
import { leer, guardar } from "../utils/almacen.js";

onMounted(cargarCatalogo);

// Una línea por cada cosa del carrito, con su precio calculado desde data.json
const lineas = computed(() => {
  if (!catalogo.datos) return [];
  const resultado = [];
  carrito.items.forEach((item, indice) => {
    if (item.tipo === "ramo") {
      const precio = totalRamo(item.ramo, catalogo.datos);
      const flores = item.ramo.flores.map((f) => f.cantidad + " " + f.nombre.toLowerCase()).join(", ");
      const complementos = item.ramo.complementos
        .map((id) => {
          const dato = catalogo.datos.complementos.find((c) => c.id === id);
          return dato ? dato.nombre.toLowerCase() : id;
        })
        .join(", ");
      resultado.push({
        indice,
        esRamo: true,
        nombre: "Ramo personalizado",
        detalle: flores + (complementos ? " + " + complementos : "") + (item.ramo.destinatario ? ". Para " + item.ramo.destinatario : ""),
        precio,
        cantidad: 1
      });
    } else {
      const producto = catalogo.datos.productos.find((p) => p.id === item.id);
      if (producto) {
        resultado.push({
          indice,
          esRamo: false,
          nombre: producto.nombre,
          detalle: enPesos(precioFinal(producto)) + " c/u",
          precio: precioFinal(producto),
          cantidad: item.cantidad
        });
      }
    }
  });
  return resultado;
});

const total = computed(() => lineas.value.reduce((suma, l) => suma + l.precio * l.cantidad, 0));

// datos de entrega: se recuperan de la última vez y se guardan mientras se escribe
const guardados = leer("entrega", {});
const fechaDelRamo = (carrito.items.find((i) => i.tipo === "ramo" && i.ramo.fecha) || { ramo: {} }).ramo.fecha || "";
const f = useFormulario(
  { nombreCompleto: reglas.nombreCompleto, telefono: reglas.telefono, correo: reglas.correo, direccion: reglas.direccion, fecha: reglas.fecha },
  {
    nombreCompleto: guardados.nombre || "",
    telefono: guardados.telefono || "",
    correo: guardados.correo || "",
    direccion: guardados.direccion || "",
    fecha: fechaDelRamo >= fechaDeHoy() ? fechaDelRamo : "",
    notas: ""
  }
);

watch(
  () => [f.valores.nombreCompleto, f.valores.telefono, f.valores.correo, f.valores.direccion],
  ([nombre, telefono, correo, direccion]) => guardar("entrega", { nombre, telefono, correo, direccion })
);

const enviando = ref(false);
const modalAbierto = ref(false);
const resultado = ref(null);

async function confirmar() {
  if (!f.validarTodo() || lineas.value.length === 0) return;
  enviando.value = true;

  const pedido = {
    cliente: {
      nombre: f.valores.nombreCompleto.trim(),
      telefono: f.valores.telefono.trim(),
      correo: f.valores.correo.trim(),
      direccion: f.valores.direccion.trim()
    },
    fecha: f.valores.fecha,
    notas: f.valores.notas.trim(),
    items: lineas.value.map((l) => {
      const item = carrito.items[l.indice];
      return item.tipo === "ramo"
        ? { tipo: "ramo", ramo: item.ramo, precio: l.precio }
        : { tipo: "producto", id: item.id, nombre: l.nombre, cantidad: l.cantidad, precioUnitario: l.precio };
    }),
    total: total.value,
    creado: new Date().toISOString()
  };

  const respuesta = await enviarPedido(pedido);
  enviando.value = false;

  const registro = {
    id: respuesta.enviado && respuesta.datos.id ? String(respuesta.datos.id) : "local-" + Date.now().toString(36),
    total: pedido.total,
    fecha: pedido.fecha,
    enviado: respuesta.enviado
  };
  registrarPedido(registro);
  resultado.value = { ...registro, motivo: respuesta.motivo };
  vaciarCarrito();
  f.reiniciar();
  modalAbierto.value = true;
}
</script>

<template>
  <main class="carrito">
    <h1>Tu carrito</h1>

    <EstadoCarga
      :cargando="catalogo.cargando"
      :error="catalogo.error"
      mensaje="Cargando tu carrito..."
      @reintentar="reintentarCatalogo"
    >
      <template v-if="catalogo.datos">
        <section class="carrito-contenido">
          <div v-if="lineas.length === 0">
            <p>Tu carrito está vacío.</p>
            <p>
              <RouterLink class="boton" to="/productos">Ver productos</RouterLink>
              <RouterLink class="boton-borde" to="/crea-tu-ramo">Crea tu ramo</RouterLink>
            </p>
          </div>
          <div v-else>
            <table class="tabla-carrito">
              <caption class="solo-lectores">Productos en tu carrito</caption>
              <thead>
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col">Cantidad</th>
                  <th scope="col">Subtotal</th>
                  <th scope="col"><span class="solo-lectores">Quitar</span></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="linea in lineas" :key="linea.indice + linea.nombre">
                  <td>
                    <strong>{{ linea.nombre }}</strong>
                    <small>{{ linea.detalle }}</small>
                  </td>
                  <td>
                    <span v-if="linea.esRamo">1 ramo</span>
                    <CantidadInput
                      v-else
                      :min="1"
                      :etiqueta="'Cantidad de ' + linea.nombre"
                      :modelValue="linea.cantidad"
                      @update:modelValue="(cantidad) => cambiarCantidad(linea.indice, cantidad)"
                    />
                  </td>
                  <td>{{ enPesos(linea.precio * linea.cantidad) }}</td>
                  <td>
                    <button type="button" class="quitar" :aria-label="'Quitar ' + linea.nombre + ' del carrito'" @click="quitarDelCarrito(linea.indice)">Quitar</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p class="total-carrito">Total: <strong>{{ enPesos(total) }}</strong></p>
          </div>
        </section>

        <section v-if="lineas.length > 0" class="formulario" id="datos-entrega">
          <h2>Datos de entrega</h2>
          <form novalidate @submit.prevent="confirmar">
            <CampoForm id="nombre" etiqueta="Nombre completo" placeholder="Tu nombre completo" v-model="f.valores.nombreCompleto" :error="f.visibles.nombreCompleto" @tocar="f.tocar('nombreCompleto')" />
            <CampoForm id="telefono" etiqueta="Teléfono" tipo="tel" placeholder="3001234567" v-model="f.valores.telefono" :error="f.visibles.telefono" @tocar="f.tocar('telefono')" />
            <CampoForm id="correo" etiqueta="Correo electrónico" tipo="email" placeholder="ejemplo@correo.com" v-model="f.valores.correo" :error="f.visibles.correo" @tocar="f.tocar('correo')" />
            <CampoForm id="direccion" etiqueta="Dirección de entrega" placeholder="Calle, número y barrio" :maxlength="100" v-model="f.valores.direccion" :error="f.visibles.direccion" @tocar="f.tocar('direccion')" />
            <CampoForm id="fecha" etiqueta="Fecha de entrega" tipo="date" :min="fechaDeHoy()" v-model="f.valores.fecha" :error="f.visibles.fecha" @tocar="f.tocar('fecha')" />
            <CampoForm id="notas" etiqueta="Notas para la entrega (opcional)" tipo="textarea" :filas="3" :maxlength="200" :obligatorio="false" v-model="f.valores.notas" />
            <button type="submit" class="boton" :disabled="enviando">{{ enviando ? "Enviando..." : "Confirmar pedido" }}</button>
          </form>
        </section>
      </template>
    </EstadoCarga>

    <ModalConfirmacion :abierto="modalAbierto" :titulo="resultado && resultado.enviado ? 'Pedido recibido' : 'Pedido guardado'" @cerrar="modalAbierto = false">
      <template v-if="resultado">
        <p v-if="resultado.enviado">Tu número de pedido es <strong>{{ resultado.id }}</strong> y el total es {{ enPesos(resultado.total) }}.</p>
        <p v-else>
          El pedido <strong>{{ resultado.id }}</strong> (total {{ enPesos(resultado.total) }}) quedó guardado solo en este navegador y no se envió a la tienda.
          <span v-if="resultado.motivo">Motivo: {{ resultado.motivo }}</span>
        </p>
        <p><RouterLink class="enlace-carrito" to="/productos" @click="modalAbierto = false">Seguir viendo productos</RouterLink></p>
      </template>
    </ModalConfirmacion>
  </main>
</template>
