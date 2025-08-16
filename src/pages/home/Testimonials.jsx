import React from 'react';
import { Box, Container, Typography, Grid, Paper, Avatar } from '@mui/material';
import { motion as Motion } from 'framer-motion';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const testimonials = [
  {
    name: 'Jane Doe',
    title: 'CEO, TechCorp',
    quote: 'This inventory system has revolutionized our workflow. It\'s intuitive, powerful, and has saved us countless hours.',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'John Smith',
    title: 'Warehouse Manager, LogiStuff',
    quote: 'I can\'t imagine going back to our old system. The barcode scanning and real-time stock updates are game-changers.',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    name: 'Emily White',
    title: 'Small Business Owner',
    quote: 'As a small business, we need tools that are affordable and easy to use. This system is both. Highly recommended!',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

const Testimonials = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" textAlign="center" fontWeight="bold" mb={5}>
          What Our Customers Say
        </Typography>
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Motion.div variants={itemVariants}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <FormatQuoteIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                      <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                        "{testimonial.quote}"
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                      <Avatar src={testimonial.avatar} alt={testimonial.name} sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.title}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Motion.div>
              </Grid>
            ))}
          </Grid>
        </Motion.div>
      </Container>
    </Box>
  );
};

export default Testimonials;
