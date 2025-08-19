import React from 'react';
import { TextField, Button, Box, Typography, Grid } from '@mui/material';

export default function Step3_RegistrationCompliance({ formData, handleChange, errors = {} }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Business Registration & Compliance
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="msmeNumber"
            name="msmeNumber"
            label="MSME / Udyam Registration Number"
            fullWidth
            variant="standard"
            value={formData.msmeNumber || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" component="label">
            Upload MSME Certificate
            <input type="file" hidden />
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="gstNumber"
            name="gstNumber"
            label="GST Number"
            fullWidth
            variant="standard"
            value={formData.gstNumber || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" component="label">
            Upload GST Certificate
            <input type="file" hidden />
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="tradeLicense"
            name="tradeLicense"
            label="Trade License / Shop Establishment Certificate"
            fullWidth
            variant="standard"
            value={formData.tradeLicense || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="fssaiLicense"
            name="fssaiLicense"
            label="FSSAI License (for food-related businesses)"
            fullWidth
            variant="standard"
            value={formData.fssaiLicense || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="iec"
            name="iec"
            label="Import Export Code (IEC)"
            fullWidth
            variant="standard"
            value={formData.iec || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="businessPan"
            name="businessPan"
            label="Business PAN Number"
            fullWidth
            variant="standard"
            value={formData.businessPan || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="tanNumber"
            name="tanNumber"
            label="TAN Number"
            fullWidth
            variant="standard"
            value={formData.tanNumber || ''}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
