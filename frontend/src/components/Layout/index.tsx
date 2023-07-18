import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Box, Container } from '@mui/material';

export default function Layout() {
  return (
    <Box bgcolor="background.default" minHeight="100%" pb={4}>
      <Header />
      <br />
      <Container maxWidth="md">
        <Outlet />
      </Container>
    </Box>
  );
}
