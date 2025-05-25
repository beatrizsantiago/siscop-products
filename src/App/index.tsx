import { theme } from 'agro-core';
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';

import { ProductProvider } from './context';
import Main from './Main';

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ProductProvider>
      <Main />
    </ProductProvider>
    <ToastContainer />
  </ThemeProvider>
);

export default App;
