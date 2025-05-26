import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useProductContext } from '../../src/App/context';
import Add from '../../src/App/Add';
import AddProductUseCase from '../../src/usecases/addProduct';

jest.mock('../../src/usecases/addProduct');
jest.mock('../../src/App/context', () => ({
  useProductContext: jest.fn(),
}));

describe('<Add /> with real CurrencyField and parseStringNumberToFloat', () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useProductContext as jest.Mock).mockReturnValue({ dispatch: dispatchMock });
  });

  it('should input and parse currency correctly using real logic', async () => {
    const expectedUnitValue = 2.00;
    const expectedCycleDays = 15;
    const mockResponse = {
      id: '1',
      name: 'Alface',
      unit_value: expectedUnitValue,
      cycle_days: expectedCycleDays,
    };

    const executeMock = jest.fn().mockResolvedValue(mockResponse);
    (AddProductUseCase as jest.Mock).mockImplementation(() => ({
      execute: executeMock,
    }));

    render(<Add />);
    fireEvent.click(screen.getByText(/Adicionar/i));

    fireEvent.change(screen.getByLabelText(/Nome/i), {
      target: { value: 'Alface' },
    });
    fireEvent.change(screen.getByLabelText(/Ciclo \(em dias\)/i), {
      target: { value: expectedCycleDays.toString() },
    });

    const currencyInput = screen.getByTestId('currency-input') as HTMLInputElement;
    fireEvent.change(currencyInput, { target: { value: '200' } });

    await waitFor(() => {
      expect(currencyInput.value).toBe('R$ 2,00');
    });

    fireEvent.click(screen.getByText(/Cadastrar/i));

    await waitFor(() => {
      expect(executeMock).toHaveBeenCalledWith({
        name: 'Alface',
        unit_value: expectedUnitValue,
        cycle_days: expectedCycleDays,
      });

      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'ADD_PRODUCT',
        item: mockResponse,
      });
    });

    expect(screen.queryByText(/Novo produto/i)).not.toBeInTheDocument();
  });
});
