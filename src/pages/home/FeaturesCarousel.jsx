import React, { useState, forwardRef } from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const features = [
  {
    title: 'Intuitive Dashboard',
    description: 'Get a comprehensive overview of your inventory at a glance.',
    image: 'https://picsum.photos/seed/dashboard/800/600',
  },
  {
    title: 'Product Management',
    description: 'Easily add, edit, and track all your products.',
    image: 'https://picsum.photos/seed/products/800/600',
  },
  {
    title: 'Order Tracking',
    description: 'Manage purchase and sales orders efficiently.',
    image: 'https://picsum.photos/seed/orders/800/600',
  },
  {
    title: 'Supplier Directory',
    description: 'Keep all your supplier information in one place.',
    image: 'https://picsum.photos/seed/suppliers/800/600',
  },
];

const FeaturesCarousel = forwardRef((props, ref) => {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % features.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <Box sx={{ py: 10, bgcolor: 'background.default' }} ref={ref}>
      <Typography variant="h4" component="h2" textAlign="center" fontWeight="bold" mb={5}>
        Key Features
      </Typography>
      <Box sx={{ position: 'relative', height: 400, maxWidth: 600, mx: 'auto' }}>
        <AnimatePresence initial={false}>
          <Motion.div
            key={index}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', width: '100%' }}
          >
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <img
                src={features[index].image}
                alt={features[index].title}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <Box p={3}>
                <Typography variant="h6" fontWeight="bold">
                  {features[index].title}
                </Typography>
                <Typography variant="body1">{features[index].description}</Typography>
              </Box>
            </Paper>
          </Motion.div>
        </AnimatePresence>
        <IconButton
          onClick={handlePrev}
          aria-label="Previous feature"
          sx={{
            position: 'absolute',
            top: '50%',
            left: { xs: 10, sm: -50 },
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.8)' },
          }}
        >
          <ArrowBack />
        </IconButton>
        <IconButton
          onClick={handleNext}
          aria-label="Next feature"
          sx={{
            position: 'absolute',
            top: '50%',
            right: { xs: 10, sm: -50 },
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.8)' },
          }}
        >
          <ArrowForward />
        </IconButton>
      </Box>
    </Box>
  );
});

export default FeaturesCarousel;
