import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TypewriterComponent from './Typewriter';
import AnimatedDashboard from './AnimatedDashboard';
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

const Background = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        y,
        background: 'url(https://www.transparenttextures.com/patterns/cubes.png)',
        opacity: 0.1,
      }}
    />
  );
};

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="hero-section">
        <Background />
        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Modern Inventory Management Made Simple.
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Manage products, suppliers, orders, and reports—all in one place.
          </Typography>
          <Box sx={{ mt: 2, minHeight: '2.5em' }}>
            <TypewriterComponent />
          </Box>
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
          <Box sx={{ my: 4 }}>
            <AnimatedDashboard />
          </Box>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'loop',
            }}
            style={{ position: 'absolute', bottom: 30 }}
          >
            <ArrowDownwardIcon />
          </motion.div>
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
