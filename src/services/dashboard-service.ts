import { toast } from 'sonner';
import { Tag, TagResponse } from '@/types/tag';
import { API_BASE_URL, Public_API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';
import { FormValues } from '@/components/tags/TagFormFields';
import { Summary } from '@/types/dashboard';



export const getSummary = async (): Promise<Summary> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Dashboard/Summary/1/`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    toast.error('Failed to load tag');
    throw error;
  }
};

