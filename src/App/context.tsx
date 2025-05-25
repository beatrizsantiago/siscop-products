import {
  useContext, createContext, useMemo, useReducer,
  useRef, useEffect, useCallback,
} from 'react';
import { firebaseProduct } from '@fb/product';
import { toast } from 'react-toastify';
import GetAllProductsUseCase from '@usecases/getAllProducts';

import { ProductProviderProps, ProductProviderType, State } from './types';
import reducer from './reducer';

const initialState:State = {
  products: [],
  loading: true,
};

const Context = createContext({} as ProductProviderType);
const useProductContext = ():ProductProviderType => useContext(Context);

const ProductProvider = ({ children }: ProductProviderProps) => {
  const initialized = useRef(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const getProducts = useCallback(async () => {
    try {
      const getUserCase = new GetAllProductsUseCase(firebaseProduct);
      const products = await getUserCase.execute();
      dispatch({
        type: 'SET_PRODUCTS',
        list: products,
      });
    } catch {
      toast.error('Erro ao carregar produtos');
    }
  }, []);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getProducts();
    }
  }, [getProducts]);

  const value = useMemo(() => ({
    state,
    dispatch,
  }), [state]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

export { ProductProvider, useProductContext };
