import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

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

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
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
      state.error = null;
    },
    removeEmergencyContact: (state, action: PayloadAction<string>) => {
      if (!state.user) return;

      state.user.emergencyContacts = state.user.emergencyContacts.filter(
        contact => contact !== action.payload
      );
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout,
  updateUser,
  addEmergencyContact,
  removeEmergencyContact,
} = authSlice.actions;

export default authSlice.reducer; 