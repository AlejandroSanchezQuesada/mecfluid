/* ==========================================================================
   AQUALAB - MECFLUID | Lógica: pages/Servo3.html
   Extraída del bloque <script> inline de pages/Servo3.html (Fase 2).
   Se carga de forma síncrona en la misma posición que ocupaba el bloque.
   ========================================================================== */

        var broker = "broker.hivemq.com";
        var port = 8000;
        
        // ¡OJO! Este topic ahora es el mismo para todas las válvulas. NO LO CAMBIES en los otros archivos.
        var topic = "mecfluid/escuela/valvulas"; 
        
        var client = new Paho.MQTT.Client(broker, port, "cliente_genially_" + parseInt(Math.random() * 10000, 10));

        function onConnect() { document.getElementById("statusMQTT").innerText = ">>> Enlace establecido. Sistema listo."; document.getElementById("statusMQTT").style.color = "#00ffff"; }
        function onFailure(message) { document.getElementById("statusMQTT").innerText = "ERROR: Fallo de enlace."; document.getElementById("statusMQTT").style.color = "red"; }
        client.connect({onSuccess:onConnect, onFailure:onFailure});

        function verificarEnter(event) {
            if (event.key === "Enter" || event.keyCode === 13) {
                event.preventDefault(); 
                document.getElementById("respuestaAlumno").blur(); 
                comprobarRespuesta(); 
            }
        }

        function controlarTeclado(el) {
            if (el.value.length >= 5) {
                el.blur(); 
                comprobarRespuesta(); 
            }
        }

        function comprobarRespuesta() {
            let inputAlumno = document.getElementById("respuestaAlumno");
            let valorEscrito = inputAlumno.value;
            let mensajePantalla = document.getElementById("mensaje");
            let warningImg = document.getElementById("warningIcon"); 
            let panelDiv = document.getElementById("mainPanel"); 
            let respuestaCorrecta = 50; 

            inputAlumno.blur();
            panelDiv.classList.remove("shake");
            warningImg.style.display = "none";

            if (valorEscrito === "") return;

            if (valorEscrito == respuestaCorrecta) {
                mensajePantalla.style.color = "#39ff14";
                mensajePantalla.style.textShadow = "0px 0px 10px #39ff14";
                mensajePantalla.innerHTML = "¡CÁLCULO VERIFICADO!<br>Secuencia de cierre...";
                message = new Paho.MQTT.Message("CERRAR_V2");
                message.destinationName = topic;
                client.send(message);
                
            } else {
                warningImg.style.display = "inline-block";
                mensajePantalla.style.color = "#ff073a";
                mensajePantalla.style.textShadow = "0px 0px 10px #ff073a";
                mensajePantalla.innerHTML = "ERROR CRÍTICO<br>Parámetros incorrectos.";
                
                void panelDiv.offsetWidth; 
                panelDiv.classList.add("shake");
                inputAlumno.value = ""; 
            }
        }
