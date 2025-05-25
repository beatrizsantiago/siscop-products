import Product from '@domain/entities/Product';

export type State = {
  products: Product[],
  loading: boolean,
};

export type ActionType = { type: 'SET_PRODUCTS', list: Product[] }
| { type: 'ADD_PRODUCT', item: Product };

export type ProductProviderType = {
  state: State,
  dispatch: React.Dispatch<ActionType>,
};

export type ProductProviderProps = {
  children: React.ReactNode,
};
