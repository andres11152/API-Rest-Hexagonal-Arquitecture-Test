import { Product } from './product.entity';

export interface ProductComparison {
  product1: Product;
  product2: Product;
  comparison: {
    priceDifference: number;
    ratingDifference: number;
    common_specs: string[];
    unique_specs_product1: Record<string, string>;
    unique_specs_product2: Record<string, string>;
  };
}
