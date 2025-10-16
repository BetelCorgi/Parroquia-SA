# 🚀 USANDO WSL UBUNTU PARA SPRING BOOT

## ✅ **Ventajas de WSL Ubuntu:**
- ✅ Java instalado por defecto en muchas versiones
- ✅ Maven incluido en algunos casos
- ✅ Evita problemas de configuración de Windows
- ✅ Entorno Linux nativo para desarrollo Java

---

## 📋 **Pasos para Configurar WSL Ubuntu**

### **Paso 1: Acceder a WSL Ubuntu**
```bash
# Abrir terminal de Ubuntu
wsl -d Ubuntu

# O desde PowerShell
wsl
# Luego ejecutar: ubuntu
```

### **Paso 2: Verificar/Instalar Java 17**
```bash
# Verificar si Java está instalado
java -version

# Si no está instalado, instalar OpenJDK 17
sudo apt update
sudo apt install -y openjdk-17-jdk

# Verificar instalación
java -version
javac -version
```

### **Paso 3: Instalar Maven (si no está incluido)**
```bash
# Verificar si Maven está instalado
mvn -version

# Si no está instalado, instalar Maven
sudo apt install -y maven

# Verificar instalación
mvn -version
```

### **Paso 4: Navegar al Proyecto**
```bash
# Desde WSL Ubuntu, navegar al proyecto
# Nota: Las rutas de Windows se montan en /mnt/
cd /mnt/c/Users/boris/Documents/GitHub/PersonalVault/Parroquia-SA/backend/sap

# Verificar que estás en el directorio correcto
ls -la
# Deberías ver: pom.xml, src/, etc.
```

### **Paso 5: Compilar el Proyecto**
```bash
# Limpiar y compilar
mvn clean compile

# Si funciona, probar ejecutar la aplicación
mvn spring-boot:run
```

---

## 🎯 **Usuarios de Prueba**

| Email | Password | Rol |
|-------|----------|-----|
| `admin@parroquia.com` | `admin123` | ADMINISTRADOR |
| `fiel@parroquia.com` | `fiel123` | FIEL |

---

## 🌐 **Probar la Aplicación**

Una vez que la aplicación esté corriendo en WSL Ubuntu:

```bash
# Probar login desde WSL
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@parroquia.com","password":"admin123"}'

# O acceder desde Windows usando:
# http://localhost:8080/api/auth/login
```

---

## 🔧 **Solución de Problemas en WSL**

### **Si Java no se instala:**
```bash
# Actualizar repositorios
sudo apt update

# Instalar manualmente
sudo apt install -y wget
wget https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_linux-x64_bin.tar.gz
sudo tar -xzf openjdk-17.0.2_linux-x64_bin.tar.gz -C /opt/
sudo ln -sf /opt/jdk-17.0.2/bin/java /usr/bin/java
sudo ln -sf /opt/jdk-17.0.2/bin/javac /usr/bin/javac
```

### **Si Maven no funciona:**
```bash
# Descargar Maven manualmente
wget https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz
sudo tar -xzf apache-maven-3.9.6-bin.tar.gz -C /opt/
sudo ln -sf /opt/apache-maven-3.9.6/bin/mvn /usr/bin/mvn
```

---

## ✅ **Flujo de Trabajo Recomendado**

### **Desarrollo diario:**
1. **Abrir WSL Ubuntu:** `wsl -d Ubuntu`
2. **Navegar al proyecto:** `cd /mnt/c/Users/boris/Documents/GitHub/PersonalVault/Parroquia-SA/backend/sap`
3. **Compilar:** `mvn clean compile`
4. **Ejecutar:** `mvn spring-boot:run`
5. **Probar:** Usar Postman o curl desde Windows

### **IDE recomendado:**
- **VS Code** con extensión "Remote - WSL"
- **IntelliJ IDEA** con soporte WSL
- **Cualquier editor** + terminal WSL

---

## 🎉 **¡WSL Ubuntu es una excelente alternativa!**

### **Ventajas específicas:**
- ✅ **Java 17 incluido** en Ubuntu reciente
- ✅ **Maven disponible** en repositorios oficiales
- ✅ **Compilación más rápida** que en Windows
- ✅ **Mejor soporte** para herramientas Linux
- ✅ **Evita problemas** de configuración de Windows

---

**🚀 ¡Usa WSL Ubuntu para desarrollar tu proyecto Spring Boot y evitarás todos los problemas de configuración de Java en Windows!**

**💡 Consejo:** Una vez configurado, WSL Ubuntu será tu mejor opción para desarrollo Java/Spring Boot.
