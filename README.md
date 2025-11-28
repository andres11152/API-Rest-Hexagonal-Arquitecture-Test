<div align="center">
  <h1 align="center">Product Comparison REST API</h1>
  <p align="center">
    A robust RESTful API built with Node.js, Express, and TypeScript, following the principles of Hexagonal Architecture.
  </p>
  
  <!-- Badges -->
  <p align="center">
    <img src="https://img.shields.io/badge/Node.js-18.x-blue?logo=node.js" alt="Node.js">
    <img src="https://img.shields.io/badge/TypeScript-4.x-blue?logo=typescript" alt="TypeScript">
    <a href="https://github.com/andres11152/API-Rest-Hexagonal-Arquitecture-Test/actions/workflows/ci.yml"><img src="https://github.com/andres11152/API-Rest-Hexagonal-Arquitecture-Test/actions/workflows/ci.yml/badge.svg" alt="CI Status"></a>
    <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" alt="Code Style: Prettier">
    <img src="https://img.shields.io/badge/Express.js-4.x-green?logo=express" alt="Express.js">
    <img src="https://img.shields.io/badge/Jest-27.x-red?logo=jest" alt="Jest">
    <img src="https://img.shields.io/badge/Arquitectura-Hexagonal-purple" alt="Hexagonal Architecture">
  </p>
</div>

---

## Table of Contents

1.  🚀 Project Description
2.  ✨ Features
3.  🏛️ Architecture and Design Decisions
4.  📂 Folder Structure
5.  🛠️ Tech Stack
6.  🏁 Installation and Setup
7.  📦 Configuration
8.  ✅ Code Quality
9.  🧪 Testing
10. 🔄 Continuous Integration (CI/CD)
11. 📖 API Reference

---

## 🚀 Project Description

This project implements a REST API for querying and comparing products. It is designed as a modern backend showcase, applying advanced software design patterns like **Hexagonal Architecture (Ports & Adapters)** and **SOLID** principles. The goal is to create a decoupled, scalable, maintainable, and highly testable codebase.

## ✨ Features

- **Product Listing:** Get a complete list of available products.
- **Product Detail:** Query detailed information for a product by its ID.
- **Product Comparison:** Compare two products and receive a detailed summary of their features and differences.

## 🏛️ Architecture and Design Decisions

The application's architecture is a deliberate choice to demonstrate a robust, decoupled, and highly testable software foundation, ideal for enterprise environments.

### Hexagonal Architecture (Ports & Adapters)

A strict separation has been implemented between the application's core (domain and business logic) and the infrastructure details (web framework, database). This allows the business logic to be independent of external technology, facilitating its evolution and testing.

- **`domain` (The Core):** Contains the **Rich Domain Entities** (classes like `Product` and `ProductComparison` that encapsulate data and logic), domain-specific exceptions, and "ports" (interfaces like `IProductRepository`). This layer is pure, technology-agnostic, and has no external dependencies.
- **`application` (Business Logic):** Contains the use cases (`ProductService`) that orchestrate the business logic. It depends solely on the domain's abstractions (ports).
- **`infrastructure` (The Outside World):** Contains the "adapters" that implement the ports and interact with the outside world.
  - **Driving Adapters:** Initiate interaction, such as the REST API (Express controllers, routes).
  - **Driven Adapters:** Are controlled by the application, such as the repository implementation (`JsonProductRepository`) that connects to the data source.

```
    +-------------------+      +----------------------+      +--------------------+
    |   Driving         |      |     Application      |      |   Driven           |
    |   Adapters        |----->|       (Ports)        |----->|   Adapters         |
    | (Controllers)     |      |                      |      | (Repositories)     |
    +-------------------+      +----------------------+      +--------------------+
                                      |
                                      v
                              +----------------+
                              |     Domain     |
                              | (Entities)     |
                              +----------------+
```

### Principios SOLID

El diseño respeta los principios SOLID, con un fuerte énfasis en el **Principio de Inversión de Dependencias (DIP)**. Las capas de alto nivel (aplicación) no dependen de las de bajo nivel (infraestructura), sino de abstracciones (interfaces del dominio). Esto se logra mediante **Inyección de Dependencias**, configurada manualmente en `server.ts` para mantener la simplicidad del ejemplo.

### Otras Decisiones Clave

- **Persistencia Táctica:** Para esta prueba, se implementó un repositorio que lee datos desde un archivo `products.json`. Esta decisión simplifica la configuración y ejecución. Gracias a la arquitectura, migrar a **PostgreSQL** o **MongoDB** solo requeriría crear un nuevo repositorio que implemente `IProductRepository` y cambiar una línea en la configuración de inyección de dependencias, sin afectar el resto de la aplicación.
- **Manejo de Errores Centralizado:** Un middleware de Express captura excepciones personalizadas del dominio (ej. `ProductNotFoundException`) y las traduce a respuestas HTTP apropiadas (ej. `404 Not Found`), manteniendo los controladores limpios.
- **Validación de Entrada:** Se utiliza `express-validator` en middlewares para validar los datos de entrada a nivel de ruta, delegando esta responsabilidad y manteniendo los controladores enfocados en su tarea principal.

## 🛠️ Stack Tecnológico

### 📂 Estructura de Carpetas

La estructura del directorio `src` está organizada para reflejar claramente la Arquitectura Hexagonal:

```
src/
├── application/
│   └── services/
│       └── product.service.ts      # Orquesta los casos de uso (lógica de aplicación)
├── domain/
│   ├── entities/
│   │   ├── product.entity.ts       # Entidad de dominio rica para Product
│   │   └── product-comparison.entity.ts # Entidad de dominio rica para Comparison
│   ├── exceptions/
│   │   └── product-not-found.exception.ts # Excepciones específicas del dominio
│   └── repositories/
│       └── product-repository.interface.ts # Puerto de repositorio (contrato)
├── infrastructure/
│   ├── driven-adapters/            # Adaptadores controlados por la aplicación
│   │   └── json-repository/
│   │       └── json-product.repository.ts # Adaptador que implementa el puerto
│   └── driving-adapters/           # Adaptadores que controlan la aplicación
│       └── api-rest/
│           ├── controllers/
│           ├── mappers/
│           ├── middlewares/
│           └── routes/
├── data/
│   └── products.json               # Fuente de datos (detalle de infraestructura)
├── app.ts                          # Configuración de Express y middlewares
└── server.ts                       # Punto de entrada, inyección de dependencias y arranque del servidor
```

## 🛠️ Stack Tecnológico

- **Lenguaje:** TypeScript
- **Backend:** Node.js, Express.js
- **Testing:** Jest, Supertest
- **Validación:** `express-validator`
- **Calidad de Código:** ESLint, Prettier

## 🏁 Instalación y Ejecución

Asegúrate de tener Node.js (v16 o superior) y npm instalados.

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/andres11152/API-Rest-Hexagonal-Arquitecture-Test
    cd API-Rest-Hexagonal-Arquitecture-Test
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Ejecutar en modo desarrollo:**
    El servidor se iniciará en `http://localhost:8080` y se recargará automáticamente con los cambios.

    ```bash
    npm run dev
    ```

4.  **Construir para producción:**
    Esto compilará el código TypeScript a JavaScript en el directorio `dist/`.

    ```bash
    npm run build
    ```

5.  **Ejecutar en modo producción:**
    Ejecuta la aplicación desde el código compilado.
    ```bash
    npm start
    ```

## 📦 Configuración

El proyecto puede ser configurado a través de variables de entorno. Para ello, puedes crear un archivo `.env` en la raíz del proyecto.

```env
# Puerto en el que correrá el servidor
PORT=8080
```

## ✅ Calidad de Código

Se utiliza ESLint y Prettier para mantener un estilo de código limpio y consistente. Para verificar y formatear el código, puedes usar los siguientes comandos:

```bash
# Ejecutar el linter para encontrar errores de estilo
npm run lint

# Formatear automáticamente el código
npm run format
```

## 🧪 Pruebas

El proyecto incluye tests unitarios y de integración para garantizar la calidad y el correcto funcionamiento de la lógica de negocio y los endpoints.

Para ejecutar todas las pruebas:

```bash
npm test
```

## 📖 Referencia de la API

### `GET /products`

Retorna una lista de todos los productos disponibles.

- **Respuesta Exitosa (`200 OK`):**
  ```json
  [
    {
      "id": "1",
      "name": "Laptop Pro X animal X prueba",
      "price": 999900,
      "rating": 4.8,
      "image": "https://example.com/images/laptop_pro_x.jpg",
      "description": "Una laptop de alto rendimiento para profesionales creativos y desarrolladores. Potencia y portabilidad en un diseño elegante.",
      "specs": {
        "screen": "15.6 pulgadas, 4K UHD",
        "processor": "Intel Core i9, 12th Gen 2",
        "ram": "32GB DDR5",
        "storage": "1TB NVMe SSD",
        "graphics": "NVIDIA GeForce RTX 4070"
      },
      "currency": "COP",
      "category": "General"
    }
  ]
  ```

### `GET /products/{id}`

Retorna un producto específico según su ID.

- **Parámetros de URL:**
  - `id` (string, requerido): El ID del producto.
- **Respuesta Exitosa (`200 OK`):** Un objeto de producto (similar al del listado).
- **Respuestas de Error:**
  - `400 Bad Request`: Si el ID proporcionado no tiene un formato válido.
  - `404 Not Found`: Si no se encuentra un producto con el ID especificado.

### `GET /products/compare`

Compara dos productos y devuelve un resumen de sus diferencias.

- **Query Params:**
  - `id1` (string, requerido): ID del primer producto.
  - `id2` (string, requerido): ID del segundo producto.
- **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "product1": {
      "id": "1",
      "name": "Laptop Pro X animal X prueba",
      "price": 999900,
      "rating": 4.8,
      "image": "https://example.com/images/laptop_pro_x.jpg",
      "description": "Una laptop de alto rendimiento para profesionales creativos y desarrolladores. Potencia y portabilidad en un diseño elegante.",
      "specs": {
        "screen": "15.6 pulgadas, 4K UHD",
        "processor": "Intel Core i9, 12th Gen 2",
        "ram": "32GB DDR5",
        "storage": "1TB NVMe SSD",
        "graphics": "NVIDIA GeForce RTX 4070"
      },
      "currency": "COP",
      "category": "General"
    },
    "product2": {
      "id": "2",
      "name": "Smartphone Galaxy S25",
      "price": 899900,
      "rating": 4.7,
      "image": "https://example.com/images/galaxy_s25.jpg",
      "description": "El último smartphone con una cámara revolucionaria y una pantalla inmersiva. Conectividad 5G y rendimiento sin igual.",
      "specs": {
        "screen": "6.8 pulgadas, Dynamic AMOLED 2X",
        "processor": "Snapdragon 8 Gen 4",
        "ram": "12GB",
        "storage": "256GB UFS 4.0",
        "camera": "200MP Wide, 12MP Ultrawide, 10MP Telephoto"
      },
      "currency": "COP",
      "category": "General"
    },
    "comparison": {
      "priceDifference": 100000,
      "ratingDifference": 0.1,
      "common_specs": [],
      "unique_specs_product1": {
        "screen": "15.6 pulgadas, 4K UHD",
        "processor": "Intel Core i9, 12th Gen 2",
        "ram": "32GB DDR5",
        "storage": "1TB NVMe SSD",
        "graphics": "NVIDIA GeForce RTX 4070"
      },
      "unique_specs_product2": {
        "screen": "6.8 pulgadas, Dynamic AMOLED 2X",
        "processor": "Snapdragon 8 Gen 4",
        "ram": "12GB",
        "storage": "256GB UFS 4.0",
        "camera": "200MP Wide, 12MP Ultrawide, 10MP Telephoto"
      }
    }
  }
  ```
- **Respuestas de Error:**
  - `400 Bad Request`: Si `id1` o `id2` faltan en la consulta o no son válidos.
  - `404 Not Found`: Si alguno de los productos no se encuentra.
