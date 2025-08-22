import { NotificationSettingDto, NotificationSettingResponse } from '@/types/notification-setting';
import { API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';

export const fetchNotificationSetting = async (storeId: string): Promise<{ setting: NotificationSettingDto, message: string }> => {
  const response = await fetch(`${API_BASE_URL}/NotificationSetting/GetNotificationSettingByStoreId/${storeId}`, {
    headers: authService.getAuthHeaders(),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
  }
  const data: NotificationSettingResponse = await response.json();
  if (data.result.code !== 200) {
    throw new Error(data.result.message);
  }
  return { setting: data.data, message: data.result.message };
};

export const updateNotificationSetting = async (storeId: string, dto: NotificationSettingDto): Promise<{ setting: NotificationSettingDto, message: string }> => {
  const response = await fetch(`${API_BASE_URL}/NotificationSetting/UpdateNotificationSetting/${storeId}`, {
    method: 'PUT',
    headers: {
      ...authService.getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
  }
  const data: NotificationSettingResponse = await response.json();
  if (data.result.code !== 200) {
    throw new Error(data.result.message);
  }
  return { setting: data.data, message: data.result.message };
}; 