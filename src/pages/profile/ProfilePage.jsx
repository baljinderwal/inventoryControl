import React from 'react';
import { useAuth } from '../../utils/AuthContext';
import { Container, Paper, Typography, Box, Avatar, CircularProgress } from '@mui/material';

const ProfilePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5">No user data found.</Typography>
          <Typography variant="body1">Please log in to see your profile.</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 80, height: 80 }}>
            <Typography variant="h3">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</Typography>
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ mt: 2 }}>
            {user.name}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            {user.email}
          </Typography>
          <Typography variant="body1">Role: {user.role}</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
