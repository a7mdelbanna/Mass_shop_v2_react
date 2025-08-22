// components/CategoryMultiSelect.tsx
import * as React from "react";

interface CategoryOption {
  value: number;
  label: string;
}

interface Props {
  value: number[];
  onChange: (value: number[]) => void;
  options: CategoryOption[];
}

const CategoryMultiSelect: React.FC<Props> = ({ value, onChange, options }) => {
  const toggleValue = (id: number) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="flex flex-col gap-2 border rounded-lg p-3">
      {options.map(option => (
        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={value.includes(option.value)}
            onChange={() => toggleValue(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default CategoryMultiSelect;
