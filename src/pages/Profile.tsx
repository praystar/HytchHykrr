import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Star as StarIcon,
  LocalTaxi as RideIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
      });
    }
  }, [user]);

  const stats = [
    { label: 'Total Rides', value: '24', icon: <RideIcon sx={{ color: 'primary.main' }} /> },
    { label: 'Rating', value: '4.8', icon: <StarIcon sx={{ color: 'primary.main' }} /> },
    { label: 'Ride History', value: '12', icon: <HistoryIcon sx={{ color: 'primary.main' }} /> },
  ];

  const recentRides = [
    { date: '2024-03-15', from: 'Downtown', to: 'Airport', rating: 5, price: '₹250' },
    { date: '2024-03-10', from: 'University', to: 'Shopping Mall', rating: 4, price: '₹200' },
    { date: '2024-03-05', from: 'Home', to: 'Work', rating: 5, price: '₹300' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the changes to your backend
  };

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6">Please sign in to view your profile</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#ffffff',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Profile Information */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid #e5e5e5',
                borderRadius: 2,
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'primary.main',
                  }}
                >
                  {formData.name.charAt(0)}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {formData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Member since March 2024
                </Typography>
              </Box>

              {isEditing ? (
                <Box component="form" sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Name"
                    value={formData.name}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    name="phone"
                    label="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    name="location"
                    label="Location"
                    value={formData.location}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                      bgcolor: '#000000',
                      '&:hover': { bgcolor: '#333333' },
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              ) : (
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Email" secondary={formData.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Phone" secondary={formData.phone || 'Not provided'} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon />
                    </ListItemIcon>
                    <ListItemText primary="Location" secondary={formData.location || 'Not provided'} />
                  </ListItem>
                </List>
              )}

              {!isEditing && (
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{ mt: 2 }}
                >
                  Edit Profile
                </Button>
              )}
            </Paper>
          </Grid>

          {/* Statistics and Ride History */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid #e5e5e5',
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Statistics
              </Typography>
              <Grid container spacing={2}>
                {stats.map((stat) => (
                  <Grid item xs={12} sm={4} key={stat.label}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        border: '1px solid #e5e5e5',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          borderColor: '#000000',
                        },
                      }}
                    >
                      <Box sx={{ mb: 1 }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h4" gutterBottom>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid #e5e5e5',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Recent Rides
              </Typography>
              <List>
                {recentRides.map((ride, index) => (
                  <Box key={index}>
                    <ListItem
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.04)',
                        },
                      }}
                    >
                      <ListItemIcon>
                        <RideIcon sx={{ color: 'primary.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${ride.from} → ${ride.to}`}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">{ride.date}</Typography>
                            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                              {ride.price}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StarIcon sx={{ color: '#F59E0B', mr: 0.5 }} />
                        <Typography>{ride.rating}</Typography>
                      </Box>
                    </ListItem>
                    {index < recentRides.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile; 