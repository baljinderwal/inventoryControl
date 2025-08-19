import React from 'react';
import { TextField, Box, Typography, Grid } from '@mui/material';

export default function Step6_DigitalPresence({ formData, handleChange, errors = {} }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Digital Presence (Optional)
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            id="website"
            name="website"
            label="Website URL"
            fullWidth
            variant="standard"
            value={formData.website || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="socialMedia"
            name="socialMedia"
            label="Social Media Handles"
            fullWidth
            variant="standard"
            value={formData.socialMedia || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="onlineStore"
            name="onlineStore"
            label="Online Store Links"
            fullWidth
            variant="standard"
            value={formData.onlineStore || ''}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
