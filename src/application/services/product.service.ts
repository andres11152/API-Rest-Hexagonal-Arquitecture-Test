import { ProductNotFoundException } from '@/domain/exceptions/product-not-found.exception';
import { Product } from '@/domain/entities/product.entity';
import { ProductComparison } from '@/domain/entities/product-comparison.entity';
import { IProductRepository } from '@/domain/repositories/product-repository.interface';

export class ProductService {
  constructor(private readonly productRepository: IProductRepository) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundException(`Producto con id ${id} no encontrado`);
    }
    return product;
  }

  async compareProducts(id1: string, id2: string): Promise<ProductComparison> {
    const [product1, product2] = await Promise.all([
      this.productRepository.findById(id1),
      this.productRepository.findById(id2),
    ]);

    if (!product1 || !product2) {
      const notFoundId = !product1 ? id1 : id2;
      throw new ProductNotFoundException(
        `Producto con id ${notFoundId} no fue encontrado para la comparación`
      );
    }

    return {
      product1,
      product2,
      comparison: {
        priceDifference: product1.price - product2.price,
        ratingDifference: parseFloat((product1.rating - product2.rating).toFixed(2)),
      },
    };
  }
}
