import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Product } from '@/domain/entities/product.entity';
import { IProductRepository } from '@/domain/repositories/product-repository.interface';

/**
 * @class JsonProductRepository
 * @description Adaptador de persistencia que implementa IProductRepository
 * para leer datos de productos desde un archivo JSON.
 * Se ubica en la capa de Infraestructura.
 */
export class JsonProductRepository implements IProductRepository {
  private readonly dbPath = path.resolve(process.cwd(), 'src', 'data', 'products.json');

  /**
   * @private
   * @method readDatabase
   * @description Lee y parsea el archivo JSON que actúa como base de datos.
   * @returns {Promise<Product[]>} Una promesa que resuelve a un arreglo de productos.
   * Retorna un arreglo vacío si ocurre un error.
   */
  private async readDatabase(): Promise<Product[]> {
    try {
      const data = await fs.readFile(this.dbPath, 'utf-8');
      return JSON.parse(data) as Product[];
    } catch (error) {
      console.error('Error reading or parsing the database file:', error);
      // Si el archivo no existe o hay un error de parseo, retornamos un array vacío.
      return [];
    }
  }

  /**
   * @description Obtiene todos los productos de la base de datos en memoria.
   * @returns {Promise<Product[]>}
   */
  public async findAll(): Promise<Product[]> {
    return this.readDatabase();
  }

  /**
   * @description Busca un producto por su ID.
   * @param {string} id - El ID del producto a buscar.
   * @returns {Promise<Product | null>} El producto encontrado o null.
   */
  public async findById(id: string): Promise<Product | null> {
    const products = await this.readDatabase();
    const product = products.find((p) => p.id === id);
    return product || null;
  }
}