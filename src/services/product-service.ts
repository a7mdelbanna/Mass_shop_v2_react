import { toast } from 'sonner';
import { FullProduct, RetailProduct, WholeSaleProduct, SingleProductResponse, ProductResponse, UploadImageResponse, PaginatedProductResponse } from '@/types/product';
import { API_BASE_URL, Public_API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';

export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  itemName?: string;
  tagName?: string;
  description?: string;
  sku?: string;
  searchTerm?: string;
  itemCategoryId?: number;
  mainGroupId?: number;
  companyId?: number;
  minAvailableAmount?: number;
  maxAvailableAmount?: number;
  isSoldByWeight?: boolean;
  isSellByCustomValue?: boolean;
}

export const fetchProducts = async (params: ProductQueryParams = {}): Promise<PaginatedProductResponse> => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.append('PageNumber', params.page.toString());
    if (params.pageSize) query.append('PageSize', params.pageSize.toString());
    if (params.itemName) query.append('ItemName', params.itemName);
    if (params.tagName) query.append('TagName', params.tagName);
    if (params.description) query.append('Description', params.description);
    if (params.sku) query.append('SKU', params.sku);
    if (params.searchTerm) query.append('SearchTerm', params.searchTerm);
    if (params.itemCategoryId) query.append('ItemCategoryId', params.itemCategoryId.toString());
    if (params.mainGroupId) query.append('MainGroupId', params.mainGroupId.toString());
    if (params.companyId) query.append('CompanyId', params.companyId.toString());
    if (params.minAvailableAmount) query.append('MinAvailableAmount', params.minAvailableAmount.toString());
    if (params.maxAvailableAmount) query.append('MaxAvailableAmount', params.maxAvailableAmount.toString());
    if (params.isSoldByWeight !== undefined) query.append('IsSoldByWeight', String(params.isSoldByWeight));
    if (params.isSellByCustomValue !== undefined) query.append('IsSellByCustomValue', String(params.isSellByCustomValue));

    const url = `${API_BASE_URL}/Item/GetAllItems/1${query.toString() ? '?' + query.toString() : ''}`;
    console.log('Fetching products from URL:', url);
    
    const response = await fetch(url, {
      headers: authService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ProductService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data: PaginatedProductResponse = await response.json();
    console.log('Products API response:', data);
    
    if (data.result && data.result.code !== 200) {
      throw new Error(data.result.message || 'API returned error');
    }

    return data;
  } catch (error) {
    console.error('[ProductService] Error fetching products:', error);
    toast.error('Failed to load products');
    throw error;
  }
};

// New method for fetching items with simplified search parameters for offers
export const fetchItemsForOffers = async (params: { 
  term?: string; 
  categoryId?: number; 
  companyId?: number; 
}): Promise<FullProduct[]> => {
  try {
    const query = new URLSearchParams();
    if (params.term) query.append('term', params.term);
    if (params.categoryId) query.append('categoryId', params.categoryId.toString());
    if (params.companyId) query.append('companyId', params.companyId.toString());

    const url = `${Public_API_BASE_URL}/Item/GetAllItems/1${query.toString() ? '?' + query.toString() : ''}`;
    console.log('Fetching items for offers from URL:', url);
    
    const response = await fetch(url, {
      headers: authService.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ProductService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Items for offers API response:', data);
    
    if (data.result && data.result.code !== 200) {
      throw new Error(data.result.message || 'API returned error');
    }

    return data.data || data || [];
  } catch (error) {
    console.error('[ProductService] Error fetching items for offers:', error);
    toast.error('Failed to load items');
    throw error;
  }
};


export const getProductById = async (id: number): Promise<FullProduct> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Item/GetItemById/1/${id}`, {
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

    return data.data;
  } catch (error) {
    console.error('[CompanyService] Error fetching company:', error);
    toast.error('Failed to load company');
    throw error;
  }
};


export const getValidProductId = async (): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Item/GetValidId/1`, {
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

export const createRetailProduct = async (retailProduct: RetailProduct): Promise<FullProduct> => {
  try {
    const validId = await getValidProductId();
    console.log('[CompanyService] Creating company with ID:', validId);

    const productWithId = { ...retailProduct, id: validId };
    const response = await fetch(`${API_BASE_URL}/Item/CreateItem/1`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productWithId),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ItemUnitService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data: SingleProductResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('[CompanyService] Error creating company:', error);
    toast.error('Failed to create company');
    throw error;
  }
};

export const createWholeSaleProduct = async (wholeSaleProduct: WholeSaleProduct): Promise<SingleProductResponse> => {
  try {
    const validId = await getValidProductId();
    console.log('[CompanyService] Creating company with ID:', validId);

    const { id, ...rest } = wholeSaleProduct;
    const cleanedProduct = Object.fromEntries(Object.entries(rest).filter(([_, v]) => v !== null && v !== undefined));
    const productWithId = { ...cleanedProduct, id: validId };
    console.log('Sending payload:', JSON.stringify(productWithId));

    const response = await fetch(`${API_BASE_URL}/Item/CreateItemForWholeSale/1`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productWithId),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ItemUnitService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data: SingleProductResponse = await response.json();
    return data;
  } catch (error) {
    console.error('[CompanyService] Error creating company:', error);
    toast.error('Failed to create company');
    throw error;
  }
};

export const uploadProductImage = async (dto: { itemId: number; image: File }) => {
  const formData = new FormData();
  formData.append("ItemId", dto.itemId.toString());
  formData.append("Image", dto.image);

  const response = await fetch(`${API_BASE_URL}/Item/UploadImageForItem/1`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authService.getToken()}`
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${errorText}`);
  }
  const data: UploadImageResponse = await response.json();
  console.log(data);
  return data.data;
};

export const updateRetailProduct = async (id: number, retailProduct: RetailProduct): Promise<FullProduct> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Item/UpdateItem/1`, {
      method: 'PUT',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...retailProduct, id }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ItemUnitService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data: SingleProductResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('[CompanyService] Error updating company:', error);
    toast.error('Failed to update company');
    throw error;
  }
};

export const updateWholeSaleProduct = async (id: number, wholeSaleProduct: WholeSaleProduct): Promise<SingleProductResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Item/UpdateItemForWholeSale/1`, {
      method: 'PUT',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...wholeSaleProduct, id }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ItemUnitService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data: SingleProductResponse = await response.json();
    return data;
  } catch (error) {
    console.error('[CompanyService] Error updating company:', error);
    toast.error('Failed to update company');
    throw error;
  }
};


export const deleteProduct = async (id: number): Promise<void> => {
  try {
    console.log('[CompanyService] Deleting company:', id);
    const response = await fetch(`${API_BASE_URL}/Item/DeleteItem/1/${id}`, {
      method: 'DELETE',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ItemUnitService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data: SingleProductResponse = await response.json();
    console.log('[CompanyService] Delete response:', data);
  } catch (error) {
    console.error('[CompanyService] Error deleting company:', error);
    toast.error('Failed to delete company');
    throw error;
  }
};

export const addTagsToItem = async (storeId: string, dto: { itemId: number; tagIds: number[] }): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Tag/AddTagsToItem/${storeId}`, {
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
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Failed to add tags to item');
    throw error;
  }
};

export const addNoticesToItem = async (storeId: string, dto: { itemId: number; noticeIds: number[] }): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Notice/AddNoticesToItem/${storeId}`, {
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
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Failed to add notices to item');
    throw error;
  }
};

// Bulk import products from Excel
export const importProductsFromExcel = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('File', file);
    const response = await fetch('http://modytest-002-site3.atempurl.com/RetailAPI/Admin/File/ImportExcel/1', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authService.getToken()}`
      },
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Excel import failed: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to import products from Excel');
    throw error;
  }
};
