
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material'; // 移除了 IconButton
import { UpdateQueryFilterFn } from '@/hooks/useArtSearch';
import { QueryKeys } from '@/types/enum';

// 梵高调色板（根据非drawing作品RGB分析结果）
// displayColor: 前端展示亮度和饱和度更高的色彩
// searchColorRGB:  使用 K-Means 聚类，在感知均匀的 L^*a^*b^* 空间中，从868张图片的色彩数据中提取10个最具代表性的聚类中心（颜色）。

export const VAN_GOGH_PALETTE = [
    { id: 1, name: '湖水青蓝', displayColor: '#4A97A8', searchColorRGB: [102, 125, 131], scoreField: 'score_01' },
    { id: 2, name: '深空靛蓝', displayColor: '#4F6FA8', searchColorRGB: [107, 134, 172], scoreField: 'score_02' },
    { id: 3, name: '柔和米灰', displayColor: '#E5EAE8', searchColorRGB: [192, 206, 201], scoreField: 'score_03' },
    { id: 4, name: '清新薄荷绿', displayColor: '#B7D9A6', searchColorRGB: [170, 189, 161], scoreField: 'score_04' },
    { id: 5, name: '深沉橄榄', displayColor: '#7F8D44', searchColorRGB: [104, 114, 51], scoreField: 'score_05' },
    { id: 6, name: '古典棕绿', displayColor: '#8F754D', searchColorRGB: [100, 91, 59], scoreField: 'score_06' },
    { id: 7, name: '浓郁焦棕', displayColor: '#594E3F', searchColorRGB: [26, 23, 14], scoreField: 'score_07' },
    { id: 8, name: '暖调赤土', displayColor: '#C7906B', searchColorRGB: [174, 127, 95], scoreField: 'score_08' },
    { id: 9, name: '亮金赭石', displayColor: '#C79B48', searchColorRGB: [153, 124, 80], scoreField: 'score_09' },
    { id: 10, name: '向日葵亮黄', displayColor: '#F3D860', searchColorRGB: [217, 197, 103], scoreField: 'score_10' }
];

interface ColorSearchBarProps {
    updateQueryFilter: UpdateQueryFilterFn
    selectedColor?: string;
}

export const ColorSearchBar: React.FC<ColorSearchBarProps> = ({
    updateQueryFilter,
    selectedColor = '',
}) => {

    const handleSelect = (scoreField: string) => {
        if (selectedColor === scoreField) { //cancel select
            updateQueryFilter(QueryKeys.COLOR, ''); // change query
        } else {
            updateQueryFilter(QueryKeys.COLOR, scoreField);
        }
    };

    return (
        <Box sx={{ width: '100%', my: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'stretch',
                    // height: 30,
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1px solid #ccc',
                }}
            >

                {VAN_GOGH_PALETTE.map((color) => {
                    const isSelected = selectedColor === color.scoreField;
                    return (
                        <Box
                            key={color.displayColor}
                            onClick={() => handleSelect(color.scoreField)}
                            title={`${color.name}${isSelected ? ' (已选中)' : ''}`}
                            sx={{
                                py: { xs: '10px', md: 2 },
                                flex: 1,
                                backgroundColor: color.displayColor,
                                cursor: 'pointer',
                                // 统一使用更平滑的 transition
                                transition: 'all 0.25s ease-in-out',

                                // 选中时放大
                                transform: isSelected ? 'scale(1.1)' : 'scale(1)',

                                // 保持白色描边和阴影
                                border: isSelected
                                    ? '3px solid white'
                                    : '2px solid transparent',
                                boxShadow: isSelected
                                    ? '0 0 10px rgba(0,0,0,0.7)' // 略微增强阴影让放大效果更明显
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
