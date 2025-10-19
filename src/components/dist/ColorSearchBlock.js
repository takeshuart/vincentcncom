"use strict";
exports.__esModule = true;
exports.ColorSearchBar = void 0;
var react_1 = require("react");
var material_1 = require("@mui/material");
// 梵高调色板（根据你提供的RGB分析结果）
var COLOR_BLOCKS = [
    { name: '向日葵黄', color: '#D2B45A' },
    { name: '普罗旺斯米白', color: '#E1CDAF' },
    { name: '橄榄绿', color: '#78874B' },
    { name: '麦田赭橙', color: '#B48C5A' },
    { name: '铁锈红', color: '#A06E46' },
    { name: '天空石蓝', color: '#6E82A0' },
    { name: '灰褐中调', color: '#827864' },
];
exports.ColorSearchBar = function (_a) {
    var onColorSelect = _a.onColorSelect, _b = _a.initialColor, initialColor = _b === void 0 ? COLOR_BLOCKS[0].color : _b;
    var _c = react_1.useState(initialColor), selectedColor = _c[0], setSelectedColor = _c[1];
    var handleSelect = function (color) {
        setSelectedColor(color);
        onColorSelect(color);
    };
    return (react_1["default"].createElement(material_1.Box, { sx: { width: '100%', my: 2 } },
        react_1["default"].createElement(material_1.Box, { sx: {
                display: 'flex',
                height: 40,
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid #ccc'
            } }, COLOR_BLOCKS.map(function (block) { return (react_1["default"].createElement(material_1.Box, { key: block.color, onClick: function () { return handleSelect(block.color); }, title: block.name, sx: {
                flex: 1,
                backgroundColor: block.color,
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                border: selectedColor === block.color
                    ? '2px solid white'
                    : '2px solid transparent',
                boxShadow: selectedColor === block.color
                    ? '0 0 6px rgba(0,0,0,0.5)'
                    : 'none',
                '&:hover': {
                    transform: 'scale(1.05)',
                    zIndex: 1
                }
            } })); }))));
};
exports["default"] = exports.ColorSearchBar;
