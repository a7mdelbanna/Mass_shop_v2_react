import { toast } from 'sonner';
import { API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';
import { Offer, OfferValidIdResponse, ItemOfferForCreateUpdateDto, OfferImageUploadResponse, OfferListResponse, OfferResponse, ItemOfferDetailsForCreateUpdateByCompanyDto, ItemOfferDetailsForCreateUpdateByCategoryDto } from '@/types/offer';
import { ItemOfferDetails, ItemOfferDetailsForCreateUpdateDto, ItemOfferDetailsResponse, ItemOfferDetailsListResponse } from '@/types/offer';
export const createItemOfferDetailsByCompany = async (storeId: string, dto: ItemOfferDetailsForCreateUpdateByCompanyDto) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemOfferDetails/CreateItemOfferDetailsByCompany/${storeId}`,
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

export const createItemOfferDetailsByCategory = async (storeId: string, dto: ItemOfferDetailsForCreateUpdateByCategoryDto) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemOfferDetails/CreateItemOfferDetailsByCategory/${storeId}`,
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

export const getValidOfferId = async (): Promise<OfferValidIdResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemOffer/GetValidId/1/valid-id`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to get valid offer ID');
    throw error;
  }
};

export const createOffer = async (dto: ItemOfferForCreateUpdateDto): Promise<OfferResponse> => {
  try {
    const validId = await getValidOfferId();
    const offerWithId = { ...dto, id: validId };
    const response = await fetch(`${API_BASE_URL}/ItemOffer/CreateItemOffer/1`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(offerWithId),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to create offer');
    throw error;
  }
};

export const uploadOfferImage = async (storeId: string, dto: FormData): Promise<OfferImageUploadResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemOffer/UploadImageForItemOffer/1/upload-image`, {
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
    toast.error('Failed to upload offer image');
    throw error;
  }
};

export const updateOffer = async (dto: ItemOfferForCreateUpdateDto): Promise<OfferResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemOffer/UpdateItemOffer/1`, {
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
    toast.error('Failed to update offer');
    throw error;
  }
};

export const deleteOffer = async (id: number): Promise<OfferResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemOffer/DeleteItemOffer/1/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to delete offer');
    throw error;
  }
};

export const getAllOffers = async (): Promise<OfferListResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemOffer/GetAllItemOffers/1`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to fetch offers');
    throw error;
  }
};

export const getOfferById = async (id: number): Promise<OfferResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemOffer/GetItemOfferById/1/${id}`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to fetch offer details');
    throw error;
  }
};

export const createItemOfferDetails = async (storeId: string, dto: ItemOfferDetailsForCreateUpdateDto): Promise<ItemOfferDetailsResponse> => {
  try {
    const validId = await getValidItemOfferDetailsId();
    console.log(validId);
    const offerWithId = { ...dto, id: validId };
    const response = await fetch(`${API_BASE_URL}/ItemOfferDetails/CreateItemOfferDetails/1`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(offerWithId),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to create item offer details');
    throw error;
  }
};

export const updateItemOfferDetails = async (storeId: string, dto: ItemOfferDetailsForCreateUpdateDto): Promise<ItemOfferDetailsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemOfferDetails/UpdateItemOfferDetails/1`, {
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
    toast.error('Failed to update item offer details');
    throw error;
  }
};

export const deleteItemOfferDetails = async (storeId: string, id: number): Promise<ItemOfferDetailsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemOfferDetails/DeleteItemOfferDetails/1/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to delete item offer details');
    throw error;
  }
};

export const getAllItemOfferDetails = async (storeId: string): Promise<ItemOfferDetailsListResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemOfferDetails?storeId=${storeId}`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to fetch item offer details');
    throw error;
  }
};

export const getItemOfferDetailsById = async (storeId: string, id: number): Promise<ItemOfferDetailsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemOfferDetails/${id}?storeId=${storeId}`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to fetch item offer details by id');
    throw error;
  }
};

export const getAllItemOfferDetailsByOfferId = async (offerId: number): Promise<ItemOfferDetailsListResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Offer/GetAllItemOffersDetailsByOfferId/1/${offerId}`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to fetch item offer details by offer id');
    throw error;
  }
};

export const getValidItemOfferDetailsId = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ItemOfferDetails/GetValidId/1/valid-id`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to get valid item offer details id');
    throw error;
  }
};

/**
 * Fetches offer details and its items by offer ID.
 */
export const getOfferDetailsWithItems = async (offerId: number) => {
    // Fetch offer details
    const offerRes = await getOfferById(offerId);
    // Fetch offer items
   //const itemsRes = await getAllItemOfferDetailsByOfferId('1', offerId);
    return {
      offer: offerRes.data,
      //items: itemsRes.data || [],
    };
  }
export const getOfferItems = async (offerId: number) => {
   const itemsRes = await getAllItemOfferDetailsByOfferId(offerId);
    return {
      items: itemsRes.data || [],
    };
};

