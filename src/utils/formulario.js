// Formularios reactivos: guarda los valores, calcula los errores en tiempo real
// y solo muestra el error de un campo cuando la persona ya escribió o salió de él.

import { reactive, computed, isReactive } from "vue";

// "origen" puede ser un objeto normal (se copia) o un objeto reactivo que ya existe (se usa tal cual)
export function useFormulario(reglasPorCampo, origen = {}) {
  const valores = isReactive(origen) ? origen : reactive({ ...origen });
  const tocados = reactive({});

  const errores = computed(() => {
    const resultado = {};
    for (const campo in reglasPorCampo) {
      resultado[campo] = reglasPorCampo[campo](valores[campo] ?? "");
    }
    return resultado;
  });

  // los errores que se ven: solo los de campos que ya se tocaron
  const visibles = computed(() => {
    const resultado = {};
    for (const campo in reglasPorCampo) {
      resultado[campo] = tocados[campo] ? errores.value[campo] : "";
    }
    return resultado;
  });

  function tocar(campo) {
    tocados[campo] = true;
  }

  // Se usa al enviar: marca todos los campos y dice si el formulario está bien
  function validarTodo() {
    for (const campo in reglasPorCampo) {
      tocados[campo] = true;
    }
    return !Object.values(errores.value).some((mensaje) => mensaje !== "");
  }

  function reiniciar(nuevos = {}) {
    for (const campo of Object.keys(valores)) {
      valores[campo] = nuevos[campo] ?? "";
    }
    for (const campo in reglasPorCampo) {
      tocados[campo] = false;
    }
  }

  return { valores, errores, visibles, tocar, validarTodo, reiniciar };
}
