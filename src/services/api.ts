import axios from 'axios';

// For development, use a mock API service
const USE_MOCK_API = true;
const MOCK_API_DELAY = 1000; // 1 second delay for mock responses

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock user data for development
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phoneNumber: '+1234567890',
  isVerified: true,
  rating: 4.8,
  emergencyContacts: [],
  accountType: 'passenger' as const,
};

// Mock API responses
const mockApi = {
  login: async (credentials: { email: string; password: string }) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    
    if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
      return {
        user: mockUser,
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      };
    }
    throw new Error('Invalid credentials');
  },

  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    return {
      user: {
        ...mockUser,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
      },
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
    };
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    return { success: true };
  },

  refreshToken: async (refreshToken: string) => {
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    return {
      token: 'new-mock-jwt-token',
      refreshToken: 'new-mock-refresh-token',
    };
  },
};

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('Response error:', error);
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await api.post('/auth/refresh', { refreshToken });
        const { token } = response.data;

        localStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    if (USE_MOCK_API) {
      return mockApi.login(credentials);
    }
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    if (USE_MOCK_API) {
      return mockApi.register(userData);
    }
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: async () => {
    if (USE_MOCK_API) {
      return mockApi.logout();
    }
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  refreshToken: async (refreshToken: string) => {
    if (USE_MOCK_API) {
      return mockApi.refreshToken(refreshToken);
    }
    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      return response.data;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },
};

export default api; 