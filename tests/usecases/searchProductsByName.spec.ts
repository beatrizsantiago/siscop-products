import SearchProductsByNameUseCase from '../../src/usecases/searchProductsByName';
import { ProductRepository } from '../../src/domain/repositories/ProductRepository';
import * as dataAdapters from '../../src/utils/dataAdapters';

describe('SearchProductsByNameUseCase', () => {
  it('should call repository.searchByName with the capitalized and trimmed search text', async () => {
    const rawSearchText = '   laptop ';
    const formattedSearchText = 'Laptop';
    const mockProducts = [{ id: '1', name: 'Laptop' }];

    const capitalizeSpy = jest.spyOn(dataAdapters, 'capitalizeFirstLetter').mockReturnValue(formattedSearchText);
    const mockSearchByName = jest.fn().mockResolvedValue(mockProducts);

    const mockRepository: ProductRepository = {
      searchByName: mockSearchByName,
    } as unknown as ProductRepository;

    const useCase = new SearchProductsByNameUseCase(mockRepository);

    const result = await useCase.execute(rawSearchText);

    expect(capitalizeSpy).toHaveBeenCalledWith(rawSearchText.trim());
    expect(mockSearchByName).toHaveBeenCalledWith(formattedSearchText);
    expect(result).toEqual(mockProducts);
  });
});
