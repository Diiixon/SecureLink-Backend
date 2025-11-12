# 🔒 SecureLink - Backend (Microservicios)

Este repositorio contiene el código fuente del backend para el proyecto [SecureLink-React](https://github.com/Diiixon/SecureLink-React). Está implementado usando una arquitectura de microservicios con Java y Spring Boot.

El objetivo de este backend es proveer los servicios de autenticación de usuarios, el análisis de URLs en tiempo real y la consulta de historiales y estadísticas.

## 🏛️ Estructura del Repositorio (Ramas)

Este proyecto utiliza una rama de Git dedicada para cada microservicio. Para trabajar o ejecutar un servicio específico, deberás hacer `checkout` a la rama correspondiente.

* **`rama-analisis`**: Contiene el **Servicio de Análisis**.
* **`rama-registro`**: Contiene el **Servicio de Registro y Autenticación**.
* **`rama-estadisticas`**: Contiene el **Servicio de Estadísticas e Historial**.

---

## 💻 Microservicios

### 1. Servicio de Análisis (rama: `rama-analisis`)
Este servicio es el núcleo de la lógica de detección.
* Recibe texto o archivos `.txt` y extrae todas las URLs.
* Se conecta a las APIs externas (**Google Safe Browsing** y **VirusTotal**) para obtener un veredicto de seguridad.
* Utiliza un servicio interno (`BrandDetectionService`) para detectar suplantación de marca (phishing) basado en una lista de dominios conocidos.

### 2. Servicio de Registro (rama: `rama-registro`)
Este servicio maneja la identidad y seguridad de los usuarios.
* Maneja el registro de nuevos usuarios (`/api/v1/auth/register`), hasheando y guardando las contraseñas.
* Autentica a usuarios existentes (`/api/v1/auth/login`) y genera Tokens JWT.
* Gestiona la lógica de recuperación de contraseña (`/api/v1/auth/forgot-password`).

### 3. Servicio de Estadísticas (rama: `rama-estadisticas`)
Este servicio almacena los resultados y calcula las métricas del dashboard.
* Guarda una copia de cada reporte de análisis en una base de datos.
* Provee un endpoint para que el usuario consulte su historial personal de análisis.
* Provee un endpoint que calcula y devuelve las estadísticas del usuario vs. las estadísticas globales de la plataforma.

---

## 🚀 Tecnologías Utilizadas

* **Java 17**
* **Spring Boot 3**
* **Spring Security:** Para la autenticación, autorización y hashing de contraseñas (BCrypt).
* **Spring Data JPA:** Para la persistencia y comunicación con la base de datos.
* **Spring WebFlux (WebClient):** Para realizar llamadas asíncronas a las APIs externas.
* **PostgreSQL:** Como base de datos relacional.
* **JWT (JSON Web Tokens):** Para manejar sesiones de usuario seguras.
* **Maven:** Para la gestión de dependencias.

---

## 🛠️ Cómo Empezar

1.  Clona el repositorio:
    ```bash
    git clone [https://github.com/Diiixon/TU-REPO-BACKEND.git](https://github.com/Diiixon/TU-REPO-BACKEND.git)
    cd TU-REPO-BACKEND
    ```

2.  Cambia a la rama del servicio que quieres ejecutar:
    ```bash
    # Ejemplo para el servicio de análisis:
    git checkout rama-analisis
    ```

3.  **Configura el servicio:**
    Cada servicio (en cada rama) tiene su propio archivo `src/main/resources/application.properties`. Deberás editarlo para añadir tus claves de API (Google, VirusTotal) y/o la configuración de tu base de datos local.

4.  Ejecuta el servicio usando Maven:
    ```bash
    # (Asegúrate de estar en la carpeta del proyecto, donde está el pom.xml)
    ./mvnw spring-boot:run
    ```
