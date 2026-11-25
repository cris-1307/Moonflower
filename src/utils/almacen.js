// Guardar y leer datos en el navegador (localStorage) en formato JSON

export function leer(clave, valorPorDefecto) {
  try {
    const texto = localStorage.getItem(clave);
    return texto === null ? valorPorDefecto : JSON.parse(texto);
  } catch (error) {
    return valorPorDefecto; // JSON dañado o localStorage bloqueado
  }
}

export function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    // si el navegador no deja guardar, la app sigue funcionando sin persistencia
  }
}

export function borrar(clave) {
  try {
    localStorage.removeItem(clave);
  } catch (error) {
    // sin aviso: no hay nada que borrar
  }
}
