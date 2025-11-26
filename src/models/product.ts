export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image_url: string;
  description: string;
  specs: { [key: string]: string };
}
