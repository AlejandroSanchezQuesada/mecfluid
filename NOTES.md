# NOTES — pendientes y decisiones abiertas

Documento de seguimiento. Todo lo que sigue es **trabajo real pendiente** (o una
decisión que requiere confirmación del propietario del proyecto), no ruido.

---

## 1. Imágenes referenciadas que no existen (roto, con degradado)

Hay tres ficheros referenciados en el código que **no están en el repositorio**. No se
sustituyeron por placeholders para no inventar recursos; en su lugar se comprobó que
ninguno deja la pantalla en negro y se documenta aquí.

| Fichero ausente | Dónde se referencia | Efecto actual |
|-----------------|---------------------|---------------|
| `tuberia.png` | `css/styles.css:435` (`.fondo-tuberia-full`), usado por `index.html:472` (`#pantalla-habitacion-3`) | La regla tiene `background-color: #0b151a` de respaldo, así que se ve el color sólido oscuro en lugar de la foto de tubería. |
| `puerta-sector11.jpg` | `js/app.js:146-147` (fondo de las escenas 4–5 del narrador) | Esas escenas se muestran sin imagen de fondo (capa vacía). Se quitó de la lista de precarga para evitar el 404 en la carga inicial. |
| `mapa_neon.png` | `narrador.html:80` (`.contenedor-mapa`) | El contenedor del mapa aparece vacío. |

**Acción sugerida:** añadir los tres ficheros con ese nombre exacto, o actualizar las
referencias a los recursos que se usen. Si no se van a usar, borrar las reglas/entradas
correspondientes.

---

## 2. Imágenes pesadas y precarga (~35 MB en la primera visita)

El array `recursosGraficos` de `index.html` precarga ~17 imágenes que suman ~35 MB.
Varios ficheros superan holgadamente lo razonable para la web.

**Acción sugerida (recomendada, no realizada por falta de herramientas de imagen):**

- Redimensionar a un ancho máximo razonable (p. ej. 1600–1920 px).
- Convertir a formato moderno (WebP/AVIF) manteniendo un fallback.
- Animaciones: evaluar si los GIFs grandes (`valvula.gif` ~6.9 MB, `reactor.gif` ~2.7 MB)
  pueden ser `<video>` ligero o reducirse a menos fotogramas/dimensión.

No se implementó porque requiere herramientas de edición de imagen y cambia los
recursos del proyecto. El cambio de comportamiento (preloader) se dejó intacto a
propósito: reducir la precarga alteraría la experiencia de la primera carga.

---

## 3. Imágenes no referenciadas en ningún sitio (candidatas a borrado)

No se eliminó ningún recurso (regla del proyecto: no borrar sin confirmación). Se dejaron
todos los ficheros; estos **no aparecen referenciados** en ningún HTML/CSS/JS y suman ~32.6 MB:

| Fichero | Tamaño | Notas |
|---------|--------|-------|
| `cientifico.jpg` | 9.02 MB | El mayor de todos. |
| `chico11.png` | 7.28 MB | Existe `chico111.png` (0.30 MB) que sí se usa; parece duplicado. |
| `pasillo-largo.png` | 7.07 MB | Existe `pasillo-largo.jpg` (0.81 MB) que sí se usa; duplicado en PNG. |
| `compuerta11.png` | 6.64 MB | Existe `compuerta11.jpg` (0.83 MB) que sí se usa; duplicado en PNG. |
| `explicando.png` | 2.23 MB | Sin uso. |
| `cient.png` | 0.15 MB | Sin uso (¿miniatura de `cientifico.jpg`?). |
| `escudoupct.png` | 0.18 MB | Sin uso (hay `escazul.png` que sí se usa). |
| `fondoupct.png` | 0.02 MB | Sin uso. |

**Acción sugerida:** confirmar con el propietario y borrar los que se decidan; liberaría
~32 MB y agilizaría las clonaciones. Recuperables desde el historial de git si hiciera falta.

---

## 4. Inconsistencia MQTT entre paneles de válvula (requiere confirmación)

Los tres paneles usan Paho MQTT para mandar órdenes al hardware. El estado actual es:

| Página | Mensaje enviado | Línea |
|--------|-----------------|-------|
| `Servo1.html` | `CERRAR_V1` | ~181 |
| `Servo2.html` | `CERRAR_V1` | ~181 |
| `Servo3.html` | `CERRAR_V2` | ~109 |

`Servo1.html` y `Servo2.html` son **idénticos salvo el `<title>`** y ambos envían
`CERRAR_V1`. Por el historial de git (`ff7e402`, `c032abf`) parece que `Servo2` debería
enviar `CERRAR_V2`, pero **no se cambió nada** por dos motivos: (a) el mapeo de qué
servo/gPIO recibe qué orden no está documentado, y (b) cambiar un payload MQTT afecta
al hardware real y a un kiosco en producción.

`Servo3.html` además muestra en el título "Panel de Válvula 1" pero envía `CERRAR_V2`,
lo que sugiere una confusión de numeración arrastrada.

**Acción sugerida:** confirmar con el operador del laboratorio cuál es el mapeo correcto
y alinear títulos y payloads.

---

## 5. Zoom deshabilitado (WCAG 1.4.4)

`index.html` y `Servo3.html` usan `user-scalable=no, maximum-scale=1.0` en el `viewport`,
lo que impide al usuario hacer zoom y contraviene WCAG 1.4.4. Se dejó **sin tocar** porque
el sitio parece pensado para un kiosco táctil donde el zoom accidental sería molesto.

**Acción sugerida:** si el sitio va a usarse en navegador normal, quitar `user-scalable=no`
y `maximum-scale`. Si se mantiene el kiosco, documentar la excepción.

---

## 6. Dependencia externa de tipografías

Todas las páginas cargan Google Fonts (VT323, Montserrat, Cinzel) por CDN. Sin red el
juego funciona pero con tipografía de sistema, que cambia el aspecto.

**Acción sugerida:** alojar las fuentes localmente (`@font-face`) si se quiere
funcionamiento 100 % offline, p. ej. para un kiosco sin internet.

---

## 7. Falta `README` de páginas auxiliares

`narrador.html`, `alerta.html` y `capilar-test.html` no están enlazadas desde
`index.html` y su finalidad exacta no está documentada en el proyecto original.
Se describen a alto nivel en el `README.md` raíz, pero no se aclaró si son páginas
legacy del kiosco o pantallas a las que se llega por otra vía (p. ej. enlaces externos
o pulsos MQTT).

**Acción sugerida:** confirmar si deben enlazarse desde el hub o retirarse.
