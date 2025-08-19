import React from 'react';
import { TextField, Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function Step2_BusinessInfo({ formData, handleChange, errors = {} }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Business Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="businessName"
            name="businessName"
            label="Business / Shop Name"
            fullWidth
            variant="standard"
            value={formData.businessName || ''}
            onChange={handleChange}
            error={!!errors.businessName}
            helperText={errors.businessName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="standard" error={!!errors.businessType}>
            <InputLabel id="businessType-label">Type of Business</InputLabel>
            <Select
              labelId="businessType-label"
              id="businessType"
              name="businessType"
              value={formData.businessType || ''}
              onChange={handleChange}
            >
              <MenuItem value="sole_proprietorship">Sole Proprietorship</MenuItem>
              <MenuItem value="partnership">Partnership</MenuItem>
              <MenuItem value="private_limited">Private Limited</MenuItem>
            </Select>
            {errors.businessType && <Typography color="error" variant="caption">{errors.businessType}</Typography>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="businessCategory"
            name="businessCategory"
            label="Business Category"
            fullWidth
            variant="standard"
            value={formData.businessCategory || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="productsServices"
            name="productsServices"
            label="Products / Services Offered"
            fullWidth
            variant="standard"
            value={formData.productsServices || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="businessStartDate"
            name="businessStartDate"
            label="Business Start Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            variant="standard"
            value={formData.businessStartDate || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="standard">
            <InputLabel id="employees-label">Number of Employees</InputLabel>
            <Select
              labelId="employees-label"
              id="employees"
              name="employees"
              value={formData.employees || ''}
              onChange={handleChange}
            >
              <MenuItem value="self-employed">Self-employed</MenuItem>
              <MenuItem value="1-5">1–5</MenuItem>
              <MenuItem value="6-10">6–10</MenuItem>
              <MenuItem value="more">More</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="standard">
            <InputLabel id="premises-label">Nature of Premises</InputLabel>
            <Select
              labelId="premises-label"
              id="premises"
              name="premises"
              value={formData.premises || ''}
              onChange={handleChange}
            >
              <MenuItem value="owned">Owned</MenuItem>
              <MenuItem value="rented">Rented</MenuItem>
              <MenuItem value="leased">Leased</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="businessAddress"
            name="businessAddress"
            label="Shop / Business Address"
            fullWidth
            variant="standard"
            value={formData.businessAddress || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="businessHours"
            name="businessHours"
            label="Business Hours"
            fullWidth
            variant="standard"
            value={formData.businessHours || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="weeklyOff"
            name="weeklyOff"
            label="Weekly Off Day(s)"
            fullWidth
            variant="standard"
            value={formData.weeklyOff || ''}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
