import React from 'react';
import { Button as MuiButton } from '@mui/material';

const Button = ({ children, onClick, variant = 'contained', color = 'primary', sx = {}, ...props }) => {
  return (
    <MuiButton
      onClick={onClick}
      variant={variant}
      color={color}
      sx={{
        textTransform: 'none',
        fontWeight: 'bold',
        padding: '10px 20px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
        ...sx
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
