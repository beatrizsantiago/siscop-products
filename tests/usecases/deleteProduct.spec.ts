import DeleteProductUseCase from '../../src/usecases/deleteProduct';
import { ProductRepository } from '../../src/domain/repositories/ProductRepository';

describe('DeleteProductUseCase', () => {
  it('should call repository.delete with the given id', async () => {
    const mockDelete = jest.fn().mockResolvedValueOnce(true);
    const mockRepository = {
      delete: mockDelete,
    } as unknown as ProductRepository;

    const useCase = new DeleteProductUseCase(mockRepository);
    const productId = '12345';

    const result = await useCase.execute(productId);

    expect(mockDelete).toHaveBeenCalledWith(productId);
    expect(result).toBe(true);
  });
});
