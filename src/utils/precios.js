// Precios: descuento, formato en pesos colombianos y total de un ramo armado

export function precioFinal(producto) {
  const descuento = producto.descuento || 0;
  return Math.round((producto.precio * (100 - descuento)) / 100);
}

export function enPesos(valor) {
  return "$" + Number(valor).toLocaleString("es-CO");
}

// Total de un ramo de Crea tu ramo: flores + complementos
export function totalRamo(ramo, catalogo) {
  let total = 0;
  for (const flor of ramo.flores || []) {
    const dato = catalogo.flores.find((f) => f.id === flor.id);
    if (dato) total += dato.precio * flor.cantidad;
  }
  for (const id of ramo.complementos || []) {
    const dato = catalogo.complementos.find((c) => c.id === id);
    if (dato) total += dato.precio;
  }
  return total;
}

// URL de una foto de la carpeta public/fotos (sirve con cualquier "base" de Vite)
export function foto(nombre) {
  return import.meta.env.BASE_URL + "fotos/" + nombre;
}

export function fechaDeHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return hoy.getFullYear() + "-" + mes + "-" + dia;
}
