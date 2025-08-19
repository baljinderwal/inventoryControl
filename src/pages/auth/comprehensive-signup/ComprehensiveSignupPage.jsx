import React, { useState } from 'react';
import { useAuth } from '../../../utils/AuthContext';
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper } from '@mui/material';
import Step1_BusinessOwnerDetails from './Step1_BusinessOwnerDetails';
import Step2_BusinessInfo from './Step2_BusinessInfo';
import Step3_RegistrationCompliance from './Step3_RegistrationCompliance';
import Step4_BankingPayment from './Step4_BankingPayment';
import Step5_InventoryOperations from './Step5_InventoryOperations';
import Step6_DigitalPresence from './Step6_DigitalPresence';
import Step7_EmergencySupport from './Step7_EmergencySupport';
import Step8_PreferencesSettings from './Step8_PreferencesSettings';

const steps = ['Owner Information', 'Business Information', 'Registration & Compliance', 'Banking & Payment', 'Inventory & Operations', 'Digital Presence', 'Emergency Contacts', 'Preferences & Settings'];

function getStepContent(step, formData, handleChange, errors) {
  switch (step) {
    case 0:
      return <Step1_BusinessOwnerDetails formData={formData} handleChange={handleChange} errors={errors} />;
    case 1:
      return <Step2_BusinessInfo formData={formData} handleChange={handleChange} errors={errors} />;
    case 2:
      return <Step3_RegistrationCompliance formData={formData} handleChange={handleChange} errors={errors} />;
    case 3:
      return <Step4_BankingPayment formData={formData} handleChange={handleChange} errors={errors} />;
    case 4:
      return <Step5_InventoryOperations formData={formData} handleChange={handleChange} errors={errors} />;
    case 5:
      return <Step6_DigitalPresence formData={formData} handleChange={handleChange} errors={errors} />;
    case 6:
      return <Step7_EmergencySupport formData={formData} handleChange={handleChange} errors={errors} />;
    case 7:
      return <Step8_PreferencesSettings formData={formData} handleChange={handleChange} errors={errors} />;
    default:
      return 'Unknown step';
  }
}

export default function ComprehensiveSignupPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const { comprehensiveSignup } = useAuth();
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required';
    if (!formData.aadhaarNumber) newErrors.aadhaarNumber = 'Aadhaar Number is required';
    if (!formData.panNumber) newErrors.panNumber = 'PAN Number is required';
    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile Number is required';
    if (!formData.email) newErrors.email = 'Email Address is required';
    if (!formData.residentialAddress) newErrors.residentialAddress = 'Residential Address is required';
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.businessName) newErrors.businessName = 'Business Name is required';
    if (!formData.businessType) newErrors.businessType = 'Type of Business is required';
    return newErrors;
  };

  const handleNext = () => {
    let newErrors = {};
    if (activeStep === 0) {
      newErrors = validateStep1();
    } else if (activeStep === 1) {
      newErrors = validateStep2();
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      if (activeStep === steps.length - 1) {
        comprehensiveSignup(formData);
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : (type === 'checkbox' ? checked : value)
    });
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 2 }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: '800px', p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Comprehensive Signup
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 4 }}>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }} align="center">
                All steps completed - you&apos;re finished
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1, mb: 2 }}>
                {getStepContent(activeStep, formData, handleChange, errors)}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleNext} variant="contained">
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
