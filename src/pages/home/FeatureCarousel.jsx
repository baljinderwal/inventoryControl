import React from 'react';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const features = [
  { name: 'Dashboard', description: 'A central hub for all your inventory data.' },
  { name: 'Products', description: 'Manage your products with ease.' },
  { name: 'Suppliers', description: 'Keep track of your suppliers and their performance.' },
  { name: 'Orders', description: 'Manage purchase orders and sales orders.' },
  { name: 'Stock', description: 'Keep track of your stock levels.' },
];

const FeatureCarousel = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Features
      </Typography>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.name}
                </Typography>
                <Typography>{feature.description}</Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeatureCarousel;
