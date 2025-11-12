# Etapa de build del frontend (Angular)
FROM node:20-alpine AS frontend
WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build -- --configuration production

# Etapa de build del backend (Spring Boot)
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY backend/sap/pom.xml ./
COPY backend/sap/src ./src

# Copiamos los artefactos del frontend dentro de los recursos estáticos de Spring
RUN mkdir -p src/main/resources/static
COPY --from=frontend /frontend/dist/frontend/browser/ ./src/main/resources/static/

RUN mvn -B -DskipTests package

# Etapa de runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/target/san-agustin-parroquia-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/app.jar"]