import { ProductNotFoundException } from "@/domain/exceptions/product-not-found.exception";
import { Product } from "@/domain/entities/product.entity";
import { ProductComparison } from "@/domain/entities/product-comparison.entity";
import { IProductRepository } from "@/domain/repositories/product-repository.interface";

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
    // 1. Orquestación: Obtener las entidades desde el repositorio.
    const [product1, product2] = await Promise.all([
      this.productRepository.findById(id1),
      this.productRepository.findById(id2),
    ]);

    // 2. Orquestación: Validar la existencia y manejar excepciones de infraestructura/dominio.
    if (!product1 || !product2) {
      const notFoundId = !product1 ? id1 : id2;
      throw new ProductNotFoundException(
        `Producto con id ${notFoundId} no fue encontrado para la comparación`,
      );
    }

    // 3. Delegación: Crear la entidad de dominio rica, que se encarga de toda la lógica de negocio.
    // El servicio ya no sabe "cómo" se comparan los productos.
    return new ProductComparison(product1, product2);
  }
}
