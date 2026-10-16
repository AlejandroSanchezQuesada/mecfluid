/* ==========================================================================
   AQUALAB - MECFLUID | Precarga de imágenes
   Extra\u00edda del bloque <script> inline de la cabecera de index.html (Fase 2).
   Se carga de forma s\u00edncrona y temprana (antes del contenido) para que los
   recursos gr\u00e1ficos est\u00e9n disponibles lo antes posible. Las rutas son relativas
   al documento (index.html), por lo que se mantienen como "imagenes/...".
   ========================================================================== */

        // ================= FIN ESTILOS CSS/PRECARGA DE IMÁGENES ================= //
        const recursosGraficos = [
            "imagenes/fondo (2).png", "imagenes/reactor.gif", "imagenes/departamento.jpg", "imagenes/techlab.jpg",
            "imagenes/lobby.png", "imagenes/pasillo-largo.jpg", "imagenes/compuerta11.jpg",
            "imagenes/chico-idle.png", "imagenes/chico-habla.png", "imagenes/chico-sorpresa.png", "imagenes/chico111.png", "imagenes/presa.gif","imagenes/valvula.gif",
            "imagenes/pizarra.png", "imagenes/papers.png", "imagenes/escazul.png"
        ];
        recursosGraficos.forEach(ruta => { const img = new Image(); img.src = ruta; });
