import { ProductRepository } from '@domain/repositories/ProductRepository';


class DeleteProductUseCase {
  constructor(private repository: ProductRepository) {}

  async execute(id: string) {
    return await this.repository.delete(id);
  };
};

export default DeleteProductUseCase;
