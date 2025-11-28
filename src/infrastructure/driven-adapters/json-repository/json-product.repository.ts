import { promises as fs } from "node:fs";
import path from "node:path";
import { Product } from "@/domain/entities/product.entity";
import { IProductRepository } from "@/domain/repositories/product-repository.interface";

/**
 * @class JsonProductRepository
 * @description Adaptador de persistencia que implementa IProductRepository.
 * Lee un JSON y convierte los datos crudos en instancias ricas de la entidad Product.
 */
export class JsonProductRepository implements IProductRepository {
  private readonly dbPath = path.resolve(
    process.cwd(),
    "src",
    "data",
    "products.json",
  );

  /**
   * @private
   * @method readDatabase
   * @description Lee el JSON y mapea los datos crudos a instancias de la Clase Product.
   */
  private async readDatabase(): Promise<Product[]> {
    try {
      const data = await fs.readFile(this.dbPath, "utf-8");
      const rawProducts = JSON.parse(data);

      // AQUÍ ESTÁ LA CLAVE: Mapeamos el objeto plano a una instancia real de la clase.
      // Esto activa el constructor y las validaciones de la entidad.
      return rawProducts.map((item: any) => new Product(
        item.id,
        item.name,
        item.price,
        item.rating,
        item.image_url,
        item.description,
        item.specs
      ));

    } catch (error) {
      console.error("Error reading or parsing the database file:", error);
      return [];
    }
  }

  public async findAll(): Promise<Product[]> {
    // Como readDatabase ya devuelve instancias de la clase, esto es directo.
    return this.readDatabase();
  }

  public async findById(id: string): Promise<Product | null> {
    const products = await this.readDatabase();
    // Aquí 'products' ya contiene objetos con superpoderes (validaciones, métodos)
    const product = products.find((p) => p.id === id);
    return product || null;
  }
}