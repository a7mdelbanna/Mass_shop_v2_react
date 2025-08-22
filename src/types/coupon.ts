export enum DiscountType {
  Percentage = 0,
  FixedAmount = 1,
}

export interface CouponForCreateDto {
  code?: string;
  description?: string;
  discountType?: DiscountType;
  discountValue: number;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  status: boolean;
  maxUses: number;
  perUserLimit: number;
}

export interface CouponForUpdateDto extends CouponForCreateDto {}

export interface Coupon extends CouponForCreateDto {
  id: number;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface SingleCouponResponse {
  result: {
    code: number;
    message: string;
  };
  data: Coupon;
} 

export interface CouponResponse {
  result: {
    code: number;
    message: string;
  };
  data: Coupon[];
} 