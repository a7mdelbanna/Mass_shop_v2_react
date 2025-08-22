import { toast } from 'sonner';
import { MainCategory, MainCategoryResponse } from '@/types/main-category';
import { API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';
import { FormValues } from '@/components/main-categories/MainCategoryFormFields';

export const fetchMainCategories = async (): Promise<MainCategory[]> => {
  try {
    console.log('[MainCategoryService] Fetching main categories...');
    const response = await fetch(`${API_BASE_URL}/MainCategory/GetAllMainCategories/1`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: MainCategoryResponse = await response.json();
    
    if (data.result.code !== 200) {
      throw new Error(data.result.message);
    }
    
    return data.data;
  } catch (error) {
    console.error('[MainCategoryService] Error fetching main categories:', error);
    toast.error('Failed to load main categories');
    throw error;
  }
};

export const getMainCategoryById = async (id: number): Promise<MainCategory> => {
  try {
    const response = await fetch(`${API_BASE_URL}/MainCategory/GetMainCategoryById/1/${id}`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('[MainCategoryService] Error fetching main category:', error);
    toast.error('Failed to load main category');
    throw error;
  }
};

export const getValidMainCategoryId = async (): Promise<number> => {
  try {
    console.log('[MainCategoryService] Getting valid ID for main category');
    const response = await fetch(`${API_BASE_URL}/MainCategory/GetValidId/1`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
   
    
    console.log('[MainCategoryService] Got valid ID:', data);
    return data;
  } catch (error) {
    console.error('[MainCategoryService] Error getting valid ID:', error);
    toast.error('Failed to get valid ID for new category');
    throw error;
  }
};

export const createMainCategory = async (category:FormValues): Promise<MainCategory> => {
  try {
    // Get valid ID first
    const validId = await getValidMainCategoryId();
    console.log('[MainCategoryService] Creating main category with ID:', validId);
    
    const categoryWithId = {
      ...category,
      id: validId
    };

    const response = await fetch(`${API_BASE_URL}/MainCategory/CreateMainCategory/1`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(categoryWithId)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[MainCategoryService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('[MainCategoryService] Create response:', data);
    return data.data;
  } catch (error) {
    console.error('[MainCategoryService] Error creating main category:', error);
    toast.error('Failed to create main category');
    throw error;
  }
};

export const updateMainCategory = async (id: number, category:FormValues): Promise<MainCategory> => {
  try {
    const response = await fetch(`${API_BASE_URL}/MainCategory/UpdateMainCategory/1`, {
      method: 'PUT',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ ...category, id })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('[MainCategoryService] Error updating main category:', error);
    toast.error('Failed to update main category');
    throw error;
  }
};

export const deleteMainCategory = async (id: number): Promise<void> => {
  try {
    console.log('[MainCategoryService] Deleting main category:', id);
    const response = await fetch(`${API_BASE_URL}/MainCategory/DeleteMainCategory/1/${id}`, {
      method: 'DELETE',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[MainCategoryService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (data.result.code !== 200) {
      throw new Error(data.result.message || 'Failed to delete category');
    }

    console.log('[MainCategoryService] Delete response:', data);
  } catch (error) {
    console.error('[MainCategoryService] Error deleting main category:', error);
    toast.error('Failed to delete main category');
    throw error;
  }
}; 