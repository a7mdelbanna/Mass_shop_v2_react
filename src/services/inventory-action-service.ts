import { toast } from 'sonner';
import { InventoryAction, MakeInventoryAction, BulkInventoryAction, InventoryActionResponse, SingleInventoryActionResponse } from '@/types/inventory';
import { API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';
import { FormValues } from '@/components/main-categories/MainCategoryFormFields';

export const fetchInventoryActionLogs = async (): Promise<InventoryAction[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Inventory/GetAllInventoryActionLogs/1`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: InventoryActionResponse = await response.json();
    
    if (data.result.code !== 200) {
      throw new Error(data.result.message);
    }
    
    return data.data;
  } catch (error) {
    toast.error('Failed to load inventory actions');
    throw error;
  }
};


export const makeInventoryAction = async (inventoryAction:FormValues): Promise<SingleInventoryActionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Inventory/MakeInventoryAction/1`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(inventoryAction)
    });
    
    const data: SingleInventoryActionResponse = await response.json();
    
    // Handle both 200 and 201 status codes as success
    if (!response.ok || (data.result.code !== 200 && data.result.code !== 201)) {
      throw new Error(data.result.message || 'Unexpected error occurred');
    }
    
    return data;
  } catch (error) {
    toast.error(error.message || 'Failed to make inventory action');
    throw error;
  }
};

export const applyBulkInventoryAction = async (bulkAction: BulkInventoryAction): Promise<InventoryActionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Inventory/ApplyInventoryAction/1`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bulkAction)
    });
    
    const data: InventoryActionResponse = await response.json();
    
    // Handle both 200 and 201 status codes as success
    if (!response.ok || (data.result.code !== 200 && data.result.code !== 201)) {
      throw new Error(data.result.message || 'Unexpected error occurred');
    }
    
    toast.success('Bulk inventory action applied successfully');
    return data;
  } catch (error) {
    toast.error(error.message || 'Failed to apply bulk inventory action');
    throw error;
  }
};
