// Indica que esta clase pertenece al paquete model.
package com.colflux.backend.model;

// Esta clase representa una fila del archivo datos_flujos.csv.
public class DatoFlujo {

    // Fecha de medición.
    private String date;

    // Punto de medición.
    private Integer point;

    // Indica si el dato corresponde a día o noche.
    private String dayNight;

    // Flujo de CO2 en Micromol/m2/s.
    private Double co2Flux;

    // Flujo de CH4 en Micromol/m2/s.
    private Double ch4Flux;

    // Temperatura del suelo.
    private Double groundTemperature;

    // Temperatura del aire.
    private Double airTemperature;

    // Presión atmosférica.
    private Double atmosphericPressure;

    // Humedad relativa.
    private Double rh;

    // Punto de rocío.
    private Double dewPoint;

    // Radiación PAR inicial.
    private Double parStart;

    // Radiación PAR final.
    private Double parEnd;

    // Tipo de vegetación.
    private String vegetation;

    // Nivel de agua en centímetros.
    private Double waterLevelCm;

    // Nivel de agua en metros sobre el nivel del mar.
    private Double waterLevelMsnm;

    // Constructor vacío.
    public DatoFlujo() {
    }

    // Constructor completo con todas las columnas del CSV.
    public DatoFlujo(
            String date,
            Integer point,
            String dayNight,
            Double co2Flux,
            Double ch4Flux,
            Double groundTemperature,
            Double airTemperature,
            Double atmosphericPressure,
            Double rh,
            Double dewPoint,
            Double parStart,
            Double parEnd,
            String vegetation,
            Double waterLevelCm,
            Double waterLevelMsnm
    ) {
        this.date = date;
        this.point = point;
        this.dayNight = dayNight;
        this.co2Flux = co2Flux;
        this.ch4Flux = ch4Flux;
        this.groundTemperature = groundTemperature;
        this.airTemperature = airTemperature;
        this.atmosphericPressure = atmosphericPressure;
        this.rh = rh;
        this.dewPoint = dewPoint;
        this.parStart = parStart;
        this.parEnd = parEnd;
        this.vegetation = vegetation;
        this.waterLevelCm = waterLevelCm;
        this.waterLevelMsnm = waterLevelMsnm;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Integer getPoint() {
        return point;
    }

    public void setPoint(Integer point) {
        this.point = point;
    }

    public String getDayNight() {
        return dayNight;
    }

    public void setDayNight(String dayNight) {
        this.dayNight = dayNight;
    }

    public Double getCo2Flux() {
        return co2Flux;
    }

    public void setCo2Flux(Double co2Flux) {
        this.co2Flux = co2Flux;
    }

    public Double getCh4Flux() {
        return ch4Flux;
    }

    public void setCh4Flux(Double ch4Flux) {
        this.ch4Flux = ch4Flux;
    }

    public Double getGroundTemperature() {
        return groundTemperature;
    }

    public void setGroundTemperature(Double groundTemperature) {
        this.groundTemperature = groundTemperature;
    }

    public Double getAirTemperature() {
        return airTemperature;
    }

    public void setAirTemperature(Double airTemperature) {
        this.airTemperature = airTemperature;
    }

    public Double getAtmosphericPressure() {
        return atmosphericPressure;
    }

    public void setAtmosphericPressure(Double atmosphericPressure) {
        this.atmosphericPressure = atmosphericPressure;
    }

    public Double getRh() {
        return rh;
    }

    public void setRh(Double rh) {
        this.rh = rh;
    }

    public Double getDewPoint() {
        return dewPoint;
    }

    public void setDewPoint(Double dewPoint) {
        this.dewPoint = dewPoint;
    }

    public Double getParStart() {
        return parStart;
    }

    public void setParStart(Double parStart) {
        this.parStart = parStart;
    }

    public Double getParEnd() {
        return parEnd;
    }

    public void setParEnd(Double parEnd) {
        this.parEnd = parEnd;
    }

    public String getVegetation() {
        return vegetation;
    }

    public void setVegetation(String vegetation) {
        this.vegetation = vegetation;
    }

    public Double getWaterLevelCm() {
        return waterLevelCm;
    }

    public void setWaterLevelCm(Double waterLevelCm) {
        this.waterLevelCm = waterLevelCm;
    }

    public Double getWaterLevelMsnm() {
        return waterLevelMsnm;
    }

    public void setWaterLevelMsnm(Double waterLevelMsnm) {
        this.waterLevelMsnm = waterLevelMsnm;
    }
}