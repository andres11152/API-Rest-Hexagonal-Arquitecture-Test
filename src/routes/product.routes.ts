import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';
import { ProductRepository } from '../repositories/product.repository';
import fs from 'fs';
import path from 'path';
import { Product } from '../models/product';
import {
  validateCompareProducts,
  validateGetProductById,
  handleValidationErrors,
} from '../middlewares/validation.middleware';

const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const productsData: Product[] = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

const router = Router();

const productRepository = new ProductRepository(productsData);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

router.get('/', productController.getAllProducts.bind(productController));

router.get(
  '/compare',
  validateCompareProducts,
  handleValidationErrors,
  productController.compareProducts.bind(productController)
);

router.get('/:id', validateGetProductById, handleValidationErrors, productController.getProductById.bind(productController));

export { router as productRoutes };
