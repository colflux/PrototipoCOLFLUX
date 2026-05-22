package com.colflux.backend.Controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class SaludoController {

    @GetMapping("/api/saludo")
    public String saludo() {
        return "Bienvenido a COLFLUX";
    }
}