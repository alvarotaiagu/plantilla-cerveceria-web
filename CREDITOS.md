# Créditos y procedencia de los recursos

**Sitio de demostración. TRASFEGA es un negocio ficticio. Contenido para mayores
de 18 años.**

## Imágenes

Esta plantilla **no usa ninguna fotografía**. Toda la obra gráfica es SVG dibujado
a mano para este repo, más un `<canvas>` escrito para el hero:

| Archivo | Qué es |
|---|---|
| `assets/logo.svg` | Marca: fermentador cilindrocónico con el nivel de líquido en magenta. |
| `assets/favicon.svg` | La misma marca sobre fondo oscuro. |
| `assets/util-tanque.svg` | Ilustración de un fermentador de 1.000 litros. |
| `assets/util-densimetro.svg` | Ilustración de una probeta con densímetro. |
| `assets/util-saco.svg` | Ilustración de sacos de malta y una pala. |
| `assets/og.png` | Imagen para compartir (1200×630), generada de una composición HTML propia. |
| Esquema del obrador | SVG en línea en `index.html`: cinco recipientes y sus tuberías. |
| Hero | `<canvas>` con malta cayendo y amontonándose, en `js/main.js`. |

El equipo se presenta **con su herramienta, no con su cara**: el negocio es
ficticio y no queremos que ninguna persona real parezca trabajar aquí. Al
reskinear para un cliente real se sustituyen por fotos del equipo con su permiso.

Los círculos de color de cada cerveza son un dato (el color aproximado del
líquido), no parte de la paleta: se declaran con la variable `--tono` en el
propio HTML.

## Tipografías

| Familia | Uso | Licencia |
|---|---|---|
| [Antonio](https://fonts.google.com/specimen/Antonio) | Titulares, cifras y nombres de cerveza | SIL Open Font License 1.1 |
| [Chivo Mono](https://fonts.google.com/specimen/Chivo+Mono) | Rótulos, datos de lote y botones | SIL Open Font License 1.1 |
| [Chivo](https://fonts.google.com/specimen/Chivo) | Texto corrido | SIL Open Font License 1.1 |

## Librerías

| Librería | Versión | Origen | Licencia |
|---|---|---|---|
| GSAP + ScrollTrigger | 3.12.5 | jsDelivr | Licencia estándar de GreenSock |
| Lenis | 1.1.13 | jsDelivr | MIT |

## Mapa

`iframe` de Google Maps sin clave de API que **solo se inserta al pulsar el
botón** y que apunta a la localidad de Betanzos, nunca a una calle concreta: la
dirección del obrador es inventada.
