/* ==========================================================================
   AQUALAB - MECFLUID | Lógica: pages/Servo1.html
   Extraída del bloque <script> inline de pages/Servo1.html (Fase 2).
   Se carga de forma síncrona en la misma posición que ocupaba el bloque.
   ========================================================================== */

        let faseActual = 1;
        let solucionCorrecta = 0;
        let client;

        // Configuración MQTT
        function conectarMQTT() {
            client = new Paho.MQTT.Client("broker.hivemq.com", 8000, "client_" + Math.random());
            client.connect({ onSuccess: () => console.log("MQTT Conectado") });
        }

        // --- GENERADOR DE PROBLEMAS ---
        function generarProblema() {
            const enunciado = document.getElementById("enunciado-fase");
            const titulo = document.getElementById("titulo-fase");
            const barra = document.getElementById("barra-progreso");
            const input = document.getElementById("inputRespuesta");
            
            input.value = "";
            input.focus();
            titulo.innerText = `VALVULA 1: FASE ${faseActual}/4`;
            barra.style.width = `${(faseActual - 1) * 25}%`;

            let n1, n2;

            if (faseActual === 1) {
                // FASE 1: Presión Hidrostática (P = rho * g * h)
                n1 = Math.floor(Math.random() * 8) + 3; // Profundidad h
                solucionCorrecta = Math.round(1000 * 9.8 * n1); 
                enunciado.innerHTML = `Calcula la <b>presión hidrostática</b> en un punto a <b>${n1}m</b> de profundidad. <br>(Usa ρ=1000 kg/m³ y g=9.8 m/s²)`;
            } 
            else if (faseActual === 2) {
                // FASE 2: Caudal (Q = v * A)
                n1 = Math.floor(Math.random() * 12) + 4; // Velocidad v
                n2 = 0.5; // Área fija
                solucionCorrecta = n1 * n2;
                enunciado.innerHTML = `El sensor marca una velocidad de <b>${n1} m/s</b> en un conducto de <b>${n2} m²</b>. ¿Cuál es el <b>Caudal (Q)</b>?`;
            }
            else if (faseActual === 3) {
                // FASE 3: Fuerza (F = P * A)
                n1 = (Math.floor(Math.random() * 5) + 1) * 100; // Presión P
                solucionCorrecta = n1 * 2; // Área 2m2
                enunciado.innerHTML = `Si la presión sobre la válvula de <b>2 m²</b> es de <b>${n1} Pa</b>, ¿qué <b>Fuerza (N)</b> está soportando?`;
            }
            else if (faseActual === 4) {
                // FASE 4: Torricelli (v = sqrt(2gh))
                n1 = Math.floor(Math.random() * 15) + 5; // Altura h
                solucionCorrecta = Math.round(Math.sqrt(2 * 9.8 * n1)); 
                enunciado.innerHTML = `<b>Teorema de Torricelli:</b> El agua cae desde <b>${n1}m</b>. ¿Cuál es su velocidad final de salida? <br>(Redondea al entero)`;
            }
        }

        // --- VALIDACIÓN ---
        function validarRespuesta() {
            const input = document.getElementById("inputRespuesta");
            const feedback = document.getElementById("feedback");
            const panel = document.getElementById("panel");
            const respuesta = parseInt(input.value);

            if (respuesta === solucionCorrecta) {
                feedback.style.color = "#39ff14";
                feedback.innerText = "SISTEMA VERIFICADO ✓";
                
                setTimeout(() => {
                    faseActual++;
                    if (faseActual > 4) {
                        finalizarNivel();
                    } else {
                        generarProblema();
                        feedback.innerText = "";
                    }
                }, 1500);
            } else {
                // FALLO: Vibración y cambio de datos
                panel.classList.add("shake");
                feedback.style.color = "#ff073a";
                feedback.innerText = "ERROR: DATOS REGENERADOS";
                
                setTimeout(() => {
                    panel.classList.remove("shake");
                    generarProblema(); // Misma fase, pero nuevos números
                }, 800);
            }
        }

        function finalizarNivel() {
            document.getElementById("barra-progreso").style.width = "100%";
            document.getElementById("enunciado-fase").innerHTML = "<b style='color:#39ff14; font-size:35px;'>¡VÁLVULA 1 CERRADA!</b>";
            document.getElementById("btn-check").style.display = "none";
            document.getElementById("inputRespuesta").style.display = "none";

            // Enviar orden al Servo real vía MQTT
            if (client) {
                let message = new Paho.MQTT.Message("CERRAR_V1");
                message.destinationName = "mecfluid/escuela/valvulas";
                client.send(message);
            }

            // Notificar al index.html (si usas iframe o comunicación entre ventanas)
            setTimeout(() => {
                alert("Nivel completado. Vuelve al mapa.");
            }, 1000);
        }

        window.onload = () => {
            conectarMQTT();
            generarProblema();
        };
