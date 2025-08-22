import { toast } from 'sonner';
import {
  DeliveryFeeByAreaDto,
  DeliveryFeeByAreaResponse,
  DeliveryFeeByDistanceDto,
  DeliveryFeeByDistanceForCreateUpdateDto,
  DeliveryFeeByDistanceForUpdateDto,
  DeliveryFeeByDistanceResponse,
  DeliveryFeeByMainAreaForCreateUpdateDto,
  DeliveryFeeBySubAreaForCreateUpdateDto,
  DeliveryFeeBySubAreaForUpdateDto,
  DeliveryFeeByMainAreaDto
} from '@/types/delivery-fee';
import { API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';

export const fetchDeliveryFeesByDistance = async (storeId: string): Promise<DeliveryFeeByDistanceDto[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DeliveryFee/GetAllDeliveryFeesByDistance/${storeId}`, {
      headers: authService.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data: DeliveryFeeByDistanceResponse = await response.json();
    if (data.result.code !== 200) {
      throw new Error(data.result.message);
    }
    return data.data;
  } catch (error) {
    toast.error('Failed to load delivery fees by distance');
    throw error;
  }
};

export const fetchDeliveryFeesByArea = async (storeId: string): Promise<DeliveryFeeByAreaDto[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DeliveryFee/GetAllDeliveryFeesByArea/${storeId}`, {
      headers: authService.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data: DeliveryFeeByAreaResponse = await response.json();
    if (data.result.code !== 200) {
      throw new Error(data.result.message);
    }
    return data.data;
  } catch (error) {
    toast.error('Failed to load delivery fees by area');
    throw error;
  }
};

export const createDeliveryFeeByDistance = async (
  storeId: string,
  dto: DeliveryFeeByDistanceForCreateUpdateDto
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DeliveryFee/CreateDeliveryFeeByDistance/${storeId}`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    toast.error('Failed to create delivery fee by distance');
    throw error;
  }
};

export const createDeliveryFeeByMainArea = async (
  storeId: string,
  dto: DeliveryFeeByMainAreaForCreateUpdateDto
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DeliveryFee/CrateDeliveryFeeByMainArea/${storeId}`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    toast.error('Failed to create delivery fee by main area');
    throw error;
  }
};

export const createDeliveryFeeBySubArea = async (
  storeId: string,
  dto: DeliveryFeeBySubAreaForCreateUpdateDto
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DeliveryFee/CrateDeliveryFeeBySubArea/${storeId}`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    toast.error('Failed to create delivery fee by sub area');
    throw error;
  }
};

// Get delivery fee by area by ID
export const getDeliveryFeeByArea = async (storeId: string, id: number): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DeliveryFee/GetDeliveryFeesByArea/${storeId}/${id}`, {
      headers: authService.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Failed to load delivery fee by area');
    throw error;
  }
};

// Update delivery fee by area
export const updateDeliveryFeeByArea = async (
  storeId: string,
  dto: DeliveryFeeBySubAreaForUpdateDto
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DeliveryFee/UpdateDeliveryFeeByArea/${storeId}`, {
      method: 'PUT',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Failed to update delivery fee by area');
    throw error;
  }
};

// Delete delivery fee by area
export const deleteDeliveryFeeByArea = async (storeId: string, id: number): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DeliveryFee/DeleteDeliveryFeeByArea/${storeId}/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders()
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Failed to delete delivery fee by area');
    throw error;
  }
};

// Get delivery fee by distance by ID
export const getDeliveryFeeByDistance = async (storeId: string, id: number): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DeliveryFee/GetDeliveryFeesByDistance/${storeId}/${id}`, {
      headers: authService.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Failed to load delivery fee by distance');
    throw error;
  }
};

// Update delivery fee by distance
export const updateDeliveryFeeByDistance = async (
  storeId: string,
  dto: DeliveryFeeByDistanceForUpdateDto
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DeliveryFee/UpdateDeliveryFeeByDistance/${storeId}`, {
      method: 'PUT',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Failed to update delivery fee by distance');
    throw error;
  }
};

// Delete delivery fee by distance
export const deleteDeliveryFeeByDistance = async (storeId: string, id: number): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/DeliveryFee/DeleteDeliveryFeeByDistance/${storeId}/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders()
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Failed to delete delivery fee by distance');
    throw error;
  }
};


