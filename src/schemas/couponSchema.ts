import * as z from 'zod';
import { DiscountType } from '@/types/coupon';

export const couponFormSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  discountType: z.nativeEnum(DiscountType),
  discountValue: z.number().min(0.01, 'Discount value required'),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().min(1, 'End date required'),
  status: z.boolean(),
  maxUses: z.number().min(1, 'Max uses required'),
  perUserLimit: z.number().min(1, 'Per user limit required'),
}); 