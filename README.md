# API de Comparación de Productos

## 1. Descripción del Proyecto

Este proyecto es una implementación en TypeScript de una API RESTful para consultar y comparar productos. La solución está diseñada con un enfoque en la escalabilidad, mantenibilidad y buenas prácticas de desarrollo de software, demostrando una base arquitectónica sólida y lista para evolucionar hacia un sistema de producción.

El servicio expone endpoints para listar todos los productos, obtener detalles de un producto específico y comparar dos productos por sus atributos.

## 2. Decisiones de Arquitectura

La arquitectura de la aplicación es una decisión consciente para equilibrar la simplicidad requerida por el entorno de la prueba técnica con la robustez esperada en un sistema empresarial.

*   **Arquitectura por Capas:** Se ha implementado una arquitectura clásica por capas (Controlador, Servicio, Repositorio/Modelo) para asegurar una clara **Separación de Responsabilidades**.
    *   **Capa de Controladores:** Únicamente responsable de gestionar las peticiones y respuestas HTTP, delegando toda la lógica de negocio.
    *   **Capa de Servicios:** Contiene la lógica de negocio principal (ej. cómo se comparan los productos), orquestando las operaciones y desacoplada de la capa de datos.
    *   **Capa de Datos:** Abstrae el origen de los datos.

*   **Principios SOLID:** El diseño respeta los principios SOLID. Por ejemplo, el **Principio de Inversión de Dependencias (DIP)** se logra inyectando el `ProductService` en el `ProductController`, en lugar de una implementación concreta. Esto facilita la sustitución y las pruebas.

*   **Persistencia en Memoria (Decisión Táctica):** Para el contexto de esta prueba técnica, se eligió una implementación de persistencia en memoria (`Array`). Esta decisión prioriza la **simplicidad y el rendimiento** en un entorno controlado, eliminando la necesidad de configurar una base de datos externa.

*   **Validación basada en Middlewares:** Se utiliza `express-validator` para validar los datos de entrada a nivel de ruta. Esto mantiene los controladores limpios y centrados en la lógica de negocio, delegando la responsabilidad de la validación a middlewares reutilizables que rechazan peticiones inválidas de forma temprana.

    **Visión a Futuro:** En un entorno de producción, esta implementación sería reemplazada sin esfuerzo. Gracias al uso del **Patrón Repositorio**, simplemente se crearía una nueva implementación de repositorio (ej. `PostgresProductRepository`) utilizando un ORM como Prisma o TypeORM para conectar a una base de datos relacional como **PostgreSQL**. El resto de la aplicación no requeriría cambios.

## 3. Referencia de la API

Los siguientes endpoints están disponibles:

*   `GET /products`
    *   **Descripción:** Devuelve una lista de todos los productos disponibles.
    *   **Respuesta Exitosa:** `200 OK`

*   `GET /products/{id}`
    *   **Descripción:** Devuelve un producto específico según su ID.
    *   **Respuesta Exitosa:** `200 OK`
    *   **Respuestas de Error:**
        *   `400 Bad Request` si el ID no es un número. Ejemplo de respuesta:
            ```json
            {
              "errores": [
                {
                  "type": "field",
                  "value": "abc",
                  "msg": "El parámetro id debe ser un número.",
                  "path": "id",
                  "location": "params"
                }
              ]
            }
            ```
        *   `404 Not Found` si el ID no existe.

*   `GET /products/compare?id1={id1}&id2={id2}`
    *   **Descripción:** Compara dos productos y devuelve un resumen de sus diferencias.
    *   **Respuesta Exitosa:** `200 OK`
    *   **Respuestas de Error:**
        *   `400 Bad Request` si `id1` o `id2` faltan o no son números.
        *   `404 Not Found` si alguno de los IDs no existe.

## 4. Instalación y Pruebas

El proyecto utiliza Node.js y npm para la gestión de dependencias y como herramienta de construcción.

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Ejecutar pruebas:**
    ```bash
    npm test
    ```

3.  **Ejecutar la aplicación (modo desarrollo):**
    ```bash
    npm run dev
    ```
    La API estará disponible en `http://localhost:8080`.

4.  **Construir y ejecutar la aplicación (modo producción):**
    ```bash
    npm run build
    npm start
    ```
