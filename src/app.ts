import express from "express";

// 1. Importaciones de las clases concretas y de abstracción
import { ProductService } from "@/application/services/product.service";
import { JsonProductRepository } from "@/infrastructure/driven-adapters/json-repository/json-product.repository";
import { ProductController } from "@/infrastructure/driving-adapters/api-rest/controllers/product.controller";
import { errorHandler } from "@/infrastructure/driving-adapters/api-rest/middlewares/errorHandler";
import { createProductRoutes } from "@/infrastructure/driving-adapters/api-rest/routes/product.routes";

const app = express();

// 2. Composición de Dependencias (Inyección Manual)
const repository = new JsonProductRepository();
const service = new ProductService(repository);
const controller = new ProductController(service);

// 3. Inyección del controlador en las rutas
const productRoutes = createProductRoutes(controller);

app.use(express.json());
app.use("/products", productRoutes);
app.use(errorHandler);

export { app };
