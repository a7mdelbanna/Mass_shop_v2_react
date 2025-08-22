import { toast } from 'sonner';
import { ItemUnit, ItemUnitResponse, SingleItemUnitResponse, CreateItemUnitRequest, UpdateItemUnitRequest } from '@/types/item-unit';
import { API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';

export const fetchItemUnits = async (): Promise<ItemUnit[]> => {
  try {
    console.log('[ItemUnitService] Fetching item units...');
    const response = await fetch(`${API_BASE_URL}/ItemUnit/GetAllItemUnits/1`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: ItemUnitResponse = await response.json();
    
    if (data.result.code !== 200) {
      throw new Error(data.result.message);
    }
    
    return data.data;
  } catch (error) {
    console.error('[ItemUnitService] Error fetching item units:', error);
    toast.error('Failed to load item units');
    throw error;
  }
};

export const deleteItemUnit = async (id: number): Promise<string> => {
  try {
    console.log('[ItemUnitService] Deleting item unit:', id);
    const response = await fetch(`${API_BASE_URL}/ItemUnit/DeleteItemUnit/1/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to delete unit (Status: ${response.status})`);
    }
    const data = await response.json();
    return data.result.message;
  } catch (error) {
    console.error('[ItemUnitService] Error deleting item unit:', error);
    toast.error('Failed to delete item unit');
    throw error;
  }
};

export const getItemUnitById = async (id: number): Promise<ItemUnit> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemUnit/GetItemUnitById/1/${id}`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('[ItemUnitService] Error fetching item unit:', error);
    toast.error('Failed to load item unit');
    throw error;
  }
};

export const getValidItemUnitId = async (): Promise<number> => {
  try {
    console.log('[ItemUnitService] Getting valid ID for item unit');
    const response = await fetch(`${API_BASE_URL}/ItemUnit/GetValidId/1`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
  
    
    console.log('[ItemUnitService] Got valid ID:', data);
    return data;
  } catch (error) {
    console.error('[ItemUnitService] Error getting valid ID:', error);
    toast.error('Failed to get valid ID for new unit');
    throw error;
  }
};

export const createItemUnit = async (itemUnit: CreateItemUnitRequest): Promise<SingleItemUnitResponse> => {
  try {
    const validId = await getValidItemUnitId();
    const unitWithId = {
      ...itemUnit,
      id: validId
    };
    const response = await fetch(`${API_BASE_URL}/ItemUnit/CreateItemUnit/1`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(unitWithId)
    });
    
    
    const data: SingleItemUnitResponse = await response.json();
    return data;
  } catch (error) {
    console.error('[ItemUnitService] Error creating item unit:', error);
    toast.error('Failed to create item unit');
    throw error;
  }
};

export const updateItemUnit = async (id: number, category: UpdateItemUnitRequest): Promise<SingleItemUnitResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemUnit/UpdateItemUnit/1`, {
      method: 'PUT',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ItemUnitService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    const data: SingleItemUnitResponse = await response.json();
    return data;
  } catch (error) {
    console.error('[ItemUnitService] Error updating item unit:', error);
    toast.error('Failed to update item unit');
    throw error;
  }
};
