import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Box, Container } from '@mui/material';
import BgEffect from '../BgEffect';

export default function Layout() {
  return (
    <Box bgcolor="background.default" minHeight="100%">
      <Header />
      <br />
      <BgEffect />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
