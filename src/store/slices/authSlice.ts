import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/api';

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
  rating: number;
  emergencyContacts: string[];
  accountType: 'passenger' | 'driver';
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Mock user data for development
const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  phoneNumber: '+1234567890',
  isVerified: true,
  rating: 4.8,
  emergencyContacts: [],
  accountType: 'passenger',
};

const validateUser = (user: Partial<User>): string | null => {
  if (!user.name?.trim()) return 'Name is required';
  if (!user.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Invalid email format';
  if (!user.phoneNumber?.match(/^\+?[\d\s-]{10,}$/)) return 'Invalid phone number format';
  return null;
};

const validateEmergencyContact = (contact: Partial<EmergencyContact>): string | null => {
  if (!contact.name?.trim()) return 'Contact name is required';
  if (!contact.phone?.match(/^\+?[\d\s-]{10,}$/)) return 'Invalid phone number format';
  if (!contact.relationship?.trim()) return 'Relationship is required';
  return null;
};

// Load initial state from localStorage
const loadInitialState = (): AuthState => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return {
    user,
    token,
    refreshToken,
    isAuthenticated: !!token,
    loading: false,
    error: null,
  };
};

const initialState: AuthState = loadInitialState();

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // Mock API response for development
      if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
        const response = {
          user: mockUser,
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
        };
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        return response;
      }
      throw new Error('Invalid credentials. Use test@example.com / password123 for testing.');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      // Mock API response for development
      const response = {
        user: {
          ...mockUser,
          name: `${credentials.firstName} ${credentials.lastName}`,
          email: credentials.email,
        },
        token: 'mock-token',
        refreshToken: 'mock-refresh-token',
      };
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.user) return;

      const validationError = validateUser(action.payload);
      if (validationError) {
        state.error = validationError;
        return;
      }

      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
      state.error = null;
    },
    addEmergencyContact: (state, action: PayloadAction<EmergencyContact>) => {
      if (!state.user) return;

      const validationError = validateEmergencyContact(action.payload);
      if (validationError) {
        state.error = validationError;
        return;
      }

      state.user.emergencyContacts.push(action.payload.phone);
      localStorage.setItem('user', JSON.stringify(state.user));
      state.error = null;
    },
    removeEmergencyContact: (state, action: PayloadAction<string>) => {
      if (!state.user) return;

      state.user.emergencyContacts = state.user.emergencyContacts.filter(
        contact => contact !== action.payload
      );
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateUser, addEmergencyContact, removeEmergencyContact } = authSlice.actions;

export default authSlice.reducer; 