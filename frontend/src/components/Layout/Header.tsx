import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Box, IconButton, Stack, styled } from '@mui/material';
import ThemeToggle from './ThemeToggle';
import { NavLink } from 'react-router-dom';
import { Home } from '@mui/icons-material';
import logo from '../../assets/logo.png';

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
        <Stack direction="row" alignItems="center">
          <Typography
            fontSize={{ xs: '1.5rem', md: '2rem' }}
            color="inherit"
            fontWeight={500}>
            SharedSpace
          </Typography>
          <Box component="img" width="50px" src={logo} />
        </Stack>

        <ThemeToggle />
      </Toolbar>
    </StyledAppBar>
  );
}
