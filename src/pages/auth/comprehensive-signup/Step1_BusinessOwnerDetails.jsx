import React from 'react';
import { TextField, Button, Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function Step1_BusinessOwnerDetails({ formData, handleChange, errors = {} }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Owner / Personal Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="fullName"
            name="fullName"
            label="Full Name (as per Aadhaar/PAN)"
            fullWidth
            autoComplete="name"
            variant="standard"
            value={formData.fullName || ''}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="fatherSpouseName"
            name="fatherSpouseName"
            label="Father’s / Spouse’s Name"
            fullWidth
            variant="standard"
            value={formData.fatherSpouseName || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="dob"
            name="dob"
            label="Date of Birth"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            variant="standard"
            value={formData.dob || ''}
            onChange={handleChange}
            error={!!errors.dob}
            helperText={errors.dob}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="standard">
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="aadhaarNumber"
            name="aadhaarNumber"
            label="Aadhaar Number"
            fullWidth
            variant="standard"
            value={formData.aadhaarNumber || ''}
            onChange={handleChange}
            error={!!errors.aadhaarNumber}
            helperText={errors.aadhaarNumber}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" component="label">
            Upload Aadhaar
            <input type="file" hidden name="aadhaarFile" onChange={handleChange} />
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="panNumber"
            name="panNumber"
            label="PAN Number"
            fullWidth
            variant="standard"
            value={formData.panNumber || ''}
            onChange={handleChange}
            error={!!errors.panNumber}
            helperText={errors.panNumber}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" component="label">
            Upload PAN
            <input type="file" hidden name="panFile" onChange={handleChange} />
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="mobileNumber"
            name="mobileNumber"
            label="Mobile Number"
            fullWidth
            variant="standard"
            value={formData.mobileNumber || ''}
            onChange={handleChange}
            error={!!errors.mobileNumber}
            helperText={errors.mobileNumber}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="alternateMobileNumber"
            name="alternateMobileNumber"
            label="Alternate Mobile Number"
            fullWidth
            variant="standard"
            value={formData.alternateMobileNumber || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="email"
            name="email"
            label="Email Address"
            fullWidth
            autoComplete="email"
            variant="standard"
            value={formData.email || ''}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="residentialAddress"
            name="residentialAddress"
            label="Residential Address"
            fullWidth
            variant="standard"
            value={formData.residentialAddress || ''}
            onChange={handleChange}
            error={!!errors.residentialAddress}
            helperText={errors.residentialAddress}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="permanentAddress"
            name="permanentAddress"
            label="Permanent Address (if different)"
            fullWidth
            variant="standard"
            value={formData.permanentAddress || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" component="label">
            Upload Photograph
            <input type="file" hidden name="photoFile" onChange={handleChange} />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
