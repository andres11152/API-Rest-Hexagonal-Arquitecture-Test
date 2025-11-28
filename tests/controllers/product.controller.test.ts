import request from 'supertest';
import { app } from '@/app';
import { ProductService } from '@/application/services/product.service';
import { ProductNotFoundException } from '@/domain/exceptions/product-not-found.exception';
import { Product } from '@/domain/entities/product';

// Mock del ProductService
jest.mock('@/application/services/product.service');

const MockedProductService = ProductService as jest.MockedClass<typeof ProductService>;

describe('ProductController', () => {
  beforeEach(() => {
    // Limpiamos TODOS los mocks para asegurar que las pruebas no interfieran entre sí.
    jest.clearAllMocks();
  });

  it('should get all products', async () => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Test Laptop', price: 1000, rating: 5, image_url: '', description: '', specs: {} },
      { id: '2', name: 'Test Phone', price: 800, rating: 4, image_url: '', description: '', specs: {} },
    ];
    MockedProductService.prototype.getAllProducts.mockResolvedValue(mockProducts);

    const res = await request(app).get('/products');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockProducts);
    expect(MockedProductService.prototype.getAllProducts).toHaveBeenCalledTimes(1);
  });

  it('should get a product by id', async () => {
    const mockProduct: Product = { id: '1', name: 'Test Laptop', price: 1000, rating: 5, image_url: '', description: '', specs: {} };
    MockedProductService.prototype.getProductById.mockResolvedValue(mockProduct);

    const res = await request(app).get('/products/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockProduct);
    expect(MockedProductService.prototype.getProductById).toHaveBeenCalledWith('1');
  });

  it('should return 404 for a non-existent product', async () => {
    // Simulamos que el servicio lanza una excepción porque no encontró el producto.
    MockedProductService.prototype.getProductById.mockRejectedValue(new ProductNotFoundException('Not Found'));

    const res = await request(app).get('/products/99');

    expect(res.status).toBe(404);
    expect(MockedProductService.prototype.getProductById).toHaveBeenCalledWith('99');
  });

  it('should compare two products', async () => {
    const mockProduct1: Product = { id: '1', name: 'Test Laptop', price: 1000, rating: 5, image_url: '', description: '', specs: {} };
    const mockProduct2: Product = { id: '2', name: 'Test Phone', price: 800, rating: 4, image_url: '', description: '', specs: {} };

    const comparisonResult = {
      product1: mockProduct1,
      product2: mockProduct2,
      comparison: {
        priceDifference: 200,
        ratingDifference: 1,
      },
    };
    MockedProductService.prototype.compareProducts.mockResolvedValue(comparisonResult);

    const res = await request(app).get('/products/compare?id1=1&id2=2');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(comparisonResult);
    expect(MockedProductService.prototype.compareProducts).toHaveBeenCalledWith('1', '2');
  });

  it('should return 404 when comparing a non-existent product', async () => {
    // Simulamos que el servicio lanza una excepción porque uno de los productos no existe.
    MockedProductService.prototype.compareProducts.mockRejectedValue(new ProductNotFoundException('Not Found'));

    const res = await request(app).get('/products/compare?id1=1&id2=99');
    expect(res.status).toBe(404);
    expect(MockedProductService.prototype.compareProducts).toHaveBeenCalledWith('1', '99');
  });
});
