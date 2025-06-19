import { useState } from 'react';
import { Box, Button, Dialog, IconButton, Typography, useTheme } from '@mui/material';
import { TrashIcon } from '@phosphor-icons/react';
import { toast } from 'react-toastify';
import { useProductContext } from '@App/context';
import { firebaseProduct } from '@fb/product';
import DeleteProductUseCase from '@usecases/deleteProduct';
import Product from '@domain/entities/Product';

type Props = {
  product: Product,
};

const Delete = ({ product }:Props) => {
  const { palette } = useTheme();

  const { dispatch } = useProductContext();
  
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const toggleDialog = () => setShowConfirmationDialog((current) => !current);

  const onDeleteClick = async () => {
    try {
      const deleteProductUseCase = new DeleteProductUseCase(firebaseProduct);
      await deleteProductUseCase.execute(product.id);

      toast.success('Produto excluído com sucesso!');

      dispatch({
        type: 'DELETE_PRODUCT', id: product.id,
      });
    } catch (error: any) {
      if ('message' in error && typeof error.message === 'string' && error.message.includes('REFERENCE_ERROR')) {
        toast.error('Não é possível excluir este produto, pois ele está referenciado em outros registros.');
        return;
      }
      toast.error('Erro ao excluir o produto. Tente novamente.');
    }
  };

  return (
    <>
      <IconButton onClick={toggleDialog}>
        <TrashIcon size={20} color={palette.error.main} />
      </IconButton>

      {showConfirmationDialog && (
        <Dialog
          open
          onClose={toggleDialog}
          maxWidth="xs"
          fullWidth
        >
          <Typography variant="h6" fontWeight={600} lineHeight={1.2} align="center">
            Tem certeza que deseja excluir o produto
            {' '}
            <strong>
              {product.name}
            </strong>
            ?
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Esta ação não pode ser desfeita.
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={3} gap={3}>
            <Button
              onClick={toggleDialog}
              variant="outlined"
              color="secondary"
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={onDeleteClick}
              fullWidth
            >
              Excluir
            </Button>
          </Box>
        </Dialog>
      )}
    </>
  );
}

export default Delete;
