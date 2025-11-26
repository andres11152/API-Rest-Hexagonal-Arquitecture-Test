import { Product } from '../models/product';

export class ProductRepository {
  private readonly products: Product[];

  constructor(productsData: Product[]) {
    this.products = productsData;
  }

  findAll(): Product[] {
    return this.products;
  }

  findById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id.toString());
  }
}
