// Indica que esta clase pertenece al paquete model.
package com.colflux.backend.model;

// Esta clase representa un término del diccionario COLFLUX.
// Cada objeto WikiItem equivale a una fila del CSV.
public class WikiItem {

    // Categoría general del término.
    // Ejemplo: "1. Olor", "2. Color", "DEFINICION".
    private String categoria;

    // Término u observación de campo.
    // Ejemplo: "Olor a pantano", "Suelo negro", "Carbono".
    private String titulo;

    // Definición ecológica o definición básica.
    private String descripcion;

    // Variable cuantitativa principal asociada al término.
    // Ejemplo: "Flujo de CH4", "CO2 flux", "RH".
    private String variableAsociada;

    // Variable secundaria que ayuda a interpretar el término.
    // Ejemplo: "Water_level_cm", "Ground_temperature", "vegetation".
    private String variableSecundaria;

    // Regla cuantitativa asociada al término.
    // Ejemplo: "CH4 ≥ 0.0188 µmol/m²/s + Water_level_cm ≥ 4 cm".
    private String reglaCuantitativa;

    // Interpretación ecológica del término según las variables.
    private String interpretacion;

    // Constructor vacío.
    // Spring lo necesita para convertir objetos Java a JSON.
    public WikiItem() {
    }

    // Constructor completo.
    // Se usa para crear un término a partir de una fila del CSV.
    public WikiItem(
            String categoria,
            String titulo,
            String descripcion,
            String variableAsociada,
            String variableSecundaria,
            String reglaCuantitativa,
            String interpretacion
    ) {
        // Asigna la categoría.
        this.categoria = categoria;

        // Asigna el término u observación.
        this.titulo = titulo;

        // Asigna la definición ecológica.
        this.descripcion = descripcion;

        // Asigna la variable asociada.
        this.variableAsociada = variableAsociada;

        // Asigna la variable secundaria.
        this.variableSecundaria = variableSecundaria;

        // Asigna la regla cuantitativa.
        this.reglaCuantitativa = reglaCuantitativa;

        // Asigna la interpretación.
        this.interpretacion = interpretacion;
    }

    // Devuelve la categoría.
    public String getCategoria() {
        return categoria;
    }

    // Modifica la categoría.
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    // Devuelve el título o término.
    public String getTitulo() {
        return titulo;
    }

    // Modifica el título o término.
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    // Devuelve la definición ecológica.
    public String getDescripcion() {
        return descripcion;
    }

    // Modifica la definición ecológica.
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    // Devuelve la variable asociada.
    public String getVariableAsociada() {
        return variableAsociada;
    }

    // Modifica la variable asociada.
    public void setVariableAsociada(String variableAsociada) {
        this.variableAsociada = variableAsociada;
    }

    // Devuelve la variable secundaria.
    public String getVariableSecundaria() {
        return variableSecundaria;
    }

    // Modifica la variable secundaria.
    public void setVariableSecundaria(String variableSecundaria) {
        this.variableSecundaria = variableSecundaria;
    }

    // Devuelve la regla cuantitativa.
    public String getReglaCuantitativa() {
        return reglaCuantitativa;
    }

    // Modifica la regla cuantitativa.
    public void setReglaCuantitativa(String reglaCuantitativa) {
        this.reglaCuantitativa = reglaCuantitativa;
    }

    // Devuelve la interpretación ecológica.
    public String getInterpretacion() {
        return interpretacion;
    }

    // Modifica la interpretación ecológica.
    public void setInterpretacion(String interpretacion) {
        this.interpretacion = interpretacion;
    }

    // Campo calculado para saber si el término tiene información avanzada.
    // Esto será útil en el frontend.
    public boolean getTieneInformacionAvanzada() {
        return tieneTexto(variableAsociada)
                || tieneTexto(variableSecundaria)
                || tieneTexto(reglaCuantitativa)
                || tieneTexto(interpretacion);
    }

    // Función auxiliar para validar si un texto existe y no está vacío.
    private boolean tieneTexto(String texto) {
        return texto != null && !texto.trim().isEmpty();
    }
}