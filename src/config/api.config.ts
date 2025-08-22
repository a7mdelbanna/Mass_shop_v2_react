export const API_CONFIG = {
 //BASE_URL: 'https://localhost:7149/RetailAPI',
BASE_URL: 'http://modytest-002-site3.atempurl.com/RetailAPI',
  AUTH: {
    LOGIN_URL: '/Auth/Authenticate/1', // Adjust this path according to your API
    REGISTER_ADMIN_URL: '/Auth/RegisterAsAdmin/', // Adjust this path according to your API
    TOKEN_KEY: 'auth_token',
    REFRESH_TOKEN_KEY: 'refresh_token',
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
  // Add other API-related configuration here if needed
  // For example:
  // TIMEOUT: 5000,
} as const; 

interface DecodedToken {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  StoreId: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  exp: number;
} 