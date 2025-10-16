# ✅ Checklist de Verificación - Sistema de Login

## 📦 Archivos Implementados

### Configuración
- [x] `src/main/resources/application.properties` - Configuración completa
- [x] `src/main/resources/data.sql` - Datos iniciales

### Entidades (Model)
- [x] `com.saparroquia.model.entity.Usuario.java`
- [x] `com.saparroquia.model.entity.Sesion.java`

### DTOs
- [x] `com.saparroquia.model.dto.LoginRequest.java`
- [x] `com.saparroquia.model.dto.LoginResponse.java`
- [x] `com.saparroquia.model.dto.ErrorResponse.java`
- [x] `com.saparroquia.model.dto.MessageResponse.java`

### Repositorios
- [x] `com.saparroquia.repository.UsuarioRepository.java`
- [x] `com.saparroquia.repository.SesionRepository.java`

### Configuración de Seguridad
- [x] `com.saparroquia.config.JwtConfig.java`
- [x] `com.saparroquia.config.SecurityConfig.java`

### Seguridad JWT
- [x] `com.saparroquia.security.JwtTokenProvider.java`
- [x] `com.saparroquia.security.CustomUserDetailsService.java`
- [x] `com.saparroquia.security.JwtAuthenticationFilter.java`

### Servicios
- [x] `com.saparroquia.service.AuthService.java`

### Controladores
- [x] `com.saparroquia.controller.AuthController.java`

---

## 🔍 Pasos de Verificación

### 1. Verificar Dependencias Maven
```bash
cd backend/sap
mvnw clean install
```

### 2. Verificar PostgreSQL
```bash
# Conectar a PostgreSQL
psql -U postgres

# Verificar base de datos
\l

# Si no existe, crear:
CREATE DATABASE parroquia_db;
```

### 3. Compilar el Proyecto
```bash
mvnw clean compile
```

### 4. Ejecutar Tests (si existen)
```bash
mvnw test
```

### 5. Iniciar la Aplicación
```bash
mvnw spring-boot:run
```

### 6. Verificar que el servidor inició
Buscar en los logs:
```
Started SanAgustinParroquiaApplication in X.XXX seconds
Tomcat started on port(s): 8080 (http)
```

---

## 🧪 Pruebas Funcionales

### Test 1: Login Exitoso
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@parroquia.com","password":"admin123"}'
```

**Resultado esperado:** Status 200 con token JWT

### Test 2: Login con Credenciales Incorrectas
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@parroquia.com","password":"wrongpassword"}'
```

**Resultado esperado:** Status 401 Unauthorized

### Test 3: Validar Token
```bash
# Primero hacer login y guardar el token
TOKEN="TU_TOKEN_AQUI"

curl -X GET http://localhost:8080/api/auth/validate \
  -H "Authorization: Bearer $TOKEN"
```

**Resultado esperado:** Status 200 con mensaje "Token válido"

### Test 4: Logout
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

**Resultado esperado:** Status 200 con mensaje "Sesión cerrada exitosamente"

---

## 🐛 Problemas Comunes y Soluciones

### Error: "Failed to configure a DataSource"
**Causa:** PostgreSQL no está corriendo o credenciales incorrectas
**Solución:**
1. Iniciar PostgreSQL
2. Verificar credenciales en `application.properties`

### Error: "Port 8080 is already in use"
**Causa:** Otro proceso está usando el puerto 8080
**Solución:**
1. Cambiar puerto en `application.properties`: `server.port=8081`
2. O detener el proceso que usa el puerto 8080

### Error: "Unable to find @SpringBootApplication"
**Causa:** Problema con la estructura de paquetes
**Solución:** Verificar que `SanAgustinParroquiaApplication.java` esté en `com.saparroquia`

### Error: "Bean creation exception"
**Causa:** Dependencias circulares o configuración incorrecta
**Solución:** Revisar logs detallados y verificar anotaciones `@Component`, `@Service`, etc.

---

## 📊 Verificar Base de Datos

Después de iniciar la aplicación, verificar que las tablas se crearon:

```sql
-- Conectar a la base de datos
\c parroquia_db

-- Listar tablas
\dt

-- Verificar usuarios
SELECT id, email, nombre, apellido, rol, activo FROM usuario;

-- Debería mostrar:
-- 1 | admin@parroquia.com | Administrador | Sistema | ADMINISTRADOR | true
-- 2 | fiel@parroquia.com  | Juan          | Pérez   | FIEL          | true
```

---

## 🎯 Criterios de Éxito

- [ ] Aplicación inicia sin errores
- [ ] Base de datos se crea automáticamente
- [ ] Usuarios de prueba se insertan correctamente
- [ ] Login con admin funciona
- [ ] Login con fiel funciona
- [ ] Token JWT se genera correctamente
- [ ] Validación de token funciona
- [ ] Logout funciona
- [ ] Credenciales incorrectas devuelven 401

---

## 📝 Notas Adicionales

### Configuración de Email (Opcional)
Si deseas probar recuperación de contraseña más adelante, configura:
```properties
spring.mail.username=tu-email@gmail.com
spring.mail.password=tu-app-password
```

### Cambiar JWT Secret
Para producción, genera un secret más seguro:
```bash
# Generar secret aleatorio
openssl rand -base64 64
```

### Ajustar Tiempo de Expiración
```properties
# 24 horas = 86400000 ms
jwt.expiration=86400000

# 1 hora = 3600000 ms
jwt.expiration=3600000
```

---

**¡Sistema Listo para Pruebas! 🚀**
