// Indica que esta clase pertenece al paquete model.
package com.colflux.backend.model;

// Esta clase representa la valoración enviada desde el frontend.
// Es decir, cuando un usuario califica un término de 0 a 100.
public class ValoracionRequest {

    // Guarda el título del término evaluado.
    // Ejemplo: "Olor a tierra mojada".
    private String titulo;

    // Guarda la calificación dada por el usuario.
    // Debe estar entre 0 y 100.
    private Integer puntaje;

    // Constructor vacío.
    // Spring lo necesita para convertir el JSON recibido en un objeto Java.
    public ValoracionRequest() {
    }

    // Devuelve el título del término.
    public String getTitulo() {
        return titulo;
    }

    // Modifica el título del término.
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    // Devuelve el puntaje dado por el usuario.
    public Integer getPuntaje() {
        return puntaje;
    }

    // Modifica el puntaje dado por el usuario.
    public void setPuntaje(Integer puntaje) {
        this.puntaje = puntaje;
    }
}