import { Product } from "./product.entity";

interface IComparisonDetails {
  priceDifference: number;
  ratingDifference: number;
  common_specs: string[];
  unique_specs_product1: Record<string, string>;
  unique_specs_product2: Record<string, string>;
}

/**
 * Entidad de Dominio Rica para la comparación de productos.
 * Encapsula toda la lógica de negocio relacionada con la comparación.
 */
export class ProductComparison {
  public readonly product1: Product;
  public readonly product2: Product;
  public readonly comparison: IComparisonDetails;

  constructor(product1: Product, product2: Product) {
    this.product1 = product1;
    this.product2 = product2;

    // El constructor orquesta la creación del estado interno del objeto.
    this.comparison = {
      priceDifference: this.calculatePriceDifference(),
      ratingDifference: this.calculateRatingDifference(),
      ...this.compareSpecifications(),
    };
  }

  /**
   * Calcula la diferencia de precio absoluta entre los dos productos.
   */
  private calculatePriceDifference(): number {
    return Math.abs(this.product1.price - this.product2.price);
  }

  /**
   * Calcula la diferencia de rating absoluta, con una precisión de 2 decimales.
   */
  private calculateRatingDifference(): number {
    return parseFloat(
      Math.abs(this.product1.rating - this.product2.rating).toPrecision(2),
    );
  }

  /**
   * Compara las especificaciones de ambos productos para encontrar las comunes y las únicas.
   */
  private compareSpecifications() {
    const specs1 = this.product1.specs || {};
    const specs2 = this.product2.specs || {};
    const allSpecKeys = Array.from(
      new Set([...Object.keys(specs1), ...Object.keys(specs2)]),
    );

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

    return { common_specs, unique_specs_product1, unique_specs_product2 };
  }
}