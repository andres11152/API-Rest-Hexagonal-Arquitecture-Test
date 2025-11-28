export class Product {
  // Las propiedades son readonly para evitar mutaciones externas accidentales
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly rating: number,
    public readonly image_url: string,
    public readonly description: string,
    public readonly specs: { [key: string]: string }
  ) {
    // AQUÍ es donde ocurre la magia del Dominio Rico: Validaciones al nacer.
    this.validate();
  }

  private validate(): void {
    if (!this.id) {
      throw new Error("El ID del producto es obligatorio.");
    }
    if (this.price < 0) {
      throw new Error("El precio no puede ser negativo.");
    }
    if (this.rating < 0 || this.rating > 5) {
      throw new Error("El rating debe estar entre 0 y 5.");
    }
  }

  // Ahora podrías agregar métodos de negocio a futuro, por ejemplo:
  // hasSpec(key: string): boolean { return !!this.specs[key]; }
}