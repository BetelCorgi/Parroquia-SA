# Etapa de build
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY backend/sap/pom.xml .
COPY backend/sap/src ./src
RUN mvn -B -DskipTests package

# Etapa de runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/san-agustin-parroquia-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]