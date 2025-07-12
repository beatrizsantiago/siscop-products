import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { formatMoney } from '@utils/dataAdapters';
import { useProductContext } from '@App/context';
import Delete from '@App/Delete';
import Update from '@App/Update';

const List = () => {
  const { state } = useProductContext();

  if (state.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    )
  };

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
              <Update product={item} />
              <Delete product={item} />
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default List;
