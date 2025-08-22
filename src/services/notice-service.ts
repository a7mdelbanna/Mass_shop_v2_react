import { toast } from 'sonner';
import { Notice, NoticeResponse } from '@/types/notice';
import { API_BASE_URL, Public_API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';
import { FormValues } from '@/components/notices/NoticeFormFields';

export const fetchNotices = async (): Promise<Notice[]> => {
  try {
    console.log('[NoticeService] Fetching Notices...');
    const response = await fetch(`${Public_API_BASE_URL}/Notice/GetAllNotices/1`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: NoticeResponse = await response.json();
    
    if (data.result.code !== 200) {
      throw new Error(data.result.message);
    }
    
    return data.data;
  } catch (error) {
    console.error('[NoticeService] Error fetching Notices:', error);
    toast.error('Failed to load Notices');
    throw error;
  }
};

export const getNoticeById = async (id: number): Promise<Notice> => {
  try {
    const response = await fetch(`${Public_API_BASE_URL}/Notice/GetNoticeById/1/${id}`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('[NoticeService] Error fetching Notice:', error);
    toast.error('Failed to load Notice');
    throw error;
  }
};

export const getValidNoticeId = async (): Promise<number> => {
  try {
    console.log('[NoticeService] Getting valid ID for Notice');
    const response = await fetch(`${API_BASE_URL}/Notice/GetValidId/1`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
   
    
    console.log('[NoticeService] Got valid ID:', data);
    return data;
  } catch (error) {
    console.error('[NoticeService] Error getting valid ID:', error);
    toast.error('Failed to get valid ID for new Notice');
    throw error;
  }
};

export const createNotice = async (Notice: FormValues): Promise<Notice> => {
  try {
    // Get valid ID first
    const validId = await getValidNoticeId();
    console.log('[NoticeService] Creating Notice with ID:', validId);
    
    const NoticeWithId = {
      ...Notice,
      id: validId
    };

    const response = await fetch(`${API_BASE_URL}/Notice/CreateNotice/1`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(NoticeWithId)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[NoticeService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('[NoticeService] Create response:', data);
    return data.data;
  } catch (error) {
    console.error('[NoticeService] Error creating Notice:', error);
    toast.error('Failed to create Notice');
    throw error;
  }
};

export const updateNotice = async (id: number, Notice: FormValues): Promise<Notice> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Notice/UpdateNotice/1`, {
      method: 'PUT',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ ...Notice, id })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('[NoticeService] Error updating Notice:', error);
    toast.error('Failed to update Notice');
    throw error;
  }
};

export const deleteNotice = async (id: number): Promise<void> => {
  try {
    console.log('[NoticeService] Deleting Notice:', id);
    const response = await fetch(`${API_BASE_URL}/Notice/DeleteNotice/1/${id}`, {
      method: 'DELETE',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[NoticeService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (data.result.code !== 200) {
      throw new Error(data.result.message || 'Failed to delete Notice');
    }

  } catch (error) {
    console.error('[NoticeService] Error deleting Notice:', error);
    toast.error('Failed to delete Notice');
    throw error;
  }
}; 