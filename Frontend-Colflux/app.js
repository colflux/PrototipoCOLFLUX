// -----------------------------------------------------------------------------
// FUNCIÓN 1: Cargar mensaje de bienvenida desde el backend
// -----------------------------------------------------------------------------

// Esta función se encarga de consultar la API /api/saludo.
// Esa API devuelve un texto simple desde el backend Java.
// -----------------------------------------------------------------------------
// FUNCIÓN 1: Cargar estado de conexión desde el backend
// -----------------------------------------------------------------------------

// Esta función consulta la API /api/saludo del backend.
// Si el backend responde, muestra el mensaje en el título principal.
// Si el backend falla, muestra un error en ese mismo título.
const API_BASE_URL = "https://prototipocolflux.onrender.com";
function cargarSaludo() {

    // Busca en el HTML el título donde se mostrará el estado del backend.
    const estadoBackend = document.getElementById("estado-backend");

    // Hace una solicitud al backend en Java.
  fetch(`${API_BASE_URL}/api/saludo`)

        // Convierte la respuesta del backend en texto.
        .then(response => response.text())

        // Recibe el texto enviado por el backend.
        .then(data => {

            // Inserta el mensaje del backend en el título principal.
            estadoBackend.textContent = data;

            // Quita la clase de error si existía antes.
            estadoBackend.classList.remove("estado-error");

            // Agrega la clase de éxito para mostrarlo con estilo normal.
            estadoBackend.classList.add("estado-ok");
        })

        // Captura errores de conexión.
        .catch(error => {

            // Muestra el error técnico en la consola del navegador.
            console.error("Error al conectar con el backend:", error);

            // Muestra el error directamente en el título de bienvenida.
            estadoBackend.textContent = "No se pudo conectar con el backend";

            // Quita la clase de éxito.
            estadoBackend.classList.remove("estado-ok");

            // Agrega una clase de error para cambiar el color visual.
            estadoBackend.classList.add("estado-error");
        });
}


// -----------------------------------------------------------------------------
// FUNCIÓN 2: Cargar información tipo wiki desde el backend
// -----------------------------------------------------------------------------

// Esta función consulta la API /api/wiki.
// Esa API devuelve una lista de elementos con título, descripción y categoría.
function cargarWiki() {

    // fetch() hace una solicitud al backend en la ruta /api/wiki.
    fetch(`${API_BASE_URL}/api/wiki`)

        // Cuando el backend responde, convertimos la respuesta a JSON.
        // Usamos response.json() porque /api/wiki devuelve una lista de objetos.
        .then(response => response.json())

        // Cuando ya tenemos los datos convertidos a JSON,
        // los recibimos en la variable data.
        .then(data => {

            // Busca el contenedor HTML donde se mostrará la wiki.
            const contenedorWiki = document.getElementById("contenedor-wiki");

            // Limpia el contenido inicial del contenedor.
            // Esto elimina el texto "Cargando información de la wiki..."
            contenedorWiki.innerHTML = "";

            // Recorre cada elemento recibido desde el backend.
            // Cada item representa un tema de la wiki.
            data.forEach(item => {

                // Crea un nuevo elemento HTML tipo div.
                // Este div será la tarjeta visual de cada tema.
                const tarjeta = document.createElement("div");

                // Agrega la clase CSS "wiki-item" al div.
                // Esto permite que la tarjeta tome los estilos definidos en styles.css.
                tarjeta.classList.add("wiki-item");

                // Define el contenido HTML interno de la tarjeta.
                // Usamos item.titulo, item.descripcion e item.categoria
                // porque esos son los nombres enviados por el backend.
                tarjeta.innerHTML = `
                    <h3>${item.titulo}</h3>
                    <p>${item.descripcion}</p>
                    <span class="categoria">${item.categoria}</span>
                `;

                // Agrega la tarjeta ya construida dentro del contenedor principal.
                contenedorWiki.appendChild(tarjeta);
            });
        })

        // Si ocurre un error al cargar la wiki, se ejecuta este bloque.
        .catch(error => {

            // Muestra el error técnico en la consola del navegador.
            console.error("Error al cargar la wiki:", error);

            // Busca el contenedor donde debería mostrarse la wiki.
            const contenedorWiki = document.getElementById("contenedor-wiki");

            // Muestra un mensaje visible para el usuario.
            contenedorWiki.textContent = "No se pudo cargar la información de la wiki.";
        });
}


// -----------------------------------------------------------------------------
// EJECUCIÓN INICIAL DE LA PÁGINA
// -----------------------------------------------------------------------------

// Ejecuta la función que carga el saludo desde el backend.
cargarSaludo();

// Ejecuta la función que carga la información tipo wiki desde el backend.
cargarWiki();
