import { toast } from 'sonner';
import { StoreSettings, StoreSettingsResponse } from '@/types/store-settings';
import { API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';

export const storeSettingsService = {
  getSettings: async (): Promise<StoreSettings> => {
    try {
      console.log('[StoreSettingsService] Fetching store settings...');
      const response = await fetch(
        `${API_BASE_URL}/StoreSetting/GetStoreSettingByStoreId/1`,
        {
          headers: authService.getAuthHeaders()
        }
      );
      
      const data: StoreSettingsResponse = await response.json();
      console.log('[StoreSettingsService] Get settings response:', data);
      
      if (data.result.code !== 200) {
        throw new Error(data.result.message || 'Failed to fetch store settings');
      }
      
      return data.data;
    } catch (error) {
      console.error('[StoreSettingsService] Error fetching store settings:', error);
      toast.error('Failed to load store settings');
      throw error;
    }
  },

  updateSettings: async (settings: StoreSettings): Promise<StoreSettings> => {
    try {
      console.log('[StoreSettingsService] Updating store settings...', settings);
      const response = await fetch(
        `${API_BASE_URL}/StoreSetting/UpdateStoreSetting/1`,
        {
          method: 'PUT',
          headers: {
            ...authService.getAuthHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(settings)
        }
      );
      
      const data: StoreSettingsResponse = await response.json();
      console.log('[StoreSettingsService] Update settings response:', data);
      
      if (data.result.code !== 200) {
        throw new Error(data.result.message || 'Failed to update store settings');
      }
      
      toast.success('Store settings updated successfully');
      return data.data;
    } catch (error) {
      console.error('[StoreSettingsService] Error updating store settings:', error);
      toast.error('Failed to update store settings');
      throw error;
    }
  }
}; 