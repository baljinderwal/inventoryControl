import React from 'react';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';

const testimonials = [
  {
    quote: "This inventory system has been a game-changer for our business. We've saved countless hours and reduced errors significantly.",
    author: 'John Doe',
    title: 'CEO, Acme Inc.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    quote: 'The user interface is so intuitive and easy to use. I was able to get my whole team up and running in a single afternoon.',
    author: 'Jane Smith',
    title: 'Operations Manager, Globex Corp.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
  },
  {
    quote: "I can't imagine running my business without this software. The reporting features are incredibly powerful.",
    author: 'Sam Wilson',
    title: 'Owner, Stark Industries',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
  },
];

const Testimonials = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        What Our Customers Are Saying
      </Typography>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {testimonials.map((testimonial, index) => (
          <Grid item xs={12} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar src={testimonial.avatar} alt={testimonial.author} sx={{ width: 80, height: 80, mb: 2 }} />
                <Typography variant="body1" align="center" sx={{ fontStyle: 'italic' }}>
                  "{testimonial.quote}"
                </Typography>
                <Typography variant="h6" component="p" align="center" sx={{ mt: 2 }}>
                  - {testimonial.author}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  {testimonial.title}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Testimonials;
