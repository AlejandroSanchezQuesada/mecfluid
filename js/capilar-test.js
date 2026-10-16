/* ==========================================================================
   AQUALAB - MECFLUID | Lógica: pages/capilar-test.html
   Extraída del bloque <script> inline de pages/capilar-test.html (Fase 2).
   Se carga de forma síncrona en la misma posición que ocupaba el bloque.
   ========================================================================== */

        function probarCapilar(diametroMm, uiAnchoPared) {
            // FÍSICA REAL DEL JUEGO:
            // Ley de Jurin: h = (4 * γ * cos(θ)) / (ρ * g * D)
            // Para el agua: (4 * 0.0735 * 1) / (1000 * 9.8 * D)
            
            let dMetros = diametroMm / 1000;
            let hMetros = (4 * 0.0735) / (1000 * 9.8 * dMetros);
            let hMilimetros = hMetros * 1000; // Resultado en mm
            
            // MAPEO VISUAL (PÍXELES):
            // 1 mm físico = 4 px en la pantalla
            // El nivel 0 del tubo está a 30px del fondo del contenedor visual
            let alturaPx = hMilimetros * 4; 
            
            // Limitamos la altura visual para que el agua no se salga por arriba del diseño
            if(alturaPx > 280) alturaPx = 280;

            let tubo = document.getElementById('tubo-cristal');
            let fluido = document.getElementById('fluido-capilar');
            let feed = document.getElementById('feed-capilar');
            let sIzq = document.getElementById('sensor-izq');
            let sDer = document.getElementById('sensor-der');
            
            // 1. Cambiamos visualmente el ancho del tubo
            tubo.style.width = uiAnchoPared + "px";
            // Centramos el tubo (450px ancho / 2 = 225px centro)
            tubo.style.left = (225 - (uiAnchoPared/2)) + "px"; 
            
            // 2. Reseteamos el fluido a la base
            fluido.style.transition = "none";
            fluido.style.height = "30px"; 
            fluido.style.background = "#00aaff";
            fluido.style.boxShadow = "inset 0 0 10px #00ffff";
            
            sIzq.style.background = "#ff073a"; sIzq.style.boxShadow = "0 0 15px #ff073a";
            sDer.style.background = "#ff073a"; sDer.style.boxShadow = "0 0 15px #ff073a";

            // Forzar un "reflow" para que el navegador reinicie la animación
            void fluido.offsetWidth; 
            
            // 3. Bloqueamos botones e iniciamos la animación de subida
            document.querySelectorAll('.btn-ui').forEach(b => b.disabled = true);
            feed.style.color = "#00ffff";
            feed.innerText = "Calculando ascenso capilar...";
            
            // Aplicamos la nueva altura
            fluido.style.transition = "height 2s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.5s";
            fluido.style.height = (alturaPx + 30) + "px"; // +30 porque la base empieza ahí

            // 4. Comprobamos el resultado al terminar la animación (2 segundos)
            setTimeout(() => {
                // Solución correcta: 30mm (D = 1.0mm)
                if (Math.abs(hMilimetros - 30) < 0.5) {
                    fluido.style.background = "#39ff14"; // Verde victoria
                    fluido.style.boxShadow = "0 0 20px #39ff14";
                    sIzq.style.background = "#39ff14"; sIzq.style.boxShadow = "0 0 20px #39ff14";
                    sDer.style.background = "#39ff14"; sDer.style.boxShadow = "0 0 20px #39ff14";
                    
                    feed.style.color = "#39ff14";
                    feed.innerText = "✓ ¡CONTACTO ESTABLECIDO! CORTOCIRCUITO COMPLETADO.";
                    // Aquí iría el código real para abrir la puerta en el juego completo
                
                } else if (hMilimetros > 30) {
                    fluido.style.background = "#ff073a"; // Rojo fallo
                    fluido.style.boxShadow = "0 0 20px #ff073a";
                    
                    feed.style.color = "#ff073a";
                    feed.innerText = `✗ DESBORDAMIENTO (h = ${hMilimetros.toFixed(1)} mm). EL FLUIDO SUPERÓ LOS SENSORES.`;
                    setTimeout(habilitarBotones, 2500);
                
                } else {
                    feed.style.color = "#ffa500"; // Naranja fallo
                    feed.innerText = `✗ INSUFICIENTE. EL FLUIDO SE DETUVO A ${hMilimetros.toFixed(1)} mm.`;
                    setTimeout(habilitarBotones, 2500);
                }
            }, 2000);
        }

        function habilitarBotones() {
            document.querySelectorAll('.btn-ui').forEach(b => b.disabled = false);
            document.getElementById('feed-capilar').innerText = "Vuelve a seleccionar un diámetro...";
            document.getElementById('feed-capilar').style.color = "#888";
        }
