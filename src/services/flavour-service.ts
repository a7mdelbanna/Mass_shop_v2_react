import { API_BASE_URL } from '@/config/api';
import { authService } from '@/services/auth-service';

export interface Flavour {
  id: number;
  nameEN: string;
  nameAR?: string;
  flavourImage?: string;
  flavourImageURL?: string;
  flavourImageFileLength?: number;
}

export const getAllFlavours = async (): Promise<Flavour[]> => {
  const res = await fetch(`${API_BASE_URL}/ItemFlavour/GetAllFlavours/1`, {
    headers: authService.getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch flavours');
      const data = await res.json();
  
  return await data.data;
};

export const createFlavour = async (dto: { nameEN: string; nameAR?: string }): Promise<Flavour> => {
  const res = await fetch(`${API_BASE_URL}/ItemFlavour/CreateFlavour/1`, {
    method: 'POST',
    headers: {
      ...authService.getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('Failed to create flavour');
      const data = await res.json();

  return  data.data;
};