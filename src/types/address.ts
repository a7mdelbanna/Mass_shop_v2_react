export interface FullAddress {
  id: number;
  addressName: string;
  customerName: string;
  shopId: number;
  shopName: string;
  street: string;
  apartment: string;
  buildingNo: string;
  floorNo: string;
  flatNo: string;
  famousSign: string;
  deliveryNotes: string;
  locationLong: string;
  locationLat: string;
  address: string;
  areaId: number;
  cityId: number;
  areaName: string;
  cityName: string;
  isForMe: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface City {
  id: number;
  name: string;
}

export interface Area {
  id: number;
  name: string;
}


export interface ShopAddressByArea {
  id: number;
  addressName: string;
  areaId: number;
  cityId: number;
  street: string;
}

export interface ShopAddressByDistance {
  id: number;
  addressName: string;
  areaName: string;
  cityName: string;
  street: string;
}

export interface CityResponse {
  result: {
    code: number;
    message: string;
  };
  data: City[];
} 

export interface AreaResponse {
  result: {
    code: number;
    message: string;
  };
  data: Area[];
} 

export interface SingleAddressResponse {
  result: {
    code: number;
    message: string;
  };
  data: FullAddress;
} 