import React from 'react';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const DemoWindow = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  position: 'relative',
  height: 400,
  backgroundColor: theme.palette.background.default,
}));

const DemoSidebar = styled(Box)(({ theme }) => ({
  width: 180,
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(2),
}));

const DemoContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const ThemeDemo = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Fully Themed and Customizable
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        Choose from multiple themes and customize the look and feel of the application.
      </Typography>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <DemoWindow elevation={5}>
          <Box sx={{ display: 'flex', height: '100%' }}>
            <DemoSidebar>
              <Typography variant="h6">Inventory</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography>Dashboard</Typography>
                <Typography>Products</Typography>
                <Typography>Orders</Typography>
              </Box>
            </DemoSidebar>
            <DemoContent>
              <Typography variant="h5">Dashboard</Typography>
              <Typography>Welcome back, Admin!</Typography>
            </DemoContent>
          </Box>
        </DemoWindow>
      </motion.div>
    </Box>
  );
};

export default ThemeDemo;
