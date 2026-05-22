// Indica que esta clase pertenece al paquete controller.
package com.colflux.backend.Controller;

// Importa el modelo que recibe la valoración desde el frontend.
import com.colflux.backend.model.ValoracionRequest;

// Importa el modelo que devuelve el resumen al frontend.
import com.colflux.backend.model.ValoracionResumen;

// Importa el servicio que guarda y calcula valoraciones.
import com.colflux.backend.service.ValoracionService;

// Permite conexión desde el frontend.
import org.springframework.web.bind.annotation.CrossOrigin;

// Permite crear rutas GET.
import org.springframework.web.bind.annotation.GetMapping;

// Permite crear rutas POST.
import org.springframework.web.bind.annotation.PostMapping;

// Permite recibir datos JSON en el cuerpo de la solicitud.
import org.springframework.web.bind.annotation.RequestBody;

// Permite recibir parámetros por URL.
import org.springframework.web.bind.annotation.RequestParam;

// Marca esta clase como controlador REST.
import org.springframework.web.bind.annotation.RestController;

// Controlador REST para valoraciones del diccionario.
@RestController

// Permite que el frontend consulte esta API.
@CrossOrigin(origins = "*")
public class ValoracionController {

    // Servicio de valoraciones.
    private final ValoracionService valoracionService;

    // Constructor para inyectar el servicio automáticamente.
    public ValoracionController(ValoracionService valoracionService) {
        this.valoracionService = valoracionService;
    }

    // Ruta para guardar una valoración.
    // Ejemplo:
    // POST /api/valoraciones
    @PostMapping("/api/valoraciones")
    public ValoracionResumen guardarValoracion(@RequestBody ValoracionRequest request) {

        // Llama al servicio para guardar el puntaje.
        return valoracionService.guardarValoracion(
                request.getTitulo(),
                request.getPuntaje()
        );
    }

    // Ruta para consultar el resumen de aceptación de un término.
    // Ejemplo:
    // GET /api/valoraciones?titulo=Olor a tierra mojada
    @GetMapping("/api/valoraciones")
    public ValoracionResumen obtenerResumen(@RequestParam String titulo) {

        // Llama al servicio para obtener el promedio.
        return valoracionService.obtenerResumen(titulo);
    }
}
