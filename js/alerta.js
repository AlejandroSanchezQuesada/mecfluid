/* ==========================================================================
   AQUALAB - MECFLUID | Lógica: pages/alerta.html
   Extraída del bloque <script> inline de pages/alerta.html (Fase 2).
   Se carga de forma síncrona en la misma posición que ocupaba el bloque.
   ========================================================================== */

        // Texto que se escribirá solo, como un hacker
        const mensaje = "SISTEMA COMPROMETIDO.\n\nFallo detectado en las válvulas de contención de los tanques del laboratorio.Las válvulas se han abierto de forma inesperada y el nivel de fluidos está aumentando críticamente. Si no estabilizamos las lineas, las instalaciones colapsarán.\n\nNecesitamos sus conocimientos en mecánica de fluidos, ingeniero. El destino del equipo está en sus manos.";
        
        let i = 0;
        function escribirTexto() {
            if (i < mensaje.length) {
                let char = mensaje.charAt(i);
                if (char === '\n') {
                    document.getElementById("texto-historia").innerHTML += "<br>";
                } else {
                    document.getElementById("texto-historia").innerHTML += char;
                }
                i++;
                // Velocidad de escritura (50 milisegundos por letra)
                setTimeout(escribirTexto, 25); 
            } else {
                // Cuando termina de escribir, muestra el botón
                document.getElementById("btn-start").style.display = "inline-block";
            }
        }

        // Arranca el efecto al cargar la página
        window.onload = escribirTexto;
