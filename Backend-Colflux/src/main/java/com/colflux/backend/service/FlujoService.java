// Indica que esta clase pertenece al paquete service.
package com.colflux.backend.service;

// Importa el modelo DatoFlujo.
import com.colflux.backend.model.DatoFlujo;

// Permite leer archivos línea por línea.
import java.io.BufferedReader;

// Permite abrir archivos desde resources.
import java.io.InputStream;

// Permite leer el archivo como texto.
import java.io.InputStreamReader;

// Permite manejar correctamente tildes y caracteres especiales.
import java.nio.charset.StandardCharsets;

// Permite crear listas modificables.
import java.util.ArrayList;

// Permite trabajar con listas.
import java.util.List;

// Marca esta clase como servicio de Spring.
import org.springframework.stereotype.Service;

// Servicio encargado de leer el CSV de flujos.
@Service
public class FlujoService {

    // Lee el archivo datos_flujos.csv y devuelve una lista de datos.
    public List<DatoFlujo> obtenerFlujosDesdeCsv() {

        // Lista donde se guardarán los datos leídos.
        List<DatoFlujo> datos = new ArrayList<>();

        // Busca el archivo dentro de src/main/resources.
        InputStream inputStream = getClass().getClassLoader().getResourceAsStream("datos_flujos.csv");

        // Si el archivo no existe, retorna lista vacía.
        if (inputStream == null) {
            System.out.println("ERROR: No se encontró datos_flujos.csv en src/main/resources");
            return datos;
        }

        // Abre el archivo y lo cierra automáticamente al terminar.
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {

            // Lee el encabezado.
            String linea = br.readLine();

            // Muestra encabezado en consola.
            System.out.println("Encabezado datos flujos: " + linea);

            // Lee cada fila del CSV.
            while ((linea = br.readLine()) != null) {

                // Si la línea está vacía, la ignora.
                if (linea.trim().isEmpty()) {
                    continue;
                }

                // Divide la fila por punto y coma.
                // El -1 conserva celdas vacías.
                String[] columnas = linea.split(";", -1);

                // Valida que existan las 15 columnas esperadas.
                if (columnas.length >= 15) {

                    // Columna 0: Date.
                    String date = obtenerTexto(columnas, 0);

                    // Columna 1: Point.
                    Integer point = convertirEntero(obtenerTexto(columnas, 1));

                    // Columna 2: Day/Night.
                    String dayNight = obtenerTexto(columnas, 2);

                    // Columna 3: CO2 flux.
                    Double co2Flux = convertirDouble(obtenerTexto(columnas, 3));

                    // Columna 4: CH4 flux.
                    Double ch4Flux = convertirDouble(obtenerTexto(columnas, 4));

                    // Columna 5: Ground_temperature.
                    Double groundTemperature = convertirDouble(obtenerTexto(columnas, 5));

                    // Columna 6: Air_temeprature.
                    Double airTemperature = convertirDouble(obtenerTexto(columnas, 6));

                    // Columna 7: Atmospheric_pressure.
                    Double atmosphericPressure = convertirDouble(obtenerTexto(columnas, 7));

                    // Columna 8: RH.
                    Double rh = convertirDouble(obtenerTexto(columnas, 8));

                    // Columna 9: Dew_point.
                    Double dewPoint = convertirDouble(obtenerTexto(columnas, 9));

                    // Columna 10: PAR_start.
                    Double parStart = convertirDouble(obtenerTexto(columnas, 10));

                    // Columna 11: PAR_end.
                    Double parEnd = convertirDouble(obtenerTexto(columnas, 11));

                    // Columna 12: vegetation.
                    String vegetation = obtenerTexto(columnas, 12);

                    // Columna 13: Water_level_cm.
                    Double waterLevelCm = convertirDouble(obtenerTexto(columnas, 13));

                    // Columna 14: Water_level_msnm.
                    Double waterLevelMsnm = convertirDouble(obtenerTexto(columnas, 14));

                    // Crea el objeto DatoFlujo.
                    DatoFlujo dato = new DatoFlujo(
                            date,
                            point,
                            dayNight,
                            co2Flux,
                            ch4Flux,
                            groundTemperature,
                            airTemperature,
                            atmosphericPressure,
                            rh,
                            dewPoint,
                            parStart,
                            parEnd,
                            vegetation,
                            waterLevelCm,
                            waterLevelMsnm
                    );

                    // Agrega el dato a la lista.
                    datos.add(dato);

                } else {

                    // Muestra aviso si la fila no cumple la estructura.
                    System.out.println("Línea ignorada porque no tiene 15 columnas: " + linea);
                }
            }

        } catch (Exception e) {

            // Muestra cualquier error de lectura.
            e.printStackTrace();
        }

        // Muestra total cargado.
        System.out.println("Total de registros de flujo cargados: " + datos.size());

        // Devuelve los datos al controlador.
        return datos;
    }

    // Obtiene una columna de forma segura.
    private String obtenerTexto(String[] columnas, int indice) {

        // Si el índice existe, devuelve el texto limpio.
        if (indice < columnas.length) {
            return columnas[indice].trim();
        }

        // Si no existe, devuelve vacío.
        return "";
    }

    // Convierte texto a entero.
    private Integer convertirEntero(String valor) {

        // Si viene vacío, devuelve null.
        if (valor == null || valor.trim().isEmpty()) {
            return null;
        }

        try {
            return Integer.parseInt(valor.trim());
        } catch (NumberFormatException e) {
            System.out.println("No se pudo convertir a entero: " + valor);
            return null;
        }
    }

    // Convierte texto a decimal.
    private Double convertirDouble(String valor) {

        // Si viene vacío, devuelve null.
        if (valor == null || valor.trim().isEmpty()) {
            return null;
        }

        try {
            // Permite leer decimales con coma o con punto.
            String valorLimpio = valor.trim().replace(",", ".");

            // Convierte a Double.
            return Double.parseDouble(valorLimpio);

        } catch (NumberFormatException e) {
            System.out.println("No se pudo convertir a decimal: " + valor);
            return null;
        }
    }
}