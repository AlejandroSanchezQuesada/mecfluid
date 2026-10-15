# AQUALAB — Mecánica de Fluidos (MECFLUID)

Juego educativo interactivo de mecánica de fluidos para el curso **MECFLUID**.
El jugador explora una instalación ficticia (la presa del Sector 11) y, guiado por un
narrador, resuelve retos que ilustran los principios físicos del tema: presión
manométrica, ecuación de Bernoulli, teorema de Torricelli, equilibrio de compuertas,
ecuación diferencial de la conservación de la energía en fluidos, etc.

Todo el sitio es **HTML/CSS/JavaScript estático**. No hay frameworks, bundlers ni
dependencias de ejecución: se sirve como archivos planos y funciona abriendo
`index.html` directamente (incluso por `file://`).

## Estructura

```
.
├── index.html        # Aplicación principal (SPA). Pantallas, retos y lógica.
├── styles.css        # Hoja de estilos global (extraída de index.html).
├── app.js            # Lógica del juego (extraída de index.html).
├── narrador.html     # Introducción narrativa del Sector 11.
├── alerta.html       # Pantalla de alerta / transición hacia los paneles de válvula.
├── capilar-test.html # Mini-juego autónomo (interfaz de capilar).
├── Servo1.html       # Panel de control de válvula 1 (MQTT hacia hardware real).
├── Servo2.html       # Panel de control de válvula 2 (MQTT).
├── Servo3.html       # Panel de control de válvula 3 / "Válvula 1" (MQTT).
└── *.png/*.jpg/*.gif # Recursos gráficos (imágenes y GIFs animados).
```

Las páginas `Servo1.html`, `Servo2.html` y `Servo3.html` son los paneles de mando de las
válvulas físicas del laboratorio: cargan la librería [Eclipse Paho](https://www.eclipse.org/paho/)
y publican mensajes MQTT (`CERRAR_V1` / `CERRAR_V2`). Se usan desde una instalación
de kiosco; **no** se enlazan desde `index.html`.

## Ejecutar en local

Es un sitio estático. Cualquiera de estas opciones sirve:

```bash
# opción A: servidor estático con Node (si tienes npx)
npx serve .

# opción B: cualquier servidor de archivos, por ejemplo
python3 -m http.server 8080
```

Luego abre <http://localhost:8080/>. También puedes abrir `index.html` directamente
en el navegador (`file://`); el código es JavaScript clásico (sin módulos ES), así que
funciona sin servidor. Solo se pierde el preloader de imágenes que usa `fetch` en algunos
navegadores bajo `file://`; el juego en sí no depende de él.

## Verificación

No hay suite de tests automatizados. La verificación se hizo con:

- **Sintaxis JS**: `node --check app.js` (y los `<script>` inline extraídos a ficheros temporales).
- **Página en navegador real**: carga *headless* de cada HTML (Chrome/Edge, `--headless=new --dump-dom`)
  comprobando que no se produzcan errores de consola (`TypeError`, `ReferenceError`, 404).
- **Comprobación de la extracción**: los bloques CSS/JS movidos a `styles.css`/`app.js` se
  compararon carácter a carácter con los originales de `index.html`.

Para repetir la comprobación rápida de sintaxis:

```bash
node --check app.js
```

## Publicación (GitHub Pages)

El repositorio sirve la rama `main` directamente. Tras hacer *push*:

1. **Settings → Pages** en GitHub.
2. En *Source*, elegir *Deploy from a branch* y seleccionar `main` / `/ (root)`.
3. Guardar; la URL pública aparece en la misma sección (`https://<usuario>.github.io/<repo>/`).

`index.html` queda como página de inicio porque es la raíz del repositorio.

## Resumen de la rama `refactor/simple`

Rama con cambios conservadores de mantenimiento. Ninguno altera el contenido textual,
la identidad visual ni el comportamiento funcional previsto del juego. Ver
[`NOTES.md`](NOTES.md) para las decisiones abiertas y el pendiente real.

- **Extracción de CSS/JS**: se movieron los bloques `<style>` y `<script>` embebidos de
  `index.html` a `styles.css` y `app.js`, conservando el orden original de las reglas
  (y por tanto la cascada) y el contenido byte a byte.
- **Crítico — se restauraron los modales**: `mostrarAlerta()` y `preguntarFusible()`
  accedían a `#modal-alerta` / `#modal-prompt`, que **no existían** en el HTML y lanzaban
  `TypeError`, rompiendo el quiz de fusibles. Se recuperó el marcado original del historial
  de git y se insertó antes de `</body>`.
- **Limpieza**: se eliminó el registro duplicado de `configurarInputsParaTeclado`
  (estaba enlazado dos veces a `load` y con dos `setInterval` idénticos) y un `<div>`
  huérfano (`f3-marcador-cg`) sin regla CSS ni referencia en JS.
- **Referencia rota**: se quitó `puerta-sector11.jpg` de la lista de precarga (el fichero
  no existe).
- **Accesibilidad**:
  - `aria-label` en todos los campos que solo tenían `placeholder` y en el botón de inicio vacío.
  - Indicador de foco visible global (`:focus-visible`) que prevalece sobre los `outline: none` existentes.
  - Los elementos con `onclick` que no son semánticos (divs, hotspots, teclas) se vuelven
    operables con teclado (`role="button"`, `tabindex="0"` y activación con Intro/Espacio).
  - Texto `alt` en el retrato del narrador; icono de aviso decorativo marcado `aria-hidden`.
  - Descripción `<meta>` en `index.html`.
- **Dependencia muerta**: `narrador.html` cargaba Paho MQTT pero no lo usaba; se eliminó.

## Limitaciones conocidas

- **Imágenes muy pesadas**: los recursos suman ~78 MB; el precarga inicial carga ~35 MB+
  en la primera visita. Recomendado optimizar/redimensionar (ver `NOTES.md`).
- **Tres referencias a imágenes inexistentes** (con reemplazo visual degradado, no en negro):
  `tuberia.png`, `puerta-sector11.jpg`, `mapa_neon.png`. Documentado en `NOTES.md`.
- **Zoom deshabilitado** en `index.html` (`user-scalable=no`) por el contexto de kiosco.
  Es un tema de WCAG 1.4.4; se dejó sin tocar a propósito para no alterar el comportamiento
  previsto. Detalle en `NOTES.md`.
- **Dependencias externas de Google Fonts** (VT323, Montserrat, Cinzel): el sitio necesita
  red para mostrar la tipografía correcta; sin ella cae a la pila de fuentes del sistema.

## Licencia / autoría

Proyecto educativo del curso MECFLUID (UPCT). Ver historial de git para los autores.
