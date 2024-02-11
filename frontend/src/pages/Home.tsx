import {
  Box,
  Button,
  Grow,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import React from 'react';
import mainImage from '../assets/3dlogo.png';

export default function Home() {
  const [sid, setSid] = React.useState('');

  return (
    <Grow in>
      <Stack
        justifyContent="center"
        width="100%"
        height="100%"
        alignItems="center"
        spacing={4}>
        <Box
          component={'img'}
          maxWidth={{
            xs: '150px',
            md: '250px',
          }}
          minHeight={{
            xs: '161px',
            md: '270px',
          }}
          src={mainImage}
        />
        <Typography
          typography={{ xs: 'h4', md: 'h3' }}
          textAlign="center"
          color="textPrimary">
          TL;DR just click <br />
          Enter<b> Shared Space!</b>
        </Typography>
        <Typography textAlign="center" maxWidth="580px" color="textPrimary">
          Need to copy a link or file on a different device? Introducing{' '}
          <b>SharedSpace</b>, enabling easy sharing and access to resources in
          just two clicks.
        </Typography>

        <Paper>
          <TextField
            label="Space ID (Optional)"
            onChange={e => {
              setSid(e.target.value);
            }}
          />
        </Paper>
        <Button
          component={NavLink}
          to={sid ? `${sid}` : '/new'}
          sx={{
            px: {
              xs: 4,
              md: 10,
            },
            py: 2,
            fontSize: '1.5rem',
            borderRadius: 8,
            alignItems: 'center',
            textAlign: 'center',
          }}
          variant="contained">
          Enter Shared Space!
        </Button>
      </Stack>
    </Grow>
  );
}
