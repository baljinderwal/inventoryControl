import React from 'react';
import { Box, Button, Container, Typography, IconButton } from '@mui/material';
import { motion as Motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const HeroSection = ({ onScrollDown }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        color: 'white',
        py: 20,
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
      <Motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'loop',
        }}
        style={{ position: 'absolute', bottom: 30, left: '50%', x: '-50%' }}
      >
        <IconButton onClick={onScrollDown} size="large" aria-label="Scroll down">
          <KeyboardArrowDownIcon sx={{ color: 'white', fontSize: 40 }} />
        </IconButton>
      </Motion.div>
    </Box>
  );
};

export default HeroSection;
