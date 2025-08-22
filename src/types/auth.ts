export interface RegisterAdminRequest {
  licenseKey: string;
  storeName: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  email: string;
  phoneNumber: string;
  phone1: string;
  phone2: string;
}

export interface RegisterAdminResponse {
  result: {
    code: number;
    message: string;
  };
  data: {
    token: string;
    refreshToken: string;
  };
} 