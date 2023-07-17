import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { IconButton, styled } from '@mui/material';
import ThemeToggle from './ThemeToggle';
import { NavLink } from 'react-router-dom';
import { Home } from '@mui/icons-material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.getContrastText(theme.palette.primary.main),
  boxShadow: 'none',
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
}));

export function Header() {
  return (
    <StyledAppBar position="sticky">
      <Toolbar
        sx={{ minHeight: '56px !important', justifyContent: 'space-between' }}>
        <IconButton color="inherit" component={NavLink} to="/">
          <Home />
        </IconButton>
        <Typography
          fontSize="2rem"
          color="inherit"
          sx={{ display: { xs: 'none', sm: 'block' } }}
          fontWeight={500}>
          SharedSpace
        </Typography>

        <ThemeToggle />
      </Toolbar>
    </StyledAppBar>
  );
}
