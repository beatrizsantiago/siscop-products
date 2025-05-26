import { render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { ProductProvider, useProductContext } from '../../src/App/context';
import GetAllProductsUseCase from '../../src/usecases/getAllProducts';
import SearchProductsUseCase from '../../src/usecases/searchProductsByName';

jest.mock('../../src/usecases/getAllProducts');
jest.mock('../../src/usecases/searchProductsByName');

const mockProducts = [
  { id: '1', name: 'Apple', unit_value: 5, cycle_days: 30 },
  { id: '2', name: 'Banana', unit_value: 3, cycle_days: 15 },
];

const ConsumerComponent = () => {
  const { state, onSearch } = useProductContext();

  return (
    <div>
      <div data-testid="product-count">{state.products.length}</div>
      <button onClick={() => onSearch('Apple')}>Search</button>
    </div>
  );
};

describe('ProductProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and provide products on mount', async () => {
    const executeMock = jest.fn().mockResolvedValue(mockProducts);
    (GetAllProductsUseCase as jest.Mock).mockImplementation(() => ({
      execute: executeMock,
    }));

    render(
      <ProductProvider>
        <ConsumerComponent />
      </ProductProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('product-count').textContent).toBe('2');
    });

    expect(executeMock).toHaveBeenCalledTimes(1);
  });

  it('should call search use case on onSearch and update state', async () => {
    const executeMock = jest.fn().mockResolvedValue([mockProducts[0]]);
    (SearchProductsUseCase as jest.Mock).mockImplementation(() => ({
      execute: executeMock,
    }));

    render(
      <ProductProvider>
        <ConsumerComponent />
      </ProductProvider>
    );

    screen.getByText('Search').click();

    await waitFor(() => {
      expect(screen.getByTestId('product-count').textContent).toBe('1');
    });

    expect(executeMock).toHaveBeenCalledWith('Apple');
  });

  it('should handle errors and show toast on getProducts failure', async () => {
    const executeMock = jest.fn().mockRejectedValue(new Error('fail'));
    (GetAllProductsUseCase as jest.Mock).mockImplementation(() => ({
      execute: executeMock,
    }));

    render(
      <ProductProvider>
        <ConsumerComponent />
      </ProductProvider>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao carregar produtos');
    });
  });

  it('should handle errors and show toast on search failure', async () => {
    const executeMock = jest.fn().mockRejectedValue(new Error('fail'));
    (SearchProductsUseCase as jest.Mock).mockImplementation(() => ({
      execute: executeMock,
    }));

    render(
      <ProductProvider>
        <ConsumerComponent />
      </ProductProvider>
    );

    screen.getByText('Search').click();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao pesquisar produtos');
    });
  });
});