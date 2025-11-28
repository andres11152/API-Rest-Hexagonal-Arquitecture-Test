import { ProductService } from "@/application/services/product.service";
import { ProductNotFoundException } from "@/domain/exceptions/product-not-found.exception";
import { Product } from "@/domain/entities/product.entity";
import { IProductRepository } from "@/domain/repositories/product-repository.interface";

// Creamos un mock del repositorio. Jest reemplazará todas las funciones
// de la interfaz con funciones mock.
const mockProductRepository: jest.Mocked<IProductRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
};

describe("ProductService", () => {
  let productService: ProductService;

  // Datos de prueba
  const mockProduct1 = new Product(
    "1",
    "Laptop Pro X",
    999900,
    4.8,
    "",
    "",
    {},
  );
  const mockProduct2 = new Product(
    "2",
    "Smartphone S25",
    899900,
    4.7,
    "",
    "",
    {},
  );

  beforeEach(() => {
    // Limpiamos los mocks y reiniciamos las instancias antes de cada prueba
    jest.clearAllMocks();

    // Creamos una nueva instancia del servicio, inyectando el repositorio mockeado
    productService = new ProductService(mockProductRepository);
  });

  describe("getAllProducts", () => {
    it("should return all products from the repository", async () => {
      const mockProducts = [mockProduct1, mockProduct2];
      // Arrange: Simulamos que el repositorio devuelve una lista de productos
      mockProductRepository.findAll.mockResolvedValue(mockProducts);

      // Act: Llamamos al método del servicio
      const products = await productService.getAllProducts();

      // Assert: Verificamos que el servicio devolvió los productos correctos
      expect(products).toEqual(mockProducts);
      expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("getProductById", () => {
    it("should return a product by its id from the repository", async () => {
      // Arrange
      mockProductRepository.findById.mockResolvedValue(mockProduct1);

      // Act
      const product = await productService.getProductById("1");

      // Assert
      expect(product).toEqual(mockProduct1);
      expect(mockProductRepository.findById).toHaveBeenCalledWith("1");
    });

    it("should throw ProductNotFoundException if product is not found", async () => {
      // Arrange
      mockProductRepository.findById.mockResolvedValue(null);

      // Act & Assert
      // Verificamos que la llamada al servicio lance la excepción correcta.
      await expect(productService.getProductById("99")).rejects.toThrow(
        ProductNotFoundException,
      );
      await expect(productService.getProductById("99")).rejects.toThrow(
        "Producto con id 99 no encontrado",
      );
    });
  });

  describe("compareProducts", () => {
    it("should throw ProductNotFoundException if one of the products does not exist", async () => {
      // Arrange: Uno existe, el otro no
      mockProductRepository.findById
        .mockResolvedValueOnce(mockProduct1)
        .mockResolvedValueOnce(null);

      // Act & Assert
      await expect(productService.compareProducts("1", "99")).rejects.toThrow(
        ProductNotFoundException,
      );
    });

    it("should return the comparison between two products", async () => {
      // Arrange: Ambos productos existen
      mockProductRepository.findById
        .mockResolvedValueOnce(mockProduct1)
        .mockResolvedValueOnce(mockProduct2);

      // Act
      const result = await productService.compareProducts("1", "2");

      // Assert
      expect(result).not.toBeNull();
      expect(result?.product1).toEqual(mockProduct1);
      expect(result?.product2).toEqual(mockProduct2);
      expect(result?.comparison.priceDifference).toBe(100000);
      expect(result?.comparison.ratingDifference).toBeCloseTo(0.1); // 4.8 - 4.7 = 0.1
    });
  });
});
