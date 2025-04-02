import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Rating,
  Divider,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface Driver {
  id: string;
  name: string;
  rating: number;
  vehicle: string;
  departureTime: string;
  price: number;
  availableSeats: number;
  profileImage?: string;
}

const RideRequest = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState(1);
  const [openDriverDialog, setOpenDriverDialog] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Mock data for available drivers
  const availableDrivers: Driver[] = [
    {
      id: '1',
      name: 'John Doe',
      rating: 4.8,
      vehicle: 'Toyota Camry 2020',
      departureTime: '09:00 AM',
      price: 25,
      availableSeats: 2,
      profileImage: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      name: 'Jane Smith',
      rating: 4.9,
      vehicle: 'Honda Civic 2021',
      departureTime: '10:30 AM',
      price: 20,
      availableSeats: 1,
      profileImage: 'https://via.placeholder.com/150',
    },
  ];

  const handleSearch = () => {
    // In a real app, this would fetch available drivers from an API
    console.log('Searching for rides:', { fromLocation, toLocation, date, time, seats });
  };

  const handleSelectDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setOpenDriverDialog(true);
  };

  const handleConfirmBooking = () => {
    // In a real app, this would create a booking
    console.log('Confirming booking with driver:', selectedDriver);
    setOpenDriverDialog(false);
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Request a Ride
        </Typography>

        {/* Search Form */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="From"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              InputProps={{
                startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="To"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              InputProps={{
                startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="time"
              label="Time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Number of Seats</InputLabel>
              <Select
                value={seats}
                label="Number of Seats"
                onChange={(e) => setSeats(Number(e.target.value))}
              >
                {[1, 2, 3, 4].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num} {num === 1 ? 'Seat' : 'Seats'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSearch}
              startIcon={<CarIcon />}
            >
              Search for Rides
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Available Drivers */}
        <Typography variant="h6" gutterBottom>
          Available Drivers
        </Typography>
        <List>
          {availableDrivers.map((driver) => (
            <Paper key={driver.id} sx={{ mb: 2 }}>
              <ListItem
                button
                onClick={() => handleSelectDriver(driver)}
                sx={{ py: 2 }}
              >
                <ListItemAvatar>
                  <Avatar src={driver.profileImage}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">{driver.name}</Typography>
                      <Rating value={driver.rating} precision={0.1} readOnly size="small" />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="body2">
                        <CarIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        {driver.vehicle}
                      </Typography>
                      <Typography variant="body2">
                        <TimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        Departure: {driver.departureTime}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        ${driver.price} per seat
                      </Typography>
                    </Box>
                  }
                />
                <Chip
                  label={`${driver.availableSeats} seats left`}
                  color="primary"
                  variant="outlined"
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      </Paper>

      {/* Driver Details Dialog */}
      <Dialog
        open={openDriverDialog}
        onClose={() => setOpenDriverDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedDriver && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={selectedDriver.profileImage} sx={{ width: 60, height: 60 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedDriver.name}</Typography>
                  <Rating value={selectedDriver.rating} precision={0.1} readOnly />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Vehicle"
                    secondary={selectedDriver.vehicle}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Departure Time"
                    secondary={selectedDriver.departureTime}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Price"
                    secondary={`$${selectedDriver.price} per seat`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Available Seats"
                    secondary={selectedDriver.availableSeats}
                  />
                </ListItem>
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDriverDialog(false)}>Cancel</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmBooking}
              >
                Confirm Booking
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default RideRequest; 