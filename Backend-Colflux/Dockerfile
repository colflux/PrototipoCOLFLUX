# Usa una imagen de Maven con Java 17 para construir el proyecto.
FROM maven:3.9.9-eclipse-temurin-17 AS build

# Define la carpeta de trabajo dentro del contenedor.
WORKDIR /app

# Copia el archivo pom.xml al contenedor.
COPY pom.xml .

# Copia la carpeta src al contenedor.
COPY src ./src

# Construye el proyecto Spring Boot y omite las pruebas.
RUN mvn clean package -DskipTests


# Usa una imagen liviana de Java 17 para ejecutar la aplicación.
FROM eclipse-temurin:17-jdk

# Define la carpeta de trabajo final.
WORKDIR /app

# Copia el archivo .jar generado en la etapa de construcción.
COPY --from=build /app/target/*.jar app.jar

# Expone el puerto interno que usará la aplicación.
EXPOSE 8080

# Ejecuta el backend Spring Boot.
CMD ["java", "-jar", "app.jar"]
