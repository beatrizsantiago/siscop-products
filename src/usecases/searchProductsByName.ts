import { ProductRepository } from '@domain/repositories/ProductRepository';
import { capitalizeFirstLetter } from '@utils/dataAdapters';


class SearchProductsByNameUseCase {
  constructor(private repository: ProductRepository) {}

  async execute(searchText: string) {
    const list = await this.repository.searchByName(
      capitalizeFirstLetter(searchText.trim()),
    );
    return list;
  };
};

export default SearchProductsByNameUseCase;
