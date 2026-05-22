// Indica que esta clase pertenece al paquete controller.
package com.colflux.backend.Controller;

// Importa el modelo WikiItem.
import com.colflux.backend.model.WikiItem;

// Importa el servicio WikiService.
// Este servicio contiene la lógica para leer el archivo CSV.
import com.colflux.backend.service.WikiService;

// Importa List para devolver una lista de elementos wiki.
import java.util.List;

// Importa CrossOrigin para permitir conexión desde el frontend.
import org.springframework.web.bind.annotation.CrossOrigin;

// Importa GetMapping para crear rutas GET.
import org.springframework.web.bind.annotation.GetMapping;

// Importa RestController para crear un controlador REST.
import org.springframework.web.bind.annotation.RestController;

// Marca esta clase como controlador REST.
@RestController

// Permite que el frontend consulte esta API.
@CrossOrigin(origins = "*")
public class WikiController {

    // Declara una variable privada para usar el servicio de wiki.
    private final WikiService wikiService;

    // Constructor del controlador.
    // Spring Boot inyecta automáticamente WikiService aquí.
    public WikiController(WikiService wikiService) {

        // Guarda el servicio recibido en la variable interna.
        this.wikiService = wikiService;
    }

    // Define la ruta GET /api/wiki.
    // Cuando el frontend consulte esta ruta, se ejecutará este método.
    @GetMapping("/api/wiki")
    public List<WikiItem> obtenerWiki() {

        // Llama al servicio para leer los datos desde el CSV.
        // Luego devuelve la lista al frontend en formato JSON.
        return wikiService.obtenerWikiDesdeCsv();
    }
}