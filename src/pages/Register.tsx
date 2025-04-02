import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Link,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { registerStart, registerSuccess, registerFailure } from '../store/slices/authSlice';

const RegisterContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f5f5f5',
  padding: theme.spacing(2),
}));

const RegisterPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 800,
  width: '100%',
  backgroundColor: '#ffffff',
  borderRadius: 12,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  color: '#000000',
}));

interface DateOfBirth {
  month: string;
  day: string;
  year: string;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: DateOfBirth;
  city: string;
  postcode: string;
  accountType: 'passenger' | 'driver';
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: {
      month: '',
      day: '',
      year: '',
    },
    city: '',
    postcode: '',
    accountType: 'passenger',
  });
  const [error, setError] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('dateOfBirth.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dateOfBirth: {
          ...prev.dateOfBirth,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      dispatch(registerStart());
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch(registerSuccess({
        user: {
          id: '1',
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phoneNumber: '',
          isVerified: false,
          rating: 0,
          emergencyContacts: [],
          accountType: formData.accountType,
        },
        token: 'mock-jwt-token',
      }));
      
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
      dispatch(registerFailure(err instanceof Error ? err.message : 'Registration failed'));
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  return (
    <RegisterContainer>
      <RegisterPaper>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 700 }}>
          Create Your Account
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <FormSection>
            <SectionTitle>Account Information</SectionTitle>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleTextChange}
                  required
                  helperText="This will be your display name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleTextChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleTextChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </FormSection>

          <FormSection>
            <SectionTitle>Personal Information</SectionTitle>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleTextChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleTextChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Date of Birth
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Month</InputLabel>
                      <Select
                        name="dateOfBirth.month"
                        value={formData.dateOfBirth.month}
                        onChange={handleSelectChange}
                        label="Month"
                      >
                        {months.map((month) => (
                          <MenuItem key={month} value={month}>
                            {month}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Day</InputLabel>
                      <Select
                        name="dateOfBirth.day"
                        value={formData.dateOfBirth.day}
                        onChange={handleSelectChange}
                        label="Day"
                      >
                        {days.map((day) => (
                          <MenuItem key={day} value={day}>
                            {day}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Year</InputLabel>
                      <Select
                        name="dateOfBirth.year"
                        value={formData.dateOfBirth.year}
                        onChange={handleSelectChange}
                        label="Year"
                      >
                        {years.map((year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </FormSection>

          <FormSection>
            <SectionTitle>Address</SectionTitle>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleTextChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleTextChange}
                  required
                />
              </Grid>
            </Grid>
          </FormSection>

          <FormSection>
            <SectionTitle>Account Type</SectionTitle>
            <FormControl fullWidth>
              <InputLabel>I want to</InputLabel>
              <Select
                name="accountType"
                value={formData.accountType}
                onChange={handleSelectChange}
                label="I want to"
              >
                <MenuItem value="passenger">Request Rides</MenuItem>
                <MenuItem value="driver">Offer Rides</MenuItem>
              </Select>
            </FormControl>
          </FormSection>

          <Box sx={{ mt: 4 }}>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              sx={{
                py: 1.5,
                backgroundColor: '#000000',
                '&:hover': {
                  backgroundColor: '#333333',
                },
              }}
            >
              Create Account
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{ color: 'primary.main', fontWeight: 600 }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </RegisterPaper>
    </RegisterContainer>
  );
};

export default Register; 