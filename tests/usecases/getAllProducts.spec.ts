import GetAllProductsUseCase from '../../src/usecases/getAllProducts';
import { ProductRepository } from '../../src/domain/repositories/ProductRepository';

describe('GetAllProductsUseCase', () => {
  it('should return a list of products from the repository', async () => {
    const mockProducts = [
      { id: '1', name: 'Product A' },
      { id: '2', name: 'Product B' }
    ];

    const mockGetAll = jest.fn().mockResolvedValue(mockProducts);
    const mockRepository = {
      getAll: mockGetAll,
    } as unknown as ProductRepository;

    const useCase = new GetAllProductsUseCase(mockRepository);
  
    const result = await useCase.execute();

    expect(mockGetAll).toHaveBeenCalled();
    expect(result).toEqual(mockProducts);
  });
});
