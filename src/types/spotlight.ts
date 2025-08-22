
export interface ItemSpotlightAllForCreateUpdateDto {
  id: number;
  companyNameEN?: string;
  companyNameAR?: string;
  titleEN?: string;
  titleAR?: string;
  imageURL? : string;
  fromDate?: string;
  toDate?: string; 
}

export interface ItemSpotlightDetailsForCreateUpdateDto {
  itemAmount?: number;
  itemBasicPrice?: number;
  itemPrice?: number;
  discountValue?: number;
  discountPercent?: number;
  itemUnitId: number;
  spotlightAllId: number;
  itemId: number;
} 

export interface ItemSpotlightDetailsForCreateUpdateByCompanyDto {
  discountValue?: number;
  discountPercent?: number;
  spotlightAllId: number;
  companyId: number;
}

export interface ItemSpotlightDetailsForCreateUpdateByCategoryDto {
  discountValue?: number;
  discountPercent?: number;
  spotlightAllId: number;
  categoryId: number;
}
