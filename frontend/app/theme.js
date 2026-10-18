import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary: { main: '#a96f69' },
    secondary: { main: '#d6a09d' },
    background: { default: '#faf7f4', paper: '#fffdfb' },
    text: { primary: '#24201f', secondary: '#766f6b' },
  },
  typography: {
    fontFamily: 'Heebo, Arial, sans-serif',
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 0 },
});
