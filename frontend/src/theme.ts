import { createTheme } from '@mui/material/styles';

// A calm, low-saturation palette so the three status columns (which each get
// an accent color) stay the visually loudest thing on the page.
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3B5BDB' },
    background: { default: '#F5F6FA', paper: '#FFFFFF' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
    h5: { fontWeight: 700 },
    subtitle2: { fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});

export const STATUS_ACCENT: Record<string, string> = {
  todo: '#8D99AE',
  in_progress: '#F08C00',
  done: '#2F9E44',
};
