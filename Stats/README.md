# 📊 Microservicio de Estadísticas - SecureLink

Microservicio Spring Boot para proporcionar estadísticas de análisis de URLs maliciosas/seguras. Diseñado para alimentar gráficos en el frontend.

## 🚀 Tecnologías

- **Java 17**
- **Spring Boot 3.5.7**
- **Spring Data JPA**
- **MySQL 8+**
- **Lombok**
- **Maven**

## 📡 Endpoints API

### 1. Resumen General
```http
GET /api/stats/resumen
```

**Respuesta:**
```json
{
  "total": 150,
  "maliciosos": 45,
  "seguros": 105
}
```

**Uso:** Gráfico de resumen (Cards o Pie Chart)

---

### 2. Distribución por Estado
```http
GET /api/stats/distribucion
```

**Respuesta:**
```json
[
  { "estado": "MALICIOSO", "cantidad": 45 },
  { "estado": "SEGURO", "cantidad": 105 }
]
```

**Uso:** Gráfico de barras o pie chart

---

### 3. Análisis Recientes
```http
GET /api/stats/recientes?limit=5
```

**Parámetros:**
- `limit` (opcional): Número de reportes (1-50, default: 5)

**Respuesta:**
```json
[
  {
    "id": 123,
    "userId": 1,
    "url": "https://ejemplo.com",
    "peligro": "MALICIOSO",
    "tipoAmenaza": "Phishing",
    "imitaA": "PayPal",
    "detalles": "{...}",
    "createdAt": "2025-11-28T10:30:00Z"
  }
]
```

**Uso:** Tabla de reportes recientes

---

## ⚙️ Configuración

### Variables de Entorno (Recomendadas para Producción)

```bash
DB_URL=jdbc:mysql://tu-servidor:3306/bd_securelink
DB_USER=tu_usuario
DB_PASS=tu_contraseña
CORS_ORIGINS=http://localhost:5173,https://tu-dominio.com
```

### Configuración Local (application.properties)

Las credenciales actuales están configuradas por defecto en `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://securelink.cz53cv2gj6ra.us-east-1.rds.amazonaws.com:3306/bd_securelink
spring.datasource.username=admin
spring.datasource.password=viwge4-zojwam-doXfyp
```

---

## 🏃 Ejecución

### Con Maven Wrapper (Recomendado)

**Windows:**
```powershell
.\mvnw.cmd spring-boot:run
```

**Linux/Mac:**
```bash
./mvnw spring-boot:run
```

### Con Maven Instalado

```bash
mvn spring-boot:run
```

### Puerto

El microservicio se ejecuta en: **http://localhost:8082**

---

## 🧪 Pruebas

### Probar endpoints con curl

```powershell
# Resumen
curl http://localhost:8082/api/stats/resumen

# Distribución
curl http://localhost:8082/api/stats/distribucion

# Recientes (últimos 3)
curl http://localhost:8082/api/stats/recientes?limit=3
```

### Desde el navegador

Abre directamente:
- http://localhost:8082/api/stats/resumen
- http://localhost:8082/api/stats/distribucion
- http://localhost:8082/api/stats/recientes

---

## 🛠️ Estructura del Proyecto

```
Stats/
├── src/main/java/grupo10/Stats/
│   ├── MicroservicioStatsApplication.java    # Clase principal
│   ├── config/
│   │   └── CorsConfig.java                   # Configuración CORS global
│   ├── controller/
│   │   └── HistorialController.java          # Endpoints REST
│   ├── dto/
│   │   └── Reporte.java                      # Entidad JPA
│   ├── exception/
│   │   └── GlobalExceptionHandler.java       # Manejo de errores
│   ├── repository/
│   │   └── AnalisisRepository.java           # Acceso a datos
│   └── service/
│       └── StatsService.java                 # Lógica de negocio
└── src/main/resources/
    └── application.properties                # Configuración
```

---

## 🔐 Seguridad

### CORS

Configurado para permitir múltiples orígenes:
- Desarrollo: `http://localhost:5173`, `http://localhost:3000`
- Producción: Configurar vía variable `CORS_ORIGINS`

### Base de Datos

- Usa variables de entorno en producción
- Pool de conexiones HikariCP configurado (10 conexiones máx.)
- Sin DDL automático (`ddl-auto=none`)

---

## 📦 Compilación

### Generar JAR

```bash
mvn clean package
```

El JAR se genera en: `target/Stats-0.0.1-SNAPSHOT.jar`

### Ejecutar JAR

```bash
java -jar target/Stats-0.0.1-SNAPSHOT.jar
```

---

## 🐛 Manejo de Errores

El microservicio incluye `GlobalExceptionHandler` que retorna respuestas estructuradas:

```json
{
  "timestamp": "2025-11-28T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "El parámetro 'limit' debe estar entre 1 y 50"
}
```

---

## 📝 Mejoras Implementadas

✅ Eliminado repositorio duplicado (`StatRepository.java`)  
✅ Renombrado `reporte` → `Reporte` (convención Java)  
✅ CORS configurable por múltiples orígenes  
✅ Manejo global de excepciones  
✅ Validaciones de parámetros  
✅ Pool de conexiones optimizado  
✅ Logging configurado  
✅ Documentación JavaDoc en métodos  
✅ ResponseEntity con códigos HTTP apropiados  

---

## 👥 Autores

**Grupo 10 - SecureLink Backend**

## 📄 Licencia

Este proyecto es parte del sistema SecureLink.
