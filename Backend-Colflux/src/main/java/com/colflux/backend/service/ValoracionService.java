// Indica que esta clase pertenece al paquete service.
package com.colflux.backend.service;

// Importa el modelo de resumen de valoración.
import com.colflux.backend.model.ValoracionResumen;

// Importa listas para guardar varios puntajes por término.
import java.util.ArrayList;

// Importa HashMap para guardar las valoraciones por término.
import java.util.HashMap;

// Importa List para manejar listas de puntajes.
import java.util.List;

// Importa Map para manejar clave-valor.
import java.util.Map;

// Marca esta clase como servicio de Spring.
import org.springframework.stereotype.Service;

// Servicio encargado de guardar y calcular las valoraciones del diccionario.
@Service
public class ValoracionService {

    // Mapa en memoria.
    // La clave será el título del término.
    // El valor será la lista de puntajes recibidos.
    private final Map<String, List<Integer>> valoraciones = new HashMap<>();

    // Guarda una nueva valoración.
    public ValoracionResumen guardarValoracion(String titulo, Integer puntaje) {

        // Normaliza el título para evitar errores por espacios.
        String clave = normalizarTitulo(titulo);

        // Si el término aún no existe en el mapa, crea una lista vacía.
        valoraciones.putIfAbsent(clave, new ArrayList<>());

        // Limita el puntaje entre 0 y 100.
        Integer puntajeSeguro = limitarPuntaje(puntaje);

        // Agrega el puntaje a la lista del término.
        valoraciones.get(clave).add(puntajeSeguro);

        // Devuelve el resumen actualizado.
        return obtenerResumen(titulo);
    }

    // Obtiene el resumen de aceptación de un término.
    public ValoracionResumen obtenerResumen(String titulo) {

        // Normaliza el título.
        String clave = normalizarTitulo(titulo);

        // Obtiene la lista de puntajes.
        List<Integer> lista = valoraciones.getOrDefault(clave, new ArrayList<>());

        // Si no hay valoraciones, devuelve promedio 0 y semáforo gris.
        if (lista.isEmpty()) {
            return new ValoracionResumen(titulo, 0.0, 0, "gris");
        }

        // Suma todos los puntajes.
        int suma = 0;

        // Recorre cada puntaje.
        for (Integer puntaje : lista) {
            suma += puntaje;
        }

        // Calcula el promedio.
        double promedio = (double) suma / lista.size();

        // Calcula el color del semáforo.
        String color = calcularColor(promedio);

        // Devuelve el resumen.
        return new ValoracionResumen(titulo, promedio, lista.size(), color);
    }

    // Normaliza el título del término.
    private String normalizarTitulo(String titulo) {

        // Si viene null, retorna vacío.
        if (titulo == null) {
            return "";
        }

        // Convierte a minúscula y elimina espacios sobrantes.
        return titulo.trim().toLowerCase();
    }

    // Limita el puntaje entre 0 y 100.
    private Integer limitarPuntaje(Integer puntaje) {

        // Si viene null, lo toma como 0.
        if (puntaje == null) {
            return 0;
        }

        // Si es menor que 0, lo deja en 0.
        if (puntaje < 0) {
            return 0;
        }

        // Si es mayor que 100, lo deja en 100.
        if (puntaje > 100) {
            return 100;
        }

        // Si está correcto, lo devuelve igual.
        return puntaje;
    }

    // Calcula el color del semáforo según el promedio.
    private String calcularColor(Double promedio) {

        // De 0 a 30 será rojo.
        if (promedio <= 30) {
            return "rojo";
        }

        // De 31 a 70 será amarillo.
        if (promedio <= 70) {
            return "amarillo";
        }

        // De 71 a 100 será verde.
        return "verde";
    }
}