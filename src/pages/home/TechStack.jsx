import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { motion as Motion } from 'framer-motion';

const techStack = [
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Material-UI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg' },
  { name: 'Framer Motion', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg' },
  { name: 'Vite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'ESLint', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg' },
];

const TechStack = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h2" textAlign="center" fontWeight="bold" mb={5}>
          Powered by Modern Technologies
        </Typography>
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid container spacing={4} justifyContent="center">
            {techStack.map((tech) => (
              <Grid item xs={4} sm={3} md={2} key={tech.name}>
                <Motion.div variants={itemVariants}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 120,
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 6,
                      },
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                  >
                    <img src={tech.icon} alt={tech.name} height="50" />
                    <Typography variant="caption" mt={1}>
                      {tech.name}
                    </Typography>
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

export default TechStack;
