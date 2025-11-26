import { Product } from '../models/product';
import { ProductComparison } from '../models/product.dto';
import { ProductRepository } from '../repositories/product.repository';
import { ProductNotFoundException } from '../middlewares/errorHandler';

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getAllProducts(): Promise<Product[]> {
    return Promise.resolve(this.productRepository.findAll());
  }

  async getProductById(id: number): Promise<Product | null> {
    const product = this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundException(`Producto con id ${id} no encontrado`);
    }
    return Promise.resolve(product);
  }

  async compareProducts(id1: number, id2: number): Promise<ProductComparison> {
    const product1 = this.productRepository.findById(id1);
    const product2 = this.productRepository.findById(id2);

    if (!product1 || !product2) {
      throw new ProductNotFoundException('Uno o ambos productos no fueron encontrados');
    }

    return {
      product1,
      product2,
      comparison: {
        priceDifference: product1.price - product2.price,
        ratingDifference: product1.rating - product2.rating,
      },
    };
  }
}
