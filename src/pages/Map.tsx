import React, { useState } from 'react';
import { Box, Button, Grid, TextField, IconButton, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapWrapper = styled(Box)({
  height: '100vh',
  width: '100%',
  position: 'relative',
});

const RideRequestForm = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  right: theme.spacing(2),
  padding: theme.spacing(2),
  zIndex: 1000,
  borderRadius: 8,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
}));

const LocationInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.2)',
    },
  },
}));

interface MapUpdaterProps {
  center: [number, number];
  zoom: number;
}

const MapUpdater: React.FC<MapUpdaterProps> = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const Map: React.FC = () => {
  const navigate = useNavigate();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  const handleSearch = () => {
    if (fromLocation && toLocation) {
      navigate('/ride-request', { state: { from: fromLocation, to: toLocation } });
    }
  };

  return (
    <MapWrapper>
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[20.5937, 78.9629]}>
          <Popup>India</Popup>
        </Marker>
        <MapUpdater center={[20.5937, 78.9629]} zoom={5} />
      </MapContainer>

      <RideRequestForm>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <LocationInput
                fullWidth
                placeholder="Enter pickup location"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                InputProps={{
                  startAdornment: <LocationOnIcon sx={{ color: 'primary.main', mr: 1 }} />,
                }}
              />
              <IconButton size="small">
                <SwapHorizIcon />
              </IconButton>
              <LocationInput
                fullWidth
                placeholder="Where to?"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                InputProps={{
                  startAdornment: <LocationOnIcon sx={{ color: 'primary.main', mr: 1 }} />,
                }}
              />
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                disabled={!fromLocation || !toLocation}
                sx={{
                  backgroundColor: '#000000',
                  minWidth: '100px',
                  '&:hover': {
                    backgroundColor: '#333333',
                  },
                }}
              >
                Search
              </Button>
            </Box>
          </Grid>
        </Grid>
      </RideRequestForm>
    </MapWrapper>
  );
};

export default Map; 