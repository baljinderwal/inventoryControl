import React from 'react';
import { Checkbox, FormControlLabel, Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function Step8_PreferencesSettings({ formData, handleChange, errors = {} }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Preferences & Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="standard">
            <InputLabel id="language-label">Preferred Language</InputLabel>
            <Select
              labelId="language-label"
              id="language"
              name="language"
              value={formData.language || ''}
              onChange={handleChange}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="hi">Hindi</MenuItem>
              <MenuItem value="pa">Punjabi</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="standard">
            <InputLabel id="communication-mode-label">Communication Mode</InputLabel>
            <Select
              labelId="communication-mode-label"
              id="communicationMode"
              name="communicationMode"
              value={formData.communicationMode || ''}
              onChange={handleChange}
            >
              <MenuItem value="sms">SMS</MenuItem>
              <MenuItem value="whatsapp">WhatsApp</MenuItem>
              <MenuItem value="email">Email</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" name="terms" value="yes" />}
            label="Agree to Terms & Conditions"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" name="marketing" value="yes" />}
            label="Allow Marketing & Promotions (optional)"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
