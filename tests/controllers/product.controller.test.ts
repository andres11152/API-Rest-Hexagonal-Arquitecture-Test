import request from 'supertest';
import { app } from '../../src/app';
import { ProductService } from '../../src/services/product.service';
import { Product } from '../../src/models/product';

// Mock del ProductService. Jest reemplazará todas las instancias de este servicio
// con nuestra versión simulada.
jest.mock('../../src/services/product.service');

// Creamos una instancia "mockeada" del servicio para controlar sus métodos.
const MockedProductService = ProductService as jest.MockedClass<typeof ProductService>;

describe('ProductController', () => {

  // Antes de cada prueba, limpiamos los mocks para asegurar que las pruebas
  // no interfieran entre sí.
  beforeEach(() => {
    MockedProductService.mockClear();
  });

  it('should get all products', async () => {
    // 1. Arrange: Preparamos los datos de prueba y el comportamiento del mock.
    const mockProducts: Product[] = [
      { id: '1', name: 'Test Laptop', price: 1000, rating: 5, image_url: '', description: '', specs: {} },
      { id: '2', name: 'Test Phone', price: 800, rating: 4, image_url: '', description: '', specs: {} },
    ];
    // Simulamos que el método `getAllProducts` del servicio devuelve nuestros datos de prueba.
    MockedProductService.prototype.getAllProducts.mockResolvedValue(mockProducts);

    // 2. Act: Ejecutamos la petición.
    const res = await request(app).get('/products');

    // 3. Assert: Verificamos los resultados.
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockProducts); // Comparamos contra nuestros datos de prueba.
    expect(res.body).toHaveLength(2);
    // Verificamos que el método del servicio fue llamado.
    expect(MockedProductService.prototype.getAllProducts).toHaveBeenCalledTimes(1);
  });

  it('should get a product by id', async () => {
    const mockProduct: Product = { id: '1', name: 'Test Laptop', price: 1000, rating: 5, image_url: '', description: '', specs: {} };
    MockedProductService.prototype.getProductById.mockResolvedValue(mockProduct);

    const res = await request(app).get('/products/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockProduct);
    expect(res.body).toHaveProperty('id', '1');
    expect(MockedProductService.prototype.getProductById).toHaveBeenCalledWith(1);
  });

  it('should return 404 for a non-existent product', async () => {
    // Simulamos que el servicio devuelve null porque no encontró el producto.
    MockedProductService.prototype.getProductById.mockResolvedValue(null);

    const res = await request(app).get('/products/99');

    expect(res.status).toBe(404);
    expect(MockedProductService.prototype.getProductById).toHaveBeenCalledWith(99);
  });

  it('should return 400 if product id is not a number', async () => {
    const res = await request(app).get('/products/abc');

    expect(res.status).toBe(400);
    expect(res.body.errores[0].msg).toBe('El parámetro id debe ser un número.');
    // Verificamos que el servicio NUNCA fue llamado, el error se detuvo en el middleware.
    expect(MockedProductService.prototype.getProductById).not.toHaveBeenCalled();
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
    expect(MockedProductService.prototype.compareProducts).toHaveBeenCalledWith(1, 2);
  });

  it('should return 404 when comparing a non-existent product', async () => {
    // Simulamos que el servicio devuelve null porque uno de los productos no existe.
    MockedProductService.prototype.compareProducts.mockResolvedValue(null);

    const res = await request(app).get('/products/compare?id1=1&id2=99');
    expect(res.status).toBe(404);
    expect(MockedProductService.prototype.compareProducts).toHaveBeenCalledWith(1, 99);
  });

  it('should return 400 if compare parameters are missing', async () => {
    const res = await request(app).get('/products/compare?id1=1');

    expect(res.status).toBe(400);
    expect(res.body.errores[0].msg).toBe('El parámetro id2 es requerido.');
    expect(MockedProductService.prototype.compareProducts).not.toHaveBeenCalled();
  });

  it('should return 400 if compare parameters are not numbers', async () => {
    const res = await request(app).get('/products/compare?id1=1&id2=abc');

    expect(res.status).toBe(400);
    expect(res.body.errores[0].msg).toBe('El parámetro id2 debe ser un número.');
    expect(MockedProductService.prototype.compareProducts).not.toHaveBeenCalled();
  });
});
