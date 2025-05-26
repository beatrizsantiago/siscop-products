import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { useProductContext } from '../../src/App/context';
import Delete from '../../src/App/Delete';
import DeleteProductUseCase from '../../src/usecases/deleteProduct';

jest.mock('../../src/usecases/deleteProduct');
jest.mock('../../src/App/context', () => ({
  useProductContext: jest.fn(),
}));

describe('<Delete />', () => {
  const dispatchMock = jest.fn();
  const product = { id: '1', name: 'Tomate' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useProductContext as jest.Mock).mockReturnValue({ dispatch: dispatchMock });
  });

  it('should open and close confirmation dialog', () => {
    render(<Delete product={product} />);

    expect(screen.queryByText(/Tem certeza que deseja excluir o produto/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText(/Tem certeza que deseja excluir o produto/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Cancelar/i));

    expect(screen.queryByText(/Tem certeza que deseja excluir o produto/i)).not.toBeInTheDocument();
  });

  it('should delete product and dispatch action on confirm', async () => {
    const executeMock = jest.fn().mockResolvedValue(undefined);
    (DeleteProductUseCase as jest.Mock).mockImplementation(() => ({
      execute: executeMock,
    }));

    render(<Delete product={product} />);

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button', { name: /Excluir/i }));

    await waitFor(() => {
      expect(executeMock).toHaveBeenCalledWith(product.id);
      expect(toast.success).toHaveBeenCalledWith('Produto excluído com sucesso!');
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'DELETE_PRODUCT',
        id: product.id,
      });
    });
  });

  it('should show toast error on delete failure', async () => {
    const executeMock = jest.fn().mockRejectedValue(new Error('fail'));
    (DeleteProductUseCase as jest.Mock).mockImplementation(() => ({
      execute: executeMock,
    }));

    render(<Delete product={product} />);

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button', { name: /Excluir/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao excluir o produto. Tente novamente.');
    });
  });
});
