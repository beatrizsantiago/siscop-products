import { Box } from '@mui/material';

import List from '../List';
import Add from '../Add';

const Main = () => {
  return (
    <Box padding={2}>
      <Box display="flex" justifyContent="flex-end" marginBottom={2}>
        <Add />
      </Box>
      <List />
    </Box>
  );
}

export default Main;
