import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Security as SecurityIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateUser } from '../store/slices/authSlice';

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [openEmergencyDialog, setOpenEmergencyDialog] = useState(false);
  const [newContact, setNewContact] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    email: user?.email || '',
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (user) {
      dispatch(updateUser({ ...user, ...formData }));
      setIsEditing(false);
    }
  };

  const handleAddEmergencyContact = () => {
    if (user && newContact) {
      const updatedContacts = [...(user.emergencyContacts || []), newContact];
      dispatch(updateUser({ ...user, emergencyContacts: updatedContacts }));
      setNewContact('');
      setOpenEmergencyDialog(false);
    }
  };

  const handleDeleteContact = (contact: string) => {
    if (user) {
      const updatedContacts = user.emergencyContacts.filter(c => c !== contact);
      dispatch(updateUser({ ...user, emergencyContacts: updatedContacts }));
    }
  };

  if (!user) {
    return (
      <Container>
        <Typography>Please log in to view your profile.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        {/* Profile Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{ width: 100, height: 100, mr: 3 }}
            src={user.profileImage}
          >
            <PersonIcon sx={{ fontSize: 60 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Member since {new Date(user.id).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Profile Information */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            {isEditing ? (
              <>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  sx={{ mr: 1 }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Phone" secondary={user.phoneNumber} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Email" secondary={user.email} />
                  </ListItem>
                </List>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                >
                  Edit Profile
                </Button>
              </>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Emergency Contacts
            </Typography>
            <List>
              {user.emergencyContacts.map((contact, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteContact(contact)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <PhoneIcon />
                  </ListItemIcon>
                  <ListItemText primary={contact} />
                </ListItem>
              ))}
            </List>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenEmergencyDialog(true)}
            >
              Add Emergency Contact
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Trust & Safety */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Trust & Safety
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography>
                  {user.isVerified ? 'Verified User' : 'Unverified User'}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography>
                  Rating: {user.rating.toFixed(1)} / 5.0
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Emergency Contact Dialog */}
      <Dialog open={openEmergencyDialog} onClose={() => setOpenEmergencyDialog(false)}>
        <DialogTitle>Add Emergency Contact</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Phone Number"
            fullWidth
            value={newContact}
            onChange={(e) => setNewContact(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmergencyDialog(false)}>Cancel</Button>
          <Button onClick={handleAddEmergencyContact} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 