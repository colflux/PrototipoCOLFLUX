// -----------------------------------------------------------------------------
// DICCIONARIO COLFLUX
// Archivo JavaScript específico para diccionario.html
// -----------------------------------------------------------------------------
const API_BASE_URL = "https://prototipocolflux.onrender.com";
// Variable global donde guardaremos todos los términos recibidos desde el backend.
let terminosWiki = [];

// Guarda el término actualmente seleccionado en el panel derecho.
let terminoSeleccionado = null;

// -----------------------------------------------------------------------------
// FUNCIÓN PRINCIPAL: iniciar diccionario
// -----------------------------------------------------------------------------

function iniciarDiccionario() {

    // Mensaje para verificar en consola que el archivo JS sí está conectado.
    console.log("Diccionario COLFLUX iniciado.");

    // Carga los términos desde la API del backend.
    cargarTerminosDesdeBackend();

    // Activa el buscador.
    configurarBuscador();

    // Activa los filtros por categoría.
    configurarFiltroCategorias();

    // Activa el control de valoración del semáforo.
configurarSemaforo();
}


// -----------------------------------------------------------------------------
// FUNCIÓN AUXILIAR: obtener un elemento del HTML de forma segura
// -----------------------------------------------------------------------------

function obtenerElemento(id) {

    // Busca el elemento por su id.
    const elemento = document.getElementById(id);

    // Si no existe, muestra un aviso claro en consola.
    if (!elemento) {
        console.error(`No se encontró el elemento con id="${id}" en diccionario.html`);
    }

    // Devuelve el elemento encontrado o null.
    return elemento;
}


// -----------------------------------------------------------------------------
// FUNCIÓN: cargar términos desde backend
// -----------------------------------------------------------------------------

function cargarTerminosDesdeBackend() {

    // Consulta la API del backend.
    fetch(`${API_BASE_URL}/api/wiki`)

        // Convierte la respuesta en JSON.
        .then(response => {

            // Verifica si la respuesta HTTP fue correcta.
            if (!response.ok) {
                throw new Error("La API /api/wiki respondió con error.");
            }

            // Devuelve el JSON.
            return response.json();
        })

        // Recibe la lista de términos.
        .then(data => {

            // Guarda la lista en la variable global.
            terminosWiki = data;

            // Ordena alfabéticamente por título.
            terminosWiki.sort((a, b) =>
                (a.titulo || "").localeCompare(b.titulo || "")
            );

            // Muestra todos los términos en el panel izquierdo.
            mostrarListaTerminos(terminosWiki);

            // Si hay datos, muestra el primer término en el panel derecho.
            if (terminosWiki.length > 0) {
                mostrarDetalleTermino(terminosWiki[0]);
            }
        })

        // Captura errores reales de conexión o de lectura de la API.
        .catch(error => {

            // Muestra el error técnico en consola.
            console.error("Error al cargar términos del diccionario:", error);

            // Busca el contenedor de términos.
            const listaTerminos = obtenerElemento("lista-terminos");

            // Si existe, muestra mensaje.
            if (listaTerminos) {
                listaTerminos.textContent =
                    "No se pudieron cargar los términos desde el backend.";
            }

            // Busca el título del detalle.
            const detalleTitulo = obtenerElemento("detalle-titulo");

            // Si existe, muestra error.
            if (detalleTitulo) {
                detalleTitulo.textContent = "Error al cargar diccionario";
            }

            // Busca la definición.
            const detalleDefinicion = obtenerElemento("detalle-definicion");

            // Si existe, muestra explicación.
            if (detalleDefinicion) {
                detalleDefinicion.textContent =
                    "La API puede estar funcionando, pero hubo un problema cargando o mostrando los datos. Revisa la consola del navegador.";
            }

            // Busca el bloque avanzado.
            const bloqueAvanzado = obtenerElemento("bloque-avanzado");

            // Si existe, lo oculta.
            if (bloqueAvanzado) {
                bloqueAvanzado.style.display = "none";
            }
        });
}


// -----------------------------------------------------------------------------
// FUNCIÓN: mostrar lista de términos
// -----------------------------------------------------------------------------

function mostrarListaTerminos(lista) {

    // Busca el contenedor de la lista.
    const listaTerminos = obtenerElemento("lista-terminos");

    // Si no existe, detiene la función.
    if (!listaTerminos) {
        return;
    }

    // Limpia la lista anterior.
    listaTerminos.innerHTML = "";

    // Si no hay términos, muestra mensaje.
    if (lista.length === 0) {

        // Inserta aviso.
        listaTerminos.innerHTML = `
            <div class="termino-vacio">
                No se encontraron términos para este filtro.
            </div>
        `;

        // Detiene la función.
        return;
    }

    // Recorre cada término.
    lista.forEach(item => {

        // Crea un botón para el término.
        const botonTermino = document.createElement("button");

        // Agrega clase visual.
        botonTermino.classList.add("termino-item");

        // Muestra el título del término.
        botonTermino.textContent = item.titulo || "Sin título";

        // Guarda la categoría como atributo.
        botonTermino.setAttribute("data-categoria", item.categoria || "Sin categoría");

        // Al hacer clic, muestra el detalle.
        botonTermino.addEventListener("click", () => {
            mostrarDetalleTermino(item);
        });

        // Agrega el botón al panel izquierdo.
        listaTerminos.appendChild(botonTermino);
    });
}


// -----------------------------------------------------------------------------
// FUNCIÓN: mostrar detalle del término
// -----------------------------------------------------------------------------

function mostrarDetalleTermino(item) {

    // Guarda el término seleccionado actualmente.
    terminoSeleccionado = item;

    // Busca todos los elementos del panel derecho.
    const detalleCategoria = obtenerElemento("detalle-categoria");
    const detalleTitulo = obtenerElemento("detalle-titulo");
    const detalleDefinicion = obtenerElemento("detalle-definicion");
    const bloqueAvanzado = obtenerElemento("bloque-avanzado");
    const detalleVariableAsociada = obtenerElemento("detalle-variable-asociada");
    const detalleVariableSecundaria = obtenerElemento("detalle-variable-secundaria");
    const detalleReglaCuantitativa = obtenerElemento("detalle-regla-cuantitativa");
    const detalleInterpretacion = obtenerElemento("detalle-interpretacion");

    // Si falta alguno de los elementos básicos, detiene la función.
    if (!detalleCategoria || !detalleTitulo || !detalleDefinicion || !bloqueAvanzado) {
        return;
    }

    // Muestra la categoría.
    detalleCategoria.textContent = item.categoria || "Sin categoría";

    // Muestra el título.
    detalleTitulo.textContent = item.titulo || "Sin título";

    // Muestra la definición ecológica.
    detalleDefinicion.textContent =
        item.descripcion || "Este término no tiene definición ecológica registrada.";

    // Verifica si tiene información avanzada.
    if (item.tieneInformacionAvanzada === true) {

        // Muestra el bloque avanzado.
        bloqueAvanzado.style.display = "block";

        // Muestra variable asociada si existe el elemento.
        if (detalleVariableAsociada) {
            detalleVariableAsociada.textContent =
                mostrarTextoSeguro(item.variableAsociada);
        }

        // Muestra variable secundaria si existe el elemento.
        if (detalleVariableSecundaria) {
            detalleVariableSecundaria.textContent =
                mostrarTextoSeguro(item.variableSecundaria);
        }

        // Muestra regla cuantitativa si existe el elemento.
        if (detalleReglaCuantitativa) {
            detalleReglaCuantitativa.textContent =
                mostrarTextoSeguro(item.reglaCuantitativa);
        }

        // Muestra interpretación si existe el elemento.
        if (detalleInterpretacion) {
            detalleInterpretacion.textContent =
                mostrarTextoSeguro(item.interpretacion);
        }

    } else {

        // Si no tiene información avanzada, oculta ese bloque.
        bloqueAvanzado.style.display = "none";
    }
    // Carga el semáforo de aceptación del término seleccionado.
    cargarResumenValoracion(item.titulo);
}


// -----------------------------------------------------------------------------
// FUNCIÓN AUXILIAR: mostrar texto seguro
// -----------------------------------------------------------------------------

function mostrarTextoSeguro(valor) {

    // Si el valor es nulo, indefinido o vacío, devuelve mensaje por defecto.
    if (valor === null || valor === undefined || String(valor).trim() === "") {
        return "Sin información registrada.";
    }

    // Devuelve el texto limpio.
    return String(valor).trim();
}


// -----------------------------------------------------------------------------
// FUNCIÓN: configurar buscador
// -----------------------------------------------------------------------------

function configurarBuscador() {

    // Busca el input.
    const inputBusqueda = obtenerElemento("input-diccionario");

    // Busca el botón.
    const botonBusqueda = obtenerElemento("btn-diccionario");

    // Si alguno no existe, detiene la función.
    if (!inputBusqueda || !botonBusqueda) {
        return;
    }

    // Búsqueda al hacer clic.
    botonBusqueda.addEventListener("click", () => {
        buscarTerminos();
    });

    // Búsqueda mientras se escribe.
    inputBusqueda.addEventListener("input", () => {
        buscarTerminos();
    });
}


// -----------------------------------------------------------------------------
// FUNCIÓN: buscar términos
// -----------------------------------------------------------------------------

function buscarTerminos() {

    // Busca el input.
    const inputBusqueda = obtenerElemento("input-diccionario");

    // Si no existe, detiene la función.
    if (!inputBusqueda) {
        return;
    }

    // Obtiene el texto escrito.
    const texto = inputBusqueda.value.toLowerCase();

    // Filtra los términos.
    const resultados = terminosWiki.filter(item => {

        // Campos donde buscará coincidencias.
        const titulo = (item.titulo || "").toLowerCase();
        const descripcion = (item.descripcion || "").toLowerCase();
        const categoria = (item.categoria || "").toLowerCase();
        const variableAsociada = (item.variableAsociada || "").toLowerCase();
        const variableSecundaria = (item.variableSecundaria || "").toLowerCase();
        const reglaCuantitativa = (item.reglaCuantitativa || "").toLowerCase();
        const interpretacion = (item.interpretacion || "").toLowerCase();

        // Devuelve true si encuentra coincidencia.
        return titulo.includes(texto) ||
               descripcion.includes(texto) ||
               categoria.includes(texto) ||
               variableAsociada.includes(texto) ||
               variableSecundaria.includes(texto) ||
               reglaCuantitativa.includes(texto) ||
               interpretacion.includes(texto);
    });

    // Muestra resultados.
    mostrarListaTerminos(resultados);

    // Si hay resultados, muestra el primero.
    if (resultados.length > 0) {
        mostrarDetalleTermino(resultados[0]);
    }
}


// -----------------------------------------------------------------------------
// FUNCIÓN: configurar filtros por categoría
// -----------------------------------------------------------------------------

function configurarFiltroCategorias() {

    // Busca todos los botones del filtro de categorías.
    const botones = document.querySelectorAll(".filtro-categorias button");

    // Recorre cada botón.
    botones.forEach(boton => {

        // Agrega evento clic.
        boton.addEventListener("click", () => {

            // Quita la clase activa de todos los botones.
            botones.forEach(b => b.classList.remove("categoria-activa"));

            // Agrega clase activa al botón seleccionado.
            boton.classList.add("categoria-activa");

            // Obtiene la categoría seleccionada.
            const categoriaSeleccionada = boton.getAttribute("data-categoria");

            // Filtra y muestra términos.
            filtrarPorCategoria(categoriaSeleccionada);
        });
    });
}


// -----------------------------------------------------------------------------
// FUNCIÓN: filtrar términos por categoría
// -----------------------------------------------------------------------------

function filtrarPorCategoria(categoriaSeleccionada) {

    // Si selecciona todos, muestra toda la lista.
    if (categoriaSeleccionada === "todos") {

        // Muestra todos los términos.
        mostrarListaTerminos(terminosWiki);

        // Muestra el primero si existe.
        if (terminosWiki.length > 0) {
            mostrarDetalleTermino(terminosWiki[0]);
        }

        // Detiene la función.
        return;
    }

    // Filtra según la categoría funcional seleccionada.
    const filtrados = terminosWiki.filter(item => {

        // Limpia la categoría original que viene del CSV.
        // Ejemplo: "1. Olor" pasa a "olor".
        const categoriaLimpia = limpiarCategoria(item.categoria || "");

        // Limpia el título por si necesitamos detectar por nombre.
        const titulo = normalizarTexto(item.titulo || "");

        // Filtro Olor.
        // Usamos comparación exacta para evitar que "Color" entre en "Olor".
        if (categoriaSeleccionada === "olor") {
            return categoriaLimpia === "olor";
        }

        // Filtro Color.
        if (categoriaSeleccionada === "color") {
            return categoriaLimpia === "color";
        }

        // Filtro Suelo.
        // Incluye "suelo", "suelo al pisar", "suelo al tocar".
        if (categoriaSeleccionada === "suelo") {
            return categoriaLimpia.includes("suelo");
        }

        // Filtro Sensación ambiental.
        if (categoriaSeleccionada === "sensacion") {
            return categoriaLimpia.includes("sensacion ambiental") ||
                   categoriaLimpia === "sensacion" ||
                   categoriaLimpia.includes("ambiental");
        }

        // Filtro Observación.
        // Agrupa "Agua visible" y "Plantas observadas".
        if (categoriaSeleccionada === "observacion") {
            return categoriaLimpia === "agua visible" ||
                   categoriaLimpia === "plantas observadas" ||
                   categoriaLimpia.includes("observacion") ||
                   titulo.includes("agua visible") ||
                   titulo.includes("plantas observadas");
        }

        // Filtro Frases de campo.
        if (categoriaSeleccionada === "frases") {
            return categoriaLimpia === "frases de campo" ||
                   categoriaLimpia.includes("frase de campo") ||
                   categoriaLimpia === "frases";
        }

        // Filtro Definiciones.
        if (categoriaSeleccionada === "definiciones") {
            return categoriaLimpia === "definicion" ||
                   categoriaLimpia === "definiciones";
        }

        // Si no coincide con ningún caso, no lo muestra.
        return false;
    });

    // Muestra los términos filtrados.
    mostrarListaTerminos(filtrados);

    // Si hay resultados, muestra el primero.
    if (filtrados.length > 0) {
        mostrarDetalleTermino(filtrados[0]);
    }
}

// -----------------------------------------------------------------------------
// FUNCIÓN AUXILIAR: normalizar texto
// -----------------------------------------------------------------------------

function normalizarTexto(texto) {

    // Convierte a string por seguridad.
    return String(texto)

        // Pasa todo a minúsculas.
        .toLowerCase()

        // Normaliza tildes.
        .normalize("NFD")

        // Elimina marcas de acentos.
        .replace(/[\u0300-\u036f]/g, "")

        // Elimina espacios extra.
        .trim();
}

// -----------------------------------------------------------------------------
// FUNCIÓN AUXILIAR: limpiar categoría
// -----------------------------------------------------------------------------

function limpiarCategoria(categoria) {

    // Normaliza el texto: minúsculas, sin tildes y sin espacios extra.
    let texto = normalizarTexto(categoria);

    // Quita numeración inicial si existe.
    // Ejemplo: "1. olor" queda como "olor".
    // Ejemplo: "2. color" queda como "color".
    texto = texto.replace(/^\d+\.\s*/, "");

    // Quita dos puntos si existen.
    // Ejemplo: "olor:" queda como "olor".
    texto = texto.replace(":", "");

    // Devuelve la categoría limpia.
    return texto.trim();
}


// -----------------------------------------------------------------------------
// FUNCIÓN: configurar semáforo de aceptación
// -----------------------------------------------------------------------------

function configurarSemaforo() {

    // Busca el input tipo rango.
    const inputValoracion = document.getElementById("input-valoracion");

    // Busca el texto donde se muestra el porcentaje.
    const valorValoracion = document.getElementById("valor-valoracion");

    // Busca el botón para guardar.
    const botonGuardar = document.getElementById("btn-guardar-valoracion");

    // Si existe el input, actualiza el texto al moverlo.
    if (inputValoracion && valorValoracion) {

        // Cada vez que cambia el slider, actualiza el porcentaje visible.
        inputValoracion.addEventListener("input", () => {
            valorValoracion.textContent = inputValoracion.value + "%";
        });
    }

    // Si existe el botón, activa el guardado.
    if (botonGuardar) {

        // Al hacer clic, guarda la valoración.
        botonGuardar.addEventListener("click", guardarValoracion);
    }
}


// -----------------------------------------------------------------------------
// FUNCIÓN: guardar valoración del usuario
// -----------------------------------------------------------------------------

function guardarValoracion() {

    // Si no hay término seleccionado, no se puede guardar.
    if (!terminoSeleccionado) {
        return;
    }

    // Busca el input.
    const inputValoracion = document.getElementById("input-valoracion");

    // Busca el mensaje.
    const mensajeValoracion = document.getElementById("mensaje-valoracion");

    // Obtiene el puntaje como número.
    const puntaje = Number(inputValoracion.value);

    // Envía la valoración al backend.
    fetch(`${API_BASE_URL}/api/valoraciones`, {

        // Método POST para guardar.
        method: "POST",

        // Indicamos que enviamos JSON.
        headers: {
            "Content-Type": "application/json"
        },

        // Cuerpo de la solicitud.
        body: JSON.stringify({
            titulo: terminoSeleccionado.titulo,
            puntaje: puntaje
        })
    })

        // Convierte la respuesta en JSON.
        .then(response => response.json())

        // Recibe el resumen actualizado.
        .then(resumen => {

            // Actualiza el semáforo visual.
            actualizarVistaSemaforo(resumen);

            // Muestra mensaje de éxito.
            if (mensajeValoracion) {
                mensajeValoracion.textContent = "Valoración guardada correctamente.";
            }
        })

        // Captura errores.
        .catch(error => {

            // Muestra error técnico.
            console.error("Error al guardar valoración:", error);

            // Muestra mensaje visible.
            if (mensajeValoracion) {
                mensajeValoracion.textContent = "No se pudo guardar la valoración.";
            }
        });
}


// -----------------------------------------------------------------------------
// FUNCIÓN: cargar resumen de valoración de un término
// -----------------------------------------------------------------------------

function cargarResumenValoracion(titulo) {

    // Si no hay título, detiene.
    if (!titulo) {
        return;
    }

    // Codifica el título para enviarlo en la URL.
    const tituloCodificado = encodeURIComponent(titulo);

    // Consulta el resumen del término.
    fetch(`${API_BASE_URL}/api/valoraciones?titulo=${tituloCodificado}`)

        // Convierte respuesta en JSON.
        .then(response => response.json())

        // Recibe resumen.
        .then(resumen => {

            // Actualiza semáforo.
            actualizarVistaSemaforo(resumen);
        })

        // Captura errores.
        .catch(error => {

            // Muestra error en consola.
            console.error("Error al cargar resumen de valoración:", error);
        });
}


// -----------------------------------------------------------------------------
// FUNCIÓN: actualizar vista del semáforo
// -----------------------------------------------------------------------------

function actualizarVistaSemaforo(resumen) {

    // Busca el círculo del semáforo.
    const indicador = document.getElementById("semaforo-indicador");

    // Busca texto del promedio.
    const promedioAceptacion = document.getElementById("promedio-aceptacion");

    // Busca texto del total.
    const totalValoraciones = document.getElementById("total-valoraciones");

    // Si no existe el indicador, detiene.
    if (!indicador) {
        return;
    }

    // Limpia clases anteriores.
    indicador.classList.remove(
        "semaforo-rojo",
        "semaforo-amarillo",
        "semaforo-verde",
        "semaforo-gris"
    );

    // Agrega clase según color del backend.
    indicador.classList.add("semaforo-" + resumen.color);

    // Si no hay valoraciones.
    if (resumen.totalValoraciones === 0) {

        // Muestra texto sin valoraciones.
        if (promedioAceptacion) {
            promedioAceptacion.textContent = "Promedio de aceptación: sin valoraciones";
        }

        // Muestra total 0.
        if (totalValoraciones) {
            totalValoraciones.textContent = "Total de valoraciones: 0";
        }

        // Detiene.
        return;
    }

    // Redondea el promedio.
    const promedioRedondeado = Math.round(resumen.promedio);

    // Muestra promedio.
    if (promedioAceptacion) {
        promedioAceptacion.textContent =
            "Promedio de aceptación: " + promedioRedondeado + "%";
    }

    // Muestra total.
    if (totalValoraciones) {
        totalValoraciones.textContent =
            "Total de valoraciones: " + resumen.totalValoraciones;
    }
}

// Ejecuta la función principal.
iniciarDiccionario();
