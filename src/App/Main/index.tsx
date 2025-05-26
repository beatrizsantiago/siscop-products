import { Box } from '@mui/material';

import List from '../List';
import Add from '../Add';
import Search from './components/Search';

const Main = () => (
  <Box padding={2}>
    <Box display="flex" justifyContent="space-between" marginBottom={3}>
      <Search />
      <Add />
    </Box>
    <List />
  </Box>
);

export default Main;
