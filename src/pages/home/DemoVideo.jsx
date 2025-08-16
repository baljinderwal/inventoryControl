import React from 'react';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const DemoVideo = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        See it in Action
      </Typography>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Paper
          elevation={5}
          sx={{
            mt: 4,
            position: 'relative',
            height: 0,
            paddingTop: '56.25%', // 16:9 aspect ratio
            backgroundColor: 'grey.900',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&:hover .play-icon': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <PlayCircleOutlineIcon
            className="play-icon"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 80,
              color: 'white',
              transition: 'transform 0.2s',
            }}
          />
        </Paper>
      </motion.div>
    </Box>
  );
};

export default DemoVideo;
