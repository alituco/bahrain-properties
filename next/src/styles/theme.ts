import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-k2d), sans-serif',
  },
  palette: {
    primary: {
      main: '#1C2434', // primary, used for background of containers, etc.
    },
    secondary: {
      main: '#E6E4E0', // secondary, used for backend containers, etc.
    },
    background: {
      default: '#f8f8f8', // global white background
      paper: '#f8f8f8',   // paper background
    },
    text: { 
      primary: '#000000', // primary text
      secondary: '#AAA8A3', // secondary text
    },
  },
  // other MUI theme options...
});

export default theme;
