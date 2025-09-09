import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../../services/profileService';
import {
  Container,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
  });

  const mutation = useMutation({
    mutationFn: (updatedProfile) => profileService.updateProfile(updatedProfile),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setBio(profile.bio);
    }
  }, [profile]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    mutation.mutate({ ...profile, name, bio });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">Error fetching profile: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 4, mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar src={profile.avatar} sx={{ width: 80, height: 80, mr: 2 }} />
            <div>
              <Typography variant="h4">{profile.name}</Typography>
              <Typography variant="subtitle1" color="text.secondary">{profile.email}</Typography>
              <Typography variant="subtitle2" color="text.secondary">{profile.role}</Typography>
            </div>
          </Box>

          {isEditing ? (
            <Box component="form" noValidate autoComplete="off">
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                fullWidth
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" onClick={handleSave} sx={{ mr: 1 }}>
                Save
              </Button>
              <Button variant="outlined" onClick={handleEditToggle}>
                Cancel
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>{profile.bio}</Typography>
              <Button variant="contained" onClick={handleEditToggle}>
                Edit Profile
              </Button>
            </Box>
          )}

          {mutation.isLoading && <CircularProgress sx={{ mt: 2 }} />}
          {mutation.isError && <Alert severity="error" sx={{ mt: 2 }}>{mutation.error.message}</Alert>}
          {mutation.isSuccess && <Alert severity="success" sx={{ mt: 2 }}>Profile updated successfully!</Alert>}
        </Paper>
      </Container>
    </motion.div>
  );
};

export default ProfilePage;
