
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, LoginCredentials, AuthResponse } from '@/services/api-service';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  user: UserProfile | null;
}

interface UserProfile {
  email: string;
  name: string;
  roles?: string[];
}

// Default context value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  user: null,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isUserAuthenticated = authAPI.isAuthenticated();
        setIsAuthenticated(isUserAuthenticated);
        
        if (isUserAuthenticated) {
          // In a real app, you would fetch the user profile here
          // This is a placeholder - typically you'd make an API call to get user data
          const token = localStorage.getItem('auth_token');
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              setUser({
                email: payload.email || 'user@example.com',
                name: payload.name || 'Admin User',
                roles: payload.roles || ['admin'],
              });
            } catch (e) {
              console.error('Error parsing JWT token:', e);
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    try {
      // For demo purposes, check hardcoded credentials
      if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
        // Create a mock token
        const mockToken = generateMockToken(credentials.email);
        
        // Store token in localStorage
        localStorage.setItem('auth_token', mockToken);
        
        setIsAuthenticated(true);
        setUser({
          email: credentials.email,
          name: 'Admin User',
          roles: ['admin']
        });
        
        toast.success('Login successful!');
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setIsAuthenticated(false);
      toast.error('Login failed. Please check your credentials.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setUser(null);
    toast.info('You have been logged out');
  };

  // Helper function to generate a mock JWT token
  const generateMockToken = (email: string): string => {
    // Create a simple JWT structure (header.payload.signature)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: '123456789',
      email: email,
      name: 'Admin User',
      roles: ['admin'],
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours expiration
    }));
    const signature = btoa('mock_signature'); // In a real JWT, this would be an actual signature
    
    return `${header}.${payload}.${signature}`;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
