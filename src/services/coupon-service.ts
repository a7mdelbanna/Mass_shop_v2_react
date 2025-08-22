import { toast } from 'sonner';
import { Coupon, CouponResponse, SingleCouponResponse } from '@/types/coupon';
import { API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';
import { CouponForCreateDto, CouponForUpdateDto } from '@/types/coupon';

export const CouponService = {
  getAll: async (): Promise<CouponResponse> => {
    try {
      console.log('[CouponService] Fetching Coupons...');
      const response = await fetch(
        `${API_BASE_URL}/Coupon/GetAllCoupons/1`,
        {
          headers: authService.getAuthHeaders()
        }
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data: CouponResponse = await response.json();
      
      if (data.result?.code !== 200) {
        throw new Error(data.result?.message || 'Failed to fetch Complaints');
      }
      
      return data;
    } catch (error) {
      console.error('[CouponService] Error fetching Coupons:', error);
      toast.error('Failed to load Coupons');
      throw error;
    }
  },

};

export const createCoupon = async (storeId: string, dto: CouponForCreateDto): Promise<SingleCouponResponse> => {
  const response = await fetch(`${API_BASE_URL}/Coupon/CreateCoupon/${storeId}`, {
    method: 'POST',
    headers: {
      ...authService.getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });
  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();
  return data;
};

export const updateCoupon = async (storeId: string, dto: CouponForUpdateDto): Promise<SingleCouponResponse> => {
  const response = await fetch(`${API_BASE_URL}/Coupon/UpdateCoupon/${storeId}`, {
    method: 'PUT',
    headers: {
      ...authService.getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });
  if (!response.ok) throw new Error(await response.text());

  const data = await response.json();

  return data;
};

export const deleteCoupon = async (storeId: string, couponCode: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/Coupon/DeleteCoupon/${storeId}/${couponCode}`, {
    method: 'DELETE',
    headers: {
      ...authService.getAuthHeaders(),
    },
  });
  if (!response.ok) throw new Error(await response.text());
};

export const getAllCoupons = async (storeId: string): Promise<Coupon[]> => {
  const response = await fetch(`${API_BASE_URL}/Coupon/GetAllCoupons/${storeId}`, {
    headers: authService.getAuthHeaders(),
  });
  if (!response.ok) throw new Error(await response.text());
  return (await response.json()).data;
};

export const getCouponById = async (storeId: string, couponCode: string): Promise<Coupon> => {
  const response = await fetch(`${API_BASE_URL}/Coupon/GetCouponById/${couponCode}?storeId=${storeId}`, {
    headers: authService.getAuthHeaders(),
  });
  if (!response.ok) throw new Error(await response.text());
  return (await response.json()).data;
}; 