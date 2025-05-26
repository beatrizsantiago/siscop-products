import { render, screen } from '@testing-library/react';
import { useProductContext } from '../../src/App/context';
import * as dataAdapters from '../../src/utils/dataAdapters';
import List from '../../src/App/List';

jest.mock('../../src/App/context', () => ({
  useProductContext: jest.fn(),
}));

jest.mock('../../src/App/Delete', () => () => <div data-testid="delete-button" />);
jest.mock('../../src/App/Update', () => () => <div data-testid="update-button" />);

describe('<List />', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Tomate',
      unit_value: 2.5,
      cycle_days: 10,
    },
    {
      id: '2',
      name: 'Alface',
      unit_value: 1.75,
      cycle_days: 7,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useProductContext as jest.Mock).mockReturnValue({
      state: { products: mockProducts },
    });

    jest.spyOn(dataAdapters, 'formatMoney').mockImplementation((value) => `R$ ${value.toFixed(2)}`);
  });

  it('should render product list with name, cycle days and formatted price', () => {
    render(<List />);

    mockProducts.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
      expect(screen.getByText(`${product.cycle_days} dias`)).toBeInTheDocument();
      expect(screen.getByText(`R$ ${product.unit_value.toFixed(2)}`)).toBeInTheDocument();
    });

    expect(screen.getAllByTestId('update-button')).toHaveLength(mockProducts.length);
    expect(screen.getAllByTestId('delete-button')).toHaveLength(mockProducts.length);
  });
});
