import React from 'react';
import { TextField, Button, Box, Typography, Grid } from '@mui/material';

export default function Step4_BankingPayment({ formData, handleChange, errors = {} }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Banking & Payment Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="bankName"
            name="bankName"
            label="Bank Name"
            fullWidth
            variant="standard"
            value={formData.bankName || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="branchName"
            name="branchName"
            label="Branch Name"
            fullWidth
            variant="standard"
            value={formData.branchName || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="accountHolderName"
            name="accountHolderName"
            label="Account Holder Name"
            fullWidth
            variant="standard"
            value={formData.accountHolderName || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="accountNumber"
            name="accountNumber"
            label="Account Number"
            fullWidth
            variant="standard"
            value={formData.accountNumber || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="ifscCode"
            name="ifscCode"
            label="IFSC Code"
            fullWidth
            variant="standard"
            value={formData.ifscCode || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" component="label">
            Upload Cancelled Cheque
            <input type="file" hidden />
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="upiId"
            name="upiId"
            label="UPI ID"
            fullWidth
            variant="standard"
            value={formData.upiId || ''}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" component="label">
            Upload Payment QR
            <input type="file" hidden />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="paymentMethods"
            name="paymentMethods"
            label="Preferred Payment Methods"
            fullWidth
            variant="standard"
            value={formData.paymentMethods || ''}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
