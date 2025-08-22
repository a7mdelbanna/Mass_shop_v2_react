import { z } from 'zod';

// Base interface for common fields
interface BaseItemUnit {
  nameEN: string;
  nameAR: string;
  amount: number;
}

// Create/Update request payload
export interface ItemUnitRequest extends BaseItemUnit {
  id: number;
}

// Display/List view interface with full data
export interface ItemUnit extends BaseItemUnit {
  id: number;
  createdAtDate: string;
  createdAtTime: string;
  modifiedAtDate: string | null;
  modifiedAtTime: string | null;
}

// Form validation schema
export const itemUnitRequestSchema = z.object({
  id: z.number(),
  nameEN: z.string(),
  nameAR: z.string(),
  amount: z.number().min(0, { message: "Amount must be 0 or greater" })
});

// Form value types
export type ItemUnitFormValues = z.infer<typeof itemUnitRequestSchema>;

// Type for creating a new item unit (id will be 0)
export type CreateItemUnitRequest = Omit<ItemUnitRequest, 'id'> & { id: 0 };

// Type for updating an existing item unit
export type UpdateItemUnitRequest = ItemUnitRequest;

export interface ItemUnitResponse {
  result: {
    code: number;
    message: string;
  };
  data: ItemUnit[];
}

export interface SingleItemUnitResponse {
  result: {
    code: number;
    message: string;
  };
  data: ItemUnit;
}
