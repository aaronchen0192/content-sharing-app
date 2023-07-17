import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useThemeContext } from '../../providers/CustomThemeProvider';

const ThemeToggle = () => {
  const [theme, setTheme] = useThemeContext();
  return (
    <Tooltip title="Toggle Light/Dark Theme">
      <IconButton
        color="inherit"
        size="large"
        onClick={() => {
          setTheme(t => (t === 'dark' ? 'light' : 'dark'));
        }}>
        {theme === 'dark' ? <DarkMode /> : <LightMode />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
