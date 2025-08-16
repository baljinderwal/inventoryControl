import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const StatItem = ({ value, label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      });
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
    >
      <Typography variant="h3" component="p" align="center" color="primary">
        {value}
      </Typography>
      <Typography variant="h6" component="p" align="center">
        {label}
      </Typography>
    </motion.div>
  );
};

const Stats = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <StatItem value="10,000+" label="Active Users" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatItem value="5M+" label="Products Managed" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatItem value="99.9%" label="Uptime" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Stats;
