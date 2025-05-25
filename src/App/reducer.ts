import { State, ActionType } from './types';

const reducer = (state: State, action: ActionType):State => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.list,
        loading: false,
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.item],
      };

    default:
      throw new Error('Unhandled action');
  }
};

export default reducer;
