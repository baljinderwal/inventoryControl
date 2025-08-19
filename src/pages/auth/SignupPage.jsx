import React, { useState } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Button,
  TextField,
  Container,
  Paper,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircleOutline,
  Google,
  GitHub,
  Apple,
  LockOutlined
} from '@mui/icons-material';
import { motion as Motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const SignupPage = () => {
  const [form, setForm] = useState({
    businessName: { value: '', valid: false, touched: false, error: '' },
    mobile: { value: '', valid: false, touched: false, error: '' },
    otp: { value: '', valid: false, touched: false, error: '' },
    category: { value: '', valid: true, touched: false, error: '' },
  });
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [animateShake, setAnimateShake] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateBusinessName = (name) => {
    if (!name) return "Business name is required.";
    if (name.length < 2) return "Business name must be at least 2 characters long.";
    return "";
  };

  const validateMobile = (mobile) => {
    if (!mobile) return "Mobile number is required.";
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) return "Please enter a valid 10-digit mobile number.";
    return "";
  };

  const validateOtp = (otp) => {
    if (!otp) return "OTP is required.";
    if (otp.length !== 6) return "OTP must be 6 digits.";
    return "";
  };
  
  const validateCategory = (category) => {
    if (!category) return "Category is required.";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = '';
    if (name === 'businessName') {
      error = validateBusinessName(value);
    } else if (name === 'mobile') {
      error = validateMobile(value);
    } else if (name === 'otp') {
      error = validateOtp(value);
    } else if (name === 'category') {
        error = validateCategory(value);
    }
    setForm((prev) => ({
      ...prev,
      [name]: { ...prev[name], value, error, valid: !error },
    }));
  };

  const handleInputBlur = (e) => {
    const { name } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: { ...prev[name], touched: true },
    }));
  };

  const handleSendOtp = () => {
    // In a real app, this would trigger a backend call to send an OTP
    console.log('Sending OTP to', form.mobile.value);
    alert('OTP sent to your mobile number (not really)!');
  };

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const businessNameError = validateBusinessName(form.businessName.value);
    const mobileError = validateMobile(form.mobile.value);
    const otpError = validateOtp(form.otp.value);
    const categoryError = validateCategory(form.category.value);

    setForm((prev) => ({
      ...prev,
      businessName: { ...prev.businessName, touched: true, error: businessNameError },
      mobile: { ...prev.mobile, touched: true, error: mobileError },
      otp: { ...prev.otp, touched: true, error: otpError },
      category: { ...prev.category, touched: true, error: categoryError },
    }));

    if (businessNameError || mobileError || otpError || categoryError) {
      setAnimateShake(true);
      setTimeout(() => setAnimateShake(false), 500);
      return;
    }

    try {
      setLoading(true);
      // Assuming signup can handle these fields. This might need adjustment.
      await signup(form.businessName.value, form.mobile.value, form.category.value);
      navigate('/dashboard');
    } catch (error) {
      setSubmitError(error.message || 'Failed to create an account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleComprehensiveSignup = () => {
    navigate('/signup/comprehensive');
  };

  const isFormValid = form.businessName.valid && form.mobile.valid && form.otp.valid && form.category.valid;

  const formVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 },
    },
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Side: Illustration */}
      <Box
        sx={{
          flex: 1,
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1554333394-339a9559a235)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          p: 4,
        }}
      >
        <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            MyBrand
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 400, textAlign: 'center' }}>
            Start your journey with us. Create your account to unlock exclusive features.
          </Typography>
        </Motion.div>
      </Box>

      {/* Right Side: Signup Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Container component="main" maxWidth="xs">
          <Motion.div
            variants={formVariants}
            initial={shouldReduceMotion ? 'visible' : 'hidden'}
            animate={animateShake ? 'shake' : 'visible'}
          >
            <Paper
              elevation={6}
              sx={{
                p: 4,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                Create your Account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                Let's get you started!
              </Typography>

              <AnimatePresence>
                {submitError && (
                  <Motion.div
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
                    style={{ width: '100%', marginBottom: '16px' }}
                  >
                    <Typography
                      color="error"
                      variant="body2"
                      sx={{
                        textAlign: 'center',
                        background: 'rgba(211, 47, 47, 0.1)',
                        p: 1,
                        borderRadius: 1,
                      }}
                    >
                      {submitError}
                    </Typography>
                  </Motion.div>
                )}
              </AnimatePresence>

              <Box component="form" onSubmit={handleQuickSubmit} sx={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="businessName"
                  label="Business Name"
                  name="businessName"
                  autoComplete="organization"
                  autoFocus
                  value={form.businessName.value}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  error={form.businessName.touched && !!form.businessName.error}
                  helperText={form.businessName.touched && form.businessName.error}
                />

                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={8}>
                    <TextField
                      margin="normal"
                      fullWidth
                      id="mobile"
                      label="Mobile Number"
                      name="mobile"
                      autoComplete="tel"
                      value={form.mobile.value}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      error={form.mobile.touched && !!form.mobile.error}
                      helperText={form.mobile.touched && form.mobile.error}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleSendOtp}
                      disabled={!form.mobile.valid}
                    >
                      Send OTP
                    </Button>
                  </Grid>
                </Grid>

                <TextField
                  margin="normal"
                  fullWidth
                  name="otp"
                  label="OTP"
                  type="number"
                  id="otp"
                  autoComplete="one-time-code"
                  value={form.otp.value}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  error={form.otp.touched && !!form.otp.error}
                  helperText={form.otp.touched && form.otp.error}
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel id="category-select-label">Business Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category"
                    name="category"
                    value={form.category.value}
                    label="Business Category"
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    error={form.category.touched && !!form.category.error}
                  >
                    <MenuItem value="retail">Retail</MenuItem>
                    <MenuItem value="wholesale">Wholesale</MenuItem>
                    <MenuItem value="service">Service</MenuItem>
                    <MenuItem value="manufacturing">Manufacturing</MenuItem>
                  </Select>
                </FormControl>

                <Motion.div whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 3, mb: 1, py: 1.5, fontWeight: 'bold' }}
                    disabled={loading || !isFormValid}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Quick Signup'}
                  </Button>
                </Motion.div>

                <Motion.div whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    sx={{ mt: 1, mb: 2, py: 1.5, fontWeight: 'bold' }}
                    onClick={handleComprehensiveSignup}
                  >
                    Comprehensive Signup
                  </Button>
                </Motion.div>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        By creating an account, you agree to our<br/>
                        <RouterLink to="/terms" style={{ color: 'inherit' }}>Terms of Service</RouterLink> & <RouterLink to="/privacy" style={{ color: 'inherit' }}>Privacy Policy</RouterLink>.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LockOutlined sx={{ fontSize: '1rem', mr: 0.5 }} />
                        Your data is secure and encrypted.
                    </Typography>
                </Box>

                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                  Already have an account?{' '}
                  <Button component={RouterLink} to="/login" size="small" sx={{ textTransform: 'none' }}>
                    Sign In
                  </Button>
                </Typography>
              </Box>
            </Paper>
          </Motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default SignupPage;
