/* ==========================================================================
   AQUALAB - MECFLUID | Lógica: pages/narrador.html
   Extraída del bloque <script> inline de pages/narrador.html (Fase 2).
   Se carga de forma síncrona en la misma posición que ocupaba el bloque.
   ========================================================================== */

        let vAct = 1; let tAct = 0; let subFase = 1; 
        let valorBasePa = 0; let sol = 0;
        let progreso = { 
            1: [false, false, false, false], 2: [false, false, false, false], 
            3: [false, false, false, false], 4: [false, false, false, false] 
        };

        function mostrar(id) {
            document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
            document.getElementById(id).classList.add('activa');
        }

        /* --- NARRADOR: Texto con Salto de Línea y Espacios --- */
        function irANarrador() {
            mostrar('pantalla-narrador');
            const txt = "Saludos equipo. Bienvenidos al laboratorio AQUAFLUID. Hoy vamos a proceder a la verificación rutinaria de las válvulas. Los niveles de presión son estables, el flujo de agua es constante y... Espera, ¿qué es esa lectura en el sector 11? La presión interna está aumentando exponencialmente. ¡CUIDADO!";
            let i = 0; const caja = document.getElementById("texto-narrador");
            caja.innerHTML = "";
            let intv = setInterval(() => {
                let char = txt.charAt(i);
                caja.innerHTML += (char === " ") ? "&nbsp;" : char;
                i++;
                if(i >= txt.length){ 
                    clearInterval(intv); 
                    document.getElementById('btn-mision').style.display="block"; 
                }
            }, 35);
        }

        function irAAlerta() {
            mostrar('pantalla-alerta');
            const hTxt = "SISTEMA COMPROMETIDO...\nFallo detectado en las válvulas de refrigeración.\nEl nivel de fluidos aumenta críticamente.\nEstabilice los puntos de control A, B, C y D.";
            let i = 0; const caja = document.getElementById("texto-historia");
            let intv = setInterval(() => {
                caja.innerHTML += hTxt.charAt(i) === "\n" ? "<br>" : hTxt.charAt(i);
                i++;
                if(i >= hTxt.length){ clearInterval(intv); document.getElementById('btn-start').style.display="block"; }
            }, 25);
        }

        function irAMapa() { mostrar('pantalla-mapa'); actualizarMapas(); }

        function abrirHabitacion(n) {
            if(n > 1 && !progreso[n-1].every(x => x === true)) return;
            vAct = n; mostrar('pantalla-habitacion');
            actualizarMapas();
        }

        function irAProblema(t) {
            tAct = t;
            if (t === 1 && vAct === 1) { 
                if(subFase === 1) valorBasePa = Math.floor(Math.random() * 900) + 100;
            }
            mostrar('pantalla-valvula');
            generarReto();
        }

        /* --- LÓGICA DE CONVERSIÓN Pa (100-999) --- */
        function generarReto() {
            const env = document.getElementById("enunciado");
            const paso = document.getElementById("paso-info");
            document.getElementById("inputRes").value = "";
            document.getElementById("feed").innerText = "";

            if (tAct === 1 && vAct === 1) {
                paso.innerText = `PUNTO A: PASO ${subFase}/3`;
                if (subFase === 1) {
                    sol = valorBasePa / 100000;
                    env.innerHTML = `Presión detectada: <b>${valorBasePa} Pa</b> <br> Conviértelo a: <b>bar</b>`;
                } else if (subFase === 2) {
                    sol = valorBasePa / 100;
                    env.innerHTML = `Mismo valor: <b>${valorBasePa} Pa</b> <br> Conviértelo a: <b>mbar</b>`;
                } else {
                    sol = valorBasePa / 1000000;
                    env.innerHTML = `Mismo valor: <b>${valorBasePa} Pa</b> <br> Conviértelo a: <b>N/mm²</b>`;
                }
            }
        }

        function verificarRes() {
            const res = parseFloat(document.getElementById("inputRes").value);
            const feed = document.getElementById("feed");
            if (Math.abs(res - sol) < 0.000001) {
                feed.style.color = "#39ff14"; feed.innerText = "✓ ACCESO CONCEDIDO";
                setTimeout(() => {
                    if (subFase < 3) { subFase++; generarReto(); }
                    else {
                        progreso[vAct][tAct-1] = true; subFase = 1;
                        alert("PUNTO A SELLADO"); abrirHabitacion(vAct);
                    }
                }, 1000);
            } else {
                feed.style.color = "#ff073a"; feed.innerText = "✗ FALLO: REGENERANDO DATOS...";
                setTimeout(() => {
                    subFase = 1; valorBasePa = Math.floor(Math.random() * 900) + 100;
                    generarReto();
                }, 1500);
            }
        }

        function actualizarMapas() {
            for(let i=1; i<=4; i++){
                let n = document.getElementById(`main-${i}`);
                if(!n) continue;
                if(progreso[i].every(x => x === true)) n.className = "nodo nodo-verde";
                else if(i === 1 || progreso[i-1].every(x => x === true)) {
                    n.className = "nodo nodo-rojo"; n.onclick = () => abrirHabitacion(i);
                }
            }
            for(let i=1; i<=4; i++){
                let n = document.getElementById(`sub-${i}`);
                if(!n) continue;
                if(progreso[vAct][i-1]) { n.className = "nodo nodo-verde"; n.onclick = null; }
                else if(i === 1 || progreso[vAct][i-2]) {
                    n.className = "nodo nodo-rojo"; n.onclick = () => irAProblema(i);
                } else { n.className = "nodo nodo-bloqueado"; n.onclick = null; }
            }
        }

        window.onload = () => { console.log("Sistema Cargado"); };
