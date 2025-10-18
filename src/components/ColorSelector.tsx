import React from 'react';
import { Box, Typography } from '@mui/material';

interface ColorSelectorProps {
  /** 可选颜色列表 */
  colors: string[];

  /** 点击颜色时触发的回调函数 */
  onColorSelect: (color: string) => void;

  /** 当前选中的颜色 */
  selectedColor?: string | null;
}

/**
 * 色彩筛选组件
 * @description 在左侧展示若干颜色圆环，点击可筛选作品
 */
const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  onColorSelect,
  selectedColor,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="subtitle1"
        sx={{ mb: 2, fontWeight: 'bold', letterSpacing: '1px' }}
      >
        按色彩筛选
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          justifyContent: 'flex-start',
        }}
      >
        {colors.map((color, idx) => (
          <Box
            key={idx}
            onClick={() => onColorSelect(color)}
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: color,
              border:
                selectedColor === color
                  ? '3px solid #333'
                  : '2px solid #fff',
              boxShadow: '0 0 4px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
                border: '2px solid #000',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ColorSelector;
