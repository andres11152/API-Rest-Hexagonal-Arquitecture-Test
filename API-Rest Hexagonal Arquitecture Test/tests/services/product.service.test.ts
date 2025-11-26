import { ProductService } from '../../src/services/product.service';
import { ProductRepository } from '../../src/repositories/product.repository';
import { Product } from '../../src/models/product';

// Mock del ProductRepository
jest.mock('../../src/repositories/product.repository');

const MockedProductRepository = ProductRepository as jest.MockedClass<typeof ProductRepository>;

describe('ProductService', () => {
  let productRepository: jest.Mocked<ProductRepository>;
  let productService: ProductService;

  // Datos de prueba
  const mockProduct1: Product = { id: '1', name: 'Laptop Pro X', price: 999900, rating: 4.8, image_url: '', description: '', specs: {} };
  const mockProduct2: Product = { id: '2', name: 'Smartphone S25', price: 899900, rating: 4.7, image_url: '', description: '', specs: {} };

  beforeEach(() => {
    // Limpiamos los mocks y reiniciamos las instancias antes de cada prueba
    MockedProductRepository.mockClear();
    
    // Creamos una nueva instancia del mock del repositorio
    productRepository = new MockedProductRepository([]) as jest.Mocked<ProductRepository>;
    
    // Creamos una nueva instancia del servicio, inyectando el repositorio mockeado
    productService = new ProductService(productRepository);
  });

  describe('getAllProducts', () => {
    it('should return all products from the repository', async () => {
      const mockProducts = [mockProduct1, mockProduct2];
      // Arrange: Simulamos que el repositorio devuelve una lista de productos
      productRepository.findAll.mockReturnValue(mockProducts);

      // Act: Llamamos al método del servicio
      const products = await productService.getAllProducts();

      // Assert: Verificamos que el servicio devolvió los productos correctos
      expect(products).toEqual(mockProducts);
      expect(productRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProductById', () => {
    it('should return a product by its id from the repository', async () => {
      // Arrange
      productRepository.findById.mockReturnValue(mockProduct1); // findById es síncrono

      // Act
      const product = await productService.getProductById(1);

      // Assert
      expect(product).toEqual(mockProduct1);
      expect(productRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should return null if product is not found', async () => {
      // Arrange
      productRepository.findById.mockReturnValue(undefined);

      // Act
      const product = await productService.getProductById(99);

      // Assert
      expect(product).toBeNull();
      expect(productRepository.findById).toHaveBeenCalledWith(99);
    });
  });

  describe('compareProducts', () => {
    it('should return null if one of the products does not exist', async () => {
      // Arrange: Uno existe, el otro no
      productRepository.findById.mockReturnValueOnce(mockProduct1).mockReturnValueOnce(undefined);

      // Act
      const result = await productService.compareProducts(1, 99);

      // Assert
      expect(result).toBeNull();
    });

    it('should return the comparison between two products', async () => {
      // Arrange: Ambos productos existen
      productRepository.findById.mockReturnValueOnce(mockProduct1).mockReturnValueOnce(mockProduct2);

      // Act
      const result = await productService.compareProducts(1, 2);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.product1).toEqual(mockProduct1);
      expect(result?.product2).toEqual(mockProduct2);
      expect(result?.comparison.priceDifference).toBe(100000);
      expect(result?.comparison.ratingDifference).toBeCloseTo(0.1);
    });
  });
});