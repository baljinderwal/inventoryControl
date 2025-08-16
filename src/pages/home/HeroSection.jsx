import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { motion as Motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const HeroSection = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        color: 'white',
        py: 20,
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" component="h1" fontWeight="bold">
            Modern Inventory Management
          </Typography>
        </Motion.div>
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography variant="h5" sx={{ mt: 2, mb: 4 }}>
            Streamline your stock, orders, and suppliers with ease.
          </Typography>
        </Motion.div>
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={NavLink}
            to="/signup"
            sx={{ mr: 2 }}
          >
            Get Started for Free
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            component={NavLink}
            to="/login"
          >
            Login
          </Button>
        </Motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;
