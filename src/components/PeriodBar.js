import {
    Box,
    Typography,
    useTheme,
} from '@mui/material';
import * as muiColors from '@mui/material/colors';

/**
 * 凡高时期数据，包含年份、代表色和宽度比例。
 * colorCode 用于代表该时期的艺术特点色。
 * widthRatio 用于控制色块占据总宽度的比例。
 */
const periodNodes = [
    { label: "早期", subtitle: "(- 1878年)", value: "Early", colorCode: "brown", widthRatio: 5 },
    { label: "埃滕", subtitle: "(1881年)", value: "Etten", colorCode: "blueGrey", widthRatio: 10 },
    { label: "德伦特省", subtitle: "(1883年)", value: "Drenthe", colorCode: "deepOrange", widthRatio: 5 },
    { label: "海牙", subtitle: "(1881年 - 83年)", value: "Hague", colorCode: "lightBlue", widthRatio: 10 },
    { label: "纽南", subtitle: "(1883年 - 85年)", value: "Nuenen", colorCode: "lime", widthRatio: 10 },
    { label: "比利时", subtitle: "(1886年)", value: "Brussels", colorCode: "grey", widthRatio: 5 },
    { label: "巴黎", subtitle: "(1885年 - 88年)", value: "Paris", colorCode: "purple", widthRatio: 15 },
    { label: "阿尔勒", subtitle: "(1888年 - 89年)", value: "Arles", colorCode: "yellow", widthRatio: 15 },
    { label: "圣雷米", subtitle: "(1889年 - 90年)", value: "Saint-Rémy", colorCode: "indigo", widthRatio: 15 },
    { label: "奥维尔", subtitle: "(1890年5月-7月)", value: "Auvers", colorCode: "green", widthRatio: 10 },
];
const totalRatio = periodNodes.reduce((sum, node) => sum + node.widthRatio, 0);

const getColorValue = (code) => {
    const color = muiColors[code];
    // 优先使用 500 深度，如果没有（如黄色的 A 系列），则回退到 400 或灰色
    return color ? (color[500] || color.A700 || color[400]) : muiColors.grey[500];
};

export default function PeriodTimelineFilter({ selectedValue, onSelectionChange }) {
    const theme = useTheme();
   const handleToggle = (value) => {
        // 如果当前点击的值和已选中的值相同，则取消选中（设为 null），否则设为新值。
        const newValue = selectedValue === value ? null : value; 
        
        console.log(newValue);
        onSelectionChange(newValue); // <-- 回调函数名称已更改
    };


    return (

        <Box
            sx={{
                display: 'flex',
                width: '100%',
                overflow: 'hidden',
                flexWrap: 'nowrap',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '4px',
                boxSizing: 'border-box',
            }}
        >
            {periodNodes.map((node, index) => {
                const isSelected = node.value==selectedValue
                const nodeColor = getColorValue(node.colorCode);
                const calculatedWidth = `${(node.widthRatio / totalRatio) * 100}%`;

                return (
                    <Box
                        key={node.value}
                        onClick={() => handleToggle(node.value)}
                        title={node.subtitle}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px 5px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            minHeight: '20px',
                            boxSizing: 'border-box',//边框宽度计算在内
                            flex: `0 0 ${calculatedWidth}`, // 不伸展，不收缩，宽度固定为计算值
                            width: calculatedWidth,

                            backgroundColor: isSelected
                                ? nodeColor
                                : muiColors.grey[50],

                            borderRight: index < periodNodes.length - 1
                                ? `1px solid ${theme.palette.divider}`
                                : 'none',
                            // 悬停放大
                            '&:hover': {
                                // transform: 'scale(1.05)',
                                zIndex: 2,
                                ...(!isSelected && {
                                    backgroundColor: `${nodeColor}80`, //大约80%透明
                                })
                            }
                        }}
                    >
                        <Typography
                            variant="body2"

                            sx={{
                                fontWeight: 'bold',
                                //选中时文字为对比色
                                color: isSelected ? theme.palette.getContrastText(nodeColor) : theme.palette.text.primary,
                                overflow: 'hidden',
                                textAlign: 'center'
                            }}
                        >
                            {node.label}
                        </Typography>
                    </Box>
                );
            })}
        </Box >
    );
}