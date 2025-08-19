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
    name: { value: '', valid: false, touched: false, error: '' },
    email: { value: '', valid: false, touched: false, error: '' },
    password: { value: '', valid: false, touched: false, error: '' },
    role: { value: 'staff', valid: true, touched: false, error: '' },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [animateShake, setAnimateShake] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateName = (name) => {
    if (!name) return "Full name is required.";
    if (name.length < 2) return "Name must be at least 2 characters long.";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters long.";
    return "";
  };

  const validateRole = (role) => {
    if (!role) return "Role is required.";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = '';
    if (name === 'name') {
      error = validateName(value);
    } else if (name === 'email') {
      error = validateEmail(value);
    } else if (name === 'password') {
      error = validatePassword(value);
    } else if (name === 'role') {
      error = validateRole(value);
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

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const nameError = validateName(form.name.value);
    const emailError = validateEmail(form.email.value);
    const passwordError = validatePassword(form.password.value);
    const roleError = validateRole(form.role.value);

    setForm((prev) => ({
      ...prev,
      name: { ...prev.name, touched: true, error: nameError },
      email: { ...prev.email, touched: true, error: emailError },
      password: { ...prev.password, touched: true, error: passwordError },
      role: { ...prev.role, touched: true, error: roleError },
    }));

    if (nameError || emailError || passwordError || roleError) {
      setAnimateShake(true);
      setTimeout(() => setAnimateShake(false), 500);
      return;
    }

    try {
      setLoading(true);
      await signup(form.name.value, form.email.value, form.password.value, form.role.value);
      navigate('/login');
    } catch (error) {
      setSubmitError(error.message || 'Failed to create an account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleComprehensiveSignup = () => {
    navigate('/signup/comprehensive');
  };

  const isFormValid = form.name.valid && form.email.valid && form.password.valid && form.role.valid;

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
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={form.name.value}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  error={form.name.touched && !!form.name.error}
                  helperText={form.name.touched && form.name.error}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={form.email.value}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  error={form.email.touched && !!form.email.error}
                  helperText={form.email.touched && form.email.error}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={form.password.value}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  error={form.password.touched && !!form.password.error}
                  helperText={form.password.touched && form.password.error}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role"
                    name="role"
                    value={form.role.value}
                    label="Role"
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    error={form.role.touched && !!form.role.error}
                  >
                    <MenuItem value="staff">Staff</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
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
