import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { Box, Typography, Paper, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // In a real app, you would fetch the user's profile data from the backend
    // For now, we'll use the data from the auth context
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile.');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Grid container spacing={3}>
          {/* Owner / Personal Information */}
          <Grid item xs={12}>
            <Typography variant="h6">Owner / Personal Information</Typography>
          </Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name" name="fullName" value={formData.fullName || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Father's / Spouse's Name" name="fatherSpouseName" value={formData.fatherSpouseName || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Date of Birth" name="dob" type="date" value={formData.dob || ''} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
          <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Gender</InputLabel><Select name="gender" value={formData.gender || ''} onChange={handleChange}><MenuItem value="male">Male</MenuItem><MenuItem value="female">Female</MenuItem><MenuItem value="other">Other</MenuItem></Select></FormControl></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Aadhaar Number" name="aadhaarNumber" value={formData.aadhaarNumber || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="PAN Number" name="panNumber" value={formData.panNumber || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Mobile Number" name="mobileNumber" value={formData.mobileNumber || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Alternate Mobile Number" name="alternateMobileNumber" value={formData.alternateMobileNumber || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Email Address" name="email" value={formData.email || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Residential Address" name="residentialAddress" value={formData.residentialAddress || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Permanent Address" name="permanentAddress" value={formData.permanentAddress || ''} onChange={handleChange} /></Grid>

          {/* Business Information */}
          <Grid item xs={12}><Typography variant="h6">Business Information</Typography></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Business / Shop Name" name="businessName" value={formData.businessName || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Type of Business</InputLabel><Select name="businessType" value={formData.businessType || ''} onChange={handleChange}><MenuItem value="sole_proprietorship">Sole Proprietorship</MenuItem><MenuItem value="partnership">Partnership</MenuItem><MenuItem value="private_limited">Private Limited</MenuItem></Select></FormControl></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Business Category" name="businessCategory" value={formData.businessCategory || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Products / Services Offered" name="productsServices" value={formData.productsServices || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Business Start Date" name="businessStartDate" type="date" value={formData.businessStartDate || ''} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
          <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Number of Employees</InputLabel><Select name="employees" value={formData.employees || ''} onChange={handleChange}><MenuItem value="self-employed">Self-employed</MenuItem><MenuItem value="1-5">1–5</MenuItem><MenuItem value="6-10">6–10</MenuItem><MenuItem value="more">More</MenuItem></Select></FormControl></Grid>
          <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Nature of Premises</InputLabel><Select name="premises" value={formData.premises || ''} onChange={handleChange}><MenuItem value="owned">Owned</MenuItem><MenuItem value="rented">Rented</MenuItem><MenuItem value="leased">Leased</MenuItem></Select></FormControl></Grid>
          <Grid item xs={12}><TextField fullWidth label="Shop / Business Address" name="businessAddress" value={formData.businessAddress || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Business Hours" name="businessHours" value={formData.businessHours || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Weekly Off Day(s)" name="weeklyOff" value={formData.weeklyOff || ''} onChange={handleChange} /></Grid>

          {/* Business Registration & Compliance */}
          <Grid item xs={12}><Typography variant="h6">Business Registration & Compliance</Typography></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="MSME / Udyam Registration Number" name="msmeNumber" value={formData.msmeNumber || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="GST Number" name="gstNumber" value={formData.gstNumber || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Trade License / Shop Establishment Certificate" name="tradeLicense" value={formData.tradeLicense || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="FSSAI License" name="fssaiLicense" value={formData.fssaiLicense || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Import Export Code (IEC)" name="iec" value={formData.iec || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Business PAN Number" name="businessPan" value={formData.businessPan || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="TAN Number" name="tanNumber" value={formData.tanNumber || ''} onChange={handleChange} /></Grid>

          {/* Banking & Payment Details */}
          <Grid item xs={12}><Typography variant="h6">Banking & Payment Details</Typography></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Bank Name" name="bankName" value={formData.bankName || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Branch Name" name="branchName" value={formData.branchName || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Account Holder Name" name="accountHolderName" value={formData.accountHolderName || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Account Number" name="accountNumber" value={formData.accountNumber || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="IFSC Code" name="ifscCode" value={formData.ifscCode || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="UPI ID" name="upiId" value={formData.upiId || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Preferred Payment Methods" name="paymentMethods" value={formData.paymentMethods || ''} onChange={handleChange} /></Grid>

          {/* Inventory & Operations */}
          <Grid item xs={12}><Typography variant="h6">Inventory & Operations</Typography></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Daily Average Customers" name="avgCustomers" value={formData.avgCustomers || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Monthly Turnover</InputLabel><Select name="turnover" value={formData.turnover || ''} onChange={handleChange}><MenuItem value="0-1">₹0–1 lakh</MenuItem><MenuItem value="1-5">₹1–5 lakh</MenuItem><MenuItem value="5+">₹5+ lakh</MenuItem></Select></FormControl></Grid>
          <Grid item xs={12}><TextField fullWidth label="Supplier Details" name="supplierDetails" value={formData.supplierDetails || ''} onChange={handleChange} multiline rows={4} /></Grid>
          <Grid item xs={12}><FormControl fullWidth><InputLabel>Stock Management Preference</InputLabel><Select name="stockManagement" value={formData.stockManagement || ''} onChange={handleChange}><MenuItem value="manual">Manual</MenuItem><MenuItem value="software">Software</MenuItem><MenuItem value="pos">POS System</MenuItem></Select></FormControl></Grid>

          {/* Digital Presence */}
          <Grid item xs={12}><Typography variant="h6">Digital Presence</Typography></Grid>
          <Grid item xs={12}><TextField fullWidth label="Website URL" name="website" value={formData.website || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Social Media Handles" name="socialMedia" value={formData.socialMedia || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Online Store Links" name="onlineStore" value={formData.onlineStore || ''} onChange={handleChange} /></Grid>

          {/* Emergency / Support Contacts */}
          <Grid item xs={12}><Typography variant="h6">Emergency / Support Contacts</Typography></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Alternate Contact Person Name" name="contactName" value={formData.contactName || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Relationship" name="relationship" value={formData.relationship || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Contact Number" name="contactNumber" value={formData.contactNumber || ''} onChange={handleChange} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Email" name="contactEmail" value={formData.contactEmail || ''} onChange={handleChange} /></Grid>

          {/* Preferences & Settings */}
          <Grid item xs={12}><Typography variant="h6">Preferences & Settings</Typography></Grid>
          <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Preferred Language</InputLabel><Select name="language" value={formData.language || ''} onChange={handleChange}><MenuItem value="en">English</MenuItem><MenuItem value="hi">Hindi</MenuItem><MenuItem value="pa">Punjabi</MenuItem></Select></FormControl></Grid>
          <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Communication Mode</InputLabel><Select name="communicationMode" value={formData.communicationMode || ''} onChange={handleChange}><MenuItem value="sms">SMS</MenuItem><MenuItem value="whatsapp">WhatsApp</MenuItem><MenuItem value="email">Email</MenuItem></Select></FormControl></Grid>
          <Grid item xs={12}><FormControlLabel control={<Checkbox name="terms" checked={formData.terms || false} onChange={handleChange} />} label="Agree to Terms & Conditions" /></Grid>
          <Grid item xs={12}><FormControlLabel control={<Checkbox name="marketing" checked={formData.marketing || false} onChange={handleChange} />} label="Allow Marketing & Promotions (optional)" /></Grid>

          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSave}>Save</Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
