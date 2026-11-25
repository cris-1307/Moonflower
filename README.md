# Moonflower

Tienda web de una floristería hecha con Vue 3, Vite y Vue Router. Se pueden ver ramos y combos por categorías, buscar un producto, armar un ramo propio, llenar un carrito y mandar el pedido o un mensaje de contacto.

Proyecto de Desarrollo Web, Ingeniería de Sistemas, Universidad de Córdoba. Entrega final.

Autora: Cristina Maria Benavides Martinez

Aplicación publicada: https://cris-1307.github.io/Moonflower/

La versión anterior del proyecto (HTML, CSS y JavaScript sin framework) quedó guardada en la etiqueta `avance2` de este repositorio.

## Qué se puede hacer

- Ver el inicio con un carrusel de destacados y la sección de promociones. Las promociones salen de los productos de `public/data.json` que tienen `descuento`.
- Ver productos y combos por categoría, con el número de productos de cada una, y abrir el detalle de cada producto.
- Buscar un producto por nombre. La lista se filtra mientras se escribe.
- Agregar productos al carrito, cambiar las cantidades y confirmar el pedido con los datos de entrega.
- Armar un ramo en 4 pasos (flores, personalizar, complementos y revisar). En el panel "Tu ramo" hay un carrusel con ramos de ejemplo, y el botón "Usar este ejemplo" carga uno para seguir editándolo. El precio se ve mientras se arma.
- Escribir desde Contacto. Si se recarga la página, lo que estaba escrito queda como borrador.

El carrito, el ramo que se está armando, los datos de entrega y el borrador de contacto se guardan en el navegador (`localStorage`), así que siguen ahí después de recargar.

## Cómo ejecutarlo

Hace falta Node.js 18 o más nuevo (descargar la versión LTS desde https://nodejs.org). Dentro de la carpeta del proyecto:

```
npm install
npm run dev
```

La aplicación se abre en http://localhost:5173. Para probar la versión de producción:

```
npm run build
npm run preview
```

Si la terminal dice que `npm` no se reconoce, Node no está instalado o falta cerrar y volver a abrir la terminal. Si PowerShell bloquea los scripts, se arregla una vez con `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## Estructura de carpetas

```
Moonflower/
├── index.html
├── package.json
├── vite.config.js
├── .env.example             variables VITE_API_URL y VITE_CORREO_URL
├── .github/workflows/       publicación automática en GitHub Pages
├── public/
│   ├── data.json            productos, flores, complementos, envolturas y ramos de ejemplo
│   └── fotos/
└── src/
    ├── main.js              crea la app y conecta el router
    ├── App.vue              encabezado, página actual, pie y botones flotantes
    ├── router/index.js      rutas
    ├── views/               una vista por página
    ├── components/          piezas que se repiten: tarjeta, carrusel, campos, pasos del ramo, modal
    ├── stores/              estado compartido: carrito, ramo, catálogo y pedidos
    ├── services/api.js      peticiones con fetch
    ├── utils/               precios, reglas de validación, localStorage y formularios
    └── assets/styles.css
```

## Rutas

| Ruta | Vista |
|---|---|
| `/` | Inicio |
| `/productos` y `/productos/:categoria` | Productos (ramos, cajas, arreglos, detalles) |
| `/combos` y `/combos/:categoria` | Catálogo de combos (chocolates, vino, románticos) |
| `/producto/:id` | Detalle de un producto |
| `/buscar` | Buscador |
| `/crea-tu-ramo` | Crea tu ramo |
| `/carrito` | Carrito y datos de entrega |
| `/contacto` | Contacto |
| `/informacion` | Quiénes somos, términos, privacidad y preguntas |
| cualquier otra | Página no encontrada |

El router usa el modo hash, así que las direcciones se ven como `/#/productos`. Con eso, recargar la página no da error 404 en GitHub Pages, Netlify ni Vercel y no hay que configurar redirecciones.

## Cómo está hecho

Componentes. Cada página es una vista en `src/views` y lo que se repite está en `src/components`. Los datos bajan por props (`TarjetaProducto` recibe el `producto`) y los avisos suben por eventos (`agregar`, `usar`, `reintentar`). Los campos de formulario y el selector de cantidad usan `v-model`.

Estado compartido. El carrito, el ramo, el catálogo y el historial de pedidos son objetos `reactive` en `src/stores`. Cualquier vista los importa y todas ven lo mismo, por eso el contador del carrito en el encabezado cambia solo. Un `watch` guarda cada cambio en `localStorage`. No usé Pinia porque `reactive` alcanzaba para este tamaño de proyecto.

Peticiones. `src/services/api.js` usa `fetch` con `async` y `await`. Los errores 404 y 500, la falta de conexión y un JSON dañado se convierten en mensajes claros, y el componente `EstadoCarga` muestra el aviso de carga, o el error con un botón para reintentar.

Validación. Las reglas están en `src/utils/validar.js` y el composable `src/utils/formulario.js` calcula los errores en tiempo real. El error de un campo se muestra cuando se escribe en él o se sale de él, y al enviar se revisan todos.

## Pedidos, mensajes y correo

El catálogo se lee de `public/data.json`. Los pedidos y los mensajes de contacto se mandan con `POST` a una API REST hecha en MockAPI (https://mockapi.io):

1. Crear un proyecto en MockAPI con dos recursos: `pedidos` y `mensajes`.
2. Copiar `.env.example` como `.env.local` y poner la URL del proyecto en `VITE_API_URL`, por ejemplo `https://xxxxxxxx.mockapi.io/api/v1`.
3. Para la página publicada, poner esa misma línea en un archivo `.env.production`. La URL de MockAPI no es secreta, por eso ese archivo se sube al repositorio.

MockAPI solo guarda los datos y no manda correos. Para recibir un correo con cada pedido y cada mensaje se usa Formspree (https://formspree.io), que tiene plan gratuito:

1. Crear una cuenta con el correo que va a recibir los avisos y crear un formulario nuevo.
2. Copiar su dirección (`https://formspree.io/f/xxxxxxxx`) en `VITE_CORREO_URL`, en `.env.local` para probar y en `.env.production` para la página publicada.
3. Hacer un primer envío de prueba. Formspree manda un correo de confirmación que hay que abrir una vez.

El correo trae los datos del cliente, los productos y el total. Si no hay ninguna de las dos variables, la tienda funciona igual, pero el pedido o el mensaje solo queda guardado en el navegador y la pantalla lo avisa. Como el servidor no recalcula nada, el total lo calcula la propia página con los precios de `data.json`.

## Publicación

GitHub Pages: en el repositorio, Settings, Pages, Source y elegir GitHub Actions. El archivo `.github/workflows/deploy.yml` construye el proyecto y lo publica cada vez que se hace push a `main`. En `vite.config.js` la `base` es `./`, por eso las fotos y `data.json` cargan bien desde la subcarpeta del repositorio.

Netlify o Vercel: importar el repositorio, comando de construcción `npm run build` y carpeta de salida `dist`.

## Cambiar precios y fotos

- Los precios de las flores y los complementos, y los descuentos de las promociones, son de ejemplo. Se cambian en `public/data.json`.
- Una foto se cambia reemplazando el archivo con el mismo nombre. Los tamaños recomendados están en `public/fotos/LEEME.txt`.
- Los datos de contacto del pie de página (correo y redes) son de relleno.
