import Product from '@domain/entities/Product';

export interface ProductRepository {
  add(product: Product): Promise<Product>;
  getAll(): Promise<Product[]>;
  update(product: Product): Promise<Product>;
  isProductReferenced(collectionName: string, productId: string): Promise<boolean>;
  delete(id: string): Promise<void>;
  searchByName(searchText: string): Promise<Product[]>;
};
