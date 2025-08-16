import React from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const AnimatedDashboard = () => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          overflow: 'hidden',
          width: '100%',
          maxWidth: 600,
          mx: 'auto',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Dashboard Preview
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 150 }}>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${Math.random() * 80 + 20}%` }}
              transition={{ duration: 0.5, delay: i * 0.1 + 0.5 }}
              style={{
                width: '15%',
                backgroundColor: theme.palette.primary.main,
                borderRadius: '4px 4px 0 0',
              }}
            />
          ))}
        </Box>
      </Paper>
    </motion.div>
  );
};

export default AnimatedDashboard;
