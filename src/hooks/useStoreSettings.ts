import { useEffect, useState } from 'react';
import { StoreSettings } from '@/types/store-settings';
import { storeSettingsService } from '@/services/store-settings-service';

export const useStoreSettings = () => {
    const [settings, setSettings] = useState<StoreSettings | null>(null);
  
    useEffect(() => {
      storeSettingsService.getSettings()
        .then((res) => setSettings(res))
        .catch((err) => {
          console.error('Failed to load settings', err);
          setSettings(null); 
        });
    }, []);
  
    return { settings };
  };