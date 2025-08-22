import { toast } from 'sonner';
import { FullProduct, RetailProduct, WholeSaleProduct, SingleProductResponse, ProductResponse, UploadImageResponse } from '@/types/product';
import { API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';
import { GetAllOrdersResponse, Order, PaginatedOrderResponse, OrderQueryParams } from '@/types/order';

// --- Types for DTOs (add more as needed) ---
export interface OrderForUpdateStatusDto {
  orderIds: number[];
  orderStatus: number;
}

export interface OrderItemCanNotShipDto {
  orderId: number;
  itemId: number;
  type: number; // 1 = AlternativeList, 2 = SameItemNewQuantity
  alternativeItemId?: number;
  newQuantity?: number;
}

export interface OrderForAssignToDeliveryBoyDto {
  orderIds: number[];
  deliveryBoyId: number;
}

// --- API Methods ---

export const getAllOrders = async (storeId: string): Promise<GetAllOrdersResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Order/GeAllOrders/${storeId}`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to load orders');
    throw error;
  }
};

export const getOrderDetails = async (storeId: string, orderId: number): Promise<Order> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Order/GetOrderDetails/${storeId}/${orderId}`, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    if (data.result && data.result.code !== 200) {
      throw new Error(data.result.message || 'API returned error');
    }
    return data.data;
  } catch (error) {
    toast.error('Failed to load order details');
    throw error;
  }
};

export const acceptOrder = async (storeId: string, orderId: number) => {
  const response = await fetch(`http://modytest-002-site3.atempurl.com/RetailAPI/Admin/Order/AcceptOrder/${storeId}/${orderId}`, {
    method: 'PUT',
    headers: authService.getAuthHeaders(),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Accept order failed: ${errorText}`);
  }
  return await response.json();
};

export const rejectOrder = async (storeId: string, orderId: number) => {
  const response = await fetch(`http://modytest-002-site3.atempurl.com/RetailAPI/Admin/Order/RejectOrder/${storeId}/${orderId}`, {
    method: 'PUT',
    headers: authService.getAuthHeaders(),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Reject order failed: ${errorText}`);
  }
  return await response.json();
};

export const updateOrdersStatus = async (storeId: string, dto: OrderForUpdateStatusDto) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Order/UpdateOrdersStatus/${storeId}`, {
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
    toast.error('Failed to update order status');
    throw error;
  }
};

export const markReplacementRequest = async (storeId: string, dto: OrderItemCanNotShipDto[]) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Order/MarkReplacementRequest/${storeId}`, {
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
    toast.error('Failed to mark replacement request');
    throw error;
  }
};

export const assignOrdersToDeliveryBoy = async (storeId: string, dto: OrderForAssignToDeliveryBoyDto) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Order/AssignOrdersToDeliveryBoyManually/${storeId}`, {
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
    toast.error('Failed to assign order to delivery boy');
    throw error;
  }
};

export const autoAssignOrderToDeliveryBoy = async (storeId: string, orderId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Order/AutoAssignOrderToDeliveryBoy/${storeId}/${orderId}`, {
      method: 'PUT',
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to auto-assign order to delivery boy');
    throw error;
  }
};

export const getOrderRate = async (storeId: string, orderId: number) => {
  try {
      const response = await fetch(`${API_BASE_URL}/Order/GetOrderRate/${storeId}/${orderId}`, {   
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    toast.error('Failed to get order rate');
    throw error;
  }
};

export const updateOrderStatus = async (storeId: string, orderIds: number[], orderStatus: number) => {
  const response = await fetch(`http://modytest-002-site3.atempurl.com/RetailAPI/Admin/Order/UpdateOrdersStatus/${storeId}`, {
    method: 'PUT',
    headers: {
      ...authService.getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ orderIds, orderStatus }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Update order status failed: ${errorText}`);
  }
  return await response.json();
};

export const fetchOrders = async (storeId: string, params: OrderQueryParams = {}): Promise<PaginatedOrderResponse> => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.append('PageNumber', params.page.toString());
    if (params.pageSize) query.append('PageSize', params.pageSize.toString());
    if (params.searchTerm) query.append('SearchTerm', params.searchTerm);
    if (params.startDate) query.append('StartDate', params.startDate);
    if (params.endDate) query.append('EndDate', params.endDate);
    if (params.status) query.append('Status', params.status);
    if (params.customerId) query.append('CustomerId', params.customerId.toString());
    if (params.isHistory !== undefined) query.append('IsHistory', String(params.isHistory));
    if (params.isActive !== undefined) query.append('IsActive', String(params.isActive));
    const url = `${API_BASE_URL}/Order/GeAllOrders/${storeId}${query.toString() ? '?' + query.toString() : ''}`;
    const response = await fetch(url, {
      headers: authService.getAuthHeaders(),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data: PaginatedOrderResponse = await response.json();
    if (data.result && data.result.code !== 200) {
      throw new Error(data.result.message || 'API returned error');
    }
    return data;
  } catch (error) {
    toast.error('Failed to load orders');
    throw error;
  }
};
