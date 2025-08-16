import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { motion as Motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const CTASection = () => {
  return (
    <Box sx={{ py: 10, background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', color: 'white' }}>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h3" component="h2" fontWeight="bold" mb={3}>
            Ready to Take Control of Your Inventory?
          </Typography>
          <Typography variant="h6" mb={4}>
            Join hundreds of businesses streamlining their operations with our platform.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={NavLink}
            to="/signup"
            sx={{
              py: 2,
              px: 5,
              fontSize: '1.2rem',
              '&:hover': {
                transform: 'scale(1.05)',
              },
              transition: 'transform 0.2s',
            }}
          >
            Sign Up Now
          </Button>
        </Motion.div>
      </Container>
    </Box>
  );
};

export default CTASection;
