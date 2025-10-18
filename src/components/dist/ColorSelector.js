"use strict";
exports.__esModule = true;
var react_1 = require("react");
var material_1 = require("@mui/material");
/**
 * 色彩筛选组件
 * @description 在左侧展示若干颜色圆环，点击可筛选作品
 */
var ColorSelector = function (_a) {
    var colors = _a.colors, onColorSelect = _a.onColorSelect, selectedColor = _a.selectedColor;
    return (react_1["default"].createElement(material_1.Box, { sx: { p: 2 } },
        react_1["default"].createElement(material_1.Typography, { variant: "subtitle1", sx: { mb: 2, fontWeight: 'bold', letterSpacing: '1px' } }, "\u6309\u8272\u5F69\u7B5B\u9009"),
        react_1["default"].createElement(material_1.Box, { sx: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                justifyContent: 'flex-start'
            } }, colors.map(function (color, idx) { return (react_1["default"].createElement(material_1.Box, { key: idx, onClick: function () { return onColorSelect(color); }, sx: {
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: color,
                border: selectedColor === color
                    ? '3px solid #333'
                    : '2px solid #fff',
                boxShadow: '0 0 4px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'scale(1.1)',
                    border: '2px solid #000'
                }
            } })); }))));
};
exports["default"] = ColorSelector;
