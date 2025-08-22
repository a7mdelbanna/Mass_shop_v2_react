import { z } from 'zod';
import { MainCategory } from './main-category';

interface BaseSubCategory {
  nameEN: string;
  nameAR: string;
  noteEN: string | null;
  noteAR: string | null;
  arrange: number;
  mainCategoryId: number;
}

// Create/Update request payload
export interface SubCategoryRequest extends BaseSubCategory {
  id: number;
}

// Display/List view interface with full data
export interface SubCategory extends BaseSubCategory {
  id: number;
  isActive: boolean;
  createdAtDate: string;
  createdAtTime: string;
  modifiedAtDate: string | null;
  modifiedAtTime: string | null;
  mainCategory: MainCategory;
}

// API Response types
export interface SubCategoryResponse {
  result: {
    code: number;
    message: string;
  };
  data: SubCategory[];
}

export interface SingleSubCategoryResponse {
  result: {
    code: number;
    message: string;
  };
  data: SubCategory;
}

// Form validation schemas
export const subCategoryRequestSchema = z.object({
  id: z.number(),
  nameEN: z.string(),
  nameAR: z.string(),
  noteEN: z.string().nullable(),
  noteAR: z.string().nullable(),
  arrange: z.number().min(0, { message: "Display order must be 0 or greater" }),
  mainCategoryId: z.number().min(1, { message: "Please select a main category" })
});

// Form value types
export type SubCategoryFormValues = z.infer<typeof subCategoryRequestSchema>;

// Type for creating a new sub-category (id will be 0)
export type CreateSubCategoryRequest = Omit<SubCategoryRequest, 'id'> & { id: 0 };

// Type for updating an existing sub-category
export type UpdateSubCategoryRequest = SubCategoryRequest; 