import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    dark?: string;
    primary: string;
  }
  interface TypeText {
    heading: string;
    paragraph: string;
  }
}

const theme = createTheme({
  cssVariables: true,
  spacing: 8,
  typography: {
    allVariants: {
      color: '#FFFFFF',
      fontFamily: 'Chakra Petch',
    },
    button: {
      textTransform: 'none',
    },
  },
  palette: {
    text: {
      primary: '#FFFFFF',
      secondary: '#000000',
      heading: '#4F3F3F',
      paragraph: '#666',
    },
    background: { primary: '#1E2340', dark: '#000000' },
    primary: { main: '#30ACA6' },
    info: { main: '#FFD700' },
  },
});

export default theme;