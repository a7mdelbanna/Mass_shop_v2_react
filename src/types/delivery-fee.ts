export interface DeliveryFeeByArea {
  id: number;
  areaName: string;
  price: number;
  maxDeliveryTime: number;
  deliveryHours: number;
  deliveryMinutes: number;
  parentAreaName: string;
}

export interface DeliveryFeeByDistance {
  id: number;
  from: number;
  to: number;
  price: number;
  maxDeliveryTime: number;
  deliveryHours: number;
  deliveryMinutes: number;
}

export interface DeliveryFeeByDistanceForCreateUpdateDto {
  from: number;
  to: number;
  price: number;
  deliveryHours: number;
  deliveryMinutes: number;
}

export interface DeliveryFeeByMainAreaForCreateUpdateDto {
  areaName: string;
  price: number;
  deliveryHours: number;
  deliveryMinutes: number;
}

export interface DeliveryFeeBySubAreaForCreateUpdateDto {
  areaName: string;
  price: number;
  deliveryHours: number;
  deliveryMinutes: number;
  parentAreaId?: number | null; // If null, it is a Main Area
}

export interface DeliveryFeeBySubAreaForUpdateDto extends DeliveryFeeBySubAreaForCreateUpdateDto {
  id: number;
}

export interface DeliveryFeeByDistanceForUpdateDto extends DeliveryFeeByDistanceForCreateUpdateDto {
  id: number;
}

export interface DeliveryFeeByAreaDto {
  id: number;
  areaName: string;
  price: number;
  maxDeliveryTime: number;
  parentAreaName?: string | null;
  // Computed properties for convenience
  deliveryHours: number;
  deliveryMinutes: number;
}

export interface DeliveryFeeByMainAreaDto {
  id: number;
  areaName: string;
  price: number;
  maxDeliveryTime: number;
  deliveryHours: number;
  deliveryMinutes: number;
}

export interface DeliveryFeeByDistanceDto {
  id: number;
  from: number;
  to: number;
  price: number;
  maxDeliveryTime: number;
  deliveryHours: number;
  deliveryMinutes: number;
}

export interface DeliveryFeeByAreaResponse {
  result: {
    code: number;
    message: string;
  };
  data: DeliveryFeeByAreaDto[];
}

export interface DeliveryFeeByDistanceResponse {
  result: {
    code: number;
    message: string;
  };
  data: DeliveryFeeByDistanceDto[];
} 