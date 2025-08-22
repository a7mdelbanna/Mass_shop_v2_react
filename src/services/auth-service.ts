import { API_CONFIG } from '@/config/api.config';
import { API_BASE_URL } from '@/config/api';
import { RegisterAdminRequest, RegisterAdminResponse } from '@/types/auth';
import { apiRequest, ApiResponse } from '@/utils/api-utils';
import { toast } from 'sonner';

interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface UserProfile {
  id: string;
  phoneNumber: string;
  name: string;
  email?: string;
  roles?: string[];
  userType?: string;
}

interface DecodedToken {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  StoreId: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  exp: number;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: UserProfile | null = null;
  
  private constructor() {
    // Try to restore user from token on initialization
    const token = this.getToken();
    if (token) {
      try {
        const payload = this.decodeToken(token);
        this.currentUser = {
          id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
          phoneNumber: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
          name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
          roles: [payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']],
        };
      } catch (e) {
        console.error('Error parsing JWT token:', e);
        this.logout();
      }
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private decodeToken(token: string): DecodedToken {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      throw new Error('Invalid token format');
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const data = await apiRequest<AuthResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.LOGIN_URL}`,
        {
          method: 'POST',
          body: JSON.stringify({
            phoneNumber: credentials.phoneNumber,
            password: credentials.password
          }),
          showSuccessToast: true,
          successMessage: 'Login successful',
          errorMessage: 'Login failed'
        }
      );
      
      // Store tokens
      this.setTokens({
        token: data.accessToken,
        refreshToken: data.refreshToken
      });
      
      // Set user profile from token
      try {
        const payload = this.decodeToken(data.accessToken);
        this.currentUser = {
          id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
          phoneNumber: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
          name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
          roles: [payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']],
        };
      } catch (e) {
        console.error('Error parsing JWT token:', e);
        throw new Error('Invalid token received');
      }
      
      return data;
    } catch (error) {
      // Error is already handled by apiRequest
      throw error;
    }
  }

  async getProfile(): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/Auth/GetProfile`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    const data = await response.json();
    this.currentUser = data; // or map as needed
    return data;
  }

  logout(): void {
    localStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY);
    localStorage.removeItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY);
    this.currentUser = null;
  }

  getToken(): string | null {
    return localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.decodeToken(token);
      // Check if token is expired
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getUser(): UserProfile | null {
    return this.currentUser;
  }

  private setTokens(authData: { token: string; refreshToken: string }): void {
    localStorage.setItem(API_CONFIG.AUTH.TOKEN_KEY, authData.token);
    localStorage.setItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY, authData.refreshToken);
  }

  // Helper method to get auth headers
  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      ...API_CONFIG.HEADERS,
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }
}


export const authService = AuthService.getInstance();

export const registerAdmin = async (data: RegisterAdminRequest): Promise<RegisterAdminResponse> => {
  try {
    const response = await apiRequest<{ token: string; refreshToken: string }>(
      API_CONFIG.AUTH.REGISTER_ADMIN_URL,
      {
        method: 'POST',
        body: JSON.stringify(data),
        showSuccessToast: true,
        successMessage: 'Registration successful',
        errorMessage: 'Registration failed'
      }
    );

    return {
      result: { code: 200, message: 'Success' },
      data: response
    };
  } catch (error) {
    // Error is already handled by apiRequest
    throw error;
  }
}; 