import { Category } from "./category";

export interface Company {
  id: number;
  nameEn: string;
  nameAr: string;
  noteEN: string;
  noteAR: string;
  imageUrl : string;
  categories : Category[];
  createdAtDate: string;
  createdAtTime: string;
  modifiedAtDate: string | null;
  modifiedAtTime: string | null;
}

export interface CompanyResponse {
  result: {
    code: number;
    message: string;
  };
  data: Company[];
} 

export interface SingleCompanyResponse {
  result: {
    code: number;
    message: string;
  };
  data: Company;
} 