import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const FinalCTA = () => {
  return (
    <Box sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Box
          sx={{
            textAlign: 'center',
            p: 4,
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to take control of your inventory?
          </Typography>
          <Typography variant="h6" component="p" sx={{ mb: 4 }}>
            Sign up for a free trial today. No credit card required.
          </Typography>
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            color="secondary"
            size="large"
          >
            Get Started Now
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default FinalCTA;
