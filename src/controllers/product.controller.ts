import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // La validación y conversión a número ya se hizo en el middleware
      const id = parseInt(req.params.id, 10); // Mantenemos el parseInt por seguridad de tipo
      const product = await this.productService.getProductById(id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  };

  compareProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // La validación y conversión a número ya se hizo en el middleware
      const id1 = parseInt(req.query.id1 as string, 10); // Mantenemos el parseInt por seguridad de tipo
      const id2 = parseInt(req.query.id2 as string, 10);

      const comparison = await this.productService.compareProducts(id1, id2);
      res.json(comparison);
    } catch (error) {
      next(error);
    }
  };
}
