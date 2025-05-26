import reducer from '../../src/App/reducer';
import { State, ActionType } from '../../src/App/types';

describe('product reducer', () => {
  const initialState: State = {
    products: [],
    loading: true,
  };

  it('should handle SET_PRODUCTS', () => {
    const action: ActionType = {
      type: 'SET_PRODUCTS',
      list: [{ id: '1', name: 'Product A' }],
    };

    const result = reducer(initialState, action);

    expect(result.products).toEqual(action.list);
    expect(result.loading).toBe(false);
  });

  it('should handle ADD_PRODUCT', () => {
    const startState: State = {
      products: [{ id: '1', name: 'Product A' }],
      loading: false,
    };

    const newProduct = { id: '2', name: 'Product B' };

    const action: ActionType = {
      type: 'ADD_PRODUCT',
      item: newProduct,
    };

    const result = reducer(startState, action);

    expect(result.products).toHaveLength(2);
    expect(result.products).toContainEqual(newProduct);
  });

  it('should handle UPDATE_PRODUCT', () => {
    const startState: State = {
      products: [
        { id: '1', name: 'Product A' },
        { id: '2', name: 'Product B' },
      ],
      loading: false,
    };

    const updatedProduct = { id: '2', name: 'Product B Updated' };

    const action: ActionType = {
      type: 'UPDATE_PRODUCT',
      item: updatedProduct,
    };

    const result = reducer(startState, action);

    expect(result.products.find(p => p.id === '2')).toEqual(updatedProduct);
  });

  it('should handle DELETE_PRODUCT', () => {
    const startState: State = {
      products: [
        { id: '1', name: 'Product A' },
        { id: '2', name: 'Product B' },
      ],
      loading: false,
    };

    const action: ActionType = {
      type: 'DELETE_PRODUCT',
      id: '1',
    };

    const result = reducer(startState, action);

    expect(result.products).toHaveLength(1);
    expect(result.products.find(p => p.id === '1')).toBeUndefined();
  });

  it('should throw error for unhandled action type', () => {
    const action = { type: 'UNKNOWN_ACTION' } as unknown as ActionType;

    expect(() => reducer(initialState, action)).toThrow('Unhandled action');
  });
});
