/* ==========================================================================
   AQUALAB - MECFLUID | Lógica principal del juego
   Extraída de index.html. Se trata de un script clásico (sin módulos) que se
   carga al final del <body>, cuando el DOM ya está disponible.
   ========================================================================== */

        // VARIABLES GLOBALES
        function mostrarAlerta(mensaje, titulo = "SISTEMA") { document.getElementById("modal-titulo").innerText = titulo; document.getElementById("modal-mensaje").innerHTML = mensaje.replace(/\n/g, '<br>'); document.getElementById("modal-alerta").style.display = "flex";}
        let nombreEquipo = "";
        let tiempoSegundos = 0;
        let intervaloReloj = null;
        let relojIniciado = false; 
        let vAct = 1; let tAct = 0; let subFase = 1; 
        let progreso = { 1: [false,false,false,false], 2: [false,false,false,false], 3: [false,false,false,false], 4: [false,false,false,false], 5: [false,false,false,false] };  
        let erroresModulo = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let codigosSecretos = []; 
        let tiradasC = 5; let pistasC = 0; let miniSolC = 0; let finalSolC = 0;
        const datosPistasC = ["Caudal Q = 20 m³/s", "Área de entrada A1 = 4 m²", "Área de salida A2 = 2 m²", "Densidad ρ = 1000 kg/m³", "Tiempo de flujo t = 10 s"];
        
        let piezaSel = null;

        const bdMiniTeoria = [
            { q: "¿A qué corresponde esta fórmula?<br><span style='font-size:35px;'>¿? = (ρ &middot; v &middot; D) / μ</span>", opciones: [{t: "Número de Reynolds", c: true}, {t: "Ecuación de Bernoulli", c: false}, {t: "Número de Froude", c: false}] },
            { q: "¿A qué corresponde esta fórmula?<br><span style='font-size:35px;'>¿? = v &middot; A</span>", opciones: [{t: "Ecuación de Continuidad (Caudal)", c: true}, {t: "Fuerza de arrastre", c: false}, {t: "Ley de Newton", c: false}] },
            { q: "¿Qué fenómeno describe la transferencia de calor mediante el movimiento de un fluido?", opciones: [{t: "Convección", c: true}, {t: "Conducción", c: false}, {t: "Radiación", c: false}] },
            { q: "Si las líneas de corriente son paralelas y rectas en todo momento, el flujo es...", opciones: [{t: "Uniforme", c: true}, {t: "Turbulento", c: false}, {t: "Rotacional", c: false}] },
            { q: "¿Cuándo se dice que un líquido moja una superficie sólida?", opciones: [ { t: "Cuando &theta; es < 90&deg;", c: true }, { t: "Cuando el ángulo de contacto &theta; es > 90&deg;", c: false }, { t: "Cuando la tensión superficial es nula.", c: false }] },
            { q: "En el Número de Reynolds, el numerador (ρ·v·D) representa las fuerzas de...", opciones: [{t: "Inercia", c: true}, {t: "Presión", c: false}, {t: "Fricción", c: false}] },
            { q: "En ausencia de fuerzas externas... Que forma es la que presenta una superficie libre mínima y por tanto energía minima", opciones: [{t: "Forma esférica", c: true}, {t: "Forma cilindrica", c: false}, {t: "Forma rectangular", c: false}] },
            { q: "Cual de las siguientes magnitudes NO es una magnitud intensiva", opciones: [{t: "Masa", c: true}, {t: "Densidad", c: false}, {t: "Viscosidad", c: false}] }
            
        ];

        const bdTeoria = [
            { q: "¿Cuál es la característica principal que define a un fluido?", opciones: [ { t: "Se deforma continuamente bajo un esfuerzo cortante.", c: true }, { t: "Su densidad permanece siempre constante.", c: false }, { t: "Resiste fuerzas de tracción sin alterar su forma.", c: false }]},
            { q: "¿En qué consiste el enfoque Euleriano (Euler) en cinemática?", opciones: [ { t: "Observar el flujo desde un volumen de control estático.", c: true }, { t: "Seguir la trayectoria de una partícula individual.", c: false }, { t: "Promediar las velocidades en un instante inicial.", c: false }]},
            { q: "¿Qué principio físico universal es la base de la Ecuación de Continuidad?", opciones: [ { t: "El principio de conservación de la masa.", c: true }, { t: "La conservación de la cantidad de movimiento.", c: false }, { t: "La Segunda Ley de Newton.", c: false }]},
            { q: "¿Qué propiedad de un fluido se define como la masa contenida por unidad de volumen?", opciones: [ { t: "Densidad.", c: true }, { t: "Peso específico.", c: false }, { t: "Viscosidad.", c: false }]},
            { q: "La propiedad que representa la fricción o resistencia interna de un fluido a fluir se conoce como", opciones: [ { t: "Viscosidad.", c: true }, { t: "Capilaridad.", c: false }, { t: "Tensión Superficial.", c: false }]},
            { q: "¿Qué fenómeno provoca que el agua ascienda espontáneamente por un tubo de vidrio muy estrecho?", opciones: [ { t: "Capilaridad.", c: true }, { t: "Principio de Pascal.", c: false }, { t: "Presión Hidrostática.", c: false }]},
            { q: "Un 'fluido ideal' es una abstracción teórica que supone que el fluido:", opciones: [ { t: "Completamente no viscoso e incompresible.", c: true }, { t: "Viscosidad infinitamente alta.", c: false }, { t: "Gas real sometido a bajas presiones.", c: false }]},
        ];
        const bdTeoriaM4 = [
            { q: "¿Es la Cantidad de Movimiento una magnitud <b>vectorial</b> (es decir, importa su dirección)?", opciones: [{t: "Verdadero", c: true}, {t: "Falso", c: false}] },
            { q: "Si un chorro de agua choca contra una placa y 'rebota' (cambio de 180º), ¿ejerce <b>más fuerza</b> que si solo se desvía lateralmente (90º)?", opciones: [{t: "Verdadero", c: true}, {t: "Falso", c: false}] },
            { q: "¿La fuerza que ejerce un chorro de agua al chocar depende únicamente de la presión, ignorando la velocidad?", opciones: [{t: "Verdadero", c: false}, {t: "Falso", c: true}] }
        ];
        let preguntasSeleccionadas = [];

        // FUSIBLES LOGIC Y GLOBAL FUNCTIONS
        const preguntasFluidosFusibles = [
            {q: "¿Qué ley rige la conservación de la energía en fluidos (apellidos del científico)?", a: "bernoulli"},
            {q: "¿Qué propiedad mide la resistencia de un fluido a fluir?", a: "viscosidad"},
            {q: "¿Cómo se llama la fuerza perpendicular a la superficie por unidad de área?", a: "presion"}
        ];
        let fusiblesResueltos = 0;

        function irAFusibles() { mostrar('pantalla-fusibles'); }

        function preguntarFusible(index, element) {
            if(element.classList.contains('up')) return;
            document.getElementById("modal-prompt-mensaje").innerText = preguntasFluidosFusibles[index].q;
            document.getElementById("modal-prompt-input").value = "";
            document.getElementById("modal-prompt").style.display = "flex";
            
            document.getElementById("modal-prompt-btn").onclick = function() {
                let resp = document.getElementById("modal-prompt-input").value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                document.getElementById("modal-prompt").style.display = "none";
                
                if(resp.includes(preguntasFluidosFusibles[index].a)) {
                    element.classList.add('up');
                    fusiblesResueltos++;
                    if(fusiblesResueltos === 3) {
                        document.getElementById('feed-fusibles').innerText = "✓ SISTEMA TOTALMENTE OPERATIVO";
                        setTimeout(() => { mostrar('pantalla-alumnos'); }, 2000); 
                    }
                } else {
                    mostrarAlerta("Respuesta incorrecta. El fusible no se mueve.", "ERROR ELÉCTRICO");
                }
            };
        }


        // ================= SISTEMA DE GUARDADO =================
        window.onload = () => { 
            const guardado = localStorage.getItem('aqualab_save');
            if (guardado) {
                const estado = JSON.parse(guardado);
                document.getElementById('save-equipo').innerText = estado.nombreEquipo;
                let mins = Math.floor(estado.tiempoSegundos / 60).toString().padStart(2, '0');
                let secs = (estado.tiempoSegundos % 60).toString().padStart(2, '0');
                document.getElementById('save-tiempo').innerText = `${mins}:${secs}`;
                
                document.getElementById('panel-guardado').style.display = "block";
                document.querySelector('.boton-inicio').style.display = "none";
            }
        };

        function guardarEstado() {
            if (!nombreEquipo) return;
            const estado = { nombreEquipo: nombreEquipo, tiempoSegundos: tiempoSegundos, relojIniciado: relojIniciado, progreso: progreso, erroresModulo: erroresModulo, codigosSecretos: codigosSecretos };
            localStorage.setItem('aqualab_save', JSON.stringify(estado));
        }

        function reanudarMision() {
            const estado = JSON.parse(localStorage.getItem('aqualab_save'));
            nombreEquipo = estado.nombreEquipo;
            tiempoSegundos = estado.tiempoSegundos;
            relojIniciado = estado.relojIniciado;
            progreso = estado.progreso;
            if(estado.erroresModulo) erroresModulo = estado.erroresModulo; 
            if(estado.codigosSecretos) codigosSecretos = estado.codigosSecretos;
            else codigosSecretos = Array.from({length: 5}, () => Math.floor(Math.random() * 5) + 4);
            let mins = Math.floor(tiempoSegundos / 60).toString().padStart(2, '0');
            let secs = (tiempoSegundos % 60).toString().padStart(2, '0');
            document.getElementById('tiempo-ui').innerText = `${mins}:${secs}`;
            
            if (relojIniciado) { relojIniciado = false; arrancarReloj(); }
            irAPasillo();
        }

        function borrarGuardadoYEmpezar() {
            localStorage.removeItem('aqualab_save');
            document.getElementById('panel-guardado').style.display = "none";
            document.querySelector('.boton-inicio').style.display = "block";
        }

        function registrarError() {
            erroresModulo[vAct]++;
            guardarEstado();
        }

        // ================= NAVEGACIÓN Y MODO HISTORIA =================
        function mostrar(id) { document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa')); document.getElementById(id).classList.add('activa'); }

        let pasoHistoria = 0;
        let escribiendo = false;
        let intvNarrador = null;
        let capaActual = 'A'; 
        let fondoActual = null; 

        const guionAqualab = [
            { txt: "Saludos, equipo. Bienvenidos a las instalaciones subterráneas de AQUAFLUID. Soy Reyn el asistente asignado a vuestro grupo.", bg: "imagenes/lobby.png", face: "imagenes/chico111.png" },
            { txt: "Acompañadme, por favor. Vamos a descender por el corredor principal hacia los laboratorios de pruebas. Nuestra red gestiona fluidos a presiones críticas para toda la ciudad.", bg: "imagenes/pasillo-largo.jpg", face: "imagenes/chico-habla.png" },
            { txt: "Ya hemos llegado a la sala de control del Sector 11. Vamos a proceder a la verificación rutinaria de las válvulas...", bg: "imagenes/compuerta11.jpg", face: "imagenes/chico111.png" },
            { txt: "Los niveles de presión manométrica son estables, el flujo de agua es constante y... Espera. Un momento.", bg: "imagenes/puerta-sector11.jpg", face: "imagenes/chico-habla.png" },
            { txt: "¿Qué es esa lectura? ¡Alerta de cavitación detectada! ¡Fallo estructural inminente en las tuberías principales!", bg: "imagenes/puerta-sector11.jpg", face: "imagenes/chico-sorpresa.png", error: true }
        ];
        function entrarJuego() {
            let elemento = document.documentElement;
            if (elemento.requestFullscreen) {elemento.requestFullscreen().catch(err => console.log("Pantalla completa bloqueada por el navegador"));} 
            else if (elemento.webkitRequestFullscreen) { /* Safari */elemento.webkitRequestFullscreen();} 
            else if (elemento.msRequestFullscreen) { /* IE11 */elemento.msRequestFullscreen();}
            mostrar('pantalla-inicio');}
        
        function abrirProyecto(urlArchivo) {document.getElementById('iframe-proyecto').src = urlArchivo; mostrar('pantalla-visor-proyecto');}
        
        function cerrarProyecto() {document.getElementById('iframe-proyecto').src = ""; mostrar('pantalla-alumnos');}
        
        function irANarrador() {
            mostrar('pantalla-narrador');
            document.getElementById('pantalla-narrador').classList.remove('alerta-emergencia');
            document.getElementById('caja-narrador').style.opacity = "1";
            document.getElementById('caja-narrador').style.cursor = 'pointer';
            document.getElementById('foto-narrador').className = ""; 
            
            if(!document.getElementById('flecha-sig')) {
                document.getElementById('caja-narrador').innerHTML += '<div id="flecha-sig" class="flecha-continuar">▼ CONTINUAR ▼</div>';
            }
            
            pasoHistoria = 0;
            const primeraEscena = guionAqualab[0];
            document.getElementById('capa-fondo-A').style.backgroundImage = `url('${primeraEscena.bg}')`;
            document.getElementById('capa-fondo-A').style.opacity = 1;
            document.getElementById('capa-fondo-B').style.opacity = 0;
            capaActual = 'A';
            fondoActual = primeraEscena.bg;

            reproducirPasoHistoria();
        }

// ================= MOTOR DE DIÁLOGOS =================
        let sustoDisparado = false; // Seguro para evitar doble ejecución

        function reproducirPasoHistoria() {
            if (pasoHistoria >= guionAqualab.length) return;
            
            escribiendo = true;
            sustoDisparado = false; // Reiniciamos el seguro
            document.getElementById('flecha-sig').style.display = "none";
            
            const escena = guionAqualab[pasoHistoria];
            const foto = document.getElementById('foto-narrador');
            const cajaText = document.getElementById('texto-narrador');
            const pantalla = document.getElementById('pantalla-narrador');

            if (escena.bg !== fondoActual) {
                let capaParaDesvanecer = (capaActual === 'A') ? 'capa-fondo-A' : 'capa-fondo-B';
                let capaParaMostrar = (capaActual === 'A') ? 'capa-fondo-B' : 'capa-fondo-A';
                
                document.getElementById(capaParaMostrar).style.backgroundImage = `url('${escena.bg}')`;
                
                document.getElementById(capaParaDesvanecer).style.opacity = 0;
                document.getElementById(capaParaDesvanecer).style.zIndex = 0;
                
                document.getElementById(capaParaMostrar).style.opacity = 1;
                document.getElementById(capaParaMostrar).style.zIndex = 1;
                
                capaActual = (capaActual === 'A') ? 'B' : 'A';
                fondoActual = escena.bg;
            }

            foto.src = escena.face;
            
            if (escena.error) {
                pantalla.classList.add('alerta-emergencia');
                foto.classList.add("narrador-error"); 
            } else {
                pantalla.classList.remove('alerta-emergencia');
                foto.classList.remove("narrador-error"); 
            }

            cajaText.innerHTML = "";
            let i = 0;
            let toggleHabla = false;
            clearInterval(intvNarrador);

            intvNarrador = setInterval(() => { 
                cajaText.innerHTML += escena.txt.charAt(i); 
                
                if (escena.face === "imagenes/chico-habla.png" && i % 3 === 0 && escena.txt.charAt(i) !== " ") {
                    toggleHabla = !toggleHabla;
                    foto.src = toggleHabla ? "imagenes/chico-habla.png" : "imagenes/chico111.png";
                }

                i++; 
                if (i >= escena.txt.length) { 
                    lanzarEventosFinDeTexto(); // Llamamos al final de la escena
                }
            }, 30);
        }

        // ================= NUEVA FUNCIÓN: FINAL DE ESCENA =================
        function lanzarEventosFinDeTexto() {
            clearInterval(intvNarrador);
            if (!escribiendo) return; // Si ya acabó, no hacemos nada
            escribiendo = false;

            const escena = guionAqualab[pasoHistoria];
            const foto = document.getElementById('foto-narrador');
            const cajaText = document.getElementById('texto-narrador');
            cajaText.innerHTML = escena.txt;

            if (escena.error) {
                if (sustoDisparado) return; 
                sustoDisparado = true;
                foto.src = "imagenes/chico-sorpresa.png"; 
                document.getElementById('caja-narrador').style.cursor = 'default';
                setTimeout(() => {
                    cajaText.innerHTML += "<br><br><span style='color:#ff073a; font-weight:bold; font-size:40px;'>[ ERROR: CONEXIÓN PERDIDA ]</span>";
                    setTimeout(() => {
                        document.getElementById('capa-fondo-A').style.opacity = 0;
                        document.getElementById('capa-fondo-B').style.opacity = 0;
                        document.getElementById('caja-narrador').style.opacity = "0"; 
                        document.getElementById('filtro-oscuro').style.background = "#000"; 
                        setTimeout(() => { irAAlerta(); }, 1500);
                    }, 1500); 
                }, 400); 
            } else {
                if (escena.face === "imagenes/chico-habla.png") { foto.src = "imagenes/chico111.png"; }
                document.getElementById('flecha-sig').style.display = "block";
            }
        }

        function avanzarHistoria() { 
            if (escribiendo) {
                lanzarEventosFinDeTexto();
            } else {
                pasoHistoria++;
                reproducirPasoHistoria();
            }
        }

        function irAAlerta() {
            mostrar('pantalla-alerta');
            const hTxt = "SISTEMA COMPROMETIDO...\nFallo crítico detectado en las válvulas de refrigeración.\nPresión inestable. Protocolo de evacuación iniciado.\n\n[ ALERTA ] Se requiere intervención de Unidad de Ingeniería.";
            let i = 0; const caja = document.getElementById("texto-historia"); caja.innerHTML = "";
            let intv = setInterval(() => { 
                caja.innerHTML += hTxt.charAt(i) === "\n" ? "<br>" : hTxt.charAt(i); 
                i++; 
                if(i >= hTxt.length){ clearInterval(intv); document.getElementById('zona-registro-emergencia').style.display="block"; }
            }, 25);
        }

        function iniciarMision() {
            const inputName = document.getElementById('input-equipo').value.trim();
            if (inputName === "") { mostrarAlerta("ACCESO DENEGADO. Introduzca la identificación del equipo.", "ERROR"); return; }
            nombreEquipo = inputName.toUpperCase();
            codigosSecretos = Array.from({length: 5}, () => Math.floor(Math.random() * 5) + 4);
            document.getElementById('tiempo-ui').innerText = "00:00"; tiempoSegundos = 0; relojIniciado = false;
            guardarEstado(); irAPasillo();
        }

        function arrancarReloj() {
            if (relojIniciado) return; 
            relojIniciado = true;
            intervaloReloj = setInterval(() => {
                tiempoSegundos++;
                let mins = Math.floor(tiempoSegundos / 60).toString().padStart(2, '0');
                let secs = (tiempoSegundos % 60).toString().padStart(2, '0');
                document.getElementById('tiempo-ui').innerText = `${mins}:${secs}`;
                guardarEstado(); 
            }, 1000);
        }

        function mostrarVictoria() {
            clearInterval(intervaloReloj); 
            document.getElementById('hud-cronometro').style.display = "none"; 
            
            document.getElementById('victoria-equipo').innerText = nombreEquipo;
            let mins = Math.floor(tiempoSegundos / 60).toString().padStart(2, '0');
            let secs = (tiempoSegundos % 60).toString().padStart(2, '0');
            document.getElementById('victoria-tiempo').innerText = `${mins}:${secs}`;
            
            let totalErrores = Object.values(erroresModulo).reduce((a, b) => a + b, 0);
            document.getElementById('victoria-errores').innerText = totalErrores;
            
            localStorage.removeItem('aqualab_save'); 
            mostrar('pantalla-victoria');
        }

function irAPasillo() {
    mostrar('pantalla-pasillo');
    document.getElementById('hud-cronometro').style.display = "block";
    let modulosS11Listos = 0;
    for(let i=1; i<=4; i++) {
        if(progreso[i].every(x=>x===true)) modulosS11Listos++;
    }
    
    let p12 = document.getElementById('puerta-sector-12');
    let sub12 = document.getElementById('subtitulo-s12');
    if (p12 && sub12) {
        if (modulosS11Listos === 4) {
            p12.classList.remove('bloqueada');
            p12.classList.add('activa');
            // Cambiamos el texto para que ya no pida código
            sub12.innerHTML = "<span style='color:#39ff14;'>[ ACCESO CONCEDIDO ]</span><br>PRUEBAS UNIDAD 2";
        }
    }
}
        function irAMapa() { 
            mostrar('pantalla-mapa'); 
            document.getElementById('hud-cronometro').style.display = "block";
            actualizarMapas(); 
        }
        // ================= LÓGICA DE PIZARRA M1 =================
        const posicionesZoom = {
            'Re': { scale: 2.5, x: '25%', y: '20%' },
            'Pr': { scale: 2.5, x: '10%', y: '-10%' },
            'Pe': { scale: 2.5, x: '-20%', y: '25%' },
            'M':  { scale: 2.5, x: '-25%', y: '-20%' }
        };

        const datosPruebasM1 = {
            'Re': { titulo: 'ESTABILIZACIÓN: Re', desc: 'Prueba de Enrutamiento de Unidades. Ajusta el circuito cian y naranja.', num: 1 },
            'Pr': { titulo: 'VERIFICACIÓN: Pr', desc: 'Test teórico de conceptos base de fluidos.', num: 2 },
            'M':  { titulo: 'CAPILARIDAD: M', desc: 'Cortocircuita el sistema usando ascenso capilar.', num: 3 },
            'Pe': { titulo: 'DESENCRIPTACIÓN: Pe', desc: 'Extrae los datos ocultos de flujo y área.', num: 4 }
        };

function enfocarPrueba(idPrueba) {
            const lienzo = document.getElementById('lienzo');
            const panelFlotante = document.getElementById('panel-prueba-flotante');
            
            lienzo.classList.add('zoomed');

            document.getElementById('titulo-prueba-pizarra').innerText = datosPruebasM1[idPrueba].titulo;
            document.getElementById('desc-prueba-pizarra').innerText = datosPruebasM1[idPrueba].desc;
            
            document.getElementById('btn-iniciar-prueba').onclick = () => {
                resetZoomPizarra(); 
                irAProblema(datosPruebasM1[idPrueba].num);
            };

            panelFlotante.classList.add('visible');
        }

        function resetZoomPizarra() {
            document.getElementById('lienzo').classList.remove('zoomed');
            document.getElementById('panel-prueba-flotante').classList.remove('visible');
        }
        function abrirHabitacion(n) { 
            if(n>1 && !progreso[n-1].every(x=>x===true)) { mostrarAlerta("Este módulo está bloqueado. Resuelve el módulo anterior para continuar.", "ACCESO DENEGADO"); return; }
            if(progreso[n].every(x=>x===true)) { mostrarAlerta("Este módulo ya está estabilizado y bloqueado de forma segura.", "MÓDULO COMPLETADO"); return; }
            arrancarReloj(); vAct = n; 
            if (n === 2) mostrar('pantalla-habitacion-2');
            else if (n === 3) mostrar('pantalla-habitacion-3');
            else if (n === 4) {
    if(!progreso[3].every(x=>x===true)) { 
        mostrarAlerta("Este módulo está bloqueado. Resuelve el M3 para continuar.", "ACCESO DENEGADO"); 
        return; 
    }
    arrancarReloj();
    vAct = 4; // Marcamos que estamos en el Módulo 4
    subFase = 1;
    tAct = 1; // Para que el índice de progreso sea 0 (tAct-1)
    preguntasSeleccionadas = [...bdTeoriaM4].sort(() => 0.5 - Math.random());
    mostrar('pantalla-quiz');
    generarRetoB();
    document.getElementById('hud-cronometro').style.display = "none";
}
            else if (n === 5) mostrarAlerta("Módulo 5: En construcción", "AVISO");
            else mostrar('pantalla-habitacion'); 
            
            document.getElementById('hud-cronometro').style.display = "none";
            
            let contenedor = n === 1 ? document.getElementById('contenedor-pizarra') : document.querySelector(`#pantalla-habitacion-${n} .contenedor-mapa`);
            if(contenedor) { contenedor.classList.remove('enfocar-camara'); void contenedor.offsetWidth; contenedor.classList.add('enfocar-camara'); }
            
            actualizarMapas(); 
        }

const CODIGO_CANDADO = [2, 4, 6, 8]; // El código de la caja física real

        function actualizarMapas() {
            // 1. Actualizar Nodos de la Pizarra (M1)
            if (vAct === 1) {
                const nodosPizarra = ['Re', 'Pr', 'M', 'Pe'];
                nodosPizarra.forEach((nodoId, indice) => {
                    let elementoNodo = document.getElementById(`nodo-${nodoId}`);
                    if (elementoNodo) {
                        if (progreso[1][indice]) elementoNodo.classList.add('completado');
                        else elementoNodo.classList.remove('completado');
                    }
                });
            }

            // 2. Actualizar Hotspots (Sectores)
            for(let i=1; i<=5; i++){
                let hotspot = document.getElementById(`hotspot-${i}`);
                if(!hotspot) continue;
                
                let tooltip = hotspot.querySelector('.tooltip-layton');
                let badge = hotspot.querySelector('.badge-error-layton');

                if(i === 1 || progreso[i-1].every(x => x === true)) { 
                    hotspot.classList.remove('bloqueado');
                    
                    if(progreso[i].every(x => x === true)) {
                        hotspot.classList.add('completado');
                        if(tooltip) tooltip.innerHTML = `M${i} <br><span style="color:#39ff14; font-size: 16px;">[ COMPLETADO ]</span>`;
                        if(badge) {
                            badge.style.display = "block";
                            badge.innerText = `Fallos: ${erroresModulo[i]}`;
                        }
                        let digitoDiv = hotspot.querySelector('.digito-secreto');
                        if (!digitoDiv) {
                            digitoDiv = document.createElement('div');
                            digitoDiv.className = 'digito-secreto';
                            hotspot.appendChild(digitoDiv);
                        }
                        digitoDiv.innerText = codigosSecretos[i-1];
                        digitoDiv.style.display = 'flex';
                        
                    } else {
                        hotspot.classList.remove('completado');
                        if(tooltip) tooltip.innerHTML = tooltip.innerHTML.replace('<br><span style="color:#ff073a; font-size: 16px;">[ BLOQUEADO ]</span>', '');
                    }
                } else { 
                    hotspot.classList.add('bloqueado');
                }
            }

            // 3. Lógica específica M2 y M3
            if (vAct === 2) {
                let n2 = document.getElementById('sub-2-1');
                if(n2) {
                    if(progreso[2][0]) { 
                        n2.style.border = "4px solid #39ff14"; n2.style.background = "rgba(57, 255, 20, 0.2)";
                        n2.innerHTML = "<span style='color:#39ff14; font-weight:bold; font-size:18px;'>[ RESUELTO ]</span>"; 
                        n2.onclick = null; n2.style.pointerEvents = "none";
                    } else { n2.onclick = function() { levantarPapelYEmpezar(this); }; }
                }
            }

            if (vAct === 3) {
                let n3 = document.getElementById('sub-3-1');
                if(n3) {
                    if(progreso[3][0]) { 
                        n3.className = "nodo-verde nodo-gigante"; n3.innerText = "[ SELLADA ]"; n3.style.borderColor = "#39ff14"; n3.style.color = "#39ff14"; n3.style.boxShadow = "0 0 15px #39ff14"; n3.onclick = null; 
                    } else { 
                        n3.className = "nodo-rojo nodo-gigante"; n3.innerText = "[ CALIBRAR ]"; n3.style.borderColor = "#ffa500"; n3.style.color = "#ffa500"; n3.style.boxShadow = "0 0 15px #ffa500"; n3.onclick = iniciarRetoDelta; 
                    }
                }
            }

        // 4. LÓGICA DEL CANDADO VIRTUAL VINCULADO AL FÍSICO
        for(let i=1; i<=4; i++) {
            let ruleta = document.getElementById(`ruleta-${i}`);
            if(!ruleta) continue;
            
            let targetReal = CODIGO_CANDADO[i-1];
            
            // AQUÍ ESTÁ EL CAMBIO IMPORTANTE:
            if (progreso[i] && progreso[i].every(x => x === true)) {
                // Si acabamos de ganar el M4, no forzamos el texto para dejar que la animación termine
                if (!(i === 4 && vAct === 4)) {
                    ruleta.innerText = targetReal;
                    ruleta.classList.add('resuelta');
                    verificarCandadoAnimado(); 
                }
            }
            else {
                // Si no está resuelto, calculamos el número inicial (el que no es el correcto)
                let numVueltas = codigosSecretos[i-1];
                let numeroInicial = (targetReal - numVueltas + 20) % 10;
                ruleta.innerText = numeroInicial;
                ruleta.classList.remove('resuelta');
            }
        }

            guardarEstado(); 
        }

// ================= FUNCIONES DE CANDADO ================= //
        let transicionPendiente = false;

function verificarCandadoAnimado() {
    let resueltas = document.querySelectorAll('.ruleta-candado.resuelta').length;
    let candado = document.querySelector('.candado-container');
    
    if (resueltas === 4) {
        // Estética del candado
        candado.style.cursor = 'pointer';
        candado.style.animation = 'latido-candado 1.5s infinite alternate ease-in-out';
        
        if (!transicionPendiente) {
            transicionPendiente = true;
            
            setTimeout(() => {
                // EFECTO DE DESBLOQUEO AUTOMÁTICO
                mostrarAlerta("✓ SISTEMA SECTOR 11 ESTABILIZADO.<br>Desbloqueando acceso al Sector 12...", "CONEXIÓN ESTABLECIDA");
                
                // Desbloqueamos la puerta físicamente en el nexo
                let p12 = document.getElementById('puerta-sector-12');
                let sub12 = document.getElementById('subtitulo-s12');
                if (p12 && sub12) {
                    p12.classList.remove('bloqueada');
                    p12.classList.add('activa');
                    sub12.innerHTML = "<span style='color:#39ff14;'>[ ACCESO CONCEDIDO ]</span><br>PRUEBAS UNIDAD 2";
                }
                
                // Enviamos al jugador al Sector 12 tras una breve pausa
                setTimeout(() => {
                    abrir(); // Esta función ya la tienes, es la que muestra 'pantalla-mapa-12'
                }, 2500);
                
            }, 1000);
        }
    }
}

        function verificarCandadoSilencioso() {
            let resueltas = document.querySelectorAll('.ruleta-candado.resuelta').length;
            let candado = document.querySelector('.candado-container');
            if (resueltas === 4) {
                candado.style.cursor = 'pointer';
                candado.style.animation = 'latido-candado 1.5s infinite alternate ease-in-out';
                candado.onclick = intentarAbrir;
            }
        }

        function animarRuletaCandado(index, inicio, target, vueltasTotales) {
            let ruleta = document.getElementById(`ruleta-${index}`);
            let numeroActual = inicio;
            let pasosDados = 0;
            
            let intervaloGiro = setInterval(() => {
                numeroActual = (numeroActual + 1) % 10;
                ruleta.innerText = numeroActual;
                pasosDados++;
                
                if (pasosDados >= vueltasTotales) {
                    clearInterval(intervaloGiro);
                    ruleta.innerText = target; 
                    ruleta.classList.add('resuelta');
                    verificarCandadoAnimado(); // <-- LLAMADA AL CHECK AUTOMÁTICO
                }
            }, 150); 
        }
function procesarVictoriaFase(mod, fase) {
            progreso[mod][fase] = true;
            guardarEstado();
            
            if (mod === 1 && progreso[1].every(x => x === true)) {
                mostrar('pantalla-habitacion');
                actualizarMapas();
                
                setTimeout(() => {
                    mostrarAlerta("MÓDULO 1 ESTABILIZADO\nVolviendo al Nexo Central.", "MÓDULO COMPLETADO");
                    irAMapa(); 
                }, 2000);
            }
            else if (progreso[mod].every(x => x === true)) {
                irAMapa();
            } else {
                abrirHabitacion(mod);
            }
        }

function intentarAbrir() {
    let modulosListos = 0;
    for(let i=1; i<=4; i++) {
        if (progreso[i].every(x=>x===true)) modulosListos++;
    }

    if (modulosListos < 4) {
        mostrarAlerta(`ACCESO DENEGADO: Faltan ${4 - modulosListos} módulos operativos en el Sector 11 para estabilizar el sistema.`, "ALERTA DE SEGURIDAD");
        return;
    }
    
    // Si ya tienen los 4 módulos, entran directamente sin pedir el código manual
    abrir();
}

        function abrir() {
            mostrar('pantalla-mapa-12');
            let crono = document.getElementById('hud-cronometro');
            if (crono) crono.style.display = "block";
        }

        // ====== LÓGICA HABITACIÓN 1 (MÓDULO 1) ======
        function irAProblema(t) {
            tAct = t; subFase = 1;
            if (t === 1) { mostrar('pantalla-enrutador'); iniciarEnrutador(); } 
            else if (t === 2) { preguntasSeleccionadas = [...bdTeoria].sort(() => 0.5 - Math.random()).slice(0, 3); mostrar('pantalla-quiz'); generarRetoB(); } 
            else if (t === 3) { mostrar('pantalla-capilar'); generarNivelCapilar(); } 
            else if (t === 4) { iniciarRetoC(); } 
        }

        // ==========================================
        // 1. LÓGICA ENRUTADOR DE UNIDADES (Re, t=1)
        // ==========================================
        const gridTamano = 7;
        
        const p1_original = [
            { q: "0.045 m³ a Litros", a: 45 }, { q: "2.5 bar a Pascales", a: 250000 },
            { q: "36 km/h a m/s", a: 10 }, { q: "380 mmHg a atm", a: 0.5 },
            { q: "Densidad Relativa 1.26 a kg/m³", a: 1260 }, { q: "1500 cm² a m²", a: 0.15 },
            { q: "120 L/min a L/s", a: 2 }
        ];
        const ruta1 = [[0,1], [1,1], [2,1], [2,2], [3,2], [4,2], [5,2], [5,1], [6,1]];

        const p2_original = [
            { q: "0.5 bar a kPa", a: 50 }, { q: "3000 mm³ a cm³", a: 3 },
            { q: "2.5 horas a segundos", a: 9000 }, { q: "15 m.c.a a kPa (g=10)", a: 150 },
            { q: "0.8 g/cm³ a kg/m³", a: 800 }, { q: "5 m³/h a L/h", a: 5000 },
            { q: "20000 Pa a bar", a: 0.2 }
        ];
        const ruta2 = [[0,5], [1,5], [2,5], [2,4], [3,4], [4,4], [5,4], [5,5], [6,5]];

        let p1_random, p2_random;
        let sistemaActualEnrutador = 1; 
        let pasoActualEnrutador = 0; 
        const todasRespuestasEnrutador = [...p1_original.map(p=>p.a), ...p2_original.map(p=>p.a)];
        const gridElement = document.getElementById('grid-tuberias');
        const celdasEnrutador = [];

        function iniciarEnrutador() {
            sistemaActualEnrutador = 1;
            pasoActualEnrutador = 0;
            p1_random = [...p1_original].sort(() => Math.random() - 0.5);
            p2_random = [...p2_original].sort(() => Math.random() - 0.5);
            
            document.getElementById('panel-sys-1').classList.add('activo-1');
            document.getElementById('panel-sys-2').classList.remove('activo-2');
            document.getElementById('pregunta-sys-2').style.color = "#555";
            document.getElementById('pregunta-sys-2').innerText = "[ EN ESPERA ]";
            document.getElementById('feed-sys-1').innerText = "";
            document.getElementById('feed-sys-2').innerText = "";

            gridElement.innerHTML = '';
            for (let f = 0; f < gridTamano; f++) {
                celdasEnrutador[f] = [];
                for (let c = 0; c < gridTamano; c++) {
                    let div = document.createElement('div');
                    div.className = 'celda';
                    div.dataset.f = f; div.dataset.c = c;
                    
                    let indR1 = ruta1.findIndex(coord => coord[0]===f && coord[1]===c);
                    let indR2 = ruta2.findIndex(coord => coord[0]===f && coord[1]===c);
                    
                    if (f===0 && c===1) { div.classList.add('origen-1'); }
                    else if (f===6 && c===1) { div.classList.add('destino-1'); }
                    else if (f===0 && c===5) { div.classList.add('origen-2'); }
                    else if (f===6 && c===5) { div.classList.add('destino-2'); }
                    else if (indR1 > 0 && indR1 < ruta1.length - 1) {
                        div.innerText = p1_original[indR1 - 1].a;
                        div.onclick = () => comprobarRespuestaEnrutador(div, parseFloat(div.innerText));
                    }
                    else if (indR2 > 0 && indR2 < ruta2.length - 1) {
                        div.innerText = p2_original[indR2 - 1].a;
                        div.onclick = () => comprobarRespuestaEnrutador(div, parseFloat(div.innerText));
                    }
                    else {
                        div.innerText = generarDistractorSeguroEnrutador();
                        div.onclick = () => comprobarRespuestaEnrutador(div, parseFloat(div.innerText));
                    }
                    
                    celdasEnrutador[f][c] = div;
                    gridElement.appendChild(div);
                }
            }
            actualizarUIEnrutador();
        }

        function generarDistractorSeguroEnrutador() {
            let distractor;
            do {
                let base = todasRespuestasEnrutador[Math.floor(Math.random() * todasRespuestasEnrutador.length)];
                let modificadores = [0.1, 10, 100, 2, 0.5];
                distractor = base * modificadores[Math.floor(Math.random() * modificadores.length)];
                distractor = Number.isInteger(distractor) ? distractor : parseFloat(distractor.toFixed(2));
            } while (todasRespuestasEnrutador.includes(distractor)); 
            return distractor;
        }

        function actualizarUIEnrutador() {
            if (sistemaActualEnrutador === 1) {
                if (pasoActualEnrutador < p1_random.length) {
                    document.getElementById('pregunta-sys-1').innerText = `CALCULA: ${p1_random[pasoActualEnrutador].q} = ?`;
                }
            } else if (sistemaActualEnrutador === 2) {
                document.getElementById('panel-sys-1').classList.remove('activo-1');
                document.getElementById('pregunta-sys-1').style.color = "#39ff14";
                document.getElementById('pregunta-sys-1').innerText = "[ CONEXIÓN CIAN ESTABLECIDA ]";
                
                document.getElementById('panel-sys-2').classList.add('activo-2');
                document.getElementById('pregunta-sys-2').style.color = "#fff";
                
                if (pasoActualEnrutador < p2_random.length) {
                    document.getElementById('pregunta-sys-2').innerText = `CALCULA: ${p2_random[pasoActualEnrutador].q} = ?`;
                }
            }
        }

        function comprobarRespuestaEnrutador(celdaDiv, valorClicado) {
            if (celdaDiv.classList.contains('tuberia-1') || celdaDiv.classList.contains('tuberia-2')) return;

            let feed = document.getElementById(`feed-sys-${sistemaActualEnrutador}`);
            let respuestaEsperada = (sistemaActualEnrutador === 1) ? p1_random[pasoActualEnrutador].a : p2_random[pasoActualEnrutador].a;

            if (valorClicado === respuestaEsperada) {
                celdaDiv.classList.add(sistemaActualEnrutador === 1 ? 'tuberia-1' : 'tuberia-2');
                celdaDiv.style.pointerEvents = "none";
                feed.style.color = (sistemaActualEnrutador === 1) ? "#00ffff" : "#ffa500";
                feed.innerText = "✓ SECTOR VERIFICADO";
                pasoActualEnrutador++;

                if (sistemaActualEnrutador === 1 && pasoActualEnrutador === p1_random.length) {
                    setTimeout(() => {
                        celdasEnrutador[6][1].style.background = "#00ffff"; celdasEnrutador[6][1].style.boxShadow = "0 0 15px #00ffff";
                        feed.innerText = "";
                        sistemaActualEnrutador = 2; pasoActualEnrutador = 0; 
                        actualizarUIEnrutador();
                    }, 1000);
                } 
                else if (sistemaActualEnrutador === 2 && pasoActualEnrutador === p2_random.length) {
                    setTimeout(() => {
                        celdasEnrutador[6][5].style.background = "#ffa500"; celdasEnrutador[6][5].style.boxShadow = "0 0 15px #ffa500";
                        document.getElementById('pregunta-sys-2').style.color = "#39ff14";
                        document.getElementById('pregunta-sys-2').innerText = "[ CONEXIÓN NARANJA ESTABLECIDA ]";
                        feed.innerText = "¡MÓDULO SUPERADO!";
                        feed.style.color = "#39ff14";
                        setTimeout(() => { procesarVictoriaFase(vAct, tAct-1); }, 1500);
                    }, 1000);
                } else {
                    setTimeout(() => { feed.innerText = ""; actualizarUIEnrutador(); }, 800);
                }
            } else {
                registrarError();
                feed.style.color = "#ff073a";
                feed.innerText = "✗ VÁLVULA INCORRECTA";
                celdaDiv.style.borderColor = "#ff073a";
                setTimeout(() => { celdaDiv.style.borderColor = ""; feed.innerText = ""; }, 1000);
            }
        }

        // ==========================================
        // 2. LÓGICA VERIFICACIÓN TEÓRICA (Pr, t=2)
        // ==========================================
        function generarRetoB() {
            const preg = preguntasSeleccionadas[subFase - 1]; let tituloModulo = vAct === 1 ? "PUNTO Pr" : "MÓDULO 4";
            document.getElementById('quiz-paso').innerText = `${tituloModulo}: PREGUNTA ${subFase}/${preguntasSeleccionadas.length}`;
            document.getElementById('quiz-pregunta').innerHTML = preg.q; document.getElementById('quiz-feed').innerText = "";
            const opcionesDiv = document.getElementById('quiz-opciones'); opcionesDiv.innerHTML = "";
            let opcionesMezcladas = [...preg.opciones].sort(() => 0.5 - Math.random());
            opcionesMezcladas.forEach(opt => { let btn = document.createElement('button'); btn.className = "btn-opcion"; btn.innerText = opt.t; btn.onclick = () => verificarQuiz(opt.c); opcionesDiv.appendChild(btn); });
        }

function verificarQuiz(esCorrecta) {
    const feed = document.getElementById('quiz-feed'); 
    document.querySelectorAll('.btn-opcion').forEach(b => b.disabled = true); 
    
    if (esCorrecta) {
        feed.style.color = "#39ff14"; 
        feed.innerText = "✓ CORRECTO";
        setTimeout(() => { 
// Sustituye el bloque del final de verificarQuiz por este:
if (subFase < preguntasSeleccionadas.length) { 
    subFase++; 
    generarRetoB(); 
} else { 
    if (vAct === 4) {
        // 1. Marcamos el progreso
        progreso[4] = [true, true, true, true];
        guardarEstado();
        
        // 2. Volvemos al mapa
        irAMapa(); 
        
        // 3. Lanzamos la animación del cuarto dígito (M4)
        // Calculamos desde dónde empieza a girar
        let target = CODIGO_CANDADO[3];
        let vueltas = codigosSecretos[3];
        let inicio = (target - vueltas + 20) % 10;
        
        // Forzamos que la ruleta no tenga la clase 'resuelta' aún para que se vea el giro
        let ruleta4 = document.getElementById('ruleta-4');
        ruleta4.classList.remove('resuelta');
        
        // ¡A girar!
        animarRuletaCandado(4, inicio, target, vueltas);

        mostrarAlerta("✓ MÓDULO 4 COMPLETADO: Sistema de Cantidad de Movimiento estable.", "ÉXITO");
    } else {
        procesarVictoriaFase(vAct, tAct-1); 
    }
}
        }, 800);
    } else { 
        registrarError(); 
        feed.style.color = "#ff073a"; 
        feed.innerText = "✗ INCORRECTO"; 
        setTimeout(() => { 
            subFase = 1; 
            // Recargamos preguntas según el módulo
            let base = (vAct === 4) ? bdTeoriaM4 : bdTeoria;
            preguntasSeleccionadas = [...base].sort(() => 0.5 - Math.random()).slice(0, 3); 
            generarRetoB(); 
        }, 1500); 
    }
}

        // ==========================================
        // 3. LÓGICA CAPILARIDAD (M, t=3)
        // ==========================================
        const nivelesCapilar = [
            { h: 30, correcta: 1.0, opciones: [0.5, 1.0, 2.0, 5.0] },
            { h: 15, correcta: 2.0, opciones: [1.0, 1.5, 2.0, 3.0] },
            { h: 20, correcta: 1.5, opciones: [0.5, 1.0, 1.5, 2.5] },
            { h: 10, correcta: 3.0, opciones: [1.5, 2.0, 3.0, 5.0] },
            { h: 25, correcta: 1.2, opciones: [0.8, 1.2, 2.0, 3.0] }
        ];
        let capIntentos = 2;
        let capNivelAct = null;

        function generarNivelCapilar() {
            capIntentos = 2;
            document.getElementById('intentos-ui').innerText = capIntentos;
            
            capNivelAct = nivelesCapilar[Math.floor(Math.random() * nivelesCapilar.length)];
            let hObj = capNivelAct.h;

            document.getElementById('enunciado-h').innerText = hObj;
            document.getElementById('texto-obj').innerText = `h = ${hObj} mm`;
            document.getElementById('feed-capilar').style.color = "#888";
            document.getElementById('feed-capilar').innerText = "Sistema listo. Esperando selección...";

            let bottomPx = (hObj * 4) + 20; 
            document.getElementById('linea-obj').style.bottom = bottomPx + 'px';
            document.getElementById('texto-obj').style.bottom = (bottomPx + 5) + 'px';
            document.getElementById('sensor-izq').style.bottom = (bottomPx - 2) + 'px';
            document.getElementById('sensor-der').style.bottom = (bottomPx - 2) + 'px';

            let contBotones = document.getElementById('botones-container');
            contBotones.innerHTML = ''; 

            capNivelAct.opciones.forEach(opt => {
                let btn = document.createElement('button');
                btn.className = 'btn-ui btn-capilar';
                btn.innerText = opt.toFixed(1) + ' mm';
                let wPx = opt * 10;
                btn.onclick = () => probarCapilar(opt, wPx);
                contBotones.appendChild(btn);
            });

            resetAnimacionCapilar();
        }

        function resetAnimacionCapilar() {
            let fluido = document.getElementById('fluido-capilar');
            let sIzq = document.getElementById('sensor-izq');
            let sDer = document.getElementById('sensor-der');
            let tubo = document.getElementById('tubo-cristal');

            tubo.style.width = "40px"; 
            tubo.style.left = "205px";

            fluido.style.transition = "none";
            fluido.style.height = "20px"; 
            fluido.style.background = "#00aaff";
            fluido.style.boxShadow = "inset 0 0 10px #00ffff";
            
            sIzq.style.background = "#ff073a"; sIzq.style.boxShadow = "0 0 15px #ff073a";
            sDer.style.background = "#ff073a"; sDer.style.boxShadow = "0 0 15px #ff073a";

            void fluido.offsetWidth; 
        }

        function probarCapilar(diametroMm, uiAnchoPared) {
            let dMetros = diametroMm / 1000;
            let hMetros = (4 * 0.0735) / (1000 * 9.8 * dMetros);
            let hMilimetros = hMetros * 1000; 
            
            let alturaPx = hMilimetros * 4; 
            if(alturaPx > 140) alturaPx = 140;

            let tubo = document.getElementById('tubo-cristal');
            let fluido = document.getElementById('fluido-capilar');
            let feed = document.getElementById('feed-capilar');
            let sIzq = document.getElementById('sensor-izq');
            let sDer = document.getElementById('sensor-der');
            
            document.querySelectorAll('.btn-capilar').forEach(b => b.disabled = true);
            feed.style.color = "#00ffff";
            feed.innerText = "Calculando ascenso capilar...";

            tubo.style.width = uiAnchoPared + "px";
            tubo.style.left = (225 - (uiAnchoPared/2)) + "px"; 
            
            fluido.style.transition = "none";
            fluido.style.height = "20px"; 
            fluido.style.background = "#00aaff";
            
            void fluido.offsetWidth; 
            
            fluido.style.transition = "height 2s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.5s";
            fluido.style.height = (alturaPx + 20) + "px"; 

            setTimeout(() => {
                if (Math.abs(hMilimetros - capNivelAct.h) < 0.5) {
                    fluido.style.background = "#39ff14"; 
                    fluido.style.boxShadow = "0 0 20px #39ff14";
                    sIzq.style.background = "#39ff14"; sIzq.style.boxShadow = "0 0 20px #39ff14";
                    sDer.style.background = "#39ff14"; sDer.style.boxShadow = "0 0 20px #39ff14";
                    
                    feed.style.color = "#39ff14";
                    feed.innerText = "✓ ¡CONTACTO ESTABLECIDO! CORTOCIRCUITO COMPLETADO.";
                    setTimeout(() => { procesarVictoriaFase(vAct, tAct-1); }, 1500);

                } else {
                    capIntentos--;
                    registrarError(); 
                    document.getElementById('intentos-ui').innerText = capIntentos;
                    
                    fluido.style.background = "#ff073a";
                    fluido.style.boxShadow = "0 0 20px #ff073a";
                    
                    let msgFallo = hMilimetros > capNivelAct.h ? "DESBORDAMIENTO" : "INSUFICIENTE";
                    
                    if (capIntentos > 0) {
                        feed.style.color = "#ffa500";
                        feed.innerText = `✗ ${msgFallo} (h = ${hMilimetros.toFixed(1)} mm). INTÉNTALO DE NUEVO.`;
                        
                        setTimeout(() => {
                            resetAnimacionCapilar();
                            document.querySelectorAll('.btn-capilar').forEach(b => b.disabled = false);
                            feed.style.color = "#888";
                            feed.innerText = "Selecciona otro diámetro...";
                        }, 2500);

                    } else {
                        feed.style.color = "#ff073a";
                        feed.innerText = `✗ ${msgFallo}. SISTEMA BLOQUEADO. RECALIBRANDO...`;
                        
                        setTimeout(() => { generarNivelCapilar(); }, 3500);
                    }
                }
            }, 2000);
        }
// ==========================================
        // 4. LÓGICA DESENCRIPTACIÓN (Pe, t=4)
        // ==========================================
        function iniciarRetoC() {
            mostrar('pantalla-c');
            tiradasC = 5; pistasC = 0;
            document.getElementById('tiradas-ui').innerText = tiradasC;
            for(let i=1; i<=5; i++) {
                document.getElementById(`pista-ui-${i}`).innerText = `${i}. [ ENCRIPTADO ]`;
                document.getElementById(`pista-ui-${i}`).style.color = "#555";
            }
            document.getElementById('btn-tirar').disabled = false;
        }

        function tirarRuletaC() {
            if(tiradasC <= 0) return;
            let preg = bdMiniTeoria[Math.floor(Math.random() * bdMiniTeoria.length)];
            document.getElementById('enunciado-mini-c').innerHTML = preg.q;
            let opcionesDiv = document.getElementById('zona-botones-mini');
            opcionesDiv.innerHTML = "";
            opcionesDiv.style.display = "flex";
            document.getElementById('zona-input-mini').style.display = "none";

            let mezcladas = [...preg.opciones].sort(()=> 0.5 - Math.random());
            mezcladas.forEach(opt => {
                let btn = document.createElement('button');
                btn.className = "btn-opcion";
                btn.innerText = opt.t;
                btn.onclick = () => procesarMiniC(opt.c);
                opcionesDiv.appendChild(btn);
            });
            document.getElementById('feed-mini-c').innerText = "";
            mostrar('pantalla-c-mini');
        }

        function procesarMiniC(correcta) {
            let feed = document.getElementById('feed-mini-c');
            if(correcta) {
                feed.style.color = "#39ff14"; feed.innerText = "✓ DESENCRIPTACIÓN EXITOSA";
                setTimeout(() => {
                    pistasC++; tiradasC--;
                    document.getElementById('tiradas-ui').innerText = tiradasC;
                    let pUi = document.getElementById(`pista-ui-${pistasC}`);
                    pUi.innerText = `${pistasC}. ${datosPistasC[pistasC-1]}`;
                    pUi.style.color = "#00ffff";
                    if(tiradasC === 0) document.getElementById('btn-tirar').disabled = true;
                    mostrar('pantalla-c');
                }, 1000);
            } else {
                registrarError();
                tiradasC--;
                document.getElementById('tiradas-ui').innerText = tiradasC;
                feed.style.color = "#ff073a"; feed.innerText = "✗ FALLO DE SEGURIDAD. TIRADA PERDIDA.";
                if(tiradasC === 0) document.getElementById('btn-tirar').disabled = true;
                setTimeout(() => mostrar('pantalla-c'), 1500);
            }
        }

        function faseFinalC() {
            mostrar('pantalla-c-final');
            let resumen = "";
            for(let i=0; i<pistasC; i++) resumen += datosPistasC[i] + "<br>";
            if(pistasC === 0) resumen = "[ NINGÚN DATO RECUPERADO ]";
            document.getElementById('resumen-pistas-c').innerHTML = resumen;
            document.getElementById('enunciado-final-c').innerHTML = "Calcula la <b>Velocidad</b> de entrada (V1) en m/s:";
            document.getElementById('inputResFinalC').value = "";
            document.getElementById('feed-final-c').innerText = "";
        }

        function verificarFinalC() {
            let val = parseFloat(document.getElementById('inputResFinalC').value);
            let feed = document.getElementById('feed-final-c');
            if(val === 5) { // Q/A1 = 20/4 = 5
                feed.style.color = "#39ff14"; feed.innerText = "✓ CÁLCULO CORRECTO. DATOS RECUPERADOS.";
                setTimeout(() => { procesarVictoriaFase(1, 3); }, 1500);
            } else {
                registrarError();
                feed.style.color = "#ff073a"; feed.innerText = "✗ CÁLCULO INCORRECTO";
                setTimeout(() => { feed.innerText = ""; }, 1500);
            }
        }

        // ==========================================
        // RESTAURACIÓN ECUACIÓN DIFFERENCIAL (Pantalla D)
        // ==========================================
        let slots = [null, null, null];
        function clickSlot(el) {
            if(piezaSel) {
                el.innerText = piezaSel.innerText;
                el.dataset.id = piezaSel.id;
                piezaSel.classList.remove('seleccionada');
                piezaSel = null;
            } else {
                el.innerText = "";
                el.dataset.id = "";
            }
        }

        function seleccionarPieza(el) {
            document.querySelectorAll('.pieza').forEach(p => p.classList.remove('seleccionada'));
            el.classList.add('seleccionada');
            piezaSel = el;
        }

        function verificarPuzzleD() {
            let s1 = document.getElementById('slot-1').dataset.id;
            let s2 = document.getElementById('slot-2').dataset.id;
            let s3 = document.getElementById('slot-3').dataset.id;
            let feed = document.getElementById('feed-d');
            if(s1 === 'p-dt' && s2 === 'p-pg' && s3 === 'p-gradP') {
                feed.style.color = "#39ff14"; feed.innerText = "✓ ESTRUCTURA VÁLIDA";
                setTimeout(() => {
                    document.getElementById('fase-puzle-d').style.display = 'none';
                    document.getElementById('fase-pregunta-d').style.display = 'block';
                    feed.innerText = "";
                }, 1500);
            } else {
                registrarError();
                feed.style.color = "#ff073a"; feed.innerText = "✗ ERROR DE SINTAXIS";
                setTimeout(()=>feed.innerText="", 1500);
            }
        }

        function verificarPreguntaD() {
            let val = document.getElementById('inputPreguntaD').value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let feed = document.getElementById('feed-d');
            if(val.includes("euler")) {
                feed.style.color = "#39ff14"; feed.innerText = "✓ IDENTIFICACIÓN CORRECTA";
                setTimeout(() => { procesarVictoriaFase(1, 4); }, 1500);
            } else {
                registrarError();
                feed.style.color = "#ff073a"; feed.innerText = "✗ INCORRECTO. REVISA TUS APUNTES.";
                setTimeout(()=>feed.innerText="", 1500);
            }
        }

        // ==========================================
        // MÓDULO 2 (Energía / Bernoulli / Torricelli)
        // ==========================================
        function levantarPapelYEmpezar(el) {
            el.classList.add('papel-levantado');
            setTimeout(() => {
                mostrar('pantalla-hab2-megareto');
                document.getElementById('fase-hab2-1').className = "fase-activa";
                document.getElementById('fase-hab2-2').className = "fase-oculta";
                document.getElementById('fase-hab2-3').className = "fase-oculta";
                document.getElementById('feed-hab2').innerText = "";
                document.getElementById('input-h2-f1').value = "";
            }, 1000);
        }

        function abortarMegaReto() {
            mostrar('pantalla-mapa');
            let papel = document.getElementById('sub-2-1');
            if(papel) papel.classList.remove('papel-levantado');
        }

        function validarH2F1() {
            let v = parseFloat(document.getElementById('input-h2-f1').value);
            let feed = document.getElementById('feed-hab2');
            if(v === 50000) { // P = rho * g * h = 10000 * 10 * 0.5
                feed.style.color = "#39ff14"; feed.innerText = "✓ DATO ACEPTADO";
                document.getElementById('indicador-f1').style.color = "#39ff14";
                document.getElementById('indicador-f2').style.color = "#00ffff";
                setTimeout(() => {
                    document.getElementById('fase-hab2-1').className = "fase-oculta";
                    document.getElementById('fase-hab2-2').className = "fase-activa";
                    feed.innerText = "";
                }, 1000);
            } else {
                registrarError(); feed.style.color = "#ff073a"; feed.innerText = "✗ PRESIÓN INCORRECTA";
                setTimeout(()=>feed.innerText="",1500);
            }
        }

        function validarH2F2() {
            let v = parseFloat(document.getElementById('input-h2-f2').value);
            let feed = document.getElementById('feed-hab2');
            if(v === 4) { // Bernoulli -> v1 = 4
                feed.style.color = "#39ff14"; feed.innerText = "✓ VELOCIDAD SINCRONIZADA";
                document.getElementById('indicador-f2').style.color = "#39ff14";
                document.getElementById('indicador-f3').style.color = "#ff073a";
                setTimeout(() => {
                    document.getElementById('fase-hab2-2').className = "fase-oculta";
                    document.getElementById('fase-hab2-3').className = "fase-activa";
                    feed.innerText = "";
                }, 1000);
            } else {
                registrarError(); feed.style.color = "#ff073a"; feed.innerText = "✗ VELOCIDAD ERRÓNEA";
                setTimeout(()=>feed.innerText="",1500);
            }
        }

        function escanearNivel() {
            let btn = document.getElementById('btn-escanear');
            let txt = document.getElementById('txt-escaner');
            btn.disabled = true;
            txt.innerText = "ESCANEANDO..."; txt.style.color = "#ffa500";
            setTimeout(() => {
                txt.innerText = "NIVEL DETECTADO: h = 5 m"; txt.style.color = "#00ffff";
                document.getElementById('zona-disparo').style.display = "block";
            }, 2000);
        }

        function validarH2F3() {
            let v = parseFloat(document.getElementById('input-h2-f3').value);
            let feed = document.getElementById('feed-hab2');
            if(v === 10) { // Torricelli: V = sqrt(2*g*h) = sqrt(2*10*5)
                feed.style.color = "#39ff14"; feed.innerText = "✓ ¡PARCHE DISPARADO! FUGA SELLADA.";
                setTimeout(() => { procesarVictoriaFase(2, 0); }, 1500);
            } else {
                registrarError(); feed.style.color = "#ff073a"; feed.innerText = "✗ FALLO DE CÁLCULO. EL PARCHE NO ENCAJA.";
                setTimeout(()=>feed.innerText="",1500);
            }
        }

        // ==========================================
        // MÓDULO 3 (Continuidad / Compuertas)
        // ==========================================
        function validarM3() {
            let v = parseFloat(document.getElementById('input-m3-vs').value);
            let feed = document.getElementById('feed-m3');
            if(v === 40) { // A1*V1 = A2*V2 -> D1^2 * V1 = D2^2 * V2 -> 4 * 10 = 1 * V2
                feed.style.color = "#39ff14"; feed.innerText = "✓ CAUDAL ESTABILIZADO";
                setTimeout(() => { procesarVictoriaFase(3, 0); }, 1500);
            } else {
                registrarError(); feed.style.color = "#ff073a"; feed.innerText = "✗ PELIGRO: SOBREPRESIÓN";
                setTimeout(()=>feed.innerText="",1500);
            }
        }

        function iniciarRetoDelta() {
            mostrar('pantalla-hab3-megareto');
            document.getElementById('input-h3-fuerza').value = "";
            document.getElementById('feed-hab3').innerText = "";
        }

        function simularFuerzaDelta() {
            let h = parseFloat(document.getElementById('input-h3-fuerza').value);
            let feed = document.getElementById('feed-hab3');
            let agua = document.getElementById('agua-nueva-ui');
            
            let pct = (h / 3) * 100;
            if(pct > 100) pct = 100;
            agua.style.height = pct + "%";

            if(Math.abs(h - 1.50) <= 0.05) { 
                feed.style.color = "#39ff14"; feed.innerText = "✓ EQUILIBRIO PERFECTO ALCANZADO";
                setTimeout(() => { procesarVictoriaFase(3, 1); }, 1500); 
            } else {
                registrarError(); 
                feed.style.color = "#ff073a"; 
                feed.innerText = h > 1.50 ? "✗ MUCHA AGUA. COMPUERTA BLOQUEADA." : "✗ POCA AGUA. COMPUERTA INESTABLE.";
                setTimeout(()=>feed.innerText="",2500);
            }
        }

        // ==========================================
        // SECTOR 12 (Cinemáticas y Manometría)
        // ==========================================
// Variable global para controlar en qué paso del Sector 12 estamos
// --- FUNCIÓN DE VALIDACIÓN SECTOR 12 ---
let faseS12Activa = 1; 

function validarCinematicaS12() {
    let val = parseFloat(document.getElementById('input-s12-global').value);
    let feed = document.getElementById('feed-s12-global');
    let desc = document.getElementById('txt-s12-desc');
    let titulo = document.getElementById('txt-s12-titulo');
    let banner = document.getElementById('banner-codigo-fisico');
    let spanCodigo = document.getElementById('valor-codigo-fisico');

    if (faseS12Activa === 1) {
        if (val === 19) {
            feed.style.color = "#39ff14"; feed.innerText = "✓ PRESIÓN CORRECTA. NIVELANDO AGUAS...";
            banner.style.display = "block"; spanCodigo.innerText = "1";
            document.getElementById('anim-f1-valvula').style.transform = "rotate(90deg) scale(0.8)";
            document.getElementById('anim-f1-valvula').style.background = "#39ff14";
            setTimeout(() => {
                faseS12Activa = 2;
                document.getElementById('vis-fase-1').classList.remove('activa');
                document.getElementById('vis-fase-2').classList.add('activa');
                banner.style.display = "none";
                titulo.innerText = "FASE 2: PRESIÓN SOBRE COMPUERTA";
                desc.innerHTML = `La compuerta mide 2m de ancho por 1.5m de alto.<br><br>Calcula la <b>Fuerza Hidrostática total (kN)</b> cuando el agua alcance 4m de profundidad (g=9.8).`;
                document.getElementById('anim-f2-chorro').style.height = "150px";
                setTimeout(() => { document.getElementById('anim-f2-agua').style.height = "90%"; }, 800);
                document.getElementById('input-s12-global').value = ""; feed.innerText = "";
            }, 3000);
        } else { registrarError(); feed.style.color = "#ff073a"; feed.innerText = "✗ VALOR INCORRECTO"; }
    } 
    else if (faseS12Activa === 2) {
        if (val === 95.55) {
            feed.style.color = "#39ff14"; feed.innerText = "✓ FUERZA CALCULADA.";
            banner.style.display = "block"; spanCodigo.innerText = "3";
            setTimeout(() => {
                faseS12Activa = 3;
                document.getElementById('vis-fase-2').classList.remove('activa');
                document.getElementById('vis-fase-3').classList.add('activa');
                banner.style.display = "none";
                titulo.innerText = "FASE 3: CENTRO DE PRESIONES";
                desc.innerHTML = `¡AVISO! La compuerta se deforma. Calcula la profundidad exacta del <b>Centro de Presiones (h_cp en metros)</b> para colocar un refuerzo.`;
                document.getElementById('input-s12-global').value = ""; feed.innerText = "";
            }, 3000);
        } else { registrarError(); feed.style.color = "#ff073a"; feed.innerText = "✗ VALOR INCORRECTO"; }
    }
    else if (faseS12Activa === 3) {
        if (val === 3.31) {
            feed.style.color = "#39ff14"; feed.innerText = "✓ PUNTAL COLOCADO CON ÉXITO.";
            banner.style.display = "block"; spanCodigo.innerText = "5";
            document.getElementById('f3-piston').style.top = "210px"; // Animación de apoyo
            setTimeout(() => {
                faseS12Activa = 4;
                document.getElementById('vis-fase-3').classList.remove('activa');
                document.getElementById('vis-fase-4').classList.add('activa');
                banner.style.display = "none";
                titulo.innerText = "FASE 4: COMPUERTA RADIAL";
                desc.innerHTML = `La compuerta radial tiene un radio de 4m y ancho de 5m.<br>Calcula la <b>Componente Horizontal (kN)</b> para izarla.`;
                document.getElementById('input-s12-global').value = ""; feed.innerText = "";
            }, 3000);
        } else { errorFase3(); } 
    }
    else if (faseS12Activa === 4) {
        if (val === 392) {
            feed.style.color = "#39ff14"; feed.innerText = "✓ SECTOR 12 ESTABILIZADO.";
            banner.style.display = "block"; spanCodigo.innerText = "7";
            document.getElementById('anim-f4-radial').style.transform = "rotate(-45deg)";
            document.getElementById('anim-f4-rio').style.width = "100%";
            setTimeout(() => {
                mostrarAlerta("✓ SECTOR 12 ONLINE.<br>Acceso al NÚCLEO desbloqueado.", "SISTEMA SECTORIAL");
                irAPasillo();
            }, 4000);
        } else { registrarError(); feed.style.color = "#ff073a"; feed.innerText = "✗ FUERZA INSUFICIENTE"; }
    }
}

// --- FUNCIÓN DE ERROR VISUAL PARA FASE 3 ---
function errorFase3() {
    registrarError();
    let cont = document.getElementById('f3-contenedor-visual');
    let grieta = document.getElementById('f3-grieta-visual');
    let fuga = document.getElementById('f3-agua-fuga');
    let feed = document.getElementById('feed-s12-global');
    
    cont.classList.add('pantalla-sacudida');
    grieta.style.display = 'block';
    fuga.style.width = '100px';
    feed.style.color = "#ff073a";
    feed.innerText = "✗ ERROR CRÍTICO: FALLO ESTRUCTURAL";
    
    setTimeout(() => {
        cont.classList.remove('pantalla-sacudida');
        grieta.style.display = 'none';
        fuga.style.width = '0';
        feed.innerText = "";
    }, 2000);
}
        // ==========================================
        // NÚCLEO FINAL
        // ==========================================
        function intentarAbrirNucleo() {
            if (document.getElementById('puerta-nucleo').classList.contains('bloqueada')) {
                mostrarAlerta("ACCESO DENEGADO. Debes completar el Sector 12 primero.", "BLOQUEO ACTIVO");
                return;
            }
            mostrar('pantalla-nucleo');
        }

        function validarNucleo() {
            let val = parseFloat(document.getElementById('input-nucleo').value);
            let feed = document.getElementById('feed-nucleo');
            
            if (val === 312.5) { // Potencia = (rho * g * Q * H) / n = (1000 * 10 * 0.5 * 50) / 0.8 = 312.5 kW
                feed.style.color = "#39ff14"; feed.innerText = "✓ POTENCIA ACEPTADA. INYECTANDO REFRIGERANTE...";
                document.getElementById('panel-nucleo-final').style.borderColor = "#39ff14";
                document.getElementById('panel-nucleo-final').style.boxShadow = "0 0 80px #39ff14";
                setTimeout(() => {
                    mostrarVictoria();
                }, 2500);
            } else {
                registrarError();
                feed.style.color = "#ff073a"; feed.innerText = "✗ ERROR DE POTENCIA. TEMPERATURA SUBIENDO.";
                setTimeout(()=>feed.innerText="",1500);
            }
        }

        // ==========================================
        // PROYECTOS / VOTACIÓN
        // ==========================================
        function votarProyecto(id) {
            let elem = document.getElementById(id);
            let btn = elem.querySelector('.btn-votar');
            let countSpan = btn.querySelector('.contador-votos');
            
            if(btn.classList.contains('votado')) {
                btn.classList.remove('votado');
                countSpan.innerText = parseInt(countSpan.innerText) - 1;
            } else {
                btn.classList.add('votado');
                countSpan.innerText = parseInt(countSpan.innerText) + 1;
            }
        }


// ============== MODO DIOS (Actualizado) =================== //
        function toggleModoDios() {
            let p = document.getElementById('panel-dios');
            p.style.display = p.style.display === "none" ? "block" : "none"; }

function completarModuloModoDios(mod) {
    if (mod >= 1 && mod <= 4) {
        progreso[mod] = [true, true, true, true];
        guardarEstado();
        actualizarMapas();
        if (mod === 2) {
            if (document.getElementById('input-h2-f1')) document.getElementById('input-h2-f1').value = "50000";
            if (document.getElementById('input-h2-f2')) document.getElementById('input-h2-f2').value = "4";
            if (document.getElementById('input-h2-f3')) document.getElementById('input-h2-f3').value = "10";
        } else if (mod === 3) {
            if (document.getElementById('input-m3-vs')) document.getElementById('input-m3-vs').value = "40";
            if (document.getElementById('input-h3-fuerza')) document.getElementById('input-h3-fuerza').value = "1.5";
        }
        if (document.getElementById('pantalla-mapa').classList.contains('activa')) {
            setTimeout(verificarCandadoAnimado, 500); 
        }
    } 
    else if (mod === 12) {
        let inputS12 = document.getElementById('input-s12-global');
        if (inputS12) {
            if (faseS12Activa === 1) inputS12.value = "19";
            else if (faseS12Activa === 2) inputS12.value = "95.55";
            else if (faseS12Activa === 3) inputS12.value = "3.31";
            else if (faseS12Activa === 4) inputS12.value = "392"; // <--- Fase 4
        }
        
        // Marcamos todo el Sector 11 como completado por seguridad
        for(let i=1; i<=4; i++) progreso[i] = [true,true,true,true];
        actualizarMapas();

        // Activamos la puerta del núcleo
        let pNucleo = document.getElementById('puerta-nucleo');
        if (pNucleo) {
            pNucleo.classList.remove('bloqueada');
            pNucleo.classList.add('activa');
            document.getElementById('subtitulo-nucleo').innerHTML = "<span style='color:#39ff14;'>[ DESBLOQUEADO ]</span><br>PRUEBA FINAL";
        }
    } 
    else if (mod === 99) {
        let inputNucleo = document.getElementById('input-nucleo');
        if (inputNucleo) inputNucleo.value = "312.5";
    }
}
        function reiniciarTodo() {
    localStorage.removeItem('aqualab_save');
    location.reload();
}
let inputActivo = null;

        function configurarInputsParaTeclado() {
            // Buscamos todos los inputs excepto el de nombre de equipo inicial
            const inputs = document.querySelectorAll('input');
            inputs.forEach(input => {
                // Si es el input de equipo lo dejamos normal, los demás modo tablet
                if (input.id === "input-equipo") return;

                input.setAttribute('readonly', 'true'); 
                
                input.onclick = (e) => {
                    e.stopPropagation();
                    inputActivo = input;
                    document.getElementById('teclado-virtual').style.display = 'grid';
                    // Resaltar visualmente
                    document.querySelectorAll('input').forEach(i => i.style.boxShadow = "none");
                    input.style.boxShadow = "0 0 15px #00ffff";
                };
            });
        }

        function teclear(valor) {
            if (!inputActivo) return;
            
            if (valor === 'DEL') {
                inputActivo.value = inputActivo.value.slice(0, -1);
            } else {
                if (valor === '.' && inputActivo.value.includes('.')) return;
                inputActivo.value += valor;
            }

            // ESTO ES VITAL: Avisa al resto del código que el valor ha cambiado
            inputActivo.dispatchEvent(new Event('input'));
            inputActivo.dispatchEvent(new Event('change'));
        }

        function cerrarTeclado() {
            document.getElementById('teclado-virtual').style.display = 'none';
            if(inputActivo) inputActivo.style.boxShadow = "none";
            inputActivo = null;
        }

        // Configuración inicial
        window.addEventListener('load', configurarInputsParaTeclado);
        setInterval(configurarInputsParaTeclado, 2000); 

        // Cerrar si tocas el fondo de la pantalla
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#teclado-virtual') && !e.target.closest('input')) {
                cerrarTeclado();
            }
        });

/* ================= PANTALLA: PROYECTO "CABLES" ================= */
            (() => {
                const panel = document.getElementById('panel-juego-cables');
                const svg = document.getElementById('capa-cables');
                let origenActual = null;
                let cableActual = null;

                const colores = { 'c1': '#ff0055', 'c2': '#00aaff', 'c3': '#ffaa00', 'c4': '#00ffaa' };
                let conexiones = { izq1: false, izq2: false, izq3: false, izq4: false };

                function obtenerCentro(elemento) {
                    const rect = elemento.getBoundingClientRect();
                    const panelRect = panel.getBoundingClientRect();
                    return { x: rect.left - panelRect.left + (rect.width / 2), y: rect.top - panelRect.top + (rect.height / 2) };
                }

                document.querySelectorAll('#pantalla-proyecto-cables .c-izq').forEach(conector => {
                    conector.addEventListener('click', (e) => {
                        e.stopPropagation();
                        document.querySelectorAll('#pantalla-proyecto-cables .c-izq').forEach(c => c.classList.remove('seleccionado'));
                        conector.classList.add('seleccionado');
                        
                        let lineaExistente = document.getElementById('linea-' + conector.dataset.id);
                        if (lineaExistente) lineaExistente.remove();
                        conexiones[conector.dataset.id] = false;

                        if (cableActual) cableActual.remove();

                        origenActual = conector;
                        cableActual = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        cableActual.setAttribute('id', 'linea-' + origenActual.dataset.id);
                        
                        const centro = obtenerCentro(conector);
                        cableActual.setAttribute('x1', centro.x); 
                        cableActual.setAttribute('y1', centro.y);
                        cableActual.setAttribute('x2', centro.x); 
                        cableActual.setAttribute('y2', centro.y);
                        
                        cableActual.setAttribute('stroke', colores[origenActual.dataset.color]);
                        cableActual.setAttribute('stroke-width', '8'); 
                        cableActual.setAttribute('stroke-linecap', 'round');
                        svg.appendChild(cableActual);
                    });
                });

                panel.addEventListener('mousemove', (e) => {
                    if (!cableActual || !origenActual) return;
                    const panelRect = panel.getBoundingClientRect();
                    cableActual.setAttribute('x2', e.clientX - panelRect.left);
                    cableActual.setAttribute('y2', e.clientY - panelRect.top);
                });

                document.querySelectorAll('#pantalla-proyecto-cables .c-der').forEach(conectorDer => {
                    conectorDer.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (!origenActual || !cableActual) return;

                        if (conectorDer.dataset.id === origenActual.dataset.match) {
                            const centroDestino = obtenerCentro(conectorDer);
                            cableActual.setAttribute('x2', centroDestino.x); 
                            cableActual.setAttribute('y2', centroDestino.y);
                            conectorDer.classList.add('conectado'); 
                            conexiones[origenActual.dataset.id] = true;
                            
                            // LÓGICA DE FUSIBLES (ACTUALIZADA)
                            if (Object.values(conexiones).every(estado => estado === true)) {
                                const f = document.getElementById('feedback-cables');
                                f.style.color = '#39ff14'; f.style.textShadow = '0 0 10px #39ff14';
                                f.innerText = "[ CALIBRACIÓN COMPLETADA CON ÉXITO ]";
                                document.getElementById('status-light').classList.add('active');
                                document.getElementById('btn-avanzar-fusibles').disabled = false;
                            }
                        } else {
                            cableActual.remove();
                        }

                        origenActual.classList.remove('seleccionado');
                        cableActual = null; 
                        origenActual = null;
                    });
                });

                panel.addEventListener('click', () => {
                    if (cableActual) {
                        cableActual.remove();
                        if (origenActual) origenActual.classList.remove('seleccionado');
                        cableActual = null;
                        origenActual = null;
                    }
                });
            })();

/* ================= PANTALLA: PROYECTO "PURGA" ================= */
            (() => {
                let purgaInterval = null;
                let tiempoPurga = 60;
                let estadoCables = { azul: false, verde: false };
                let juegoActivo = false;

                window.purga_verificarPregunta = function() {
                    const resOriginal = document.getElementById("input-pregunta-purga").value.trim().toUpperCase();
                    const res = resOriginal.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    const feed = document.getElementById("feed-purga-pregunta");
                    
                    if (res === "PRESION") {
                        feed.style.color = "#39ff14";
                        feed.innerText = "✓ ACCESO CONCEDIDO";
                        setTimeout(() => {
                            document.getElementById("purga-fase-1").className = "fase-oculta";
                            document.getElementById("purga-fase-2").className = "fase-activa";
                            iniciarBomba();
                        }, 1200);
                    } else {
                        feed.style.color = "#ff073a";
                        feed.innerText = "✗ RESPUESTA INCORRECTA";
                        setTimeout(() => feed.innerText = "", 2000);
                    }
                };

                // Función para arrancar Fase 2
                function iniciarBomba() {
                    tiempoPurga = 60;
                    juegoActivo = true;
                    estadoCables = { azul: false, verde: false };
                    
                    // Restauramos colores por si vienen de un reinicio
                    const contenedor = document.getElementById("purga-contenedor-main");
                    contenedor.style.borderColor = "#ff073a";
                    contenedor.style.boxShadow = "0 0 40px rgba(255, 7, 58, 0.3)";
                    
                    let timerUI = document.getElementById("timer-bomba");
                    timerUI.style.color = "#ff073a";
                    timerUI.style.textShadow = "0 0 25px #ff073a";
                    
                    // Restauramos cables
                    document.getElementById("btn-cable-rojo").className = "cable-bomba cable-rojo";
                    document.getElementById("btn-cable-azul").className = "cable-bomba cable-azul";
                    document.getElementById("btn-cable-verde").className = "cable-bomba cable-verde";
                    document.getElementById("feed-purga-bomba").innerText = "";
                    
                    clearInterval(purgaInterval);
                    purgaInterval = setInterval(() => {
                        if (!juegoActivo) return;
                        tiempoPurga--;
                        let secs = tiempoPurga.toString().padStart(2, '0');
                        timerUI.innerText = `00:${secs}`;
                        
                        if (tiempoPurga <= 0) {
                            explotarBomba("¡TIEMPO AGOTADO!");
                        }
                    }, 1000);
                }

                // Lógica de corte de cables
                window.purga_cortarCable = function(color) {
                    if (!juegoActivo) return;
                    let cable = document.getElementById(`btn-cable-${color}`);
                    let feed = document.getElementById("feed-purga-bomba");

                    if (color === 'rojo') {
                        cable.classList.add("cable-cortado");
                        explotarBomba("¡CORTASTE EL CABLE EQUIVOCADO!");
                    } 
                    else if (color === 'azul') {
                        cable.classList.add("cable-cortado");
                        estadoCables.azul = true;
                        feed.style.color = "#00ffff";
                        feed.innerText = "Refrigeración desconectada. Falta estabilizar.";
                    } 
                    else if (color === 'verde') {
                        if (!estadoCables.azul) {
                            cable.classList.add("cable-cortado");
                            explotarBomba("¡ERROR DE SECUENCIA! NÚCLEO SOBRECARGADO.");
                        } else {
                            cable.classList.add("cable-cortado");
                            estadoCables.verde = true;
                            desactivarBombaExito();
                        }
                    }
                };

                // Pantalla de Game Over
                function explotarBomba(razon) {
                    juegoActivo = false;
                    clearInterval(purgaInterval);
                    let feed = document.getElementById("feed-purga-bomba");
                    let timer = document.getElementById("timer-bomba");
                    let contenedor = document.getElementById("purga-contenedor-main");
                    
                    timer.innerText = "ERROR";
                    timer.style.animation = "temblor-error 0.1s infinite";
                    contenedor.style.borderColor = "#ff073a";
                    contenedor.style.boxShadow = "0 0 80px #ff073a";
                    
                    feed.style.color = "#ff073a";
                    feed.innerText = razon + " REINICIANDO SISTEMA...";
                    
                    // Reiniciamos al principio después de la explosión
                    setTimeout(() => {
                        timer.style.animation = "none";
                        document.getElementById("input-pregunta-purga").value = "";
                        document.getElementById("feed-purga-pregunta").innerText = "";
                        document.getElementById("purga-fase-2").className = "fase-oculta";
                        document.getElementById("purga-fase-1").className = "fase-activa";
                    }, 4000);
                }

                // Pantalla de Victoria
                function desactivarBombaExito() {
                    juegoActivo = false;
                    clearInterval(purgaInterval);
                    let feed = document.getElementById("feed-purga-bomba");
                    let timer = document.getElementById("timer-bomba");
                    let contenedor = document.getElementById("purga-contenedor-main");
                    
                    timer.style.color = "#39ff14";
                    timer.style.textShadow = "0 0 30px #39ff14";
                    contenedor.style.borderColor = "#39ff14";
                    contenedor.style.boxShadow = "0 0 60px #39ff14";
                    
                    feed.style.color = "#39ff14";
                    feed.innerText = "✓ PURGA COMPLETADA. SISTEMA ESTABLE.";
                }
            })();

/* ================= ACCESIBILIDAD: elementos clicables no semanticos ================= */
(() => {
  const activar = (el) => {
    if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'INPUT') return;
    if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    if (el._a11yKey) return;
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
    el._a11yKey = true;
  };
  const escanear = () => document.querySelectorAll('[onclick]').forEach(activar);
  escanear();
  new MutationObserver(() => escanear()).observe(document.body, { subtree: true, childList: true });
})();
