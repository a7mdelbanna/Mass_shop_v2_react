import { toast } from 'sonner';
import { Company, CompanyResponse, SingleCompanyResponse } from '@/types/company';
import { API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';
import { FormValues } from '@/components/companies/CompanyFields';

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

export const fetchCompanies = async (): Promise<Company[]> => {
  try {
    console.log('[CompanyService] Fetching companies...');
    const response = await fetch(`${API_BASE_URL}/Company/GetAllCompanies/1`, {
      headers: authService.getAuthHeaders(),
    });

    const data: CompanyResponse = await checkResponse(response);
    return data.data;
  } catch (error) {
    console.error('[CompanyService] Error fetching companies:', error);
    toast.error('Failed to load companies');
    throw error;
  }
};

export const getCompanyById = async (id: number): Promise<Company> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Company/GetCompanyById/1/${id}`, {
      headers: authService.getAuthHeaders(),
    });
    const data = await checkResponse(response);
    return data.data;
  } catch (error) {
    console.error('[CompanyService] Error fetching company:', error);
    toast.error('Failed to load company');
    throw error;
  }
};

export const getValidCompanyId = async (): Promise<number> => {
  try {
    console.log('[CompanyService] Getting valid ID for company');
    const response = await fetch(`${API_BASE_URL}/Company/GetValidId/1`, {
      headers: authService.getAuthHeaders(),
    });

    const data = await checkResponse(response);
    console.log('[CompanyService] Got valid ID:', data);
    return data;
  } catch (error) {
    console.error('[CompanyService] Error getting valid ID:', error);
    toast.error('Failed to get valid ID for new company');
    throw error;
  }
};

export const createCompany = async (company: FormValues): Promise<SingleCompanyResponse> => {
  try {
    const validId = await getValidCompanyId();
    console.log('[CompanyService] Creating company with ID:', validId);

    const companyWithId = { ...company, id: validId };
    const response = await fetch(`${API_BASE_URL}/Company/CreateCompany/1`, {
      method: 'POST',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyWithId),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ItemUnitService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data: SingleCompanyResponse = await response.json();
    return data;
  } catch (error) {
    console.error('[CompanyService] Error creating company:', error);
    toast.error('Failed to create company');
    throw error;
  }
};

export const updateCompany = async (id: number, company: FormValues): Promise<SingleCompanyResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Company/UpdateCompany/1`, {
      method: 'PUT',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...company, id }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ItemUnitService] API error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    const data: SingleCompanyResponse = await response.json();
    return data;
  } catch (error) {
    console.error('[CompanyService] Error updating company:', error);
    toast.error('Failed to update company');
    throw error;
  }
};

export const uploadCompanyImage = async (
  storeId: string,
  formData: FormData
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Company/UploadImageForCompany/${storeId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authService.getToken()}`
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('[CompanyService] Error uploading company image:', error);
    toast.error('Failed to upload company image');
    throw error;
  }
};

export const uploadCompanyBannerImages = async (
  storeId: string,
  formData: FormData
): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Company/UploadImageForCompanyBanner/${storeId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authService.getToken()}`
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('[CompanyService] Error uploading company banner images:', error);
    toast.error('Failed to upload company banner images');
    throw error;
  }
};


export const deleteCompany = async (id: number): Promise<void> => {
  try {
    console.log('[CompanyService] Deleting company:', id);
    const response = await fetch(`${API_BASE_URL}/Company/DeleteCompany/1/${id}`, {
      method: 'DELETE',
      headers: {
        ...authService.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });

    const data = await checkResponse(response);
    console.log('[CompanyService] Delete response:', data);
  } catch (error) {
    console.error('[CompanyService] Error deleting company:', error);
    toast.error('Failed to delete company');
    throw error;
  }
};
