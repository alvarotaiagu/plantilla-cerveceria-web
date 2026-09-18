# TRASFEGA — plantilla de obrador de cerveza artesanal

> **Sitio de demostración. TRASFEGA es un negocio ficticio.** Nombre, dirección,
> teléfono, horarios, cervezas, números de lote, graduaciones, precios de las
> visitas y equipo son datos de muestra inventados para enseñar la plantilla. No
> corresponden a ninguna fábrica, marca ni persona real. La página lleva
> `noindex, nofollow` y no publica valoraciones en sus datos estructurados.
>
> **+18.** Contenido sobre bebidas alcohólicas.

**Demo:** https://alvarotaiagu.github.io/plantilla-cerveceria-web/

Web estática: HTML + CSS + un `main.js`. Sin framework, sin build, sin backend y
sin npm. GSAP, ScrollTrigger y Lenis por CDN; con el CDN caído la página se lee
entera y el esquema del obrador aparece con todos los recipientes llenos, que es
su estado legible.

---

## El concepto: «Trasfega»

Trasfegar es pasar el líquido de un recipiente a otro dejando atrás lo que sobra.
Entre el saco de malta y la lata, una cerveza lo hace cinco veces, y la web hace
exactamente lo mismo:

- **La sección central ancla la página y el líquido va cambiando de casa**:
  se llena el macerador, se vacía hacia la caldera, de ahí al fermentador y de
  ahí al envasado, mientras el paso activo se escribe al lado. No es una
  metáfora: es el recorrido real de una colada.
- **El hero es la materia prima cayendo**: un `<canvas>` con malta que cae al
  molino y se amontona abajo, y el montón se va deshaciendo conforme el molino
  lo traga.
- **Cada cerveza es un lote**, con su número, su fecha de envasado y su color
  real en un círculo. Los datos van escritos en la lata, no solo en la web.
- **Somos fábrica, no bar**, y la estructura lo dice: proceso, lotes, obrador,
  visitas y dónde encontrarla. No hay carta ni reservas de mesa.

## Registro visual

| | |
|---|---|
| **Paleta** | fondo `#0C0D0F`, panel `#15171A`, línea `#262A2F`, acero `#3A4048`, humo `#A9AFB8`, hueso `#EDEFF2` y un único acento: magenta `#FF2E8A` |
| **Tipografía** | Antonio (titulares y cifras), Chivo Mono (rótulos y datos de lote), Chivo (texto) |
| **Movimiento protagonista** | la trasfega anclada: el líquido pasa de recipiente en recipiente con el scroll |
| **Tono** | nave industrial de noche, etiqueta serigrafiada, cero épica artesanal |

Los colores de cerveza (ámbar, tostado, negro) **no son parte de la paleta**:
aparecen solo como dato, en el círculo de cada lote y en el líquido del esquema.

## Mapa de secciones

1. **Hero** — canvas de malta cayendo, la cifra de la colada y el aviso de +18.
2. **Franja** — marquesina de materias primas ligada a la velocidad del scroll.
3. **01 · El proceso** — la trasfega anclada, cinco recipientes (protagonista).
4. **02 · Las cervezas** — seis lotes: cuatro fijas y dos de temporada, con el
   aviso de alcohol al pie de la sección.
5. **03 · El obrador** — cuatro contadores y el equipo, presentado por su
   herramienta.
6. **04 · Visitas** — tres modalidades con precios de muestra, una de ellas sin
   cata para quien conduce.
7. **05 · Dónde está** — cuatro canales, sin listas de clientes reales ni
   inventados.
8. **06 · Preguntas** — acordeón nativo (`<details>`).
9. **07 · Pedidos** — formulario de muestra con casilla de mayoría de edad y mapa
   solo bajo clic.
10. **Pie** — aviso +18 y sello de demostración.

## Recursos de movimiento

| Recurso | Dónde |
|---|---|
| Lenis como único motor de scroll | toda la página (`lerp: 0.17`) |
| Canvas propio del concepto | hero: malta cayendo y montón que se deshace |
| Escena anclada con scrub | la trasfega (protagonista) |
| Revelado palabra a palabra | todos los titulares con `data-revelar` |
| Marquesina ligada a la velocidad del scroll | franja de materias primas |
| Contadores | cifras del obrador |
| Botones magnéticos | todos los `[data-iman]` |
| Cursor contextual en forma de gota | sobre el esquema, los lotes y las visitas |
| Paso activo con observador de intersección | funciona también sin GSAP |

## Rendimiento medido (no solo construido)

El pliego pide verificar el canvas con `PerformanceObserver` de `longtask`, no
mirando los FPS. La página lleva el observador montado (`window.__tareasLargas`,
con la marca de tiempo de `document.fonts.ready` en `window.__tFuentes`) para
poder separar las tareas largas de carga de las de animación.

Medido en Chromium 1440×900, sirviendo la carpeta en local:

| Momento | Tareas largas | Peor |
|---|---|---|
| Arranque (primeros 3 s: GSAP + webfonts) | 2 | 126 ms |
| **25 s con el canvas vivo y scroll arriba y abajo** | **0** | **0 ms** |

Las dos del arranque son las que el pliego ya avisa que son de GSAP y de las
webfonts, no del código propio. La medida se hizo con un observador
independiente inyectado antes de cargar la página, y se validó con una tarea de
control de 220 ms lanzada con `setTimeout` para comprobar que el observador
captura de verdad (una tarea lanzada desde el protocolo de depuración **no**
cuenta como longtask de la página, y por eso una primera medida daba cero
falso).

Reglas que sigue el canvas: grano cacheado como sprite fuera de pantalla y
pintado con `drawImage`, nada de `ctx.filter` ni `shadowBlur` por fotograma,
DPR capado a 2, número de granos según el ancho, y parada por
`IntersectionObserver` y por `visibilitychange`.

## Qué tocar para reskinear a un cliente real

1. **Datos del negocio.** `index.html` (bloque `ld+json`, sección `#pedidos` y
   pie), `aviso-legal.html`, `manifest.json` y este README. Busca `trasfega`,
   `981 00 00 00`, `Rúa do Bocoi` y `Betanzos`.
2. **Quitar el sello de demostración**: el comentario HTML de la primera línea de
   cada página, el párrafo `.sello` del pie, el `<meta name="robots">` y los
   avisos de este README. **El aviso de +18 se queda**: no es del sello de demo,
   es del sector.
3. **Las cervezas.** Cada `<li class="lote">` es una cerveza; el color del
   círculo se declara en el propio HTML con `style="--tono:#RRGGBB"`. Hay que
   poner los datos reales de la última colada y mantenerlos sincronizados con la
   etiqueta del envase.
4. **El proceso.** Los cinco `<li class="paso">` y los cinco `<g class="vaso">`
   del SVG comparten el atributo `data-vaso`. Los niveles de líquido son
   `<rect class="liquido">` recortados por un `clipPath`; su geometría está en el
   array `vasos` de `js/main.js` (`fondo` y `alto` en unidades del viewBox). Si
   el obrador tiene un recipiente más, se añade la pareja y su entrada al array.
5. **Paleta.** Las variables de `:root` en `css/style.css`; el acento vive en
   `--magenta` y se propaga a rótulos, cifras, cursor y bordes.
6. **Tipografía.** El `<link>` de Google Fonts en las tres páginas y las
   variables `--display`, `--mono` y `--texto`.
7. **Visitas y precios.** Tres tarjetas en `#visitas`; hay que quitar la etiqueta
   «importes inventados» al poner los de verdad.

## Decisiones tomadas

- **Cero fotografía y cero caras.** No hay generador de imágenes, y una foto de
  archivo presentada como «Sabela, control y envasado» convierte a una persona
  real en personaje inventado. El equipo se presenta por su herramienta.
- **El alcohol se trata como lo que es.** Aviso de +18 en el hero, al pie de la
  sección de cervezas y en el pie de página; casilla de mayoría de edad en el
  formulario; una modalidad de visita sin cata para quien conduce; y ninguna
  frase que sugiera que la cerveza es buena para la salud. El aviso legal lo
  desarrolla.
- **Ni premios ni medallas.** Es la tentación número uno en este sector y aquí no
  hay ninguno: inventar un premio de un concurso real sería atribuir un
  reconocimiento falso a una plataforma existente.
- **Sin lista de bares clientes.** Ni reales (no se puede) ni inventados (parecen
  reales). La sección «Dónde está» explica los canales sin nombrar negocios.
- **El mapa apunta a la localidad**, nunca a una calle: la dirección es
  inventada y no queremos señalar el portal de nadie.
- **Sin `aggregateRating` ni `review`** en `schema.org`.
- **Movimiento reducido**: se apaga el movimiento, no el contenido. El paso
  activo se sigue marcando, los contadores muestran su cifra final y el canvas
  pinta un fotograma fijo.

## Verificación

Ver `screenshots/`: capturas a 1440×900 y 390×844, más las pasadas con GSAP
bloqueado y con `prefers-reduced-motion: reduce`. Consola limpia, sin peticiones
fallidas y sin imágenes rotas; probados a mano el botón de cookies, el menú
móvil, el botón del mapa y el formulario (incluida la casilla de +18).

## Licencia de uso

Plantilla de muestra propiedad de su autor. El contenido es ficticio y no puede
presentarse como un negocio real.

---

## La cortina de entrada

Obligatoria en toda la biblioteca, y **el gesto sale del concepto de esta
plantilla**, no es la misma cortina repintada: aquí el sifón baja, y el **nivel se trasiega**: la superficie entera desciende con su menisco —la curva del líquido— por delante, aplanándose al final.

La mecánica es la de siempre: línea de tiempo encadenada, `expo.inOut`, borde
curvo y **entrega limpia al hero** —el revelado del titular arranca mientras la
cortina todavía se está yendo, no después—.

**Se retira siempre.** Sin GSAP y con `prefers-reduced-motion` la hoja de estilos
ni la pinta (`html:not(.has-motion) .cortina{display:none}`), y con movimiento hay
una red de seguridad por tiempo en `main.js` que la quita y lanza el arranque
pase lo que pase, para que la página no pueda quedarse tapada si una animación se
atasca o las tipografías no resuelven.
