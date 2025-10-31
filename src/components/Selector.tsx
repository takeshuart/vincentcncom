import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Input, SelectChangeEvent } from '@mui/material';

interface FilterSelectItem {
  [key: string]: any; // 支持任意字段
  count?: number; // 可选的计数属性
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  items: FilterSelectItem[];
  itemValueKey: string;
  itemLabelKey: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  onChange,
  items,
  itemValueKey,
  itemLabelKey
}) => {
  return (
    <FormControl fullWidth variant="standard" size="small" sx={{ mt: 1 }}>
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-label`}
        value={value}
        onChange={onChange}
        input={<Input />}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
            },
          },
        }}
      >
        <MenuItem value="">所有{label}</MenuItem>
        {Array.isArray(items) &&
          items.map((item) => (
            <MenuItem key={item[itemValueKey]} value={item[itemValueKey]}>
              {item[itemLabelKey]}
              {item.count !== undefined && ` (${item.count})`}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};
