import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import {
  validateCompareProducts,
  validateGetProductById,
  handleValidationErrors,
} from "../middlewares/validation.middleware";

/**
 * Crea y configura las rutas para los productos.
 * @param controller - El controlador de productos que manejará las solicitudes.
 * @returns Un enrutador de Express configurado.
 */
export const createProductRoutes = (controller: ProductController): Router => {
  const router = Router();

  // Se utilizan los métodos del controlador inyectado.
  // Los métodos en el controlador ya son arrow functions, por lo que no es necesario usar .bind().
  router.get("/", controller.getAllProducts);

  router.get(
    "/compare",
    validateCompareProducts,
    handleValidationErrors,
    controller.compareProducts,
  );

  router.get(
    "/:id",
    validateGetProductById,
    handleValidationErrors,
    controller.getProductById,
  );

  return router;
};
