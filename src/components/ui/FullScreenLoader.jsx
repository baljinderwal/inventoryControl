import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const FullScreenLoader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'background.default',
        zIndex: (theme) => theme.zIndex.modal + 1,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default FullScreenLoader;
