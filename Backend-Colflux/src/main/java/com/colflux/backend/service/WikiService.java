// Indica que esta clase pertenece al paquete service.
// El paquete service contiene la lógica del backend.
package com.colflux.backend.service;

// Importa el modelo WikiItem.
// Cada fila del CSV se convertirá en un objeto WikiItem.
import com.colflux.backend.model.WikiItem;

// Permite leer archivos línea por línea.
import java.io.BufferedReader;

// Permite abrir archivos desde la carpeta resources.
import java.io.InputStream;

// Permite leer el archivo abierto como texto.
import java.io.InputStreamReader;

// Permite leer correctamente caracteres especiales como tildes y ñ.
import java.nio.charset.StandardCharsets;

// Permite crear listas modificables.
import java.util.ArrayList;

// Permite trabajar con listas.
import java.util.List;

// Marca esta clase como servicio de Spring.
// Esto permite que WikiController pueda usarla automáticamente.
import org.springframework.stereotype.Service;

// Esta clase contiene la lógica para leer el CSV del diccionario COLFLUX.
@Service
public class WikiService {

    // Método principal que lee el archivo wiki_colflux.csv
    // y devuelve una lista de términos para el diccionario.
    public List<WikiItem> obtenerWikiDesdeCsv() {

        // Crea una lista vacía donde se guardarán los términos leídos.
        List<WikiItem> wiki = new ArrayList<>();

        // Busca el archivo wiki_colflux.csv dentro de src/main/resources.
        InputStream inputStream = getClass()
                .getClassLoader()
                .getResourceAsStream("wiki_colflux.csv");

        // Verifica si el archivo no fue encontrado.
        if (inputStream == null) {

            // Muestra mensaje de error en consola.
            System.out.println("ERROR: No se encontró el archivo wiki_colflux.csv en src/main/resources");

            // Devuelve la lista vacía.
            return wiki;
        }

        // Abre el archivo y lo cierra automáticamente al terminar.
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {

            // Variable donde se guardará cada línea del CSV.
            String linea;

            // Variable para saber si ya encontramos la fila de encabezados.
            boolean encabezadoEncontrado = false;

            // Lee el archivo línea por línea.
            while ((linea = br.readLine()) != null) {

                // Elimina espacios al inicio y al final de la línea.
                linea = linea.trim();

                // Ignora líneas vacías.
                if (linea.isEmpty()) {
                    continue;
                }

                // Si aún no encontramos el encabezado, lo buscamos.
                if (!encabezadoEncontrado) {

                    // Normaliza la línea para detectar el encabezado aunque tenga mayúsculas o tildes.
                    String lineaNormalizada = normalizarTexto(linea);

                    // Detecta encabezados que empiecen por "categoria;".
                    if (lineaNormalizada.startsWith("categoria;")) {

                        // Marca que el encabezado ya fue encontrado.
                        encabezadoEncontrado = true;

                        // Muestra en consola el encabezado leído.
                        System.out.println("Encabezado CSV wiki encontrado: " + linea);
                    }

                    // Salta a la siguiente línea.
                    continue;
                }

                // Divide la línea usando punto y coma como separador.
                // El -1 conserva columnas vacías.
                String[] columnas = linea.split(";", -1);

                // Valida que tenga al menos 3 columnas:
                // Categoria, Observación o Termino, Definición ecológica.
                if (columnas.length >= 3) {

                    // Columna 0: Categoría.
                    String categoria = obtenerColumna(columnas, 0);

                    // Columna 1: Observación o término.
                    String titulo = obtenerColumna(columnas, 1);

                    // Columna 2: Definición ecológica.
                    String descripcion = obtenerColumna(columnas, 2);

                    // Columna 3: Variable asociada.
                    String variableAsociada = obtenerColumna(columnas, 3);

                    // Columna 4: Variable secundaria.
                    String variableSecundaria = obtenerColumna(columnas, 4);

                    // Columna 5: Regla cuantitativa.
                    String reglaCuantitativa = obtenerColumna(columnas, 5);

                    // Columna 6: Interpretación.
                    String interpretacion = obtenerColumna(columnas, 6);

                    // Evita agregar filas sin término.
                    if (titulo.isEmpty()) {
                        continue;
                    }

                    // Crea un nuevo objeto WikiItem con las 7 columnas del diccionario.
                    // Este constructor debe existir en WikiItem.java.
                    WikiItem item = new WikiItem(
                            categoria,
                            titulo,
                            descripcion,
                            variableAsociada,
                            variableSecundaria,
                            reglaCuantitativa,
                            interpretacion
                    );

                    // Agrega el término a la lista.
                    wiki.add(item);

                } else {

                    // Si la línea no tiene mínimo 3 columnas, se ignora.
                    System.out.println("Línea ignorada porque no tiene mínimo 3 columnas: " + linea);
                }
            }

        // Captura cualquier error durante la lectura del archivo.
        } catch (Exception e) {

            // Imprime el error completo en consola para diagnóstico.
            e.printStackTrace();
        }

        // Muestra cuántos términos fueron cargados.
        System.out.println("Total de términos wiki cargados: " + wiki.size());

        // Devuelve la lista al controlador.
        return wiki;
    }

    // Método auxiliar para obtener una columna de forma segura.
    // Si la columna no existe, devuelve texto vacío.
    private String obtenerColumna(String[] columnas, int indice) {

        // Verifica si el índice existe.
        if (indice < columnas.length) {

            // Devuelve la columna limpia.
            return columnas[indice].trim();
        }

        // Si no existe, devuelve vacío.
        return "";
    }

    // Método auxiliar para normalizar texto.
    // Sirve para detectar encabezados aunque tengan tildes o mayúsculas.
    private String normalizarTexto(String texto) {

        // Si el texto es null, devuelve vacío.
        if (texto == null) {
            return "";
        }

        // Convierte a minúsculas, elimina tildes y espacios extra.
        return texto
                .toLowerCase()
                .replace("á", "a")
                .replace("é", "e")
                .replace("í", "i")
                .replace("ó", "o")
                .replace("ú", "u")
                .replace("ñ", "n")
                .trim();
    }
}