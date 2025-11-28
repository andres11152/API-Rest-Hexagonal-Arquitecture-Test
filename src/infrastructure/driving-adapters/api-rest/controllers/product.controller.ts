import { Request, Response, NextFunction } from 'express';
import { ProductService } from '@/application/services/product.service';
import { ProductMapper } from '../mappers/product.mapper'; // <--- Importamos el Mapper

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await this.productService.getAllProducts();
      // Transformamos el array de entidades a array de DTOs
      const response = products.map(ProductMapper.toDto);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      // Transformamos la entidad única a DTO
      res.json(ProductMapper.toDto(product));
    } catch (error) {
      next(error);
    }
  };

  compareProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id1 = req.query.id1 as string;
      const id2 = req.query.id2 as string;

      const comparisonDomain = await this.productService.compareProducts(id1, id2);
      
      // Transformamos el resultado complejo de comparación
      const response = ProductMapper.toComparisonDto(comparisonDomain);
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}