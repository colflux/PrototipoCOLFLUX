// Indica que esta clase pertenece al paquete model.
package com.colflux.backend.model;

// Esta clase representa el resumen de aceptación de un término.
// Se enviará al frontend para mostrar el semáforo.
public class ValoracionResumen {

    // Título del término evaluado.
    private String titulo;

    // Promedio de aceptación entre 0 y 100.
    private Double promedio;

    // Total de valoraciones recibidas.
    private Integer totalValoraciones;

    // Color del semáforo: rojo, amarillo o verde.
    private String color;

    // Constructor vacío.
    public ValoracionResumen() {
    }

    // Constructor completo.
    public ValoracionResumen(String titulo, Double promedio, Integer totalValoraciones, String color) {
        this.titulo = titulo;
        this.promedio = promedio;
        this.totalValoraciones = totalValoraciones;
        this.color = color;
    }

    // Devuelve el título.
    public String getTitulo() {
        return titulo;
    }

    // Modifica el título.
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    // Devuelve el promedio.
    public Double getPromedio() {
        return promedio;
    }

    // Modifica el promedio.
    public void setPromedio(Double promedio) {
        this.promedio = promedio;
    }

    // Devuelve el total de valoraciones.
    public Integer getTotalValoraciones() {
        return totalValoraciones;
    }

    // Modifica el total de valoraciones.
    public void setTotalValoraciones(Integer totalValoraciones) {
        this.totalValoraciones = totalValoraciones;
    }

    // Devuelve el color del semáforo.
    public String getColor() {
        return color;
    }

    // Modifica el color del semáforo.
    public void setColor(String color) {
        this.color = color;
    }
}