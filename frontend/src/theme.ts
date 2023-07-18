import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';

/**
 * Handles global theme
 */

const sharedTheme: ThemeOptions = {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
  },
};

export const lightTheme: Theme = createTheme({
  palette: {
    primary: {
      main: '#009ba0',
    },
    success: {
      main: '#009ba0',
    },
  },
  ...sharedTheme,
});

export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#009ba0',
    },
    success: {
      main: '#009ba0',
    },
  },
  ...sharedTheme,
});
