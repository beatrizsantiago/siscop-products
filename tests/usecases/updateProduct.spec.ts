import UpdateProductUseCase from '../../src/usecases/updateProduct';
import { ProductRepository } from '../../src/domain/repositories/ProductRepository';
import * as dataAdapters from '../../src/utils/dataAdapters';
import Product from '../../src/domain/entities/Product';

describe('UpdateProductUseCase', () => {
  it('should create a new Product instance with formatted name and call repository.update', async () => {
    const inputProduct = {
      id: 'p1',
      name: '  banana ',
      unit_value: 10,
      cycle_days: 7,
    };

    const formattedName = 'Banana';

    const capitalizeSpy = jest
      .spyOn(dataAdapters, 'capitalizeFirstLetter')
      .mockReturnValue(formattedName);

    const mockUpdate = jest.fn().mockResolvedValue(true);

    const mockRepository: ProductRepository = {
      update: mockUpdate,
    } as unknown as ProductRepository;

    const useCase = new UpdateProductUseCase(mockRepository);

    const result = await useCase.execute(inputProduct);

    expect(capitalizeSpy).toHaveBeenCalledWith(inputProduct.name.trim());

    const expectedProduct = new Product(
      inputProduct.id,
      formattedName,
      inputProduct.unit_value,
      inputProduct.cycle_days
    );

    expect(mockUpdate).toHaveBeenCalledWith(expectedProduct);
    expect(result).toBe(true);
  });
});
