export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  username: string;
  isActive: boolean;
}

export interface CreateCustomerDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface ApiResult {
  code: number;
  message: string;
}

export interface CustomerResponse {
  data: Customer[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  result: ApiResult;
} 