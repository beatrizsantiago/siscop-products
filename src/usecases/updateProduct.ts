import { ProductRepository } from '@domain/repositories/ProductRepository';
import { capitalizeFirstLetter } from '@utils/dataAdapters';
import Product from '@domain/entities/Product';

class UpdateProductUseCase {
  constructor(private repository: ProductRepository) {}

  async execute(params: Product) {
    const product = new Product(
      params.id,
      capitalizeFirstLetter(params.name.trim()),
      params.unit_value,
      params.cycle_days,
    );
  
    return await this.repository.update(product);
  }
};

export default UpdateProductUseCase;