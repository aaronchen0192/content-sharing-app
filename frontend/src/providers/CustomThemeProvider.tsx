import React from 'react';
import { ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from '../theme';
import usePersistState from '../hooks/usePersistState';

type ThemeModeContextType = 'dark' | 'light' | 'auto' | undefined;

const ThemeContext = React.createContext<
  | null
  | [
      ThemeModeContextType,
      React.Dispatch<React.SetStateAction<ThemeModeContextType>>,
    ]
>(null);

const CustomThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeMode] = usePersistState<ThemeModeContextType>(
    'themeMode',
    'light',
  );
  return (
    <ThemeProvider theme={themeMode === 'dark' ? darkTheme : lightTheme}>
      <ThemeContext.Provider value={[themeMode, setThemeMode]}>
        {children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, react-refresh/only-export-components
export const useThemeContext = () => React.useContext(ThemeContext)!;

export default CustomThemeProvider;
