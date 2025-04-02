import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Warning as EmergencyIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Timer as TimerIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface Location {
  lat: number;
  lng: number;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

const Emergency = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [location, setLocation] = useState<Location | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [newContact, setNewContact] = useState<EmergencyContact>({
    name: '',
    phone: '',
    relationship: '',
  });
  const [countdown, setCountdown] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setError('Unable to get your location. Please enable location services.');
          console.error('Error getting location:', error);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSOS = async () => {
    if (!location || !user) {
      setError('Location or user information is missing.');
      return;
    }

    setIsSending(true);
    setCountdown(5);
    setError(null);

    try {
      // Simulate API call to send emergency alerts
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Send alerts to emergency contacts
      const message = `EMERGENCY ALERT: ${user.name} has triggered an SOS signal.
Location: https://www.google.com/maps?q=${location.lat},${location.lng}
Please contact emergency services if needed.`;

      // In a real app, this would send SMS/email to emergency contacts
      console.log('Sending emergency alerts:', message);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      setError('Failed to send emergency alerts. Please try again.');
      console.error('Error sending emergency alerts:', error);
    } finally {
      setIsSending(false);
      setCountdown(0);
    }
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      setError('Please fill in all contact information.');
      return;
    }

    // In a real app, this would add the contact to the user's emergency contacts
    console.log('Adding emergency contact:', newContact);
    setOpenContactDialog(false);
    setNewContact({ name: '', phone: '', relationship: '' });
  };

  if (error) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Emergency SOS
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              In case of emergency, press the SOS button to alert your emergency contacts and authorities.
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="error"
              size="large"
              startIcon={<EmergencyIcon />}
              onClick={handleSOS}
              disabled={isSending || !location}
              sx={{ mb: 2 }}
            >
              {isSending ? `Sending SOS... ${countdown}s` : 'Send SOS Alert'}
            </Button>
          </Grid>

          {showSuccess && (
            <Grid item xs={12}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Emergency alerts have been sent to your contacts.
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Emergency Contacts
            </Typography>
            <List>
              {user?.emergencyContacts.map((contact, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={contact.name}
                    secondary={`${contact.phone} - ${contact.relationship}`}
                  />
                  <Button
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      // In a real app, this would remove the contact
                      console.log('Removing contact:', contact);
                    }}
                  >
                    Remove
                  </Button>
                </ListItem>
              ))}
            </List>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setOpenContactDialog(true)}
              sx={{ mt: 2 }}
            >
              Add Emergency Contact
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={openContactDialog} onClose={() => setOpenContactDialog(false)}>
        <DialogTitle>Add Emergency Contact</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Relationship"
            fullWidth
            value={newContact.relationship}
            onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenContactDialog(false)}>Cancel</Button>
          <Button onClick={handleAddContact} color="primary">
            Add Contact
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Emergency; 