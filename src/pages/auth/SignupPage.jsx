import React, { useState, useEffect } from 'react';
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
  Link,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircleOutline,
  PersonOutline,
} from '@mui/icons-material';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const SignupPage = () => {
  const [form, setForm] = useState({
    name: { value: '', valid: false, touched: false, error: '' },
    email: { value: '', valid: false, touched: false, error: '' },
    password: { value: '', valid: false, touched: false, error: '' },
    confirmPassword: { value: '', valid: false, touched: false, error: '' },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [animateShake, setAnimateShake] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateName = (name) => {
    if (!name) return "Name is required.";
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
    // Example: require uppercase, lowercase, and a number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) return "Password must include uppercase, lowercase, and a number.";
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Please confirm your password.";
    if (confirmPassword !== password) return "Passwords do not match.";
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
      // Also re-validate confirm password if password changes
      if (form.confirmPassword.value) {
        const confirmError = validateConfirmPassword(form.confirmPassword.value, value);
        setForm((prev) => ({
          ...prev,
          confirmPassword: { ...prev.confirmPassword, error: confirmError, valid: !confirmError },
        }));
      }
    } else if (name === 'confirmPassword') {
      error = validateConfirmPassword(value, form.password.value);
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

    const nameError = validateName(form.name.value);
    const emailError = validateEmail(form.email.value);
    const passwordError = validatePassword(form.password.value);
    const confirmPasswordError = validateConfirmPassword(form.confirmPassword.value, form.password.value);

    setForm((prev) => ({
      ...prev,
      name: { ...prev.name, touched: true, error: nameError },
      email: { ...prev.email, touched: true, error: emailError },
      password: { ...prev.password, touched: true, error: passwordError },
      confirmPassword: { ...prev.confirmPassword, touched: true, error: confirmPasswordError },
    }));

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setAnimateShake(true);
      setTimeout(() => setAnimateShake(false), 500);
      return;
    }

    try {
      setLoading(true);
      await signup(form.name.value, form.email.value, form.password.value);
      navigate('/login', { state: { successMessage: 'Signup successful! Please log in.' } });
    } catch (error) {
      console.error("Signup failed:", error);
      setSubmitError(error.message || 'An error occurred during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = form.name.valid && form.email.valid && form.password.valid && form.confirmPassword.valid;

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Join Us
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 400, textAlign: 'center' }}>
            Create your account to start managing your inventory like a pro.
          </Typography>
        </motion.div>
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
          <motion.div
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
                Create Your Account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                Fill out the form to get started.
              </Typography>

              <AnimatePresence>
                {submitError && (
                  <motion.div
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
                  </motion.div>
                )}
              </AnimatePresence>

              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <AnimatePresence>
                          {form.name.touched && form.name.valid && (
                            <motion.div initial={shouldReduceMotion ? {} : { scale: 0 }} animate={{ scale: 1 }} exit={shouldReduceMotion ? {} : { scale: 0 }}>
                              <CheckCircleOutline color="success" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </InputAdornment>
                    ),
                  }}
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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <AnimatePresence>
                          {form.email.touched && form.email.valid && (
                            <motion.div initial={shouldReduceMotion ? {} : { scale: 0 }} animate={{ scale: 1 }} exit={shouldReduceMotion ? {} : { scale: 0 }}>
                              <CheckCircleOutline color="success" />
                            </motion.div>
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
                  autoComplete="new-password"
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
                <TextField
                  margin="normal"
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={form.confirmPassword.value}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  error={form.confirmPassword.touched && !!form.confirmPassword.error}
                  helperText={form.confirmPassword.touched && form.confirmPassword.error}
                   InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <motion.div whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
                    disabled={loading || !isFormValid}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                  </Button>
                </motion.div>

                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/login" variant="body2">
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default SignupPage;
