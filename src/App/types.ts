import Product from '@domain/entities/Product';

export type State = {
  products: Product[],
  loading: boolean,
};

export type ActionType = { type: 'SET_PRODUCTS', list: Product[] }
| { type: 'ADD_PRODUCT', item: Product }
| { type: 'UPDATE_PRODUCT', item: Product }
| { type: 'DELETE_PRODUCT', id: string };

export type ProductProviderType = {
  state: State,
  dispatch: React.Dispatch<ActionType>,
  onSearch: (searchText: string) => Promise<void>,
};

export type ProductProviderProps = {
  children: React.ReactNode,
};
