import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FeatureCarousel from './FeatureCarousel';
import FeatureSection from './FeatureSection';
import ThemeDemo from './ThemeDemo';
import TechStack from './TechStack';
import DemoVideo from './DemoVideo';
import Testimonials from './Testimonials';
import FinalCTA from './FinalCTA';
import Stats from './Stats';
import './HomePage.css';

const MotionButton = motion(Button);

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="hero-section">
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Modern Inventory Management
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Streamline your stock, orders, and suppliers with ease.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <MotionButton
              component={Link}
              to="/signup"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mr: 2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started for Free
            </MotionButton>
            <MotionButton
              component={Link}
              to="/login"
              variant="outlined"
              color="primary"
              size="large"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </MotionButton>
          </Box>
        </Container>
      </Box>
      <Container maxWidth="lg">
        <Stats />
        <FeatureCarousel />
        <FeatureSection
          title="Comprehensive Dashboard"
          description="Get a bird's eye view of your inventory, sales, and orders. Make informed decisions with real-time data at your fingertips."
          image="https://picsum.photos/seed/dashboard/800/600"
          imageLeft={true}
        />
        <FeatureSection
          title="Product Management"
          description="Easily add, edit, and track your products. Manage variations, pricing, and stock levels with our intuitive interface."
          image="https://picsum.photos/seed/products/800/600"
          imageLeft={false}
        />
        <FeatureSection
          title="Supplier and Order Management"
          description="Manage your suppliers, create purchase orders, and track shipments. Never lose track of an order again."
          image="https://picsum.photos/seed/suppliers/800/600"
          imageLeft={true}
        />
        <ThemeDemo />
        <TechStack />
        <DemoVideo />
        <Testimonials />
        <FinalCTA />
      </Container>
    </motion.div>
  );
};

export default HomePage;
