import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense, lazy } from 'react';
import theme from './theme';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Map = lazy(() => import('./pages/Map'));
const RideRequest = lazy(() => import('./pages/RideRequest'));
const Emergency = lazy(() => import('./pages/Emergency'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// Loading component
const LoadingScreen = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route
                path="profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="map"
                element={
                  <PrivateRoute>
                    <Map />
                  </PrivateRoute>
                }
              />
              <Route
                path="ride-request"
                element={
                  <PrivateRoute>
                    <RideRequest />
                  </PrivateRoute>
                }
              />
              <Route
                path="emergency"
                element={
                  <PrivateRoute>
                    <Emergency />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ThemeProvider>
  );
}

export default App;
