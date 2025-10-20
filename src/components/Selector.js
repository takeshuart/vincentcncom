import { FormControl, InputLabel, Select, MenuItem, Input } from '@mui/material';

/**
 * Universal dropdown selection component
 * * @param {string} label - label ("subjects", "Period"..)
 * @param {string} value - selected value
 * @param {function} onChange - 
 * @param {string} itemValueKey
 * @param {string} itemLabelKey -
 */
export const FilterSelect = ({
    label,
    value,
    onChange,
    items,
    itemValueKey,
    itemLabelKey
}) => {
    return (
        <FormControl fullWidth variant='standard' size='small' sx={{ mt: 1 }}>
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
                        }
                    }
                }}
            >
                <MenuItem value="">所有{label}</MenuItem>

                {Array.isArray(items) && items.map((item) => (
                    <MenuItem
                        key={item[itemValueKey]}
                        value={item[itemValueKey]}
                    >
                        {item[itemLabelKey]}
                        {item.count !== undefined && ` (${item.count})`}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};