import { toast } from 'sonner';
import { API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';
import { ItemSpotlightAllForCreateUpdateDto, ItemSpotlightDetailsForCreateUpdateByCategoryDto, ItemSpotlightDetailsForCreateUpdateByCompanyDto, ItemSpotlightDetailsForCreateUpdateDto } from '@/types/spotlight';
export const createItemSpotlightDetailsByCompany = async (storeId: string, dto: ItemSpotlightDetailsForCreateUpdateByCompanyDto) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemSpotlightDetails/CreateItemSpotlightDetailsByCompany/${storeId}`,
      {
        method: 'POST',
        headers: {
          ...authService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to create spotlight details by company');
    throw error;
  }
};

export const createItemSpotlightDetailsByCategory = async (storeId: string, dto: ItemSpotlightDetailsForCreateUpdateByCategoryDto) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemSpotlightDetails/CreateItemSpotlightDetailsByCategory/${storeId}`,
      {
        method: 'POST',
        headers: {
          ...authService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to create spotlight details by category');
    throw error;
  }
};

export const createItemSpotlightAll = async (dto: ItemSpotlightAllForCreateUpdateDto) => {
  try {
    const validId = await getValidSpotlightAllId();
    const spotlightWithId = { ...dto, id: validId };

    const response = await fetch(`${API_BASE_URL}/ItemSpotlightAll/CreateItemSpotlightAll/1`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(spotlightWithId),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to create spotlight');
    throw error;
  }
};

export const updateItemSpotlightAll = async (dto: ItemSpotlightAllForCreateUpdateDto) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemSpotlightAll/UpdateItemSpotlightAll/1`, {
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
    return await response.json();
  } catch (error) {
    toast.error('Failed to update spotlight');
    throw error;
  }
};



// --- ItemSpotlightAll CRUD ---
export const getValidSpotlightAllId = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemSpotlightAll/GetValidId/1`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to get valid spotlight id');
    throw error;
  }
};

export const getAllItemSpotlightAll = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemSpotlightAll/GetAllItemSpotlightAll/1`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to fetch spotlights');
    throw error;
  }
};

export const getItemSpotlightAllById = async (spotlightAllId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemSpotlightAll/GetItemSpotlightAllById/1/${spotlightAllId}`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to fetch spotlight by id');
    throw error;
  }
};

export const deleteItemSpotlightAll = async (spotlightAllId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemSpotlightAll/DeleteItemSpotlightAll/1/${spotlightAllId}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to delete spotlight');
    throw error;
  }
};

export const uploadSpotlightImage = async (dto: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemSpotlightAll/UploadImageForItemSpotlight/1`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authService.getToken()}`
      },
      body: dto,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to upload spotlight image');
    throw error;
  }
};


export const getValidSpotlightDetailsId = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemSpotlightAll/GetValidId/1`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to get valid spotlight id');
    throw error;
  }
};

// --- ItemSpotlightDetails CRUD ---
export const createItemSpotlightDetail = async (dto: ItemSpotlightDetailsForCreateUpdateDto) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemSpotlightDetails/CreateItemSpotlightDetail/1`, {
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
    return await response.json();
  } catch (error) {
    toast.error('Failed to create spotlight detail');
    throw error;
  }
};

export const updateItemSpotlightDetail = async (dto: ItemSpotlightDetailsForCreateUpdateDto) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemSpotlightDetails/UpdateItemSpotlightDetail/1`, {
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
    return await response.json();
  } catch (error) {
    toast.error('Failed to update spotlight detail');
    throw error;
  }
};

export const deleteItemSpotlightDetail = async (spotlightAllId: number, itemId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemSpotlightDetails/DeleteItemSpotlightDetail/1/${spotlightAllId}/${itemId}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to delete spotlight detail');
    throw error;
  }
};

export const getAllItemSpotlightDetails = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemSpotlightDetails/GetAllItemSpotlightDetails/1`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to fetch spotlight details');
    throw error;
  }
};

export const getItemSpotlightDetailsByItemId = async (itemId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemSpotlightDetails/GetItemSpotlightDetailsByItemId/1/${itemId}`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to fetch spotlight details by item id');
    throw error;
  }
};

export const getItemSpotlightDetailsBySpotlightAllId = async (spotlightAllId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Offer/GetItemsSpotlightDetailsBySpotlightAllId/1/${spotlightAllId}`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to fetch spotlight details by spotlightAllId');
    throw error;
  }
};

