export interface NotificationSettingDto {
  // For Admin
  autoNotifyWhenNegativeRating: boolean;

  // For Customer
  autoNotifyWhenReplacmentOrder: boolean;
  autoNotifyWhenOrderArrived: boolean;
  autoNotifyWhenOrderStatusChanged: boolean;

  // For Delivery Boy
  autoNotifyWhenAssignOrder: boolean;
}

export interface NotificationSettingResponse {
  result: {
    code: number;
    message: string;
  };
  data: NotificationSettingDto;
} 