import { toast } from 'sonner';
import { API_BASE_URL, Public_API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';
import { Area, AreaResponse, City, CityResponse, FullAddress, ShopAddressByArea, ShopAddressByDistance, SingleAddressResponse } from '@/types/address';
import { sweetAlert } from '@/utils/alert';

async function checkResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
  }
  const data = await response.json();
  if (data.result && data.result.code !== 200) {
    throw new Error(data.result.message || 'API returned error');
  }
  return data;
}

export const fetchCities = async (): Promise<City[]> => {
  try {
    console.log('[CompanyService] Fetching companies...');
    const response = await fetch(`${Public_API_BASE_URL}/City/GetAllCities/1`, {
      headers: authService.getAuthHeaders(),
    });

    const data: CityResponse = await checkResponse(response);
    return data.data;
  } catch (error) {
    console.error('[CompanyService] Error fetching companies:', error);
    toast.error('Failed to load companies');
    throw error;
  }
};


export const fetchAreas = async (): Promise<Area[]> => {
  try {
    console.log('[CompanyService] Fetching companies...');
    const response = await fetch(`${Public_API_BASE_URL}/Area/GetAllAreas/1`, {
      headers: authService.getAuthHeaders(),
    });
    const data: AreaResponse = await checkResponse(response);
    return data.data;
  } catch (error) {
    console.error('[CompanyService] Error fetching companies:', error);
    toast.error('Failed to load companies');
    throw error;
  }
};



export const getStoreAddress = async (): Promise<FullAddress> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Address/GetStoreAddress/1`, {
      headers: authService.getAuthHeaders(),
    });
    const data: SingleAddressResponse = await checkResponse(response);
    return data.data;
  } catch (error) {
    console.error('[CompanyService] Error fetching company:', error);
   
  }
};
export const createShopAddressByArea = async (address: ShopAddressByArea): Promise<FullAddress> => {
  try {
    const validId = await getValidAddressId();
    console.log(validId);
    const addressWithId = { ...address, id: validId };
    const response = await fetch(`${API_BASE_URL}/Address/CraeteStoreAddressByArea/1`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressWithId),
    });
    const data: SingleAddressResponse = await response.json();

    if (!response.ok || data.result.code !== 201) {
      throw new Error(data.result.message || 'Failed to create address');
    }

    return data.data as FullAddress;
  } catch (error: any) {
    console.error('[ShopService] Error creating address by area:', error);
    toast.error(error.message || 'Failed to create shop address by area');
    throw error;
  }
};

export const createShopAddressByDistance = async (address: ShopAddressByDistance): Promise<ShopAddressByDistance> => {
  try {
    const validId = await getValidAddressId();
    const addressWithId = { ...address, id: validId };
    const response = await fetch(`${API_BASE_URL}/Address/CraeteStoreAddressByDistance/1`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressWithId),
    });

    const data: SingleAddressResponse = await response.json();

    if (!response.ok || data.result.code !== 201) {
      throw new Error(data.result.message || 'Failed to create address');
    }

    return data.data as FullAddress;
  } catch (error: any) {
    console.error('[ShopService] Error creating address by distance:', error);
    toast.error(error.message || 'Failed to create shop address by distance');
    throw error;
  }
};


export const getValidAddressId = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Address/GetValidId/1`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ItemUnitService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    if (data.result && data.result.code !== 200) {
      throw new Error(data.result.message || 'API returned error');
    }
    console.log('[CompanyService] Got valid ID:', data);
    return data;
  } catch (error) {
    console.error('[CompanyService] Error getting valid ID:', error);
    toast.error('Failed to get valid ID for new company');
    throw error;
  }
};

export const confirmAddressLocation = async (
  addressId: number,
  locationLat: number,
  locationLong: number,
  address: string
): Promise<void> => {
  try {
    const dto = {
      addressId,
      locationLat: locationLat.toString(),
      locationLong: locationLong.toString(),
      address,
    };
    const response = await fetch(`${API_BASE_URL}/Address/ConfirmAddressLocation/1`, {
      method: 'POST',
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
  } catch (error) {
    toast.error('Failed to confirm address location');
    throw error;
  }
};


