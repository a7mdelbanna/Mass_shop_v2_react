export enum DeliveryFeeType
{
  ByArea = 1,
  ByDistance = 2,
}

export interface StoreSettings {
  minOrdersForActivateReferralCode: number;
  minAmountForRechargeWallet: number;
  minAmountForPlaceOrder: number;
  minItemsForPlaceOrder: number;
  totalAmountForActivateReferralCode: number;
  totalAmountForFreeDelivery: number | null;
  isInventoryTracked: boolean;
  deliveryFeeType: number | null;
  appMode: string;
  enableDelivery: boolean;
  isAvailableToReceiveOrders: boolean;
  enableDeliveryTips: boolean;
  enableOrderRating: boolean;
  // New fields from StoreSettingForCreateUpdateDto
  pointsPerEGPSpent?: number | null;
  egpPerPointRedeem?: number | null;
  referralCashbackPercent: number;
  referralCashbackMaxEGP: number;
  inviteeDiscountMaxOrders: number;
  inviteeDiscountPercent: number;
  inviteeDiscountMaxEGP: number;
  pointsExpiryDays: number;
  redeemCouponExpiryDays: number;
  redeemCouponUsageLimit: number;
}

export interface StoreSettingsResponse {
  result: {
    code: number;
    message: string;
  };
  data: StoreSettings;
} 