import { useState } from 'react';
import {
  Box, Button, Dialog, TextField, Typography, Grid,
  IconButton,
  useTheme,
} from '@mui/material';
import { PencilSimpleIcon } from '@phosphor-icons/react';
import { Errors } from '@generalTypes/global';
import { formatMoney, parseStringNumberToFloat } from '@utils/dataAdapters';
import { useProductContext } from '@App/context';
import { firebaseProduct } from '@fb/product';
import UpdateProductUseCase from '@usecases/updateProduct';
import ErrorLabel from '@components/ErrorLabel';
import CurrencyField from '@components/CurrencyField';
import Product from '@domain/entities/Product';

type Props = {
  product: Product,
}

const Update = ({ product }:Props) => {
  const { palette } = useTheme();
  const { dispatch } = useProductContext();

  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>(null);
  const [unitValue, setUnitValue] = useState(formatMoney(product.unit_value));

  const handleClose = () => setShowDialog(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get('name') as string;
    const cycleDays = formData.get('cycleDays') as string;

    const absCycleDays = Math.abs(parseStringNumberToFloat(cycleDays));
    const absUnitValue = Math.abs(parseStringNumberToFloat(unitValue));

    if (absCycleDays <= 0) {
      setErrors({ cycleDays: 'Valor deve ser maior que zero' });
      return;
    }

    if (absUnitValue <= 0) {
      setErrors({ unitValue: 'Valor deve ser maior que zero' });
      return;
    }

    setErrors(null);
    setLoading(true);

    try {
      const updateProductUseCase = new UpdateProductUseCase(firebaseProduct);
      const response = await updateProductUseCase.execute({
        id: product.id,
        name,
        cycle_days: absCycleDays,
        unit_value: absUnitValue,
      });

      dispatch({
        type: 'UPDATE_PRODUCT',
        item: response,
      });

      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton onClick={() => setShowDialog(true)}>
        <PencilSimpleIcon size={20} color={palette.secondary.main} />
      </IconButton>

      {showDialog && (
        <Dialog
          open
          onClose={handleClose}
          fullWidth
          maxWidth="sm"
        >
          <Typography variant="h6" fontWeight={600} marginBottom={2}>
            Atualizar
            {' '}
            <strong>{product.name}</strong>
          </Typography>

          <form onSubmit={onSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField
                  name="name"
                  label="Nome"
                  variant='standard'
                  defaultValue={product.name}
                  fullWidth
                  required
                />
                {errors?.name && <ErrorLabel error={errors.name} />}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="cycleDays"
                  label="Ciclo (em dias)"
                  helperText="Tempo até a colheita"
                  variant='standard'
                  type="number"
                  defaultValue={product.cycle_days}
                  fullWidth
                  required
                />
                {errors?.cycleDays && <ErrorLabel error={errors.cycleDays} />}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CurrencyField
                  label="Preço unitário"
                  helperText="Ex: R$ 2,00"
                  placeholder="0,00"
                  variant="standard"
                  value={unitValue}
                  onChange={(value) => setUnitValue(value as string)}
                  fullWidth
                  required
                />
                {errors?.unitValue && <ErrorLabel error={errors.unitValue} />}
              </Grid>
            </Grid>

            <Box marginTop={4} display="flex" justifyContent="space-between">
              <Button onClick={handleClose} variant="outlined" color="error">
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                loading={loading}
                loadingPosition="start"
              >
                Salvar
              </Button>
            </Box>
          </form>
        </Dialog>
      )}
    </>
  );
}

export default Update;
