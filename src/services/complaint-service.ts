import { toast } from 'sonner';
import { Complaint, ComplaintResponse } from '@/types/complaint';
import { API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';

export const ComplaintService = {
  getAll: async (): Promise<ComplaintResponse> => {
    try {
      console.log('[ComplaintService] Fetching Complaints...');
      const response = await fetch(
        `${API_BASE_URL}/Complaint/GetAllComplaints/1`,
        {
          headers: authService.getAuthHeaders()
        }
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data: ComplaintResponse = await response.json();
      
      if (data.result?.code !== 200) {
        throw new Error(data.result?.message || 'Failed to fetch Complaints');
      }
      
      return data;
    } catch (error) {
      console.error('[CustomersService] Error fetching Complaints:', error);
      toast.error('Failed to load Complaints');
      throw error;
    }
  },


}; 