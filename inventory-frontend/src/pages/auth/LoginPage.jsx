import React, { useState } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
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
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in both fields.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Side: Hero Image */}
      <Box
        sx={{
          flex: 1,
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1507842217343-583bb7270b66)',
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
        <div>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            MyBrand
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 400, textAlign: 'center' }}>
            Your productivity starts here — secure, fast, and beautifully simple.
          </Typography>
        </div>
      </Box>

      {/* Right Side: Login Form */}
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(to right, #667eea, #764ba2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Container component="main" maxWidth="xs">
          <div>
            <Paper
              elevation={6}
              sx={{
                p: 4,
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              <LockOutlined sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
              <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Welcome Back
              </Typography>
              {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        boxShadow: '0 0 5px rgba(102,126,234,0.5)',
                      },
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        boxShadow: '0 0 5px rgba(102,126,234,0.5)',
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    background: 'linear-gradient(to right, #667eea, #764ba2)',
                    '&:hover': {
                      background: 'linear-gradient(to right, #5a67d8, #6b46c1)',
                    },
                  }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In'}
                </Button>
                <Typography variant="body2" align="center" sx={{ mt: 2, color: 'text.secondary' }}>
                  Forgot your password?
                </Typography>
              </Box>
            </Paper>
          </div>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage;
