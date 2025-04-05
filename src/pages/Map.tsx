import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Grid,
  Avatar,
  styled,
} from '@mui/material';
import {
  MyLocation as MyLocationIcon,
  Search as SearchIcon,
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { debounce } from '@mui/material/utils';

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
  display: 'flex',
  gap: '16px',
  padding: '16px',
});

const MapContainerWrapper = styled(Box)({
  flex: '1',
  height: 'calc(100% - 32px)',
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
});

const RideRequestForm = styled(Paper)(({ theme }) => ({
  width: '360px',
  height: 'calc(100% - 32px)',
  padding: theme.spacing(3),
  zIndex: 1000,
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  backgroundColor: '#ffffff',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}));

const SearchSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '8px',
  backgroundColor: '#f8f8f8',
  boxShadow: 'none',
}));

const DriversList = styled(Paper)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  boxShadow: 'none',
  overflowY: 'auto',
  '& .MuiListItem-root': {
    padding: theme.spacing(2),
    backgroundColor: '#f8f8f8',
    marginBottom: theme.spacing(1.5),
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#f0f0f0',
      transform: 'translateY(-2px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
  },
  '& .MuiDivider-root': {
    display: 'none',
  },
}));

const DriverAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: '#000000',
  width: 44,
  height: 44,
}));

const DriverChip = styled(Chip)(({ theme }) => ({
  borderRadius: '6px',
  height: '24px',
  '& .MuiChip-icon': {
    fontSize: '14px',
  },
  '& .MuiChip-label': {
    fontSize: '12px',
    fontWeight: 500,
  },
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

interface SearchResult {
  display_name: string;
  lat: number;
  lon: number;
}

const Map = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedRide, setSelectedRide] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([26.9124, 75.7873]); // Center of Jaipur
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const nearbyDrivers = [
    {
      id: 1,
      name: 'Person 1',
      rating: 4.8,
      distance: '0.5',
      eta: '2',
      car: 'Toyota Camry',
      price: '₹250',
      location: [26.9147, 75.7873] as [number, number], // Near Jaipur City Palace
    },
    {
      id: 2,
      name: 'Person 2',
      rating: 4.9,
      distance: '1.2',
      eta: '4',
      car: 'Honda Civic',
      price: '₹200',
      location: [26.9239, 75.8267] as [number, number], // Near Hawa Mahal
    },
    {
      id: 3,
      name: 'Person 3',
      rating: 4.7,
      distance: '0.8',
      eta: '3',
      car: 'Tesla Model 3',
      price: '₹300',
      location: [26.9855, 75.8513] as [number, number], // Near Amer Fort
    },
    {
      id: 4,
      name: 'Person 4',
      rating: 4.6,
      distance: '0.3',
      eta: '2',
      car: 'Maruti Swift',
      price: '₹180',
      location: [26.8242, 75.6217] as [number, number], // Near Bagru Main Market
    },
    {
      id: 5,
      name: 'Person 5',
      rating: 4.8,
      distance: '0.5',
      eta: '3',
      car: 'Hyundai i20',
      price: '₹220',
      location: [26.8293, 75.6328] as [number, number], // Near Bagru Industrial Area
    }
  ];

  const searchLocation = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&limit=5&countrycodes=in`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  const debouncedSearch = debounce(searchLocation, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleLocationSelect = (result: SearchResult) => {
    setMapCenter([parseFloat(result.lat), parseFloat(result.lon)]);
    setSearchQuery(result.display_name);
    setShowResults(false);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(newLocation);
          setMapCenter(newLocation);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <MapWrapper>
      <MapContainerWrapper>
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={mapCenter} zoom={13} />

          {userLocation && (
            <Marker position={userLocation}>
              <Popup>You are here</Popup>
            </Marker>
          )}

          {nearbyDrivers.map((driver) => (
            <Marker
              key={driver.id}
              position={driver.location}
              icon={L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: black; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>`,
                iconSize: [14, 14],
                iconAnchor: [7, 7],
              })}
            >
              <Popup>
                <Typography variant="subtitle2">{driver.name}</Typography>
                <Typography variant="body2">{driver.car}</Typography>
                <Typography variant="body2">Rating: {driver.rating}</Typography>
                <Typography variant="body2">ETA: {driver.eta}</Typography>
                <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                  {driver.price}
                </Typography>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </MapContainerWrapper>

      <RideRequestForm>
        <SearchSection>
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <LocationInput
                fullWidth
                placeholder="Enter your destination"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowResults(true)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <IconButton
                onClick={handleGetLocation}
                sx={{
                  p: 1,
                  border: '1px solid #e5e5e5',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#000000',
                  },
                }}
              >
                <MyLocationIcon />
              </IconButton>
            </Box>
            {showResults && searchResults.length > 0 && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  mt: 1,
                  zIndex: 1000,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <List>
                  {searchResults.map((result, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => handleLocationSelect(result)}
                      sx={{
                        py: 1,
                        px: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.04)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: '36px' }}>
                        <LocationIcon sx={{ color: 'text.secondary' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={result.display_name}
                        primaryTypographyProps={{
                          variant: 'body2',
                          noWrap: true,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </SearchSection>

        <DriversList>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.primary', fontWeight: 600 }}>
            Available Drivers
          </Typography>
          <List disablePadding>
            {nearbyDrivers.map((driver) => (
              <Box key={driver.id}>
                <ListItem
                  onClick={() => {
                    setSelectedRide(driver.id);
                    setMapCenter(driver.location);
                  }}
                >
                  <ListItemIcon>
                    <DriverAvatar>
                      <PersonIcon />
                    </DriverAvatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {driver.name}
                        </Typography>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 600,
                            color: 'primary.main',
                          }}
                        >
                          {driver.price}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DriverChip
                          size="small"
                          icon={<StarIcon sx={{ color: '#F59E0B !important' }} />}
                          label={driver.rating}
                          sx={{ 
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            '& .MuiChip-label': {
                              color: '#F59E0B',
                            }
                          }}
                        />
                        <DriverChip
                          size="small"
                          icon={<CarIcon sx={{ color: '#000000' }} />}
                          label={driver.car}
                          sx={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            '& .MuiChip-label': {
                              color: '#000000',
                            }
                          }}
                        />
                      </Box>
                    }
                  />
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-end',
                    gap: 0.5,
                    minWidth: '60px',
                  }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      minWidth: '32px',
                    }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, textAlign: 'center' }}>
                        {driver.distance}
                      </Typography>
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      minWidth: '32px',
                    }}>
                      <TimeIcon sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, textAlign: 'center' }}>
                        {driver.eta}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              </Box>
            ))}
          </List>
        </DriversList>

        {selectedRide && (
          <Button
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: 'none',
              bgcolor: '#000000',
              '&:hover': {
                bgcolor: '#333333',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              },
            }}
          >
            Request Ride
          </Button>
        )}
      </RideRequestForm>
    </MapWrapper>
  );
};

export default Map; 