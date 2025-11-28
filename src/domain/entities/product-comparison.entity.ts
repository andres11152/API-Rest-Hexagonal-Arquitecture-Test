import { Product } from './product.entity';

export interface ProductComparison {
  product1: Product;
  product2: Product;
  comparison: {
    priceDifference: number;
    ratingDifference: number;
  };
}
