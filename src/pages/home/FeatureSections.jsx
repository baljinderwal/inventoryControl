import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { motion as Motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    title: 'Comprehensive Dashboard',
    description: 'Gain valuable insights with our all-in-one dashboard. Track sales, monitor stock levels, and identify trends to make informed decisions.',
    image: 'https://picsum.photos/seed/dashboard/800/600',
    align: 'left',
  },
  {
    title: 'Effortless Product Management',
    description: 'Organize your products with categories, variations, and custom fields. Keep your entire catalog up-to-date with bulk import/export.',
    image: 'https://picsum.photos/seed/products/800/600',
    align: 'right',
  },
  {
    title: 'Simplified Order Processing',
    description: 'From purchase orders to sales, our system simplifies the entire process. Automate orders, manage returns, and keep your customers happy.',
    image: 'https://picsum.photos/seed/suppliers/800/600',
    align: 'left',
  },
];

const FeatureSection = ({ title, description, image, align }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const variants = {
    hidden: { opacity: 0, x: align === 'left' ? -100 : 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  return (
    <Box ref={ref} sx={{ py: 8 }}>
      <Motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={variants}
      >
        <Grid container spacing={4} alignItems="center" direction={align === 'left' ? 'row' : 'row-reverse'}>
          <Grid item xs={12} md={6}>
            <Paper elevation={6} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <img src={image} alt={title} style={{ width: '100%', display: 'block' }} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h3" fontWeight="bold" mb={2}>
              {title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          </Grid>
        </Grid>
      </Motion.div>
    </Box>
  );
};

const FeatureSections = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      {features.map((feature, index) => (
        <FeatureSection key={index} {...feature} />
      ))}
    </Container>
  );
};

export default FeatureSections;
