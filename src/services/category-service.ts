import { toast } from 'sonner';
import {
  Category,
  CategoryResponse,
  SingleCategoryResponse,
  CategoryRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '@/types/category';
import { API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Category/GetAllCategories/1`, {
      headers: authService.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data: CategoryResponse = await response.json();
    if (data.result.code !== 200) {
      throw new Error(data.result.message);
    }
    return data.data;
  } catch (error) {
    toast.error('Failed to load categories');
    throw error;
  }
};

export const fetchCategoryById = async (id: number): Promise<Category> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Category/GetCategoryById/1/${id}`, {
      headers: authService.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data: SingleCategoryResponse = await response.json();
    if (data.result.code !== 200) {
      throw new Error(data.result.message);
    }
    return data.data;
  } catch (error) {
    toast.error('Failed to load category');
    throw error;
  }
};

export const getValidCategoryId = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Category/GetValidId/1`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    
    return data;
  } catch (error) {
    console.error('[SubCategoryService] Error getting valid ID:', error);
    toast.error('Failed to get valid ID for new sub category');
    throw error;
  }
};

export const createCategory = async (category: CreateCategoryRequest): Promise<{category: Category, message: string}> => {
  try {
    const validId = await getValidCategoryId();
    const categoryWithId = {
      ...category,
      id: validId
    };
    const response = await fetch(`${API_BASE_URL}/Category/CreateCategory/1`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(categoryWithId)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data: SingleCategoryResponse = await response.json();
    if (data.result.code !== 200 && data.result.code !== 201) {
      throw new Error(data.result.message);
    }
    return { category: data.data, message: data.result.message };
  } catch (error) {
    toast.error('Failed to create category');
    throw error;
  }
};

export const updateCategory = async (category: UpdateCategoryRequest): Promise<{category: Category, message: string}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Category/UpdateCategory/1`, {
      method: 'PUT',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data: SingleCategoryResponse = await response.json();
    if (data.result.code !== 200 && data.result.code !== 201) {
      throw new Error(data.result.message);
    }
    return { category: data.data, message: data.result.message };
  } catch (error) {
    toast.error('Failed to update category');
    throw error;
  }
};

export const deleteCategory = async (id: number): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Category/DeleteCategory/1/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders()
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    if (data.result.code !== 200) {
      throw new Error(data.result.message);
    }
    return data.result.message;
  } catch (error) {
    toast.error('Failed to delete category');
    throw error;
  }
};

export const uploadCategoryImage = async (
  storeId: string,
  formData: FormData
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Category/UploadImageForCategory/${storeId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authService.getToken()}`
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('[CategoryService] Error uploading category image:', error);
    toast.error('Failed to upload category image');
    throw error;
  }
};

export const toggleCategoryStatus = async (id: number): Promise<Category> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Category/ToggleCategoryStatus/1/${id}`, {
      method: 'PUT',
      headers: authService.getAuthHeaders()
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data: SingleCategoryResponse = await response.json();
    if (data.result.code !== 200) {
      throw new Error(data.result.message);
    }
    return data.data;
  } catch (error) {
    toast.error('Failed to toggle category status');
    throw error;
  }
};

export const fetchCategoriesByCompanyId = async (companyId: number): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Category/GetAllCategoriesByCompanyId/1/${companyId}`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data: CategoryResponse = await response.json();
    if (data.result.code !== 200) {
      throw new Error(data.result.message);
    }
    return data.data;
  } catch (error) {
    toast.error('Failed to load categories for company');
    throw error;
  }
}; 