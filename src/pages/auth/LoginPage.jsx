import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
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
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircleOutline,
  Google,
  VpnKey,
} from '@mui/icons-material';
import { motion as Motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const LoginPage = () => {
  const [form, setForm] = useState({
    email: { value: '', valid: false, touched: false, error: '' },
    password: { value: '', valid: false, touched: false, error: '' },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [animateShake, setAnimateShake] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let error = '';
    if (name === 'email') {
      error = validateEmail(value);
    } else if (name === 'password') {
      error = validatePassword(value);
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

  const checkCapsLock = (e) => {
    if (e.getModifierState) {
      setIsCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', checkCapsLock);
    window.addEventListener('keyup', checkCapsLock);
    return () => {
      window.removeEventListener('keydown', checkCapsLock);
      window.removeEventListener('keyup', checkCapsLock);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const emailError = validateEmail(form.email.value);
    const passwordError = validatePassword(form.password.value);

    setForm((prev) => ({
      ...prev,
      email: { ...prev.email, touched: true, error: emailError },
      password: { ...prev.password, touched: true, error: passwordError },
    }));

    if (emailError || passwordError) {
      setAnimateShake(true);
      setTimeout(() => setAnimateShake(false), 500);
      return;
    }

    try {
      setLoading(true);
      await login(form.email.value, form.password.value);
      navigate(from, { replace: true });
    } catch (error) {
      setSubmitError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = form.email.valid && form.password.valid;

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
      {/* Left Side: Hero Image */}
      <Box
        sx={{
          flex: 1,
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1507842217343-583bb7270b66)',
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
            Your productivity starts here — secure, fast, and beautifully simple.
          </Typography>
        </Motion.div>
      </Box>

      {/* Right Side: Login Form */}
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
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                Sign in to access your dashboard.
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

              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={form.email.value}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  error={form.email.touched && !!form.email.error}
                  helperText={form.email.touched && form.email.error}
                  FormHelperTextProps={{ id: 'email-error-text' }}
                  InputProps={{
                    'aria-describedby': 'email-error-text',
                    endAdornment: (
                      <InputAdornment position="end">
                        <AnimatePresence>
                          {form.email.touched && form.email.valid && (
                            <Motion.div initial={shouldReduceMotion ? {} : { scale: 0 }} animate={{ scale: 1 }} exit={shouldReduceMotion ? {} : { scale: 0 }}>
                              <CheckCircleOutline color="success" />
                            </Motion.div>
                          )}
                        </AnimatePresence>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={form.password.value}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onKeyUp={checkCapsLock}
                  onKeyDown={checkCapsLock}
                  error={form.password.touched && !!form.password.error}
                  helperText={
                    (form.password.touched && form.password.error) ||
                    (isCapsLockOn ? 'Warning: Caps Lock is on' : '')
                  }
                  FormHelperTextProps={{ id: 'password-error-text' }}
                  InputProps={{
                    'aria-describedby': 'password-error-text',
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

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 1 }}>
                  <Button size="small" sx={{ textTransform: 'none' }}>
                    Forgot password?
                  </Button>
                </Box>

                <Motion.div whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      mt: 2,
                      mb: 2,
                      py: 1.5,
                      fontWeight: 'bold',
                      '&:disabled': {
                        background: '#e0e0e0'
                      }
                    }}
                    disabled={loading || !isFormValid}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In'}
                  </Button>
                </Motion.div>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>

                <Motion.div whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Google />}
                    sx={{
                      mb: 1,
                      textTransform: 'none',
                      borderColor: '#ddd',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: '#ccc',
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    Sign in with Google
                  </Button>
                </Motion.div>
                <Motion.div whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<VpnKey />}
                    sx={{
                      mb: 1,
                      textTransform: 'none',
                      borderColor: '#ddd',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: '#ccc',
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    Sign in with a passkey
                  </Button>
                </Motion.div>

                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                  Don't have an account?{' '}
                  <Button component={RouterLink} to="/signup" size="small" sx={{ textTransform: 'none' }}>
                    Sign Up
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

export default LoginPage;
