import React from 'react';
import { Box, Button, Container, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f5f5f5',
  padding: theme.spacing(4),
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 800,
  width: '100%',
  backgroundColor: '#ffffff',
  borderRadius: 12,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <HeroSection>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <ContentPaper>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Safe and Reliable Hitchhiking
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Connect with trusted drivers and passengers in your area. Experience a new way of traveling.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/map')}
                  sx={{
                    py: 2,
                    px: 4,
                    backgroundColor: '#000000',
                    '&:hover': {
                      backgroundColor: '#333333',
                    },
                  }}
                >
                  Find a Ride
                </Button>
              </Box>
            </ContentPaper>
          </Grid>
        </Grid>
      </Container>
    </HeroSection>
  );
};

export default Home; 