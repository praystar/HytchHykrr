import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { authService } from '../services/api';

export const authMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  // Check if the action is a rejected authentication action
  if (action.type.endsWith('/rejected')) {
    const error = action.payload || action.error?.message;
    
    // Handle specific authentication errors
    if (error?.includes('Unauthorized') || error?.includes('Invalid token')) {
      // Clear auth state and redirect to login
      store.dispatch({ type: 'auth/logout' });
      window.location.href = '/login';
    }
  }

  // Check if the action is a successful login/register
  if (action.type.endsWith('/fulfilled') && (action.type.includes('login') || action.type.includes('register'))) {
    const { token, refreshToken } = action.payload;
    
    // Store tokens in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  // Check if the action is a logout
  if (action.type === 'auth/logout/fulfilled') {
    // Clear tokens from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  return next(action);
}; 