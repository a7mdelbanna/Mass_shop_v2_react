import { toast } from 'sonner';
import { SubCategory, SubCategoryResponse, SingleSubCategoryResponse, CreateSubCategoryRequest, UpdateSubCategoryRequest } from '@/types/sub-category';
import { API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';

export const fetchSubCategories = async (): Promise<SubCategory[]> => {
  try {
    console.log('[SubCategoryService] Fetching sub categories...');
    const response = await fetch(`${API_BASE_URL}/SubCategory/GetAllSubCategories/1`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: SubCategoryResponse = await response.json();
    
    if (data.result.code !== 200) {
      throw new Error(data.result.message);
    }
    
    return data.data;
  } catch (error) {
    console.error('[SubCategoryService] Error fetching sub categories:', error);
    toast.error('Failed to load sub categories');
    throw error;
  }
};

export const getSubCategoryById = async (id: number): Promise<SubCategory> => {
  try {
    const response = await fetch(`${API_BASE_URL}/SubCategory/GetSubCategoryById/1/${id}`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('[SubCategoryService] Error fetching sub category:', error);
    toast.error('Failed to load sub category');
    throw error;
  }
};

export const getValidSubCategoryId = async (): Promise<number> => {
  try {
    console.log('[SubCategoryService] Getting valid ID for sub category');
    const response = await fetch(`${API_BASE_URL}/SubCategory/GetValidId/1`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    
    console.log('[SubCategoryService] Got valid ID:', data);
    return data;
  } catch (error) {
    console.error('[SubCategoryService] Error getting valid ID:', error);
    toast.error('Failed to get valid ID for new sub category');
    throw error;
  }
};

export const createSubCategory = async (category: CreateSubCategoryRequest): Promise<SubCategory> => {
  try {
    const validId = await getValidSubCategoryId();
    console.log('[MainCategoryService] Creating main category with ID:', validId);
    const categoryWithId = {
      ...category,
      id: validId
    };

    const response = await fetch(`${API_BASE_URL}/SubCategory/CreateSubCategory/1`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(categoryWithId)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[SubCategoryService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    const data: SingleSubCategoryResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('[SubCategoryService] Error creating sub category:', error);
    toast.error('Failed to create sub category');
    throw error;
  }
};

export const updateSubCategory = async (id: number, category: UpdateSubCategoryRequest): Promise<SubCategory> => {
  try {
    const response = await fetch(`${API_BASE_URL}/SubCategory/UpdateSubCategory/1`, {
      method: 'PUT',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[SubCategoryService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    const data: SingleSubCategoryResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('[SubCategoryService] Error updating sub category:', error);
    toast.error('Failed to update sub category');
    throw error;
  }
};

export const deleteSubCategory = async (id: number): Promise<void> => {
  try {
    console.log('[SubCategoryService] Deleting sub category:', id);
    const response = await fetch(`${API_BASE_URL}/SubCategory/DeleteSubCategory/1/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to delete sub category (Status: ${response.status})`);
    }

    console.log('[SubCategoryService] Delete successful');
  } catch (error) {
    console.error('[SubCategoryService] Error deleting sub category:', error);
    toast.error('Failed to delete sub category');
    throw error;
  }
}; 