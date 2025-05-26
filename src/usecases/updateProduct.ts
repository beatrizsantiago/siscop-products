import { ProductRepository } from '@domain/repositories/ProductRepository';
import Product from '@domain/entities/Product';

class UpdateProductUseCase {
  constructor(private repository: ProductRepository) {}

  async execute(params: Product) {
    const product = new Product(
      params.id,
      params.name,
      params.unit_value,
      params.cycle_days,
    );
  
    return await this.repository.update(product);
  }
};

export default UpdateProductUseCase;