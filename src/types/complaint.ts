import { Customer } from "./customer";

export interface Complaint {
  id: string;
  details: string;
  imageURL: string;
  filePath: string;
  type: string;
  status: string;
  user: Customer;
  assignedToName: string;
}

export interface ApiResult {
  code: number;
  message: string;
}

export interface ComplaintResponse {
  data: Complaint[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  result: ApiResult;
} 