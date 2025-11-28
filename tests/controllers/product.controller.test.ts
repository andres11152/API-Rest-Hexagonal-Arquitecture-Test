import request from 'supertest';
import { app } from '@/app';
import { ProductService } from '@/application/services/product.service';
import { ProductNotFoundException } from '@/domain/exceptions/product-not-found.exception';
import { ProductComparison } from '@/domain/entities/product-comparison.entity';
import { Product } from '@/domain/entities/product.entity';

// Mock del ProductService
jest.mock('@/application/services/product.service');

const MockedProductService = ProductService as jest.MockedClass<typeof ProductService>;

// --- Funciones de Ayuda (Helpers) para las Pruebas ---

/**
 * Crea un objeto de producto mock para el dominio.
 * Permite sobreescribir propiedades para diferentes escenarios de prueba.
 */
const createMockProduct = (overrides: Partial<Product> = {}): Product => {
  const defaultProps = {
    id: '1',
    name: 'Test Product',
    price: 100,
    rating: 4,
    image_url: 'http://example.com/image.jpg',
    description: 'A test product.',
    specs: {},
  };
  const props = { ...defaultProps, ...overrides };
  // Llama al constructor con argumentos individuales para que coincida con la firma de la clase.
  return new Product(
    props.id,
    props.name,
    props.price,
    props.rating,
    props.image_url,
    props.description,
    props.specs,
  );
};

/** Transforma un producto del dominio al formato de respuesta de la API. */
const toProductResponse = (product: Product) => {
  const { image_url, ...rest } = product;
  return { ...rest, image: image_url, category: 'General', currency: 'COP' };
};

describe('ProductController', () => {
  beforeEach(() => {
    // Limpiamos TODOS los mocks para asegurar que las pruebas no interfieran entre sí.
    jest.clearAllMocks();
  });

  it('should get all products', async () => {
    const mockProducts = [
      createMockProduct({ id: '1', name: 'Test Laptop', price: 1000, rating: 5 }),
      createMockProduct({ id: '2', name: 'Test Phone', price: 800, rating: 4 }),
    ];
    MockedProductService.prototype.getAllProducts.mockResolvedValue(mockProducts);

    const res = await request(app).get('/products');

    expect(res.status).toBe(200);
    const expectedBody = mockProducts.map(toProductResponse);
    expect(res.body).toEqual(expectedBody);
    expect(MockedProductService.prototype.getAllProducts).toHaveBeenCalledTimes(1);
  });

  it('should get a product by id', async () => {
    const mockProduct = createMockProduct({ id: '1' });
    MockedProductService.prototype.getProductById.mockResolvedValue(mockProduct);

    const res = await request(app).get('/products/1');

    expect(res.status).toBe(200);
    const expectedBody = toProductResponse(mockProduct);
    expect(res.body).toEqual(expectedBody);
    expect(MockedProductService.prototype.getProductById).toHaveBeenCalledWith('1');
  });

  it('should compare two products', async () => {
    const mockProduct1 = createMockProduct({ id: '1', name: 'Test Laptop', price: 1000, rating: 5 });
    const mockProduct2 = createMockProduct({ id: '2', name: 'Test Phone', price: 800, rating: 4 });

    // Creamos una instancia real de la entidad de dominio, tal como lo haría el servicio.
    const comparisonResult = new ProductComparison(mockProduct1, mockProduct2);

    // El mock ahora devuelve una instancia de la clase, lo que es correcto.
    MockedProductService.prototype.compareProducts.mockResolvedValue(comparisonResult);

    const res = await request(app).get('/products/compare?id1=1&id2=2');

    expect(res.status).toBe(200);
    // La aserción debe comparar contra las propiedades públicas de la instancia de la clase.
    const expectedBody = {
      comparison: comparisonResult.comparison,
      product1: toProductResponse(mockProduct1),
      product2: toProductResponse(mockProduct2),
    };
    expect(res.body).toEqual(expectedBody);
    expect(MockedProductService.prototype.compareProducts).toHaveBeenCalledWith('1', '2');
  });

  describe('Error Handling', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      // Silenciamos console.error antes de cada prueba en este bloque
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      // Restauramos console.error después de cada prueba
      consoleErrorSpy.mockRestore();
    });

    it('should return 404 for a non-existent product', async () => {
      MockedProductService.prototype.getProductById.mockRejectedValue(new ProductNotFoundException('Not Found'));
      const res = await request(app).get('/products/99');
      expect(res.status).toBe(404);
    });

    it('should return 404 when comparing a non-existent product', async () => {
      MockedProductService.prototype.compareProducts.mockRejectedValue(new ProductNotFoundException('Not Found'));
      const res = await request(app).get('/products/compare?id1=1&id2=99');
      expect(res.status).toBe(404);
    });
  });
});
