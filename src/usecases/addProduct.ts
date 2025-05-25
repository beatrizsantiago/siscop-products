import { ProductRepository } from '@domain/repositories/ProductRepository';
import Product from '@domain/entities/Product';

type AddProductParams = {
  name: string;
  cycle_days: number;
  unit_value: number;
};

class AddProductUseCase {
  constructor(private repository: ProductRepository) {}

  async execute(params: AddProductParams) {
    const product = new Product(
      '',
      params.name,
      params.unit_value,
      params.cycle_days,
    );
  
    return await this.repository.add(product);
  }
};

export default AddProductUseCase;