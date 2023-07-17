import { Box, Button, Grow, Stack, TextField, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import React from 'react';
import mainImage from '../assets/mainImage.png';

export default function Home() {
  const [sid, setSid] = React.useState('');

  return (
    <Grow in>
      <Stack
        justifyContent="center"
        width="100%"
        height="100%"
        alignItems="center"
        spacing={{ xs: 4, md: 6 }}>
        <Box component={'img'} maxWidth="250px" src={mainImage} />
        <Stack spacing={2}>
          <Typography variant="h5" textAlign="center" color="primary">
            TL;DR just click <b>Enter Shared Space!</b>
          </Typography>
          <Typography textAlign="center" maxWidth="600px" color="textPrimary">
            Need to copy a link or file on a different device? Introducing{' '}
            <b>SharedSpace</b>, enabling easy sharing and access to resources
            across any device in just two clicks.
          </Typography>
        </Stack>

        <TextField
          label="Space ID (Optional)"
          onChange={e => {
            setSid(e.target.value);
          }}
        />
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
