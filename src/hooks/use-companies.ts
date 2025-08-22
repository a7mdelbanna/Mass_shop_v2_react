import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { fetchCompanies } from '@/services/company-service'; // Adjust path as needed

interface Option {
  id: number;
  name: string;
}

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const result = await fetchCompanies();
        setCompanies(result.map(c => ({ id: c.id, name: c.name })));
      } catch (error) {
        console.error('Failed to fetch companies:', error);
        toast.error('Failed to load companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return { companies, loading };
};
