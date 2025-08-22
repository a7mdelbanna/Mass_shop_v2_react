export interface DeliveryBoy {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  username: string;
  isActive: boolean;
}

export interface CreateDeliveryBoyDto {
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

export interface DeliveryBoyResponse {
  data: DeliveryBoy[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  result: ApiResult;
} 