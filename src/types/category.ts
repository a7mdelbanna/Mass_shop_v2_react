import { z } from 'zod';
import { Company } from './company';

interface BaseCategory {
  nameEN: string;
  nameAR: string;
  noteEN: string | null;
  noteAR: string | null;
  arrange: number;
}

// Create/Update request payload
export interface CategoryRequest extends BaseCategory {
  id: number;
}

// Display/List view interface with full data
export interface Category extends BaseCategory {
  id: number;
  categoryImageURL : string;
  isActive: boolean;
  createdAtDate: string;
  createdAtTime: string;
  modifiedAtDate: string | null;
  modifiedAtTime: string | null;
}

// API Response types
export interface CategoryResponse {
  result: {
    code: number;
    message: string;
  };
  data: Category[];
}

export interface SingleCategoryResponse {
  result: {
    code: number;
    message: string;
  };
  data: Category;
}

// Form validation schemas
export const categoryRequestSchema = z.object({
  id: z.number(),
  nameEN: z.string(),
  nameAR: z.string(),
  noteEN: z.string().nullable(),
  noteAR: z.string().nullable(),
  arrange: z.number().min(0, { message: "Display order must be 0 or greater" }),
});

// Form value types
export type CategoryFormValues = z.infer<typeof categoryRequestSchema>;

// Type for creating a new category (id will be 0)
export type CreateCategoryRequest = Omit<CategoryRequest, 'id'> & { id: 0 };

// Type for updating an existing category
export type UpdateCategoryRequest = CategoryRequest; 