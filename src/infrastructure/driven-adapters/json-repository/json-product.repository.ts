import * as fs from "fs";
import * as path from "path";
import { Product } from "@/domain/entities/product.entity";
import { IProductRepository } from "@/domain/repositories/product-repository.interface";

/**
 * Interfaz para describir la estructura de los datos crudos del JSON.
 * Esto nos permite evitar el uso de `any` y tener un tipado estricto.
 */
interface RawProduct {
  id: string;
  name: string;
  price: number;
  rating: number;
  image_url: string;
  description: string;
  specs: { [key: string]: string };
}

export class JsonProductRepository implements IProductRepository {
  private products: Product[] = [];

  constructor() {
    this.loadProducts();
  }

  private loadProducts(): void {
    try {
      const filePath = path.join(
        __dirname,
        "../../../data/products.json",
      );
      const fileContent = fs.readFileSync(filePath, "utf-8");
      // Se utiliza la interfaz RawProduct para tipar los datos parseados.
      const productsData: RawProduct[] = JSON.parse(fileContent);

      // Se elimina el 'any' explícito, usando el tipo RawProduct en su lugar.
      this.products = productsData.map(
        (p: RawProduct) =>
          new Product(
            p.id,
            p.name,
            p.price,
            p.rating,
            p.image_url,
            p.description,
            p.specs,
          ),
      );
    } catch (error) {
      console.error("Error al cargar los productos desde el JSON:", error);
      this.products = [];
    }
  }

  async findAll(): Promise<Product[]> {
    return Promise.resolve(this.products);
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.products.find((p) => p.id === id);
    return Promise.resolve(product || null);
  }
}