import { Company } from "./company";
import { ItemUnit } from "./item-unit";
import { Category } from "./category";
import { Notice } from "./notice";
import { SubCategory } from "./sub-category";
import { Tag } from "./tag";
import { Flavour } from "@/services/flavour-service";

/**
 * Enum for product expiration types.
 */
export enum ExpirationType {
  Day = 1,
  Week = 2,
  Month = 3,
  Year = 4
}

/*
*
 * Retail product type for retail product forms and API.
 */

export interface RetailProduct {
  id: number;
  nameEN: string;
  nameAR: string;
  descriptionEN: string | null;
  descriptionAR: string | null;
  bigUnitId: number;
  bigUnitPrice: number | null;
  bigUnitSpecialPrice: number | null;
  smallUnitId: number;
  smallUnitPrice: number | null;
  smallUnitSpecialPrice: number | null;
  taxPrcent: number;
  vatPrcent: number;
  per: string | null;
  calories: number | null;
  protein: number | null;
  fat: number | null;
  carbohydrates: number | null;
  expiration: number;
  expirationType: ExpirationType | null;
  isSoldByWeight: boolean;
  isSellByCustomValue: boolean;
  maximumAmountForUser: number | null;
  subCategoryId: number | null;
  categoryId: number | null;
  tagIds: number[];
  noticeIds: number[];
}

/**
 * Wholesale product type for wholesale product forms and API.
 */
export interface WholeSaleProduct {
  id: number;
  nameEN: string;
  nameAR: string;
  descriptionEN: string | null;
  descriptionAR: string | null;
  bigUnitId: number;
  bigUnitPrice: number | null;
  bigUnitSpecialPrice: number | null;
  smallUnitId: number;
  smallUnitPrice: number | null;
  smallUnitSpecialPrice: number | null;
  taxPrcent: number;
  vatPrcent: number;
  per: number | null;
  calories: number | null;
  protein: number | null;
  fat: number | null;
  carbohydrates: number | null;
  expiration: number;
  expirationType: ExpirationType | null;
  isSoldByWeight: boolean;
  isSellByCustomValue: boolean;
  customValue: number;
  maximumAmountForUser: number | null;
  isMaximumAmountForUser?: boolean | null;
  companyId: number | null;
  categoryId: number | null;
  tagIds: number[];
  noticeIds: number[];
  /** New field */
  flavourIds: number[];
}
/**
 * Full product type with all related data, used for product details and tables.
 */
export interface FullProduct {
  id: number;
  nameEN: string;
  nameAR: string;
  descriptionEN: string | null;
  descriptionAR: string | null;
  itemAmount: number;
  bigUnit: ItemUnit;
  bigUnitPrice: number | null;
  bigUnitSpecialPrice: number | null;
  smallUnit: ItemUnit;
  smallUnitPrice: number | null;
  smallUnitSpecialPrice: number | null;
  taxPrcent: number;
  vatPrcent: number;
  per: string | null;
  calories: number | null;
  protein: number | null;
  fat: number | null;
  carbohydrates: number | null;
  expiration: number;
  expirationType: string;
  isSoldByWeight: boolean;
  isSellByCustomValue: boolean;
  customValue: number;
  maximumAmountForUser: number | null;
  isMaximumAmountForUser?: boolean | null;
  category: Category | null;
  subCategory: SubCategory | null;
  company: Company | null;
  tags: Tag[];
  tagIds: number[];
  notices: Notice[];
  noticeIds: number[];
  /** New fields */
  flavours?: Flavour[];
  flavourIds?: number[];
  itemImageForBigUnit?: string | null;
  itemImageForBigUnitUrl?: string | null;
  itemImageForBigUnitFileLength?: number | null;
  itemImageForSmallUnit?: string | null;
  itemImageForSmallUnitUrl?: string | null;
  itemImageForSmallUnitFileLength?: number | null;
}

/**
 * Response type for image upload API.
 */
export interface UploadImageResponse {
  result: {
    code: number;
    message: string;
  };
  data: string;
}

/**
 * Response type for single product API.
 */
export interface SingleProductResponse {
  result: {
    code: number;
    message: string;
  };
  data: FullProduct;
}

/**
 * Response type for multiple products API.
 */
export interface ProductResponse {
  result: {
    code: number;
    message: string;
  };
  data: FullProduct[];
}

/**
 * Response type for paginated product API.
 */
export interface PaginatedProductResponse {
  data: FullProduct[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  result: {
    code: number;
    message: string;
  };
}

/**
 * Query params for product list API.
 */
export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  itemName?: string;
  tagName?: string;
  description?: string;
  sku?: string;
  searchTerm?: string;
  itemCategoryId?: number;
  mainGroupId?: number;
  companyId?: number;
  minAvailableAmount?: number;
  maxAvailableAmount?: number;
  isSoldByWeight?: boolean;
  isSellByCustomValue?: boolean;
}
