import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  DirectionsCar as CarIcon,
  Map as MapIcon,
  Person as PersonIcon,
  Warning as EmergencyIcon,
} from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Request a Ride',
      description: 'Find a ride to your destination quickly and safely',
      icon: <CarIcon sx={{ fontSize: 40, color: '#000000' }} />,
      path: '/ride-request'
    },
    {
      title: 'Live Map',
      description: 'Track your ride in real-time on our interactive map',
      icon: <MapIcon sx={{ fontSize: 40, color: '#000000' }} />,
      path: '/map',
    },
    {
      title: 'Profile',
      description: 'Manage your account and ride history',
      icon: <PersonIcon sx={{ fontSize: 40, color: '#000000' }} />,
      path: '/profile',
    },
    {
      title: 'Emergency',
      description: 'Quick access to emergency contacts and help',
      icon: <EmergencyIcon sx={{ fontSize: 40, color: '#000000' }} />,
      path: '/emergency',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#ffffff',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 8 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: '#000000',
            }}
          >
            Welcome to HytchHykrr
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: '#666666',
              maxWidth: '600px',
              mx: 'auto',
              mb: 4,
            }}
          >
            Your safe and reliable ride-sharing platform. Connect with trusted drivers and passengers in your area.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/map')}
            sx={{
              px: 4,
              py: 1.5,
              bgcolor: '#000000',
              color: '#ffffff',
              '&:hover': {
                bgcolor: '#333333',
              },
            }}
          >
            Request a Ride
          </Button>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: '#000000',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  },
                }}
                onClick={() => navigate(feature.path)}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    borderRadius: '50%',
                    bgcolor: '#f5f5f5',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: '#000000',
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666666',
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 