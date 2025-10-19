
import React, { useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material'; // 移除了 IconButton

// 梵高调色板（根据非素描作品RGB分析结果）
const VAN_GOGH_COLORS = [
    { name: '向日葵金黄', color: '#B39B4D' }, 
    { name: '星空深蓝', color: '#3A5573' }, 
    { name: '田园橄榄绿', color: '#647743' }, 
    { name: '焦土赭棕', color: '#765E2F' }, 
    { name: '画布米白', color: '#D7CCB0' }, 
    { name: '沉静蓝灰', color: '#7A888E' }, 
    { name: '暖色中调', color: '#A3A279' }, 
];

interface ColorSearchBarProps {
    onColorSelect: (colorValue: string) => void;
    initialColor?: string;
}

export const ColorSearchBar: React.FC<ColorSearchBarProps> = ({
    onColorSelect,
    initialColor = '', 
}) => {
    const [selectedColor, setSelectedColor] = useState<string>(initialColor);

    // 优化选择逻辑：支持二次点击取消和“全部”按钮
    const handleSelect = useCallback((color: string) => {
        // 如果点击的颜色就是当前选中的颜色，则取消选择（设置为 ''）
        const newColor = selectedColor === color ? '' : color;
        
        setSelectedColor(newColor);
        onColorSelect(newColor); // 通知父组件执行新查询
    }, [selectedColor, onColorSelect]);

    return (
        <Box sx={{ width: '100%', my: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'stretch', 
                    height: 30, 
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1px solid #ccc',
                }}
            >
                {/* ⭐️ 集成式“取消”/“全部”选项 */}
                <Box
                    onClick={() => handleSelect('')} // 点击时传递空字符串，清除筛选
                    title="取消颜色筛选，显示所有作品"
                    sx={{
                        minWidth: '60px', 
                        flexShrink: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 1, 
                        
                        // 统一使用更平滑的 transition
                        transition: 'all 0.25s ease-in-out', 
                        
                        // 选中时的样式：当 selectedColor 为空时
                        backgroundColor: selectedColor === '' ? '#777' : '#f5f5f5',
                        color: selectedColor === '' ? 'white' : '#555',
                        boxShadow: selectedColor === '' ? 'inset 0 0 5px rgba(0,0,0,0.3)' : 'none',
                        zIndex: 1,
                        fontWeight: selectedColor === '' ? 'bold' : 'normal',
                        
                        // 右侧分隔线
                        borderRight: '1px solid #ccc',
                        
                        // 悬停和选中状态下的放大效果
                        transform: selectedColor === '' ? 'scale(1.05)' : 'scale(1)',
                        '&:hover': {
                            backgroundColor: selectedColor === '' ? '#777' : '#e0e0e0', // Hover 效果
                            transform: 'scale(1.05)',
                            zIndex: 2,
                        }
                    }}
                >
                    <Typography 
                        variant="caption" 
                        sx={{ lineHeight: 1, fontSize: '0.8rem' }}
                    >
                        清除
                    </Typography>
                </Box>
                
                {/* 颜色色块映射 */}
                {VAN_GOGH_COLORS.map((block) => {
                    const isSelected = selectedColor === block.color;
                    return (
                        <Box
                            key={block.color}
                            onClick={() => handleSelect(block.color)}
                            title={`${block.name}${isSelected ? ' (已选中)' : ''}`}
                            sx={{
                                flex: 1, 
                                backgroundColor: block.color,
                                cursor: 'pointer',
                                // 统一使用更平滑的 transition
                                transition: 'all 0.25s ease-in-out', 
                                
                                // ⭐️ 选中时应用放大效果
                                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                                
                                // 保持白色描边和阴影（如果放大效果不足够，可以稍微增强阴影）
                                border: isSelected
                                    ? '2px solid white'
                                    : '2px solid transparent',
                                boxShadow: isSelected
                                    ? '0 0 8px rgba(0,0,0,0.7)' // 略微增强阴影让放大效果更明显
                                    : 'none',

                                // 确保选中元素在最上层
                                zIndex: isSelected ? 3 : 1, 
                                
                                '&:hover': {
                                    // 悬停时也应用放大效果
                                    transform: 'scale(1.1)', 
                                    zIndex: 2,
                                },
                            }}
                        />
                    );
                })}
            </Box>
        </Box>
    );
};
export default ColorSearchBar;
