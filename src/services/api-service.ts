import { toast } from "sonner";
import type { GetAllOrdersResponse } from '../types/order';

// Base API URL - should be replaced with your actual API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yourdomain.com';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

// Helper methods for token management
const getAuthToken = () => localStorage.getItem('auth_token');
const setAuthToken = (token: string) => localStorage.setItem('auth_token', token);
const removeAuthToken = () => localStorage.removeItem('auth_token');

// Helper for checking if token is expired (if your token includes expiry)
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
};

// API client with authorization header
const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  // Set up headers
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    // Handle 401 Unauthorized - could be expired/invalid token
    if (response.status === 401) {
      // Clear token and redirect to login
      removeAuthToken();
      window.location.href = '/login';
      throw new Error('Authentication failed. Please login again.');
    }

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `API request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    // Return null for 204 No Content
    if (response.status === 204) {
      return null;
    }

    // Return parsed JSON response
    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    toast.error(errorMessage);
    throw error;
  }
};

// Auth-related API calls
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const data = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (data.token) {
      setAuthToken(data.token);
    }
    
    return data;
  },
  
  logout: () => {
    removeAuthToken();
  },
  
  isAuthenticated: (): boolean => {
    const token = getAuthToken();
    return !!token && !isTokenExpired(token);
  }
};

// Product-related API calls
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    return await apiClient('/products');
  },
  
  getById: async (id: string): Promise<Product> => {
    return await apiClient(`/products/${id}`);
  },
  
  create: async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    return await apiClient('/products', {
      method: 'POST',
      body: JSON.stringify(product)
    });
  },
  
  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    return await apiClient(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product)
    });
  },
  
  delete: async (id: string): Promise<void> => {
    await apiClient(`/products/${id}`, {
      method: 'DELETE'
    });
  }
};

// Example of how to add other API endpoints for your e-commerce system
export const ordersAPI = {
  getAll: async (): Promise<GetAllOrdersResponse> => {
    return await apiClient('/RetailAPI/Admin/Order/GeAllOrders/1');
  },
  // Additional order operations would go here
};

export const customersAPI = {
  getAll: async () => {
    return await apiClient('/customers');
  },
  // Additional customer operations would go here
};
