import { toast } from 'sonner';
import { ItemBarcode, ItemBarcodeForCreateUpdate, ItemBarcodeResponse } from '@/types/item-barcode';
import { API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';

export const fetchItemBarcodes = async (): Promise<ItemBarcode[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemBarcode/GetAllItemBarcodes/1`, {
      headers: authService.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: ItemBarcodeResponse = await response.json();
    
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
