import { toast } from 'sonner';
import { CreateCustomerDto, Customer, CustomerResponse } from '@/types/customer';
import { API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';

export const CustomerService = {
  getAll: async (page: number = 1, pageSize: number = 10): Promise<CustomerResponse> => {
    try {
      console.log('[CustomerService] Fetching Customers...');
      const response = await fetch(
        `${API_BASE_URL}/ApplicationUser/GetAllUsers/1?userType=3&page=${page}&pageSize=${pageSize}`,
        {
          headers: authService.getAuthHeaders()
        }
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data: CustomerResponse = await response.json();
      
      if (data.result?.code !== 200) {
        throw new Error(data.result?.message || 'Failed to fetch Customers');
      }
      
      return data;
    } catch (error) {
      console.error('[CustomersService] Error fetching Customers:', error);
      toast.error('Failed to load Customers');
      throw error;
    }
  },
  getAllShops: async (page: number = 1, pageSize: number = 10): Promise<CustomerResponse> => {
    try {
      console.log('[CustomerService] Fetching Customers...');
      const response = await fetch(
        `${API_BASE_URL}/ApplicationUser/GetAllUsers/1?userType=5&page=${page}&pageSize=${pageSize}`,
        {
          headers: authService.getAuthHeaders()
        }
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data: CustomerResponse = await response.json();
      
      if (data.result?.code !== 200) {
        throw new Error(data.result?.message || 'Failed to fetch Customers');
      }
      
      return data;
    } catch (error) {
      console.error('[CustomersService] Error fetching Customers:', error);
      toast.error('Failed to load Customers');
      throw error;
    }
  },  

  create: async (data: CreateCustomerDto): Promise<Customer> => {
    try {
      console.log('[CustomersService] Creating Customers...', data);
      const response = await fetch(`${API_BASE_URL}/ApplicationUser/CreateDeliveryBoy/1`, {
        method: 'POST',
        headers: {
          ...authService.getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const responseData = await response.json();
      console.log('[DeliveryBoyService] Create response:', responseData);

      // Check if the response indicates success
      if (responseData.result?.code === 200 || responseData.result?.code === 201) {
        toast.success('Delivery boy created successfully');
        return responseData.data;
      }

      // If we get here, the API returned an error
      throw new Error(responseData.result?.message || 'Failed to create delivery boy');
    } catch (error) {
      console.error('[DeliveryBoyService] Error creating delivery boy:', error);
      toast.error('Failed to create delivery boy');
      throw error;
    }
  },

  toggleStatus: async (id: string, isActive: boolean): Promise<void> => {
    try {
      console.log('[DeliveryBoyService] Toggling status for delivery boy:', id);
      const response = await fetch(`${API_BASE_URL}/ApplicationUser/ToggleUserStatus/1`, {
        method: 'PUT',
        headers: {
          ...authService.getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: id,
          isActive
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[DeliveryBoyService] API error response:', errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      if (data.result?.code !== 200) {
        throw new Error(data.result?.message || 'Failed to update delivery boy status');
      }
      
      toast.success('Delivery boy status updated successfully');
    } catch (error) {
      console.error('[DeliveryBoyService] Error updating delivery boy status:', error);
      toast.error('Failed to update delivery boy status');
      throw error;
    }
  }
}; 