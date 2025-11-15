"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_1 = require("react");
var material_1 = require("@mui/material");
var muiColors = require("@mui/material/colors");
var enum_1 = require("@/types/enum");
// -----------------------------------------------------------------
/**
 * 凡高时期数据，包含年份、代表色和宽度比例。
 */
var periodNodes = [
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
var totalRatio = periodNodes.reduce(function (sum, node) { return sum + node.widthRatio; }, 0);
/**
 * 根据颜色代码获取 MUI 颜色值。
 * @param code 颜色代码，如 'brown', 'yellow'
 * @returns 颜色字符串（如 '#795548'）
 */
var getColorValue = function (code) {
    // 强制类型转换为索引签名，以便 TypeScript 允许通过 string 访问 muiColors
    var colorModule = muiColors;
    var color = colorModule[code];
    // 优先使用 500 深度，如果没有（如黄色的 A 系列），则回退到 400 或灰色
    if (color) {
        // 使用可选链和逻辑或来安全获取颜色值
        return color[500] || color['A700'] || color[400] || muiColors.grey[500];
    }
    return muiColors.grey[500]; // 如果 code 无效，回退到默认灰色
};
// =================================================================
// 2. 组件定义
// =================================================================
function PeriodTimelineFilter(_a) {
    var selectedValue = _a.selectedValue, updateQueryFilter = _a.updateQueryFilter;
    var theme = material_1.useTheme();
    var handleToggle = function (value) {
        var newValue = selectedValue === value ? '' //cancel select 
            : value;
        updateQueryFilter(enum_1.QueryKeys.PERIOD, newValue);
    };
    return (react_1["default"].createElement(material_1.Box, { sx: {
            display: 'flex',
            width: '100%',
            overflow: {
                xs: 'auto',
                sm: 'hidden'
            },
            flexWrap: 'nowrap',
            border: "1px solid " + theme.palette.divider,
            borderRadius: '4px',
            boxSizing: 'border-box'
        } }, periodNodes.map(function (node, index) {
        var isSelected = node.value === selectedValue;
        // 明确 getColorValue 的参数类型
        var nodeColor = getColorValue(node.colorCode);
        var calculatedWidth = (node.widthRatio / totalRatio) * 100 + "%";
        return (react_1["default"].createElement(material_1.Box, { key: node.value, onClick: function () { return handleToggle(node.value); }, title: node.subtitle, sx: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                px: { xs: 2, md: 2 },
                py: { xs: '4px', md: 1 },
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                minHeight: '20px',
                boxSizing: 'border-box',
                // 使用 flex: none 配合 min-width/width 属性来处理移动端和桌面端宽度
                flex: {
                    xs: '0 0 auto',
                    sm: "0 0 " + calculatedWidth
                },
                minWidth: {
                    sm: 'auto'
                },
                backgroundColor: isSelected
                    ? nodeColor
                    : muiColors.grey[50],
                borderRight: index < periodNodes.length - 1
                    ? "1px solid " + theme.palette.divider
                    : 'none',
                '&:hover': __assign({ zIndex: 2 }, (!isSelected && {
                    // 尝试在 nodeColor 后添加 #AA（约 66% 透明度），假设 nodeColor 是 RGB 格式
                    // ⚠️ 注意: 这种简单的字符串拼接只适用于 #RRGGBB 或 #RGB 格式的颜色
                    backgroundColor: nodeColor + "AA"
                }))
            } },
            react_1["default"].createElement(material_1.Typography, { variant: "body2", sx: {
                    fontWeight: 'bold',
                    color: isSelected ? theme.palette.getContrastText(nodeColor) : theme.palette.text.primary,
                    overflow: 'hidden',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                } }, node.label)));
    })));
}
exports["default"] = PeriodTimelineFilter;
