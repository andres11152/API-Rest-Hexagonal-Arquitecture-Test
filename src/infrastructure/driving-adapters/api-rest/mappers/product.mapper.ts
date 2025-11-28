import { Product } from "@/domain/entities/product.entity";
import { ProductComparison } from "@/domain/entities/product-comparison.entity";

/**
 * DTO para la respuesta de la API de un solo producto.
 */
interface ProductDto {
  id: string;
  name: string;
  price: number;
  currency: string;
  rating: number;
  category: string;
  image: string;
  description: string;
  specs: Record<string, string>;
}

interface ComparisonDto {
  product1: ProductDto;
  product2: ProductDto;
  comparison: ProductComparison["comparison"];
}
/**
 * Clase estática para mapear entidades de dominio a DTOs de API.
 */
export class ProductMapper {
  /**
   * Convierte una entidad Product del dominio a un ProductDto para la API.
   * @param entity La entidad Product del dominio.
   * @returns El DTO del producto para la respuesta de la API.
   */
  public static toDto(entity: Product): ProductDto {
    return {
      id: entity.id,
      name: entity.name,
      price: entity.price,
      rating: entity.rating,
      image: entity.image_url, // Renombramos image_url a image
      description: entity.description, // Añadimos el campo description
      specs: entity.specs, // Añadimos el campo specs
      // Agregamos campos que no están en el dominio pero sí en la respuesta deseada
      currency: "COP",
      category: "General",
    };
  }

  /**
   * Convierte el resultado de una comparación del dominio a un DTO para la API.
   * @param comparisonDomain El objeto de comparación del dominio.
   * @returns El DTO de comparación para la respuesta de la API.
   */
  public static toComparisonDto(
    comparisonDomain: ProductComparison,
  ): ComparisonDto {
    return {
      product1: this.toDto(comparisonDomain.product1),
      product2: this.toDto(comparisonDomain.product2),
      comparison: comparisonDomain.comparison,
    };
  }
}
