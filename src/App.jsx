import React from 'react';
import Shortener from './components/UrlShortener';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const appTheme = createTheme();

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Shortener />
    </ThemeProvider>
  );
}

export default App;