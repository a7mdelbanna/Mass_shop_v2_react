import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { getAllFlavours, createFlavour, Flavour } from '@/services/flavour-service';
import { useTranslation } from 'react-i18next';

interface FlavourMultiSelectProps {
  value: Flavour[];
  onChange: (flavours: Flavour[]) => void;
}

const FlavourMultiSelect: React.FC<FlavourMultiSelectProps> = ({ value, onChange }) => {
  const [options, setOptions] = useState<Flavour[]>([]);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    setLoading(true);
    getAllFlavours()
      .then(setOptions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (inputValue: string) => {
    setLoading(true);
    try {
      const newFlavour = await createFlavour({ nameEN: inputValue , nameAR: inputValue  });
      setOptions((prev) => [...prev, newFlavour]);
      onChange([...value, newFlavour]);
    } catch {
      // handle error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  return (
    <CreatableSelect
      isMulti
      isLoading={loading}
      options={options.map(f => ({ value: f.id, label: isRTL?f.nameAR :  f.nameEN  }))}
      value={value.map(f => ({ value: f.id, label: isRTL?f.nameAR :  f.nameEN }))}
      onChange={(selected) => {
        const selectedFlavours = options.filter(opt => selected.some(sel => sel.value === opt.id));
        onChange(selectedFlavours);
      }}
      onCreateOption={handleCreate}
      placeholder= {t("Selectoraddflavours")}
    />
  );
};

export default FlavourMultiSelect;