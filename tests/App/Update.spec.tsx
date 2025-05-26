import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useProductContext } from '../../src/App/context';
import Update from '../../src/App/Update';
import UpdateProductUseCase from '../../src/usecases/updateProduct';

jest.mock('../../src/usecases/updateProduct');
jest.mock('../../src/App/context', () => ({
  useProductContext: jest.fn(),
}));

describe('<Update />', () => {
  const dispatchMock = jest.fn();

  const product = {
    id: '1',
    name: 'Alface',
    cycle_days: 15,
    unit_value: 2.0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useProductContext as jest.Mock).mockReturnValue({ dispatch: dispatchMock });
  });

  it('should open dialog and display product information', () => {
    render(<Update product={product} />);
    fireEvent.click(screen.getByRole('button'));

    const currencyInput = screen.getByTestId('currency-input') as HTMLInputElement;

    expect(screen.getByText(/Atualizar/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(product.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(product.cycle_days.toString())).toBeInTheDocument();
    expect(currencyInput.value).toBe('R$ 2,00');
  });

  it('should validate cycleDays = 0 and show error', async () => {
    render(<Update product={product} />);
    fireEvent.click(screen.getByRole('button'));

    fireEvent.change(screen.getByLabelText(/Ciclo \(em dias\)/i), {
      target: { value: '0' },
    });

    fireEvent.click(screen.getByText(/Salvar/i));

    expect(await screen.findByText(/Valor deve ser maior que zero/i)).toBeInTheDocument();
  });

  it('should validate unitValue = 0 and show error', async () => {
    render(<Update product={product} />);
    fireEvent.click(screen.getByRole('button'));

    const currencyInput = screen.getByTestId('currency-input');
    fireEvent.change(currencyInput, { target: { value: '0' } });

    fireEvent.click(screen.getByText(/Salvar/i));

    expect(await screen.findByText(/Valor deve ser maior que zero/i)).toBeInTheDocument();
  });

  it('should update product and dispatch action on valid submission', async () => {
    const response = {
      id: '1',
      name: 'Alface',
      cycle_days: 20,
      unit_value: 3.5,
    };

    (UpdateProductUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(response),
    }));

    render(<Update product={product} />);
    fireEvent.click(screen.getByRole('button'));

    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: 'Alface' },
    });

    fireEvent.change(screen.getByLabelText(/Ciclo \(em dias\)/i), {
      target: { value: '20' },
    });

    fireEvent.change(screen.getByTestId('currency-input'), {
      target: { value: '350' },
    });

    fireEvent.click(screen.getByText(/Salvar/i));

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'UPDATE_PRODUCT',
        item: response,
      });
    });
  });
});
