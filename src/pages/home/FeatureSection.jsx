import React from 'react';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const FeatureSection = ({ title, description, image, imageLeft }) => {
  const imageVariants = {
    hidden: { opacity: 0, x: imageLeft ? -100 : 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: imageLeft ? 100 : -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: 0.2 },
    },
  };

  const imageColumn = (
    <Grid item xs={12} md={6}>
      <motion.div
        variants={imageVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
          <img src={image} alt={title} style={{ width: '100%', display: 'block' }} />
        </Paper>
      </motion.div>
    </Grid>
  );

  const textColumn = (
    <Grid item xs={12} md={6}>
      <motion.div
        variants={textVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Typography variant="h4" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1">{description}</Typography>
      </motion.div>
    </Grid>
  );

  return (
    <Box sx={{ py: 8 }}>
      <Grid container spacing={4} alignItems="center" direction={imageLeft ? 'row' : 'row-reverse'}>
        {imageColumn}
        {textColumn}
      </Grid>
    </Box>
  );
};

export default FeatureSection;
