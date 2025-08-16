import React from 'react';
import { Box, Container, Typography, Paper, IconButton } from '@mui/material';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { motion as Motion } from 'framer-motion';

const DemoVideo = () => {
  return (
    <Box sx={{ py: 10, bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h2" textAlign="center" fontWeight="bold" mb={5}>
          See It in Action
        </Typography>
        <Motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Paper
            elevation={8}
            sx={{
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
              cursor: 'pointer',
              background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
              }}
            >
              <IconButton size="large" aria-label="Play video">
                <PlayCircleFilledIcon sx={{ fontSize: 80, color: 'white' }} />
              </IconButton>
            </Box>
            <img
              src="https://via.placeholder.com/800x450.png/CCCCCC/FFFFFF?text=Product+Demo"
              alt="Product Demo"
              style={{ width: '100%', display: 'block' }}
            />
          </Paper>
        </Motion.div>
      </Container>
    </Box>
  );
};

export default DemoVideo;
