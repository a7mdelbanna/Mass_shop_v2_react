export interface Offer {
  id: number;
  no : number;
  nameEN: string;
  nameAR: string;
  fromDate: string;
  toDate: string;
  isSpecialOffer: boolean;
  isActive?: boolean;
  createdAtDate?: string;
  createdAtTime?: string;
  modifiedAtDate?: string | null;
  modifiedAtTime?: string | null;
  itemImage?: string | null;
  itemImageURL?: string | null;
  itemImageFileLength?: number | null;
  // offerDetails: OfferDetail[]; // To be defined in next steps
}

export interface OfferValidIdResponse {
  result: {
    code: number;
    message: string;
  };
  data: Offer;
}

export interface ItemOfferForCreateUpdateDto {
  id: number;
  no : number;
  nameEN: string;
  nameAR: string;
  fromDate: string;
  toDate: string;
  isSpecialOffer: boolean;
  // Add other fields as needed (e.g., image info)
}

export interface OfferImageUploadResponse {
  result: {
    code: number;
    message: string;
  };
  data: string; // URL or file name
}

export interface OfferResponse {
  result: {
    code: number;
    message: string;
  };
  data: Offer;
}

export interface OfferListResponse {
  result: {
    code: number;
    message: string;
  };
  data: Offer[];
}

export interface ItemOfferDetails {
  id: number;
  offerId: number;
  itemId: number;
  itemName: string;
  discountValue: number;
  discountType: string;
  isActive?: boolean;
  createdAtDate?: string;
  createdAtTime?: string;
  modifiedAtDate?: string | null;
  modifiedAtTime?: string | null;
}

export interface ItemOfferDetailsForCreateUpdateDto {
  itemBasicPrice: number;
  itemPrice: number;
  discountValue: number;
  discountPercent: number;
  itemUnitId: number;
  itemId: number;
  itemOfferId: number;
}

export interface ItemOfferDetailsForCreateUpdateByCompanyDto {
  discountValue?: number;
  discountPercent?: number;
  itemOfferId: number;
  companyId: number;
}

export interface ItemOfferDetailsForCreateUpdateByCategoryDto {
  discountValue?: number;
  discountPercent?: number;
  itemOfferId: number;
  categoryId: number;
}


export interface ItemOfferDetailsResponse {
  result: {
    code: number;
    message: string;
  };
  data: ItemOfferDetails;
}

export interface ItemOfferDetailsListResponse {
  result: {
    code: number;
    message: string;
  };
  data: ItemOfferDetails[];
} 