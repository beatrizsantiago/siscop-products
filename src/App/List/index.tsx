import {
  Box, IconButton, Paper, Typography, useTheme,
} from '@mui/material';
import { PencilSimpleIcon } from '@phosphor-icons/react';
import { formatMoney } from '@utils/dataAdapters';
import { useProductContext } from '@App/context';
import Delete from '@App/Delete';

const List = () => {
  const { palette } = useTheme();

  const { state } = useProductContext();

  return (
    <Box>
      {state.products.map((item) => (
        <Paper key={item.id} elevation={0} sx={{ p: 2, borderRadius: 3, mt: 2, }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box flex={1}>
              <Typography fontWeight={600}>
                {item.name}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Ciclo:
                {' '}
                <b>
                  {item.cycle_days}
                  {' '}
                  dias
                </b>
              </Typography>

              <Typography color="text.secondary" variant="body2">
                Valor unitário:
                {' '}
                <b>
                  {formatMoney(item.unit_value)}
                </b>
              </Typography>
            </Box>

            <Box>
              <IconButton>
                <PencilSimpleIcon size={20} color={palette.secondary.main} />
              </IconButton>
              <Delete product={item} />
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default List;
