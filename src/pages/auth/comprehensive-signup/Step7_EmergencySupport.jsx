import React from 'react';
import { TextField, Box, Typography, Grid } from '@mui/material';

export default function Step7_EmergencySupport({ formData, handleChange, errors = {} }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Emergency / Support Contacts
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="contactName"
            name="contactName"
            label="Alternate Contact Person Name"
            fullWidth
            variant="standard"
            value={formData.contactName || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="relationship"
            name="relationship"
            label="Relationship"
            fullWidth
            variant="standard"
            value={formData.relationship || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="contactNumber"
            name="contactNumber"
            label="Contact Number"
            fullWidth
            variant="standard"
            value={formData.contactNumber || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="contactEmail"
            name="contactEmail"
            label="Email"
            fullWidth
            variant="standard"
            value={formData.contactEmail || ''}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
