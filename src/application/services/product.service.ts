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

    const priceDifference = Math.abs(product1.price - product2.price);
    const ratingDifference = parseFloat(Math.abs(product1.rating - product2.rating).toPrecision(2));

    const specs1 = product1.specs || {};
    const specs2 = product2.specs || {};
    const allSpecKeys = Array.from(new Set([...Object.keys(specs1), ...Object.keys(specs2)]));

    const common_specs: string[] = [];
    const unique_specs_product1: Record<string, string> = {};
    const unique_specs_product2: Record<string, string> = {};

    for (const key of allSpecKeys) {
      const value1 = specs1[key];
      const value2 = specs2[key];

      if (value1 && value2) {
        if (value1 === value2) {
          common_specs.push(key);
        } else {
          unique_specs_product1[key] = value1;
          unique_specs_product2[key] = value2;
        }
      } else if (value1) {
        unique_specs_product1[key] = value1;
      } else if (value2) {
        unique_specs_product2[key] = value2;
      }
    }

    return {
      product1,
      product2,
      comparison: {
        priceDifference,
        ratingDifference,
        common_specs,
        unique_specs_product1,
        unique_specs_product2,
      },
    };
  }
}
