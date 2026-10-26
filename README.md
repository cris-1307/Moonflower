# Moonflower

Moonflower es un sitio web frontend para una floristería. Permite ver ramos y combos por categorías, conocer cada producto, armar un ramo paso a paso y enviar mensajes de contacto.

Proyecto académico, Ingeniería de Sistemas, Universidad de Córdoba.

Autora: Cristina Maria Benavides Martinez
# Moonflower

Moonflower es un sitio web frontend para una floristería. Permite ver ramos y combos por categorías, conocer cada producto, armar un ramo paso a paso y enviar mensajes de contacto.

Proyecto académico, Ingeniería de Sistemas, Universidad de Córdoba.

Autora: Cristina Maria Benavides Martinez

## Primera entrega

- HTML5 semántico (header, nav, main, section, article, aside y footer).
- Formularios con validación nativa (required, pattern, min, max, type="email" y type="date").
- Estilos en CSS3 con Grid y Flexbox.
- Diseño adaptable a celular, tablet y escritorio con tres breakpoints.
- Fuente e íconos cargados por CDN (Google Fonts y Font Awesome).

## Páginas

**Inicio (`index.html`)**
Tiene el banner principal y la sección "Ocasiones especiales" (aniversarios, grados, cumpleaños, amor y amistad, nacimientos). Cada ocasión lleva a la lista de productos.

**Productos (`html/producto/`)**
- `productos.html`: todos los productos.
- `productos-ramos.html`, `productos-cajas.html`, `productos-arreglos.html` y `productos-detalles.html`: una página por categoría, con un menú lateral para cambiar de una a otra.
- `ramo-*.html`: una página de detalle por cada ramo, con foto, precio, descripción y selector de cantidad.

**Catálogo (`html/catalogo/`)**
- `combos.html`: todos los combos ("Combos que enamoran").
- `combos-chocolates.html`, `combos-vino.html` y `combos-romanticos.html`: una página por categoría de combo.
- `combo-*.html`: una página de detalle por cada combo.

**Crea tu ramo (`html/crear-ramo/`)**
Se arma el ramo en 4 pasos, cada uno en su página:
1. `crear-ramo.html`: elegir las flores, con su cantidad, y la fecha de entrega.
2. `crear-personaliza.html`: nombre de quien recibe, mensaje de la tarjeta y envoltura.
3. `crear-complementos.html`: chocolates, vino, globo o peluche.
4. `crear-revisa.html`: datos de entrega para guardar el ramo.

**Contacto (`html/contacto/`)**
- `contacto.html`: formulario para enviar un mensaje y datos de contacto.
- `cuenta.html`: formulario para ingresar a la cuenta.
- `informacion.html`: quiénes somos, términos y condiciones, políticas de privacidad y preguntas.

## Estructura

```
moonflower/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── fotos/                (imágenes de los productos y del banner)
└── html/
    ├── producto/         (productos, categorías y detalle de ramos)
    ├── catalogo/         (combos, categorías y detalle de combos)
    ├── crear-ramo/       (los 4 pasos)
    └── contacto/         (contacto, cuenta e información)
```

## Decisiones técnicas

- **Una página por producto y por categoría.** Así cada enlace lleva a una página real, sin usar JavaScript. Las carpetas separan las páginas por sección para encontrarlas más fácil.
- **Un solo archivo de estilos.** Todas las páginas usan `css/styles.css`.
- **Grid y Flexbox.** Grid se usa en la estructura de la página, el pie y las listas de productos. Flexbox se usa en el menú, las tarjetas y las barras.
- **Mobile first.** Los estilos parten del celular y se amplían con media queries a 600px (tablet), 900px (escritorio) y 1200px (pantalla grande).
- **Menú de celular solo con CSS.** El botón de tres rayas usa un checkbox oculto, sin JavaScript.
- **Validación nativa.** Los formularios usan los atributos de HTML5 para validar los campos.
- **Imágenes.** El banner usa `<picture>` para cargar una foto distinta en celular y en computador. Las demás usan `<img>` con texto alternativo y carga diferida.
- **Fuente e íconos por CDN.** Se usan Poppins (Google Fonts) y Font Awesome.
- **Sin JavaScript por ahora.** Los botones "Agregar al carrito" y "Guardar ramo" todavía no guardan datos. Eso se hará en las siguientes entregas.

## Cómo ejecutarlo en local

Descarga el proyecto (Code > Download ZIP), descomprímelo y abre el archivo `index.html` en el navegador. Se necesita internet para que carguen la fuente y los íconos.

## Primera entrega

- HTML5 semántico (header, nav, main, section, article, aside y footer).
- Formularios con validación nativa (required, pattern, min, max, type="email" y type="date").
- Estilos en CSS3 con Grid y Flexbox.
- Diseño adaptable a celular, tablet y escritorio con tres breakpoints.
- Fuente e íconos cargados por CDN (Google Fonts y Font Awesome).

## Páginas

**Inicio (`index.html`)**
Tiene el banner principal y la sección "Ocasiones especiales" (aniversarios, grados, cumpleaños, amor y amistad, nacimientos). Cada ocasión lleva a la lista de productos.

**Productos (`html/producto/`)**
- `productos.html`: todos los productos.
- `productos-ramos.html`, `productos-cajas.html`, `productos-arreglos.html` y `productos-detalles.html`: una página por categoría, con un menú lateral para cambiar de una a otra.
- `ramo-*.html`: una página de detalle por cada ramo, con foto, precio, descripción y selector de cantidad.

**Catálogo (`html/catalogo/`)**
- `combos.html`: todos los combos ("Combos que enamoran").
- `combos-chocolates.html`, `combos-vino.html` y `combos-romanticos.html`: una página por categoría de combo.
- `combo-*.html`: una página de detalle por cada combo.

**Crea tu ramo (`html/crear-ramo/`)**
Se arma el ramo en 4 pasos, cada uno en su página:
1. `crear-ramo.html`: elegir las flores, con su cantidad, y la fecha de entrega.
2. `crear-personaliza.html`: nombre de quien recibe, mensaje de la tarjeta y envoltura.
3. `crear-complementos.html`: chocolates, vino, globo o peluche.
4. `crear-revisa.html`: datos de entrega para guardar el ramo.

**Contacto (`html/contacto/`)**
- `contacto.html`: formulario para enviar un mensaje y datos de contacto.
- `cuenta.html`: formulario para ingresar a la cuenta.
- `informacion.html`: quiénes somos, términos y condiciones, políticas de privacidad y preguntas.

## Estructura

```
moonflower/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── fotos/                (imágenes de los productos y del banner)
└── html/
    ├── producto/         (productos, categorías y detalle de ramos)
    ├── catalogo/         (combos, categorías y detalle de combos)
    ├── crear-ramo/       (los 4 pasos)
    └── contacto/         (contacto, cuenta e información)
```

## Decisiones técnicas

- **Una página por producto y por categoría.** Así cada enlace lleva a una página real, sin usar JavaScript. Las carpetas separan las páginas por sección para encontrarlas más fácil.
- **Un solo archivo de estilos.** Todas las páginas usan `css/styles.css`.
- **Grid y Flexbox.** Grid se usa en la estructura de la página, el pie y las listas de productos. Flexbox se usa en el menú, las tarjetas y las barras.
- **Mobile first.** Los estilos parten del celular y se amplían con media queries a 600px (tablet), 900px (escritorio) y 1200px (pantalla grande).
- **Menú de celular solo con CSS.** El botón de tres rayas usa un checkbox oculto, sin JavaScript.
- **Validación nativa.** Los formularios usan los atributos de HTML5 para validar los campos.
- **Imágenes.** El banner usa `<picture>` para cargar una foto distinta en celular y en computador. Las demás usan `<img>` con texto alternativo y carga diferida.
- **Fuente e íconos por CDN.** Se usan Poppins (Google Fonts) y Font Awesome.
- **Sin JavaScript por ahora.** Los botones "Agregar al carrito" y "Guardar ramo" todavía no guardan datos. Eso se hará en las siguientes entregas.

## Cómo ejecutarlo en local

No necesita instalar nada.Descarga el proyecto (Code > Download ZIP), descomprímelo y abre el archivo index.html en el navegador. Se necesita internet para que carguen la fuente y los íconos.

Activa GitHub Pages
