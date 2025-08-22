import { toast } from 'sonner';
import { Tag, TagResponse } from '@/types/tag';
import { API_BASE_URL, Public_API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';
import { FormValues } from '@/components/tags/TagFormFields';

export const fetchTags = async (): Promise<Tag[]> => {
  try {
    console.log('[TagService] Fetching tags...');
    const response = await fetch(`${Public_API_BASE_URL}/Tag/GetAllTags/1`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: TagResponse = await response.json();
    
    if (data.result.code !== 200) {
      throw new Error(data.result.message);
    }
    
    return data.data;
  } catch (error) {
    console.error('[TagService] Error fetching tags:', error);
    toast.error('Failed to load tags');
    throw error;
  }
};

export const getTagById = async (id: number): Promise<Tag> => {
  try {
    const response = await fetch(`${Public_API_BASE_URL}/Tag/GetTagById/1/${id}`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('[TagService] Error fetching tag:', error);
    toast.error('Failed to load tag');
    throw error;
  }
};

export const getValidTagId = async (): Promise<number> => {
  try {
    console.log('[TagService] Getting valid ID for tag');
    const response = await fetch(`${API_BASE_URL}/Tag/GetValidId/1`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
   
    
    console.log('[TagService] Got valid ID:', data);
    return data;
  } catch (error) {
    console.error('[TagService] Error getting valid ID:', error);
    toast.error('Failed to get valid ID for new tag');
    throw error;
  }
};

export const createTag = async (tag: FormValues): Promise<Tag> => {
  try {
    // Get valid ID first
    const validId = await getValidTagId();
    console.log('[TagService] Creating tag with ID:', validId);
    
    const tagWithId = {
      ...tag,
      id: validId
    };

    const response = await fetch(`${API_BASE_URL}/Tag/CreateTag/1`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tagWithId)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[TagService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('[TagService] Create response:', data);
    return data.data;
  } catch (error) {
    console.error('[TagService] Error creating tag:', error);
    toast.error('Failed to create tag');
    throw error;
  }
};

export const updateTag = async (id: number, tag: FormValues): Promise<Tag> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Tag/UpdateTag/1`, {
      method: 'PUT',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ ...tag, id })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('[TagService] Error updating tag:', error);
    toast.error('Failed to update tag');
    throw error;
  }
};

export const deleteTag = async (id: number): Promise<void> => {
  try {
    console.log('[TagService] Deleting tag:', id);
    const response = await fetch(`${API_BASE_URL}/Tag/DeleteTag/1/${id}`, {
      method: 'DELETE',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[TagService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (data.result.code !== 200) {
      throw new Error(data.result.message || 'Failed to delete tag');
    }

  } catch (error) {
    console.error('[TagService] Error deleting tag:', error);
    toast.error('Failed to delete tag');
    throw error;
  }
}; 