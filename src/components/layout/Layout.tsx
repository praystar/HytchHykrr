import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  Badge,
  Tooltip,
  Paper,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Home as HomeIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';

const Layout = () => {
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await dispatch(logout());
      navigate('/login');
    } catch (err) {
      setError('Failed to logout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleUserMenuClose();
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* Floating Action Container */}
      <Paper
        elevation={0}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1200,
          bgcolor: '#000000',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1,
        }}
      >
        <Tooltip title="Home">
          <IconButton 
            onClick={() => handleNavigation('/')}
            sx={{ color: '#ffffff' }}
          >
            <HomeIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Map">
          <IconButton 
            onClick={() => handleNavigation('/map')}
            sx={{ color: '#ffffff' }}
          >
            <MapIcon />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />

        <Tooltip title="Notifications">
          <IconButton sx={{ color: '#ffffff' }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Tooltip title="Account settings">
          <IconButton onClick={handleUserMenuOpen} sx={{ color: '#ffffff' }}>
            <Avatar sx={{ bgcolor: '#333333', width: 32, height: 32 }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* User Menu */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          sx={{
            '& .MuiPaper-root': {
              bgcolor: '#000000',
              color: '#ffffff',
              width: 200,
              mt: 1,
            },
          }}
        >
          <MenuItem
            onClick={() => handleNavigation('/profile')}
            sx={{
              gap: 2,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <PersonIcon />
            <Typography>Profile</Typography>
          </MenuItem>
          <MenuItem
            onClick={handleLogout}
            disabled={isLoading}
            sx={{
              gap: 2,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <LogoutIcon />
            <Typography>Logout</Typography>
          </MenuItem>
        </Menu>
      </Paper>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: '#ffffff',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 