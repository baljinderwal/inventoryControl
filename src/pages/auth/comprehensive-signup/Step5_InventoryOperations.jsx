import React from 'react';
import { TextField, Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function Step5_InventoryOperations({ formData, handleChange, errors = {} }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Inventory & Operations (Optional)
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            id="avgCustomers"
            name="avgCustomers"
            label="Daily Average Customers"
            fullWidth
            variant="standard"
            value={formData.avgCustomers || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="standard">
            <InputLabel id="turnover-label">Monthly Turnover</InputLabel>
            <Select
              labelId="turnover-label"
              id="turnover"
              name="turnover"
              value={formData.turnover || ''}
              onChange={handleChange}
            >
              <MenuItem value="0-1">₹0–1 lakh</MenuItem>
              <MenuItem value="1-5">₹1–5 lakh</MenuItem>
              <MenuItem value="5+">₹5+ lakh</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="supplierDetails"
            name="supplierDetails"
            label="Supplier Details"
            fullWidth
            multiline
            rows={4}
            variant="standard"
            value={formData.supplierDetails || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth variant="standard">
            <InputLabel id="stock-management-label">Stock Management Preference</InputLabel>
            <Select
              labelId="stock-management-label"
              id="stockManagement"
              name="stockManagement"
              value={formData.stockManagement || ''}
              onChange={handleChange}
            >
              <MenuItem value="manual">Manual</MenuItem>
              <MenuItem value="software">Software</MenuItem>
              <MenuItem value="pos">POS System</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}
