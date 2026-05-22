// Indica que esta clase pertenece al paquete controller.
package com.colflux.backend.Controller;

// Importa el modelo DatoFlujo.
import com.colflux.backend.model.DatoFlujo;

// Importa el servicio FlujoService.
import com.colflux.backend.service.FlujoService;

// Importa List para devolver una lista de registros.
import java.util.List;

// Importa CrossOrigin para permitir conexión desde el frontend.
import org.springframework.web.bind.annotation.CrossOrigin;

// Importa GetMapping para crear rutas GET.
import org.springframework.web.bind.annotation.GetMapping;

// Importa RestController para crear un controlador REST.
import org.springframework.web.bind.annotation.RestController;

// Marca esta clase como controlador REST.
@RestController

// Permite que el frontend pueda consumir esta API.
// Para prototipo usamos "*".
@CrossOrigin(origins = "*")
public class FlujoController {

    // Variable privada para usar el servicio de datos de flujo.
    private final FlujoService flujoService;

    // Constructor del controlador.
    // Spring inyecta automáticamente FlujoService porque tiene @Service.
    public FlujoController(FlujoService flujoService) {

        // Guarda el servicio recibido en la variable interna.
        this.flujoService = flujoService;
    }

    // Define la ruta GET /api/flujos.
    // Cuando el frontend o navegador consulte esta ruta,
    // se devolverán los datos leídos desde el CSV.
    @GetMapping("/api/flujos")
    public List<DatoFlujo> obtenerFlujos() {

        // Llama al servicio para leer el CSV y devolver la lista.
        return flujoService.obtenerFlujosDesdeCsv();
    }
}