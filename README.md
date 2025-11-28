<div align="center">
  <h1 align="center">API REST de Comparación de Productos</h1>
  <p align="center">
    Una API RESTful robusta construida con Node.js, Express y TypeScript, siguiendo los principios de la Arquitectura Hexagonal.
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

## Tabla de Contenidos

1.  🚀 Descripción del Proyecto
2.  ✨ Características
3.  🏛️ Arquitectura y Decisiones de Diseño
  4.  📂 Estructura de Carpetas
  5.  🛠️ Stack Tecnológico
  6.  🏁 Instalación y Ejecución
  7.  📦 Configuración
  8.  ✅ Calidad de Código
  9.  🧪 Pruebas
  10. 🔄 Integración Continua (CI/CD)
  11. 📖 Referencia de la API

---

## 🚀 Descripción del Proyecto

Este proyecto implementa una API REST para la consulta y comparación de productos. Ha sido diseñado como una demostración de backend moderno, aplicando patrones de diseño de software avanzados como la **Arquitectura Hexagonal (Puertos y Adaptadores)** y los principios **SOLID**. El objetivo es crear una base de código desacoplada, escalable, mantenible y altamente testeable.

## ✨ Características

- **Listado de productos:** Obtén una lista completa de los productos disponibles.
- **Detalle de producto:** Consulta la información detallada de un producto por su ID.
- **Comparación de productos:** Compara dos productos y recibe un resumen detallado de sus características y diferencias.

## 🏛️ Arquitectura y Decisiones de Diseño

La arquitectura de la aplicación es una decisión deliberada para demostrar una base de software robusta, desacoplada y altamente testeable, ideal para entornos empresariales.

### Arquitectura Hexagonal (Puertos y Adaptadores)

Se ha implementado una estricta separación entre el núcleo de la aplicación (dominio y lógica de negocio) y los detalles de la infraestructura (framework web, base de datos). Esto permite que la lógica de negocio sea independiente de la tecnología externa, facilitando su evolución y testeo.

- **`domain` (El Núcleo):** Contiene las **Entidades de Dominio Ricas** (clases como `Product` y `ProductComparison` que encapsulan datos y lógica), las excepciones de dominio y los "puertos" (interfaces como `IProductRepository`). Esta capa es pura, agnóstica a la tecnología y no tiene dependencias externas.
- **`application` (Lógica de Negocio):** Contiene los casos de uso (`ProductService`) que orquestan la lógica de negocio. Depende únicamente de las abstracciones (puertos) del dominio.
- **`infrastructure` (El Mundo Exterior):** Contiene los "adaptadores" que implementan los puertos y interactúan con el mundo exterior.
  - **Adaptadores de Entrada (Driving Adapters):** Inician la interacción, como la API REST (controladores de Express, rutas).
  - **Adaptadores de Salida (Driven Adapters):** Son controlados por la aplicación, como la implementación del repositorio (`JsonProductRepository`) que se conecta a la fuente de datos.

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
