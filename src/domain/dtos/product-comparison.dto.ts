import { ProductDto } from "./product.dto";

export interface ProductComparisonDto {
  product1: ProductDto; // Usa el DTO, no la Entidad
  product2: ProductDto; // Usa el DTO, no la Entidad
  comparison: {
    price_difference: number; // Snake_case es común en APIs JSON, o camelCase si prefieres
    cheaper_product_id: string; // Un dato útil extra para el frontend
    rating_difference: number;
  };
}
