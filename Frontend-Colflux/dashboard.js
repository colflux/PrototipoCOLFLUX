// -----------------------------------------------------------------------------
// DASHBOARD COLFLUX
// Relación entre datos cuantitativos y diccionario ecológico
// -----------------------------------------------------------------------------

// Guarda todos los datos de flujo recibidos desde /api/flujos.
let datosFlujos = [];

// Guarda todos los términos del diccionario recibidos desde /api/wiki.
let datosDiccionario = [];

// Guarda la gráfica de Chart.js para poder destruirla y actualizarla.
let graficaFlujos = null;


// -----------------------------------------------------------------------------
// FUNCIÓN PRINCIPAL
// -----------------------------------------------------------------------------

function iniciarDashboard() {

    // Mensaje para verificar que el archivo está conectado.
    console.log("Dashboard COLFLUX iniciado correctamente.");

    // Configura eventos de los filtros.
    configurarFiltros();

    // Carga datos de flujos y diccionario.
    cargarDatosIniciales();
}


// -----------------------------------------------------------------------------
// CARGA INICIAL DE DATOS
// -----------------------------------------------------------------------------

function cargarDatosIniciales() {

    // Promise.all permite cargar al mismo tiempo flujos y diccionario.
    Promise.all([
        fetch("http://localhost:8080/api/flujos").then(response => response.json()),
        fetch("http://localhost:8080/api/wiki").then(response => response.json())
    ])

        // Cuando ambas APIs responden, recibimos los dos arreglos.
        .then(([flujos, diccionario]) => {

            // Guarda los datos de flujo.
            // Agregamos un índice interno para identificar cada medición.
            datosFlujos = flujos.map((item, index) => ({
                ...item,
                indiceInterno: index
            }));

            // Guarda los términos del diccionario.
            datosDiccionario = diccionario;

            // Llena automáticamente el selector de puntos.
            cargarPuntosDisponibles();

            // Actualiza dashboard completo.
            actualizarDashboard();
        })

        // Captura errores de conexión.
        .catch(error => {

            // Muestra el error técnico.
            console.error("Error al cargar datos iniciales:", error);

            // Muestra error en tabla.
            const tablaBody = document.getElementById("tabla-dashboard-body");

            if (tablaBody) {
                tablaBody.innerHTML = `
                    <tr>
                        <td colspan="15">No se pudieron cargar los datos desde el backend.</td>
                    </tr>
                `;
            }

            // Muestra error en relaciones.
            const relaciones = document.getElementById("relaciones-diccionario");

            if (relaciones) {
                relaciones.textContent =
                    "No se pudieron cargar las relaciones con el diccionario.";
            }
        });
}


// -----------------------------------------------------------------------------
// CONFIGURAR FILTROS
// -----------------------------------------------------------------------------

function configurarFiltros() {

    // Selector de punto.
    const filtroPunto = document.getElementById("filtro-punto");

    // Selector de variable.
    const filtroVariable = document.getElementById("filtro-variable");

    // Selector día/noche.
    const filtroDiaNoche = document.getElementById("filtro-dia-noche");

    // Selector de medición.
    const filtroMedicion = document.getElementById("filtro-medicion");

    // Al cambiar el punto, se actualiza todo.
    if (filtroPunto) {
        filtroPunto.addEventListener("change", actualizarDashboard);
    }

    // Al cambiar variable, se actualiza la gráfica.
    if (filtroVariable) {
        filtroVariable.addEventListener("change", actualizarDashboard);
    }

    // Al cambiar día/noche, se actualiza todo.
    if (filtroDiaNoche) {
        filtroDiaNoche.addEventListener("change", actualizarDashboard);
    }

    // Al cambiar medición, solo actualiza la relación con el diccionario.
    if (filtroMedicion) {
        filtroMedicion.addEventListener("change", actualizarRelacionDiccionario);
    }
}


// -----------------------------------------------------------------------------
// CARGAR PUNTOS DISPONIBLES
// -----------------------------------------------------------------------------

function cargarPuntosDisponibles() {

    // Busca el selector de punto.
    const filtroPunto = document.getElementById("filtro-punto");

    // Si no existe, se detiene.
    if (!filtroPunto) {
        return;
    }

    // Extrae puntos existentes.
    const puntos = datosFlujos
        .map(item => item.point)
        .filter(point => point !== null && point !== undefined);

    // Elimina repetidos.
    const puntosUnicos = [...new Set(puntos)];

    // Ordena numéricamente.
    puntosUnicos.sort((a, b) => Number(a) - Number(b));

    // Limpia selector.
    filtroPunto.innerHTML = "";

    // Si no hay puntos, muestra aviso.
    if (puntosUnicos.length === 0) {
        filtroPunto.innerHTML = `<option value="">Sin puntos disponibles</option>`;
        return;
    }

    // Crea una opción por punto.
    puntosUnicos.forEach(punto => {

        // Crea option.
        const opcion = document.createElement("option");

        // Valor.
        opcion.value = punto;

        // Texto visible.
        opcion.textContent = `Punto ${punto}`;

        // Agrega opción.
        filtroPunto.appendChild(opcion);
    });

    // Selecciona el primer punto disponible.
    filtroPunto.value = puntosUnicos[0];
}


// -----------------------------------------------------------------------------
// ACTUALIZAR DASHBOARD COMPLETO
// -----------------------------------------------------------------------------

function actualizarDashboard() {

    // Obtiene datos filtrados por punto y día/noche.
    const datosFiltrados = obtenerDatosFiltrados();

    // Actualiza selector de mediciones.
    cargarMedicionesDisponibles(datosFiltrados);

    // Actualiza gráfica.
    actualizarGrafica(datosFiltrados);

    // Muestra vegetación del punto.
    mostrarVegetacion(datosFiltrados);

    // Muestra tabla filtrada.
    mostrarTabla(datosFiltrados);

    // Actualiza relación con diccionario.
    actualizarRelacionDiccionario();
}


// -----------------------------------------------------------------------------
// OBTENER DATOS FILTRADOS
// -----------------------------------------------------------------------------

function obtenerDatosFiltrados() {

    // Selector punto.
    const filtroPunto = document.getElementById("filtro-punto");

    // Selector día/noche.
    const filtroDiaNoche = document.getElementById("filtro-dia-noche");

    // Valor punto.
    const puntoSeleccionado = filtroPunto ? filtroPunto.value : "";

    // Valor día/noche.
    const condicionSeleccionada = filtroDiaNoche ? filtroDiaNoche.value : "todos";

    // Filtra datos.
    const filtrados = datosFlujos.filter(item => {

        // Coincidencia punto.
        const coincidePunto = String(item.point) === String(puntoSeleccionado);

        // Coincidencia día/noche.
        const coincideCondicion =
            condicionSeleccionada === "todos" ||
            String(item.dayNight).toLowerCase() === condicionSeleccionada;

        // Retorna si cumple ambos.
        return coincidePunto && coincideCondicion;
    });

    // Ordena por fecha.
    filtrados.sort((a, b) => String(a.date).localeCompare(String(b.date)));

    // Devuelve datos filtrados.
    return filtrados;
}


// -----------------------------------------------------------------------------
// CARGAR MEDICIONES DISPONIBLES
// -----------------------------------------------------------------------------

function cargarMedicionesDisponibles(datosFiltrados) {

    // Busca selector de medición.
    const filtroMedicion = document.getElementById("filtro-medicion");

    // Si no existe, detiene.
    if (!filtroMedicion) {
        return;
    }

    // Limpia opciones.
    filtroMedicion.innerHTML = "";

    // Si no hay datos, muestra aviso.
    if (datosFiltrados.length === 0) {
        filtroMedicion.innerHTML = `<option value="">Sin mediciones disponibles</option>`;
        return;
    }

    // Crea opción por cada medición.
    datosFiltrados.forEach((item, index) => {

        // Crea option.
        const opcion = document.createElement("option");

        // Usa índice interno para identificar el registro.
        opcion.value = item.indiceInterno;

        // Construye texto visible.
        opcion.textContent = `Medición ${index + 1} | ${item.date} | ${item.dayNight}`;

        // Agrega option.
        filtroMedicion.appendChild(opcion);
    });

    // Selecciona la primera medición disponible.
    filtroMedicion.value = datosFiltrados[0].indiceInterno;
}


// -----------------------------------------------------------------------------
// ACTUALIZAR GRÁFICA
// -----------------------------------------------------------------------------

function actualizarGrafica(datos) {

    // Busca canvas.
    const canvas = document.getElementById("grafica-flujos");

    // Si no existe, detiene.
    if (!canvas) {
        return;
    }

    // Busca filtro de variable.
    const filtroVariable = document.getElementById("filtro-variable");

    // Variable seleccionada.
    const variableSeleccionada = filtroVariable ? filtroVariable.value : "ambas";

    // Contexto 2D.
    const ctx = canvas.getContext("2d");

    // Etiquetas eje X.
    const etiquetas = datos.map(item => item.date);

    // Datos CO2.
    const datosCo2 = datos.map(item => item.co2Flux);

    // Datos CH4.
    const datosCh4 = datos.map(item => item.ch4Flux);

    // Arreglo de datasets.
    const datasets = [];

    // Agrega CO2.
    if (variableSeleccionada === "ambas" || variableSeleccionada === "co2") {
        datasets.push({
            label: "CO₂ flux Micromol/m²/s",
            data: datosCo2,
            fill: false,
            tension: 0.25
        });
    }

    // Agrega CH4.
    if (variableSeleccionada === "ambas" || variableSeleccionada === "ch4") {
        datasets.push({
            label: "CH₄ flux Micromol/m²/s",
            data: datosCh4,
            fill: false,
            tension: 0.25
        });
    }

    // Destruye gráfica previa.
    if (graficaFlujos !== null) {
        graficaFlujos.destroy();
    }

    // Título dinámico.
    let tituloGrafica = "Flujos de CO₂ y CH₄ por fecha";

    if (variableSeleccionada === "co2") {
        tituloGrafica = "Flujo de CO₂ por fecha";
    }

    if (variableSeleccionada === "ch4") {
        tituloGrafica = "Flujo de CH₄ por fecha";
    }

    // Crea gráfica.
    graficaFlujos = new Chart(ctx, {
        type: "line",
        data: {
            labels: etiquetas,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: tituloGrafica
                },
                legend: {
                    display: true,
                    position: "top"
                },
                tooltip: {
                    mode: "index",
                    intersect: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Fecha"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Flujo Micromol/m²/s"
                    },
                    beginAtZero: false
                }
            }
        }
    });
}


// -----------------------------------------------------------------------------
// MOSTRAR VEGETACIÓN
// -----------------------------------------------------------------------------

function mostrarVegetacion(datos) {

    // Busca contenedor.
    const vegetacionContenedor = document.getElementById("vegetacion-punto");

    // Si no existe, detiene.
    if (!vegetacionContenedor) {
        return;
    }

    // Si no hay datos.
    if (datos.length === 0) {
        vegetacionContenedor.textContent =
            "Vegetación del punto seleccionado: sin datos disponibles.";
        return;
    }

    // Extrae vegetación.
    const vegetaciones = datos
        .map(item => item.vegetation)
        .filter(valor => valor !== null && valor !== undefined && String(valor).trim() !== "");

    // Elimina duplicados.
    const vegetacionesUnicas = [...new Set(vegetaciones)];

    // Si no hay vegetación.
    if (vegetacionesUnicas.length === 0) {
        vegetacionContenedor.textContent =
            "Vegetación del punto seleccionado: sin información registrada.";
        return;
    }

    // Muestra vegetación.
    vegetacionContenedor.textContent =
        "Vegetación del punto seleccionado: " + vegetacionesUnicas.join(", ");
}


// -----------------------------------------------------------------------------
// MOSTRAR TABLA
// -----------------------------------------------------------------------------

function mostrarTabla(datos) {

    // Busca tabla.
    const tablaBody = document.getElementById("tabla-dashboard-body");

    // Si no existe, detiene.
    if (!tablaBody) {
        return;
    }

    // Limpia tabla.
    tablaBody.innerHTML = "";

    // Si no hay datos.
    if (datos.length === 0) {
        tablaBody.innerHTML = `
            <tr>
                <td colspan="15">No hay datos para el filtro seleccionado.</td>
            </tr>
        `;
        return;
    }

    // Recorre datos.
    datos.forEach(item => {

        // Crea fila.
        const fila = document.createElement("tr");

        // Inserta columnas.
        fila.innerHTML = `
            <td>${item.date ?? "Sin dato"}</td>
            <td>${item.point ?? "Sin dato"}</td>
            <td>${item.dayNight ?? "Sin dato"}</td>
            <td>${item.co2Flux ?? "Sin dato"}</td>
            <td>${item.ch4Flux ?? "Sin dato"}</td>
            <td>${item.groundTemperature ?? "Sin dato"}</td>
            <td>${item.airTemperature ?? "Sin dato"}</td>
            <td>${item.atmosphericPressure ?? "Sin dato"}</td>
            <td>${item.rh ?? "Sin dato"}</td>
            <td>${item.dewPoint ?? "Sin dato"}</td>
            <td>${item.parStart ?? "Sin dato"}</td>
            <td>${item.parEnd ?? "Sin dato"}</td>
            <td>${item.vegetation ?? "Sin dato"}</td>
            <td>${item.waterLevelCm ?? "Sin dato"}</td>
            <td>${item.waterLevelMsnm ?? "Sin dato"}</td>
        `;

        // Agrega fila.
        tablaBody.appendChild(fila);
    });
}


// -----------------------------------------------------------------------------
// ACTUALIZAR RELACIÓN CON DICCIONARIO
// -----------------------------------------------------------------------------

function actualizarRelacionDiccionario() {

    // Busca selector de medición.
    const filtroMedicion = document.getElementById("filtro-medicion");

    // Busca contenedor de resultados.
    const contenedor = document.getElementById("relaciones-diccionario");

    // Si no existen, detiene.
    if (!filtroMedicion || !contenedor) {
        return;
    }

    // Obtiene índice seleccionado.
    const indiceSeleccionado = filtroMedicion.value;

    // Busca registro seleccionado.
    const registro = datosFlujos.find(item =>
        String(item.indiceInterno) === String(indiceSeleccionado)
    );

    // Si no hay registro.
    if (!registro) {
        contenedor.textContent =
            "Selecciona una medición válida para ver relaciones con el diccionario.";
        return;
    }

    // Busca términos del diccionario que cumplan reglas cuantitativas.
    const relaciones = datosDiccionario.filter(termino => {

        // Si no tiene regla, no se evalúa.
        if (!termino.reglaCuantitativa || termino.reglaCuantitativa.trim() === "") {
            return false;
        }

        // Evalúa la regla.
        return evaluarReglaCuantitativa(termino.reglaCuantitativa, registro);
    });

    // Muestra resultados.
    mostrarRelacionesDiccionario(relaciones, registro);
}


// -----------------------------------------------------------------------------
// MOSTRAR RELACIONES
// -----------------------------------------------------------------------------

function mostrarRelacionesDiccionario(relaciones, registro) {

    // Busca contenedor.
    const contenedor = document.getElementById("relaciones-diccionario");

    // Si no existe, detiene.
    if (!contenedor) {
        return;
    }

    // Si no hay relaciones.
    if (relaciones.length === 0) {
        contenedor.innerHTML = `
            <h3>Relación con diccionario</h3>
            <p>
                Para esta medición no se encontraron términos del diccionario
                que cumplan directamente las reglas cuantitativas registradas.
            </p>
            <p class="resumen-medicion">
                RH: ${registro.rh ?? "Sin dato"} |
                CH₄: ${registro.ch4Flux ?? "Sin dato"} |
                CO₂: ${registro.co2Flux ?? "Sin dato"} |
                Nivel agua: ${registro.waterLevelCm ?? "Sin dato"} cm
            </p>
        `;
        return;
    }

    // Construye tarjetas de relación.
    const tarjetas = relaciones.map(termino => `
        <div class="relacion-item">
            <span class="relacion-categoria">${termino.categoria}</span>
            <h4>${termino.titulo}</h4>
            <p>${termino.descripcion}</p>
            <div class="relacion-regla">
                <strong>Regla cumplida:</strong>
                ${termino.reglaCuantitativa}
            </div>
            <div class="relacion-interpretacion">
                <strong>Interpretación:</strong>
                ${termino.interpretacion || "Sin interpretación registrada."}
            </div>
        </div>
    `).join("");

    // Inserta contenido.
    contenedor.innerHTML = `
        <h3>Relación con diccionario</h3>
        <p>
            Según los valores de la medición seleccionada, se encontraron
            las siguientes posibles relaciones ecológicas:
        </p>
        <p class="resumen-medicion">
            RH: ${registro.rh ?? "Sin dato"} |
            CH₄: ${registro.ch4Flux ?? "Sin dato"} |
            CO₂: ${registro.co2Flux ?? "Sin dato"} |
            Nivel agua: ${registro.waterLevelCm ?? "Sin dato"} cm
        </p>
        <div class="relaciones-lista">
            ${tarjetas}
        </div>
    `;
}


// -----------------------------------------------------------------------------
// EVALUAR REGLA CUANTITATIVA
// -----------------------------------------------------------------------------

function evaluarReglaCuantitativa(regla, registro) {

    // Normaliza símbolos de comparación.
    const reglaNormalizada = regla
        .replaceAll("≥", ">=")
        .replaceAll("≤", "<=");

    // Separa condiciones alternativas por " o ".
    // Ejemplo: A + B o C se interpreta como (A y B) o C.
    const gruposOR = reglaNormalizada.split(/\s+o\s+/i);

    // Evalúa cada grupo.
    return gruposOR.some(grupo => {

        // Separa condiciones obligatorias por "+".
        const condicionesAND = grupo.split("+");

        // Todas las condiciones del grupo deben cumplirse.
        return condicionesAND.every(condicion => evaluarCondicion(condicion, registro));
    });
}


// -----------------------------------------------------------------------------
// EVALUAR UNA CONDICIÓN INDIVIDUAL
// -----------------------------------------------------------------------------

function evaluarCondicion(condicion, registro) {

    // Limpia texto.
    const texto = condicion.trim();

    // Expresión regular para buscar variable, operador y número.
    const patron = /(RH|CH4|CO2|Water_level_cm|Ground_temperature|Air_temperature|Air_temeprature|Dew_point|PAR_start|PAR_end)\s*(>=|<=|>|<|=)\s*([0-9]+(?:[.,][0-9]+)?)/i;

    // Aplica patrón.
    const resultado = texto.match(patron);

    // Si no entiende la condición, retorna false.
    if (!resultado) {
        return false;
    }

    // Variable detectada.
    const variable = resultado[1];

    // Operador.
    const operador = resultado[2];

    // Valor umbral.
    const umbral = Number(resultado[3].replace(",", "."));

    // Valor real del registro.
    const valorReal = obtenerValorRegistro(variable, registro);

    // Si no hay valor real, no cumple.
    if (valorReal === null || valorReal === undefined || isNaN(valorReal)) {
        return false;
    }

    // Evalúa según operador.
    if (operador === ">=") {
        return valorReal >= umbral;
    }

    if (operador === "<=") {
        return valorReal <= umbral;
    }

    if (operador === ">") {
        return valorReal > umbral;
    }

    if (operador === "<") {
        return valorReal < umbral;
    }

    if (operador === "=") {
        return valorReal === umbral;
    }

    // Si operador no reconocido.
    return false;
}


// -----------------------------------------------------------------------------
// OBTENER VALOR DEL REGISTRO SEGÚN VARIABLE DEL DICCIONARIO
// -----------------------------------------------------------------------------

function obtenerValorRegistro(variable, registro) {

    // Normaliza nombre.
    const v = variable.toLowerCase();

    // Humedad relativa.
    if (v === "rh") {
        return Number(registro.rh);
    }

    // CH4.
    if (v === "ch4") {
        return Number(registro.ch4Flux);
    }

    // CO2.
    if (v === "co2") {
        return Number(registro.co2Flux);
    }

    // Nivel de agua.
    if (v === "water_level_cm") {
        return Number(registro.waterLevelCm);
    }

    // Temperatura del suelo.
    if (v === "ground_temperature") {
        return Number(registro.groundTemperature);
    }

    // Temperatura del aire.
    if (v === "air_temperature" || v === "air_temeprature") {
        return Number(registro.airTemperature);
    }

    // Punto de rocío.
    if (v === "dew_point") {
        return Number(registro.dewPoint);
    }

    // PAR inicial.
    if (v === "par_start") {
        return Number(registro.parStart);
    }

    // PAR final.
    if (v === "par_end") {
        return Number(registro.parEnd);
    }

    // Si no reconoce variable.
    return null;
}


// Ejecuta la función principal al abrir la página.
iniciarDashboard();