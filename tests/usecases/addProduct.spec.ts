import AddProductUseCase from '../../src/usecases/addProduct';
import Product from '../../src/domain/entities/Product';
import { ProductRepository } from '../../src/domain/repositories/ProductRepository';

describe('AddProductUseCase', () => {
  const mockRepository: ProductRepository = {
    add: jest.fn(),
    getAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    searchByName: jest.fn(),
  };

  const useCase = new AddProductUseCase(mockRepository);

  const params = {
    name: 'test product',
    unit_value: 100,
    cycle_days: 30,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create product with capitalized name and call repository.add', async () => {
    const expectedProduct = new Product(
      '',
      'Test product',
      params.unit_value,
      params.cycle_days
    );

    (mockRepository.add as jest.Mock).mockResolvedValue({
      ...expectedProduct,
      id: 'generated-id',
    });

    const result = await useCase.execute(params);

    expect(mockRepository.add).toHaveBeenCalledWith(expectedProduct);
    expect(result).toEqual({
      ...expectedProduct,
      id: 'generated-id',
    });
  });
});
