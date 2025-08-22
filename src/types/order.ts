import { Company } from "./company";
import { ItemUnit } from "./item-unit";
import { MainCategory } from "./main-category";
import { SubCategory } from "./sub-category";


export interface OrderCustomer {
  customerId: number | null;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  phone1: string | null;
  phone2: string | null;
  fcmToken: string | null;
  isActive: boolean;
  hasNewNotifications: number;
  minAllowedOrders: number;
  myReferrerCode: string | null;
  referralCode: string;
  representativeId: number | null;
  representativeCode: string | null;
}

export interface OrderAddress {
  addressName: string | null;
  customerId: number;
  customerName: string | null;
  shopId: number;
  shopName: string;
  street: string | null;
  apartment: string | null;
  buildingNo: string | null;
  floorNo: string | null;
  flatNo: string | null;
  famousSign: string | null;
  deliveryNotes: string | null;
  locationLong: number | null;
  locationLat: number | null;
  address: string | null;
  areaId: number;
  cityId: number;
  areaName: string;
  cityName: string;
  isForMe: boolean | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  id: number;
  isActive: boolean;
  createdAtDate: string;
  createdAtTime: string;
  modifiedAtDate: string | null;
  modifiedAtTime: string | null;
}

export interface OrderItemUnit {
  nameEN: string;
  nameAR: string;
  amount: number;
  id: number;
  isActive: boolean;
  createdAtDate: string;
  createdAtTime: string;
  modifiedAtDate: string | null;
  modifiedAtTime: string | null;
}

export interface OrderItemDetails {
  itemId: number;
  eznItemName: string;
  eznItemAmount: number;
  itemUnit: OrderItemUnit;
  imageURL: string;
  eznItemPrice: number;
  eznItemOfferDisValue: number;
  eznTotalValue: number | null;
  vatPrcent: number;
  taxPrcent: number;
  eznMemo: string | null;
  eznItemTotal: number;
  totalOfferDisValue: number;
  totalVatValue: number;
  totalTaxValue: number;
  eznItemNetPrice: number;
  eznNetValue: number;
}

export interface DeliveryFeeInfo {
  id: number;
  areaName: string;
  price: number;
  maxDeliveryTime: number;
  deliveryHours: number;
  deliveryMinutes: number;
}

export interface Order {
  id: number;
  orderEznNo: number;
  orderEznMemo: string;
  orderTipVal: number | null;
  orderStatus: string;
  orderEznDate: string;
  orderEznTime: string;
  remainingTimeInMinutes: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryBoyName: string;
  customer: OrderCustomer;
  address: OrderAddress;
  storeLocationLong: number | null;
  storeLocationLat: number | null;
  itemDetails: OrderItemDetails[];
  notDeliveredReason: string | null;
  orderRating: number | null;
  deliveryFeeInfo: DeliveryFeeInfo | null;
  orderEznTotal: number;
  orderEznTotalVatValue: number;
  orderEznTotalTaxValue: number;
  orderEznTotalOfferDisValue: number;
  couponDisVal: number;
  deliveryFee: number | null;
  orderEznNetValue: number;
}

export interface GetAllOrdersResponse {
  result: {
    code: number;
    message: string;
  };
  data: Order[];
}

export interface OrderQueryParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  customerId?: number;
  isHistory?: boolean;
  isActive?: boolean;
}

export interface PaginatedOrderResponse {
  data: Order[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  result: {
    code: number;
    message: string;
  };
}
